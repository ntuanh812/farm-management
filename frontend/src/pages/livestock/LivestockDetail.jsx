import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Button,
  Card,
  Col,
  Descriptions,
  Row,
  Statistic,
  Tag,
  Table
} from "antd";

import { ArrowLeftOutlined } from "@ant-design/icons";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

import { PageHeader } from "../../components/layout/PageHeader";

import {
  initialBarnsData,
  initialLivestockData,
  initialVaccinationsData,
  initialProductionData,
  weightHistoryData
} from "../../data/mockData";

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

const vaccinationStatusMap = {
  scheduled: "warning",
  done: "success"
};

const vaccinationLabelMap = {
  scheduled: "Đã lên lịch",
  done: "Hoàn thành"
};

const productionTypeLabel = {
  milk: "Sữa",
  eggs: "Trứng",
  meat: "Thịt"
};

const unitLabel = {
  liter: "Lít",
  eggs: "Quả",
  kg: "Kg"
};

export const LivestockDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const livestock = initialLivestockData.find(
    (item) => item._id === id
  );

  const barnMap = useMemo(
    () =>
      Object.fromEntries(
        initialBarnsData.map((item) => [
          item._id,
          `${item.code} - ${item.name}`,
        ])
      ),
    []
  );

  // vaccination filter
  const vaccinations = initialVaccinationsData.filter(
    (item) => item.livestockId === id
  );

  // production filter
  const productions = initialProductionData.filter(
    (item) => item.livestockId === id
  );

  // weight history
  const weightHistory = weightHistoryData.filter(
    (item) => item.livestockId === id
  );

  const isMeat = livestock?.productionType?.includes("meat");

  if (!livestock)
    return <div>Vật nuôi không tồn tại: {id}</div>;

  const vaccinationColumns = [
    {
      title: "Vaccine",
      dataIndex: "vaccineName",
    },
    {
      title: "Ngày tiêm",
      dataIndex: "vaccinationDate",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (status) => (
        <Tag color={vaccinationStatusMap[status]}>
          {vaccinationLabelMap[status]}
        </Tag>
      ),
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
    },
    {
      title: "Người phụ trách",
      dataIndex: "staffId",
      render: (staffId) => staffId || "-",
    }
  ];

  const productionColumns = [
    {
      title: "Loại",
      dataIndex: "productionType",
      render: (type) => productionTypeLabel[type],
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
    },
    {
      title: "Đơn vị",
      dataIndex: "unit",
      render: (unit) => unitLabel[unit],
    },
    {
      title: "Ngày",
      dataIndex: "date",
    },
    {
      title: "Ghi chú",
      dataIndex: "notes",
    },
  ];

  return (
    <div className="livestock-detail">
      <PageHeader
        title={`Chi tiết: ${livestock.name}`}
        subtitle={`Mã: ${livestock.tagCode}`}
        actions={[
          <Button
            key="back"
            icon={<ArrowLeftOutlined />}
            onClick={() => navigate("/livestock")}
          >
            Danh sách
          </Button>,
        ]}
      />

      <Row gutter={16}>
        {/* LEFT */}
        <Col xs={24} lg={8}>
          <Card>
            <Descriptions column={1} size="small" bordered>

              <Descriptions.Item label="Mã vật nuôi">
                {livestock.tagCode}
              </Descriptions.Item>

              <Descriptions.Item label="Nhóm">
                {livestock.category}
              </Descriptions.Item>

              <Descriptions.Item label="Loài">
                {livestock.type}
              </Descriptions.Item>

              <Descriptions.Item label="Chuồng">
                {barnMap[livestock.barnId] || livestock.barnId}
              </Descriptions.Item>

              <Descriptions.Item label="Trạng thái">
                {livestock.status}
              </Descriptions.Item>

              <Descriptions.Item label="Ghi chú">
                {livestock.notes || "-"}
              </Descriptions.Item>

            </Descriptions>
          </Card>
        </Col>

        {/* RIGHT */}
        <Col xs={24} lg={16}>

          {/* STAT */}
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="Cân nặng"
                  value={livestock.weight || 0}
                  suffix="kg"
                />
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="Số lượng"
                  value={livestock.quantity || 0}
                  suffix="con"
                />
              </Card>
            </Col>

            <Col xs={24} md={8}>
              <Card>
                <Statistic
                  title="Sức khỏe"
                  valueRender={() => (
                    <Tag color={healthColorMap[livestock.healthStatus]}>
                      {healthLabelMap[livestock.healthStatus] || "-"}
                    </Tag>
                  )}
                />
              </Card>
            </Col>
          </Row>

          {/* Production OR Weight */}
          {isMeat ? (

            <Card
              title="Biểu đồ cân nặng"
              style={{ marginTop: 16 }}
            >
              <ResponsiveContainer
                width="100%"
                height={300}
              >
                <LineChart data={weightHistory}>
                  <CartesianGrid strokeDasharray="3 3" />

                  <XAxis dataKey="date" />

                  <YAxis />

                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#52c41a"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </Card>

          ) : (

            <Card
              title="Sản lượng"
              style={{ marginTop: 16 }}
            >
              <Table
                columns={productionColumns}
                dataSource={productions}
                rowKey="_id"
                pagination={false}
              />
            </Card>

          )}

          {/* Vaccination */}
          <Card
            title="Lịch tiêm phòng"
            style={{ marginTop: 16 }}
          >
            <Table
              columns={vaccinationColumns}
              dataSource={vaccinations}
              rowKey="_id"
              pagination={false}
            />
          </Card>

        </Col>
      </Row>
    </div>
  );
};