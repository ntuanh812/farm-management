import { Form, Input, Button, Card, Typography } from "antd";
import { Link, useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

export const ResetPassword = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log("Form data:", values);
    // Giả lập đặt lại mật khẩu thành công
    setTimeout(() => {
      alert("Mật khẩu đã được đặt lại thành công!");
      navigate("/login");
    }, 1000);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", marginTop: 100 }}>
      <Card style={{ width: 400 }}>
        <Title level={3}>Đặt lại mật khẩu</Title>
        <Text type="secondary">
          Nhập mật khẩu mới cho tài khoản
        </Text>

        <Form
          layout="vertical"
          onFinish={onFinish}
          style={{ marginTop: 20 }}
        >
          <Form.Item
            label="Mật khẩu mới"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu" },
              { min: 6, message: "Mật khẩu phải ít nhất 6 ký tự" }
            ]}
          >
            <Input.Password placeholder="Nhập mật khẩu mới" />
          </Form.Item>

          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp")
                  );
                }
              })
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              Đặt lại mật khẩu
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};