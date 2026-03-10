import { Form, Input, Button, Card, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export const ForgotPassword = () => {
    const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Email:", values.email);

    // Giả lập gửi email thành công
    setTimeout(() => {
      alert("Mã xác nhận đã được gửi tới email của bạn");
      navigate("/verify-otp");
    }, 1000);
  };

  return (
    <div className="page-auth">
      <Card style={{ width: 400, margin: "100px auto" }}>
        <Title level={3}>Quên mật khẩu</Title>
        <Text type="secondary">
          Nhập email để nhận mã xác nhận đặt lại mật khẩu
        </Text>

        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" }
            ]}
          >
            <Input placeholder="you@example.com" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Gửi mã xác nhận
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 16 }}>
          <Link to="/login">Quay lại đăng nhập</Link>
        </div>
      </Card>
    </div>
  );
};