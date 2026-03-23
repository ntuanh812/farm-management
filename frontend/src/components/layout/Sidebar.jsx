import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { HomeOutlined, ProfileOutlined, OrderedListOutlined, ProductOutlined, SettingOutlined, LogoutOutlined, TeamOutlined, ShoppingCartOutlined, FileDoneOutlined, ExperimentOutlined } from '@ant-design/icons';
import { Menu, Button } from 'antd';

const menuItems = [
  { key: '/dashboard', label: 'Bảng tổng quát', icon: <HomeOutlined /> },
  { key: '/livestock', label: 'Danh sách vật nuôi', icon: <ProfileOutlined /> },
  { key: '/barns', label: 'Danh sách chuồng trại', icon: <OrderedListOutlined /> },
  { key: '/staff', label: 'Nhân sự trang trại', icon: <TeamOutlined /> },
  { key: '/daily-tasks', label: 'Công việc hằng ngày', icon: <FileDoneOutlined /> },
  { key: '/feed', label: 'Kho thức ăn', icon: <ShoppingCartOutlined /> },
  { key: '/reports', label: 'Báo cáo & Thống kê', icon: <ExperimentOutlined /> },
  { key: '/settings', label: 'Cài đặt hệ thống', icon: <SettingOutlined /> },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Find the currently selected key based on the current path
  const getSelectedKey = () => location.pathname || '/dashboard';

  const onClick = (e) => {
    if (e.key) {
      navigate(e.key);
    }
  };

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header" onClick={() => navigate('/dashboard')}>
        <div className="sidebar__logo-mark">🐄</div>
        <div className="sidebar__logo-text">
          <span className="sidebar__logo-title">FarmPro</span>
          <span className="sidebar__logo-subtitle">Livestock</span>
        </div>
      </div>

      {/* Menu */}
      <Menu
        onClick={onClick}
        style={{ width: 256 }}
        selectedKeys={[getSelectedKey()]}
        mode="inline"
        items={menuItems}
      />

      {/* Footer */}
      <div className="sidebar__footer">
        <Button
          type="text"
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          className="sidebar__logout-btn"
        >
          Đăng xuất
        </Button>
      </div>

    </div>
  );
};

