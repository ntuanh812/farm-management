import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
  Table,
  Button,
  Space,
  Modal,
  Form,
  Select,
  DatePicker,
  InputNumber,
  Input,
} from "antd";
import dayjs from "dayjs";
import weekOfYear from "dayjs/plugin/weekOfYear";

dayjs.extend(weekOfYear);

const { Option } = Select;
const { RangePicker } = DatePicker;

// ===== DATA =====
const pigList = [
  { code: "DR-2601", type: "Lợn thịt" },
  { code: "DR-2602", type: "Lợn nái" },
  { code: "DR-2603", type: "Lợn con" },
];

const staffs = ["Nguyễn Văn A", "Trần Văn B"];

// ===== COMPONENT =====
export default function PigSell() {
  const [data, setData] = useState([]);

  const [range, setRange] = useState([]);
  const [filterType, setFilterType] = useState("day");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMultiOpen, setIsMultiOpen] = useState(false);

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailData, setDetailData] = useState(null);

  const [selectedPigs, setSelectedPigs] = useState([]);

  const [form] = Form.useForm();
  const [multiForm] = Form.useForm();

  const formatDate = (d) => (d ? d.format("DD/MM/YYYY") : "");

  // ===== FILTER DATE =====
  const isInRange = (dateStr) => {
    if (!range || range.length !== 2) return true;
    const d = dayjs(dateStr, "DD/MM/YYYY");
    return d.isAfter(range[0].startOf("day")) && d.isBefore(range[1].endOf("day"));
  };

    const filterLabel = {
        day: "ngày",
        week: "tuần",
        month: "tháng",
    };
  // ===== GROUP DATA =====
  const groupData = () => {
    const map = {};

    data
      .filter((d) => isInRange(d.date))
      .forEach((d) => {
        const date = dayjs(d.date, "DD/MM/YYYY");

        let key = "";
        if (filterType === "day") key = date.format("DD/MM/YYYY");
        if (filterType === "week") key = `Tuần ${date.week()} - ${date.year()}`;
        if (filterType === "month") key = date.format("MM/YYYY");

        if (!map[key]) {
          map[key] = {
            key,
            date: key,
            count: 0,
            weight: 0,
            avg: 0,
            total: 0,
            items: [],
          };
        }

        map[key].count += d.count;
        map[key].weight += d.weight;
        map[key].total += d.total;
        map[key].items = [...map[key].items, ...d.items];
        map[key].avg = map[key].total / map[key].count;
      });

    return Object.values(map);
  };

  // ===== STATS =====
  const totalCount = data.reduce((s, d) => s + d.count, 0);
  const totalWeight = data.reduce((s, d) => s + d.weight, 0);
  const totalValue = data.reduce((s, d) => s + d.total, 0);

  // ===== SELL 1 =====
  const handleSell = () => {
    form.validateFields().then((v) => {
      const pig = pigList.find((p) => p.code === v.code);

      const item = {
        code: v.code,
        type: pig?.type || "",
        weight: v.weight,
        price: v.price,
        total: v.weight * v.price,
        reason: v.reason,
        person: v.person,
      };

      const newData = {
        key: Date.now(),
        date: formatDate(v.date),
        count: 1,
        weight: v.weight,
        avg: v.price,
        total: item.total,
        items: [item],
      };

      setData([newData, ...data]);
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  // ===== SELL MULTI =====
  const handleMultiSell = () => {
    multiForm.validateFields().then((v) => {
      const items = selectedPigs.map((p) => {
        const pig = pigList.find((x) => x.code === p.code);

        return {
          code: p.code,
          type: pig?.type || "",
          weight: p.weight || 0,
          price: v.price,
          total: (p.weight || 0) * v.price,
          reason: v.reason,
          person: v.person,
        };
      });

      const totalWeight = items.reduce((s, i) => s + i.weight, 0);
      const totalPrice = items.reduce((s, i) => s + i.total, 0);

      const newData = {
        key: Date.now(),
        date: formatDate(v.date),
        count: items.length,
        weight: totalWeight,
        avg: v.price,
        total: totalPrice,
        items,
      };

      setData([newData, ...data]);
      setIsMultiOpen(false);
      setSelectedPigs([]);
      multiForm.resetFields();
    });
  };

  // ===== TABLE =====
  const columns = [
    { title: "STT", render: (_, __, i) => i + 1 },
    { title: "Ngày / Nhóm", dataIndex: "date" },
    { title: "Số con", dataIndex: "count" },
    { title: "Tổng kg", dataIndex: "weight" },
    { title: "Giá TB", dataIndex: "avg" },
    { title: "Thành tiền", dataIndex: "total" },
    {
      title: "Chi tiết",
      render: (_, record) => (
        <Button
          type="link"
          onClick={() => {
            setDetailData(record);
            setIsDetailOpen(true);
          }}
        >
          👁
        </Button>
      ),
    },
  ];

  const detailColumns = [
    { title: "STT", render: (_, __, i) => i + 1 },
    { title: "Số tai", dataIndex: "code" },
    { title: "Loại", dataIndex: "type" },
    { title: "Kg", dataIndex: "weight" },
    { title: "Giá", dataIndex: "price" },
    { title: "Thành tiền", dataIndex: "total" },
    { title: "Nguyên nhân", dataIndex: "reason" },
    { title: "Người lập phiếu", dataIndex: "person" },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* ===== CARDS ===== */}
      <Row gutter={16}>
        <Col span={8}><Card><h3>Tổng số bán</h3><h1>{totalCount}</h1></Card></Col>
        <Col span={8}><Card><h3>Tổng kg</h3><h1>{totalWeight}</h1></Card></Col>
        <Col span={8}><Card><h3>Tổng tiền</h3><h1>{totalValue}</h1></Card></Col>
      </Row>

      {/* ===== FILTER ===== */}
      <Card style={{ marginTop: 20 }}>
        <Space>
          <RangePicker onChange={setRange} />

          <Select value={filterType} onChange={setFilterType}>
            <Option value="day">Ngày</Option>
            <Option value="week">Tuần</Option>
            <Option value="month">Tháng</Option>
          </Select>

          <Button type="primary" onClick={() => setIsModalOpen(true)}>
            Bán lợn
          </Button>

          <Button onClick={() => setIsMultiOpen(true)}>
            Bán hàng loạt
          </Button>
        </Space>
      </Card>

      {/* ===== TABLE ===== */}
      <Card style={{ marginTop: 20 }}>
        <h3>
            Tổng hợp theo {filterLabel[filterType]}{" "}
            {range?.length === 2 &&
                `(${range[0].format("DD/MM/YYYY")} - ${range[1].format("DD/MM/YYYY")})`}
        </h3>

        <Table columns={columns} dataSource={groupData()} rowKey="key" />
      </Card>

      {/* ===== MODAL BÁN 1 ===== */}
      <Modal open={isModalOpen} title="Bán lợn" onCancel={()=>setIsModalOpen(false)} onOk={handleSell}>
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Số tai" rules={[{ required: true }]}>
            <Select>{pigList.map(p => <Option key={p.code}>{p.code}</Option>)}</Select>
          </Form.Item>

          <Form.Item name="date" label="Ngày bán" rules={[{ required: true }]}>
            <DatePicker style={{width:"100%"}}/>
          </Form.Item>

          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <InputNumber style={{width:"100%"}}/>
          </Form.Item>

          <Form.Item name="weight" label="Kg" rules={[{ required: true }]}>
            <InputNumber style={{width:"100%"}}/>
          </Form.Item>

          <Form.Item name="person" label="Người bán">
            <Select>{staffs.map(s=> <Option key={s}>{s}</Option>)}</Select>
          </Form.Item>

          <Form.Item name="reason" label="Nguyên nhân">
            <Input />
          </Form.Item>
        </Form>
      </Modal>

      {/* ===== MODAL BÁN NHIỀU ===== */}
      <Modal open={isMultiOpen} title="Bán hàng loạt" onCancel={()=>setIsMultiOpen(false)} onOk={handleMultiSell} width={700}>
        <Form form={multiForm} layout="vertical">

          <Form.Item name="codes" label="Số tai" rules={[{ required: true }]}>
            <Select
              mode="multiple"
              onChange={(values)=>{
                setSelectedPigs(values.map(code=>({code, weight:0})));
              }}
            >
              {pigList.map(p => <Option key={p.code}>{p.code}</Option>)}
            </Select>
          </Form.Item>

          {selectedPigs.length > 0 && (
            <Table
              dataSource={selectedPigs}
              pagination={false}
              rowKey="code"
              columns={[
                { title: "Số tai", dataIndex: "code" },
                {
                  title: "Kg",
                  render: (_, r, i) => (
                    <InputNumber
                      style={{width:"100%"}}
                      onChange={(val)=>{
                        const list = [...selectedPigs];
                        list[i].weight = val;
                        setSelectedPigs(list);
                      }}
                    />
                  )
                }
              ]}
            />
          )}

          <Form.Item name="date" label="Ngày bán" rules={[{ required: true }]}>
            <DatePicker style={{width:"100%"}}/>
          </Form.Item>

          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <InputNumber style={{width:"100%"}}/>
          </Form.Item>

          <Form.Item name="person" label="Người bán">
            <Select>{staffs.map(s=> <Option key={s}>{s}</Option>)}</Select>
          </Form.Item>

          <Form.Item name="reason" label="Nguyên nhân">
            <Input />
          </Form.Item>

        </Form>
      </Modal>

      {/* ===== MODAL CHI TIẾT ===== */}
      <Modal open={isDetailOpen} title="Phiếu xuất" onCancel={()=>setIsDetailOpen(false)} footer={[<Button onClick={()=>setIsDetailOpen(false)}>Đóng</Button>]} width={800}>
        {detailData && (
          <>
            <p><b>Ngày:</b> {detailData.date}</p>
            <p><b>Tổng giá trị:</b> {detailData.total}</p>

            <Table
              columns={detailColumns}
              dataSource={detailData.items}
              pagination={false}
              rowKey="code"
            />
          </>
        )}
      </Modal>
    </div>
  );
}