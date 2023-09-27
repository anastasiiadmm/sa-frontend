import { Form, Input } from 'antd';
import React from 'react';
import InputMask from 'react-input-mask';

interface Rule {}

interface Props {
  id?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  readOnly?: boolean;
  bordered?: boolean | undefined;
  className?: string;
  inputClassName?: string;
  dependencies?: string[] | undefined;
  formatter?: string;
  onChange?: () => void;
  rules?: Rule[];
}

const PhoneField: React.FC<Props> = ({
  name,
  placeholder,
  className,
  label,
  inputClassName,
  bordered = false,
  readOnly = false,
  onChange,
  rules,
}) => {
  return (
    <Form.Item
      data-testid='phone-field'
      name={name}
      label={label}
      className={className}
      rules={rules}
    >
      <InputMask
        name={name}
        onChange={onChange}
        readOnly={readOnly}
        mask='+7 (999) 999-99-99'
        autoComplete='off'
        data-testid='phone-field-input'
      >
        <Input className={inputClassName} bordered={bordered} placeholder={placeholder} />
      </InputMask>
    </Form.Item>
  );
};

export default PhoneField;
