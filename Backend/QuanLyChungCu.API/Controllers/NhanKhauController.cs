using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChungCu.API.Entities;

namespace QuanLyChungCu.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class NhanKhauController : ControllerBase
    {
        private readonly AppDbContext _context;

        public NhanKhauController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<NhanKhauEntity>>> GetNhanKhau()
        {
            // Lấy tất cả nhân khẩu
            return await _context.NhanKhau.ToListAsync();
        }

        // 2. Thêm nhân khẩu mới
        [HttpPost]
        public async Task<ActionResult<NhanKhauEntity>> PostNhanKhau(NhanKhauEntity nhanKhau)
        {
            _context.NhanKhau.Add(nhanKhau);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetNhanKhau", new { id = nhanKhau.MaNhanKhau }, nhanKhau);
        }

        // 3. Xóa nhân khẩu
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteNhanKhau(int id)
        {
            var nhanKhau = await _context.NhanKhau.FindAsync(id);
            if (nhanKhau == null)
            {
                return NotFound();
            }

            _context.NhanKhau.Remove(nhanKhau);
            await _context.SaveChangesAsync();

            return NoContent();
        }
        // 4. Cập nhật nhân khẩu (Sửa)
        [HttpPut("{id}")]
        public async Task<IActionResult> PutNhanKhau(int id, NhanKhauEntity nhanKhau)
        {
            if (id != nhanKhau.MaNhanKhau)
            {
                return BadRequest();
            }

            // Đánh dấu trạng thái là đã sửa đổi
            _context.Entry(nhanKhau).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!_context.NhanKhau.Any(e => e.MaNhanKhau == id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }
    }
}