using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace QuanLyChungCu.API.Entities
{
    [Table("TamTruTbl")]
    public class TamTruEntity
    {
        [Key]
        public int MaTamTru { get; set; }

        [StringLength(100)]
        public string? HoTen { get; set; }

        [StringLength(100)]
        public string? DiaChiThuongTru { get; set; }

        [StringLength(100)]
        public string? DiaChiTamTru { get; set; }

        [StringLength(20)]
        public string? CanCuocCongDan { get; set; }
    }
}