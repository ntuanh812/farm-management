import { useParams } from 'react-router-dom';
import { PageHeader } from "../../components/layout/PageHeader";
import { Card, Row, Col, Tag, Descriptions, Button, Statistic, Form, Table, Tabs , InputNumber, Input, DatePicker} from 'antd';
import { ArrowLeftOutlined, LineChartOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const FAKE_FEED_ITEM = {
  id: "TA001",
  name: "Cỏ voi",
  type: "grass",
  typeName: "Cỏ",
  quantity: 1250,
  unit: "kg",
  expiryDate: "2024-12-15",
  supplier: "NCC001",
  supplierName: "Công ty Thức ăn A",
  room: "P1",
  roomName: "Phòng 1 (Cám)",
  batch: "240901",
  productionDate: "2024-09-01",
  usedPerDay: 45,
  totalUsed: 320,
  remainingDays: 28,
  status: "good"
};


const USAGE_HISTORY = [
  { date: "2024-10-01", used: 45, remaining: 1250 },
  { date: "2024-10-02", used: 42, remaining: 1208 },
  { date: "2024-10-03", used: 48, remaining: 1160 },
  { date: "2024-10-04", used: 40, remaining: 1120 }
];


const ASSIGNED_BARNS = [
  { id: "C1", name: "Chuồng C1", type: "Gà thịt", dailyUsage: 25 },
  { id: "C2", name: "Chuồng C2", type: "Gà đẻ", dailyUsage: 20 }
];


const EXPIRY_ALERTS = [
{ item: "Thức ăn hỗn hợp lợn", daysLeft: 5, status: "critical" },
  { item: "Silage bắp", daysLeft: 12, status: "warning" }
];

const barnColumns = [
  { title: 'Mã chuồng', dataIndex: 'id', key: 'id', width: 80 },
  { title: 'Tên chuồng', dataIndex: 'name', key: 'name' },
  { title: 'Loại', dataIndex: 'type', key: 'type', render: type => <Tag>{type}</Tag> },
  { title: 'Sử dụng/ngày', dataIndex: 'dailyUsage', key: 'dailyUsage', render: v => `${v}kg` }
];

export const FeedStorageDetail = () => {
  const { id } = useParams();
  
  const item = { ...FAKE_FEED_ITEM, id }; // Use param for id

  const chartData = USAGE_HISTORY.map(h => ({
    date: h.date,
    used: h.used,
    remaining: h.remaining / 10 // Scale for chart
  }));

  return (
    <div className="feed-storage-detail">
      <PageHeader
        title={`Chi tiết ${item.name}`}
        subtitle={item.typeName}
        actions={[
          <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => window.history.back()}>
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
              <Tag color="success">{item.status === 'good' ? 'Tồn kho tốt' : 'Cần bổ sung'}</Tag>
            </div>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Mã TA">{item.id}</Descriptions.Item>
              <Descriptions.Item label="Loại">{item.typeName}</Descriptions.Item>
              <Descriptions.Item label="Số lượng">{item.quantity.toLocaleString()} {item.unit}</Descriptions.Item>
              <Descriptions.Item label="Phòng">{item.roomName}</Descriptions.Item>
              <Descriptions.Item label="HSD">{item.expiryDate}</Descriptions.Item>
              <Descriptions.Item label="NCC">{item.supplierName}</Descriptions.Item>
              <Descriptions.Item label="Lô sản xuất">{item.batch}</Descriptions.Item>
              <Descriptions.Item label="Ngày SX">{item.productionDate}</Descriptions.Item>
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
                title="Dùng/ngày TB"
                value={item.usedPerDay}
                suffix={` ${item.unit}`}
                precision={0}
                valueStyle={{ color: '#faad14', fontSize: '2.5rem' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Còn dùng"
                value={item.remainingDays}
                suffix=" ngày"
                valueStyle={{ color: '#1890ff', fontSize: '2.5rem' }}
              />
            </Col>
          </Row>

          <Card style={{ marginTop: 16 }}>
            <Descriptions title="Thông tin chi tiết" column={2}>
              <Descriptions.Item label="Tổng đã dùng">{item.totalUsed} {item.unit}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái kho">
                <Tag color={item.status === 'good' ? 'success' : 'warning'}>{item.status}</Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={12}>
          <Card title={<span><LineChartOutlined /> Tiêu thụ theo ngày</span>}>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="used" stroke="#8884d8" name="Tiêu thụ" />
                <Line type="monotone" dataKey="remaining" stroke="#82ca9d" name="Tồn kho" />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </Col>

      </Row>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Tabs defaultActiveKey="1">
            <Tabs.TabPane tab="Chuồng sử dụng" key="1">
              <Card>
                <Table 
                  columns={barnColumns} 
                  dataSource={ASSIGNED_BARNS} 
                  pagination={false}
                  size="small"
                  scroll={{ x: 600 }}
                />
              </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Nhập kho thêm" key="3">
              <Card>
                <Form layout="vertical" style={{ maxWidth: 600 }}>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Số lượng nhập thêm" rules={[{required: true}]}>
                        <InputNumber min={1} addonAfter={item.unit} style={{width: '100%'}} />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="Nhà cung cấp">
                        <Input placeholder="NCC mới" />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Row gutter={16}>
                    <Col span={12}>
                      <Form.Item label="Lô mới">
                        <Input placeholder="2409XX" />
                      </Form.Item>
                    </Col>
                    <Col span={12}>
                      <Form.Item label="HSD mới">
                        <DatePicker style={{width: '100%'}} />
                      </Form.Item>
                    </Col>
                  </Row>
                  <Form.Item>
                    <Button type="primary" htmlType="submit" block>Nhập kho ngay</Button>
                  </Form.Item>
                </Form>
              </Card>
            </Tabs.TabPane>
            <Tabs.TabPane tab="Lịch sử nhập/xuất" key="2">
              <p>Mock history table would go here...</p>
            </Tabs.TabPane>
          </Tabs>
        </Col>
      </Row>
    </div>
  );
};
