import React, { useMemo, useState } from "react";
import { Card, Table, Select, Space } from "antd";
import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import { PageHeader } from "../../components/layout/PageHeader";
import { usePigFarmStore } from "../../store/pigFarmStore";
import { PigCategory, barnLabel, isoToDisplay } from "../../domain/pigFarm";
import { BreedingStatus, LifecycleStatus } from "../../domain/pigFarm";

dayjs.extend(isSameOrAfter);

const { Option } = Select;

export default function Farrowing() {
  const barns = usePigFarmStore((s) => s.barns);
  const pigs = usePigFarmStore((s) => s.pigs);

  const [filter, setFilter] = useState("raising");

  const activeSows = useMemo(() => {
    return pigs.filter(
      (p) =>
        p.lifecycleStatus === LifecycleStatus.ACTIVE &&
        p.category === PigCategory.SOW
    );
  }, [pigs]);

  const todayStart = dayjs().startOf("day");

  const pregnantWaiting = useMemo(() => {
    return activeSows.filter(
      (p) =>
        p.breedingStatus === BreedingStatus.PREGNANT &&
        p.expectedFarrowAt &&
        !p.lactation
    );
  }, [activeSows]);

  const upcoming = useMemo(() => {
    return pregnantWaiting.filter((p) =>
      dayjs(p.expectedFarrowAt).isSameOrAfter(todayStart, "day")
    );
  }, [pregnantWaiting, todayStart]);

  const late = useMemo(() => {
    return pregnantWaiting.filter((p) =>
      dayjs(p.expectedFarrowAt).isBefore(todayStart, "day")
    );
  }, [pregnantWaiting, todayStart]);

  const mothers = useMemo(() => {
    return activeSows.filter((p) => p.lactation);
  }, [activeSows]);

  const motherColumns = [
    { title: "STT", render: (_, __, i) => i + 1 },
    { title: "Số tai", dataIndex: "earTag" },
    {
      title: "Ngày đẻ",
      dataIndex: "lactation",
      render: (l) => isoToDisplay(l?.birthAt),
    },
    {
      title: "Tổng sinh",
      dataIndex: "lactation",
      render: (l) => l?.totalBorn,
    },
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
      <PageHeader title="Đẻ con" subtitle="Quản lý sinh sản và nuôi con" />

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
    </div>
  );
}