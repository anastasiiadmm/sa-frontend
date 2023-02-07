import { Form, Input } from 'antd';
import React from 'react';
import InputMask from 'react-input-mask';

interface Props {
  id?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  bordered?: boolean | undefined;
  className?: string;
  dependencies?: string[] | undefined;
  formatter?: string;
}

const PhoneField: React.FC<Props> = ({
  name,
  placeholder,
  label,
  defaultValue,
  bordered = false,
}) => {
  return (
    <Form.Item name={name} label={label}>
      <InputMask mask='+7 (999) 999-99-99' autoComplete='off'>
        <Input bordered={bordered} placeholder={placeholder} />
      </InputMask>
    </Form.Item>
  );
};

export default PhoneField;
