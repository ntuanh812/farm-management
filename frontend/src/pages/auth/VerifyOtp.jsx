import { Form, Input, Button, Card, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export const VerifyOtp = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("OTP:", values.otp);
    // Giả lập xác nhận OTP thành công
    setTimeout(() => {
      alert("Mã xác nhận hợp lệ! Bạn có thể đặt lại mật khẩu.");
      navigate("/reset-password");
    }, 1000);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
      <Card style={{ width: 400 }}>
        <Title level={3}>Nhập mã xác nhận</Title>

        <Text type="secondary">
          Vui lòng nhập mã xác nhận đã gửi tới email của bạn
        </Text>

        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Mã xác nhận"
            name="otp"
            rules={[
              { required: true, message: "Vui lòng nhập mã xác nhận" },
              { len: 6, message: "Mã xác nhận phải gồm 6 số" }
            ]}
          >
            <Input placeholder="Nhập mã 6 số" maxLength={6} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Xác nhận
            </Button>
          </Form.Item>
        </Form>

        <div style={{ marginTop: 16, textAlign: "center" }}>
          <Button type="link">Gửi lại mã</Button>
        </div>
      </Card>
    </div>
  );
};