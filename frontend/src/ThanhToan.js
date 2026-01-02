import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useLocation } from 'react-router-dom';
import './Dashboard.css';
import { 
  FaHome, FaUsers, FaMoneyBillWave, FaBuilding, 
  FaCheckCircle, FaTimesCircle, FaAddressBook, FaComments 
} from 'react-icons/fa';

function ThanhToan() {
  const location = useLocation();
  const [dsKhoanThu, setDsKhoanThu] = useState([]);
  const [selectedKhoanThu, setSelectedKhoanThu] = useState(null); // ID khoản thu đang chọn
  const [dsHoKhau, setDsHoKhau] = useState([]);
  const [showModal, setShowModal] = useState(false);
  
  // Dữ liệu thanh toán
  const [payData, setPayData] = useState({
    maHoKhau: '',
    soTien: 0
  });

  // 1. Tải danh sách khoản thu để nạp vào Dropdown
  useEffect(() => {
    axios.get('http://localhost:5045/api/KhoanThu')
      .then(res => {
        setDsKhoanThu(res.data);
        if (res.data.length > 0) {
            setSelectedKhoanThu(res.data[0].maKhoanThu); // Mặc định chọn cái đầu tiên
        }
      })
      .catch(err => console.error(err));
  }, []);

  // 2. Khi chọn khoản thu -> Tải danh sách tình trạng nộp tiền
  useEffect(() => {
    if (selectedKhoanThu) {
        loadStatusData();
    }
  }, [selectedKhoanThu]);

  const loadStatusData = () => {
    axios.get(`http://localhost:5045/api/ThanhToan/danh-sach-nop?maKhoanThu=${selectedKhoanThu}`)
    .then(res => setDsHoKhau(res.data))
    .catch(err => console.error(err));
  }

  // Mở modal thanh toán
  const handleOpenPay = (maHoKhau) => {
      // Tìm thông tin khoản thu đang chọn để lấy số tiền quy định
      const khoanThuHienTai = dsKhoanThu.find(k => k.maKhoanThu == selectedKhoanThu);
      const soTienMacDinh = khoanThuHienTai ? khoanThuHienTai.soTien : 0;

      setPayData({ 
        maHoKhau: maHoKhau, 
        soTien: soTienMacDinh // Tự động điền số tiền cần đóng
      });
      setShowModal(true);
  }

  // Xử lý nút Thanh Toán
  const handlePay = () => {
      const payload = {
          maKhoanThu: parseInt(selectedKhoanThu),
          maHoKhau: payData.maHoKhau,
          soTien: parseInt(payData.soTien)
      };

      axios.post('http://localhost:5045/api/ThanhToan', payload)
        .then(() => {
            alert("Thanh toán thành công!");
            setShowModal(false);
            loadStatusData(); // Tải lại bảng để cập nhật trạng thái
        })
        .catch(err => alert("Lỗi: " + (err.response?.data?.title || err.message)));
  }

  return (
    <div className="dashboard-container">
      {/* --- SIDEBAR CHUẨN --- */}
      <div className="sidebar">
        <div className="logo"><FaBuilding /> BLUE MOON</div>
        <Link to="/" className="menu-item" style={{textDecoration: 'none'}}><FaHome /> Trang chủ</Link>
        <Link to="/nhan-khau" className="menu-item" style={{textDecoration: 'none'}}><FaUsers /> Quản lý Dân cư</Link>
        <Link to="/can-ho" className="menu-item" style={{textDecoration: 'none'}}><FaBuilding /> Quản lý Căn hộ</Link>
        <Link to="/khoan-thu" className="menu-item" style={{textDecoration: 'none'}}><FaMoneyBillWave /> Quản lý Phí</Link>
        <Link to="/thanh-toan" className={`menu-item ${location.pathname === '/thanh-toan' ? 'active' : ''}`} style={{textDecoration: 'none'}}><FaMoneyBillWave /> Thu tiền hộ dân</Link>
        <Link to="/ho-khau" className="menu-item" style={{textDecoration: 'none'}}><FaAddressBook /> Quản lý Hộ Khẩu</Link>
        <Link to="/phan-anh-admin" className="menu-item" style={{textDecoration: 'none'}}><FaComments /> Xử lý Phản ánh</Link>
      </div>

      <div className="main-content">
        <div className="header">
          <h2>Thu Phí Chung Cư</h2>
        </div>

        {/* Bộ lọc chọn khoản thu */}
        <div style={{marginBottom: '20px', background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 2px 5px rgba(0,0,0,0.05)'}}>
            <label style={{fontWeight: 'bold', marginRight: '10px'}}>Chọn khoản thu cần kiểm tra:</label>
            <select 
                style={{padding: '10px', borderRadius: '5px', border: '1px solid #ccc', minWidth: '300px'}}
                onChange={(e) => setSelectedKhoanThu(e.target.value)}
                value={selectedKhoanThu || ''}
            >
                {dsKhoanThu.map(k => (
                    <option key={k.maKhoanThu} value={k.maKhoanThu}>
                        {k.tenKhoanThu} - ({k.soTien.toLocaleString()} đ)
                    </option>
                ))}
            </select>
        </div>

        <div className="recent-activity">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Mã Hộ</th>
                <th>Địa chỉ</th>
                <th>Trạng thái</th>
                <th>Số tiền đã nộp</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {dsHoKhau.map((item) => (
                <tr key={item.maHoKhau}>
                  <td><b>{item.maHoKhau}</b></td>
                  <td>{item.diaChi}</td>
                  <td>
                    {item.daNop 
                        ? <span className="status-badge status-paid"><FaCheckCircle /> Đã nộp</span> 
                        : <span className="status-badge status-pending"><FaTimesCircle /> Chưa nộp</span>
                    }
                  </td>
                  <td>{item.soTien ? item.soTien.toLocaleString() : 0} đ</td>
                  <td>
                    {!item.daNop && (
                        <button 
                            onClick={() => handleOpenPay(item.maHoKhau)}
                            style={{background: '#2563eb', color: 'white', border: 'none', padding: '6px 15px', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold'}}
                        >
                            Thanh toán
                        </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* MODAL THANH TOÁN */}
        {showModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Xác nhận thu tiền</h3>
              <p>Hộ khẩu: <b>{payData.maHoKhau}</b></p>
              
              <div className="form-group">
                <label>Số tiền thu (VNĐ):</label>
                <input 
                    type="number" 
                    value={payData.soTien} 
                    onChange={(e) => setPayData({...payData, soTien: e.target.value})} 
                />
              </div>

              <div className="modal-actions">
                <button className="btn-cancel" onClick={() => setShowModal(false)}>Hủy</button>
                <button className="btn-save" onClick={handlePay}>Xác nhận thu</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default ThanhToan;