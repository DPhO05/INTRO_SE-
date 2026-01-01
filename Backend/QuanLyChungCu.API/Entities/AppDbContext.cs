using Microsoft.EntityFrameworkCore;

namespace QuanLyChungCu.API.Entities
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }
        public DbSet<PhuongTienEntity> PhuongTiens { get; set; }
        public DbSet<HoKhauEntity> HoKhau { get; set; }
        public DbSet<NhanKhauEntity> NhanKhau { get; set; }
        public DbSet<KhoanThuEntity> KhoanThu { get; set; }
        public DbSet<KhoanThuTheoHoEntity> KhoanThuTheoHo { get; set; }
        public DbSet<CanHoEntity> CanHo { get; set; }
        public DbSet<TamTruEntity> TamTru { get; set; }
        public DbSet<TamVangEntity> TamVang { get; set; }
        public DbSet<TaiKhoanEntity> TaiKhoan { get; set; }
        public DbSet<PhanAnhEntity> PhanAnh { get; set; }
        public DbSet<ThongBaoEntity> ThongBao { get; set; }
        
    }
}