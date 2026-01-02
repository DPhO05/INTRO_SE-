import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css';
import { 
  FaHome, FaUsers, FaMoneyBillWave, FaCar, 
  FaBuilding, FaBell, FaComments, FaSignOutAlt 
} from 'react-icons/fa';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';

const COLORS = ['#2563eb', '#f59e0b', '#10b981'];

function Dashboard() {
  const location = useLocation();
  const token = localStorage.getItem('token');
  
  // State 1: Số liệu tổng quát (Cards)
  const [stats, setStats] = useState({ nhanKhau: 0, canHo: 0, xe: 0, doanhThu: 0 });

  // State 2: Dữ liệu biểu đồ (Charts)
  const [chartData, setChartData] = useState({ revenue: [], residents: [] });

  // State 3: Dữ liệu Hóa đơn mới nhất
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    // 1. Gọi API Thống kê
    axios.get('http://localhost:5045/api/Dashboard/stats', {
        headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setStats(res.data))
      .catch(err => console.error(err));

    // 2. Gọi API Biểu đồ
    axios.get('http://localhost:5045/api/Dashboard/charts', {
        headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setChartData({ revenue: res.data.revenue, residents: res.data.residents }))
      .catch(err => console.error(err));

    // 3. Gọi API Hóa đơn mới nhất
    axios.get('http://localhost:5045/api/Dashboard/recent-transactions', {
        headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setRecentTransactions(res.data))
      .catch(err => console.error("Lỗi lấy hóa đơn:", err));

  }, [token]);

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login'; 
  };

  return (
    <div className="dashboard-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="logo"><FaBuilding /> BLUE MOON</div>
        <Link to="/" className={`menu-item ${location.pathname === '/' ? 'active' : ''}`} style={{textDecoration: 'none'}}><FaHome /> Trang chủ</Link>
        <Link to="/nhan-khau" className={`menu-item ${location.pathname === '/nhan-khau' ? 'active' : ''}`} style={{textDecoration: 'none'}}><FaUsers /> Quản lý Dân cư</Link>
        <Link to="/can-ho" className={`menu-item ${location.pathname === '/can-ho' ? 'active' : ''}`} style={{textDecoration: 'none'}}><FaBuilding /> Quản lý Căn hộ</Link>
        <Link to="/khoan-thu" className={`menu-item ${location.pathname === '/khoan-thu' ? 'active' : ''}`} style={{textDecoration: 'none'}}><FaMoneyBillWave /> Quản lý Phí</Link>
        <Link to="/thanh-toan" className={`menu-item ${location.pathname === '/thanh-toan' ? 'active' : ''}`} style={{textDecoration: 'none'}}><FaMoneyBillWave /> Thu tiền hộ dân</Link>
        <Link to="/ho-khau" className={`menu-item ${location.pathname === '/ho-khau' ? 'active' : ''}`} style={{textDecoration: 'none'}}><FaUsers /> Quản lý Hộ Khẩu</Link>
        
        {/* Mục mới thêm: Xử lý phản ánh */}
        <Link to="/phan-anh-admin" className={`menu-item ${location.pathname === '/phan-anh-admin' ? 'active' : ''}`} style={{textDecoration: 'none'}}><FaComments /> Xử lý Phản ánh</Link>
      </div>

      {/* MAIN CONTENT */}
      <div className="main-content">
        <div className="header">
          <div className="welcome-text">
            <h2>Xin chào, Ban Quản Trị 👋</h2>
            <p>Đây là tình hình hoạt động của chung cư hôm nay.</p>
          </div>
          <div className="user-profile">
            <FaBell style={{ marginRight: '15px', color: '#6b7280', cursor: 'pointer' }} />
            <img src="https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff" alt="Avatar" style={{ width: '35px', borderRadius: '50%' }} />
            <span style={{ fontWeight: '600', fontSize: '14px', marginRight: '10px' }}>Admin</span>
            
            <button onClick={handleLogout} style={{
                fontSize: '12px', padding: '8px 12px', background: '#fee2e2', display: 'flex', alignItems: 'center', gap: '5px',
                color: '#dc2626', border: 'none', borderRadius: '4px', cursor: 'pointer'
            }}>
                <FaSignOutAlt /> Thoát
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="icon-box" style={{ background: '#dbeafe', color: '#2563eb' }}><FaUsers /></div>
            <div className="stat-info"><h3>{stats.nhanKhau}</h3><p>Tổng Nhân Khẩu</p></div>
          </div>
          <div className="stat-card">
            <div className="icon-box" style={{ background: '#d1fae5', color: '#059669' }}><FaMoneyBillWave /></div>
            <div className="stat-info"><h3>{stats.doanhThu.toLocaleString()} đ</h3><p>Doanh thu thực tế</p></div>
          </div>
          <div className="stat-card">
            <div className="icon-box" style={{ background: '#fee2e2', color: '#dc2626' }}><FaBuilding /></div>
            <div className="stat-info"><h3>{stats.canHo}</h3><p>Tổng Căn Hộ</p></div>
          </div>
          <div className="stat-card">
            <div className="icon-box" style={{ background: '#fef3c7', color: '#d97706' }}><FaCar /></div>
            <div className="stat-info"><h3>{stats.xe}</h3><p>Phương tiện</p></div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-container">
          <div className="chart-card">
            <h3>Biểu đồ Doanh thu (Theo tháng)</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData.revenue}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => value.toLocaleString() + ' đ'} />
                <Line type="monotone" dataKey="tien" stroke="#2563eb" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-card">
            <h3>Cơ cấu Dân cư</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={chartData.residents} cx="50%" cy="50%" innerRadius={60} outerRadius={80} fill="#8884d8" paddingAngle={5} dataKey="value">
                  {chartData.residents.map((entry, index) => (<Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="recent-activity">
          <h3>Hóa đơn mới nhất</h3>
          <table className="custom-table">
            <thead>
              <tr>
                <th>Mã Hộ</th>
                <th>Chủ Hộ</th>
                <th>Nội dung thu</th>
                <th>Số tiền</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {recentTransactions.length > 0 ? (
                recentTransactions.map((item, index) => (
                  <tr key={index}>
                    <td><b>{item.maHo}</b></td>
                    <td>{item.chuHo}</td>
                    <td>{item.noiDung}</td>
                    <td style={{fontWeight: 'bold', color: '#059669'}}>{item.soTien.toLocaleString()} đ</td>
                    <td><span className="status-badge status-paid">{item.trangThai}</span></td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" style={{textAlign: 'center', color: '#6b7280'}}>Chưa có giao dịch nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;