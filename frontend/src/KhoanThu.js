import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './Dashboard.css';
import { 
  FaHome, FaUsers, FaMoneyBillWave, FaBuilding, 
  FaTrash, FaPlus, FaEdit, FaAddressBook, FaComments 
} from 'react-icons/fa';

function KhoanThu() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // State form
  const [formData, setFormData] = useState({
    maKhoanThu: 0,
    tenKhoanThu: '',
    soTien: '', // <--- MỚI: Thêm trường số tiền
    loaiKhoanThu: 1, // 1: Bắt buộc, 0: Tự nguyện
    thoiGianBatDau: '',
    thoiGianKetThuc: ''
  });

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    axios.get('http://localhost:5045/api/KhoanThu')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenAdd = () => {
    // Reset form khi thêm mới
    setFormData({ 
      maKhoanThu: 0, 
      tenKhoanThu: '', 
      soTien: '', 
      loaiKhoanThu: 1, 
      thoiGianBatDau: '', 
      thoiGianKetThuc: '' 
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setFormData({
      maKhoanThu: item.maKhoanThu,
      tenKhoanThu: item.tenKhoanThu,
      soTien: item.soTien, // Load số tiền lên form
      loaiKhoanThu: item.loaiKhoanThu,
      thoiGianBatDau: item.thoiGianBatDau ? item.thoiGianBatDau.slice(0, 10) : '',
      thoiGianKetThuc: item.thoiGianKetThuc ? item.thoiGianKetThuc.slice(0, 10) : ''
    });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.tenKhoanThu || !formData.thoiGianBatDau) {
      alert("Vui lòng nhập Tên khoản thu và Ngày bắt đầu!");
      return;
    }

    // Chuẩn bị dữ liệu gửi đi
    const payload = {
      ...formData,
      soTien: parseFloat(formData.soTien) || 0, // Chuyển đổi sang số
      loaiKhoanThu: parseInt(formData.loaiKhoanThu),
      thoiGianKetThuc: formData.thoiGianKetThuc ? formData.thoiGianKetThuc : null
    };

    if (formData.maKhoanThu !== 0) {
      // Sửa
      axios.put(`http://localhost:5045/api/KhoanThu/${formData.maKhoanThu}`, payload)
        .then(() => { alert("Cập nhật thành công!"); setShowModal(false); loadData(); })
        .catch(err => alert("Lỗi: " + err.message));
    } else {
      // Thêm mới
      const { maKhoanThu, ...newPayload } = payload;
      axios.post('http://localhost:5045/api/KhoanThu', newPayload)
        .then(() => { alert("Thêm mới thành công!"); setShowModal(false); loadData(); })
        .catch(err => alert("Lỗi: " + err.message));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa khoản thu này?")) {
      axios.delete(`http://localhost:5045/api/KhoanThu/${id}`).then(() => loadData());
    }
  };

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR CHUẨN --- */}
      <div className="sidebar">
        <div className="logo"><FaBuilding /> BLUE MOON</div>
        <Link to="/" className="menu-item" style={{textDecoration: 'none'}}><FaHome /> Trang chủ</Link>
        <Link to="/nhan-khau" className="menu-item" style={{textDecoration: 'none'}}><FaUsers /> Quản lý Dân cư</Link>
        <Link to="/can-ho" className="menu-item" style={{textDecoration: 'none'}}><FaBuilding /> Quản lý Căn hộ</Link>
        <Link to="/khoan-thu" className={`menu-item ${location.pathname === '/khoan-thu' ? 'active' : ''}`} style={{textDecoration: 'none'}}><FaMoneyBillWave /> Quản lý Phí</Link>
        <Link to="/thanh-toan" className="menu-item" style={{textDecoration: 'none'}}><FaMoneyBillWave /> Thu tiền hộ dân</Link>
        <Link to="/ho-khau" className="menu-item" style={{textDecoration: 'none'}}><FaAddressBook /> Quản lý Hộ Khẩu</Link>
        <Link to="/phan-anh-admin" className="menu-item" style={{textDecoration: 'none'}}><FaComments /> Xử lý Phản ánh</Link>
      </div>

      <div className="main-content">
        <div className="header" style={{justifyContent: 'space-between'}}>
          <h2>Quản lý Khoản Thu</h2>
          <button className="btn-add" onClick={handleOpenAdd} style={{background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <FaPlus /> Thêm khoản thu
          </button>
        </div>

        <div className="recent-activity">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tên Khoản Thu</th>
                <th>Số tiền (VNĐ)</th>
                <th>Loại phí</th>
                <th>Ngày bắt đầu</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.maKhoanThu}>
                  <td><b>{item.tenKhoanThu}</b></td>
                  <td style={{fontWeight: 'bold', color: '#059669'}}>
                    {item.soTien ? item.soTien.toLocaleString() : 0} đ
                  </td>
                  <td>
                    {item.loaiKhoanThu === 1 
                      ? <span className="status-badge status-paid">Bắt buộc</span> 
                      : <span className="status-badge status-pending">Tự nguyện</span>}
                  </td>
                  <td>{new Date(item.thoiGianBatDau).toLocaleDateString('vi-VN')}</td>
                  <td>
                    <button onClick={() => handleEdit(item)} style={{color: '#2563eb', background: 'none', border: 'none', marginRight: '10px', cursor:'pointer'}} title="Sửa"><FaEdit /></button>
                    <button onClick={() => handleDelete(item.maKhoanThu)} style={{color: '#ef4444', background: 'none', border: 'none', cursor:'pointer'}} title="Xóa"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{formData.maKhoanThu ? "Cập nhật Khoản Thu" : "Thêm Khoản Thu Mới"}</h3>
              
              <div className="form-group">
                <label>Tên khoản thu (*):</label>
                <input type="text" name="tenKhoanThu" value={formData.tenKhoanThu} onChange={handleInputChange} placeholder="VD: Phí vệ sinh T12/2025" />
              </div>

              {/* --- MỚI: Nhập số tiền --- */}
              <div className="form-group">
                <label>Số tiền thu định kỳ (VNĐ):</label>
                <input type="number" name="soTien" value={formData.soTien} onChange={handleInputChange} placeholder="VD: 50000" />
              </div>

              <div className="form-group">
                <label>Loại phí:</label>
                <select name="loaiKhoanThu" value={formData.loaiKhoanThu} onChange={handleInputChange}>
                  <option value={1}>Bắt buộc</option>
                  <option value={0}>Tự nguyện (Đóng góp)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Ngày bắt đầu (*):</label>
                <input type="date" name="thoiGianBatDau" value={formData.thoiGianBatDau} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>Ngày kết thúc (Nếu có):</label>
                <input type="date" name="thoiGianKetThuc" value={formData.thoiGianKetThuc} onChange={handleInputChange} />
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button className="btn-save" onClick={handleSave}>Lưu lại</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KhoanThu;