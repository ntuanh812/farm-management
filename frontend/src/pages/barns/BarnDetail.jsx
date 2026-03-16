import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from "../../components/layout/PageHeader";

import { Card, Row, Col, Tag, Descriptions, Button, Statistic, Divider, Image, Table } from 'antd';
import { ArrowLeftOutlined, LineChartOutlined, AreaChartOutlined, BarChartOutlined, ProfileOutlined } from '@ant-design/icons';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Mock barn data
const FAKE_BARNS_DATA = [
  {id: "A1", name: "Chuồng A1", type: "cattle", typeName: "Bò sữa", capacity: 50, currentCount: 20, occupancy: 40, cleanliness: "good", cleanlinessName: "Sạch sẽ", temperature: 28, livestockCount: 20, builtDate: "2023-01-15", size: "500m²", ventilation: "Tốt", location: "Khu A"},
  {id: "B2", name: "Chuồng B2", type: "pig", typeName: "Lợn thịt", capacity: 120, currentCount: 80, occupancy: 67, cleanliness: "good", cleanlinessName: "Sạch sẽ", temperature: 25, livestockCount: 80, builtDate: "2023-06-20", size: "800m²", ventilation: "Tốt", location: "Khu B"},
  {id: "C1", name: "Chuồng C1", type: "broiler", typeName: "Gà thịt", capacity: 5000, currentCount: 3200, occupancy: 64, cleanliness: "warning", cleanlinessName: "Cần vệ sinh", temperature: 30, livestockCount: 3200, builtDate: "2024-01-10", size: "2000m²", ventilation: "Tự động", location: "Khu C"}
];

// Mock assigned livestock for demo
const ASSIGNED_LIVESTOCK = [
  {id: "VN001", name: "Bò sữa 01", type: "cattle", weight: 450, health: "good"},
  {id: "VN010", name: "Bò sữa 02", type: "cattle", weight: 420, health: "good"},
];

const OCCUPANCY_DATA = [{week: 'Tuần 1', occupancy: 30}, {week: 'Tuần 2', occupancy: 35}, {week: 'Tuần 3', occupancy: 38}, {week: 'Tuần 4', occupancy: 40}];
const CLEANLINESS_DATA = [{day: 'T2', score: 95}, {day: 'T3', score: 92}, {day: 'T4', score: 98}, {day: 'T5', score: 96}, {day: 'T6', score: 94}, {day: 'T7', score: 97}];
const TEMP_DATA = [{hour: '8h', temp: 27}, {hour: '12h', temp: 29}, {hour: '16h', temp: 28}, {hour: '20h', temp: 27}];

export const BarnDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const barn = FAKE_BARNS_DATA.find(item => item.id === id);
  if (!barn) return <div>Chuồng trại không tồn tại: {id}</div>;
  
  const getBarnImageColor = (type) => {
    const colors = {
      'cattle': '4A90E2',
      'pig': 'E94B3C', 
      'broiler': 'F5AB35',
      'layer': '7ED321',
      'buffalo': '58595B'
    };
    return colors[type] || '4A90E2';
  };

  const imageUrl = 'https://via.placeholder.com/400x300/' + getBarnImageColor(barn.type) + '/FFFFFF?text=' + encodeURIComponent(barn.name);

  const livestockColumns = [
    { title: 'Mã', dataIndex: 'id', key: 'id', width: 80 },
    { title: 'Tên', dataIndex: 'name', key: 'name' },
    { title: 'Loại', dataIndex: 'type', key: 'type', render: (type) => <Tag>{type}</Tag> },
    { title: 'Cân nặng', dataIndex: 'weight', key: 'weight', render: (w) => `${w}kg` },
    { title: 'Sức khỏe', dataIndex: 'health', key: 'health', render: (h) => <Tag color={h === 'good' ? 'success' : 'warning'}>{h}</Tag> }
  ];

  return (
    <div className="barn-detail">
      <PageHeader
        title={'Chi tiết ' + barn.name}
        subtitle={barn.typeName}
        actions={[
          <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => navigate('/barns')}>
            Danh sách
          </Button>
        ]}
      />
      
      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Card>
            <div className="barn-detail__image-container">
              <Image
                src={imageUrl}
                fallback="https://via.placeholder.com/400x300/4A90E2/FFFFFF?text=Barn"
                style={{ width: '100%', height: 300, objectFit: 'cover' }}
              />
            </div>
            <Divider />
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Mã chuồng">{barn.id}</Descriptions.Item>
              <Descriptions.Item label="Diện tích">{barn.size}</Descriptions.Item>
              <Descriptions.Item label="Vị trí">{barn.location}</Descriptions.Item>
              <Descriptions.Item label="Thông gió">{barn.ventilation}</Descriptions.Item>
              <Descriptions.Item label="Ngày xây">{barn.builtDate}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú">Chuồng vận hành tốt</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Statistic
                title="Độ lấp đầy"
                value={barn.occupancy}
                suffix="%"
                precision={0}
                valueStyle={{ color: '#059669', fontSize: '2.5rem' }}
              />
            </Col>
            <Col span={8}>
              <Statistic
                title="Số vật nuôi"
                value={barn.livestockCount}
                suffix=" con"
                valueStyle={{ color: '#3B82F6', fontSize: '2.5rem' }}
              />
            </Col>
            <Col span={8}>
              <Statistic title="Nhiệt độ">
                <div style={{ fontSize: '2.5rem', color: '#EF4444' }}>
                  {barn.temperature}°C
                </div>
              </Statistic>
            </Col>
          </Row>

          <Card style={{ marginTop: 16 }}>
            <Descriptions title="Thông tin chi tiết" column={2}>
              <Descriptions.Item label="Sức chứa">{barn.capacity} con</Descriptions.Item>
              <Descriptions.Item label="Hiện tại">{barn.currentCount} con</Descriptions.Item>
              <Descriptions.Item label="Độ sạch">
                <Tag color={barn.cleanliness === 'good' ? 'success' : barn.cleanliness === 'warning' ? 'warning' : 'error'}>
                  {barn.cleanlinessName}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={8}>
          <Card title={<span><LineChartOutlined /> Tỷ lệ lấp đầy (4 tuần)</span>}>
<div style={{width: '100%', height: '250px'}}>
              <LineChart width={500} height={250} data={OCCUPANCY_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="occupancy" stroke="#8884d8" activeDot={{ r: 6 }} />
              </LineChart>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title={<span><BarChartOutlined /> Độ sạch (7 ngày)</span>}>
<div style={{width: '100%', height: '250px'}}>
              <BarChart width={500} height={250} data={CLEANLINESS_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="score" fill="#82ca9d" />
              </BarChart>
            </div>
          </Card>
        </Col>

        <Col span={8}>
          <Card title={<span><AreaChartOutlined /> Nhiệt độ (24h)</span>}>
<div style={{width: '100%', height: '250px'}}>
              <AreaChart width={500} height={250} data={TEMP_DATA}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="hour" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="temp" stroke="#ffc658" fill="#ffc658" />
              </AreaChart>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title={<span><ProfileOutlined /> Vật nuôi trong chuồng ({ASSIGNED_LIVESTOCK.length} con)</span>}>
            <Table 
              columns={livestockColumns} 
              dataSource={ASSIGNED_LIVESTOCK} 
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
