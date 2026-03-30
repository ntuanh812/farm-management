import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";

import {
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Statistic,
  Table,
  Tag,
  Progress,
  Result
} from "antd";

import {
  ArrowLeftOutlined,
  ProfileOutlined
} from "@ant-design/icons";

import {
  initialBarnsData,
  initialLivestockData
} from "../../data/mockData";


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

  // tìm chuồng
  const barn = useMemo(
    () => initialBarnsData.find((item) => item._id === id),
    [id]
  );

  // destructuring an toàn
  const {
    name,
    code,
    capacity,
    currentCount,
    cleanliness,
    status,
    _id
  } = barn || {};

  // độ lấp đầy
  const occupancy = useMemo(() => {
    if (!capacity) return 0;
    return Math.round(((currentCount || 0) / capacity) * 100);
  }, [capacity, currentCount]);

  // độ sạch
  const cleanlinessData = useMemo(() => {
    if (!cleanliness) return null;
    return cleanlinessOptions.find(
      (item) => item.value === cleanliness
    );
  }, [cleanliness]);

  // vật nuôi trong chuồng
  const livestockInBarn = useMemo(() => {
    if (!_id) return [];
    return initialLivestockData.filter(
      (item) => item.barnId === _id
    );
  }, [_id]);

  // columns
  const livestockColumns = useMemo(
    () => [
      {
        title: "Mã",
        dataIndex: "tagCode",
        key: "tagCode",
        width: 100
      },
      {
        title: "Tên",
        dataIndex: "name",
        key: "name"
      },
      {
        title: "Loài",
        dataIndex: "type",
        key: "type",
        render: (type) => <Tag>{type}</Tag>
      },
      {
        title: "Cân nặng",
        dataIndex: "weight",
        key: "weight",
        render: (w) => (w ? `${w} kg` : "-")
      },
      {
        title: "Sức khỏe",
        dataIndex: "healthStatus",
        key: "healthStatus",
        render: (h) => (
          <Tag color={healthColor[h]}>
            {healthLabel[h] || h}
          </Tag>
        )
      }
    ],
    []
  );

  // return sau cùng
  if (!barn) {
    return (
      <Result
        status="404"
        title="Không tìm thấy chuồng trại"
        subTitle={`ID: ${id}`}
        extra={
          <Button
            type="primary"
            onClick={() => navigate("/barns")}
          >
            Quay lại danh sách
          </Button>
        }
      />
    );
  }

  return (
    <div className="barn-detail">
      <PageHeader
        title={`Chi tiết ${name}`}
        actions={[
          <Button
            key="back"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/barns")}
          >
            Danh sách
          </Button>
        ]}
      />

      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Card>
            <Descriptions column={1} size="small">
              <Descriptions.Item label="Mã chuồng">
                {code}
              </Descriptions.Item>

              <Descriptions.Item label="Sức chứa">
                {capacity} con
              </Descriptions.Item>

              <Descriptions.Item label="Hiện tại">
                {currentCount || 0} con
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                {status}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            <Col span={12}>
              <Card>
                <Statistic
                  title="Độ lấp đầy"
                  value={occupancy}
                  suffix="%"
                  precision={0}
                  valueStyle={{
                    color: "#059669",
                    fontSize: "2.5rem"
                  }}
                />

                <Progress
                  percent={occupancy}
                  strokeColor="#059669"
                />
              </Card>
            </Col>

            <Col span={12}>
              <Card>
                <Statistic
                  title="Số vật nuôi"
                  value={currentCount || 0}
                  suffix=" con"
                  valueStyle={{
                    color: "#3B82F6",
                    fontSize: "2.5rem"
                  }}
                />
              </Card>
            </Col>
          </Row>

          <Card
            style={{ marginTop: 16 }}
            title="Thông tin chi tiết"
          >
            <Descriptions column={2}>
              <Descriptions.Item label="Sức chứa">
                {capacity} con
              </Descriptions.Item>

              <Descriptions.Item label="Hiện tại">
                {currentCount || 0} con
              </Descriptions.Item>

              <Descriptions.Item label="Độ sạch">
                <Tag
                  color={
                    cleanlinessData?.color || "default"
                  }
                >
                  {cleanlinessData?.label ||
                    cleanliness}
                </Tag>
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 24 }}>
        <Col span={24}>
          <Card
            title={
              <span>
                <ProfileOutlined /> Vật nuôi trong chuồng (
                {livestockInBarn.length} con)
              </span>
            }
          >
            <Table
              columns={livestockColumns}
              dataSource={livestockInBarn}
              pagination={false}
              size="small"
              scroll={{ x: 600 }}
              rowKey="_id"
              onRow={(record) => ({
                onClick: () =>
                  navigate(`/livestock/${record._id}`)
              })}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};