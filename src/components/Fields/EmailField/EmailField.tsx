import { Form, Input } from 'antd';
import React from 'react';

interface Props {
  id?: string;
  className?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  inputClassName?: string;
  bordered?: boolean;
}

const EmailField: React.FC<Props> = ({ label, name, placeholder, bordered = false }) => {
  return (
    <Form.Item
      label={label}
      name={name}
      rules={[
        {
          type: 'email',
          message: 'Введите валидный E-mail!',
        },
        {
          required: true,
          message: 'Введите E-mail!',
        },
      ]}
    >
      <Input bordered={bordered} placeholder={placeholder} />
    </Form.Item>
  );
};

export default EmailField;
