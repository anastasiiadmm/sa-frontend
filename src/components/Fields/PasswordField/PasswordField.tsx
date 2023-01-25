import { Form, Input } from 'antd';
import React from 'react';

interface Props {
  label?: string;
  name?: string;
  placeholder?: string;
}

const PasswordField: React.FC<Props> = ({ label, name, placeholder }) => {
  return (
    <Form.Item label={label} name={name} rules={[{ required: true, message: 'Введите пароль' }]}>
      <Input.Password placeholder={placeholder} />
    </Form.Item>
  );
};

export default PasswordField;
