USE QuanLyChungCu;
GO

-- ======================================================================================
-- BƯỚC 1: XÓA SẠCH BẢNG CŨ (ĐỂ TẠO LẠI CẤU TRÚC CHUẨN)
-- ======================================================================================
-- Tắt kiểm tra khóa ngoại để xóa cho dễ
ALTER TABLE CanHoTbl NOCHECK CONSTRAINT ALL;
ALTER TABLE NhanKhauTbl NOCHECK CONSTRAINT ALL;
ALTER TABLE TaiKhoanTbl NOCHECK CONSTRAINT ALL;
ALTER TABLE KhoanThuTheoHoTbl NOCHECK CONSTRAINT ALL;

-- Xóa bảng (Theo thứ tự bảng con trước, bảng cha sau)
DROP TABLE IF EXISTS PhanAnhTbl;
DROP TABLE IF EXISTS ThongBaoTbl; -- Đây là bảng bạn đang thiếu
DROP TABLE IF EXISTS KhoanThuTheoHoTbl;
DROP TABLE IF EXISTS KhoanThuTbl;
DROP TABLE IF EXISTS TamVangTbl;
DROP TABLE IF EXISTS TamTruTbl;
DROP TABLE IF EXISTS TaiKhoanTbl;
DROP TABLE IF EXISTS NhanKhauTbl;
DROP TABLE IF EXISTS CanHoTbl;
DROP TABLE IF EXISTS HoKhauTbl;
GO

-- ======================================================================================
-- BƯỚC 2: TẠO LẠI BẢNG (CẤU TRÚC CHUẨN NHẤT)
-- ======================================================================================

-- 1. Bảng Hộ Khẩu
CREATE TABLE HoKhauTbl (
    MaHoKhau NVARCHAR(10) PRIMARY KEY, 
    DiaChiThuongTru NVARCHAR(100), 
    NoiCap NVARCHAR(50), 
    NgayCap DATETIME
);

-- 2. Bảng Căn Hộ
CREATE TABLE CanHoTbl (
    MaCanHo INT PRIMARY KEY IDENTITY(1,1), 
    MaHoKhau NVARCHAR(10) REFERENCES HoKhauTbl(MaHoKhau), 
    TenCanHo NVARCHAR(20), 
    Tang NVARCHAR(10), 
    DienTich FLOAT, 
    MoTa NVARCHAR(200)
);

-- 3. Bảng Nhân Khẩu
CREATE TABLE NhanKhauTbl (
    MaNhanKhau INT PRIMARY KEY IDENTITY(1,1), 
    MaHoKhau NVARCHAR(10) REFERENCES HoKhauTbl(MaHoKhau), 
    HoTen NVARCHAR(50), 
    CanCuocCongDan NVARCHAR(20), 
    NgaySinh DATETIME, 
    QuanHe NVARCHAR(30), 
    TrangThai INT DEFAULT 1
);

-- 4. Bảng Tài Khoản
CREATE TABLE TaiKhoanTbl (
    MaTaiKhoan INT PRIMARY KEY IDENTITY(1,1), 
    TenDangNhap NVARCHAR(50), 
    MatKhau NVARCHAR(100), 
    Quyen NVARCHAR(20), 
    MaHoKhau NVARCHAR(10) REFERENCES HoKhauTbl(MaHoKhau), 
    HoTenHienThi NVARCHAR(100)
);

-- 5. Bảng Khoản Thu (Đã thêm cột SoTien để sửa lỗi của bạn)
CREATE TABLE KhoanThuTbl (
    MaKhoanThu INT PRIMARY KEY IDENTITY(1,1), 
    TenKhoanThu NVARCHAR(100), 
    ThoiGianBatDau DATETIME, 
    ThoiGianKetThuc DATETIME, 
    LoaiKhoanThu INT, -- 0: Tự nguyện, 1: Bắt buộc
    SoTien DECIMAL(18,2) -- <--- CỘT QUAN TRỌNG
);

-- 6. Bảng Khoản Thu Theo Hộ
CREATE TABLE KhoanThuTheoHoTbl (
    MaKhoanThuTheoHo INT PRIMARY KEY IDENTITY(1,1), 
    MaKhoanThu INT REFERENCES KhoanThuTbl(MaKhoanThu), 
    MaHoKhau NVARCHAR(10) REFERENCES HoKhauTbl(MaHoKhau), 
    SoTien DECIMAL(18,2), 
    NgayNop DATETIME
);

-- 7. Bảng Thông Báo (Bảng bạn đang thiếu)
CREATE TABLE ThongBaoTbl (
    MaThongBao INT PRIMARY KEY IDENTITY(1,1),
    TieuDe NVARCHAR(200),
    NoiDung NVARCHAR(MAX),
    NgayTao DATETIME DEFAULT GETDATE(),
    NguoiTao NVARCHAR(50)
);

-- 8. Bảng Phản Ánh
CREATE TABLE PhanAnhTbl (
    MaPhanAnh INT PRIMARY KEY IDENTITY(1,1), 
    NguoiGui NVARCHAR(50), 
    TieuDe NVARCHAR(200), 
    NoiDung NVARCHAR(MAX), 
    NgayGui DATETIME DEFAULT GETDATE(), 
    TrangThai NVARCHAR(50) DEFAULT N'Chờ xử lý', 
    PhanHoiCuaAdmin NVARCHAR(MAX)
);

-- 9. Bảng Tạm trú vắng
CREATE TABLE TamTruTbl (MaTamTru INT PRIMARY KEY IDENTITY(1,1), HoTen NVARCHAR(100), DiaChiThuongTru NVARCHAR(100), DiaChiTamTru NVARCHAR(100));
CREATE TABLE TamVangTbl (MaTamVang INT PRIMARY KEY IDENTITY(1,1), MaNhanKhau INT, ThoiHan DATETIME2(7), LyDo NVARCHAR(200));
GO

-- ======================================================================================
-- BƯỚC 3: NẠP DỮ LIỆU MẪU (THÁNG 1/2025 -> 12/2025)
-- ======================================================================================

-- 1. Nạp Hộ Khẩu & Căn Hộ
INSERT INTO HoKhauTbl (MaHoKhau, DiaChiThuongTru, NoiCap, NgayCap) VALUES
('HK001', N'P101 BlueMoon', N'Hà Nội', '2020-01-10'), ('HK002', N'P102 BlueMoon', N'Nam Định', '2020-05-20'),
('HK003', N'P201 BlueMoon', N'Thái Bình', '2021-02-15'), ('HK004', N'P202 BlueMoon', N'Hà Nam', '2021-06-10'),
('HK005', N'P301 BlueMoon', N'Nghệ An', '2019-11-11'), ('HK006', N'P302 BlueMoon', N'Hà Tĩnh', '2022-01-01'),
('HK007', N'P401 BlueMoon', N'Thanh Hóa', '2020-08-08'), ('HK008', N'P402 BlueMoon', N'Hải Phòng', '2021-12-12'),
('HK009', N'P501 BlueMoon', N'Hưng Yên', '2023-03-03'), ('HK010', N'P502 BlueMoon', N'Hà Nội', '2023-04-30');

INSERT INTO CanHoTbl (TenCanHo, Tang, DienTich, MaHoKhau) VALUES
(N'P101', N'1', 80.5, 'HK001'), (N'P102', N'1', 75.0, 'HK002'),
(N'P201', N'2', 80.5, 'HK003'), (N'P202', N'2', 75.0, 'HK004'),
(N'P301', N'3', 80.5, 'HK005'), (N'P302', N'3', 75.0, 'HK006'),
(N'P401', N'4', 80.5, 'HK007'), (N'P402', N'4', 75.0, 'HK008'),
(N'P501', N'5', 100.0, 'HK009'), (N'P502', N'5', 100.0, 'HK010');

-- 2. Nạp Nhân Khẩu
INSERT INTO NhanKhauTbl (MaHoKhau, HoTen, NgaySinh, QuanHe, CanCuocCongDan) VALUES 
('HK001', N'Nguyễn Văn An', '1985-01-01', N'Chủ hộ', '001085000001'),
('HK001', N'Trần Thị Bích', '1988-05-10', N'Vợ', '001088000002'),
('HK001', N'Nguyễn An Bình', '2015-09-05', N'Con', NULL),
('HK002', N'Lê Văn Cường', '1990-02-02', N'Chủ hộ', '001'),
('HK005', N'Bùi Thị Hoa', '1995-05-05', N'Chủ hộ', '005'); -- User 5 của bạn

-- 3. Nạp Tài Khoản (Admin + User1 -> User10)
INSERT INTO TaiKhoanTbl (TenDangNhap, MatKhau, Quyen, HoTenHienThi, MaHoKhau) VALUES 
('admin', '123456', 'Admin', N'Ban Quản Lý', NULL),
('user1', '123456', 'User', N'Nguyễn Văn An', 'HK001'),
('user2', '123456', 'User', N'Lê Văn Cường', 'HK002'),
('user3', '123456', 'User', N'Hoàng Văn Em', 'HK003'),
('user4', '123456', 'User', N'Đỗ Văn Giàu', 'HK004'),
('user5', '123456', 'User', N'Bùi Thị Hoa', 'HK005'),
('user6', '123456', 'User', N'Ngô Văn Lâm', 'HK006'),
('user7', '123456', 'User', N'Vũ Thị Mai', 'HK007'),
('user8', '123456', 'User', N'Đặng Văn Nam', 'HK008'),
('user9', '123456', 'User', N'Trịnh Văn Oanh', 'HK009'),
('user10', '123456', 'User', N'Mai Thị Phương', 'HK010');

-- 4. Nạp Dữ Liệu Tài Chính (Vòng lặp 12 tháng)
DECLARE @Thang INT = 1
WHILE @Thang <= 12
BEGIN
    DECLARE @IdPhiQuanLy INT, @IdPhiVeSinh INT, @IdPhiGuiXe INT;

    INSERT INTO KhoanThuTbl (TenKhoanThu, LoaiKhoanThu, SoTien, ThoiGianBatDau) VALUES 
    (N'Phí Quản Lý T' + CAST(@Thang AS NVARCHAR(2)) + '/2025', 1, 300000, DATEFROMPARTS(2025, @Thang, 1));
    SET @IdPhiQuanLy = SCOPE_IDENTITY();

    INSERT INTO KhoanThuTbl (TenKhoanThu, LoaiKhoanThu, SoTien, ThoiGianBatDau) VALUES 
    (N'Phí Vệ Sinh T' + CAST(@Thang AS NVARCHAR(2)) + '/2025', 1, 50000, DATEFROMPARTS(2025, @Thang, 1));
    SET @IdPhiVeSinh = SCOPE_IDENTITY();

    INSERT INTO KhoanThuTbl (TenKhoanThu, LoaiKhoanThu, SoTien, ThoiGianBatDau) VALUES 
    (N'Phí Gửi Xe T' + CAST(@Thang AS NVARCHAR(2)) + '/2025', 1, 100000, DATEFROMPARTS(2025, @Thang, 1));
    SET @IdPhiGuiXe = SCOPE_IDENTITY();

    -- Logic đóng tiền: T1-T10 đóng đủ, T11 đóng thiếu, T12 chưa đóng
    INSERT INTO KhoanThuTheoHoTbl (MaKhoanThu, MaHoKhau, SoTien, NgayNop)
    SELECT @IdPhiQuanLy, MaHoKhau, 300000, CASE WHEN @Thang <= 10 THEN DATEFROMPARTS(2025, @Thang, 10) ELSE NULL END FROM HoKhauTbl;

    INSERT INTO KhoanThuTheoHoTbl (MaKhoanThu, MaHoKhau, SoTien, NgayNop)
    SELECT @IdPhiVeSinh, MaHoKhau, 50000, CASE WHEN @Thang <= 10 THEN DATEFROMPARTS(2025, @Thang, 10) ELSE NULL END FROM HoKhauTbl;

    INSERT INTO KhoanThuTheoHoTbl (MaKhoanThu, MaHoKhau, SoTien, NgayNop)
    SELECT @IdPhiGuiXe, MaHoKhau, 100000, CASE WHEN @Thang <= 10 THEN DATEFROMPARTS(2025, @Thang, 10) ELSE NULL END FROM HoKhauTbl;

    SET @Thang = @Thang + 1;
END;

-- 5. Nạp Thông Báo & Phản Ánh
INSERT INTO ThongBaoTbl (TieuDe, NoiDung, NguoiTao, NgayTao) VALUES
(N'🎉 Chúc mừng năm mới', N'Chúc cư dân năm mới hạnh phúc.', 'admin', '2025-01-01'),
(N'⚠️ Cắt nước bảo trì', N'Cắt nước từ 14h-16h ngày mai.', 'admin', '2025-06-15'),
(N'📢 Thông báo thu phí T12', N'Đề nghị đóng phí tháng 12 trước ngày 15.', 'admin', '2025-12-01');

INSERT INTO PhanAnhTbl (NguoiGui, TieuDe, NoiDung, NgayGui, TrangThai) VALUES
('user1', N'Đèn hỏng', N'Đèn hành lang tối quá.', '2025-02-10', N'Đã xử lý'),
('user5', N'Mất nước', N'Sao chưa có nước vậy?', '2025-12-05', N'Chờ xử lý');
GO