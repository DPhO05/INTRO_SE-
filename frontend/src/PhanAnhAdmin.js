import React, { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './Dashboard.css'; // Tận dụng CSS cũ
import { FaArrowLeft } from 'react-icons/fa';

function PhanAnhAdmin() {
  const token = localStorage.getItem('token');
  const [listPhanAnh, setListPhanAnh] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null); // Lưu bài đang chọn để trả lời
  const [replyText, setReplyText] = useState('');

  // 1. Tải danh sách phản ánh
  const loadData = useCallback(() => {
    axios.get('http://localhost:5045/api/PhanAnh', {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setListPhanAnh(res.data))
    .catch(err => console.error(err));
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 2. Xử lý khi bấm vào một dòng
  const handleSelect = (item) => {
    setSelectedItem(item);
    setReplyText(item.phanHoiCuaAdmin || ''); // Nếu đã trả lời trước đó thì hiện lại
  };

  // 3. Gửi câu trả lời lên Server
  const handleSubmitReply = () => {
    if (!selectedItem) return;

    const data = {
      ...selectedItem,
      phanHoiCuaAdmin: replyText,
      trangThai: "Đã xử lý" // Quan trọng: Đổi trạng thái
    };

    axios.put(`http://localhost:5045/api/PhanAnh/${selectedItem.maPhanAnh}`, data, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(() => {
      alert("Đã trả lời cư dân thành công!");
      setSelectedItem(null); // Tắt form
      loadData(); // Load lại danh sách để cập nhật trạng thái xanh
    })
    .catch(err => alert("Lỗi: " + err.message));
  };

  return (
    <div className="dashboard-container" style={{display: 'block', padding: '20px'}}>
      {/* Header nhỏ */}
      <div style={{marginBottom: '20px', borderBottom: '1px solid #ddd', paddingBottom: '10px'}}>
        <Link to="/" style={{textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', color: '#2563eb', fontWeight: 'bold'}}>
            <FaArrowLeft /> Quay lại Dashboard
        </Link>
        <h2>📬 Trung Tâm Xử Lý Phản Ánh</h2>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
        
        {/* CỘT TRÁI: DANH SÁCH */}
        <div style={{ flex: 1 }}>
            <table className="custom-table">
                <thead>
                    <tr>
                        <th>Người gửi</th>
                        <th>Tiêu đề</th>
                        <th>Ngày gửi</th>
                        <th>Trạng thái</th>
                        <th>Hành động</th>
                    </tr>
                </thead>
                <tbody>
                    {listPhanAnh.map(item => (
                        <tr key={item.maPhanAnh} style={{cursor: 'pointer', background: selectedItem?.maPhanAnh === item.maPhanAnh ? '#e0f2fe' : 'white'}}>
                            <td>{item.nguoiGui}</td>
                            <td>{item.tieuDe}</td>
                            <td>{new Date(item.ngayGui).toLocaleDateString()}</td>
                            <td>
                                <span className={item.trangThai === 'Đã xử lý' ? 'status-badge status-paid' : 'status-badge status-pending'}>
                                    {item.trangThai}
                                </span>
                            </td>
                            <td>
                                <button onClick={() => handleSelect(item)} style={{
                                    padding: '5px 10px', background: '#2563eb', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer'
                                }}>
                                    Xử lý
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

        {/* CỘT PHẢI: FORM TRẢ LỜI */}
        {selectedItem && (
            <div style={{ flex: 1, background: '#f8fafc', padding: '20px', borderRadius: '10px', border: '1px solid #e2e8f0', height: 'fit-content' }}>
                <h3 style={{marginTop: 0, color: '#0f172a'}}>Phản hồi cho: {selectedItem.nguoiGui}</h3>
                
                <div style={{marginBottom: '15px'}}>
                    <strong>Tiêu đề:</strong> {selectedItem.tieuDe} <br/>
                    <strong>Nội dung dân gửi:</strong>
                    <p style={{background: 'white', padding: '10px', borderRadius: '5px', border: '1px solid #ddd', fontStyle: 'italic'}}>
                        "{selectedItem.noiDung}"
                    </p>
                </div>

                <label><strong>Câu trả lời của BQL:</strong></label>
                <textarea 
                    rows="5"
                    style={{width: '100%', padding: '10px', marginTop: '5px', borderRadius: '5px', border: '1px solid #ccc'}}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    placeholder="Nhập nội dung trả lời vào đây..."
                ></textarea>

                <div style={{marginTop: '15px', display: 'flex', gap: '10px'}}>
                    <button onClick={handleSubmitReply} style={{
                        flex: 1, padding: '10px', background: '#059669', color: 'white', border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'
                    }}>
                        ✅ Gửi & Duyệt
                    </button>
                    <button onClick={() => setSelectedItem(null)} style={{
                        padding: '10px', background: '#94a3b8', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'
                    }}>Hủy</button>
                </div>
            </div>
        )}
      </div>
    </div>
  );
}

export default PhanAnhAdmin;