import React, { useMemo, useState } from "react";
import {
  Card,
  Table,
  Input,
  Button,
  Space,
  Modal,
  Form,
  Select,
  DatePicker,
  message,
} from "antd";
import dayjs from "dayjs";
import { PageHeader } from "../../components/layout/PageHeader";
import { usePigFarmStore } from "../../store/pigFarmStore";
import { isoToDisplay } from "../../domain/pigFarm";
import { LifecycleStatus } from "../../domain/pigFarm";

const { Option } = Select;

const reasons = ["Bệnh", "Yếu", "Tai nạn", "Khác"];

export default function PigDead() {
  const pigs = usePigFarmStore((s) => s.pigs);
  const deaths = usePigFarmStore((s) => s.deaths);
  const staff = usePigFarmStore((s) => s.staff);
  const recordDeath = usePigFarmStore((s) => s.recordDeath);
  const updateDeath = usePigFarmStore((s) => s.updateDeath);

  const [keyword, setKeyword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form] = Form.useForm();

  const activePigs = useMemo(
    () => pigs.filter((p) => p.lifecycleStatus === LifecycleStatus.ACTIVE),
    [pigs]
  );

  const dataSource = useMemo(
    () =>
      deaths.map((d) => {
        const pig = pigs.find((p) => p.id === d.pigId);
        return {
          key: d.id,
          pigId: d.pigId,
          code: pig?.earTag || d.pigId,
          status: d.reproductiveSnapshot,
          date: isoToDisplay(d.diedAt),
          diedAtISO: d.diedAt,
          reason: d.cause,
          person: d.performedBy,
          note: d.note,
        };
      }),
    [deaths, pigs]
  );

  const filteredData = dataSource.filter((item) =>
    item.code.toLowerCase().includes(keyword.toLowerCase())
  );

  const handleSave = () => {
    form.validateFields().then((values) => {
      if (editing) {
        updateDeath(editing.key, {
          diedAt: values.date.format("YYYY-MM-DD"),
          cause: values.reason,
          reproductiveSnapshot: values.statusSnapshot,
          performedBy: values.person,
          note: values.note || "",
        });
        message.success("Đã cập nhật");
      } else {
        recordDeath({
          pigId: values.pigId,
          diedAt: values.date.format("YYYY-MM-DD"),
          cause: values.reason,
          reproductiveSnapshot: values.statusSnapshot,
          performedBy: values.person,
          note: values.note || "",
        });
        message.success("Đã ghi nhận");
      }

      setIsModalOpen(false);
      setEditing(null);
      form.resetFields();
    });
  };

  const handleEdit = (record) => {
    setEditing(record);
    form.setFieldsValue({
      pigId: record.pigId,
      statusSnapshot: record.status,
      date: record.diedAtISO ? dayjs(record.diedAtISO) : null,
      reason: record.reason,
      person: record.person,
      note: record.note,
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
    <div className="dashboard">
      <PageHeader
        title="Ghi nhận lợn chết"
        subtitle="Theo dõi và quản lý sự kiện chết"
      />

      <div className="dashboard__maincontent">

        {/* ===== STATS ===== */}
        <div className="stats-grid">
          <Card className="stat-card stat-card--daily-tasks">
            <div className="stat-card__header">
              <span className="stat-card__title">Tổng sự kiện</span>
              <div className="stat-card__icon">💀</div>
            </div>
            <div className="stat-card__value">
              {deaths.length}
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

            <Button
              type="primary"
              onClick={() => {
                setEditing(null);
                form.resetFields();
                setIsModalOpen(true);
              }}
            >
              Thêm
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
        title={editing ? "Xem / sửa" : "Thêm lợn chết"}
        onCancel={() => {
          setIsModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={handleSave}
      >
        <Form form={form} layout="vertical">
          {!editing && (
            <Form.Item name="pigId" label="Lợn" rules={[{ required: true }]}>
              <Select placeholder="Chọn lợn đang nuôi">
                {activePigs.map((p) => (
                  <Option key={p.id} value={p.id}>
                    {p.earTag}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          )}

          <Form.Item
            name="statusSnapshot"
            label="Trạng thái khi chết"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="Hậu bị">Hậu bị</Option>
              <Option value="Đã phối">Đã phối</Option>
              <Option value="Cai sữa">Cai sữa</Option>
              <Option value="Sảy thai">Sảy thai</Option>
              <Option value="Khác">Khác</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="date"
            label="Ngày chết"
            rules={[{ required: true }]}
          >
            <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
          </Form.Item>

          <Form.Item
            name="reason"
            label="Nguyên nhân"
            rules={[{ required: true }]}
          >
            <Select>
              {reasons.map((r) => (
                <Option key={r} value={r}>
                  {r}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="person"
            label="Người xử lý"
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