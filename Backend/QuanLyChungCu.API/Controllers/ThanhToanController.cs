using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChungCu.API.Entities;

namespace QuanLyChungCu.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThanhToanController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ThanhToanController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Lấy danh sách nộp tiền của một khoản thu cụ thể
        [HttpGet("danh-sach-nop")]
        public async Task<IActionResult> GetDanhSachNop(int maKhoanThu)
        {
            // Join 3 bảng: Hộ Khẩu - Khoản Thu Theo Hộ - Khoản Thu
            var result = await _context.HoKhau
                .GroupJoin(_context.KhoanThuTheoHo.Where(x => x.MaKhoanThu == maKhoanThu),
                    hk => hk.MaHoKhau,
                    kt => kt.MaHoKhau,
                    (hk, ktGroup) => new { hk, ktGroup })
                .SelectMany(
                    x => x.ktGroup.DefaultIfEmpty(),
                    (x, kt) => new 
                    {
                        MaHoKhau = x.hk.MaHoKhau,
                        DiaChi = x.hk.DiaChiThuongTru,
                        DaNop = kt != null && kt.NgayNop != null,
                        // Nếu đã có bản ghi nợ thì lấy số tiền nợ, nếu chưa thì lấy 0
                        SoTien = kt != null ? kt.SoTien : 0 
                    }
                ).ToListAsync();

            return Ok(result);
        }

        // 2. Xử lý Thanh Toán (CẬP NHẬT QUAN TRỌNG)
        [HttpPost]
        public async Task<IActionResult> ThanhToan(ThanhToanRequest request)
        {
            // Tìm khoản nợ của hộ đó
            var khoanNo = await _context.KhoanThuTheoHo
                .FirstOrDefaultAsync(x => x.MaKhoanThu == request.MaKhoanThu && x.MaHoKhau == request.MaHoKhau);

            if (khoanNo == null)
            {
                // Trường hợp hiếm: Nếu chưa có nợ (do tạo phí cũ trước khi có code auto), thì tạo mới
                khoanNo = new KhoanThuTheoHoEntity
                {
                    MaKhoanThu = request.MaKhoanThu,
                    MaHoKhau = request.MaHoKhau
                };
                _context.KhoanThuTheoHo.Add(khoanNo);
            }

            // Cập nhật thông tin thanh toán
            khoanNo.NgayNop = DateTime.Now; // Thời gian đóng là hiện tại
            khoanNo.SoTien = request.SoTien; // <--- QUAN TRỌNG: Lưu số tiền thực đóng để hiện lên Dashboard

            await _context.SaveChangesAsync();
            return Ok(new { message = "Thanh toán thành công" });
        }
    }

    // Class nhận dữ liệu từ Frontend
    public class ThanhToanRequest
    {
        public int MaKhoanThu { get; set; }
        public string MaHoKhau { get; set; }
        public decimal SoTien { get; set; }
    }
}