import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";

import {
  Card,
  Table,
  Button,
  Tag,
  Space,
  Tooltip,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  message,
  Row,
  Col,
} from "antd";

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  HomeOutlined,
  RiseOutlined,
  FallOutlined,
  UserOutlined,
  PushpinOutlined,
  SearchOutlined,
} from "@ant-design/icons";

import { initialLivestockData, initialBarnsData } from "../../data/mockData";

const { Option } = Select;

const categoryOptions = [
  { value: "livestock", label: "Gia súc" },
  { value: "poultry", label: "Gia cầm" },
];

const typeOptions = [
  { value: "cow", label: "Bò" },
  { value: "pig", label: "Lợn" },
  { value: "chicken", label: "Gà" },
  { value: "duck", label: "Vịt" },
];

const productionTypeOptions = [
  { value: "milk", label: "Sữa" },
  { value: "meat", label: "Thịt" },
  { value: "eggs", label: "Trứng" },
];

const healthStatusOptions = [
  { value: "healthy", label: "Khỏe mạnh", color: "success" },
  { value: "sick", label: "Bệnh", color: "error" },
  { value: "quarantine", label: "Cách ly", color: "warning" },
];

const statusOptions = [
  { value: "active", label: "Hoạt động" },
  { value: "sold", label: "Đã bán" },
  { value: "dead", label: "Đã chết" },
];

export const Livestock = () => {
  const [data, setData] = useState(initialLivestockData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [searchText, setSearchText] = useState("");

  const [form] = Form.useForm();
  const navigate = useNavigate();

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

  // ========================
  // Stats tính từ data
  // ========================

  const statsData = useMemo(() => {
    const total = data.reduce((sum, item) => sum + (item.quantity || 1), 0);

    const healthy =
      data.filter((item) => item.healthStatus === "healthy").length;

    const livestock =
      data
        .filter((item) => item.category === "livestock")
        .reduce((sum, item) => sum + (item.quantity || 1), 0);

    const poultry =
      data
        .filter((item) => item.category === "poultry")
        .reduce((sum, item) => sum + (item.quantity || 1), 0);

    return [
      {
        title: "Tổng vật nuôi",
        value: total,
        unit: "con",
        icon: <UserOutlined />,
        type: "livestock",
        trend: "+2",
        trendUp: true,
      },
      {
        title: "Vật nuôi khỏe",
        value: total ? Math.round((healthy / data.length) * 100) : 0,
        unit: "%",
        icon: <RiseOutlined />,
        type: "livestock",
        trend: "+3%",
        trendUp: true,
      },
      {
        title: "Gia súc",
        value: livestock,
        unit: "con",
        icon: <HomeOutlined />,
        type: "livestock",
        trend: "+5",
        trendUp: true,
      },
      {
        title: "Gia cầm",
        value: poultry,
        unit: "con",
        icon: <PushpinOutlined />,
        type: "poultry",
        trend: "-1",
        trendUp: false,
      },
    ];
  }, [data]);

  // ========================
  // Filter search
  // ========================

  const filteredData = data.filter(
    (item) =>
      item.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      item.tagCode?.toLowerCase().includes(searchText.toLowerCase())
  );

  // ========================
  // Table columns
  // ========================

  const columns = [
    {
      title: "Mã vật nuôi",
      dataIndex: "tagCode",
      sorter: (a, b) => a.tagCode.localeCompare(b.tagCode),
    },
    {
      title: "Tên",
      dataIndex: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Loại",
      render: (_, record) => (
        <Tag>
          {categoryOptions.find((i) => i.value === record.category)?.label}/
          {typeOptions.find((i) => i.value === record.type)?.label}
        </Tag>
      ),
    },
    {
      title: "Sản xuất",
      dataIndex: "productionType",
      render: (items) =>
        items?.map((item) => (
          <Tag key={item}>
            {productionTypeOptions.find((i) => i.value === item)?.label}
          </Tag>
        )),
    },
    {
      title: "Sức khỏe",
      dataIndex: "healthStatus",
      render: (value) => {
        const item = healthStatusOptions.find(
          (option) => option.value === value
        );
        return <Tag color={item?.color}>{item?.label}</Tag>;
      },
    },
    {
      title: "Chuồng",
      dataIndex: "barnId",
      render: (barnId) => barnMap[barnId],
    },
    {
      title: "Cân nặng",
      dataIndex: "weight",
      render: (value) => (value ? `${value} kg` : "-"),
    },
    {
      title: "Thao tác",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => navigate(`/livestock/${record._id}`)}
            />
          </Tooltip>

          <Tooltip title="Sửa">
            <Button
              type="text"
              icon={<EditOutlined />}
              onClick={() => handleEdit(record)}
            />
          </Tooltip>

          <Tooltip title="Xóa">
            <Button
              type="text"
              danger
              icon={<DeleteOutlined />}
              onClick={() => handleDelete(record)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const handleEdit = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Xóa vật nuôi "${record.name}"?`,
      okType: "danger",
      onOk: () => {
        setData((prev) =>
          prev.filter((item) => item._id !== record._id)
        );
        message.success("Đã xóa");
      },
    });
  };

  const handleAdd = () => {
    setSelectedRecord(null);
    form.resetFields();
    form.setFieldsValue({
      status: "active",
      productionType: [],
    });
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    const values = await form.validateFields();

    if (selectedRecord) {
      setData((prev) =>
        prev.map((item) =>
          item._id === selectedRecord._id
            ? {
                ...item,
                ...values,
                updatedAt: new Date().toISOString(),
              }
            : item
        )
      );

      message.success("Cập nhật thành công");
    } else {
      const newItem = {
        _id: `livestock-${Date.now()}`,
        ...values,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setData((prev) => [...prev, newItem]);

      message.success("Thêm mới thành công");
    }

    setIsModalOpen(false);
  };

  return (
    <div className="livestock">
      <PageHeader
        title="Quản lý vật nuôi"
        subtitle="Theo dõi và quản lý vật nuôi trong trang trại"
        actions={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm vật nuôi
          </Button>
        }
      />

      <div className="livestock__maincontent">
        {/* Stats */}

        <Row gutter={[20, 20]} className="livestock-stats">
          {statsData.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card
                className={`stat-card stat-card--${stat.type}`}
              >
                <div className="stat-card__header">
                  <span className="stat-card__title">
                    {stat.title}
                  </span>

                  <div className="stat-card__icon">
                    {stat.icon}
                  </div>
                </div>

                <div className="stat-card__value">
                  {stat.value}
                  <span className="stat-card__label">
                    {" "}
                    {stat.unit}
                  </span>
                </div>

                <div
                  className={`stat-card__trend ${
                    stat.trendUp
                      ? "stat-card__trend--up"
                      : "stat-card__trend--down"
                  }`}
                >
                  {stat.trendUp ? (
                    <RiseOutlined />
                  ) : (
                    <FallOutlined />
                  )}

                  <span>{stat.trend} so với tháng trước</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Table */}

        <Card className="table-card">
          <div className="table-card__header">
            <h3>Danh sách vật nuôi</h3>

            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) =>
                setSearchText(e.target.value)
              }
              style={{ width: 250 }}
            />
          </div>

          <Table
            rowKey="_id"
            columns={columns}
            dataSource={filteredData}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
            }}
          />
        </Card>
      </div>

      <Modal
        title={
          selectedRecord
            ? "Chỉnh sửa vật nuôi"
            : "Thêm vật nuôi"
        }
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="tagCode"
            label="Mã vật nuôi"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="Nhóm"
            rules={[{ required: true }]}
          >
            <Select options={categoryOptions} />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại"
            rules={[{ required: true }]}
          >
            <Select options={typeOptions} />
          </Form.Item>

          <Form.Item
            name="productionType"
            label="Hướng sản xuất"
            rules={[{ required: true }]}
          >
            <Select
              mode="multiple"
              options={productionTypeOptions}
            />
          </Form.Item>

          <Form.Item name="healthStatus" label="Sức khỏe">
            <Select
              options={healthStatusOptions.map((item) => ({
                value: item.value,
                label: item.label,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="barnId"
            label="Chuồng"
            rules={[{ required: true }]}
          >
            <Select
              options={initialBarnsData.map((barn) => ({
                value: barn._id,
                label: `${barn.code} - ${barn.name}`,
              }))}
            />
          </Form.Item>

          <Form.Item name="weight" label="Cân nặng">
            <InputNumber
              style={{ width: "100%" }}
              min={0}
            />
          </Form.Item>

          <Form.Item name="quantity" label="Số lượng">
            <InputNumber
              style={{ width: "100%" }}
              min={1}
            />
          </Form.Item>

          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select options={statusOptions} />
          </Form.Item>

          <Form.Item name="notes" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};