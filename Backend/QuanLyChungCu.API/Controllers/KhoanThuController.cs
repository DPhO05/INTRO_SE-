using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChungCu.API.Entities;

namespace QuanLyChungCu.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class KhoanThuController : ControllerBase
    {
        private readonly AppDbContext _context;

        public KhoanThuController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<KhoanThuEntity>>> GetKhoanThu()
        {
            return await _context.KhoanThu.OrderByDescending(k => k.ThoiGianBatDau).ToListAsync();
        }

        [HttpPost]
        public async Task<ActionResult<KhoanThuEntity>> CreateKhoanThu(KhoanThuEntity khoanThu)
        {
            // Bắt đầu Transaction
            using var transaction = _context.Database.BeginTransaction();

            try
            {
                // 1. Lưu khoản thu gốc
                _context.KhoanThu.Add(khoanThu);
                await _context.SaveChangesAsync(); 

                // 2. Tạo công nợ tự động
                var listHoKhau = await _context.HoKhau.Select(h => h.MaHoKhau).ToListAsync();
                var listCongNo = new List<KhoanThuTheoHoEntity>();

                foreach (var maHo in listHoKhau)
                {
                    listCongNo.Add(new KhoanThuTheoHoEntity
                    {
                        MaKhoanThu = khoanThu.MaKhoanThu,
                        MaHoKhau = maHo,
                        SoTien = khoanThu.SoTien,
                        NgayNop = null
                    });
                }

                _context.KhoanThuTheoHo.AddRange(listCongNo);
                await _context.SaveChangesAsync();

                // Nếu mọi thứ ok thì Commit
                transaction.Commit();

                return CreatedAtAction("GetKhoanThu", new { id = khoanThu.MaKhoanThu }, khoanThu);
            }
            catch (Exception ex)
            {
                // Nếu có lỗi, Rollback lại toàn bộ (như chưa từng thêm gì)
                transaction.Rollback();
                return StatusCode(500, "Lỗi khi tạo khoản thu: " + ex.Message);
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateKhoanThu(int id, KhoanThuEntity khoanThu)
        {
            if (id != khoanThu.MaKhoanThu) return BadRequest();
            _context.Entry(khoanThu).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteKhoanThu(int id)
        {
            var khoanThu = await _context.KhoanThu.FindAsync(id);
            if (khoanThu == null) return NotFound();

            // Xóa luôn các khoản nợ liên quan để sạch rác
            var khoanNoLienQuan = _context.KhoanThuTheoHo.Where(x => x.MaKhoanThu == id);
            _context.KhoanThuTheoHo.RemoveRange(khoanNoLienQuan);

            _context.KhoanThu.Remove(khoanThu);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}