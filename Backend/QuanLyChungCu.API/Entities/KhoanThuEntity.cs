using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyChungCu.API.Entities
{
    [Table("KhoanThuTbl")]
    public class KhoanThuEntity
    {
        [Key]
        public int MaKhoanThu { get; set; }
        public string TenKhoanThu { get; set; } = string.Empty;
        public DateTime ThoiGianBatDau { get; set; }
        public DateTime? ThoiGianKetThuc { get; set; }
        public int LoaiKhoanThu { get; set; } // 0: Tự nguyện, 1: Bắt buộc
        
        // --- Mới thêm cột này trong Database ---
        public decimal SoTien { get; set; } 
    }
}