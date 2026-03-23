import { useState } from "react";
import dayjs from "dayjs";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card, Row, Col, Table, Button, Tag, Space, Tooltip, Modal, Form, Input, Select, InputNumber, DatePicker, Progress, message } from "antd";

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
const { RangePicker } = DatePicker;

// Mock data for daily tasks - consistent với Livestock/Barns/Staff pattern
const initialTasksData = [
  {
    key: "1",
    id: "TK001",
    title: "Kiểm tra sức khỏe đàn bò sữa",
    category: "health",
    categoryName: "Sức khỏe",
    assignee: "NV001",
    assigneeName: "Nguyễn Văn A",
    barn: "A1",
    barnName: "Chuồng A1",
    priority: "high",
    priorityName: "Cao",
    dueDate: "2024-10-20",
    status: "pending",
    progress: 30
  },
  {
    key: "2",
    id: "TK002",
    title: "Vệ sinh chuồng lợn B2",
    category: "maintenance",
    categoryName: "Bảo trì",
    assignee: "NV003",
    assigneeName: "Lê Văn C",
    barn: "B2",
    barnName: "Chuồng B2",
    priority: "medium",
    priorityName: "Trung bình",
    dueDate: "2024-10-19",
    status: "in-progress",
    progress: 70
  },
  {
    key: "3",
    id: "TK003",
    title: "Cho ăn đàn gà C1",
    category: "feeding",
    categoryName: "Cho ăn",
    assignee: "NV007",
    assigneeName: "Đặng Văn G",
    barn: "C1",
    barnName: "Chuồng C1",
    priority: "low",
    priorityName: "Thấp",
    dueDate: "2024-10-21",
    status: "completed",
    progress: 100
  },
  {
    key: "4",
    id: "TK004",
    title: "Tiêm vaccine lợn B3 (OVERDUE)",
    category: "vaccine",
    categoryName: "Tiêm chủng",
    assignee: "NV002",
    assigneeName: "Trần Thị B",
    barn: "B3",
    barnName: "Chuồng B3",
    priority: "high",
    priorityName: "Cao",
    dueDate: "2024-10-18",
    status: "overdue",
    progress: 20
  },
  {
    key: "5",
    id: "TK005",
    title: "Kiểm tra nhiệt độ tất cả chuồng",
    category: "monitoring",
    categoryName: "Giám sát",
    assignee: "NV009",
    assigneeName: "Ngô Văn I",
    barn: "all",
    barnName: "Tất cả",
    priority: "medium",
    priorityName: "Trung bình",
    dueDate: "2024-10-20",
    status: "pending",
    progress: 0
  },
  {
    key: "6",
    id: "TK006",
    title: "Báo cáo sản lượng ngày",
    category: "report",
    categoryName: "Báo cáo",
    assignee: "NV001",
    assigneeName: "Nguyễn Văn A",
    barn: "",
    barnName: "",
    priority: "high",
    priorityName: "Cao",
    dueDate: "2024-10-20",
    status: "in-progress",
    progress: 50
  }
];

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

// Category options - matching typeOptions pattern
const categoryOptions = [
  { value: "health", label: "Sức khỏe" },
  { value: "feeding", label: "Cho ăn" },
  { value: "maintenance", label: "Bảo trì" },
  { value: "vaccine", label: "Tiêm chủng" },
  { value: "monitoring", label: "Giám sát" },
  { value: "report", label: "Báo cáo" }
];

// Priority options - matching healthOptions pattern
const priorityOptions = [
  { value: "low", label: "Thấp", color: "default" },
  { value: "medium", label: "Trung bình", color: "warning" },
  { value: "high", label: "Cao", color: "error" }
];

// Staff options (refs from Staff data)
// Staff options - mock from pattern
const staffOptions = [
  { value: "NV001", label: "Nguyễn Văn A (Quản lý)" },
  { value: "NV002", label: "Trần Thị B (Thú y)" },
  { value: "NV003", label: "Lê Văn C (Công nhân)" },
  { value: "NV007", label: "Đặng Văn G (Công nhân)" },
  { value: "NV009", label: "Ngô Văn I (Quản lý)" }
];

// Barn options - mock from pattern
const barnOptions = [
  { value: "A1", label: "Chuồng A1" },
  { value: "B2", label: "Chuồng B2" },
  { value: "B3", label: "Chuồng B3" },
  { value: "C1", label: "Chuồng C1" },
  { value: "all", label: "Tất cả" }
];

export const Tasks = () => {
  const [data, setData] = useState(initialTasksData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  // Filter data
  const filteredData = data.filter(item => 
    item.title.toLowerCase().includes(searchText.toLowerCase()) ||
    item.id.toLowerCase().includes(searchText.toLowerCase()) ||
    item.categoryName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.assigneeName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns - matching pattern
  const columns = [
    {
      title: "Mã công việc",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a.id.localeCompare(b.id),
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
      dataIndex: "categoryName",
      key: "category",
      width: 120,
      filters: categoryOptions.map(opt => ({ text: opt.label, value: opt.label })),
      onFilter: (value, record) => record.categoryName === value,
    },
    {
      title: "Người thực hiện",
      dataIndex: "assigneeName",
      key: "assignee",
      width: 150,
      render: (name, record) => (
        <Tag>{record.assignee} - {name}</Tag>
      )
    },
    {
      title: "Chuồng",
      dataIndex: "barnName",
      key: "barn",
      width: 120,
    },
    {
      title: "Ưu tiên",
      dataIndex: "priorityName",
      key: "priority",
      width: 100,
      render: (priorityName, record) => {
        const color = priorityOptions.find(p => p.value === record.priority)?.color;
        return <Tag color={color}>{priorityName}</Tag>;
      },
      filters: priorityOptions.map(opt => ({ text: opt.label, value: opt.value })),
      onFilter: (value, record) => record.priority === value,
    },
    {
      title: "Tiến độ",
      key: "progress",
      width: 120,
      render: (_, record) => (
        <div>
          <div style={{ marginBottom: 4, fontSize: '12px' }}>{record.progress}%</div>
          <div style={{ width: 80 }}>
            <Progress percent={record.progress} size="small" />
          </div>
        </div>
      ),
      sorter: (a, b) => a.progress - b.progress,
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
      render: (status) => {
        let color = "default";
        let label = "";
        if (status === "completed") { color = "success"; label = "Hoàn thành"; }
        else if (status === "in-progress") { color = "processing"; label = "Đang làm"; }
        else if (status === "overdue") { color = "error"; label = "Quá hạn"; }
        else { color = "default"; label = "Chờ"; }
        return <Tag color={color}>{label}</Tag>;
      },
      filters: [
        { text: "Chờ", value: "pending" },
        { text: "Đang làm", value: "in-progress" },
        { text: "Hoàn thành", value: "completed" },
        { text: "Quá hạn", value: "overdue" }
      ],
      onFilter: (value, record) => record.status === value,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chi tiết">
            <Button type="text" icon={<EyeOutlined />} />
          </Tooltip>
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
    console.log('Edit clicked:', record);
    setSelectedRecord(record);
    form.setFieldsValue({  
      ...record,  
      barn: record.barn,  
      assignee: record.assignee,
      dueDate: dayjs(record.dueDate)
    });
    setIsModalOpen(true);};

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Xóa công việc "${record.title}"?`,
      okText: "Xóa",
      okType: "danger",
      onOk() {
        setData(data.filter(item => item.key !== record.key));
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
          item.key === selectedRecord.key 
            ? { 
                ...item, 
                ...formattedValues, 
                categoryName: categoryOptions.find(c => c.value === values.category)?.label || values.categoryName,
                assigneeName: staffOptions.find(s => s.value === values.assignee)?.label || values.assigneeName,
                barnName: barnOptions.find(b => b.value === values.barn)?.label || values.barnName,
                priorityName: priorityOptions.find(p => p.value === values.priority)?.label || values.priorityName,
              } 
            : item
        ));
        message.success("Cập nhật công việc thành công!");
      } else {
        // Add new
        const newKey = (parseInt(data[data.length - 1]?.key || "0") + 1).toString();
        const newItem = {
          key: newKey,
          id: `TK${String(data.length + 1).padStart(3, "0")}`,
          ...values,
          categoryName: categoryOptions.find(c => c.value === values.category)?.label || values.category,
          assigneeName: staffOptions.find(s => s.value === values.assignee)?.label || values.assigneeName,
          barnName: barnOptions.find(b => b.value === values.barn)?.label || values.barnName,
          priorityName: priorityOptions.find(p => p.value === values.priority)?.label || values.priorityName,
          status: "pending",
          progress: 0
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
              <Form.Item name="progress" label="Tiến độ">
                <InputNumber min={0} max={100} style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="assignee" label="Người thực hiện" rules={[{ required: true }]}>
                <Select placeholder="Chọn nhân viên">
                  {staffOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="barn" label="Chuồng">
                <Select placeholder="Chọn chuồng">
                  <Option value="">Tất cả</Option>
                  {barnOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
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
              <Form.Item name="status" label="Trạng thái" initialValue="pending">
                <Select>
                  <Option value="pending">Chờ</Option>
                  <Option value="in-progress">Đang làm</Option>
                  <Option value="completed">Hoàn thành</Option>
                  <Option value="overdue">Quá hạn</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={3} placeholder="Chi tiết công việc..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
