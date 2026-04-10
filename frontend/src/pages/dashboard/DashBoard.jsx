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
} from "@ant-design/icons";
import { usePigFarmStore } from "../../store/pigFarmStore";
import { LifecycleStatus } from "../../domain/pigFarm";

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
  const barns = usePigFarmStore((s) => s.barns);
  const pigs = usePigFarmStore((s) => s.pigs);
  const staff = usePigFarmStore((s) => s.staff);
  const activities = usePigFarmStore((s) => s.activities);

  const activeCount = pigs.filter((p) => p.lifecycleStatus === LifecycleStatus.ACTIVE).length;

  const statsData = [
    {
      title: "Lợn đang nuôi",
      value: String(activeCount),
      unit: "con",
      icon: <SnippetsOutlined />,
      type: "pigs",
      trend: "—",
      trendUp: true,
    },
    {
      title: "Chuồng",
      value: String(barns.length),
      unit: "chuồng",
      icon: <HomeOutlined />,
      type: "barn",
      trend: "—",
      trendUp: true,
    },
    {
      title: "Nhân sự ",
      value: String(staff.length),
      unit: "người",
      icon: <TeamOutlined />,
      type: "staff",
      trend: "—",
      trendUp: true,
    },
    {
      title: "Sự kiện gần đây",
      value: String(activities.length),
      unit: "bản ghi",
      icon: <DashboardOutlined />,
      type: "daily-tasks",
      trend: "—",
      trendUp: true,
    },
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
        title="Tổng quan trại lợn"
        subtitle="Dữ liệu lấy từ store (sẵn sàng kết nối MySQL)"
      />

      <div className="dashboard__maincontent">
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
                <div
                  className={`stat-card__trend ${stat.trendUp ? "stat-card__trend--up" : "stat-card__trend--down"}`}
                >
                  {stat.trendUp ? <RiseOutlined /> : <FallOutlined />}
                  <span>{stat.trend}</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Row gutter={[20, 20]} style={{ marginTop: 24 }} className="dashboard-charts">
          <Col xs={24} lg={12}>
            <Card className="chart-card">
              <div className="chart-card__header">
                <h3>Tăng trọng / xuất</h3>
                <span className="chart-card__badge">Demo</span>
              </div>
              <div className="chart-card__content">
                <div className="chart-card__placeholder">
                  <div className="placeholder-icon">📊</div>
                  <p>Nối bảng sale_batches + pigs</p>
                </div>
              </div>
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card className="chart-card">
              <div className="chart-card__header">
                <h3>Tiêu thụ cám</h3>
                <span className="chart-card__badge">Demo</span>
              </div>
              <div className="chart-card__content">
                <div className="chart-card__placeholder">
                  <div className="placeholder-icon">🌾</div>
                  <p>Nối feed_usages theo barn_id</p>
                </div>
              </div>
            </Card>
          </Col>
        </Row>

        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card className="activity-card">
              <div className="activity-card__header">
                <h3>Hoạt động gần đây</h3>
              </div>
              <div className="activity-card__list">
                <List
                  dataSource={activities}
                  renderItem={(item) => (
                    <div className="activity-card__item" key={item.id}>
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
