import React, { useState, useMemo, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Tag,
  Popconfirm,
  message,
  Card,
  Form,
  Modal,
  Select,
  DatePicker,
  Input,
  InputNumber,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { PageHeader } from "../../components/layout/PageHeader";
import { usePigFarmStore } from "../../store/pigFarmStore";
import { barnLabel } from "../../domain/pigFarm";
import dayjs from "dayjs";
import { LifecycleStatus } from "../../domain/pigFarm";

const USAGE_TYPES = ["Sử dụng chung", "Sử dụng cá nhân"];
const PRODUCT_NAMES = ["567S( kg) SILO", "566 SILO", "550p/pack"];
const PRODUCT_CODES = {
  "567S( kg) SILO": "O0701-150758-514",
  "566 SILO": "O1002-101831-715",
  "550p/pack": "O0505-094746-136",
};

function FeedUsageModal({ open, onClose, onSubmit, initialValues, barns, pigs }) {
  const [form] = Form.useForm();
  const isEdit = !!initialValues;
  const barnIdWatch = Form.useWatch("barnId", form);

  const pigsInBarn = useMemo(() => {
    if (!barnIdWatch) return [];
    return pigs.filter(
      (p) => p.barnId === barnIdWatch && p.lifecycleStatus === LifecycleStatus.ACTIVE
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
  }, [open, initialValues, form]);

  const handleProductChange = (name) => {
    form.setFieldValue("productCode", PRODUCT_CODES[name] || "");
  };

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      onSubmit({
        ...values,
        startDate: values.startDate.format("YYYY-MM-DD"),
        endDate: values.endDate.format("YYYY-MM-DD"),
        pigId: values.pigId || null,
      });
    } catch (errorInfo) {
      console.log("Validation Failed:", errorInfo);
    }
  };

  return (
    <Modal
      open={open}
      title={isEdit ? "Sửa sử dụng cám" : "Thêm sử dụng cám"}
      onCancel={onClose}
      onOk={handleOk}
      okText={isEdit ? "Lưu" : "Thêm"}
      cancelText="Hủy"
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
        <Form.Item name="pigId" label="Lợn (tùy chọn)">
          <Select allowClear>
            {pigsInBarn.map((p) => (
              <Option key={p.id} value={p.id}>
                {p.earTag}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="startDate" label="Từ ngày" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item name="endDate" label="Đến ngày" rules={[{ required: true }]}>
          <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
        </Form.Item>
        <Form.Item name="productName" label="Sản phẩm" rules={[{ required: true }]}>
          <Select onChange={handleProductChange}>
            {PRODUCT_NAMES.map((p) => (
              <Option key={p} value={p}>
                {p}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item name="productCode" label="Mã">
          <Input disabled />
        </Form.Item>
        <Form.Item name="unit" label="Đơn vị" rules={[{ required: true }]}>
          <Select>
            <Option value="kg">kg</Option>
            <Option value="bao">bao</Option>
          </Select>
        </Form.Item>
        <Form.Item name="quantity" label="Số lượng" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
        <Form.Item name="totalAmount" label="Thành tiền (₫)" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} min={0} />
        </Form.Item>
        <Form.Item name="performedBy" label="Người thực hiện" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
}

export default function BranUsage() {
  const barns = usePigFarmStore((s) => s.barns);
  const pigs = usePigFarmStore((s) => s.pigs);
  const feedUsages = usePigFarmStore((s) => s.feedUsages);
  const addFeedUsage = usePigFarmStore((s) => s.addFeedUsage);
  const updateFeedUsage = usePigFarmStore((s) => s.updateFeedUsage);
  const deleteFeedUsage = usePigFarmStore((s) => s.deleteFeedUsage);

  const [modalOpen, setModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState(null);

  const handleSubmit = (values) => {
    if (editRecord) {
      updateFeedUsage(editRecord.id, values);
      message.success("Đã cập nhật");
    } else {
      addFeedUsage(values);
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
          <Button
            icon={<EditOutlined />}
            onClick={() => {
              setEditRecord(r);
              setModalOpen(true);
            }}
          />
          <Popconfirm
            title="Xóa?"
            onConfirm={() => {
              deleteFeedUsage(r.id);
              message.success("Đã xóa");
            }}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
    { title: "Loại", dataIndex: "usageType" },
    {
      title: "Chuồng",
      dataIndex: "barnId",
      render: (id) => <Tag>{barnLabel(barns, id)}</Tag>,
    },
    {
      title: "Lợn",
      dataIndex: "pigId",
      render: (pid) => pigs.find((p) => p.id === pid)?.earTag || "—",
    },
    { title: "Từ", dataIndex: "startDate" },
    { title: "Đến", dataIndex: "endDate" },
    { title: "Sản phẩm", dataIndex: "productName" },
    { title: "SL", dataIndex: "quantity" },
    { title: "Tiền", dataIndex: "totalAmount" },
    { title: "Người TH", dataIndex: "performedBy" },
  ];

  return (
    <div className="bran-page">
      <PageHeader title="Sử dụng cám" subtitle="Quản lý tiêu hao thức ăn" />

      {/* ACTION */}
      <div className="page-actions">
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditRecord(null);
            setModalOpen(true);
          }}
          style={{margin:16}}
        >
          Thêm mới
        </Button>
      </div>

      {/* TABLE */}
      <Card className="table-card">
        <Table columns={columns} dataSource={feedUsages} rowKey="id" />
      </Card>

      <FeedUsageModal
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