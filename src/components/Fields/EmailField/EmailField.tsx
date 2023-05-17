import { Form, Input } from 'antd';
import React from 'react';

interface Rule {}

interface Props {
  id?: string;
  className?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  rules?: Rule[];
  inputClassName?: string;
  bordered?: boolean;
  readOnly?: boolean;
  onChange?: () => void;
}

const EmailField: React.FC<Props> = ({
  label,
  name,
  placeholder,
  rules,
  className,
  inputClassName,
  onChange,
  bordered = false,
  readOnly = false,
}) => {
  return (
    <Form.Item label={label} name={name} className={className} rules={rules}>
      <Input
        className={`input-styles ${inputClassName}`}
        readOnly={readOnly}
        bordered={bordered}
        placeholder={placeholder}
        onChange={onChange}
        name={name}
      />
    </Form.Item>
  );
};

export default EmailField;
