import { PageHeader } from "../../components/layout/PageHeader";
import { Card, Row, Col, List } from "antd";
import {
  RiseOutlined,
  FallOutlined,
  SnippetsOutlined,
  HomeOutlined,
  TeamOutlined,
  DashboardOutlined,
  AppleOutlined,
  AuditOutlined,
  AndroidOutlined
} from "@ant-design/icons";
import { activities } from "../../data/mockData";

function formatRelativeTime(isoString) {
  const time = new Date(isoString).getTime();
  if (Number.isNaN(time)) return "";
  const diffMs = Date.now() - time;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return "Vừa xong";
  if (diffMin < 60) return `${diffMin} phút trước`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour} giờ trước`;
  const diffDay = Math.floor(diffHour / 24);
  return `${diffDay} ngày trước`;
}

export const DashBoard = () => {
  const statsData = [
    {
      title: "Tổng vật nuôi",
      value: "1,245",
      unit: "con",
      icon: <AndroidOutlined />,
      type: "livestock",
      trend: "+12%",
      trendUp: true
    },
    {
      title: "Tổng chuồng trại",
      value: "32",
      unit: "chuồng",
      icon: <HomeOutlined />,
      type: "barn",
      trend: "+2",
      trendUp: true
    },
    {
      title: "Tổng nhân viên",
      value: "18",
      unit: "người",
      icon: <TeamOutlined />,
      type: "staff",
      trend: "+3",
      trendUp: true
    },
    {
      title: "Công việc trang trại",
      value: "7",
      unit: "công việc",
      icon: <SnippetsOutlined />,
      type: "daily-tasks",
      trend: "-2",
      trendUp: false
    }
  ];


  const getActivityIcon = (type) => {
    switch (type) {
      case "medical":
        return <AuditOutlined />;
      case "feeding":
        return <AppleOutlined />;
      case "task":
        return <SnippetsOutlined />;
      default:
        return <DashboardOutlined />;
    }
  };

  return (
    <div className="dashboard">
      <PageHeader
        title="Tổng quan trang trại"
        subtitle="Theo dõi tình hình vật nuôi, chuồng trại và hoạt động gần đây"
      />

      <div className="dashboard__maincontent">
        {/* Stats Grid */}
        <Row gutter={[20, 20]} className="dashboard-stats">
          {statsData.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card className={`stat-card stat-card--${stat.type}`}>
                <div className="stat-card__header">
                  <span className="stat-card__title">{stat.title}</span>
                  <div className="stat-card__icon">{stat.icon}</div>
                </div>
                <div className="stat-card__value">
                  {stat.value}
                  <span className="stat-card__label"> {stat.unit}</span>
                </div>
                <div className={`stat-card__trend ${stat.trendUp ? 'stat-card__trend--up' : 'stat-card__trend--down'}`}>
                  {stat.trendUp ? <RiseOutlined /> : <FallOutlined />}
                  <span>{stat.trend} so với tháng trước</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Charts Grid */}
        <Row gutter={[20, 20]} style={{ marginTop: 24 }} className="dashboard-charts">
          <Col xs={24} lg={12}>
            <Card className="chart-card">
              <div className="chart-card__header">
                <h3>📈 Tăng trưởng vật nuôi</h3>
                <span className="chart-card__badge">Live</span>
              </div>
              <div className="chart-card__content">
                <div className="chart-card__placeholder">
                  <div className="placeholder-icon">📊</div>
                  <p>Biểu đồ tăng trưởng vật nuôi theo tháng</p>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card className="chart-card">
              <div className="chart-card__header">
                <h3>🌾 Tiêu thụ thức ăn</h3>
                <span className="chart-card__badge">Live</span>
              </div>
              <div className="chart-card__content">
                <div className="chart-card__placeholder">
                  <div className="placeholder-icon">🌾</div>
                  <p>Biểu đồ tiêu thụ thức ăn theo tuần</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        {/* Activity Section */}
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card className="activity-card">
              <div className="activity-card__header">
                <h3>📋 Hoạt động gần đây</h3>
                <span className="view-all">Xem tất cả →</span>
              </div>
              <div className="activity-card__list">
                <List
                  dataSource={activities}
                  renderItem={(item) => (
                    <div className="activity-card__item">
                      <div className={`activity-card__icon activity-card__icon--${item.icon}`}>
                        {getActivityIcon(item.icon)}
                      </div>
                      <div className="activity-card__content">
                        <p>{item.content}</p>
                        <span>{formatRelativeTime(item.createdAt)}</span>
                      </div>
                    </div>
                  )}
                />
              </div>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
};

