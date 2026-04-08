import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProfileOutlined, LogoutOutlined, TeamOutlined, FileDoneOutlined, HeartOutlined, UsergroupAddOutlined, SwapOutlined, MedicineBoxOutlined, LineChartOutlined, SwapRightOutlined, DollarCircleOutlined, CloseCircleOutlined, IdcardOutlined, CalendarOutlined, ClockCircleOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { Menu, Button } from 'antd';

const menuItems = [
  { 
    key: '/dashboard', 
    label: '🏠 Tổng quan',  
  },
  {
    key: 'pigmanage',
    label: '🐖 Quản lý đàn',
    children: [
      { key: '/pigmanage', label: 'Danh sách lợn', icon: <ProfileOutlined /> },
      { key: '/pigmanage/pigsty-history', label: 'Chuyển chuồng', icon: <SwapRightOutlined /> },
      { key: '/pigmanage/pig-dead', label: 'Ghi nhận chết', icon: <CloseCircleOutlined /> },
      { key: '/pigmanage/pig-sell', label: 'Xuất / bán', icon: <DollarCircleOutlined /> },
    ]
  },
  { 
    key: 'breeding',
    label: '🐷 Sinh sản',
    children: [
      { key: '/breeding/mating', label: 'Phối giống', icon: <HeartOutlined /> },
      { key: '/breeding/pregnancy', label: 'Mang thai', icon: <CalendarOutlined /> },
      { key: '/breeding/farrowing', label: 'Đẻ con', icon: <UsergroupAddOutlined /> },
      { key: '/breeding/weaning', label: 'Cai sữa', icon: <SwapOutlined /> },
    ]
  },
  { 
    key: 'feed',
    label: '🍽️ Chăn nuôi',
    children: [
      { key: '/feed/usage', label: 'Sử dụng cám', icon: <ShoppingCartOutlined /> },
      { key: '/livestock/weight', label: 'Theo dõi trọng lượng', icon: <LineChartOutlined /> },
    ]
  },
  { 
    key: 'veterinary',
    label: '💊 Thú y',
    children: [
      { key: '/vaccination/usage', label: 'Sử dụng thuốc', icon: <MedicineBoxOutlined /> },
      { key: '/vaccination/schedule-vaccine', label: 'Tiêm phòng', icon: <ClockCircleOutlined /> },
    ]
  },
  { 
    key: 'warehouse',
    label: '📦 Kho',
    children: [
      { key: '/feed-storage', label: 'Kho thức ăn', icon: <ShoppingCartOutlined /> },
    ]
  },
  { 
    key: 'reports',
    label: '📊 Báo cáo',
    children: [
      { key: '/reports/in-out', label: 'Nhập / xuất', icon: <SwapOutlined /> },
      { key: '/reports/growth', label: 'Tăng trưởng', icon: <LineChartOutlined /> },
      { key: '/reports/breeding', label: 'Sinh sản', icon: <HeartOutlined /> },
    ]
  },
  { 
    key: 'system',
    label: '⚙️ Hệ thống',
    children: [
      { key: '/staff', label: 'Nhân sự', icon: <TeamOutlined /> },
      { key: '/tasks', label: 'Công việc', icon: <FileDoneOutlined /> },
    ]
  },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => location.pathname ? [location.pathname] : ['/dashboard'];

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

      <Menu
        onClick={onClick}
        style={{ width: 256 }}
        selectedKeys={getSelectedKey()}
        mode="inline"
        items={menuItems}
      />

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
