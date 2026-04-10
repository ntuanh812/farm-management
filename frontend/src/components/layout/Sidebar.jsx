import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  ProfileOutlined,
  LogoutOutlined,
  HeartOutlined,
  UsergroupAddOutlined,
  MedicineBoxOutlined,
  SwapRightOutlined,
  CloseCircleOutlined,
  IdcardOutlined,
  ClockCircleOutlined,
  ShoppingCartOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Menu, Button } from "antd";

const menuItems = [
  {
    key: "/dashboard",
    label: "🏠 Tổng quan",
  },
  {
    key: "pigmanage",
    label: "🐷 Quản lý đàn",
    children: [
      { key: "/pigmanage/barns", label: "Chuồng trại", icon: <HomeOutlined /> },
      { key: "/pigmanage", label: "Danh sách lợn", icon: <ProfileOutlined /> },
      { key: "/pigmanage/pigsty-history", label: "Chuyển chuồng", icon: <SwapRightOutlined /> },
      { key: "/pigmanage/pig-dead", label: "Ghi nhận chết", icon: <CloseCircleOutlined /> },
      { key: "/pigmanage/pig-fattening", label: "Lợn thịt / xuất", icon: <IdcardOutlined /> },
    ],
  },
  {
    key: "reproduction",
    label: "🐷 Sinh sản",
    children: [
      { key: "/breeding/pig-breeding", label: "Phối giống", icon: <HeartOutlined /> },
      { key: "/breeding/pig-farrowing", label: "Đẻ con", icon: <UsergroupAddOutlined /> },
    ],
  },
  {
    key: "materials",
    label: "🍽️ Nguyên vật liệu",
    children: [
      { key: "/materials/bran", label: "Sử dụng cám", icon: <ShoppingCartOutlined /> },
      { key: "/materials/medicine", label: "Sử dụng thuốc", icon: <MedicineBoxOutlined /> },
    ],
  },
  {
    key: "veterinary",
    label: "💊 Thú y",
    children: [
      { key: "/vaccination/schedule-vaccine", label: "Tiêm phòng", icon: <ClockCircleOutlined /> },
    ],
  },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getSelectedKey = () => (location.pathname ? [location.pathname] : ["/dashboard"]);

  const onClick = (e) => {
    if (e.key) {
      navigate(e.key);
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="sidebar">
      <div className="sidebar__header" onClick={() => navigate("/dashboard")}>
        <div className="sidebar__logo-mark">🐷</div>
        <div className="sidebar__logo-text">
          <span className="sidebar__logo-title">FarmPro</span>
          <span className="sidebar__logo-subtitle">Pig</span>
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
