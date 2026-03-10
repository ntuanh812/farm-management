import { Form, Input, Button } from "antd";
import { Link, useNavigate } from "react-router-dom";

export const Login = () => {
  const navigate = useNavigate();

  const onFinish = (values) => {
    console.log(values);
    // Giả lập đăng nhập thành công
    setTimeout(() => {
      alert("Đăng nhập thành công!");
      navigate("/dashboard");
    }, 1000);
  };

  return (
    <Form
      name="login"
      layout="vertical"
      style={{ maxWidth: 300, margin: "100px auto" }}
      onFinish={onFinish}
    >
      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Vui lòng nhập email!" },
          { type: "email", message: "Email không hợp lệ!" }
        ]}
      >
        <Input placeholder="Nhập email" />
      </Form.Item>

      <Form.Item
        label="Mật khẩu"
        name="password"
        rules={[
          { required: true, message: "Vui lòng nhập mật khẩu!" }
        ]}
      >
        <Input.Password placeholder="Nhập mật khẩu" />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          Đăng nhập
        </Button>
      </Form.Item>
      <Form.Item>
        <Link to="/forgot-password">Quên mật khẩu?</Link>
      </Form.Item>
    </Form>
  );
};

