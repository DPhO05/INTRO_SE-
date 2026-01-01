CREATE DATABASE QuanLyChungCu;
GO
USE QuanLyChungCu;
GO

-- 1. Bảng Hộ khẩu
CREATE TABLE HoKhauTbl (MaHoKhau NVARCHAR(10) PRIMARY KEY, DiaChiThuongTru NVARCHAR(100), NoiCap NVARCHAR(50), NgayCap DATETIME);
-- 2. Bảng Nhân khẩu
CREATE TABLE NhanKhauTbl (MaNhanKhau INT PRIMARY KEY IDENTITY(1,1), MaHoKhau NVARCHAR(10), HoTen NVARCHAR(50), CanCuocCongDan NVARCHAR(20), NgaySinh DATETIME, QuanHe NVARCHAR(30), TrangThai INT DEFAULT 1);
-- 3. Bảng Căn hộ
CREATE TABLE CanHoTbl (MaCanHo INT PRIMARY KEY IDENTITY(1,1), MaHoKhau NVARCHAR(10), TenCanHo NVARCHAR(20), Tang NVARCHAR(10), DienTich FLOAT, MoTa NVARCHAR(200));
-- 4. Bảng Khoản thu
CREATE TABLE KhoanThuTbl (MaKhoanThu INT PRIMARY KEY IDENTITY(1,1), TenKhoanThu NVARCHAR(100), ThoiGianBatDau DATETIME, ThoiGianKetThuc DATETIME, LoaiKhoanThu INT, ChiTiet NVARCHAR(MAX), GhiChu NVARCHAR(MAX));
-- 5. Bảng Khoản thu theo hộ
CREATE TABLE KhoanThuTheoHoTbl (MaKhoanThuTheoHo INT PRIMARY KEY IDENTITY(1,1), MaKhoanThu INT, MaHoKhau NVARCHAR(10), SoTien DECIMAL(18,2), NgayNop DATETIME);
-- 6. Bảng Tạm trú & Tạm vắng
CREATE TABLE TamTruTbl (MaTamTru INT PRIMARY KEY IDENTITY(1,1), HoTen NVARCHAR(100), DiaChiThuongTru NVARCHAR(100), DiaChiTamTru NVARCHAR(100), CanCuocCongDan NVARCHAR(20));
CREATE TABLE TamVangTbl (MaTamVang INT PRIMARY KEY IDENTITY(1,1), MaNhanKhau INT, ThoiHan DATETIME2(7), LyDo NVARCHAR(200));

-- 7. Bảng Tài khoản (QUAN TRỌNG CHO LOGIN)
CREATE TABLE TaiKhoanTbl (MaTaiKhoan INT PRIMARY KEY IDENTITY(1,1), TenDangNhap NVARCHAR(50), MatKhau NVARCHAR(100), Quyen NVARCHAR(20), MaHoKhau NVARCHAR(10), HoTenHienThi NVARCHAR(100));

-- 8. Bảng Phản ánh
CREATE TABLE PhanAnhTbl (MaPhanAnh INT PRIMARY KEY IDENTITY(1,1), NguoiGui NVARCHAR(50), TieuDe NVARCHAR(200), NoiDung NVARCHAR(MAX), NgayGui DATETIME DEFAULT GETDATE(), TrangThai NVARCHAR(50) DEFAULT N'Chờ xử lý', PhanHoiCuaAdmin NVARCHAR(MAX));

-- --- DỮ LIỆU MẪU ---

-- Tài khoản Admin & User
INSERT INTO TaiKhoanTbl (TenDangNhap, MatKhau, Quyen, HoTenHienThi) VALUES 
('admin', '123456', 'Admin', N'Quản Trị Viên'),
('user1', '123456', 'User', N'Cư Dân A');

-- Hộ khẩu mẫu
INSERT INTO HoKhauTbl (MaHoKhau, DiaChiThuongTru) VALUES ('HK001', N'P101 BlueMoon');

-- Nhân khẩu mẫu (Liên kết với User1)
INSERT INTO NhanKhauTbl (MaHoKhau, HoTen, QuanHe) VALUES ('HK001', N'Cư Dân A', N'Chủ hộ');
GO