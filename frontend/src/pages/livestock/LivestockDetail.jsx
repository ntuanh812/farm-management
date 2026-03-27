import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button, Card, Col, Descriptions, Row, Statistic, Tag } from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import { PageHeader } from "../../components/layout/PageHeader";
import { initialBarnsData, initialLivestockData } from "../../data/mockData";

const healthColorMap = {
  healthy: "success",
  sick: "error",
  quarantine: "warning",
};

const healthLabelMap = {
  healthy: "Khỏe mạnh",
  sick: "Bệnh",
  quarantine: "Cách ly",
};

export const LivestockDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const livestock = initialLivestockData.find((item) => item._id === id);
  const barnMap = useMemo(
    () => Object.fromEntries(initialBarnsData.map((item) => [item._id, `${item.code} - ${item.name}`])),
    []
  );

  if (!livestock) return <div>Vật nuôi không tồn tại: {id}</div>;

  return (
    <div className="livestock-detail">
      <PageHeader
        title={`Chi tiết: ${livestock.name}`}
        subtitle={`Mã: ${livestock.tagCode}`}
        actions={[
          <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => navigate("/livestock")}>
            Danh sách
          </Button>,
        ]}
      />

      <Row gutter={16}>
        <Col xs={24} lg={8}>
          <Card>
            <Descriptions column={1} size="small" bordered>
              <Descriptions.Item label="Mã vật nuôi">{livestock.tagCode}</Descriptions.Item>
              <Descriptions.Item label="Nhóm">{livestock.category}</Descriptions.Item>
              <Descriptions.Item label="Loài">{livestock.type}</Descriptions.Item>
              <Descriptions.Item label="Chuồng">{barnMap[livestock.barnId] || livestock.barnId}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">{livestock.status}</Descriptions.Item>
              <Descriptions.Item label="Ghi chú">{livestock.notes || "-"}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>

        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card>
                <Statistic title="Cân nặng" value={livestock.weight || 0} suffix="kg" />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic title="Số lượng" value={livestock.quantity || 0} suffix="con" />
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card>
                <Statistic title="Sức khỏe" valueRender={() => (
                  <Tag color={healthColorMap[livestock.healthStatus]}>
                    {healthLabelMap[livestock.healthStatus] || livestock.healthStatus || "-"}
                  </Tag>
                )} />
              </Card>
            </Col>
          </Row>

          <Card style={{ marginTop: 16 }}>
            <Descriptions title="Thông tin backend schema" column={2} bordered>
              <Descriptions.Item label="Hướng sản xuất">
                {livestock.productionType?.length ? livestock.productionType.map((t) => <Tag key={t}>{t}</Tag>) : "-"}
              </Descriptions.Item>
              <Descriptions.Item label="Tạo lúc">{livestock.createdAt}</Descriptions.Item>
              <Descriptions.Item label="Cập nhật">{livestock.updatedAt}</Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

