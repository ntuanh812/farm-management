import React, { useMemo, useState } from "react";
import {
  Card,
  Table,
  Select,
  Space,
  DatePicker,
  Input,
  Button,
  Modal,
  Form,
  InputNumber,
  Row,
  Col,
  message,
} from "antd";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { PageHeader } from "../../components/layout/PageHeader";
import { usePigFarmStore } from "../../store/pigFarmStore";
import { PigCategory, LifecycleStatus } from "../../domain/pigFarm";

dayjs.extend(weekOfYear);

export default function PigFattening() {
  const pigs = usePigFarmStore((s) => s.pigs);
  const saleBatches = usePigFarmStore((s) => s.saleBatches);
  const addSaleBatch = usePigFarmStore((s) => s.addSaleBatch);
  const updatePig = usePigFarmStore((s) => s.updatePig);

  const filterLabel = {
    day: "ngày",
    week: "tuần",
    month: "tháng",
  };

  const [filterType, setFilterType] = useState("day");
  const [searchEar, setSearchEar] = useState("");

  const [openSingle, setOpenSingle] = useState(false);
  const [openBulk, setOpenBulk] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);

  const [selectedBatch, setSelectedBatch] = useState(null);

  const [form] = Form.useForm();
  const [bulkForm] = Form.useForm();

  // ===== DATA =====
  const fatteningActive = useMemo(() => {
    return pigs.filter(
      (p) =>
        p.lifecycleStatus === LifecycleStatus.ACTIVE &&
        p.category === PigCategory.FATTENING
    );
  }, [pigs]);

  const sold = useMemo(() => {
    return pigs.filter(
      (p) =>
        p.lifecycleStatus === LifecycleStatus.SOLD &&
        p.category === PigCategory.FATTENING
    );
  }, [pigs]);

  // ===== STATS =====
  const stats = useMemo(() => {
    const revenue = saleBatches.reduce(
      (s, b) => s + b.lines.reduce((x, l) => x + (l.totalAmount || 0), 0),
      0
    );

    const totalKg = saleBatches.reduce(
      (s, b) => s + b.lines.reduce((x, l) => x + (l.weightKg || 0), 0),
      0
    );

    return { revenue, totalKg };
  }, [saleBatches]);

  // ===== FILTER =====
  const sellRows = useMemo(() => {
    return saleBatches
      .filter((b) => {
        if (!searchEar) return true;
        return b.lines.some((l) => l.earTag?.includes(searchEar));
      })
      .map((b) => ({
        key: b.id,
        soldAt: b.soldAt,
        count: b.lines.length,
        totalKg: b.lines.reduce((s, l) => s + (l.weightKg || 0), 0),
        total: b.lines.reduce((s, l) => s + (l.totalAmount || 0), 0),
        raw: b,
      }));
  }, [saleBatches, searchEar]);

  // ===== GROUP =====
  const grouped = useMemo(() => {
    const map = {};

    sellRows.forEach((d) => {
      const date = dayjs(d.soldAt);
      let key = "";

      if (filterType === "day") key = date.format("DD/MM/YYYY");
      if (filterType === "week") key = `Tuần ${date.week()} - ${date.year()}`;
      if (filterType === "month") key = `Tháng ${date.format("MM/YYYY")}`;

      if (!map[key]) {
        map[key] = {
          key,
          count: 0,
          totalKg: 0,
          total: 0,
          raw: d.raw,
        };
      }

      map[key].count += d.count;
      map[key].totalKg += d.totalKg;
      map[key].total += d.total;
    });

    return Object.values(map);
  }, [sellRows, filterType]);

  // ===== SELL SINGLE =====
  const handleSell = (values) => {
    const totalAmount = (values.pricePerKg || 0) * (values.weightKg || 0);

    addSaleBatch({
      soldAt: values.date.format("YYYY-MM-DD"),
      staffName: values.staffName || "",
      note: values.note || "",
      lines: [
        {
          earTag: values.earTag,
          weightKg: values.weightKg,
          pricePerKg: values.pricePerKg,
          totalAmount,
          reason: values.reason || "Xuất bán",
          note: values.note || "",
        },
      ],
    });

    updatePig(values.earTag, {
      lifecycleStatus: LifecycleStatus.SOLD,
    });

    setOpenSingle(false);
    form.resetFields();
    message.success("Đã xuất bán");
  };

  // ===== SELL BULK =====
  const handleBulkSell = (values) => {
    const lines = (values.items || []).map((i) => ({
      earTag: i.earTag,
      weightKg: i.weightKg || 0,
      pricePerKg: values.pricePerKg,
      totalAmount: (i.weightKg || 0) * (values.pricePerKg || 0),
      reason: "Xuất bán",
      note: "",
    }));

    addSaleBatch({
      soldAt: values.date.format("YYYY-MM-DD"),
      staffName: values.staffName || "",
      note: "",
      lines,
    });

    lines.forEach((l) => {
      updatePig(l.earTag, {
        lifecycleStatus: LifecycleStatus.SOLD,
      });
    });

    setOpenBulk(false);
    bulkForm.resetFields();
    message.success("Đã xuất bán hàng loạt");
  };

  return (
    <div className="dashboard">
      <PageHeader title="Lợn thịt" subtitle="Xuất bán" />

      <div className="dashboard__maincontent">
        {/* ===== STATS ===== */}
        <Row gutter={[20, 20]} className="dashboard-stats">
          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card stat-card--pigs">
              <div className="stat-card__header">
                <span className="stat-card__title">Đang nuôi</span>
              </div>
              <div className="stat-card__value">
                {fatteningActive.length}
                <span className="stat-card__label"> con</span>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card stat-card--daily-tasks">
              <div className="stat-card__header">
                <span className="stat-card__title">Đã xuất</span>
              </div>
              <div className="stat-card__value">
                {sold.length}
                <span className="stat-card__label"> con</span>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card stat-card--staff">
              <div className="stat-card__header">
                <span className="stat-card__title">Doanh thu</span>
              </div>
              <div className="stat-card__value">
                {stats.revenue.toLocaleString()}
                <span className="stat-card__label"> đ</span>
              </div>
            </Card>
          </Col>

          <Col xs={24} sm={12} lg={6}>
            <Card className="stat-card stat-card--barn">
              <div className="stat-card__header">
                <span className="stat-card__title">Tổng kg</span>
              </div>
              <div className="stat-card__value">
                {stats.totalKg}
                <span className="stat-card__label"> kg</span>
              </div>
            </Card>
          </Col>
        </Row>

        {/* ===== FILTER CARD ===== */}
        <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card>
              <Space wrap>
                <Input
                  placeholder="Tìm số tai"
                  value={searchEar}
                  onChange={(e) => setSearchEar(e.target.value)}
                  style={{ width: 220 }}
                />

                <Select
                  value={filterType}
                  onChange={setFilterType}
                  style={{ width: 140 }}
                  options={[
                    { value: "day", label: "Ngày" },
                    { value: "week", label: "Tuần" },
                    { value: "month", label: "Tháng" },
                  ]}
                />

                <Button type="primary" onClick={() => setOpenSingle(true)}>
                  Bán lợn
                </Button>

                <Button onClick={() => setOpenBulk(true)}>Bán hàng loạt</Button>
              </Space>
            </Card>
          </Col>
        </Row>

        {/* ===== TABLE ===== */}
        <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
          <Col span={24}>
            <Card className="activity-card">
              <div className="activity-card__header">
                <h3>Tổng hợp theo {filterLabel[filterType]}</h3>
              </div>

              <Table
                dataSource={grouped}
                rowKey="key"
                columns={[
                  { title: "STT", render: (_, __, i) => i + 1 },
                  { title: filterLabel[filterType], dataIndex: "key" },
                  { title: "Số con", dataIndex: "count" },
                  { title: "Tổng kg", dataIndex: "totalKg" },
                  {
                    title: "Thành tiền",
                    dataIndex: "total",
                    render: (v) => (v || 0).toLocaleString(),
                  },
                  {
                    title: "Thao tác",
                    render: (_, r) => (
                      <Button
                        onClick={() => {
                          setSelectedBatch(r.raw);
                          setOpenDetail(true);
                        }}
                      >
                        Xem
                      </Button>
                    ),
                  },
                ]}
              />
            </Card>
          </Col>
        </Row>

        {/* ===== MODAL SINGLE ===== */}
        <Modal
          open={openSingle}
          onCancel={() => setOpenSingle(false)}
          onOk={() => form.submit()}
          title="Bán lợn"
        >
          <Form form={form} onFinish={handleSell} layout="vertical">
            <Form.Item name="earTag" label="Số tai" rules={[{ required: true }]}>
              <Select
                options={fatteningActive.map((p) => ({
                  value: p.earTag,
                  label: p.earTag,
                }))}
              />
            </Form.Item>

            <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
              <DatePicker style={{ width: "100%" }} format="DD/MM/YYYY" />
            </Form.Item>

            <Form.Item name="weightKg" label="Kg" rules={[{ required: true }]}>
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item
              name="pricePerKg"
              label="Giá/kg"
              rules={[{ required: true }]}
            >
              <InputNumber style={{ width: "100%" }} min={0} />
            </Form.Item>

            <Form.Item name="staffName" label="Người thực hiện">
              <Input />
            </Form.Item>

            <Form.Item name="reason" label="Nguyên nhân">
              <Input />
            </Form.Item>

            <Form.Item name="note" label="Ghi chú">
              <Input />
            </Form.Item>
          </Form>
        </Modal>

        {/* ===== MODAL BULK ===== */}
        <Modal
          open={openBulk}
          onCancel={() => setOpenBulk(false)}
          onOk={() => bulkForm.submit()}
          width={900}
          title="Bán hàng loạt"
        >
          <Form form={bulkForm} onFinish={handleBulkSell} layout="vertical">
            <Space wrap>
              <Form.Item name="date" label="Ngày" rules={[{ required: true }]}>
                <DatePicker format="DD/MM/YYYY" />
              </Form.Item>

              <Form.Item
                name="pricePerKg"
                label="Giá/kg"
                rules={[{ required: true }]}
              >
                <InputNumber min={0} />
              </Form.Item>

              <Form.Item name="staffName" label="Người thực hiện">
                <Input />
              </Form.Item>
            </Space>

            <Form.Item label="Chọn lợn">
              <Select
                mode="multiple"
                options={fatteningActive.map((p) => ({
                  value: p.earTag,
                  label: p.earTag,
                }))}
                onChange={(values) => {
                  bulkForm.setFieldsValue({
                    items: values.map((v) => ({
                      earTag: v,
                      weightKg: null,
                    })),
                  });
                }}
              />
            </Form.Item>

            <Form.List name="items">
              {(fields) => (
                <>
                  <Table
                    dataSource={fields}
                    pagination={false}
                    rowKey="key"
                    columns={[
                      { title: "STT", render: (_, __, i) => i + 1 },
                      {
                        title: "Số tai",
                        render: (_, field) => (
                          <Form.Item name={[field.name, "earTag"]} noStyle>
                            <Input disabled />
                          </Form.Item>
                        ),
                      },
                      {
                        title: "Kg",
                        render: (_, field) => (
                          <Form.Item
                            name={[field.name, "weightKg"]}
                            rules={[{ required: true }]}
                          >
                            <InputNumber style={{ width: "100%" }} min={0} />
                          </Form.Item>
                        ),
                      },
                      {
                        title: "Thành tiền",
                        render: (_, field) => {
                          const w =
                            bulkForm.getFieldValue([
                              "items",
                              field.name,
                              "weightKg",
                            ]) || 0;

                          const p = bulkForm.getFieldValue("pricePerKg") || 0;

                          return (w * p).toLocaleString();
                        },
                      },
                    ]}
                  />

                  <div style={{ marginTop: 16, textAlign: "right" }}>
                    <b>
                      Tổng kg:{" "}
                      {(bulkForm.getFieldValue("items") || []).reduce(
                        (s, i) => s + (i?.weightKg || 0),
                        0
                      )}
                    </b>
                    <br />
                    <b>
                      Tổng tiền:{" "}
                      {(bulkForm.getFieldValue("items") || []).reduce(
                        (s, i) =>
                          s +
                          (i?.weightKg || 0) *
                            (bulkForm.getFieldValue("pricePerKg") || 0),
                        0
                      ).toLocaleString()}
                    </b>
                  </div>
                </>
              )}
            </Form.List>
          </Form>
        </Modal>

        {/* ===== MODAL DETAIL ===== */}
        <Modal
          open={openDetail}
          onCancel={() => setOpenDetail(false)}
          footer={null}
          title="Phiếu xuất bán"
        >
          {selectedBatch && (
            <>
              <p>
                Ngày:{" "}
                {selectedBatch.soldAt
                  ? dayjs(selectedBatch.soldAt).format("DD/MM/YYYY")
                  : ""}
              </p>
              <p>Người bán: {selectedBatch.staffName}</p>

              <Table
                dataSource={selectedBatch.lines}
                pagination={false}
                rowKey={(r, i) => i}
                columns={[
                  { title: "STT", render: (_, __, i) => i + 1 },
                  { title: "Số tai", dataIndex: "earTag" },
                  { title: "Kg", dataIndex: "weightKg" },
                  { title: "Giá/kg", dataIndex: "pricePerKg" },
                  {
                    title: "Thành tiền",
                    dataIndex: "totalAmount",
                    render: (v) => (v || 0).toLocaleString(),
                  },
                  { title: "Nguyên nhân", dataIndex: "reason" },
                  { title: "Ghi chú", dataIndex: "note" },
                ]}
              />
            </>
          )}
        </Modal>
      </div>
    </div>
  );
}