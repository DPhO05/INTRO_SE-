using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyChungCu.API.Entities
{
    [Table("ThongBaoTbl")]
    public class ThongBaoEntity
    {
        [Key]
        public int MaThongBao { get; set; }

        [Required]
        [MaxLength(200)]
        public string TieuDe { get; set; } // Ví dụ: Thông báo cắt nước

        public string NoiDung { get; set; } // Nội dung chi tiết

        public DateTime NgayTao { get; set; } = DateTime.Now; // Ngày đăng
    }
}