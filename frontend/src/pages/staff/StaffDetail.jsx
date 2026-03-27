import { useMemo } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { PageHeader } from "../../components/layout/PageHeader";

import { Card, Row, Col, Tag, Button, Statistic, Divider, Image, Table } from "antd";
import { ArrowLeftOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { initialStaffData, initialTasksData, initialBarnsData } from "../../data/mockData";

const roleLabel = {
  manager: "Quản lý",
  worker: "Nhân công",
  vet: "Thú y",
};

const statusLabel = {
  active: "Đang làm",
  inactive: "Ngừng làm",
};

const statusColor = {
  active: "success",
  inactive: "default",
};

const taskStatusLabel = {
  pending: "Chờ",
  in_progress: "Đang làm",
  done: "Hoàn thành",
};

const taskStatusColor = {
  pending: "default",
  in_progress: "processing",
  done: "success",
};

export const StaffDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const staff = initialStaffData.find(item => item._id === id);
  if (!staff) return <div style={{ padding: '50px', textAlign: 'center', color: '#999' }}>
    <h2>Nhân viên không tồn tại: {id}</h2>
    <Button type="primary" onClick={() => navigate('/staff')}>
      ← Quay lại danh sách
    </Button>
  </div>;

  const getStaffImageColor = () => {
    const colors = {
      manager: "4A90E2",
      vet: "7ED321",
      worker: "F5AB35",
      default: "9B59B6",
    };
    return colors[staff.role] || colors.default;
  };

  const barnMap = useMemo(
    () => Object.fromEntries(initialBarnsData.map((item) => [item._id, item.code])),
    []
  );

  const staffTasks = useMemo(
    () => initialTasksData.filter((t) => t.assigneeId === staff._id),
    [staff._id]
  );

  const TASK_COLUMNS = [
    { title: "Công việc", dataIndex: "title", key: "title", width: 260 },
    { title: "Chuồng", dataIndex: "barnId", key: "barnId", width: 100, render: (v) => barnMap[v] || "-" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 120,
      render: (status) => <Tag color={taskStatusColor[status]}>{taskStatusLabel[status] || status}</Tag>,
    },
    { title: "Hạn chót", dataIndex: "dueDate", key: "dueDate", width: 120 },
  ];

  return (
    <div className="staff-detail">
      <PageHeader
        title={`Chi tiết ${staff.name}`}
        subtitle={`${roleLabel[staff.role] || staff.role} • ${staff.code}`}
        actions={[
          <Button key="back" icon={<ArrowLeftOutlined />} onClick={() => navigate('/staff')}>
            Danh sách nhân viên
          </Button>
        ]}
      />
      
      <Row gutter={24}>
        <Col xs={24} lg={8}>
          <Card>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <Image
                src={`https://via.placeholder.com/300x300/${getStaffImageColor()}/FFFFFF?text=${encodeURIComponent(staff.name.substring(0,2))}`}
                preview={false}
                style={{ width: '200px', height: '200px', borderRadius: '50%', objectFit: 'cover', border: '5px solid #f0f0f0' }}
              />
              <h3 style={{ margin: '10px 0', color: '#1890ff' }}>{roleLabel[staff.role] || staff.role}</h3>
            </div>
            <Divider />
            <div style={{ lineHeight: 1.8 }}>
              <p><UserOutlined /> <strong>Mã NV:</strong> {staff.code}</p>
              <p><PhoneOutlined /> <strong>SĐT:</strong> {staff.phone}</p>
              <p><strong>Email:</strong> {staff.email || "-"}</p>
              <p><strong>Địa chỉ:</strong> {staff.address || "-"}</p>
              <p><Tag color={statusColor[staff.status]}>{statusLabel[staff.status] || staff.status}</Tag></p>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Trạng thái"
                  value={statusLabel[staff.status] || staff.status}
                  valueStyle={{ color: staff.status === "active" ? "#52c41a" : "#999" }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Vai trò" value={roleLabel[staff.role] || staff.role} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Cập nhật" value={staff.updatedAt || "-"} />
              </Card>
            </Col>
          </Row>

          <Card style={{ marginTop: 24 }}>
            <h3>Nhiệm vụ gần đây</h3>
            <Table 
              columns={TASK_COLUMNS} 
              dataSource={staffTasks} 
              pagination={false}
              size="small"
              scroll={{ x: 800 }}
              style={{ marginTop: 16 }}
              rowKey="_id"
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
