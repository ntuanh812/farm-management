import React, { useMemo, useState } from "react";
import {
  Card,
  Table,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Modal,
  Form,
  InputNumber,
  DatePicker,
} from "antd";
import dayjs from "dayjs";
import { PageHeader } from "../../components/layout/PageHeader";
import { usePigFarmStore } from "../../store/pigFarmStore";
import {
  categoryLabels,
  PigCategory,
  barnLabel,
  isoToDisplay,
  sowReproductiveLabels,
  LifecycleStatus,
} from "../../domain/pigFarm";

const { Option } = Select;

const typeMap = {
  [PigCategory.SOW]: { label: categoryLabels[PigCategory.SOW], color: "green" },
  [PigCategory.BOAR]: { label: categoryLabels[PigCategory.BOAR], color: "red" },
  [PigCategory.PIGLET]: { label: categoryLabels[PigCategory.PIGLET], color: "gold" },
  [PigCategory.FATTENING]: { label: categoryLabels[PigCategory.FATTENING], color: "blue" },
};

const statusColor = {
  "Chờ phối": "default",
  "Đã phối": "purple",
  "Đẻ con": "green",
  "Cai sữa": "cyan",
  "Sảy thai": "red",
  "Bán loại": "volcano",
  "Chết": "black",
  "Hậu bị": "blue",
  "Đang tăng trọng": "processing",
  "Sẵn sàng xuất": "success",
};

function displayStatus(pig) {
  if (pig.category === PigCategory.FATTENING && pig.fattening) {
    if (pig.fattening.phase === "ready") return "Sẵn sàng xuất";
    return "Đang tăng trọng";
  }
  if (pig.reproductiveLabel) return pig.reproductiveLabel;
  return "—";
}

export default function PigManagement() {
  const barns = usePigFarmStore((s) => s.barns);
  const pigs = usePigFarmStore((s) => s.pigs);
  const addPig = usePigFarmStore((s) => s.addPig);

  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [barnFilter, setBarnFilter] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const activePigs = useMemo(
    () => pigs.filter((p) => p.lifecycleStatus === LifecycleStatus.ACTIVE),
    [pigs]
  );

  const filteredData = useMemo(() => {
    return activePigs
      .filter((item) => {
        return (
          item.earTag.toLowerCase().includes(keyword.toLowerCase()) &&
          (typeFilter === "all" || item.category === typeFilter) &&
          (barnFilter === "all" || item.barnId === barnFilter)
        );
      })
      .map((p) => ({
        key: p.id,
        ...p,
        displayStatus: displayStatus(p),
        barnDisplay: barnLabel(barns, p.barnId),
        arrivedDisplay: isoToDisplay(p.arrivedAt),
      }));
  }, [activePigs, keyword, typeFilter, barnFilter, barns]);

  const columns = [
    { title: "Số tai", dataIndex: "earTag" },
    {
      title: "Loại",
      dataIndex: "category",
      render: (t) => <Tag color={typeMap[t]?.color}>{typeMap[t]?.label}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "displayStatus",
      render: (s) => <Tag color={statusColor[s] || "default"}>{s}</Tag>,
    },
    { title: "Ngày nhập", dataIndex: "arrivedDisplay" },
    { title: "Tuổi (ngày)", dataIndex: "ageDays" },
    { title: "Cân (kg)", dataIndex: "weightKg", render: (w) => w ?? "—" },
    {
      title: "Chuồng",
      dataIndex: "barnDisplay",
      render: (t) => <Tag>{t}</Tag>,
    },
  ];

  const handleAdd = () => {
    form.validateFields().then((values) => {
      addPig({
        earTag: values.earTag,
        barnId: values.barnId,
        category: values.category,
        reproductiveLabel: values.reproductiveLabel,
        ageDays: values.ageDays,
        weightKg: values.weightKg,
        arrivedAt: values.arrivedAt
          ? values.arrivedAt.format("YYYY-MM-DD")
          : undefined,
      });
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  return (
    <div className="dashboard">
      <PageHeader title="Quản lý đàn" subtitle="Danh sách lợn đang nuôi" />

      <div className="dashboard__maincontent">

        {/* ===== STATS ===== */}
        <div className="stats-grid">
          <Card className="stat-card stat-card--pigs">
            <div className="stat-card__header">
              <span className="stat-card__title">Tổng đang nuôi</span>
              <div className="stat-card__icon">🐷</div>
            </div>
            <div className="stat-card__value">
              {activePigs.length}
              <span className="stat-card__label"> con</span>
            </div>
          </Card>

          <Card className="stat-card stat-card--barn">
            <div className="stat-card__header">
              <span className="stat-card__title">Lợn nái</span>
              <div className="stat-card__icon">👑</div>
            </div>
            <div className="stat-card__value">
              {activePigs.filter((p) => p.category === PigCategory.SOW).length}
            </div>
          </Card>

          <Card className="stat-card stat-card--staff">
            <div className="stat-card__header">
              <span className="stat-card__title">Lợn thịt</span>
              <div className="stat-card__icon">🥩</div>
            </div>
            <div className="stat-card__value">
              {activePigs.filter((p) => p.category === PigCategory.FATTENING).length}
            </div>
          </Card>

          <Card className="stat-card stat-card--daily-tasks">
            <div className="stat-card__header">
              <span className="stat-card__title">Lợn con</span>
              <div className="stat-card__icon">🐽</div>
            </div>
            <div className="stat-card__value">
              {activePigs.filter((p) => p.category === PigCategory.PIGLET).length}
            </div>
          </Card>
        </div>

        {/* ===== FILTER ===== */}
        <Card className="filter-card">
          <Space wrap>
            <Input
              placeholder="Tìm số tai"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <Select value={typeFilter} onChange={setTypeFilter} style={{ minWidth: 140 }}>
              <Option value="all">Tất cả</Option>
              {Object.keys(typeMap).map((k) => (
                <Option key={k} value={k}>
                  {typeMap[k].label}
                </Option>
              ))}
            </Select>

            <Select value={barnFilter} onChange={setBarnFilter} style={{ minWidth: 180 }}>
              <Option value="all">Tất cả chuồng</Option>
              {barns.map((b) => (
                <Option key={b.id} value={b.id}>
                  {b.code} — {b.name}
                </Option>
              ))}
            </Select>

            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              Nhập lợn
            </Button>
          </Space>
        </Card>

        {/* ===== TABLE ===== */}
        <Card className="table-card">
          <Table columns={columns} dataSource={filteredData} />
        </Card>
      </div>

      {/* ===== MODAL ===== */}
      <Modal
        open={isModalOpen}
        onOk={handleAdd}
        onCancel={() => setIsModalOpen(false)}
        title="Nhập lợn mới"
      >
        <Form form={form} layout="vertical">
          <Form.Item name="earTag" label="Số tai" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="category"
            label="Loại"
            initialValue={PigCategory.FATTENING}
          >
            <Select>
              {Object.keys(typeMap).map((k) => (
                <Option key={k} value={k}>
                  {typeMap[k].label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item noStyle shouldUpdate={(p, c) => p.category !== c.category}>
            {({ getFieldValue }) =>
              getFieldValue("category") === PigCategory.SOW ? (
                <Form.Item
                  name="reproductiveLabel"
                  label="Giai đoạn sinh sản"
                  initialValue="Hậu bị"
                >
                  <Select>
                    {sowReproductiveLabels.map((x) => (
                      <Option key={x} value={x}>
                        {x}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              ) : null
            }
          </Form.Item>

          <Form.Item
            name="barnId"
            label="Chuồng"
            initialValue={barns[0]?.id}
          >
            <Select>
              {barns.map((b) => (
                <Option key={b.id} value={b.id}>
                  {b.code} — {b.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="arrivedAt" label="Ngày nhập" initialValue={dayjs()}>
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item name="ageDays" label="Tuổi (ngày)" initialValue={0}>
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="weightKg" label="Cân nặng">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}