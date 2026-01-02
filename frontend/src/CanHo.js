import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom'; // Thêm useLocation
import './Dashboard.css';
import { 
  FaHome, FaUsers, FaMoneyBillWave, FaBuilding, 
  FaTrash, FaPlus, FaEdit, FaAddressBook, FaComments 
} from 'react-icons/fa';

function CanHo() {
  const location = useLocation();
  const [data, setData] = useState([]);
  const [dsHoKhau, setDsHoKhau] = useState([]); // <--- State chứa danh sách hộ khẩu
  const [showModal, setShowModal] = useState(false);

  const [formData, setFormData] = useState({
    maCanHo: 0,
    tenCanHo: '',
    tang: '',
    dienTich: '',
    maHoKhau: '', // <--- Để rỗng, buộc người dùng phải chọn
    moTa: ''
  });

  useEffect(() => { 
    loadData(); 
    loadHoKhau(); // <--- Tải danh sách hộ khẩu khi vào trang
  }, []);

  const loadData = () => {
    axios.get('http://localhost:5045/api/CanHo')
      .then(res => setData(res.data))
      .catch(err => console.error(err));
  };

  // Hàm lấy danh sách hộ khẩu để nạp vào Dropdown
  const loadHoKhau = () => {
    axios.get('http://localhost:5045/api/HoKhau')
      .then(res => setDsHoKhau(res.data))
      .catch(err => console.error("Lỗi tải danh sách hộ khẩu:", err));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenAdd = () => {
    setFormData({ 
      maCanHo: 0, 
      tenCanHo: '', 
      tang: '', 
      dienTich: '', 
      maHoKhau: '', // Reset về rỗng
      moTa: '' 
    });
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setFormData(item);
    setShowModal(true);
  };

  const handleSave = () => {
    // Validate dữ liệu
    if (!formData.tenCanHo || !formData.maHoKhau) { 
      alert("Vui lòng nhập Tên căn hộ và chọn Chủ hộ!"); 
      return; 
    }

    const payload = { ...formData, dienTich: parseFloat(formData.dienTich) || 0 };

    if (formData.maCanHo !== 0) {
      // Sửa
      axios.put(`http://localhost:5045/api/CanHo/${formData.maCanHo}`, payload)
        .then(() => { alert("Cập nhật thành công!"); setShowModal(false); loadData(); })
        .catch(err => alert("Lỗi: " + err.message));
    } else {
      // Thêm mới
      const { maCanHo, ...newPayload } = payload;
      axios.post('http://localhost:5045/api/CanHo', newPayload)
        .then(() => { alert("Thêm mới thành công!"); setShowModal(false); loadData(); })
        .catch(err => alert("Lỗi: " + err.message));
    }
  };

  const handleDelete = (id) => {
    if (window.confirm("Bạn có chắc chắn muốn xóa căn hộ này?")) {
      axios.delete(`http://localhost:5045/api/CanHo/${id}`).then(() => loadData());
    }
  };

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR CHUẨN (Đã sửa Link) --- */}
      <div className="sidebar">
        <div className="logo"><FaBuilding /> BLUE MOON</div>
        <Link to="/" className="menu-item" style={{textDecoration: 'none'}}><FaHome /> Trang chủ</Link>
        <Link to="/nhan-khau" className="menu-item" style={{textDecoration: 'none'}}><FaUsers /> Quản lý Dân cư</Link>
        <Link to="/can-ho" className={`menu-item ${location.pathname === '/can-ho' ? 'active' : ''}`} style={{textDecoration: 'none'}}><FaBuilding /> Quản lý Căn hộ</Link>
        <Link to="/khoan-thu" className="menu-item" style={{textDecoration: 'none'}}><FaMoneyBillWave /> Quản lý Phí</Link>
        <Link to="/thanh-toan" className="menu-item" style={{textDecoration: 'none'}}><FaMoneyBillWave /> Thu tiền hộ dân</Link>
        <Link to="/ho-khau" className="menu-item" style={{textDecoration: 'none'}}><FaAddressBook /> Quản lý Hộ Khẩu</Link>
        <Link to="/phan-anh-admin" className="menu-item" style={{textDecoration: 'none'}}><FaComments /> Xử lý Phản ánh</Link>
      </div>

      <div className="main-content">
        <div className="header" style={{justifyContent: 'space-between'}}>
          <h2>Quản lý Căn Hộ</h2>
          <button className="btn-add" onClick={handleOpenAdd} style={{background: '#10b981', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px'}}>
            <FaPlus /> Thêm căn hộ
          </button>
        </div>

        <div className="recent-activity">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Tên Căn Hộ</th>
                <th>Tầng</th>
                <th>Diện tích (m2)</th>
                <th>Mã Chủ hộ</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.maCanHo}>
                  <td><b>{item.tenCanHo}</b></td>
                  <td>{item.tang}</td>
                  <td>{item.dienTich} m²</td>
                  <td>
                    <span style={{background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '4px', fontSize: '12px', fontWeight: 'bold'}}>
                      {item.maHoKhau}
                    </span>
                  </td>
                  <td>
                    <button onClick={() => handleEdit(item)} style={{color: '#2563eb', background: 'none', border: 'none', marginRight: '10px', cursor:'pointer'}} title="Sửa"><FaEdit /></button>
                    <button onClick={() => handleDelete(item.maCanHo)} style={{color: '#ef4444', background: 'none', border: 'none', cursor:'pointer'}} title="Xóa"><FaTrash /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>{formData.maCanHo ? "Sửa căn hộ" : "Thêm căn hộ mới"}</h3>
              
              <div className="form-group">
                <label>Tên căn hộ (*):</label>
                <input type="text" name="tenCanHo" value={formData.tenCanHo} onChange={handleInputChange} placeholder="VD: P301" />
              </div>

              {/* --- Dropdown chọn Chủ Hộ --- */}
              <div className="form-group">
                <label>Thuộc Hộ/Chủ Hộ (*):</label>
                <select name="maHoKhau" value={formData.maHoKhau} onChange={handleInputChange} style={{width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px'}}>
                  <option value="">-- Chọn Hộ Khẩu --</option>
                  {dsHoKhau.map(hk => (
                    <option key={hk.maHoKhau} value={hk.maHoKhau}>
                      {hk.maHoKhau} - {hk.diaChiThuongTru}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Tầng:</label>
                <input type="text" name="tang" value={formData.tang} onChange={handleInputChange} placeholder="VD: 3" />
              </div>
              
              <div className="form-group">
                <label>Diện tích (m2):</label>
                <input type="number" name="dienTich" value={formData.dienTich} onChange={handleInputChange} placeholder="VD: 85.5" />
              </div>
              
              <div className="form-group">
                <label>Mô tả:</label>
                <input type="text" name="moTa" value={formData.moTa} onChange={handleInputChange} />
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

export default CanHo;