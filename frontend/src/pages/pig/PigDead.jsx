import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Input,
  Button,
  Space,
  Modal,
  Form,
  Select,
  DatePicker,
} from "antd";
import dayjs from "dayjs"; // ✅ thêm dòng này

const { Option } = Select;

// ===== DATA MẪU =====
const initialDeadData = [
  {
    key: 1,
    code: "DR-2601",
    status: "Sảy thai",
    date: "01/04/2026",
    reason: "Bệnh",
    person: "Nguyễn Văn A",
    note: "",
  },
  {
    key: 2,
    code: "DR-2602",
    status: "Cai sữa",
    date: "02/04/2026",
    reason: "Yếu",
    person: "Trần Văn B",
    note: "",
  },
];

const pigList = [
  { code: "DR-2601" },
  { code: "DR-2602" },
  { code: "DR-2603" },
];

const statusOptions = ["Sảy thai", "Cai sữa", "Khác"];
const reasons = ["Bệnh", "Yếu", "Tai nạn", "Khác"];
const staffs = ["Nguyễn Văn A", "Trần Văn B", "Lê Thị C"];

export default function PigDead() {
  const [dataSource, setDataSource] = useState(initialDeadData);
  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);

  const [form] = Form.useForm();

  const formatDate = (d) => (d ? d.format("DD/MM/YYYY") : "");

  const filteredData = dataSource.filter((item) =>
    item.code.toLowerCase().includes(keyword.toLowerCase())
  );

  const total = dataSource.length;
  const miscarriage = dataSource.filter((d) => d.status === "Sảy thai").length;
  const weaning = dataSource.filter((d) => d.status === "Cai sữa").length;

  const handleSave = () => {
    form.validateFields().then((values) => {
      const newData = {
        key: editing ? editing.key : Date.now(),
        ...values,
        date: formatDate(values.date), // vẫn giữ string
      };

      if (editing) {
        setDataSource(
          dataSource.map((d) => (d.key === editing.key ? newData : d))
        );
      } else {
        setDataSource([newData, ...dataSource]);
      }

      setIsModalOpen(false);
      setEditing(null);
      form.resetFields();
    });
  };

  // ✅ FIX Ở ĐÂY
  const handleEdit = (record) => {
    setEditing(record);

    form.setFieldsValue({
      ...record,
      date: record.date ? dayjs(record.date, "DD/MM/YYYY") : null,
    });

    setIsModalOpen(true);
  };

  const columns = [
    { title: "STT", render: (_, __, index) => index + 1 },
    { title: "Số tai", dataIndex: "code" },
    { title: "Trạng thái khi chết", dataIndex: "status" },
    { title: "Ngày chết", dataIndex: "date" },
    { title: "Nguyên nhân", dataIndex: "reason" },
    { title: "Người xử lý", dataIndex: "person" },
    { title: "Ghi chú", dataIndex: "note" },
    {
      title: "Hành động",
      render: (_, record) => (
        <Button type="link" onClick={() => handleEdit(record)}>
          Sửa
        </Button>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Row gutter={16}>
        <Col span={8}><Card><h3>Tổng lợn chết</h3><h1>{total}</h1></Card></Col>
        <Col span={8}><Card><h3>Sảy thai chết</h3><h1>{miscarriage}</h1></Card></Col>
        <Col span={8}><Card><h3>Cai sữa chết</h3><h1>{weaning}</h1></Card></Col>
      </Row>

      <Card style={{ marginTop: 20 }}>
        <Space>
          <Input
            placeholder="Tìm số tai"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Thêm lợn chết
          </Button>
        </Space>
      </Card>

      <Card style={{ marginTop: 20 }}>
        <Table columns={columns} dataSource={filteredData} />
      </Card>

      <Modal
        open={isModalOpen}
        title={editing ? "Sửa lợn chết" : "Thêm lợn chết"}
        onCancel={() => {
          setIsModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Số tai" rules={[{ required: true }]}>
            <Select placeholder="Chọn số tai">
                {pigList.map((p) => (
                <Option key={p.code} value={p.code}>
                    {p.code}
                </Option>
                ))}
            </Select>
            </Form.Item>

          <Form.Item name="status" label="Trạng thái khi chết" rules={[{ required: true }]}>
            <Select>
              {statusOptions.map((s) => (
                <Option key={s}>{s}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="date" label="Ngày chết" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="reason" label="Nguyên nhân" rules={[{ required: true }]}>
            <Select>
              {reasons.map((r) => (
                <Option key={r}>{r}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="person" label="Người xử lý" rules={[{ required: true }]}>
            <Select>
              {staffs.map((s) => (
                <Option key={s}>{s}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}