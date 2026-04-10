import React, { useMemo, useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Space,
} from "antd";
import dayjs from "dayjs";
import { PageHeader } from "../../components/layout/PageHeader";
import { usePigFarmStore } from "../../store/pigFarmStore";
import { PigCategory, barnLabel, isoToDisplay } from "../../domain/pigFarm";
import { BreedingStatus, LifecycleStatus } from "../../domain/pigFarm";

const { Option } = Select;

export default function Farrowing() {
  const barns = usePigFarmStore((s) => s.barns);
  const pigs = usePigFarmStore((s) => s.pigs);
  const recordFarrowing = usePigFarmStore((s) => s.recordFarrowing);

  const [filter, setFilter] = useState("raising");
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

  const todayStart = dayjs().startOf("day");

  const pregnantWaiting = useMemo(
    () =>
      activeSows.filter(
        (p) =>
          p.breedingStatus === BreedingStatus.PREGNANT &&
          p.expectedFarrowAt &&
          !p.lactation
      ),
    [activeSows]
  );

  const upcoming = useMemo(
    () =>
      pregnantWaiting.filter((p) =>
        dayjs(p.expectedFarrowAt).isSameOrAfter(todayStart, "day")
      ),
    [pregnantWaiting, todayStart]
  );

  const late = useMemo(
    () =>
      pregnantWaiting.filter((p) =>
        dayjs(p.expectedFarrowAt).isBefore(todayStart, "day")
      ),
    [pregnantWaiting, todayStart]
  );

  const mothers = useMemo(
    () => activeSows.filter((p) => p.lactation),
    [activeSows]
  );

  const handleAdd = () => {
    form.validateFields().then((values) => {
      recordFarrowing({
        earTag: values.code,
        birthAt: values.date.format("YYYY-MM-DD"),
        totalBorn: values.total,
        alive: values.alive || 0,
        dead: values.dead || 0,
        barnId: values.barnId,
      });

      setIsModalOpen(false);
      form.resetFields();
    });
  };

  const motherColumns = [
    { title: "STT", render: (_, __, i) => i + 1 },
    { title: "Số tai", dataIndex: "earTag" },
    {
      title: "Ngày đẻ",
      dataIndex: "lactation",
      render: (l) => isoToDisplay(l?.birthAt),
    },
    { title: "Tổng sinh", dataIndex: "lactation", render: (l) => l?.totalBorn },
    { title: "Chết", dataIndex: "lactation", render: (l) => l?.dead },
    { title: "Còn sống", dataIndex: "lactation", render: (l) => l?.alive },
    {
      title: "Số ngày nuôi",
      render: (r) =>
        r.lactation?.birthAt
          ? dayjs().diff(dayjs(r.lactation.birthAt), "day")
          : "",
    },
    {
      title: "Chuồng",
      dataIndex: "barnId",
      render: (id) => barnLabel(barns, id),
    },
  ];

  const upcomingColumns = [
    { title: "STT", render: (_, __, i) => i + 1 },
    { title: "Số tai", dataIndex: "earTag" },
    {
      title: "Ngày đẻ dự kiến",
      dataIndex: "expectedFarrowAt",
      render: (iso) => isoToDisplay(iso),
    },
    {
      title: "Còn lại (ngày)",
      render: (r) => dayjs(r.expectedFarrowAt).diff(dayjs(), "day"),
    },
    {
      title: "Chuồng",
      dataIndex: "barnId",
      render: (id) => barnLabel(barns, id),
    },
  ];

  const lateColumns = [
    { title: "STT", render: (_, __, i) => i + 1 },
    { title: "Số tai", dataIndex: "earTag" },
    {
      title: "Ngày đẻ dự kiến",
      dataIndex: "expectedFarrowAt",
      render: (iso) => isoToDisplay(iso),
    },
    {
      title: "Quá hạn (ngày)",
      render: (r) => dayjs().diff(dayjs(r.expectedFarrowAt), "day"),
    },
    {
      title: "Chuồng",
      dataIndex: "barnId",
      render: (id) => barnLabel(barns, id),
    },
  ];

  const tableTitle =
    filter === "raising"
      ? "Lợn mẹ đang nuôi con"
      : filter === "upcoming"
      ? "Sắp đẻ"
      : "Chậm đẻ";

  const tableData =
    filter === "raising"
      ? mothers
      : filter === "upcoming"
      ? upcoming
      : late;

  const tableColumns =
    filter === "raising"
      ? motherColumns
      : filter === "upcoming"
      ? upcomingColumns
      : lateColumns;

  return (
    <div className="dashboard">
      <PageHeader
        title="Đẻ con"
        subtitle="Quản lý sinh sản và nuôi con"
      />

      <div className="dashboard__maincontent">

        {/* ===== STATS ===== */}
        <div className="stats-grid">
          <Card className="stat-card stat-card--pigs">
            <div className="stat-card__header">
              <span className="stat-card__title">Mẹ nuôi con</span>
              <div className="stat-card__icon">🐷</div>
            </div>
            <div className="stat-card__value">{mothers.length}</div>
          </Card>

          <Card className="stat-card stat-card--barn">
            <div className="stat-card__header">
              <span className="stat-card__title">Sắp đẻ</span>
              <div className="stat-card__icon">📅</div>
            </div>
            <div className="stat-card__value">{upcoming.length}</div>
          </Card>

          <Card className="stat-card stat-card--daily-tasks">
            <div className="stat-card__header">
              <span className="stat-card__title">Chậm đẻ</span>
              <div className="stat-card__icon">⚠️</div>
            </div>
            <div className="stat-card__value">{late.length}</div>
          </Card>
        </div>

        {/* ===== FILTER ===== */}
        <Card className="filter-card">
          <Space wrap>
            <Select value={filter} onChange={setFilter}>
              <Option value="raising">Nuôi con</Option>
              <Option value="upcoming">Sắp đẻ</Option>
              <Option value="late">Chậm đẻ</Option>
            </Select>

            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              Ghi đẻ
            </Button>
          </Space>
        </Card>

        {/* ===== TABLE ===== */}
        <Card title={tableTitle} className="table-card">
          <Table
            columns={tableColumns}
            dataSource={tableData}
            rowKey="id"
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>

      {/* ===== MODAL ===== */}
      <Modal
        title="Ghi đẻ"
        open={isModalOpen}
        onOk={handleAdd}
        onCancel={() => setIsModalOpen(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="Số tai"
            rules={[{ required: true }]}
          >
            <Select>
              {[...upcoming, ...late].map((p) => (
                <Option key={p.id} value={p.earTag}>
                  {p.earTag}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày đẻ"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="total"
            label="Tổng đẻ"
            rules={[{ required: true }]}
          >
            <InputNumber style={{ width: "100%" }} min={0} />
          </Form.Item>

          <Form.Item shouldUpdate>
            {({ getFieldValue, setFieldsValue }) => {
              const total = getFieldValue("total");

              return (
                <>
                  <Form.Item name="alive" label="Sống">
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      onChange={(v) => {
                        if (total != null) {
                          setFieldsValue({ dead: total - (v || 0) });
                        }
                      }}
                    />
                  </Form.Item>

                  <Form.Item name="dead" label="Chết">
                    <InputNumber
                      style={{ width: "100%" }}
                      min={0}
                      onChange={(v) => {
                        if (total != null) {
                          setFieldsValue({ alive: total - (v || 0) });
                        }
                      }}
                    />
                  </Form.Item>
                </>
              );
            }}
          </Form.Item>

          <Form.Item
            name="barnId"
            label="Chuồng"
            rules={[{ required: true }]}
          >
            <Select>
              {barns.map((b) => (
                <Option key={b.id} value={b.id}>
                  {b.code} — {b.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}