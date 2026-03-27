import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";
import { Card, Row, Col, Table, Button, Tag, Space, Tooltip, Modal, Form, Input, Select, InputNumber, message } from "antd";
import { initialLivestockData } from "../../data/mockData";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  SearchOutlined,
  AppleOutlined,
  RiseOutlined,
  FallOutlined
} from "@ant-design/icons";


const { Option } = Select;

// Statistics data
const statsData = [
  {
    title: "Tổng vật nuôi",
    value: 10,
    unit: "con",
    icon: <AppleOutlined />,
    type: "livestock",
    trend: "2",
    trendUp: true
  },
  {
    title: "Bò",
    value: 3,
    unit: "con",
    icon: "🐮",
    type: "cattle",
    trend: "1",
    trendUp: true
  },
  {
    title: "Lợn",
    value: 3,
    unit: "con",
    icon: "🐷",
    type: "pig",
    trend: "1",
    trendUp: true
  },

  {
    title: "Gia cầm",
    value: 4,
    unit: "con",
    icon: "🐔",
    type: "poultry",
    trend: "2",
    trendUp: true
  }
];
const barnOptions = [
  { value: "A1", label: "Chuồng A1" },
  { value: "A2", label: "Chuồng A2" },
  { value: "B1", label: "Chuồng B1" },
  { value: "B2", label: "Chuồng B2" },
  { value: "B3", label: "Chuồng B3" },
  { value: "C1", label: "Chuồng C1" },
  { value: "C2", label: "Chuồng C2" },
  { value: "C3", label: "Chuồng C3" },
  { value: "D1", label: "Chuồng D1" },
];

// Livestock type options
const typeOptions = [
  { value: "poultry", label: "Gia cầm" },
  { value: "cattle", label: "Gia súc" },
];


const healthOptions = [
  { value: "good", label: "Khỏe mạnh", color: "success" },
  { value: "warning", label: "Theo dõi", color: "warning" },
  { value: "critical", label: "Nghi ngờ", color: "error" },
];


export const Livestock = () => {
  const [data, setData] = useState(initialLivestockData);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);

  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  // Filter data based on search
  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchText.toLowerCase()) ||
    item.id.toLowerCase().includes(searchText.toLowerCase()) ||
    item.typeName.toLowerCase().includes(searchText.toLowerCase()) ||
    item.barnName.toLowerCase().includes(searchText.toLowerCase())
  );

  // Table columns
  const columns = [
    {
      title: "Mã vật nuôi",
      dataIndex: "id",
      key: "id",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: "Tên vật nuôi",
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
      filters: [
        { text: "Bò", value: "Bò" },
        { text: "Lợn", value: "Lợn" },
        { text: "Gà", value: "Gà" },
        { text: "Vịt", value: "Vịt" },
      ],
      onFilter: (value, record) => record.typeName === value,
    },
    {
      title: "Chuồng",
      dataIndex: "barnName",
      key: "barn",
      width: 120,
      filters: barnOptions,
      onFilter: (value, record) => record.barn === value,
    },
    {
      title: "Cân nặng",
      dataIndex: "weight",
      key: "weight",
      width: 110,
      sorter: (a, b) => a.weight - b.weight,
      render: (weight, record) => {
        const unit = ["chicken", "duck"].includes(record.type) ? "kg" : "kg";
        return weight ? `${weight} ${unit}` : "-";
      },
    },
    {
      title: "Sản lượng",
      dataIndex: "production",
      key: "production",
      width: 110,
      render: (production, record) => {
        if (["chicken", "duck"].includes(record.type)) {
          return production ? `${production} trứng/tuần` : "-";
        }
        if (record.type === "cattle") {
          return production ? `${production} lít/ngày` : "-";
        }
        return "-";
      },
    },
    {
      title: "Sức khỏe",
      dataIndex: "healthName",
      key: "health",
      width: 120,
      render: (healthName, record) => {
        const color = record.health === "good" ? "success" : record.health === "warning" ? "warning" : "error";
        return <Tag color={color}>{healthName}</Tag>;
      },
      filters: healthOptions,
      onFilter: (value, record) => record.health === value,
    },
    {
      title: "Ngày nhập",
      dataIndex: "entryDate",
      key: "entryDate",
      width: 120,
      sorter: (a, b) => new Date(a.entryDate) - new Date(b.entryDate),
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
              onClick={() => handleView(record)}
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

  // Handle actions
  const navigate = useNavigate();
  const handleView = (record) => {
    navigate(`/livestock/${record.id}`);
  };



  const handleEdit = (record) => {
    setSelectedRecord(record);
    form.setFieldsValue({
      ...record,
      barn: record.barn
    });
    setIsModalOpen(true);
  };

  const handleDelete = (record) => {
    Modal.confirm({
      title: "Xác nhận xóa",
      content: `Bạn có chắc chắn muốn xóa vật nuôi "${record.name}" không?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk() {
        setData(data.filter(item => item.key !== record.key));
        message.success("Xóa vật nuôi thành công!");
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
        // Update existing
        setData(data.map(item => 
          item.key === selectedRecord.key 
            ? { 
                ...item, 
                ...values, 
                typeName: typeOptions.find(t => t.value === values.type)?.label || values.typeName,
                barnName: barnOptions.find(b => b.value === values.barn)?.label || values.barnName,
                healthName: healthOptions.find(h => h.value === values.health)?.label || values.healthName
              } 
            : item
        ));
        message.success("Cập nhật vật nuôi thành công!");
      } else {
        // Add new
        const newKey = (parseInt(data[data.length - 1]?.key || "0") + 1).toString();
        const newItem = {
          key: newKey,
          id: `VN${String(data.length + 1).padStart(3, "0")}`,
          ...values,
          typeName: typeOptions.find(t => t.value === values.type)?.label || values.type,
          barnName: barnOptions.find(b => b.value === values.barn)?.label || values.barn,
          healthName: healthOptions.find(h => h.value === values.health)?.label || values.health,
          status: "active"
        };
        setData([...data, newItem]);
        message.success("Thêm vật nuôi mới thành công!");
      }
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  return (
    <div className="livestock">
      <PageHeader
        title="Quản lý vật nuôi"
        subtitle="Theo dõi và quản lý toàn bộ vật nuôi trong trang trại"
        actions={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
            Thêm vật nuôi
          </Button>
        }
      />

      <div className="livestock__maincontent">
        {/* Stats Grid */}
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

        {/* Table Section */}
        <Card className="table-card">
          <div className="table-card__header">
            <h3>Danh sách vật nuôi</h3>
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
              showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} vật nuôi`,
            }}
            scroll={{ x: 1200 }}
            className="livestock-table"
          />
        </Card>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        title={selectedRecord ? "Chỉnh sửa vật nuôi" : "Thêm vật nuôi mới"}
        open={isModalOpen}
        onOk={handleModalOk}
        onCancel={() => setIsModalOpen(false)}
        okText={selectedRecord ? "Lưu" : "Thêm mới"}
        cancelText="Hủy"
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          className="livestock-form"
        >
          <Form.Item
            name="name"
            label="Tên vật nuôi"
            rules={[{ required: true, message: "Vui lòng nhập tên vật nuôi!" }]}
          >
            <Input placeholder="Nhập tên vật nuôi" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="type"
                label="Loại vật nuôi"
                rules={[{ required: true, message: "Vui lòng chọn loại!" }]}
              >
                <Select placeholder="Chọn loại vật nuôi">
                  {typeOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="barn"
                label="Chuồng"
                rules={[{ required: true, message: "Vui lòng chọn chuồng!" }]}
              >
                <Select placeholder="Chọn chuồng">
                  {barnOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="weight"
                label="Cân nặng (kg)"
              >
                <InputNumber 
                  placeholder="Nhập cân nặng" 
                  style={{ width: "100%" }}
                  min={0}
                  step={0.1}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="production"
                label="Sản lượng"
              >
                <InputNumber 
                  placeholder="Nhập sản lượng" 
                  style={{ width: "100%" }}
                  min={0}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="health"
                label="Sức khỏe"
              >
                <Select placeholder="Chọn tình trạng sức khỏe">
                  {healthOptions.map(option => (
                    <Option key={option.value} value={option.value}>{option.label}</Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="entryDate"
                label="Ngày nhập"
                rules={[{ required: true, message: "Vui lòng chọn ngày!" }]}
              >
                <Input type="date" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

    </div>
  );
};


