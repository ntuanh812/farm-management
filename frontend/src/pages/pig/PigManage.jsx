import React, { useState } from "react";
import {
  Card,
  Row,
  Col,
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

const { Option } = Select;

// ===== LOẠI =====
const typeMap = {
  sow: { label: "Lợn nái", color: "green" },
  piglet: { label: "Lợn con", color: "gold" },
  fattening: { label: "Lợn thịt", color: "blue" },
  boar: { label: "Lợn đực", color: "red" },
};

// ===== TRẠNG THÁI =====
const statusList = [
  "Hậu bị",
  "Đã phối",
  "Đẻ con",
  "Cai sữa",
  "Động dục lại",
  "Sảy thai",
  "Bán loại",
  "Chết",
];

const statusColor = {
  "Hậu bị": "blue",
  "Đã phối": "purple",
  "Đẻ con": "green",
  "Cai sữa": "cyan",
  "Động dục lại": "orange",
  "Sảy thai": "red",
  "Bán loại": "volcano",
  "Chết": "black",
};

// ===== CHUỒNG =====
const pens = ["Chuồng A", "Chuồng B", "Chuồng C"];

// ===== NHÂN VIÊN =====
const staffs = [
  "Nguyễn Văn A",
  "Trần Văn B",
  "Lê Thị C",
];

// ===== DATA =====
const initialData = Array.from({ length: 10 }).map((_, i) => ({
  key: i,
  code: "DR-26" + (400 + i),
  type: ["sow", "piglet", "fattening", "boar"][i % 4],
  status: statusList[i % statusList.length],
  date: "06/02/2026",
  age: 30 + i,
  weight: 80 + i,
  pen: pens[i % pens.length],
}));

export default function PigManagement() {
  const [dataSource, setDataSource] = useState(initialData);

  const [keyword, setKeyword] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [penFilter, setPenFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSellModalOpen, setIsSellModalOpen] = useState(false);
  const [isDeadModalOpen, setIsDeadModalOpen] = useState(false);

  const [form] = Form.useForm();
  const [sellForm] = Form.useForm();
  const [deadForm] = Form.useForm();

  const sellReasons = ["Già yếu", "Bệnh", "Không đạt", "Thải loại"];
  const deadReasons = ["Bệnh", "Tai nạn", "Dịch bệnh", "Khác"];

  const formatDate = (d) => (d ? d.format("DD/MM/YYYY") : "");

  // ===== FILTER =====
  const filteredData = dataSource.filter((item) => {
    return (
      item.code.toLowerCase().includes(keyword.toLowerCase()) &&
      (typeFilter === "all" || item.type === typeFilter) &&
      (penFilter === "all" || item.pen === penFilter) &&
      (statusFilter === "all" || item.status === statusFilter)
    );
  });

  // ===== TABLE =====
  const columns = [
    { title: "Số tai", dataIndex: "code" },
    {
      title: "Loại",
      dataIndex: "type",
      render: (t) => <Tag color={typeMap[t].color}>{typeMap[t].label}</Tag>,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render: (s) => <Tag color={statusColor[s]}>{s}</Tag>,
    },
    { title: "Ngày nhập", dataIndex: "date" },
    { title: "Tuổi", dataIndex: "age" },
    { title: "Trọng lượng", dataIndex: "weight" },
    { title: "Chuồng", dataIndex: "pen", render: (p) => <Tag>{p}</Tag> },
  ];

  // ===== ADD =====
  const handleAdd = () => {
    form.validateFields().then((values) => {
      setDataSource([
        {
          key: Date.now(),
          date: new Date().toLocaleDateString(),
          ...values,
        },
        ...dataSource,
      ]);
      setIsModalOpen(false);
      form.resetFields();
    });
  };

  // ===== SELL =====
  const handleSell = () => {
    sellForm.validateFields().then((values) => {
      setDataSource(
        dataSource.map((pig) =>
          pig.code === values.code
            ? {
                ...pig,
                status: "Bán loại",
                weight: values.weight || pig.weight,
                sellInfo: {
                  date: formatDate(values.date),
                  reason: values.reason,
                  price: values.price,
                  person: values.person,
                  note: values.note,
                },
              }
            : pig
        )
      );
      setIsSellModalOpen(false);
      sellForm.resetFields();
    });
  };

  // ===== DEAD =====
  const handleDead = () => {
    deadForm.validateFields().then((values) => {
      setDataSource(
        dataSource.map((pig) =>
          pig.code === values.code
            ? {
                ...pig,
                status: "Chết",
                deadInfo: {
                  date: formatDate(values.date),
                  reason: values.reason,
                  person: values.person,
                  note: values.note,
                },
              }
            : pig
        )
      );
      setIsDeadModalOpen(false);
      deadForm.resetFields();
    });
  };

  return (
    <div style={{ padding: 20 }}>
      {/* THỐNG KÊ */}
      <Row gutter={16}>
        <Col span={8}><Card><h3>Tổng đàn</h3><h1>{dataSource.length}</h1></Card></Col>
        <Col span={8}><Card><h3>Lợn nái</h3><h1>{dataSource.filter(p=>p.type==="sow").length}</h1></Card></Col>
        <Col span={8}><Card><h3>Lợn thịt</h3><h1>{dataSource.filter(p=>p.type==="fattening").length}</h1></Card></Col>
      </Row>

      {/* FILTER */}
      <Card style={{ marginTop: 20 }}>
        <Space wrap>
          <Input placeholder="Tìm số tai" value={keyword} onChange={(e)=>setKeyword(e.target.value)} />

          <Select value={typeFilter} onChange={setTypeFilter}>
            <Option value="all">Tất cả</Option>
            <Option value="sow">Lợn nái</Option>
            <Option value="piglet">Lợn con</Option>
            <Option value="fattening">Lợn thịt</Option>
            <Option value="boar">Lợn đực</Option>
          </Select>

          <Select value={penFilter} onChange={setPenFilter}>
            <Option value="all">Tất cả chuồng</Option>
            {pens.map(p=> <Option key={p}>{p}</Option>)}
          </Select>

          <Select value={statusFilter} onChange={setStatusFilter}>
            <Option value="all">Tất cả trạng thái</Option>
            {statusList.map(s=> <Option key={s}>{s}</Option>)}
          </Select>

          <Button onClick={()=>{setKeyword("");setTypeFilter("all");setPenFilter("all");setStatusFilter("all");}}>
            Reset
          </Button>

          <Button type="primary" onClick={()=>setIsModalOpen(true)}>Thêm mới</Button>
          <Button danger onClick={()=>setIsSellModalOpen(true)}>Bán loại</Button>
          <Button danger onClick={()=>setIsDeadModalOpen(true)}>Chết hủy</Button>
        </Space>
      </Card>

      {/* TABLE */}
      <Card style={{ marginTop: 20 }}>
        <Table columns={columns} dataSource={filteredData} />
      </Card>

      {/* ADD */}
      <Modal open={isModalOpen} onOk={handleAdd} onCancel={()=>setIsModalOpen(false)} title="Thêm lợn">
        <Form form={form} layout="vertical">
          <Form.Item name="code" label="Số tai" rules={[{required:true}]}><Input/></Form.Item>
          <Form.Item name="type" label="Loại" rules={[{required:true}]}>
            <Select>{Object.keys(typeMap).map(k=><Option key={k} value={k}>{typeMap[k].label}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="status" label="Trạng thái" rules={[{required:true}]}>
            <Select>{statusList.map(s=><Option key={s}>{s}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="pen" label="Chuồng" rules={[{required:true}]}>
            <Select>{pens.map(p=><Option key={p}>{p}</Option>)}</Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* SELL */}
      <Modal open={isSellModalOpen} title="Bán loại lợn" onCancel={()=>setIsSellModalOpen(false)} onOk={handleSell}>
        <Form form={sellForm} layout="vertical">
          <Form.Item name="code" label="Số tai" rules={[{required:true}]}>
            <Select>{dataSource.map(p=><Option key={p.code}>{p.code}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="date" label="Ngày" rules={[{required:true}]}>
            <DatePicker style={{width:"100%"}}/>
          </Form.Item>
          <Form.Item name="reason" label="Nguyên nhân" rules={[{required:true}]}>
            <Select>{sellReasons.map(r=><Option key={r}>{r}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="price" label="Giá tiền">
            <InputNumber style={{width:"100%"}}/>
          </Form.Item>
          <Form.Item name="weight" label="Trọng lượng">
            <InputNumber style={{width:"100%"}}/>
          </Form.Item>
          <Form.Item name="person" label="Người thực hiện" rules={[{required:true}]}>
            <Select placeholder="Chọn người">
              {staffs.map(s=> <Option key={s}>{s}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea/>
          </Form.Item>
        </Form>
      </Modal>

      {/* DEAD */}
      <Modal open={isDeadModalOpen} title="Chết hủy" onCancel={()=>setIsDeadModalOpen(false)} onOk={handleDead}>
        <Form form={deadForm} layout="vertical">
          <Form.Item name="code" label="Số tai" rules={[{required:true}]}>
            <Select>{dataSource.map(p=><Option key={p.code}>{p.code}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="date" label="Ngày" rules={[{required:true}]}>
            <DatePicker style={{width:"100%"}}/>
          </Form.Item>
          <Form.Item name="reason" label="Nguyên nhân" rules={[{required:true}]}>
            <Select>{deadReasons.map(r=><Option key={r}>{r}</Option>)}</Select>
          </Form.Item>
          <Form.Item name="weight" label="Trọng lượng">
            <InputNumber style={{width:"100%"}}/>
          </Form.Item>
          <Form.Item name="person" label="Người thực hiện" rules={[{required:true}]}>
            <Select placeholder="Chọn người">
              {staffs.map(s=> <Option key={s}>{s}</Option>)}
            </Select>
          </Form.Item>
          <Form.Item name="note" label="Ghi chú">
            <Input.TextArea/>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}