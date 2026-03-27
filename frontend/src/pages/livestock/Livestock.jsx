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
  Col
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, HomeOutlined, RiseOutlined, FallOutlined, UserOutlined, PushpinOutlined } from "@ant-design/icons";
import { initialLivestockData, initialBarnsData } from "../../data/mockData";

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

const statsData = [
  {
    title: "Tổng vật nuôi",
    value: 150,
    unit: "con",
    icon: <UserOutlined />,
    type: "livestock",
    trend: "+12",
    trendUp: true
  },
  {
    title: "Vật nuôi khỏe",
    value: 92,
    unit: "%",
    icon: <RiseOutlined />,
    type: "livestock",
    trend: "+2%",
    trendUp: true
  },
  {
    title: "Gia súc",
    value: 120,
    unit: "con",
    icon: <HomeOutlined />,
    type: "livestock",
    trend: "+5",
    trendUp: true
  },
  {
    title: "Gia cầm",
    value: 30,
    unit: "con", 
    icon: <PushpinOutlined />,
    type: "poultry",
    trend: "-3",
    trendUp: false
  }
];

export const Livestock = () => {
  const [data, setData] = useState(initialLivestockData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const barnMap = useMemo(
    () => Object.fromEntries(initialBarnsData.map((item) => [item._id, `${item.code} - ${item.name}`])),
    []
  );

  const columns = [
    {
      title: "Mã vật nuôi",
      dataIndex: "tagCode",
      key: "tagCode",
      sorter: (a, b) => a.tagCode.localeCompare(b.tagCode),
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Loại",
      key: "categoryType",
      render: (_, record) => <Tag>{`${record.category}/${record.type}`}</Tag>,
    },
    {
      title: "Sản xuất",
      dataIndex: "productionType",
      key: "productionType",
      render: (items) => items.map((item) => <Tag key={item}>{item}</Tag>),
    },
    {
      title: "Sức khỏe",
      dataIndex: "healthStatus",
      key: "healthStatus",
      render: (value) => {
        const item = healthStatusOptions.find((option) => option.value === value);
        return <Tag color={item?.color}>{item?.label || value}</Tag>;
      },
    },
    {
      title: "Chuồng",
      dataIndex: "barnId",
      key: "barnId",
      render: (barnId) => barnMap[barnId] || barnId,
    },
    {
      title: "Cân nặng",
      dataIndex: "weight",
      key: "weight",
      render: (value) => (value ? `${value} kg` : "-"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (value) => <Tag>{value}</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem">
            <Button type="text" icon={<EyeOutlined />} onClick={() => navigate(`/livestock/${record._id}`)} />
          </Tooltip>
          <Tooltip title="Sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} danger />
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
      okText: "Xóa",
      okType: "danger",
      onOk: () => {
        setData((prev) => prev.filter((item) => item._id !== record._id));
        message.success("Đã xóa");
      },
    });
  };

  const handleAdd = () => {
    setSelectedRecord(null);
    form.resetFields();
    form.setFieldsValue({ status: "active", productionType: [] });
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    const values = await form.validateFields();
    if (selectedRecord) {
      setData((prev) =>
        prev.map((item) =>
          item._id === selectedRecord._id ? { ...item, ...values, updatedAt: new Date().toISOString() } : item
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
        subtitle="Theo dõi và quản lý thông tin vật nuôi trong trang trại"
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm vật nuôi
          </Button>
        }
      />
<Row gutter={[20, 20]} className="livestock-stats">
          {statsData.map((stat, index) => (
            <Col xs={24} sm={12} lg={6} key={index}>
              <Card className={`stat-card stat-card--${stat.type}`}>
                <div className="stat-card__header">
                  <span className="stat-card__title">{stat.title}</span>
                  <div className="stat-card__icon">{stat.icon}</div>
                </div>
                <div className="stat-card__value">
                  {stat.value}
                  <span className="stat-card__label"> {stat.unit}</span>
                </div>
                <div className={`stat-card__trend ${stat.trendUp ? 'stat-card__trend--up' : 'stat-card__trend--down'}`}>
                  {stat.trendUp ? <RiseOutlined /> : <FallOutlined />}
                  <span>{stat.trend} so với tháng trước</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      <Card>
        <Table rowKey="_id" columns={columns} dataSource={data} />
      </Card>

      <Modal
        title={selectedRecord ? "Chỉnh sửa vật nuôi" : "Thêm vật nuôi"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="tagCode" label="Mã vật nuôi" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Nhóm" rules={[{ required: true }]}>
            <Select options={categoryOptions} />
          </Form.Item>
          <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
            <Select options={typeOptions} />
          </Form.Item>
          <Form.Item name="productionType" label="Hướng sản xuất" rules={[{ required: true }]}>
            <Select mode="multiple" options={productionTypeOptions} />
          </Form.Item>
          <Form.Item name="healthStatus" label="Sức khỏe">
            <Select options={healthStatusOptions.map((item) => ({ value: item.value, label: item.label }))} />
          </Form.Item>
          <Form.Item name="barnId" label="Chuồng" rules={[{ required: true }]}>
            <Select
              options={initialBarnsData.map((barn) => ({ value: barn._id, label: `${barn.code} - ${barn.name}` }))}
            />
          </Form.Item>
          <Form.Item name="weight" label="Cân nặng (kg)">
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>
          <Form.Item name="quantity" label="Số lượng">
            <InputNumber style={{ width: "100%" }} min={1} />
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{ required: true }]}>
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
