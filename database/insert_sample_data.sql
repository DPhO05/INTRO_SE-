USE QuanLyChungCu;
GO

-- =============================================
-- PHẦN 1: LÀM SẠCH DỮ LIỆU CŨ (RESET)
-- =============================================
-- Xóa bảng con trước, bảng cha sau để tránh lỗi khóa ngoại
DELETE FROM HoaDonTbl;
DELETE FROM KhoanThuTheoHoTbl;
DELETE FROM XeTbl;
DELETE FROM CanHoTbl;
DELETE FROM TamVangTbl;
DELETE FROM TamTruTbl;
DELETE FROM NhanKhauTbl;
DELETE FROM HoKhauTbl;

-- Reset lại bộ đếm số tự tăng (Identity) về 0
DBCC CHECKIDENT ('NhanKhauTbl', RESEED, 0);
DBCC CHECKIDENT ('CanHoTbl', RESEED, 0);
DBCC CHECKIDENT ('XeTbl', RESEED, 0);
DBCC CHECKIDENT ('KhoanThuTbl', RESEED, 0);
DBCC CHECKIDENT ('TamTruTbl', RESEED, 0);
GO

-- =============================================
-- PHẦN 2: TẠO DỮ LIỆU MỚI (10 HỘ)
-- =============================================

-- 1. TẠO LOẠI XE (Nếu chưa có)
IF NOT EXISTS (SELECT * FROM LoaiXeTbl WHERE MaLoaiXe = 'LX01')
    INSERT INTO LoaiXeTbl VALUES ('LX01', N'Xe máy');
IF NOT EXISTS (SELECT * FROM LoaiXeTbl WHERE MaLoaiXe = 'LX02')
    INSERT INTO LoaiXeTbl VALUES ('LX02', N'Ô tô');

-- 2. TẠO 10 HỘ KHẨU (HK001 -> HK010)
INSERT INTO HoKhauTbl (MaHoKhau, DiaChiThuongTru, NoiCap, NgayCap) VALUES 
('HK001', N'P301, Tầng 3, BlueMoon', N'CA Hà Nội', '2020-01-10'),
('HK002', N'P302, Tầng 3, BlueMoon', N'CA Nam Định', '2020-02-15'),
('HK003', N'P401, Tầng 4, BlueMoon', N'CA Thái Bình', '2021-03-20'),
('HK004', N'P402, Tầng 4, BlueMoon', N'CA Hà Nam', '2021-05-05'),
('HK005', N'P501, Tầng 5, BlueMoon', N'CA Nghệ An', '2019-11-11'),
('HK006', N'P502, Tầng 5, BlueMoon', N'CA Thanh Hóa', '2022-08-08'),
('HK007', N'P601, Tầng 6, BlueMoon', N'CA Hải Phòng', '2023-01-01'),
('HK008', N'P602, Tầng 6, BlueMoon', N'CA Hưng Yên', '2020-12-12'),
('HK009', N'P701, Tầng 7, BlueMoon', N'CA Bắc Ninh', '2021-09-09'),
('HK010', N'P702, Tầng 7, BlueMoon', N'CA Hà Nội', '2024-02-02');

-- 3. TẠO CĂN HỘ TƯƠNG ỨNG
INSERT INTO CanHoTbl (MaHoKhau, TenCanHo, Tang, DienTich, MoTa) VALUES 
('HK001', N'P301', N'3', 85.5, N'Căn góc, view hồ'),
('HK002', N'P302', N'3', 70.0, N'Căn thường'),
('HK003', N'P401', N'4', 100.0, N'Căn VIP 3 phòng ngủ'),
('HK004', N'P402', N'4', 65.5, N'Căn hộ nhỏ'),
('HK005', N'P501', N'5', 90.0, N'Nội thất cơ bản'),
('HK006', N'P502', N'5', 75.0, N'Full nội thất'),
('HK007', N'P601', N'6', 85.0, N'Hướng Đông Nam'),
('HK008', N'P602', N'6', 70.0, N'Hướng Tây Bắc'),
('HK009', N'P701', N'7', 110.0, N'Penhouse mini'),
('HK010', N'P702', N'7', 50.0, N'Studio');

-- 4. TẠO NHÂN KHẨU (GIA ĐÌNH)
-- Hộ 1: Gia đình 3 người
INSERT INTO NhanKhauTbl (MaHoKhau, HoTen, CanCuocCongDan, NgaySinh, QuanHe, TrangThai) VALUES 
('HK001', N'Nguyễn Văn An', '001090001111', '1980-01-01', N'Chủ hộ', 1),
('HK001', N'Trần Thị Bưởi', '001090001112', '1982-02-02', N'Vợ', 1),
('HK001', N'Nguyễn Văn Tí', NULL, '2010-05-05', N'Con', 1);

-- Hộ 2: Vợ chồng trẻ
INSERT INTO NhanKhauTbl (MaHoKhau, HoTen, CanCuocCongDan, NgaySinh, QuanHe, TrangThai) VALUES 
('HK002', N'Lê Văn Cường', '001090002222', '1995-03-03', N'Chủ hộ', 1),
('HK002', N'Phạm Thị Duyên', '001090002223', '1997-04-04', N'Vợ', 1);

-- Hộ 3: Đại gia đình
INSERT INTO NhanKhauTbl (MaHoKhau, HoTen, CanCuocCongDan, NgaySinh, QuanHe, TrangThai) VALUES 
('HK003', N'Hoàng Văn Em', '001090003333', '1960-06-06', N'Chủ hộ', 1),
('HK003', N'Ngô Thị Phượng', '001090003334', '1962-07-07', N'Vợ', 1),
('HK003', N'Hoàng Văn Giang', '001090003335', '1990-08-08', N'Con', 1);

-- Các hộ còn lại (Độc thân hoặc đơn giản)
INSERT INTO NhanKhauTbl (MaHoKhau, HoTen, CanCuocCongDan, NgaySinh, QuanHe, TrangThai) VALUES 
('HK004', N'Vũ Thị Hạnh', '001090004444', '1988-09-09', N'Chủ hộ', 1),
('HK005', N'Đặng Văn Hùng', '001090005555', '1992-10-10', N'Chủ hộ', 1),
('HK006', N'Bùi Thị Linh', '001090006666', '1999-11-11', N'Chủ hộ', 1),
('HK007', N'Đỗ Văn Minh', '001090007777', '1985-12-12', N'Chủ hộ', 1),
('HK008', N'Hồ Thị Nga', '001090008888', '1993-01-13', N'Chủ hộ', 1),
('HK009', N'Dương Văn Oai', '001090009999', '1975-02-14', N'Chủ hộ', 1),
('HK010', N'Lý Thị Phương', '001090000000', '2000-03-15', N'Chủ hộ', 1);

-- 5. TẠO XE (PHƯƠNG TIỆN)
INSERT INTO XeTbl (MaHoKhau, MaLoaiXe, TenXe, BienKiemSoat, MoTa) VALUES 
('HK001', 'LX02', N'Mazda CX5', N'30H-123.45', N'Xe trắng'),
('HK001', 'LX01', N'SH 150i', N'29-B1 567.89', N'Xe xám'),
('HK002', 'LX01', N'Vision', N'18-B2 999.99', N'Xe đỏ'),
('HK003', 'LX02', N'Mercedes GLC300', N'30A-888.88', N'Xe đen'),
('HK005', 'LX01', N'Wave Alpha', N'37-C1 111.22', N'Xe xanh');

-- 6. TẠO KHOẢN THU MẪU
INSERT INTO KhoanThuTbl (TenKhoanThu, ThoiGianBatDau, ThoiGianKetThuc, LoaiKhoanThu, ChiTiet, GhiChu) VALUES 
(N'Phí dịch vụ T1/2024', '2024-01-01', '2024-01-31', 0, N'7000đ/m2', N'Bắt buộc'),
(N'Phí gửi xe T1/2024', '2024-01-01', '2024-01-31', 0, N'Xe máy 70k, Ô tô 1tr2', N'Theo phương tiện'),
(N'Ủng hộ Tết 2024', '2024-01-15', '2024-02-15', 1, N'Tùy tâm', N'Tự nguyện');

GO