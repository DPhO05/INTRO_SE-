using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChungCu.API.Entities;

namespace QuanLyChungCu.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class HoKhauController : ControllerBase
    {
        private readonly AppDbContext _context;

        public HoKhauController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Lấy danh sách hộ khẩu
        [HttpGet]
        public async Task<ActionResult<IEnumerable<HoKhauEntity>>> GetHoKhau()
        {
            return await _context.HoKhau.ToListAsync();
        }


        // 2. Lấy chi tiết 1 hộ khẩu (theo Mã)
        [HttpGet("{id}")]
        public async Task<ActionResult<HoKhauEntity>> GetHoKhauById(string id)
        {
            var hoKhau = await _context.HoKhau.FindAsync(id);
            if (hoKhau == null) return NotFound();
            return hoKhau;
        }

        // 3. Thêm mới hộ khẩu
        [HttpPost]
        public async Task<ActionResult<HoKhauEntity>> PostHoKhau(HoKhauEntity hoKhau)
        {
            // Kiểm tra trùng mã
            if (await _context.HoKhau.AnyAsync(h => h.MaHoKhau == hoKhau.MaHoKhau))
            {
                return BadRequest(new { title = "Mã hộ khẩu này đã tồn tại!" });
            }

            _context.HoKhau.Add(hoKhau);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetHoKhau", new { id = hoKhau.MaHoKhau }, hoKhau);
        }

        // 4. Cập nhật hộ khẩu
        [HttpPut("{id}")]
        public async Task<IActionResult> PutHoKhau(string id, HoKhauEntity hoKhau)
        {
            if (id != hoKhau.MaHoKhau) return BadRequest();

            _context.Entry(hoKhau).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.HoKhau.Any(e => e.MaHoKhau == id)) return NotFound();
                else throw;
            }

            return NoContent();
        }

        // 5. Xóa hộ khẩu
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteHoKhau(string id)
        {
            var hoKhau = await _context.HoKhau.FindAsync(id);
            if (hoKhau == null) return NotFound();

            // Lưu ý: Nếu hộ khẩu này đã có nhân khẩu hoặc khoản thu, việc xóa có thể bị chặn bởi SQL
            // Cần xóa dữ liệu liên quan trước (giống bài Khoản thu) nếu muốn xóa triệt để.
            // Ở đây tạm thời để xóa cơ bản:
            _context.HoKhau.Remove(hoKhau);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}