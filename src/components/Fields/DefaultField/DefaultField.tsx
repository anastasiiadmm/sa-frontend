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
  readOnly?: boolean;
  inputClassName?: string;
  onChange?: () => void;
}

const DefaultField: React.FC<Props> = ({
  label,
  name,
  rules = [],
  placeholder,
  className,
  inputClassName,
  bordered = false,
  readOnly = false,
  onChange,
}) => {
  return (
    <Form.Item label={label} name={name} rules={[...rules]} className={className}>
      <Input
        name={name}
        readOnly={readOnly}
        bordered={bordered}
        placeholder={placeholder}
        className={`input-styles ${inputClassName}`}
        onChange={onChange}
      />
    </Form.Item>
  );
};

export default DefaultField;
