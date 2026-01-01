using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyChungCu.API.Entities
{
    [Table("NhanKhauTbl")]
    public class NhanKhauEntity
    {
        [Key]
        public int MaNhanKhau { get; set; }

        public string? MaHoKhau { get; set; } // Liên kết với bảng Hộ Khẩu

        public string? HoTen { get; set; }

        public DateTime? NgaySinh { get; set; }

        public string? CanCuocCongDan { get; set; } // Tên phải khớp y hệt SQL

        public string? QuanHe { get; set; } // Chủ hộ, Vợ, Con...

        public int TrangThai { get; set; } // SQL là INT (1: Đang ở, 0: Đã đi)
    }
}