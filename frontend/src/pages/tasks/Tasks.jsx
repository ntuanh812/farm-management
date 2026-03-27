import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card, Row, Col, Table, Button, Tag, Space, Tooltip, Modal, Form, Input, Select, DatePicker, message } from "antd";

import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  CalendarOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  RiseOutlined,
  FallOutlined
} from "@ant-design/icons";

const { Option } = Select;

import { initialTasksData, initialStaffData, initialBarnsData, initialLivestockData } from "../../data/mockData";

// Statistics data - matching pattern
const statsData = [
  {
    title: "Tổng công việc",
    value: 6,
    unit: "nhiệm vụ",
    icon: <CalendarOutlined />,
    type: "total",
    trend: "+2",
    trendUp: true
  },
  {
    title: "Hoàn thành",
    value: 1,
    unit: "công việc",
    icon: <CheckCircleOutlined />,
    type: "completed",
    trend: "+1",
    trendUp: true
  },
  {
    title: "Quá hạn",
    value: 1,
    unit: "công việc",
    icon: <CloseCircleOutlined />,
    type: "overdue",
    trend: "0",
    trendUp: false
  },
  {
    title: "Hôm nay",
    value: 3,
    unit: "deadline",
    icon: <ClockCircleOutlined />,
    type: "today",
    trend: "+1",
    trendUp: true
  }
];

// Category options - backend enum
const categoryOptions = [
  { value: "feeding", label: "Cho ăn" },
  { value: "cleaning", label: "Vệ sinh" },
  { value: "medical", label: "Y tế" },
];

// Priority options - backend enum
const priorityOptions = [
  { value: "low", label: "Thấp", color: "default" },
  { value: "medium", label: "Trung bình", color: "warning" },
  { value: "high", label: "Cao", color: "error" }
];

const statusOptions = [
  { value: "pending", label: "Chờ", color: "default" },
  { value: "in_progress", label: "Đang làm", color: "processing" },
  { value: "done", label: "Hoàn thành", color: "success" },
];

export const Tasks = () => {
  const [data, setData] = useState(initialTasksData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const staffMap = useMemo(
    () => Object.fromEntries(initialStaffData.map((s) => [s._id, `${s.code} - ${s.name}`])),
    []
  );
  const barnMap = useMemo(
    () => Object.fromEntries(initialBarnsData.map((b) => [b._id, `${b.code} - ${b.name}`])),
    []
  );
  const livestockMap = useMemo(
    () => Object.fromEntries(initialLivestockData.map((l) => [l._id, l.tagCode])),
    []
  );

  // Filter data
  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    item.code.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns - matching pattern
  const columns = [
    {
      title: "Mã công việc",
      dataIndex: "code",
      key: "code",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a.code.localeCompare(b.code),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      key: "title",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => a.title.localeCompare(b.title),
    },
    {
      title: "Loại",
      dataIndex: "category",
      key: "category",
      width: 120,
      filters: categoryOptions.map(opt => ({ text: opt.label, value: opt.value })),
      onFilter: (value, record) => record.category === value,
      render: (value) => categoryOptions.find((c) => c.value === value)?.label || value,
    },
    {
      title: "Người thực hiện",
      dataIndex: "assigneeId",
      key: "assigneeId",
      width: 150,
      render: (value) => <Tag>{staffMap[value] || "-"}</Tag>,
    },
    {
      title: "Chuồng",
      dataIndex: "barnId",
      key: "barnId",
      width: 120,
      render: (value) => barnMap[value] || "-",
    },
    {
      title: "Vật nuôi",
      dataIndex: "livestockId",
      key: "livestockId",
      width: 120,
      render: (value) => (value ? <Tag>{livestockMap[value] || value}</Tag> : "-"),
    },
    {
      title: "Ưu tiên",
      dataIndex: "priority",
      key: "priority",
      width: 100,
      render: (value) => {
        const opt = priorityOptions.find(p => p.value === value);
        return <Tag color={opt?.color}>{opt?.label || value}</Tag>;
      },
      filters: priorityOptions.map(opt => ({ text: opt.label, value: opt.value })),
      onFilter: (value, record) => record.priority === value,
    },
    {
      title: "Hạn chót",
      dataIndex: "dueDate",
      key: "dueDate",
      width: 120,
      sorter: (a, b) => new Date(a.dueDate) - new Date(b.dueDate),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (value) => {
        const opt = statusOptions.find((s) => s.value === value);
        return <Tag color={opt?.color || "default"}>{opt?.label || value}</Tag>;
      },
      filters: statusOptions.map((s) => ({ text: s.label, value: s.value })),
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chỉnh sửa">
            <Button type="text" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          </Tooltip>
          <Tooltip title="Xóa">
            <Button type="text" icon={<DeleteOutlined />} onClick={() => handleDelete(record)} danger />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Handle actions - matching pattern
// Removed unused navigate

  const handleEdit = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({  
      ...record,  
      dueDate: dayjs(record.dueDate)
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Xóa công việc "${record.title}"?`,
      okText: "Xóa",
      okType: "danger",
      onOk() {
        setData(data.filter(item => item._id !== record._id));
        message.success("Xóa công việc thành công!");
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
      const formattedValues = {
        ...values,
        dueDate: values.dueDate
        ? values.dueDate.format("YYYY-MM-DD")
        : null
      };
      if (selectedRecord) {
        // Update
        setData(data.map(item => 
          item._id === selectedRecord._id 
            ? { 
                ...item, 
                ...formattedValues,
                updatedAt: new Date().toISOString(),
              } 
            : item
        ));
        message.success("Cập nhật công việc thành công!");
      } else {
        // Add new
        const newItem = {
          _id: `task-${Date.now()}`,
          code: `TK${String(data.length + 1).padStart(3, "0")}`,
          ...values,
          status: "pending",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        setData([...data, newItem]);
        message.success("Thêm công việc mới thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
    }).catch(info => console.log('Validate failed:', info));
  };

  return (
    <div className="tasks">
      <PageHeader
        title="Công việc hàng ngày"
        subtitle="Quản lý nhiệm vụ và tiến độ công việc trong trang trại"
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm công việc
          </Button>
        }
      />

      <div className="tasks__content">
        {/* Stats Grid - matching pattern */}
        <Row gutter={[20, 20]} className="tasks-stats">
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
                  <span>{stat.trend} so với ngày trước</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        {/* Table Section */}
        <Card className="table-card">
          <div className="table-card__header">
            <h3>Danh sách công việc</h3>
            <Input
              placeholder="Tìm kiếm công việc..."
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
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} công việc`,
            }}
            scroll={{ x: 1600 }}
            className="tasks-table"
            rowKey="_id"
          />
        </Card>
      </div>

      {/* Add/Edit Modal - Antd Form pattern */}
      <Modal
        title={selectedRecord ? "Chỉnh sửa công việc" : "Thêm công việc mới"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText={selectedRecord ? "Lưu" : "Thêm mới"}
        cancelText="Hủy"
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          className="tasks-form"
        >
          <Form.Item name="title" label="Tiêu đề công việc" rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}>
            <Input placeholder="Nhập tiêu đề công việc" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="category" label="Loại công việc" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại">
                  {categoryOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="priority" label="Ưu tiên" rules={[{ required: true }]}>
                <Select placeholder="Chọn ưu tiên">
                  {priorityOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="code" label="Mã công việc" initialValue={selectedRecord?.code} rules={[{ required: true }]}>
                <Input disabled={!!selectedRecord} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="assigneeId" label="Người thực hiện">
                <Select placeholder="Chọn nhân viên (Staff)">
                  {initialStaffData.map((s) => (
                    <Option key={s._id} value={s._id}>{`${s.code} - ${s.name}`}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="barnId" label="Chuồng">
                <Select placeholder="Chọn chuồng (Barn)">
                  {initialBarnsData.map((b) => (
                    <Option key={b._id} value={b._id}>{`${b.code} - ${b.name}`}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="dueDate" label="Hạn chót" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái" initialValue="pending" rules={[{ required: true }]}>
                <Select>
                  {statusOptions.map((s) => (
                    <Option key={s.value} value={s.value}>{s.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Chi tiết công việc..." />
          </Form.Item>

          <Form.Item name="livestockId" label="Vật nuôi (tuỳ chọn)">
            <Select allowClear placeholder="Chọn vật nuôi (Livestock)">
              {initialLivestockData.map((l) => (
                <Option key={l._id} value={l._id}>{`${l.tagCode} - ${l.name}`}</Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
