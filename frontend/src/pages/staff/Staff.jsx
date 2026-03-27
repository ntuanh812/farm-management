import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card, Row, Col, Table, Button, Tag, Space, Tooltip, Modal, Form, Input, Select, message } from "antd";
import { initialStaffData } from "../../data/mockData";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  TeamOutlined,
  UserOutlined,
  FallOutlined,
  RiseOutlined
} from "@ant-design/icons";

const { Option } = Select;

// Mock data for staff


// Statistics data
const statsData = [
  {
    title: "Tổng nhân viên",
    value: 10,
    unit: "người",
    icon: <TeamOutlined />,
    type: "total",
    trend: "+1",
    trendUp: true
  },
  {
    title: "Chăn nuôi",
    value: 5,
    unit: "người",
    icon: "👨‍🌾",
    type: "livestock",
    trend: "+1",
    trendUp: true
  },
  {
    title: "Hành chính",
    value: 3,
    unit: "người",
    icon: "🏢",
    type: "admin",
    trend: "0",
    trendUp: false
  },
  {
    title: "Thử việc",
    value: "1",
    unit: "người",
    icon: <UserOutlined />,
    type: "trial",
    trend: "+1",
    trendUp: true
  }
];
const roleOptions = [
  { value: "manager", label: "Quản lý" },
  { value: "worker", label: "Nhân công" },
  { value: "vet", label: "Thú y" },
];

// Status options
const statusOptions = [
  { value: "active", label: "Đang làm", color: "success" },
  { value: "inactive", label: "Ngừng làm", color: "default" },
];


export const Staff = () => {
  const [data, setData] = useState(initialStaffData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Filter data based on search
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.code.toLowerCase().includes(searchText.toLowerCase()) ||
    item.role.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: "Mã NV",
      dataIndex: "code",
      key: "code",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Tên nhân viên",
      dataIndex: "name",
      key: "name",
      width: 150,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      width: 120,
      filters: roleOptions.map(opt => ({ text: opt.label, value: opt.value })),
      onFilter: (value, record) => record.role === value,
      render: (value) => roleOptions.find((opt) => opt.value === value)?.label || value,
    },
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      width: 120,
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      width: 220,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (_, record) => {
        const color = statusOptions.find(s => s.value === record.status)?.color || "default";
        return <Tag color={color}>{statusOptions.find(s => s.value === record.status)?.label}</Tag>;
      },
      filters: statusOptions.map(opt => ({ text: opt.label, value: opt.value })),
      onFilter: (value, record) => record.status === value,
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
              onClick={() => navigate(`/staff/${record._id}`)}
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
      content: `Bạn có chắc chắn muốn xóa nhân viên "${record.name}" không?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        setData(data.filter(item => item._id !== record._id));
        message.success("Xóa nhân viên thành công!");
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
        // Update
        setData(data.map(item => 
          item._id === selectedRecord._id 
            ? { 
                ...item, 
                ...values,
              } 
            : item
        ));
        message.success("Cập nhật nhân viên thành công!");
      } else {
        // Add new
        const newItem = {
          _id: `staff-${Date.now()}`,
          ...values,
          status: "active"
        };
        setData([...data, newItem]);
        message.success("Thêm nhân viên mới thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
    }).catch(() => {});
  };

  return (
    <div className="staff">
      <PageHeader
        title="Quản lý nhân viên"
        subtitle="Theo dõi và quản lý đội ngũ nhân viên trang trại"
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm nhân viên
          </Button>
        }
      />

      <div className="staff__maincontent">
        {/* Stats Grid */}
        <Row gutter={[20, 20]} className="staff-stats">
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
            <h3>Danh sách nhân viên</h3>
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
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} nhân viên`,
            }}
            scroll={{ x: 1400 }}
            className="staff-table"
            rowKey="_id"
          />
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={selectedRecord ? "Chỉnh sửa nhân viên" : "Thêm nhân viên mới"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText={selectedRecord ? "Lưu" : "Thêm mới"}
        cancelText="Hủy"
        width={700}
      >
        <Form form={form} layout="vertical" className="staff-form">
          <Form.Item name="name" label="Họ tên" rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}>
            <Input placeholder="Nhập họ tên nhân viên" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
                <Select placeholder="Chọn vai trò">
                  {roleOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="code" label="Mã nhân viên" rules={[{ required: true }]}>
                <Input placeholder="NV001" disabled={!!selectedRecord} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái" initialValue="active">
                <Select placeholder="Chọn trạng thái">
                  {statusOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="email" label="Email">
            <Input placeholder="email@domain.com" />
          </Form.Item>

          <Form.Item name="address" label="Địa chỉ">
            <Input.TextArea rows={3} placeholder="Nhập địa chỉ thường trú" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
