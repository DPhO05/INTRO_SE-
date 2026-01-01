using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using QuanLyChungCu.API.Entities;
using System.IdentityModel.Tokens.Jwt; // <--- Cần thêm thư viện này để đọc chuẩn tên đăng nhập
using System.Security.Claims;

namespace QuanLyChungCu.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class PhanAnhController : ControllerBase
    {
        private readonly AppDbContext _context;

        public PhanAnhController(AppDbContext context)
        {
            _context = context;
        }

        // 1. Lấy danh sách phản ánh
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PhanAnhEntity>>> GetPhanAnh()
        {
            // --- SỬA QUAN TRỌNG TẠI ĐÂY ---
            // Lấy đúng key "Role" mà AuthController đã nạp vào
            var role = User.FindFirst("Role")?.Value; 
            
            // Lấy đúng key "sub" (Subject) chứa tên đăng nhập
            var username = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value; 
            // -------------------------------

            // Debug: In ra màn hình console để kiểm tra (chạy xong xóa cũng được)
            Console.WriteLine($"[DEBUG] User: {username} - Role: {role}");

            if (role == "Admin")
            {
                // Admin xem hết
                return await _context.PhanAnh.OrderByDescending(p => p.NgayGui).ToListAsync();
            }
            else
            {
                // User chỉ xem của mình
                return await _context.PhanAnh
                    .Where(p => p.NguoiGui == username)
                    .OrderByDescending(p => p.NgayGui)
                    .ToListAsync();
            }
        }

        // 2. Gửi phản ánh mới (Dành cho User)
        [HttpPost]
        public async Task<ActionResult<PhanAnhEntity>> CreatePhanAnh(PhanAnhEntity phanAnh)
        {
            // Sửa lại cách lấy username cho chuẩn
            var username = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;
            
            phanAnh.NguoiGui = username;
            phanAnh.NgayGui = DateTime.Now;
            phanAnh.TrangThai = "Chờ xử lý";
            phanAnh.PhanHoiCuaAdmin = "";

            _context.PhanAnh.Add(phanAnh);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetPhanAnh", new { id = phanAnh.MaPhanAnh }, phanAnh);
        }

        // 3. Admin trả lời & Duyệt phản ánh
        [HttpPut("{id}")]
        // [Authorize(Roles = "Admin")] 
        public async Task<IActionResult> ReplyPhanAnh(int id, PhanAnhEntity request)
        {
            var phanAnh = await _context.PhanAnh.FindAsync(id);
            if (phanAnh == null) return NotFound();

            phanAnh.PhanHoiCuaAdmin = request.PhanHoiCuaAdmin;
            phanAnh.TrangThai = request.TrangThai; 

            await _context.SaveChangesAsync();
            return NoContent();
        }
        
        // 4. Xóa phản ánh
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePhanAnh(int id)
        {
            var phanAnh = await _context.PhanAnh.FindAsync(id);
            if (phanAnh == null) return NotFound();

            // Sửa lại cách lấy claim cho chuẩn
            var role = User.FindFirst("Role")?.Value;
            var username = User.FindFirst(JwtRegisteredClaimNames.Sub)?.Value;

            if (role != "Admin")
            {
                if (phanAnh.NguoiGui != username) return Unauthorized();
                if (phanAnh.TrangThai != "Chờ xử lý") return BadRequest("Không thể xóa phản ánh đã được xử lý!");
            }

            _context.PhanAnh.Remove(phanAnh);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}