import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card, Row, Col, Table, Button, Tag, Space, Tooltip, Modal, Form, Input, Select, InputNumber, message } from "antd";
import { initialBarnsData, barnTypeOptions, cleanlinessOptions } from "../../data/mockData";
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

// Mock data cho chuồng trại


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


export const Barns = () => {
  const [data, setData] = useState(initialBarnsData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  // Filter data
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.id.toLowerCase().includes(searchText.toLowerCase()) ||
    item.typeName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: "Mã chuồng",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a.id.localeCompare(b.id),
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
      dataIndex: "typeName",
      key: "typeName",
      width: 120,
      filters: barnTypeOptions.map(opt => ({ text: opt.label, value: opt.label })),
      onFilter: (value, record) => record.typeName === value,
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
      dataIndex: "cleanlinessName",
      key: "cleanliness",
      width: 120,
      render: (cleanlinessName, record) => {
        const color = record.cleanliness === "good" ? "success" : 
                     record.cleanliness === "warning" ? "warning" : "error";
        return <Tag color={color}>{cleanlinessName}</Tag>;
      },
      filters: cleanlinessOptions,
      onFilter: (value, record) => record.cleanliness === value,
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
              onClick={() => navigate(`/barns/${record.id}`)}
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
        setData(data.filter(item => item.key !== record.key));
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
      const processedValues = {
        ...values,
        typeName: barnTypeOptions.find(t => t.value === values.type)?.label || values.typeName,
        cleanlinessName: cleanlinessOptions.find(h => h.value === values.cleanliness)?.label || values.cleanlinessName,
        occupancy: Math.round((values.currentCount / values.capacity) * 100),
        status: "active"
      };

      if (selectedRecord) {
        setData(data.map(item => 
          item.key === selectedRecord.key ? { ...item, ...processedValues } : item
        ));
        message.success("Cập nhật chuồng thành công!");
      } else {
        const newKey = (parseInt(data[data.length - 1]?.key || "0") + 1).toString();
        const newItem = { key: newKey, id: `BN${String(data.length + 1).padStart(2, "0")}`, ...processedValues };
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
              <Form.Item name="id" label="Mã chuồng" rules={[{ required: true }]}>
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
        </Form>
      </Modal>
    </div>
  );
};
