import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './Dashboard.css';
import { 
  FaHome, FaUsers, FaMoneyBillWave, FaBuilding, 
  FaTrash, FaPlus, FaEdit, FaAddressBook, FaComments 
} from 'react-icons/fa';

function HoKhau() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false); // Biến kiểm tra đang thêm hay sửa

  // State form
  const [formData, setFormData] = useState({
    maHoKhau: '',
    diaChiThuongTru: '',
    noiCap: '',
    ngayCap: ''
  });

  useEffect(() => { loadData(); }, []);

  const loadData = () => {
    axios.get('http://localhost:5045/api/HoKhau')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenAdd = () => {
    setFormData({ 
      maHoKhau: '', 
      diaChiThuongTru: '', 
      noiCap: '', 
      ngayCap: '' 
    });
    setIsEdit(false); // Đặt trạng thái là Thêm mới
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setFormData({
      maHoKhau: item.maHoKhau,
      diaChiThuongTru: item.diaChiThuongTru,
      noiCap: item.noiCap,
      ngayCap: item.ngayCap ? item.ngayCap.slice(0, 10) : ''
    });
    setIsEdit(true); // Đặt trạng thái là Sửa
    setShowModal(true);
  };

  const handleSave = () => {
    if (!formData.maHoKhau || !formData.diaChiThuongTru) {
      alert("Vui lòng nhập Mã hộ khẩu và Địa chỉ!");
      return;
    }

    // Nếu đang sửa -> Gọi API PUT
    if (isEdit) {
      axios.put(`http://localhost:5045/api/HoKhau/${formData.maHoKhau}`, formData)
        .then(() => { alert("Cập nhật thành công!"); setShowModal(false); loadData(); })
        .catch(err => alert("Lỗi: " + err.message));
    } else {
      // Nếu đang thêm mới -> Gọi API POST
      axios.post('http://localhost:5045/api/HoKhau', formData)
        .then(() => { alert("Thêm mới thành công!"); setShowModal(false); loadData(); })
        .catch(err => alert("Lỗi: Mã hộ khẩu có thể đã tồn tại hoặc lỗi server."));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm(`Bạn có chắc muốn xóa hộ khẩu ${id}? Lưu ý: Phải xóa hết nhân khẩu và khoản thu liên quan trước!`)) {
      axios.delete(`http://localhost:5045/api/HoKhau/${id}`)
        .then(() => { alert("Xóa thành công!"); loadData(); })
        .catch(err => alert("Không thể xóa! Hộ này đang có nhân khẩu hoặc khoản thu liên quan."));
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
        <Link to="/khoan-thu" className="menu-item" style={{textDecoration: 'none'}}><FaMoneyBillWave /> Quản lý Phí</Link>
        <Link to="/thanh-toan" className="menu-item" style={{textDecoration: 'none'}}><FaMoneyBillWave /> Thu tiền hộ dân</Link>
        <Link to="/ho-khau" className={`menu-item ${location.pathname === '/ho-khau' ? 'active' : ''}`} style={{textDecoration: 'none'}}><FaAddressBook /> Quản lý Hộ Khẩu</Link>
        <Link to="/phan-anh-admin" className="menu-item" style={{textDecoration: 'none'}}><FaComments /> Xử lý Phản ánh</Link>
      </div>

      <div className="main-content">
        <div className="header" style={{justifyContent: 'space-between'}}>
          <h2>Quản lý Hộ Khẩu</h2>
          <button className="btn-add" onClick={handleOpenAdd} style={{background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <FaPlus /> Thêm Hộ Khẩu
          </button>
        </div>

        <div className="recent-activity">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Mã Hộ</th>
                <th>Địa chỉ thường trú</th>
                <th>Nơi cấp</th>
                <th>Ngày cấp</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.maHoKhau}>
                  <td><b>{item.maHoKhau}</b></td>
                  <td>{item.diaChiThuongTru}</td>
                  <td>{item.noiCap}</td>
                  <td>{item.ngayCap ? new Date(item.ngayCap).toLocaleDateString('vi-VN') : ''}</td>
                  <td>
                    <button onClick={() => handleEdit(item)} style={{color: '#2563eb', background: 'none', border: 'none', marginRight: '10px', cursor:'pointer'}} title="Sửa"><FaEdit /></button>
                    <button onClick={() => handleDelete(item.maHoKhau)} style={{color: '#ef4444', background: 'none', border: 'none', cursor:'pointer'}} title="Xóa"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{isEdit ? "Cập nhật Hộ Khẩu" : "Thêm Hộ Khẩu Mới"}</h3>
              
              <div className="form-group">
                <label>Mã Hộ Khẩu (*):</label>
                <input 
                    type="text" 
                    name="maHoKhau" 
                    value={formData.maHoKhau} 
                    onChange={handleInputChange} 
                    placeholder="VD: HK011"
                    disabled={isEdit} // Nếu đang sửa thì KHÔNG cho đổi Mã hộ
                    style={{backgroundColor: isEdit ? '#f3f4f6' : 'white'}}
                />
              </div>

              <div className="form-group">
                <label>Địa chỉ thường trú (*):</label>
                <input type="text" name="diaChiThuongTru" value={formData.diaChiThuongTru} onChange={handleInputChange} placeholder="VD: P601 BlueMoon" />
              </div>

              <div className="form-group">
                <label>Nơi cấp:</label>
                <input type="text" name="noiCap" value={formData.noiCap} onChange={handleInputChange} placeholder="VD: Hà Nội" />
              </div>

              <div className="form-group">
                <label>Ngày cấp:</label>
                <input type="date" name="ngayCap" value={formData.ngayCap} onChange={handleInputChange} />
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

export default HoKhau;