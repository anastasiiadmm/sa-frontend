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
  bordered?: boolean;
  inputClassName?: string;
}

const DefaultField: React.FC<Props> = ({ label, name, rules, placeholder, bordered = false }) => {
  return (
    <Form.Item label={label} name={name} rules={rules}>
      <Input bordered={bordered} placeholder={placeholder} />
    </Form.Item>
  );
};

export default DefaultField;
