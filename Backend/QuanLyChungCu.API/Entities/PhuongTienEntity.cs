using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyChungCu.API.Entities // <--- Hãy đổi thành namespace dự án của bạn
{
    [Table("PhuongTienTbl")] // Ánh xạ vào bảng PhuongTienTbl trong SQL
    public class PhuongTienEntity
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaPhuongTien { get; set; }

        [Column(TypeName = "nvarchar(10)")]
        public string MaHoKhau { get; set; } // Khóa ngoại liên kết với Hộ Khẩu

        [Column(TypeName = "nvarchar(20)")]
        public string BienSo { get; set; }

        [Column(TypeName = "nvarchar(20)")]
        public string LoaiXe { get; set; } // Ví dụ: 'Oto' hoặc 'XeMay'

        [Column(TypeName = "nvarchar(20)")]
        public string TrangThai { get; set; } // Ví dụ: 'TrongHam', 'DaRaNgoai'
    }
}