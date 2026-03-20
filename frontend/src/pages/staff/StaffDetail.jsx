import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader } from "../../components/layout/PageHeader";

import { Card, Row, Col, Tag, Button, Statistic, Divider, Image, Table, Progress } from 'antd';
import { ArrowLeftOutlined, UserOutlined, PhoneOutlined, CalendarOutlined } from '@ant-design/icons';

const initialStaffData = [
  {id: "NV001", name: "Nguyễn Văn A", roleName: "Quản lý", department: "Hành chính", phone: "0901234567", hireDate: "2023-01-15", status: "active", age: 35, gender: "Nam"},
  {id: "NV002", name: "Trần Thị B", roleName: "Thú y", department: "Chăn nuôi", phone: "0902345678", hireDate: "2023-06-20", status: "active", age: 28, gender: "Nữ"},
  {id: "NV003", name: "Lê Văn C", roleName: "Công nhân", department: "Chăn nuôi", phone: "0903456789", hireDate: "2024-01-10", status: "active", age: 30, gender: "Nam"},
  {id: "NV004", name: "Phạm Thị D", roleName: "Kế toán", department: "Tài chính", phone: "0904567890", hireDate: "2023-03-01", status: "active", age: 32, gender: "Nữ"},
  {id: "NV005", name: "Hoàng Văn E", roleName: "Kỹ thuật", department: "Bảo trì", phone: "0905678901", hireDate: "2023-11-15", status: "nghỉ phép", age: 29, gender: "Nam"},
  {id: "NV006", name: "Vũ Thị F", roleName: "Nhân sự", department: "Hành chính", phone: "0906789012", hireDate: "2024-02-01", status: "active", age: 27, gender: "Nữ"},
  {id: "NV007", name: "Đặng Văn G", roleName: "Công nhân", department: "Chăn nuôi", phone: "0907890123", hireDate: "2024-04-10", status: "active", age: 34, gender: "Nam"},
  {id: "NV008", name: "Bùi Thị H", roleName: "Thú y", department: "Chăn nuôi", phone: "0908901234", hireDate: "2023-09-05", status: "active", age: 31, gender: "Nữ"},
  {id: "NV009", name: "Ngô Văn I", roleName: "Quản lý", department: "Chăn nuôi", phone: "0909012345", hireDate: "2022-12-01", status: "active", age: 40, gender: "Nam"},
  {id: "NV010", name: "Lý Thị K", roleName: "Vệ sinh", department: "Bảo trì", phone: "0910123456", hireDate: "2024-05-15", status: "thử việc", age: 25, gender: "Nữ"}
];

const TASKS_DATA = [
  {key: '1', task: 'Kiểm tra sức khỏe bò sữa', barn: 'A1', status: 'Hoàn thành', date: '2024-07-20'},
  {key: '2', task: 'Vệ sinh chuồng lợn', barn: 'B2', status: 'Đang làm', date: '2024-07-22'},
  {key: '3', task: 'Báo cáo tháng', barn: 'N/A', status: 'Hoàn thành', date: '2024-07-25'},
];

const TASK_COLUMNS = [
  { title: 'Nhiệm vụ', dataIndex: 'task', key: 'task', width: 200 },
  { title: 'Chuồng', dataIndex: 'barn', key: 'barn', width: 100 },
  { title: 'Trạng thái', dataIndex: 'status', key: 'status', render: status => <Tag color={status === 'Hoàn thành' ? 'success' : 'processing'}>{status}</Tag>, width: 120 },
  { title: 'Ngày', dataIndex: 'date', key: 'date', width: 120 }
];

export const StaffDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const staff = initialStaffData.find(item => item.id === id);
  if (!staff) return <div style={{ padding: '50px', textAlign: 'center', color: '#999' }}>
    <h2>Nhân viên không tồn tại: {id}</h2>
    <Button type="primary" onClick={() => navigate('/staff')}>
      ← Quay lại danh sách
    </Button>
  </div>;

  const getStaffImageColor = () => {
    const colors = {
      'manager': '4A90E2',
      'veterinarian': '7ED321',
      'farmer': 'F5AB35',
      'default': '9B59B6'
    };
    return colors[staff.roleName.includes('Quản lý') ? 'manager' : 
           staff.roleName.includes('Thú y') ? 'veterinarian' : 
           staff.roleName.includes('Công nhân') ? 'farmer' : 'default'];
  };

  return (
    <div className="staff-detail">
      <PageHeader
        title={`Chi tiết ${staff.name}`}
        subtitle={staff.roleName}
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
              <h3 style={{ margin: '10px 0', color: '#1890ff' }}>{staff.roleName}</h3>
            </div>
            <Divider />
            <div style={{ lineHeight: 1.8 }}>
              <p><UserOutlined /> <strong>Mã NV:</strong> {staff.id}</p>
              <p><CalendarOutlined /> <strong>Tuổi:</strong> {staff.age} tuổi ({staff.gender})</p>
              <p><PhoneOutlined /> <strong>SĐT:</strong> {staff.phone}</p>
              <p><CalendarOutlined /> <strong>Ngày vào:</strong> {staff.hireDate}</p>
              <p><Tag color={staff.status === 'active' ? 'success' : 'warning'}>{staff.status}</Tag></p>
            </div>
          </Card>
        </Col>
        
        <Col xs={24} lg={16}>
          <Row gutter={[16, 16]}>
            <Col span={8}>
              <Card>
                <Statistic
                  title="Trạng thái"
                  value={staff.status === 'active' ? 'Hoạt động' : 'Nghỉ phép'}
                  valueStyle={{ color: staff.status === 'active' ? '#52c41a' : '#faad14' }}
                />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Phòng ban" value={staff.department} />
              </Card>
            </Col>
            <Col span={8}>
              <Card>
                <Statistic title="Ngày vào" value={staff.hireDate} />
              </Card>
            </Col>
          </Row>

          <Card style={{ marginTop: 24 }}>
            <h3>Nhiệm vụ gần đây</h3>
            <Table 
              columns={TASK_COLUMNS} 
              dataSource={TASKS_DATA} 
              pagination={false}
              size="small"
              scroll={{ x: 800 }}
              style={{ marginTop: 16 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};
