using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyChungCu.API.Entities
{
    [Table("CanHoTbl")]
    public class CanHoEntity
    {
        [Key]
        public int MaCanHo { get; set; }

        public string? MaHoKhau { get; set; } 

        public string? TenCanHo { get; set; }
        public string? Tang { get; set; }
        public double DienTich { get; set; }
        public string? MoTa { get; set; }
    }
}