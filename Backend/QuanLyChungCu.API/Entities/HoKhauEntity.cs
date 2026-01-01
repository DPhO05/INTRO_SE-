using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyChungCu.API.Entities
{
    [Table("HoKhauTbl")] // Ánh xạ tới bảng HoKhauTbl trong SQL
    public class HoKhauEntity
    {
        [Key] // Đánh dấu đây là Khóa chính
        [StringLength(10)]
        public string MaHoKhau { get; set; }

        [StringLength(200)]
        public string? DiaChiThuongTru { get; set; } // Dấu ? nghĩa là cho phép null

        [StringLength(200)]
        public string? NoiCap { get; set; }

        public DateTime? NgayCap { get; set; }
    }
}   