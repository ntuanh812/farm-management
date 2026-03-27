import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Button, Card, Col, Descriptions, Row, Statistic, Tag } from "antd";
import { ArrowLeftOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { initialFeedData } from "../../data/mockData";

const typeLabel = {
  grain: "Ngũ cốc",
  supplement: "Bổ sung",
};

const statusLabel = {
  available: "Còn hàng",
  low: "Sắp hết",
};

const statusColor = {
  available: "success",
  low: "warning",
};

export const FeedStorageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const item = initialFeedData.find((f) => f._id === id);
  if (!item) return <div>Mặt hàng không tồn tại: {id}</div>;

  return (
    <div className="feed-storage-detail">
      <PageHeader
        title={`Chi tiết ${item.name}`}
        subtitle={`${item.code} • ${typeLabel[item.type] || item.type}`}
        actions={[
          <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => navigate("/feed")}>
            Danh sách
          </Button>
        ]}
      />
      
      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <ShoppingCartOutlined style={{ fontSize: '64px', color: '#52c41a' }} />
              <h3 style={{ margin: '8px 0', color: '#1890ff' }}>{item.name}</h3>
              <Tag color={statusColor[item.status]}>{statusLabel[item.status] || item.status}</Tag>
            </div>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Mã TA">{item.code}</Descriptions.Item>
              <Descriptions.Item label="Loại">{typeLabel[item.type] || item.type}</Descriptions.Item>
              <Descriptions.Item label="Số lượng">{item.quantity.toLocaleString()} {item.unit}</Descriptions.Item>
              <Descriptions.Item label="Phòng">{item.room || "-"}</Descriptions.Item>
              <Descriptions.Item label="HSD">{item.expiryDate}</Descriptions.Item>
              <Descriptions.Item label="Tồn tối thiểu">{item.minQuantity ?? "-"}</Descriptions.Item>
              <Descriptions.Item label="Tạo lúc">{item.createdAt || "-"}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Statistic
                title="Còn lại"
                value={item.quantity}
                suffix={` ${item.unit}`}
                precision={0}
                valueStyle={{ color: '#52c41a', fontSize: '2.5rem' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Tồn tối thiểu"
                value={item.minQuantity || 0}
                suffix={` ${item.unit || ""}`}
                precision={0}
                valueStyle={{ color: '#faad14', fontSize: '2.5rem' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Trạng thái"
                value={statusLabel[item.status] || item.status}
                valueStyle={{ color: '#1890ff', fontSize: '2.5rem' }}
              />
            </Col>
          </Row>

          <Card style={{ marginTop: 16 }}>
            <Descriptions title="Thông tin chi tiết" column={2}>
              <Descriptions.Item label="Cập nhật">{item.updatedAt || "-"}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái kho">
                <Tag color={statusColor[item.status]}>{statusLabel[item.status] || item.status}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};
