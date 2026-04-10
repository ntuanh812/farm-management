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
  Tag,
  message,
} from "antd";
import { PageHeader } from "../../components/layout/PageHeader";
import { usePigFarmStore } from "../../store/pigFarmStore";
import { barnLabel, isoToDisplay } from "../../domain/pigFarm";
import { LifecycleStatus } from "../../domain/pigFarm";

const { Option } = Select;

export default function PigstyHistory() {
  const barns = usePigFarmStore((s) => s.barns);
  const pigs = usePigFarmStore((s) => s.pigs);
  const staff = usePigFarmStore((s) => s.staff);
  const movements = usePigFarmStore((s) => s.movements);
  const movePigs = usePigFarmStore((s) => s.movePigs);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");

  const activePigs = useMemo(
    () => pigs.filter((p) => p.lifecycleStatus === LifecycleStatus.ACTIVE),
    [pigs]
  );

  const filteredPigs = useMemo(() => {
    if (statusFilter === "all") return activePigs;
    return activePigs.filter(
      (p) => (p.reproductiveLabel || "") === statusFilter
    );
  }, [activePigs, statusFilter]);

  const historyRows = useMemo(
    () =>
      movements.map((m) => {
        const pig = pigs.find((p) => p.id === m.pigId);
        return {
          key: m.id,
          date: isoToDisplay(m.movedAt),
          earTag: pig?.earTag || m.pigId,
          status: pig?.reproductiveLabel || "—",
          fromPen: barnLabel(barns, m.fromBarnId),
          toPen: barnLabel(barns, m.toBarnId),
          person: m.staffName,
          note: m.note,
        };
      }),
    [movements, pigs, barns]
  );

  const columns = [
    { title: "STT", render: (_, __, index) => index + 1 },
    { title: "Ngày chuyển", dataIndex: "date" },
    { title: "Số tai", dataIndex: "earTag" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => <Tag color="blue">{s}</Tag>,
    },
    { title: "Từ chuồng", dataIndex: "fromPen" },
    {
      title: "Sang chuồng",
      dataIndex: "toPen",
      render: (p) => <Tag color="green">{p}</Tag>,
    },
    { title: "Người thực hiện", dataIndex: "person" },
    { title: "Ghi chú", dataIndex: "note" },
  ];

  const pigColumns = [
    { title: "STT", render: (_, __, index) => index + 1 },
    { title: "Số tai", dataIndex: "earTag" },
    {
      title: "Trạng thái",
      dataIndex: "reproductiveLabel",
      render: (s) => <Tag color="blue">{s || "—"}</Tag>,
    },
    {
      title: "Chuồng hiện tại",
      dataIndex: "barnId",
      render: (id) => barnLabel(barns, id),
    },
  ];

  const handleAdd = () => {
    if (selectedRowKeys.length === 0) {
      message.warning("Chọn ít nhất 1 con");
      return;
    }

    form.validateFields().then((values) => {
      const selected = activePigs.filter((p) =>
        selectedRowKeys.includes(p.id)
      );

      const invalid = selected.some(
        (p) => p.barnId === values.toBarnId
      );

      if (invalid) {
        message.error("Có con đã ở chuồng này");
        return;
      }

      movePigs({
        pigIds: selectedRowKeys,
        toBarnId: values.toBarnId,
        movedAt: values.date.format("YYYY-MM-DD"),
        staffName: values.person,
        note: values.note,
      });

      message.success("Đã chuyển chuồng");
      setSelectedRowKeys([]);
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  return (
    <div className="dashboard">
      <PageHeader
        title="Chuyển chuồng"
        subtitle="Theo dõi lịch sử di chuyển lợn"
      />

      <div className="dashboard__maincontent">

        {/* ===== STATS ===== */}
        <div className="stats-grid">
          <Card className="stat-card stat-card--barn">
            <div className="stat-card__header">
              <span className="stat-card__title">Lượt chuyển</span>
              <div className="stat-card__icon">🏠</div>
            </div>
            <div className="stat-card__value">
              {movements.length}
            </div>
          </Card>
        </div>

        {/* ===== FILTER / ACTION ===== */}
        <Card className="filter-card">
          <Space wrap>
            <Button type="primary" onClick={() => setIsModalOpen(true)}>
              Thêm chuyển chuồng
            </Button>
          </Space>
        </Card>

        {/* ===== TABLE ===== */}
        <Card className="table-card">
          <Table
            columns={columns}
            dataSource={historyRows}
            pagination={{ pageSize: 10 }}
          />
        </Card>
      </div>

      {/* ===== MODAL ===== */}
      <Modal
        title="Chuyển chuồng"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleAdd}
        width={800}
      >
        <Space style={{ marginBottom: 12 }}>
          <Select
            value={statusFilter}
            onChange={setStatusFilter}
            style={{ width: 220 }}
          >
            <Option value="all">Tất cả</Option>
            <Option value="Hậu bị">Hậu bị</Option>
            <Option value="Đã phối">Đã phối</Option>
            <Option value="Đẻ con">Đẻ con</Option>
            <Option value="Cai sữa">Cai sữa</Option>
          </Select>
        </Space>

        <Table
          rowKey="id"
          rowSelection={{
            selectedRowKeys,
            onChange: setSelectedRowKeys,
          }}
          columns={pigColumns}
          dataSource={filteredPigs}
          pagination={{ pageSize: 5 }}
          size="small"
        />

        <Form form={form} layout="vertical" style={{ marginTop: 12 }}>
          <Form.Item
            name="date"
            label="Ngày chuyển"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="toBarnId"
            label="Chuyển sang chuồng"
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

          <Form.Item
            name="person"
            label="Người thực hiện"
            rules={[{ required: true }]}
          >
            <Select>
              {staff.map((x) => (
                <Option key={x.id} value={x.fullName}>
                  {x.fullName}
                </Option>
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