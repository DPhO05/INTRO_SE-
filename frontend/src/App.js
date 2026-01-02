import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Import các trang (Đảm bảo file đã tồn tại)
import Login from './Login';
import UserDashboard from './UserDashboard';
import Dashboard from './Dashboard';

// Các trang quản lý của Admin
import NhanKhau from './NhanKhau';   // <--- Cần file NhanKhau.js
import CanHo from './CanHo';         // <--- Cần file CanHo.js
import KhoanThu from './KhoanThu';   // <--- Cần file KhoanThu.js
import ThanhToan from './ThanhToan'; // <--- Cần file ThanhToan.js
import HoKhau from './HoKhau';       // <--- Cần file HoKhau.js
import PhanAnhAdmin from './PhanAnhAdmin';

import './App.css';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Login */}
          <Route path="/login" element={<Login />} />

          {/* Chưa đăng nhập -> Đá về Login */}
          {!token && <Route path="*" element={<Navigate to="/login" />} />}

          {/* USER: Chỉ vào UserDashboard */}
          {token && role === 'User' && (
             <>
                <Route path="/user-home" element={<UserDashboard />} />
                <Route path="*" element={<Navigate to="/user-home" />} />
             </>
          )}

          {/* ADMIN: Vào được tất cả */}
          {token && role === 'Admin' && (
            <>
              {/* Trang chủ */}
              <Route path="/" element={<Dashboard />} />

              {/* --- ĐÂY LÀ PHẦN BẠN ĐANG THIẾU --- */}
              <Route path="/nhan-khau" element={<NhanKhau />} />
              <Route path="/can-ho" element={<CanHo />} />
              <Route path="/khoan-thu" element={<KhoanThu />} />
              <Route path="/thanh-toan" element={<ThanhToan />} />
              <Route path="/ho-khau" element={<HoKhau />} />
              <Route path="/phan-anh-admin" element={<PhanAnhAdmin />} />
              {/* ---------------------------------- */}

              {/* Nếu nhập linh tinh -> Về Dashboard */}
              <Route path="*" element={<Navigate to="/" />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;