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
  readOnly?: boolean;
  onChange?: () => void;
}

const EmailField: React.FC<Props> = ({
  label,
  name,
  placeholder,
  className,
  inputClassName,
  onChange,
  bordered = false,
  readOnly = false,
}) => {
  return (
    <Form.Item label={label} name={name} className={className}>
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
