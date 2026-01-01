using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChungCu.API.Entities;

namespace QuanLyChungCu.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DashboardController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DashboardController(AppDbContext context)
        {
            _context = context;
        }

        // 1. API lấy số liệu thống kê (Cards)
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var totalNhanKhau = await _context.NhanKhau.CountAsync();
            var totalCanHo = await _context.CanHo.CountAsync();
            var totalXe = 150; // Số liệu giả lập vì chưa có bảng Xe
            
            // Tính tổng doanh thu (Chỉ tính những khoản đã nộp)
            var totalRevenue = await _context.KhoanThuTheoHo
                .Where(x => x.NgayNop != null)
                .SumAsync(x => x.SoTien);

            return Ok(new
            {
                nhanKhau = totalNhanKhau,
                canHo = totalCanHo,
                xe = totalXe,
                doanhThu = totalRevenue
            });
        }

        // 2. API lấy dữ liệu biểu đồ
        [HttpGet("charts")]
        public async Task<IActionResult> GetChartData()
        {
            // --- Biểu đồ Doanh thu ---
            var rawData = await _context.KhoanThuTheoHo
                .Where(x => x.NgayNop != null)
                .Select(x => new { x.NgayNop, x.SoTien })
                .ToListAsync();

            var revenueData = rawData
                .GroupBy(x => x.NgayNop.Value.Month) // .Value để lấy giá trị thực
                .Select(g => new { 
                    name = "T" + g.Key, 
                    tien = g.Sum(x => x.SoTien) 
                })
                .OrderBy(x => int.Parse(x.name.Substring(1)))
                .ToList();

            // --- Biểu đồ Dân cư (Đã sửa lỗi DateTime?) ---
            var currentYear = DateTime.Now.Year;
            
            var residentsData = new List<object>
            {
                // Logic: Phải kiểm tra NgaySinh có dữ liệu (.HasValue) rồi mới tính toán
                new { 
                    name = "Trẻ em", 
                    value = await _context.NhanKhau.CountAsync(x => x.NgaySinh.HasValue && (currentYear - x.NgaySinh.Value.Year < 18)) 
                },
                new { 
                    name = "Người lớn", 
                    value = await _context.NhanKhau.CountAsync(x => x.NgaySinh.HasValue && (currentYear - x.NgaySinh.Value.Year >= 18 && currentYear - x.NgaySinh.Value.Year < 60)) 
                },
                new { 
                    name = "Người cao tuổi", 
                    value = await _context.NhanKhau.CountAsync(x => x.NgaySinh.HasValue && (currentYear - x.NgaySinh.Value.Year >= 60)) 
                }
            };

            return Ok(new { revenue = revenueData, residents = residentsData });
        }

        // 3. API lấy giao dịch mới nhất
        [HttpGet("recent-transactions")]
        public async Task<IActionResult> GetRecentTransactions()
        {
            var transactions = await _context.KhoanThuTheoHo
                .Where(kt => kt.NgayNop != null)
                .OrderByDescending(kt => kt.NgayNop)
                .Take(5)
                .Join(_context.KhoanThu,
                      theoHo => theoHo.MaKhoanThu,
                      goc => goc.MaKhoanThu,
                      (theoHo, goc) => new { theoHo, goc })
                .Join(_context.NhanKhau,
                      temp => temp.theoHo.MaHoKhau,
                      nk => nk.MaHoKhau,
                      (temp, nk) => new { temp.theoHo, temp.goc, nk })
                .Where(x => x.nk.QuanHe == "Chủ hộ")
                .Select(x => new 
                {
                    MaHo = x.theoHo.MaHoKhau,
                    ChuHo = x.nk.HoTen,
                    NoiDung = x.goc.TenKhoanThu,
                    SoTien = x.theoHo.SoTien,
                    TrangThai = "Đã thanh toán"
                })
                .ToListAsync();

            return Ok(transactions);
        }
    }
}