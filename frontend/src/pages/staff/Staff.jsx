import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { PageHeader } from "../../components/layout/PageHeader";
import { Card, Row, Col, Table, Button, Tag, Space, Tooltip, Modal, Form, Input, Select, InputNumber, message, DatePicker } from "antd";

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
const { RangePicker } = DatePicker;

// Mock data for staff
const initialStaffData = [
  {
    key: "1",
    id: "NV001",
    name: "Nguyễn Văn A",
    role: "manager",
    roleName: "Quản lý",
    department: "admin",
    deptName: "Hành chính",
    salary: 15000000,
    phone: "0901234567",
    hireDate: "2023-01-15",
    status: "active"
  },
  {
    key: "2",
    id: "NV002",
    name: "Trần Thị B",
    role: "veterinarian",
    roleName: "Thú y",
    department: "livestock",
    deptName: "Chăn nuôi",
    salary: 12000000,
    phone: "0902345678",
    hireDate: "2023-06-20",
    status: "active"
  },
  {
    key: "3",
    id: "NV003",
    name: "Lê Văn C",
    role: "farmer",
    roleName: "Công nhân",
    department: "livestock",
    deptName: "Chăn nuôi",
    salary: 8000000,
    phone: "0903456789",
    hireDate: "2024-01-10",
    status: "active"
  },
  // Thêm 7 records nữa tương tự...
  {
    key: "4",
    id: "NV004",
    name: "Phạm Thị D",
    role: "accountant",
    roleName: "Kế toán",
    department: "finance",
    deptName: "Tài chính",
    salary: 10000000,
    phone: "0904567890",
    hireDate: "2023-03-01",
    status: "active"
  },
  {
    key: "5",
    id: "NV005",
    name: "Hoàng Văn E",
    role: "technician",
    roleName: "Kỹ thuật",
    department: "maintenance",
    deptName: "Bảo trì",
    salary: 9000000,
    phone: "0905678901",
    hireDate: "2023-11-15",
    status: "leave"
  },
  {
    key: "6",
    id: "NV006",
    name: "Vũ Thị F",
    role: "hr",
    roleName: "Nhân sự",
    department: "admin",
    deptName: "Hành chính",
    salary: 11000000,
    phone: "0906789012",
    hireDate: "2024-02-01",
    status: "active"
  },
  {
    key: "7",
    id: "NV007",
    name: "Đặng Văn G",
    role: "farmer",
    roleName: "Công nhân",
    department: "livestock",
    deptName: "Chăn nuôi",
    salary: 7500000,
    phone: "0907890123",
    hireDate: "2024-04-10",
    status: "active"
  },
  {
    key: "8",
    id: "NV008",
    name: "Bùi Thị H",
    role: "veterinarian",
    roleName: "Thú y",
    department: "livestock",
    deptName: "Chăn nuôi",
    salary: 13000000,
    phone: "0908901234",
    hireDate: "2023-09-05",
    status: "active"
  },
  {
    key: "9",
    id: "NV009",
    name: "Ngô Văn I",
    role: "manager",
    roleName: "Quản lý",
    department: "livestock",
    deptName: "Chăn nuôi",
    salary: 18000000,
    phone: "0909012345",
    hireDate: "2022-12-01",
    status: "active"
  },
  {
    key: "10",
    id: "NV010",
    name: "Lý Thị K",
    role: "cleaner",
    roleName: "Vệ sinh",
    department: "maintenance",
    deptName: "Bảo trì",
    salary: 6000000,
    phone: "0910123456",
    hireDate: "2024-05-15",
    status: "trial"
  }
];

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

// Role options
const roleOptions = [
  { value: "manager", label: "Quản lý" },
  { value: "veterinarian", label: "Thú y" },
  { value: "farmer", label: "Công nhân" },
  { value: "accountant", label: "Kế toán" },
  { value: "technician", label: "Kỹ thuật" },
  { value: "hr", label: "Nhân sự" },
  { value: "cleaner", label: "Vệ sinh" }
];

// Department options
const deptOptions = [
  { value: "admin", label: "Hành chính" },
  { value: "livestock", label: "Chăn nuôi" },
  { value: "finance", label: "Tài chính" },
  { value: "maintenance", label: "Bảo trì" }
];

// Status options
const statusOptions = [
  { value: "active", label: "Đang làm", color: "success" },
  { value: "leave", label: "Nghỉ phép", color: "warning" },
  { value: "trial", label: "Thử việc", color: "blue" }
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
    item.id.toLowerCase().includes(searchText.toLowerCase()) ||
    item.roleName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.deptName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: "Mã NV",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a.id.localeCompare(b.id),
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
      dataIndex: "roleName",
      key: "role",
      width: 120,
      filters: roleOptions.map(opt => ({ text: opt.label, value: opt.label })),
      onFilter: (value, record) => record.roleName === value,
    },
    {
      title: "Phòng ban",
      dataIndex: "deptName",
      key: "department",
      width: 120,
      filters: deptOptions.map(opt => ({ text: opt.label, value: opt.label })),
      onFilter: (value, record) => record.deptName === value,
    },
    // Lương column removed as per feedback
    {
      title: "SĐT",
      dataIndex: "phone",
      key: "phone",
      width: 120,
    },
    {
      title: "Ngày vào",
      dataIndex: "hireDate",
      key: "hireDate",
      width: 120,
      sorter: (a, b) => new Date(a.hireDate) - new Date(b.hireDate),
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
              onClick={() => navigate(`/staff/${record.id}`)}
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
        setData(data.filter(item => item.key !== record.key));
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
          item.key === selectedRecord.key 
            ? { 
                ...item, 
                ...values,
                roleName: roleOptions.find(r => r.value === values.role)?.label || values.roleName,
                deptName: deptOptions.find(d => d.value === values.department)?.label || values.deptName
              } 
            : item
        ));
        message.success("Cập nhật nhân viên thành công!");
      } else {
        // Add new
        const newKey = (parseInt(data[data.length - 1]?.key || "0") + 1).toString();
        const newItem = {
          key: newKey,
          id: `NV${String(data.length + 1).padStart(3, "0")}`,
          ...values,
          roleName: roleOptions.find(r => r.value === values.role)?.label || values.role,
          deptName: deptOptions.find(d => d.value === values.department)?.label || values.department,
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
              <Form.Item name="department" label="Phòng ban" rules={[{ required: true }]}>
                <Select placeholder="Chọn phòng ban">
                  {deptOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            
            <Col span={12}>
              <Form.Item name="phone" label="Số điện thoại">
                <Input placeholder="Nhập số điện thoại" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="hireDate" label="Ngày vào làm" rules={[{ required: true }]}>
                <Input type="date" style={{ width: "100%" }} />
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

          <Form.Item name="address" label="Địa chỉ">
            <Input.TextArea rows={3} placeholder="Nhập địa chỉ thường trú" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
