using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyChungCu.API.Entities
{
    [Table("TaiKhoanTbl")]
    public class TaiKhoanEntity
    {
        [Key]
        public int MaTaiKhoan { get; set; }

        [Required]
        [StringLength(50)]
        public string TenDangNhap { get; set; } = null!;

        [Required]
        [StringLength(100)]
        public string MatKhau { get; set; } = null!;

        [Required]
        [StringLength(20)]
        public string Quyen { get; set; } = null!; // "Admin" hoặc "User"

        [StringLength(10)]
        public string? MaHoKhau { get; set; } // Null nếu là Admin

        [StringLength(100)]
        public string? HoTenHienThi { get; set; }
    }
}