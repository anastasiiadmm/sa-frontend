import { Form, Input } from 'antd';
import React from 'react';
import InputMask from 'react-input-mask';

interface Props {
  id?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  defaultValue?: string;
  className?: string;
  dependencies?: string[] | undefined;
  formatter?: string;
}

const PhoneField: React.FC<Props> = ({ name, placeholder, label, defaultValue }) => {
  return (
    <Form.Item name={name} label={label}>
      <InputMask mask='+7 (999) 999-99-99' autoComplete='off'>
        <Input placeholder={placeholder} />
      </InputMask>
    </Form.Item>
  );
};

export default PhoneField;
