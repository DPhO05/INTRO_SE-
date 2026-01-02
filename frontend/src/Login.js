import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css'; // Tận dụng CSS cũ cho nhanh

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5045/api/Auth/login', {
        username: username,
        password: password
      });

      // 1. Lưu thông tin vào bộ nhớ trình duyệt
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role); // Admin hoặc User
      localStorage.setItem('hoTen', res.data.hoTen);

      // 2. Phân luồng chuyển hướng
      if (res.data.role === 'Admin') {
        navigate('/'); // Admin về Dashboard chính
      } else {
        navigate('/user-home'); // User về trang riêng của dân
      }
      
      // Reload lại trang để App.js cập nhật trạng thái
      window.location.reload(); 

    } catch (err) {
      console.error(err);
      setError('Đăng nhập thất bại! Kiểm tra lại tên đăng nhập hoặc mật khẩu.');
    }
  };

  return (
    <div style={{ 
      display: 'flex', justifyContent: 'center', alignItems: 'center', 
      height: '100vh', background: '#f3f4f6' 
    }}>
      <div style={{ 
        background: 'white', padding: '40px', borderRadius: '10px', 
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)', width: '350px' 
      }}>
        <h2 style={{ textAlign: 'center', color: '#2563eb', marginBottom: '20px' }}>BLUE MOON LOGIN</h2>
        
        {error && <p style={{ color: 'red', fontSize: '14px', textAlign: 'center' }}>{error}</p>}

        <form onSubmit={handleLogin}>
          <div className="form-group" style={{marginBottom: '15px'}}>
            <label style={{display: 'block', marginBottom: '5px'}}>Tên đăng nhập:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
              style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px'}}
              placeholder="admin hoặc user1"
            />
          </div>

          <div className="form-group" style={{marginBottom: '20px'}}>
            <label style={{display: 'block', marginBottom: '5px'}}>Mật khẩu:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              style={{width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '5px'}}
              placeholder="123456"
            />
          </div>

          <button type="submit" style={{
            width: '100%', padding: '12px', background: '#2563eb', color: 'white', 
            border: 'none', borderRadius: '5px', fontWeight: 'bold', cursor: 'pointer'
          }}>
            ĐĂNG NHẬP
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;