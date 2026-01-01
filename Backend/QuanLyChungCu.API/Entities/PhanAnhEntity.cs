using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyChungCu.API.Entities
{
    [Table("PhanAnhTbl")]
    public class PhanAnhEntity
    {
        [Key]
        public int MaPhanAnh { get; set; }

        [StringLength(50)]
        public string? NguoiGui { get; set; } // Lưu tên đăng nhập

        [StringLength(200)]
        public string? TieuDe { get; set; }

        public string? NoiDung { get; set; }

        public DateTime? NgayGui { get; set; } = DateTime.Now;

        [StringLength(50)]
        public string? TrangThai { get; set; } = "Chờ xử lý";

        public string? PhanHoiCuaAdmin { get; set; }
    }
}