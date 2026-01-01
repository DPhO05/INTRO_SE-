using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChungCu.API.Entities;
using System.Security.Claims;

namespace QuanLyChungCu.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserDashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UserDashboardController(AppDbContext context)
        {
            _context = context;
        }

        // API duy nhất: Lấy toàn bộ dữ liệu cho Dashboard
        [HttpGet]
        [Authorize] // Bắt buộc phải có Token
        public async Task<IActionResult> GetDashboardData()
        {
            try
            {
                // --- BƯỚC 1: LẤY MA_HO_KHAU TỪ TOKEN ---
                // Code AuthController trước đó đã lưu claim "MaHoKhau" vào token
                var maHoKhau = User.FindFirst("MaHoKhau")?.Value;
                var username = User.FindFirst(ClaimTypes.Name)?.Value;

                Console.WriteLine($"[DEBUG] User đang gọi API: {username} - MaHoKhau: {maHoKhau}");

                if (string.IsNullOrEmpty(maHoKhau))
                {
                    Console.WriteLine("[ERROR] User này không có Mã Hộ Khẩu (Có thể là Admin?)");
                    return BadRequest(new { message = "Tài khoản của bạn không liên kết với căn hộ nào." });
                }

                // --- BƯỚC 2: TRUY VẤN DỮ LIỆU ---

                // 2.1 Lấy thành viên (Những người cùng MaHoKhau)
                var members = await _context.NhanKhau
                    .AsNoTracking()
                    .Where(nk => nk.MaHoKhau == maHoKhau)
                    .Select(nk => new DashboardViewModels.MemberDto
                    {
                        Id = nk.MaNhanKhau,
                        Name = nk.HoTen ?? "Chưa cập nhật",
                        Role = nk.QuanHe ?? "Thành viên",
                        Avatar = "👤"
                    })
                    .ToListAsync();
                Console.WriteLine($"[DEBUG] Tìm thấy {members.Count} thành viên.");

                // 2.2 Lấy các khoản chưa đóng (NgayNop là NULL)
                var unpaidFees = await _context.KhoanThuTheoHo
                    .AsNoTracking()
                    .Include(ktth => ktth.KhoanThu)
                    .Where(ktth => ktth.MaHoKhau == maHoKhau && ktth.NgayNop == null)
                    .Select(ktth => new DashboardViewModels.FeeDto
                    {
                        Id = ktth.MaKhoanThuTheoHo,
                        Title = ktth.KhoanThu.TenKhoanThu,
                        Amount = ktth.SoTien ?? 0,
                        Date = ktth.KhoanThu.ThoiGianKetThuc.HasValue 
                               ? ktth.KhoanThu.ThoiGianKetThuc.Value.ToString("dd/MM/yyyy") 
                               : "30/12/2025"
                    })
                    .ToListAsync();
                Console.WriteLine($"[DEBUG] Tìm thấy {unpaidFees.Count} khoản nợ.");

                // 2.3 Lấy lịch sử đã đóng (NgayNop != NULL)
                var paidFees = await _context.KhoanThuTheoHo
                    .AsNoTracking()
                    .Include(ktth => ktth.KhoanThu)
                    .Where(ktth => ktth.MaHoKhau == maHoKhau && ktth.NgayNop != null)
                    .OrderByDescending(ktth => ktth.NgayNop)
                    .Take(5)
                    .Select(ktth => new DashboardViewModels.FeeDto
                    {
                        Id = ktth.MaKhoanThuTheoHo,
                        Title = ktth.KhoanThu.TenKhoanThu,
                        Amount = ktth.SoTien ?? 0,
                        Date = ktth.NgayNop.Value.ToString("dd/MM/yyyy")
                    })
                    .ToListAsync();

                // 2.4 Lấy phương tiện
                var vehicles = await _context.PhuongTiens
                    .AsNoTracking()
                    .Where(pt => pt.MaHoKhau == maHoKhau)
                    .Select(pt => new DashboardViewModels.VehicleDto
                    {
                        Id = pt.MaPhuongTien,
                        Plate = pt.BienSo ?? "Chưa rõ",
                        Type = pt.LoaiXe ?? "Xe",
                        Status = pt.TrangThai ?? "Đang cập nhật"
                    })
                    .ToListAsync();
                Console.WriteLine($"[DEBUG] Tìm thấy {vehicles.Count} xe.");

                // 2.5 Lấy thông báo (Lấy chung cho tất cả user)
                var notices = await _context.ThongBao
                    .AsNoTracking()
                    .OrderByDescending(tb => tb.NgayTao)
                    .Take(3)
                    .Select(tb => new DashboardViewModels.NoticeDto
                    {
                        Id = tb.MaThongBao,
                        Title = tb.TieuDe ?? "Thông báo mới",
                        Date = tb.NgayTao.ToString("dd/MM/yyyy"),
                        Urgent = false
                    })
                    .ToListAsync();

                // --- BƯỚC 3: TRẢ VỀ JSON KHỚP VỚI REACT ---
                var response = new DashboardViewModels.DashboardResponse
                {
                    Members = members,
                    UnpaidFees = unpaidFees,
                    PaidFees = paidFees,
                    Vehicles = vehicles,
                    Notices = notices
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                // In lỗi chi tiết ra màn hình đen (Console) để debug
                Console.WriteLine("--------------------------------------------------");
                Console.WriteLine($"[CRITICAL ERROR] {ex.Message}");
                Console.WriteLine($"[STACK TRACE] {ex.StackTrace}");
                Console.WriteLine("--------------------------------------------------");
                return StatusCode(500, new { message = "Lỗi Server: " + ex.Message });
            }
        }
    }
}