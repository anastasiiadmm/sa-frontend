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
  dependencies?: string[] | undefined;
  formatter?: string;
}

const PhoneField: React.FC<Props> = ({
  name,
  placeholder,
  label,
  defaultValue,
  bordered = false,
  readOnly = false,
}) => {
  return (
    <Form.Item name={name} label={label}>
      <InputMask readOnly={readOnly} mask='+7 (999) 999-99-99' autoComplete='off'>
        <Input bordered={bordered} placeholder={placeholder} defaultValue='+7 (999) 999-99-99' />
      </InputMask>
    </Form.Item>
  );
};

export default PhoneField;
