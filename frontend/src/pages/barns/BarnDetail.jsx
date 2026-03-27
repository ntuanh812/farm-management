import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from "../../components/layout/PageHeader";

import { Card, Row, Col, Tag, Descriptions, Button, Statistic, Divider, Image, Table } from 'antd';
import { ArrowLeftOutlined, ProfileOutlined } from '@ant-design/icons';


// Mock barn data
const FAKE_BARNS_DATA = [
{id: "A1", name: "Chuồng A1", type: "cattle", typeName: "Bò sữa", capacity: 50, currentCount: 20, occupancy: 40, cleanliness: "good", cleanlinessName: "Sạch sẽ", builtDate: "2023-01-15", size: "500m²", ventilation: "Tốt", location: "Khu A"},
  {id: "B2", name: "Chuồng B2", type: "pig", typeName: "Lợn thịt", capacity: 120, currentCount: 80, occupancy: 67, cleanliness: "good", cleanlinessName: "Sạch sẽ", builtDate: "2023-06-20", size: "800m²", ventilation: "Tốt", location: "Khu B"},
  {id: "C1", name: "Chuồng C1", type: "broiler", typeName: "Gà thịt", capacity: 5000, currentCount: 3200, occupancy: 64, cleanliness: "warning", cleanlinessName: "Cần vệ sinh", builtDate: "2024-01-10", size: "2000m²", ventilation: "Tự động", location: "Khu C"}
];

// Mock assigned livestock for demo
const ASSIGNED_LIVESTOCK = [
  {id: "VN001", name: "Bò sữa 01", type: "cattle", weight: 450, health: "good"},
  {id: "VN010", name: "Bò sữa 02", type: "cattle", weight: 420, health: "good"},
];



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
            <Col span={12}> 
              <Statistic   
                title="Độ lấp đầy"   
                value={barn.occupancy}   
                suffix="%"   precision={0}   
                valueStyle={{ color: '#059669', fontSize: '2.5rem' }} 
                />
            </Col>
            <Col span={12}>             
              <Statistic      
                title="Số vật nuôi"              
                value={barn.currentCount}              
                suffix=" con"            
                valueStyle={{ color: '#3B82F6', fontSize: '2.5rem' }}           
                />
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
