using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyChungCu.API.Entities
{
    [Table("KhoanThuTheoHoTbl")]
    public class KhoanThuTheoHoEntity
    {
        [Key]
        public int MaKhoanThuTheoHo { get; set; }

        // Khóa ngoại (chỉ là số nguyên)
        public int MaKhoanThu { get; set; }
        
        public string? MaHoKhau { get; set; }

        public decimal? SoTien { get; set; } 
        
        public DateTime? NgayNop { get; set; }

        [NotMapped] 
        public int TrangThai => NgayNop == null ? 0 : 1; 

        // --- BẠN ĐANG THIẾU ĐOẠN NÀY ---
        // Đây là "Navigation Property" giúp lệnh .Include() hoạt động
        [ForeignKey("MaKhoanThu")]
        public virtual KhoanThuEntity KhoanThu { get; set; } 
    }
}