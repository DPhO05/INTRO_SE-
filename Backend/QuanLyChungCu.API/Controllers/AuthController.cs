using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using QuanLyChungCu.API.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace QuanLyChungCu.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthController(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginModel model)
        {
            // 1. Kiểm tra đầu vào
            if (string.IsNullOrEmpty(model.Username) || string.IsNullOrEmpty(model.Password))
            {
                return BadRequest("Vui lòng nhập đầy đủ thông tin.");
            }

            // 2. Tìm user trong DB (QUAN TRỌNG: Thêm .Trim() để cắt khoảng trắng thừa)
            var user = await _context.TaiKhoan
                .FirstOrDefaultAsync(x => x.TenDangNhap == model.Username.Trim() && x.MatKhau == model.Password.Trim());

            if (user == null)
            {
                return Unauthorized(new { message = "Sai tên đăng nhập hoặc mật khẩu!" });
            }

            // 3. Tạo Token chứa thông tin quan trọng (Claims)
            var issuer = _configuration["Jwt:Issuer"];
            var audience = _configuration["Jwt:Audience"];
            var keyBytes = Encoding.ASCII.GetBytes(_configuration["Jwt:Key"]);

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new[]
                {
                    // ID tài khoản (Dùng ClaimTypes chuẩn để Controller khác dễ lấy)
                    new Claim(ClaimTypes.NameIdentifier, user.MaTaiKhoan.ToString()),
                    
                    // Tên đăng nhập
                    new Claim(ClaimTypes.Name, user.TenDangNhap),
                    
                    // Quyền (Admin/User)
                    new Claim(ClaimTypes.Role, user.Quyen), 
                    
                    // QUAN TRỌNG: Lưu Mã Hộ Khẩu vào Token để Dashboard dùng
                    // Nếu là Admin (MaHoKhau null) thì lưu chuỗi rỗng
                    new Claim("MaHoKhau", user.MaHoKhau ?? "") 
                }),
                Expires = DateTime.UtcNow.AddHours(24),
                Issuer = issuer,
                Audience = audience,
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(keyBytes), SecurityAlgorithms.HmacSha512Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var stringToken = tokenHandler.WriteToken(token);

            // 4. Trả về kết quả
            return Ok(new 
            { 
                token = stringToken,
                role = user.Quyen,
                hoTen = user.HoTenHienThi,
                maHoKhau = user.MaHoKhau // Trả về để Frontend lưu nếu cần
            });
        }
    }

    public class LoginModel
    {
        public string Username { get; set; }
        public string Password { get; set; }
    }
}