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

const pattern = /^[A-Za-zА-Яа-яЁё0-9\s]*$/;

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
  const defaultRules = [
    {
      pattern,
      message: 'Допустимы только буквы кириллицы, латиницы и цифры!',
    },
  ];

  return (
    <Form.Item label={label} name={name} rules={[...defaultRules, ...rules]} className={className}>
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
