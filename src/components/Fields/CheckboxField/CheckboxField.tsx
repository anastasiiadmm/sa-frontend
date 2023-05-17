import { Checkbox, Form } from 'antd';
import React from 'react';

interface Props {
  id?: string;
  className?: string;
  label?: string;
  name?: string;
  valuePropName?: string;
  inputClassName?: string;
  checked?: boolean;
  onChange?: () => void;
}

const CheckboxField: React.FC<Props> = ({ id, name, valuePropName, label, onChange, checked }) => {
  return (
    <Form.Item name={name} valuePropName={valuePropName} wrapperCol={{ offset: 0, span: 16 }}>
      <Checkbox checked={checked} onChange={onChange} id={id}>
        {label}
      </Checkbox>
    </Form.Item>
  );
};

export default CheckboxField;
