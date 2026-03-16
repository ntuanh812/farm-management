import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from "../../components/layout/PageHeader";

import { Card, Row, Col, Tag, Descriptions, Button, Statistic, Divider, Image } from 'antd';
import { ArrowLeftOutlined, LineChartOutlined, AreaChartOutlined, BarChartOutlined } from '@ant-design/icons';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// INLINE FULL DATA - No external files
const FAKE_LIVESTOCK_DATA = [
  {id: "VN001", name: "Bò sữa 01", type: "cattle", typeName: "Bò sữa", weight: 450, production: 25, health: "good", healthName: "Khỏe mạnh", barn: "A1", barnName: "Chuồng A1", entryDate: "2024-01-15", breed: "Holstein", age: 24, gender: "female"},
  {id: "VN002", name: "Bò thịt 01", type: "cattle", typeName: "Bò thịt", weight: 520, production: null, health: "good", healthName: "Khỏe mạnh", barn: "A2", barnName: "Chuồng A2", entryDate: "2024-02-20", breed: "Angus", age: 18, gender: "male"},
  {id: "VN003", name: "Lợn nái 01", type: "pig", typeName: "Lợn nái", weight: 180, production: 12, health: "good", healthName: "Khỏe mạnh", barn: "B1", barnName: "Chuồng B1", entryDate: "2024-01-10"},
  {id: "VN004", name: "Lợn thịt 01", type: "pig", typeName: "Lợn thịt", weight: 95, production: null, health: "warning", healthName: "Theo dõi", barn: "B2", barnName: "Chuồng B2", entryDate: "2024-03-01"},
  {id: "VN005", name: "Gà trống 01", type: "chicken", typeName: "Gà thịt", weight: 3.5, production: 15, health: "good", healthName: "Khỏe mạnh", barn: "C1", barnName: "Chuồng C1", entryDate: "2024-02-15"},
  {id: "VN006", name: "Gà đẻ 01", type: "chicken", typeName: "Gà đẻ", weight: 2.8, production: 22, health: "good", healthName: "Khỏe mạnh", barn: "C2", barnName: "Chuồng C2", entryDate: "2024-01-20"},
  {id: "VN007", name: "Vịt đẻ 01", type: "duck", typeName: "Vịt đẻ", weight: 3.2, production: 18, health: "good", healthName: "Khỏe mạnh", barn: "C3", barnName: "Chuồng C3", entryDate: "2024-02-01"},
  {id: "VN008", name: "Trâu 01", type: "buffalo", typeName: "Trâu", weight: 650, production: null, health: "good", healthName: "Khỏe mạnh", barn: "D1", barnName: "Chuồng D1", entryDate: "2023-12-01"},
  {id: "VN009", name: "Lợn thịt 02", type: "pig", typeName: "Lợn thịt", weight: 110, production: null, health: "critical", healthName: "Nghi ngờ", barn: "B3", barnName: "Chuồng B3", entryDate: "2024-03-10"},
  {id: "VN010", name: "Bò sữa 02", type: "cattle", typeName: "Bò sữa", weight: 420, production: 25, health: "good", healthName: "Khỏe mạnh", barn: "A1", barnName: "Chuồng A1", entryDate: "2024-01-25"}
];

const WEIGHT_DATA = [{date: 'Week 1', weight: 420}, {date: 'Week 2', weight: 430}, {date: 'Week 3', weight: 440}, {date: 'Week 4', weight: 450}];
const PRODUCTION_DATA = [{date: 'Mon', production: 22}, {date: 'Tue', production: 25}, {date: 'Wed', production: 24}, {date: 'Thu', production: 26}, {date: 'Fri', production: 23}, {date: 'Sat', production: 25}, {date: 'Sun', production: 24}];
const HEALTH_DATA = [{day: 'Mon', score: 95}, {day: 'Tue', score: 98}, {day: 'Wed', score: 92}, {day: 'Thu', score: 97}, {day: 'Fri', score: 96}];

export const LivestockDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const livestock = FAKE_LIVESTOCK_DATA.find(item => item.id === id);
  if (!livestock) return <div>Vật nuôi không tồn tại: {id}</div>;
  
  const isMeatType = ['cattle', 'pig', 'chicken'].includes(livestock.type) && !livestock.typeName?.includes('đẻ');
  const isProductionType = ['cattle', 'chicken', 'duck'].includes(livestock.type) && livestock.production;

  return (
    <div className="livestock-detail">
      <PageHeader
        title={`Chi tiết ${livestock.name}`}
        subtitle={livestock.typeName}
        actions={[
          <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => navigate('/livestock')}>
            Danh sách
          </Button>
        ]}
      />
      
      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Card>
            <div className="livestock-detail__image-container">
              <Image
                src={`https://via.placeholder.com/400x300/${getImageColor(livestock.type)}/FFFFFF?text=${encodeURIComponent(livestock.name)}`}
                fallback="https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Livestock"
                style={{ width: '100%', height: 300, objectFit: 'cover' }}
              />
            </div>
            <Divider />
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Mã ID">{livestock.id}</Descriptions.Item>
              <Descriptions.Item label="Giống">{livestock.breed || 'N/A'}</Descriptions.Item>
              <Descriptions.Item label="Giới tính">{livestock.gender === 'female' ? '🐄' : '🐃'}</Descriptions.Item>
              <Descriptions.Item label="Tuổi">{livestock.age || 'N/A'} tháng</Descriptions.Item>
              <Descriptions.Item label="Thức ăn/ngày">{livestock.dailyFeed || 25} kg</Descriptions.Item>
              <Descriptions.Item label="Vắc xin gần nhất">2024-07-01</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Statistic
                title="Cân nặng"
                value={livestock.weight}
                suffix=" kg"
                valueStyle={{ color: '#059669', fontSize: '2.5rem', fontWeight: 800 }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Sản lượng"
                value={livestock.production || 0}
                suffix={livestock.type === 'cattle' ? 'lít/ngày' : 'trứng/tuần'}
              />
            </Col>
            <Col span={8}>
              <Statistic title="Sức khỏe">
                <Tag color={livestock.health === 'good' ? 'success' : livestock.health === 'warning' ? 'warning' : 'error'}>
                  {livestock.healthName}
                </Tag>
              </Statistic>
            </Col>
          </Row>

          <Card style={{ marginTop: 16 }}>
            <Descriptions title="Thông tin chi tiết" column={2}>
              <Descriptions.Item label="Chuồng">{livestock.barnName}</Descriptions.Item>
              <Descriptions.Item label="Ngày nhập">{livestock.entryDate}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú">Vật nuôi khỏe mạnh, sản lượng ổn định</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 24 }}>
        {isMeatType && (
          <Col span={24}>
            <Card title={<span><LineChartOutlined /> Tăng trưởng cân nặng (4 tuần)</span>}>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={WEIGHT_DATA}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="weight" stroke="#8884d8" activeDot={{ r: 8 }} />
                </LineChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        )}

        {isProductionType && (
          <Col span={24}>
            <Card title={<span><AreaChartOutlined /> Sản lượng tuần (7 ngày)</span>}>
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={PRODUCTION_DATA}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Area type="monotone" dataKey="production" stroke="#82ca9d" fill="#82ca9d" />
                </AreaChart>
              </ResponsiveContainer>
            </Card>
          </Col>
        )}

        <Col span={24}>
          <Card title={<span><BarChartOutlined /> Đánh giá sức khỏe tuần (5 ngày)</span>}>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={HEALTH_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="score" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

// Helper function for dynamic images by type
function getImageColor(type) {
  const colors = {
    'cattle': '4A90E2',    // Blue for cow
    'pig': 'E94B3C',       // Red for pig
    'chicken': 'F5AB35',   // Orange for chicken
    'duck': '7ED321',      // Green for duck
    'buffalo': '58595B'    // Gray for buffalo
  };
  return colors[type] || '4A90E2';
}

