using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChungCu.API.Entities;

namespace QuanLyChungCu.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ThongBaoController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ThongBaoController(AppDbContext context)
        {
            _context = context;
        }

        // 1. API CHO DASHBOARD (USER)
        // Lấy danh sách tin để hiển thị (Mới nhất lên đầu)
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ThongBaoEntity>>> GetThongBao()
        {
            return await _context.ThongBao
                .OrderByDescending(x => x.NgayTao) // Sắp xếp ngày giảm dần
                .ToListAsync();
        }

        // 2. API ĐĂNG TIN (ADMIN)
        [HttpPost]
        public async Task<ActionResult<ThongBaoEntity>> CreateThongBao(ThongBaoEntity thongBao)
        {
            thongBao.NgayTao = DateTime.Now; // Tự động lấy giờ hiện tại
            _context.ThongBao.Add(thongBao);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetThongBao", new { id = thongBao.MaThongBao }, thongBao);
        }

        // 3. API XÓA TIN (ADMIN) - Nếu đăng nhầm thì xóa
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteThongBao(int id)
        {
            var thongBao = await _context.ThongBao.FindAsync(id);
            if (thongBao == null) return NotFound();

            _context.ThongBao.Remove(thongBao);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}