import { Form, Input } from 'antd';
import React from 'react';

interface Rule {}

interface Props {
  id?: string;
  className?: string;
  label?: string;
  name?: string;
  rules?: Rule[];
  placeholder?: string;
  inputClassName?: string;
}

const DefaultField: React.FC<Props> = ({ label, name, rules, placeholder }) => {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <Input placeholder={placeholder} />
    </Form.Item>
  );
};

export default DefaultField;
