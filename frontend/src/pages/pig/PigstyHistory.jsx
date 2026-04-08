import React, { useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  Input,
  Space,
  Tag,
  message,
} from "antd";

const { Option } = Select;

// ===== DATA =====
const initialPigs = [
  { code: "DR-2601", status: "Hậu bị", pen: "Chuồng A" },
  { code: "DR-2602", status: "Đã phối", pen: "Chuồng B" },
  { code: "DR-2603", status: "Đẻ con", pen: "Chuồng C" },
  { code: "DR-2604", status: "Cai sữa", pen: "Chuồng A" },
];

const pens = ["Chuồng A", "Chuồng B", "Chuồng C"];
const staffs = ["Nguyễn Văn A", "Trần Văn B", "Lê Thị C"];

export default function TransferPage() {
  const [pigList, setPigList] = useState(initialPigs);
  const [data, setData] = useState([]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  // ===== FILTER =====
  const filteredPigs = pigList.filter((p) =>
    statusFilter === "all" ? true : p.status === statusFilter
  );

  // ===== TABLE MAIN =====
  const columns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Ngày chuyển",
      dataIndex: "date",
    },
    {
      title: "Số tai",
      dataIndex: "code",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => <Tag color="blue">{s}</Tag>,
    },
    {
      title: "Từ chuồng",
      dataIndex: "fromPen",
    },
    {
      title: "Sang chuồng",
      dataIndex: "toPen",
      render: (p) => <Tag color="green">{p}</Tag>,
    },
    {
      title: "Người thực hiện",
      dataIndex: "person",
    },
    {
      title: "Ghi chú",
      dataIndex: "note",
    },
  ];

  // ===== TABLE TRONG MODAL =====
  const pigColumns = [
    {
      title: "STT",
      render: (_, __, index) => index + 1,
    },
    {
      title: "Số tai",
      dataIndex: "code",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => <Tag color="blue">{s}</Tag>,
    },
    {
      title: "Chuồng hiện tại",
      dataIndex: "pen",
    },
  ];

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  // ===== HANDLE =====
  const handleAdd = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Chọn ít nhất 1 con lợn");
      return;
    }

    form.validateFields().then((values) => {
      const selectedPigs = pigList.filter((p) =>
        selectedRowKeys.includes(p.code)
      );

      // ❌ không cho chuyển cùng chuồng
      const invalid = selectedPigs.some((p) => p.pen === values.toPen);
      if (invalid) {
        message.error("Có lợn đã ở chuồng này!");
        return;
      }

      const newRecords = selectedPigs.map((pig) => ({
        key: Date.now() + pig.code,
        date: values.date.format("DD/MM/YYYY"),
        code: pig.code,
        status: pig.status,
        fromPen: pig.pen,
        toPen: values.toPen,
        person: values.person,
        note: values.note,
      }));

      // cập nhật chuồng
      const updatedPigList = pigList.map((p) =>
        selectedRowKeys.includes(p.code)
          ? { ...p, pen: values.toPen }
          : p
      );

      setPigList(updatedPigList);
      setData([...newRecords, ...data]);

      message.success("Chuyển chuồng thành công");

      setSelectedRowKeys([]);
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  return (
    <div style={{ padding: 20 }}>
      {/* HEADER */}
      <Card>
        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Thêm chuyển chuồng
        </Button>
      </Card>

      {/* TABLE */}
      <Card style={{ marginTop: 20 }}>
        <Table columns={columns} dataSource={data} />
      </Card>

      {/* MODAL */}
      <Modal
        title="Chuyển chuồng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={[
          <Button onClick={() => setIsModalOpen(false)}>Hủy bỏ</Button>,
          <Button type="primary" onClick={handleAdd}>
            Lưu
          </Button>,
        ]}
        width={800}
      >
        {/* FILTER */}
        <Select
          style={{ width: 220, marginBottom: 10 }}
          value={statusFilter}
          onChange={setStatusFilter}
        >
          <Option value="all">Tất cả trạng thái</Option>
          <Option value="Hậu bị">Hậu bị</Option>
          <Option value="Đã phối">Đã phối</Option>
          <Option value="Đẻ con">Đẻ con</Option>
          <Option value="Cai sữa">Cai sữa</Option>
        </Select>

        {/* TABLE CHỌN */}
        <Table
          rowKey="code"
          rowSelection={rowSelection}
          columns={pigColumns}
          dataSource={filteredPigs}
          pagination={{ pageSize: 5 }}
          size="small"
        />

        {/* FORM */}
        <Form form={form} layout="vertical" style={{ marginTop: 20 }}>
          <Form.Item
            name="date"
            label="Ngày chuyển"
            rules={[{ required: true, message: "Chọn ngày" }]}
          >
            <DatePicker style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item
            name="toPen"
            label="Chuyển sang chuồng"
            rules={[{ required: true, message: "Chọn chuồng" }]}
          >
            <Select>
              {pens.map((p) => (
                <Option key={p}>{p}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="person"
            label="Người thực hiện"
            rules={[{ required: true, message: "Chọn người" }]}
          >
            <Select placeholder="Chọn người">
              {staffs.map((s) => (
                <Option key={s}>{s}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={3} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}