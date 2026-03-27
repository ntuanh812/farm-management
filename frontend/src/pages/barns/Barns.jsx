import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card, Row, Col, Table, Button, Tag, Space, Tooltip, Modal, Form, Input, Select, InputNumber, message } from "antd";
import { initialBarnsData } from "../../data/mockData";
import {
  PlusOutlined,
  FallOutlined,
  RiseOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  HomeOutlined} from "@ant-design/icons";

const { Option } = Select;

// Thống kê
const statsData = [
  {
    title: "Tổng chuồng trại",
    value: 8,
    unit: "chuồng",
    icon: <HomeOutlined />,
    type: "total",
    trend: "1",
    trendUp: true
  },
  {
    title: "Tỷ lệ lấp đầy TB",
    value: 55,
    unit: "%",
    icon: "📊",
    type: "occupancy",
    trend: "3%",
    trendUp: true
  },
  {
    title: "Chuồng trống",
    value: 2,
    unit: "chuồng",
    icon: "🟢",
    type: "empty", 
    trend: "1",
    trendUp: false
  },
  {
    title: "Độ sạch TB",
    value: 82,
    unit: "/100",
    icon: "🧼",
    type: "cleanliness",
    trend: "5",
    trendUp: true
  }
];

const barnTypeOptions = [
  { value: "cow", label: "Bò" },
  { value: "pig", label: "Lợn" },
  { value: "chicken", label: "Gà" },
];

const cleanlinessOptions = [
  { value: "clean", label: "Sạch", color: "success" },
  { value: "normal", label: "Bình thường", color: "warning" },
  { value: "dirty", label: "Bẩn", color: "error" },
];

const statusOptions = [
  { value: "active", label: "Đang hoạt động", color: "success" },
  { value: "maintenance", label: "Bảo trì", color: "warning" },
];


export const Barns = () => {
  const [data, setData] = useState(initialBarnsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const derivedData = useMemo(
    () =>
      data.map((item) => ({
        ...item,
        occupancy: item.capacity ? Math.round(((item.currentCount || 0) / item.capacity) * 100) : 0,
      })),
    [data]
  );

  // Filter data
  const filteredData = derivedData.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.code.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: "Mã chuồng",
      dataIndex: "code",
      key: "code",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Tên chuồng",
      dataIndex: "name",
      key: "name",
      width: 150,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Loại",
      dataIndex: "type",
      key: "type",
      width: 120,
      filters: barnTypeOptions.map(opt => ({ text: opt.label, value: opt.value })),
      onFilter: (value, record) => record.type === value,
      render: (value) => barnTypeOptions.find((opt) => opt.value === value)?.label || value,
    },
    {
      title: "Sức chứa",
      key: "occupancy",
      width: 150,
      render: (_, record) => (
        <div>
          <div>{record.currentCount}/{record.capacity}</div>
          <Tag color="blue">{record.occupancy}%</Tag>
        </div>
      ),
      sorter: (a, b) => a.occupancy - b.occupancy,
    },
    {
      title: "Độ sạch",
      dataIndex: "cleanliness",
      key: "cleanliness",
      width: 120,
      render: (value) => {
        const opt = cleanlinessOptions.find((item) => item.value === value);
        return <Tag color={opt?.color || "default"}>{opt?.label || value}</Tag>;
      },
      filters: cleanlinessOptions.map((opt) => ({ text: opt.label, value: opt.value })),
      onFilter: (value, record) => record.cleanliness === value,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      render: (value) => {
        const opt = statusOptions.find((item) => item.value === value);
        return <Tag color={opt?.color || "default"}>{opt?.label || value}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Xem chi tiết">
            <Button 
              type="text" 
              icon={<EyeOutlined />} 
              onClick={() => navigate(`/barns/${record._id}`)}
              className="action-btn action-btn--view"
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <Button 
              type="text" 
              icon={<EditOutlined />} 
              onClick={() => handleEdit(record)}
              className="action-btn action-btn--edit"
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button 
              type="text" 
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record)}
              className="action-btn action-btn--delete"
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
      content: `Bạn có chắc chắn muốn xóa chuồng "${record.name}" không?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        setData(data.filter(item => item._id !== record._id));
        message.success("Xóa chuồng thành công!");
      },
    });
  };

  const handleAdd = () => {
    setSelectedRecord(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  const handleModalOk = () => {
    form.validateFields().then(values => {
      if (selectedRecord) {
        setData(data.map(item => (item._id === selectedRecord._id ? { ...item, ...values } : item)));
        message.success("Cập nhật chuồng thành công!");
      } else {
        const newItem = {
          _id: `barn-${Date.now()}`,
          ...values,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setData([...data, newItem]);
        message.success("Thêm chuồng mới thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  return (
    <div className="barns">
      <PageHeader
        title="Quản lý chuồng trại"
        subtitle="Theo dõi và quản lý toàn bộ chuồng trại trong trang trại"
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm chuồng
          </Button>
        }
      />

      <div className="barns__maincontent">
        {/* Stats Grid */}
        <Row gutter={[20, 20]} className="barns-stats">
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

        {/* Table Section */}
        <Card className="table-card">
          <div className="table-card__header">
            <h3>Danh sách chuồng trại</h3>
            <Input
              placeholder="Tìm kiếm..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={e => setSearchText(e.target.value)}
              className="search-input"
              style={{ width: 250 }}
            />
          </div>
          <Table
            columns={columns}
            dataSource={filteredData}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} chuồng trại`,
            }}
            scroll={{ x: 1200 }}
            className="barns-table"
            rowKey="_id"
          />
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={selectedRecord ? "Chỉnh sửa chuồng" : "Thêm chuồng mới"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText={selectedRecord ? "Lưu" : "Thêm mới"}
        cancelText="Hủy"
        width={600}
      >
        <Form form={form} layout="vertical" className="barns-form">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="code" label="Mã chuồng" rules={[{ required: true }]}>
                <Input placeholder="Nhập mã chuồng" disabled={!!selectedRecord} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="name" label="Tên chuồng" rules={[{ required: true }]}>
                <Input placeholder="Nhập tên chuồng" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="type" label="Loại chuồng" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại">
                  {barnTypeOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="capacity" label="Sức chứa" rules={[{ required: true }]}>
                <InputNumber min={1} placeholder="Sức chứa tối đa" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="currentCount" label="Hiện tại">
                <InputNumber min={0} placeholder="Số vật nuôi hiện tại" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="cleanliness" label="Độ sạch">
                <Select placeholder="Chọn độ sạch">
                  {cleanlinessOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="status" label="Trạng thái" initialValue="active" rules={[{ required: true }]}>
            <Select placeholder="Chọn trạng thái">
              {statusOptions.map((opt) => (
                <Option key={opt.value} value={opt.value}>
                  {opt.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
