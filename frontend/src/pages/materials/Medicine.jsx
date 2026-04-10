import React, { useEffect, useMemo, useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Card,
  Select,
  DatePicker,
} from "antd";
import {
  PlusOutlined,
  MedicineBoxOutlined,
  DeleteOutlined,
  EditOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { PageHeader } from "../../components/layout/PageHeader";
import { usePigFarmStore } from "../../store/pigFarmStore";
import { barnLabel } from "../../domain/pigFarm";
import { LifecycleStatus } from "../../domain/pigFarm";

const { Option } = Select;

const USAGE_TYPES = ["Sử dụng cá nhân", "Sử dụng chung"];

const PRODUCTS = [
  { code: "M0908-095913", name: "Suifertil, 1L", unit: "chai(1000ml)" },
  { code: "O1812-104111-199", name: "gendextyl 100ml", unit: "chai(100ml)" },
  { code: "M0908-092300", name: "Gel lubricante - 1 Lit", unit: "chai(1000ml)" },
];

const PRODUCT_MAP = Object.fromEntries(PRODUCTS.map((p) => [p.name, p]));

/* ================= MODAL ================= */
function MedicineModal({ open, onClose, onSubmit, initialValues, barns, pigs }) {
  const [form] = Form.useForm();
  const isEdit = !!initialValues;
  const barnIdWatch = Form.useWatch("barnId", form);

  const pigsInBarn = useMemo(() => {
    if (!barnIdWatch) return [];
    return pigs.filter(
      (p) =>
        p.barnId === barnIdWatch &&
        p.lifecycleStatus === LifecycleStatus.ACTIVE
    );
  }, [pigs, barnIdWatch]);

  useEffect(() => {
    if (open) {
      if (initialValues) {
        form.setFieldsValue({
          ...initialValues,
          startDate: dayjs(initialValues.startDate),
          endDate: dayjs(initialValues.endDate),
        });
      } else {
        form.resetFields();
      }
    }
  }, [open, initialValues]);

  const handleProductChange = (name) => {
    const p = PRODUCT_MAP[name];
    if (p) form.setFieldsValue({ productCode: p.code, unit: p.unit });
  };

  const handleOk = async () => {
    const values = await form.validateFields();
    onSubmit({
      ...values,
      startDate: values.startDate.format("YYYY-MM-DD"),
      endDate: values.endDate.format("YYYY-MM-DD"),
      pigId: values.pigId || null,
    });
  };

  return (
    <Modal
      open={open}
      title={
        <Space>
          <MedicineBoxOutlined />
          {isEdit ? "Sửa sử dụng thuốc" : "Thêm sử dụng thuốc"}
        </Space>
      }
      onCancel={onClose}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
        <Form.Item name="usageType" label="Loại" rules={[{ required: true }]}>
          <Select>
            {USAGE_TYPES.map((t) => (
              <Option key={t} value={t}>
                {t}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="barnId" label="Chuồng" rules={[{ required: true }]}>
          <Select>
            {barns.map((b) => (
              <Option key={b.id} value={b.id}>
                {b.code} — {b.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="pigId" label="Lợn">
          <Select allowClear>
            {pigsInBarn.map((p) => (
              <Option key={p.id} value={p.id}>
                {p.earTag}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="startDate" label="Từ ngày" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="endDate" label="Đến ngày" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="productName" label="Sản phẩm" rules={[{ required: true }]}>
          <Select onChange={handleProductChange}>
            {PRODUCTS.map((p) => (
              <Option key={p.name} value={p.name}>
                {p.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item name="productCode" label="Mã">
          <Input disabled />
        </Form.Item>

        <Form.Item name="unit" label="Đơn vị" rules={[{ required: true }]}>
          <Input />
        </Form.Item>

        <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="totalAmount" label="Thành tiền" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item name="performedBy" label="Người thực hiện" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

/* ================= PAGE ================= */
export default function MedicineUsage() {
  const barns = usePigFarmStore((s) => s.barns);
  const pigs = usePigFarmStore((s) => s.pigs);
  const medicineUsages = usePigFarmStore((s) => s.medicineUsages);

  const add = usePigFarmStore((s) => s.addMedicineUsage);
  const update = usePigFarmStore((s) => s.updateMedicineUsage);
  const remove = usePigFarmStore((s) => s.deleteMedicineUsage);

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  const handleSubmit = (values) => {
    if (editRecord) {
      update(editRecord.id, values);
      message.success("Đã cập nhật");
    } else {
      add(values);
      message.success("Đã thêm");
    }
    setModalOpen(false);
    setEditRecord(null);
  };

  const columns = [
    {
      title: "",
      render: (_, r) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => { setEditRecord(r); setModalOpen(true); }} />
          <Popconfirm title="Xóa?" onConfirm={() => { remove(r.id); message.success("Đã xóa"); }}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
    { title: "Loại", dataIndex: "usageType" },
    {
      title: "Chuồng",
      dataIndex: "barnId",
      render: (id) => barnLabel(barns, id),
    },
    {
      title: "Lợn",
      dataIndex: "pigId",
      render: (pid) => pigs.find((p) => p.id === pid)?.earTag || "—",
    },
    { title: "Sản phẩm", dataIndex: "productName" },
    { title: "SL", dataIndex: "quantity" },
    { title: "Tiền", dataIndex: "totalAmount" },
  ];

  return (
    <div className="medicine-page">
      <PageHeader title="Sử dụng thuốc" subtitle="Quản lý thuốc" />

      {/* ===== ACTIONS ===== */}
      <div className="page-actions">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditRecord(null);
            setModalOpen(true);
          }}
          style={{ margin: 16 }}
        >
          Thêm mới
        </Button>
      </div>

      {/* ===== TABLE ===== */}
      <Card className="table-card">
        <Table columns={columns} dataSource={medicineUsages} rowKey="id" />
      </Card>

      <MedicineModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditRecord(null);
        }}
        onSubmit={handleSubmit}
        initialValues={editRecord}
        barns={barns}
        pigs={pigs}
      />
    </div>
  );
}