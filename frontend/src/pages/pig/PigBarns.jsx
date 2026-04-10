import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Space,
  Tag,
} from "antd";
import { PageHeader } from "../../components/layout/PageHeader";
import { usePigFarmStore } from "../../store/pigFarmStore";

const { Option } = Select;

const purposeLabels = {
  sow: "Nái",
  fattening: "Thịt",
  mixed: "Hỗn hợp",
};

export default function PigBarns() {
  const barns = usePigFarmStore((s) => s.barns);
  const addBarn = usePigFarmStore((s) => s.addBarn);

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const columns = [
    { title: "Mã", dataIndex: "code", width: 90 },
    { title: "Tên chuồng", dataIndex: "name" },
    {
      title: "Loại",
      dataIndex: "purpose",
      render: (p) => <Tag>{purposeLabels[p] || p}</Tag>,
    },
    { title: "Sức chứa", dataIndex: "capacity" },
    { title: "Ngày tạo", dataIndex: "createdAt", width: 120 },
  ];

  const handleOk = () => {
    form.validateFields().then((v) => {
      addBarn(v);
      setOpen(false);
      form.resetFields();
    });
  };

  return (
    <div className="dashboard">
      <PageHeader
        title="Chuồng trại"
        subtitle="Quản lý và cấu hình chuồng nuôi"
      />

      <div className="dashboard__maincontent">

        {/* ===== STATS ===== */}
        <div className="stats-grid">
          <Card className="stat-card stat-card--barn">
            <div className="stat-card__header">
              <span className="stat-card__title">Tổng chuồng</span>
              <div className="stat-card__icon">🏠</div>
            </div>
            <div className="stat-card__value">
              {barns.length}
            </div>
          </Card>

          <Card className="stat-card stat-card--pigs">
            <div className="stat-card__header">
              <span className="stat-card__title">Chuồng nái</span>
              <div className="stat-card__icon">👑</div>
            </div>
            <div className="stat-card__value">
              {barns.filter((b) => b.purpose === "sow").length}
            </div>
          </Card>

          <Card className="stat-card stat-card--staff">
            <div className="stat-card__header">
              <span className="stat-card__title">Chuồng thịt</span>
              <div className="stat-card__icon">🥩</div>
            </div>
            <div className="stat-card__value">
              {barns.filter((b) => b.purpose === "fattening").length}
            </div>
          </Card>

          <Card className="stat-card stat-card--daily-tasks">
            <div className="stat-card__header">
              <span className="stat-card__title">Hỗn hợp</span>
              <div className="stat-card__icon">📦</div>
            </div>
            <div className="stat-card__value">
              {barns.filter((b) => b.purpose === "mixed").length}
            </div>
          </Card>
        </div>

        {/* ===== ACTION ===== */}
        <Card className="filter-card">
          <Space wrap>
            <Button type="primary" onClick={() => setOpen(true)}>
              Thêm chuồng
            </Button>
          </Space>
        </Card>

        {/* ===== TABLE ===== */}
        <Card className="table-card">
          <Table
            rowKey="id"
            columns={columns}
            dataSource={barns}
            pagination={false}
          />
        </Card>
      </div>

      {/* ===== MODAL ===== */}
      <Modal
        title="Thêm chuồng"
        open={open}
        onOk={handleOk}
        onCancel={() => {
          setOpen(false);
          form.resetFields();
        }}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="Mã chuồng"
            rules={[{ required: true }]}
          >
            <Input placeholder="VD: NA3" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="purpose"
            label="Mục đích"
            initialValue="fattening"
          >
            <Select>
              <Option value="sow">{purposeLabels.sow}</Option>
              <Option value="fattening">{purposeLabels.fattening}</Option>
              <Option value="mixed">{purposeLabels.mixed}</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="capacity"
            label="Sức chứa (đầu con)"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}