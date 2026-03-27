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
  CheckCircleOutlined,
  CloseCircleOutlined,
  RiseOutlined,
  FallOutlined,
  AppleOutlined,
} from "@ant-design/icons";
import { initialFeedData } from "../../data/mockData";
const { Option } = Select;
const { RangePicker } = DatePicker;



// Stats data matching exact pattern
const statsData = [
  {
    title: "Tổng loại thức ăn",
    value: 6,
    unit: "loại",
    icon: <AppleOutlined />,
    type: "total",
    trend: "+1",
    trendUp: true
  },
  {
    title: "Tồn kho trung bình",
    value: 64,
    unit: "%",
    icon: <AppleOutlined />,
    type: "avg-stock",
    trend: "+5%",
    trendUp: true
  },
  {
    title: "Sắp hết hạn",
    value: 2,
    unit: "mặt hàng",
    icon: <CloseCircleOutlined />,
    type: "expiring",
    trend: "0",
    trendUp: false
  },
  {
    title: "Nhập tuần này",
    value: 3,
    unit: "lô mới",
    icon: <CheckCircleOutlined />,
    type: "new",
    trend: "+2",
    trendUp: true
  }
];

// Type options matching pattern
const typeOptions = [
  { value: "grass", label: "Cỏ" },
  { value: "mixed", label: "Thức ăn hỗn hợp công nghiệp" },
  { value: "fermented", label: "Thức ăn lên men" },
  { value: "byproduct", label: "Phụ phẩm nông nghiệp" },
  { value: "concentrate", label: "Thức ăn cô đặc" }
];

// Status options matching health/cleanliness pattern
const statusOptions = [
  { value: "good", label: "Tốt", color: "success" },
  { value: "warning", label: "Cảnh báo", color: "warning" },
  { value: "critical", label: "Hết hạn", color: "error" }
];

// Shelf options
const roomOptions = [
  { value: "P1", label: "Phòng 1 " },
  { value: "P2", label: "Phòng 2 " },
  { value: "P3", label: "Phòng 3 " },
  { value: "P4", label: "Phòng 4 " }
];

export const FeedStorage = () => {
  const [data, setData] = useState(initialFeedData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  // Filter data matching exact pattern (removed supplier)
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.id.toLowerCase().includes(searchText.toLowerCase()) ||
    item.typeName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns matching exact pattern from Tasks/Barns/Livestock
  const columns = [
    {
      title: "Mã TA",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Tên thức ăn",
      dataIndex: "name",
      key: "name",
      width: 220,
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Loại",
      dataIndex: "typeName",
      key: "type",
      width: 120,
      filters: typeOptions.map(opt => ({ text: opt.label, value: opt.label })),
      onFilter: (value, record) => record.typeName === value,
    },
    {
      title: "Số lượng",
      key: "quantity",
      width: 140,
      render: (_, record) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.quantity.toLocaleString()}</div>
          <Tag>{record.unit}</Tag>
        </div>
      ),
      sorter: (a, b) => a.quantity - b.quantity,
    },
    {
      title: "HSD",
      dataIndex: "expiryDate",
      key: "expiryDate",
      width: 120,
      sorter: (a, b) => new Date(a.expiryDate) - new Date(b.expiryDate),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status) => {
        const opt = statusOptions.find(s => s.value === status);
        return <Tag color={opt?.color || "default"}>{opt?.label || status}</Tag>;
      },
      filters: statusOptions.map(opt => ({ text: opt.label, value: opt.value })),
      onFilter: (value, record) => record.status === value,
    },

    {
      title: "Phòng",
      dataIndex: "roomName",
      key: "room",
      width: 100,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Chi tiết">
            <Button type="text" icon={<EyeOutlined />} onClick={() => window.location.href = `/feed/${record.id}`} />
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

  const handleEdit = (record) => {
    setSelectedRecord(record);
      form.setFieldsValue({  
        ...record,  
        room: record.room,
        expiryDate: dayjs(record.expiryDate)
      });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Xóa "${record.name}"?`,
      okText: "Xóa",
      okType: "danger",
      onOk() {
        setData(data.filter(item => item.key !== record.key));
        message.success("Xóa thành công!");
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
        expiryDate: values.expiryDate ? values.expiryDate.format("YYYY-MM-DD") : null
      };
      if (selectedRecord) {
        setData(data.map(item => 
          item.key === selectedRecord.key 
            ? { 
                ...item, 
                ...formattedValues,
                typeName: typeOptions.find(c => c.value === values.type)?.label || values.typeName,
                roomName: roomOptions.find(b => b.value === values.room)?.label || values.roomName,
              } 
            : item
        ));
        message.success("Cập nhật thành công!");
      } else {
        const newKey = (parseInt(data[data.length - 1]?.key || "0") + 1).toString();
        const newItem = {
          key: newKey,
          id: `TA${String(data.length + 1).padStart(3, "0")}`,
          ...formattedValues,
          typeName: typeOptions.find(c => c.value === values.type)?.label || values.type,
          roomName: roomOptions.find(b => b.value === values.room)?.label || values.room,
          status: "good",
          progress: 0
        };
        setData([...data, newItem]);
        message.success("Thêm mới thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
    }).catch(info => console.log('Validate failed:', info));
  };

  return (
    <div className="feed-storage">
      <PageHeader
        title="Kho thức ăn"
        subtitle="Quản lý tồn kho và hạn sử dụng thức ăn chăn nuôi"
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm loại thức ăn mới
          </Button>
        }
      />

      <div className="feed-storage__content">
        <Row gutter={[20, 20]} className="feed-storage-stats">
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
                  <span>{stat.trend} so với tuần trước</span>
                </div>
              </Card>
            </Col>
          ))}
        </Row>

        <Card className="table-card">
          <div className="table-card__header">
            <h3>Danh sách thức ăn</h3>
            <Input
              placeholder="Tìm kiếm thức ăn..."
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
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} mặt hàng`,
            }}
            scroll={{ x: 1600 }}
            className="feed-storage-table"
          />
        </Card>
      </div>

      <Modal
        title={selectedRecord ? "Chỉnh sửa mặt hàng" : "Thêm mặt hàng mới"}
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
          className="feed-storage-form"
        >
          <Form.Item name="name" label="Tên thức ăn" rules={[{ required: true, message: "Vui lòng nhập tên!" }]}>
            <Input placeholder="Nhập tên thức ăn" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="type" label="Loại" rules={[{ required: true }]}>
                <Select placeholder="Chọn loại">
                  {typeOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
                <InputNumber min={0} placeholder="0" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="unit" label="ĐVT" initialValue="kg">
                <Select>
                  <Option value="kg">kg</Option>
                  <Option value="túi">túi</Option>
                  <Option value="thùng">thùng</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>

            <Col span={12}>
              <Form.Item name="room" label="Phòng">
                <Select placeholder="Chọn phòng">
                  <Option value="">Chưa phân phòng</Option>
                  {roomOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="expiryDate" label="Hạn sử dụng" rules={[{ required: true }]}>
                <DatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="status" label="Trạng thái" initialValue="good">
                <Select>
                  {statusOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="description" label="Ghi chú">
            <Input.TextArea rows={3} placeholder="Thông tin bổ sung..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};
