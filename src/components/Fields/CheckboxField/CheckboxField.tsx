import { Checkbox, Form } from 'antd';
import React from 'react';

interface Props {
  id?: string;
  className?: string;
  label?: string;
  name?: string;
  valuePropName?: string;
  inputClassName?: string;
}

const CheckboxField: React.FC<Props> = ({ name, valuePropName, label }) => {
  return (
    <Form.Item name={name} valuePropName={valuePropName} wrapperCol={{ offset: 0, span: 16 }}>
      <Checkbox>{label}</Checkbox>
    </Form.Item>
  );
};

export default CheckboxField;
