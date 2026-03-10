import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UnorderedListOutlined, DashboardOutlined, ProductOutlined, SettingOutlined, LogoutOutlined, HomeOutlined, TeamOutlined, MedicineBoxOutlined, ShoppingCartOutlined, CarOutlined, ExperimentOutlined } from '@ant-design/icons';
import { Menu, Button } from 'antd';

const menuItems = [
  {
    key: 'sub1',
    label: 'Chính',
    icon: <ProductOutlined />,
    children: [
      { key: '/dashboard', label: 'Bảng tổng quát', icon: <DashboardOutlined /> },
      { key: '/livestock', label: 'Vật nuôi', icon: <HomeOutlined /> },
      { key: '/barns', label: 'Chuồng trại', icon: <ProductOutlined /> },
    ],
  },
  {
    key: 'sub2',
    label: 'Quản lý chuyên sâu',
    icon: <UnorderedListOutlined />,
    children: [
      { key: '/staff', label: 'Nhân sự trang trại', icon: <TeamOutlined /> },
      { key: '/tasks', label: 'Công việc hằng ngày', icon: <CarOutlined /> },
      { key: '/health', label: 'Y tế & Tiêm phòng', icon: <MedicineBoxOutlined /> },
      { key: '/feed', label: 'Kho thức ăn', icon: <ShoppingCartOutlined /> },
    ],
  },
  {
    key: 'sub3',
    label: 'Phân tích',
    icon: <SettingOutlined />,
    children: [
      { key: '/reports', label: 'Báo cáo & Thống kê', icon: <ExperimentOutlined /> },
      { key: '/settings', label: 'Cài đặt hệ thống', icon: <SettingOutlined /> },
    ],
  },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Find the currently selected key based on the current path
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/livestock')) return '/livestock';
    if (path.startsWith('/barns')) return '/barns';
    if (path.startsWith('/staff')) return '/staff';
    if (path.startsWith('/tasks')) return '/tasks';
    if (path.startsWith('/health')) return '/health';
    if (path.startsWith('/feed')) return '/feed';
    if (path.startsWith('/reports')) return '/reports';
    if (path.startsWith('/settings')) return '/settings';
    return path;
  };

  // Get the default open keys
  const getDefaultOpenKeys = () => {
    const path = location.pathname;
    if (path === '/dashboard' || path === '/') return ['sub1'];
    if (path.startsWith('/livestock') || path.startsWith('/barns')) return ['sub1'];
    if (path.startsWith('/staff') || path.startsWith('/tasks') || path.startsWith('/health') || path.startsWith('/feed')) return ['sub2'];
    if (path.startsWith('/reports') || path.startsWith('/settings')) return ['sub3'];
    return ['sub1'];
  };

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

      {/* Header */}
      <div className="sidebar__header">
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
        defaultOpenKeys={getDefaultOpenKeys()}
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

