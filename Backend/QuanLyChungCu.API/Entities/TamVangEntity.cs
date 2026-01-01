using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyChungCu.API.Entities
{
    [Table("TamVangTbl")]
    public class TamVangEntity
    {
        [Key]
        public int MaTamVang { get; set; }

        public int MaNhanKhau { get; set; }

        public DateTime? ThoiHan { get; set; }

        [StringLength(200)]
        public string? LyDo { get; set; }

        // Thiết lập liên kết với bảng Nhân khẩu
        [ForeignKey("MaNhanKhau")]
        public virtual NhanKhauEntity? NhanKhau { get; set; }
    }
}