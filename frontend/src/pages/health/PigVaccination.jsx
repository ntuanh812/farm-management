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
  Popconfirm,
  message,
} from "antd";
import { PlusOutlined, DeleteOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { PageHeader } from "../../components/layout/PageHeader";
import { usePigFarmStore } from "../../store/pigFarmStore";
import { LifecycleStatus } from "../../domain/pigFarm";

const { Option } = Select;

export default function PigVaccination() {
  const pigs = usePigFarmStore((s) => s.pigs);
  const staff = usePigFarmStore((s) => s.staff);
  const vaccinations = usePigFarmStore((s) => s.vaccinations);
  const addVaccination = usePigFarmStore((s) => s.addVaccination);
  const deleteVaccination = usePigFarmStore((s) => s.deleteVaccination);

  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();

  const activePigs = pigs.filter(
    (p) => p.lifecycleStatus === LifecycleStatus.ACTIVE
  );

  const columns = [
    {
      title: "Ngày",
      dataIndex: "vaccinatedAt",
      render: (iso) => (iso ? dayjs(iso).format("DD/MM/YYYY") : ""),
    },
    {
      title: "Số tai",
      render: (_, r) =>
        pigs.find((p) => p.id === r.pigId)?.earTag || r.pigId,
    },
    { title: "Vaccine", dataIndex: "vaccineName" },
    { title: "Người thực hiện", dataIndex: "performedBy" },
    { title: "Ghi chú", dataIndex: "note" },
    {
      title: "",
      render: (_, r) => (
        <Popconfirm
          title="Xóa?"
          onConfirm={() => {
            deleteVaccination(r.id);
            message.success("Đã xóa");
          }}
        >
          <Button danger icon={<DeleteOutlined />} size="small" />
        </Popconfirm>
      ),
    },
  ];

  const handleOk = () => {
    form.validateFields().then((v) => {
      addVaccination({
        pigId: v.pigId,
        vaccineName: v.vaccineName,
        vaccinatedAt: v.vaccinatedAt.format("YYYY-MM-DD"),
        performedBy: v.performedBy,
        note: v.note || "",
      });
      setOpen(false);
      form.resetFields();
      message.success("Đã lưu");
    });
  };

  return (
    <div className="vaccination-page">
      <PageHeader
        title="Tiêm phòng"
        subtitle="Gắn mũi tiêm với cá thể lợn"
      />

      {/* ===== ACTIONS (giống dashboard) ===== */}
      <div className="page-actions">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
          style={{ margin: 16 }}
        >
          Ghi nhận tiêm
        </Button>
      </div>

      {/* ===== TABLE (giống dashboard) ===== */}
      <Card className="table-card">
        <Table
          rowKey="id"
          columns={columns}
          dataSource={vaccinations}
        />
      </Card>

      {/* ===== MODAL ===== */}
      <Modal
        title="Ghi nhận tiêm"
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
            name="pigId"
            label="Lợn"
            rules={[{ required: true }]}
          >
            <Select showSearch optionFilterProp="children">
              {activePigs.map((p) => (
                <Option key={p.id} value={p.id}>
                  {p.earTag}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="vaccineName"
            label="Tên vaccine"
            rules={[{ required: true }]}
          >
            <Input placeholder="VD: FMD, PRRS..." />
          </Form.Item>

          <Form.Item
            name="vaccinatedAt"
            label="Ngày tiêm"
            rules={[{ required: true }]}
          >
            <DatePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
            />
          </Form.Item>

          <Form.Item
            name="performedBy"
            label="Người thực hiện"
            rules={[{ required: true }]}
          >
            <Select>
              {staff.map((s) => (
                <Option key={s.id} value={s.fullName}>
                  {s.fullName}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea rows={2} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}