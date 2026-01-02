import React, { useEffect, useState, useCallback } from 'react';
import axios from 'axios';

// --- ICON COMPONENTS (Giữ nguyên) ---
const IconHome = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>;
const IconWallet = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg>;
const IconUsers = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 00-3-3.87"></path><path d="M16 3.13a4 4 0 010 7.75"></path></svg>;
const IconCar = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 16H9m10 4h3v-7.25c0-2.389-.261-4.75-4.25-4.75V4a2 2 0 00-2-2h-8a2 2 0 00-2 2v4.5C2.26 8.5 2 10.86 2 13.25V20h3M5 20l2-2h10l2 2"></path></svg>;
const IconForm = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 00-2 2h12a2 2 0 00-2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>;
const IconBell = () => <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"></path><path d="M13.73 21a2 2 0 01-3.46 0"></path></svg>;

function UserDashboard() {
  const hoTen = localStorage.getItem('hoTen') || "Cư dân";
  const token = localStorage.getItem('token'); 
  const API_URL = 'http://localhost:5045/api'; // Cấu hình URL API

  const [activeTab, setActiveTab] = useState('overview');
  
  // --- STATE DỮ LIỆU THẬT ---
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
      members: [],
      unpaidFees: [],
      paidFees: [],
      vehicles: [],
      notices: []
  });

  // Load toàn bộ dữ liệu Dashboard
  const loadDashboardData = useCallback(() => {
    setLoading(true);
    axios.get(`${API_URL}/UserDashboard`, {
        headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => {
        // Map dữ liệu từ API C# vào State React
        setData({
            members: res.data.members,
            unpaidFees: res.data.unpaidFees,
            paidFees: res.data.paidFees,
            vehicles: res.data.vehicles,
            notices: res.data.notices
        });
        setLoading(false);
    })
    .catch(err => {
        console.error("Lỗi tải dashboard:", err);
        setLoading(false);
        // Nếu lỗi 401 (Hết hạn token) -> logout
        if(err.response && err.response.status === 401) handleLogout();
    });
  }, [token]);

  useEffect(() => {
    loadDashboardData();
  }, [loadDashboardData]);

  // Logic Phản ánh (Giữ nguyên nhưng sửa API)
  const [listPhanAnh, setListPhanAnh] = useState([]);
  const [formData, setFormData] = useState({ tieuDe: '', noiDung: '' });

  const handleSendPhanAnh = () => {
    if (!formData.tieuDe || !formData.noiDung) return alert("Nhập đủ thông tin!");
    
    axios.post(`${API_URL}/PhanAnh`, formData, {
        headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
        alert("Gửi thành công!");
        setFormData({ tieuDe: '', noiDung: '' });
        // Có thể reload list phản ánh nếu cần
    }).catch(err => alert("Lỗi gửi: " + err.message));
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = '/login';
  };

  // --- RENDER COMPONENT (Đã map với biến 'data') ---

  const SidebarItem = ({ id, label, icon, active }) => (
    <div onClick={() => setActiveTab(id)} style={{
        display: 'flex', alignItems: 'center', padding: '12px 20px', cursor: 'pointer', borderRadius: '12px', marginBottom: '8px',
        background: active ? '#2563eb' : 'transparent', color: active ? 'white' : '#4b5563', fontWeight: active ? '600' : 'normal', transition: 'all 0.2s'
    }}>
        <div style={{ marginRight: '12px' }}>{icon}</div><span>{label}</span>
    </div>
  );

  const renderOverview = () => {
    if (loading) return <div>Đang tải dữ liệu...</div>;
    const totalDebt = data.unpaidFees.reduce((acc, curr) => acc + curr.amount, 0);

    return (
      <div style={styles.fadeIn}>
        {/* Banner Phí */}
        <div style={{
            background: totalDebt > 0 ? 'linear-gradient(135deg, #ef4444, #f87171)' : '#10b981',
            borderRadius: '16px', padding: '24px', color: 'white', marginBottom: '24px',
            boxShadow: '0 10px 15px -3px rgba(239, 68, 68, 0.3)'
        }}>
            <h3 style={{ margin: 0, opacity: 0.9 }}>Tổng phí cần thanh toán</h3>
            <div style={{ fontSize: '32px', fontWeight: 'bold', margin: '10px 0' }}>
                {totalDebt.toLocaleString()} VNĐ
            </div>
            <p style={{ margin: 0, opacity: 0.9 }}>
                {totalDebt > 0 ? `Bạn có ${data.unpaidFees.length} khoản chưa đóng` : "Tuyệt vời! Bạn đã hoàn thành nghĩa vụ phí."}
            </p>
        </div>

        {/* Thông báo */}
        <div style={{ marginBottom: '24px' }}>
            <h3 style={styles.sectionTitle}>🔔 Thông báo từ Ban Quản Lý</h3>
            {data.notices.length === 0 && <p style={{color:'#666'}}>Không có thông báo mới.</p>}
            {data.notices.map(notice => (
                <div key={notice.id} style={{
                    padding: '16px', background: 'white', borderRadius: '12px', marginBottom: '10px', 
                    borderLeft: notice.urgent ? '4px solid #ef4444' : '4px solid #3b82f6', boxShadow: styles.cardShadow
                }}>
                    <div style={{fontWeight: 'bold', marginBottom: '4px'}}>{notice.title}</div>
                    <small style={{color: '#9ca3af'}}>{notice.date}</small>
                </div>
            ))}
        </div>

        {/* Grid: Xe & Thành viên */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: styles.cardShadow }}>
                <h4 style={{marginTop: 0, marginBottom: '15px'}}>👨‍👩‍👧‍👦 Thành viên ({data.members.length})</h4>
                <div style={{display: 'flex', gap: '10px', overflowX: 'auto'}}>
                    {data.members.map(mem => (
                        <div key={mem.id} style={{textAlign: 'center', minWidth: '70px'}}>
                            <div style={{fontSize: '30px', background: '#f3f4f6', borderRadius: '50%', width: '50px', height: '50px', lineHeight: '50px', margin: '0 auto'}}>{mem.avatar}</div>
                            <div style={{fontSize: '12px', marginTop: '5px', fontWeight: '600'}}>{mem.name}</div>
                            <div style={{fontSize: '10px', color: '#6b7280'}}>{mem.role}</div>
                        </div>
                    ))}
                </div>
            </div>

             <div style={{ background: 'white', padding: '20px', borderRadius: '16px', boxShadow: styles.cardShadow }}>
                <h4 style={{marginTop: 0, marginBottom: '15px'}}>🚗 Phương tiện ({data.vehicles.length})</h4>
                {data.vehicles.length === 0 && <p style={{fontSize:'13px', color:'#666'}}>Chưa đăng ký xe nào.</p>}
                {data.vehicles.map(v => (
                    <div key={v.id} style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '14px', borderBottom: '1px solid #f3f4f6', paddingBottom: '8px'}}>
                        <div><span style={{fontWeight: 'bold'}}>{v.plate}</span> <span style={{color: '#6b7280'}}>({v.type})</span></div>
                        <span style={{color: v.status.includes('Trong') ? '#10b981' : '#6b7280', fontSize: '12px', fontWeight: '600'}}>● {v.status}</span>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  };

  const renderFees = () => (
    <div style={styles.fadeIn}>
        <h2 style={styles.pageTitle}>Quản lý chi phí</h2>
        <h4 style={{color: '#ef4444'}}>Cần thanh toán</h4>
        {data.unpaidFees.length === 0 && <p>Không có khoản nợ nào.</p>}
        {data.unpaidFees.map(fee => (
            <div key={fee.id} style={styles.feeCard}>
                <div><div style={{fontWeight: 'bold'}}>{fee.title}</div><div style={{fontSize: '12px', color: '#ef4444'}}>Hạn: {fee.date}</div></div>
                <div style={{textAlign: 'right'}}><div style={{fontWeight: 'bold', fontSize: '16px'}}>{fee.amount.toLocaleString()} đ</div><button style={{...styles.btnPrimary, padding: '4px 10px', fontSize: '12px', marginTop: '5px'}}>Thanh toán</button></div>
            </div>
        ))}
        <h4 style={{color: '#10b981', marginTop: '30px'}}>Lịch sử đã đóng</h4>
        {data.paidFees.map(fee => (
            <div key={fee.id} style={{...styles.feeCard, borderLeft: '4px solid #10b981'}}>
                <div><div style={{fontWeight: 'bold', color: '#374151'}}>{fee.title}</div><div style={{fontSize: '12px', color: '#6b7280'}}>Ngày đóng: {fee.date}</div></div>
                <div style={{fontWeight: 'bold', color: '#10b981'}}>{fee.amount.toLocaleString()} đ</div>
            </div>
        ))}
    </div>
  );

  // Render các phần AdminForm và Feedback giữ nguyên logic hiển thị nhưng dùng API...
  // (Để code gọn tôi không paste lại phần AdminForm và FeedbackForm vì nó ít thay đổi, 
  // chỉ cần bạn thay đổi URL axios trong các hàm gửi là được)
  
  // MẪU RENDER CHÍNH
  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif', background: '#f3f4f6', minHeight: '100vh', display: 'flex' }}>
      <div style={{ width: '250px', background: 'white', padding: '20px', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '30px', paddingLeft: '10px' }}>
            <h2 style={{ color: '#2563eb', margin: 0 }}>Blue Moon 🏢</h2>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '13px' }}>Cổng thông tin cư dân</p>
        </div>
        <nav style={{ flex: 1 }}>
            <SidebarItem id="overview" label="Tổng quan" icon={<IconHome />} active={activeTab === 'overview'} />
            <SidebarItem id="fees" label="Tài chính" icon={<IconWallet />} active={activeTab === 'fees'} />
            <SidebarItem id="members" label="Căn hộ & Xe" icon={<IconUsers />} active={activeTab === 'members'} />
            <SidebarItem id="admin" label="Hành chính" icon={<IconForm />} active={activeTab === 'admin'} />
            <SidebarItem id="feedback" label="Phản ánh" icon={<IconBell />} active={activeTab === 'feedback'} />
        </nav>
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px' }}>
             <button onClick={handleLogout} style={{ width: '100%', padding: '8px', border: '1px solid #ef4444', color: '#ef4444', background: 'white', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>Đăng xuất</button>
        </div>
      </div>

      <div style={{ flex: 1, padding: '30px 40px', overflowY: 'auto' }}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'fees' && renderFees()}
        {/* Các tab khác tương tự... */}
      </div>
    </div>
  );
}

const styles = {
    fadeIn: { animation: 'fadeIn 0.3s ease-in-out' },
    cardShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    sectionTitle: { fontSize: '18px', color: '#1f2937', marginBottom: '15px' },
    pageTitle: { fontSize: '24px', color: '#111827', marginBottom: '25px' },
    feeCard: {
        background: 'white', padding: '20px', borderRadius: '12px', marginBottom: '15px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    btnPrimary: {
        background: '#2563eb', color: 'white', border: 'none', padding: '12px 24px',
        borderRadius: '8px', fontWeight: '600', cursor: 'pointer', transition: 'background 0.2s'
    }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`;
document.head.appendChild(styleSheet);

export default UserDashboard;