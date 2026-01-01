using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace QuanLyChungCu.API.Migrations
{
    /// <inheritdoc />
    public partial class AddThongBaoFeature : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "CanHoTbl",
                columns: table => new
                {
                    MaCanHo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaHoKhau = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TenCanHo = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Tang = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    DienTich = table.Column<double>(type: "float", nullable: false),
                    MoTa = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CanHoTbl", x => x.MaCanHo);
                });

            migrationBuilder.CreateTable(
                name: "HoKhauTbl",
                columns: table => new
                {
                    MaHoKhau = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: false),
                    DiaChiThuongTru = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    NoiCap = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    NgayCap = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_HoKhauTbl", x => x.MaHoKhau);
                });

            migrationBuilder.CreateTable(
                name: "KhoanThuTbl",
                columns: table => new
                {
                    MaKhoanThu = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenKhoanThu = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    ThoiGianBatDau = table.Column<DateTime>(type: "datetime2", nullable: false),
                    ThoiGianKetThuc = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LoaiKhoanThu = table.Column<int>(type: "int", nullable: false),
                    SoTien = table.Column<decimal>(type: "decimal(18,2)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KhoanThuTbl", x => x.MaKhoanThu);
                });

            migrationBuilder.CreateTable(
                name: "KhoanThuTheoHoTbl",
                columns: table => new
                {
                    MaKhoanThuTheoHo = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaKhoanThu = table.Column<int>(type: "int", nullable: false),
                    MaHoKhau = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    SoTien = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    NgayNop = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_KhoanThuTheoHoTbl", x => x.MaKhoanThuTheoHo);
                });

            migrationBuilder.CreateTable(
                name: "NhanKhauTbl",
                columns: table => new
                {
                    MaNhanKhau = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaHoKhau = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HoTen = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NgaySinh = table.Column<DateTime>(type: "datetime2", nullable: true),
                    CanCuocCongDan = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    QuanHe = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TrangThai = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NhanKhauTbl", x => x.MaNhanKhau);
                });

            migrationBuilder.CreateTable(
                name: "PhanAnhTbl",
                columns: table => new
                {
                    MaPhanAnh = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NguoiGui = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    TieuDe = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true),
                    NoiDung = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    NgayGui = table.Column<DateTime>(type: "datetime2", nullable: true),
                    TrangThai = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    PhanHoiCuaAdmin = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PhanAnhTbl", x => x.MaPhanAnh);
                });

            migrationBuilder.CreateTable(
                name: "TaiKhoanTbl",
                columns: table => new
                {
                    MaTaiKhoan = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TenDangNhap = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    MatKhau = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: false),
                    Quyen = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: false),
                    MaHoKhau = table.Column<string>(type: "nvarchar(10)", maxLength: 10, nullable: true),
                    HoTenHienThi = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TaiKhoanTbl", x => x.MaTaiKhoan);
                });

            migrationBuilder.CreateTable(
                name: "TamTruTbl",
                columns: table => new
                {
                    MaTamTru = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    HoTen = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DiaChiThuongTru = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    DiaChiTamTru = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    CanCuocCongDan = table.Column<string>(type: "nvarchar(20)", maxLength: 20, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TamTruTbl", x => x.MaTamTru);
                });

            migrationBuilder.CreateTable(
                name: "ThongBaoTbl",
                columns: table => new
                {
                    MaThongBao = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TieuDe = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: false),
                    NoiDung = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    NgayTao = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ThongBaoTbl", x => x.MaThongBao);
                });

            migrationBuilder.CreateTable(
                name: "TamVangTbl",
                columns: table => new
                {
                    MaTamVang = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    MaNhanKhau = table.Column<int>(type: "int", nullable: false),
                    ThoiHan = table.Column<DateTime>(type: "datetime2", nullable: true),
                    LyDo = table.Column<string>(type: "nvarchar(200)", maxLength: 200, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_TamVangTbl", x => x.MaTamVang);
                    table.ForeignKey(
                        name: "FK_TamVangTbl_NhanKhauTbl_MaNhanKhau",
                        column: x => x.MaNhanKhau,
                        principalTable: "NhanKhauTbl",
                        principalColumn: "MaNhanKhau",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_TamVangTbl_MaNhanKhau",
                table: "TamVangTbl",
                column: "MaNhanKhau");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CanHoTbl");

            migrationBuilder.DropTable(
                name: "HoKhauTbl");

            migrationBuilder.DropTable(
                name: "KhoanThuTbl");

            migrationBuilder.DropTable(
                name: "KhoanThuTheoHoTbl");

            migrationBuilder.DropTable(
                name: "PhanAnhTbl");

            migrationBuilder.DropTable(
                name: "TaiKhoanTbl");

            migrationBuilder.DropTable(
                name: "TamTruTbl");

            migrationBuilder.DropTable(
                name: "TamVangTbl");

            migrationBuilder.DropTable(
                name: "ThongBaoTbl");

            migrationBuilder.DropTable(
                name: "NhanKhauTbl");
        }
    }
}
