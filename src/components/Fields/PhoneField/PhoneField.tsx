import { Form, Input } from 'antd';
import React from 'react';
import InputMask from 'react-input-mask';

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
}

const PhoneField: React.FC<Props> = ({
  name,
  placeholder,
  label,
  inputClassName,
  bordered = false,
  readOnly = false,
  onChange,
}) => {
  return (
    <Form.Item name={name} label={label}>
      <InputMask
        name={name}
        onChange={onChange}
        readOnly={readOnly}
        mask='+7 (999) 999-99-99'
        autoComplete='off'
      >
        <Input
          className={inputClassName}
          bordered={bordered}
          placeholder={placeholder}
          defaultValue='+7 (999) 999-99-99'
        />
      </InputMask>
    </Form.Item>
  );
};

export default PhoneField;
