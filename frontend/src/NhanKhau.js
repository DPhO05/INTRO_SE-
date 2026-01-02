import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom'; // Thêm useLocation để highlight menu active
import './Dashboard.css';
import { 
  FaHome, FaUsers, FaMoneyBillWave, FaBuilding, 
  FaTrash, FaPlus, FaEdit, FaComments, FaAddressBook 
} from 'react-icons/fa';

function NhanKhau() {
  const location = useLocation(); // Lấy đường dẫn hiện tại
  const [data, setData] = useState([]);
  const [dsHoKhau, setDsHoKhau] = useState([]);
  const [showModal, setShowModal] = useState(false);

  // State form
  const [formData, setFormData] = useState({
    maNhanKhau: 0,
    hoTen: '',
    canCuocCongDan: '',
    ngaySinh: '',
    quanHe: '',
    maHoKhau: '',
    trangThai: 1
  });

  useEffect(() => {
    loadData();
    loadHoKhau();
  }, []);

  const loadData = () => {
    axios.get('http://localhost:5045/api/NhanKhau')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  };

  const loadHoKhau = () => {
    axios.get('http://localhost:5045/api/HoKhau')
      .then(res => setDsHoKhau(res.data))
      .catch(err => console.error("Không lấy được danh sách hộ khẩu", err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEdit = (item) => {
    setFormData({
      maNhanKhau: item.maNhanKhau,
      hoTen: item.hoTen,
      canCuocCongDan: item.canCuocCongDan,
      // Cắt chuỗi lấy YYYY-MM-DD cho input type="date"
      ngaySinh: item.ngaySinh ? item.ngaySinh.slice(0, 10) : '', 
      quanHe: item.quanHe,
      maHoKhau: item.maHoKhau,
      trangThai: item.trangThai
    });
    setShowModal(true);
  };

  const handleOpenAdd = () => {
    setFormData({
      maNhanKhau: 0,
      hoTen: '',
      canCuocCongDan: '',
      ngaySinh: '',
      quanHe: '',
      maHoKhau: dsHoKhau.length > 0 ? dsHoKhau[0].maHoKhau : '',
      trangThai: 1
    });
    setShowModal(true);
  }

  const handleCloseModal = () => {
    setShowModal(false);
  }

  const handleSave = () => {
    if (!formData.hoTen || !formData.canCuocCongDan || !formData.maHoKhau) {
      alert("Vui lòng nhập họ tên, số CCCD và chọn Hộ khẩu!");
      return;
    }

    const payload = {
      ...formData,
      ngaySinh: formData.ngaySinh ? formData.ngaySinh : null,
      noiSinh: "Hà Nội", // Giá trị mặc định
      danToc: "Kinh",
      ngheNghiep: "Tự do",
      ghiChu: ""
    };

    if (formData.maNhanKhau && formData.maNhanKhau !== 0) {
      // Sửa
      axios.put(`http://localhost:5045/api/NhanKhau/${formData.maNhanKhau}`, payload)
        .then(() => { alert("Cập nhật thành công!"); setShowModal(false); loadData(); })
        .catch(err => alert("Lỗi cập nhật: " + (err.response?.data?.title || err.message)));
    } else {
      // Thêm mới
      const { maNhanKhau, ...newPayload } = payload;
      axios.post('http://localhost:5045/api/NhanKhau', newPayload)
        .then(() => { alert("Thêm mới thành công!"); setShowModal(false); loadData(); })
        .catch(err => alert("Lỗi thêm mới: " + (err.response?.data?.title || err.message)));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa cư dân này?")) {
      axios.delete(`http://localhost:5045/api/NhanKhau/${id}`)
        .then(() => { alert("Đã xóa thành công!"); loadData(); })
        .catch(err => alert("Không thể xóa (Có thể do ràng buộc dữ liệu)"));
    }
  };

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR ĐÃ SỬA: Dùng Link thay vì div tĩnh --- */}
      <div className="sidebar">
        <div className="logo"><FaBuilding /> BLUE MOON</div>
        <Link to="/" className="menu-item" style={{textDecoration: 'none'}}><FaHome /> Trang chủ</Link>
        <Link to="/nhan-khau" className={`menu-item ${location.pathname === '/nhan-khau' ? 'active' : ''}`} style={{textDecoration: 'none'}}><FaUsers /> Quản lý Dân cư</Link>
        <Link to="/can-ho" className="menu-item" style={{textDecoration: 'none'}}><FaBuilding /> Quản lý Căn hộ</Link>
        <Link to="/khoan-thu" className="menu-item" style={{textDecoration: 'none'}}><FaMoneyBillWave /> Quản lý Phí</Link>
        <Link to="/thanh-toan" className="menu-item" style={{textDecoration: 'none'}}><FaMoneyBillWave /> Thu tiền hộ dân</Link>
        <Link to="/ho-khau" className="menu-item" style={{textDecoration: 'none'}}><FaAddressBook /> Quản lý Hộ Khẩu</Link>
        <Link to="/phan-anh-admin" className="menu-item" style={{textDecoration: 'none'}}><FaComments /> Xử lý Phản ánh</Link>
      </div>

      <div className="main-content">
        <div className="header" style={{justifyContent: 'space-between'}}>
          <h2>Quản lý Nhân Khẩu</h2>
          <button className="btn-add" onClick={handleOpenAdd} style={{background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <FaPlus /> Thêm mới
          </button>
        </div>

        <div className="recent-activity">
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Họ Tên</th>
                <th>CCCD</th>
                <th>Thuộc Hộ</th>
                <th>Ngày Sinh</th>
                <th>Quan Hệ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.maNhanKhau}>
                  <td>{item.maNhanKhau}</td>
                  <td><b>{item.hoTen}</b></td>
                  <td>{item.canCuocCongDan}</td>
                  <td>
                    <span style={{background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'}}>
                      {item.maHoKhau}
                    </span>
                  </td>
                  <td>{item.ngaySinh ? new Date(item.ngaySinh).toLocaleDateString('vi-VN') : ''}</td>
                  <td><span className="status-badge status-pending">{item.quanHe}</span></td>
                  <td>
                    <button onClick={() => handleEdit(item)} style={{color: '#2563eb', background: 'none', border: 'none', cursor: 'pointer', marginRight: '15px'}} title="Sửa"><FaEdit /></button>
                    <button onClick={() => handleDelete(item.maNhanKhau)} style={{color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer'}} title="Xóa"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{formData.maNhanKhau ? "Cập nhật thông tin" : "Thêm Nhân Khẩu Mới"}</h3>
              
              <div className="form-group">
                <label>Thuộc Hộ Khẩu (*):</label>
                <select name="maHoKhau" value={formData.maHoKhau} onChange={handleInputChange} style={{width: '100%', padding: '8px'}}>
                    <option value="">-- Chọn hộ khẩu --</option>
                    {dsHoKhau.map(hk => (
                        <option key={hk.maHoKhau} value={hk.maHoKhau}>
                            {hk.maHoKhau} - {hk.diaChiThuongTru}
                        </option>
                    ))}
                </select>
              </div>

              <div className="form-group">
                <label>Họ và Tên (*):</label>
                <input type="text" name="hoTen" value={formData.hoTen} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>Số CCCD (*):</label>
                <input type="text" name="canCuocCongDan" value={formData.canCuocCongDan} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>Ngày sinh:</label>
                {/* Đổi sang type="date" cho hợp lý hơn */}
                <input type="date" name="ngaySinh" value={formData.ngaySinh} onChange={handleInputChange} />
              </div>

              <div className="form-group">
                <label>Quan hệ với chủ hộ:</label>
                <select name="quanHe" value={formData.quanHe} onChange={handleInputChange}>
                  <option value="">-- Chọn quan hệ --</option>
                  <option value="Chủ hộ">Chủ hộ</option>
                  <option value="Vợ">Vợ</option>
                  <option value="Chồng">Chồng</option>
                  <option value="Con">Con</option>
                  <option value="Bố/Mẹ">Bố/Mẹ</option>
                  <option value="Anh/Chị/Em">Anh/Chị/Em</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={handleCloseModal}>Hủy bỏ</button>
                <button className="btn-save" onClick={handleSave}>Lưu lại</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default NhanKhau;