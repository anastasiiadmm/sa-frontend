import { Form, Input } from 'antd';
import React from 'react';

interface Props {
  id?: string;
  className?: string;
  label: string;
  name?: string;
  placeholder?: string;
  inputClassName?: string;
}

const EmailField: React.FC<Props> = ({ label, name, placeholder }) => {
  return (
    <Form.Item label={label} name={name} rules={[{ required: true, message: 'Введите логин' }]}>
      <Input placeholder={placeholder} />
    </Form.Item>
  );
};

export default EmailField;
