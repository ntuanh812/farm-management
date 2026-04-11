import React, { useMemo, useState } from "react";
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
  message,
} from "antd";
import dayjs from "dayjs";
import { PageHeader } from "../../components/layout/PageHeader";
import { usePigFarmStore } from "../../store/pigFarmStore";
import { PigCategory, barnLabel, isoToDisplay } from "../../domain/pigFarm";
import { BreedingStatus, LifecycleStatus } from "../../domain/pigFarm";

const { Option } = Select;

export default function PigBreeding() {
  const barns = usePigFarmStore((s) => s.barns);
  const pigs = usePigFarmStore((s) => s.pigs);
  const staff = usePigFarmStore((s) => s.staff);
  const recordBreeding = usePigFarmStore((s) => s.recordBreeding);

  const [filter, setFilter] = useState("ready");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const activeSows = useMemo(
    () =>
      pigs.filter(
        (p) =>
          p.lifecycleStatus === LifecycleStatus.ACTIVE &&
          p.category === PigCategory.SOW
      ),
    [pigs]
  );

  const pregnantList = useMemo(
    () =>
      activeSows.filter((d) => d.breedingStatus === BreedingStatus.PREGNANT),
    [activeSows]
  );

  // ✅ FIX: nếu chưa có breedingStatus thì mặc định là READY
  const readyList = useMemo(
    () =>
      activeSows.filter(
        (d) => !d.breedingStatus || d.breedingStatus === BreedingStatus.READY
      ),
    [activeSows]
  );

  const handleBreed = () => {
    form.validateFields().then((values) => {
      recordBreeding({
        earTag: values.code,
        bredAt: values.date.format("YYYY-MM-DD"),
        method: values.method,
        staffName: values.staff,
        note: values.note,
      });
      setFilter("pregnant");
      message.success("Đã ghi phối giống");
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const pregnantColumns = [
    { title: "Số tai", dataIndex: "earTag" },
    {
      title: "Ngày phối",
      dataIndex: "bredAt",
      render: (iso) => isoToDisplay(iso),
    },
    {
      title: "Chửa (ngày)",
      render: (r) => (r.bredAt ? dayjs().diff(dayjs(r.bredAt), "day") : ""),
    },
    {
      title: "Dự đẻ",
      render: (r) => (r.expectedFarrowAt ? isoToDisplay(r.expectedFarrowAt) : ""),
    },
    {
      title: "Chuồng",
      dataIndex: "barnId",
      render: (id) => barnLabel(barns, id),
    },
    { title: "Người thực hiện", dataIndex: "breedStaffName" },
  ];

  const readyColumns = [
    { title: "STT", render: (_, __, index) => index + 1 },
    { title: "Số tai", dataIndex: "earTag" },
    {
      title: "Chuồng",
      dataIndex: "barnId",
      render: (id) => barnLabel(barns, id),
    },
    {
      title: "Tuần tuổi",
      dataIndex: "ageDays",
      render: (d) => Math.floor((d || 0) / 7),
    },
    {
      title: "Ngày tuổi",
      dataIndex: "ageDays",
    },
  ];

  const tableTitle =
    filter === "pregnant" ? "Lợn đang mang thai" : "Lợn chờ phối";

  const tableData = filter === "pregnant" ? pregnantList : readyList;

  const tableColumns = filter === "pregnant" ? pregnantColumns : readyColumns;

  return (
    <div className="dashboard">
      <PageHeader
        title="Phối giống"
        subtitle="Quản lý trạng thái sinh sản và phối giống"
      />

      <div className="dashboard__maincontent">
        <div className="stats-grid">
          <Card className="stat-card stat-card--pigs">
            <div className="stat-card__header">
              <span className="stat-card__title">Mang thai</span>
              <div className="stat-card__icon">🐖</div>
            </div>
            <div className="stat-card__value">{pregnantList.length}</div>
          </Card>

          <Card className="stat-card stat-card--daily-tasks">
            <div className="stat-card__header">
              <span className="stat-card__title">Chờ phối</span>
              <div className="stat-card__icon">⏳</div>
            </div>
            <div className="stat-card__value">{readyList.length}</div>
          </Card>
        </div>

        <Card className="filter-card">
          <Space wrap>
            <Select value={filter} onChange={setFilter}>
              <Option value="ready">Chờ phối</Option>
              <Option value="pregnant">Mang thai</Option>
            </Select>

            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              Phối giống
            </Button>
          </Space>
        </Card>

        <Card title={tableTitle} className="table-card">
          <Table
            columns={tableColumns}
            dataSource={tableData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>

      <Modal
        title="Phối giống"
        open={isModalOpen}
        onOk={handleBreed}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical" initialValues={{ method: "Tự nhiên" }}>
          <Form.Item name="code" label="Số tai" rules={[{ required: true }]}>
            <Select placeholder="Chọn lợn nái">
              {readyList.map((p) => (
                <Option key={p.id} value={p.earTag}>
                  {p.earTag}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="date" label="Ngày phối" rules={[{ required: true }]}>
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item name="method" label="Cách phối">
            <Select>
              <Option value="Tự nhiên">Tự nhiên</Option>
              <Option value="Thụ tinh nhân tạo">Thụ tinh nhân tạo</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="staff"
            label="Người thực hiện"
            rules={[{ required: true, message: "Chọn nhân viên" }]}
          >
            <Select placeholder="Chọn nhân viên">
              {staff.map((s) => (
                <Option key={s.id} value={s.fullName}>
                  {s.fullName}
                </Option>
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