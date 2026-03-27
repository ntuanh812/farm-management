import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";

import { Button, Card, Col, Descriptions, Row, Statistic, Table, Tag } from "antd";
import { ArrowLeftOutlined, ProfileOutlined } from "@ant-design/icons";
import { initialBarnsData, initialLivestockData } from "../../data/mockData";

const barnTypeLabel = {
  cow: "Bò",
  pig: "Lợn",
  chicken: "Gà",
};

const cleanlinessOptions = [
  { value: "clean", label: "Sạch", color: "success" },
  { value: "normal", label: "Bình thường", color: "warning" },
  { value: "dirty", label: "Bẩn", color: "error" },
];

const healthLabel = {
  healthy: "Khỏe mạnh",
  sick: "Bệnh",
  quarantine: "Cách ly",
};

const healthColor = {
  healthy: "success",
  sick: "error",
  quarantine: "warning",
};



export const BarnDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const barn = initialBarnsData.find(item => item._id === id);
  if (!barn) return <div>Chuồng trại không tồn tại: {id}</div>;

  const occupancy = barn.capacity ? Math.round(((barn.currentCount || 0) / barn.capacity) * 100) : 0;
  const cleanliness = cleanlinessOptions.find((item) => item.value === barn.cleanliness);

  const livestockInBarn = useMemo(
    () => initialLivestockData.filter((item) => item.barnId === barn._id),
    [barn._id]
  );
  
  const livestockColumns = [
    { title: "Mã", dataIndex: "tagCode", key: "tagCode", width: 100 },
    { title: "Tên", dataIndex: "name", key: "name" },
    { title: "Loài", dataIndex: "type", key: "type", render: (type) => <Tag>{type}</Tag> },
    { title: "Cân nặng", dataIndex: "weight", key: "weight", render: (w) => (w ? `${w} kg` : "-") },
    {
      title: "Sức khỏe",
      dataIndex: "healthStatus",
      key: "healthStatus",
      render: (h) => <Tag color={healthColor[h]}>{healthLabel[h] || h}</Tag>,
    },
  ];

  return (
    <div className="barn-detail">
      <PageHeader
        title={`Chi tiết ${barn.name}`}
        subtitle={`${barn.code} • ${barnTypeLabel[barn.type] || barn.type}`}
        actions={[
          <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => navigate('/barns')}>
            Danh sách
          </Button>
        ]}
      />
      
      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Card>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Mã chuồng">{barn.code}</Descriptions.Item>
              <Descriptions.Item label="Loại">{barnTypeLabel[barn.type] || barn.type}</Descriptions.Item>
              <Descriptions.Item label="Sức chứa">{barn.capacity}</Descriptions.Item>
              <Descriptions.Item label="Hiện tại">{barn.currentCount || 0}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{barn.status}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
        
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            <Col span={12}> 
              <Statistic   
                title="Độ lấp đầy"   
                value={occupancy}   
                suffix="%"   precision={0}   
                valueStyle={{ color: '#059669', fontSize: '2.5rem' }} 
                />
            </Col>
            <Col span={12}>             
              <Statistic      
                title="Số vật nuôi"              
                value={barn.currentCount || 0}              
                suffix=" con"            
                valueStyle={{ color: '#3B82F6', fontSize: '2.5rem' }}           
                />
            </Col>
            </Row>

          <Card style={{ marginTop: 16 }}>
            <Descriptions title="Thông tin chi tiết" column={2}>
              <Descriptions.Item label="Sức chứa">{barn.capacity} con</Descriptions.Item>
              <Descriptions.Item label="Hiện tại">{barn.currentCount || 0} con</Descriptions.Item>
              <Descriptions.Item label="Độ sạch">
                <Tag color={cleanliness?.color || "default"}>
                  {cleanliness?.label || barn.cleanliness}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>



      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card title={<span><ProfileOutlined /> Vật nuôi trong chuồng ({livestockInBarn.length} con)</span>}>
            <Table 
              columns={livestockColumns} 
              dataSource={livestockInBarn} 
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
              rowKey="_id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
