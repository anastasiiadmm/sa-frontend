import { Form, Input } from 'antd';
import bem from 'easy-bem';
import React from 'react';

interface Props {
  id?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  bordered?: boolean;
  readOnly?: boolean;
  required?: boolean;
  inputClassName?: string;
  dependencies?: string[] | undefined;
  onChange?: () => void;
}

const PasswordField: React.FC<Props> = ({
  id = '',
  label,
  name,
  placeholder,
  className,
  dependencies,
  inputClassName,
  bordered = false,
  readOnly = false,
  onChange,
  required = true,
}) => {
  const b = bem('PasswordField');

  return name === 'confirm_password' ? (
    <Form.Item
      hasFeedback
      className={className || b()}
      label={label}
      name={name}
      dependencies={dependencies}
      rules={[
        {
          required: true,
          message: 'Подтвердите пароль',
        },
        ({ getFieldValue }) => ({
          validator(_, value) {
            if (!value || getFieldValue('password') === value) {
              return Promise.resolve();
            }
            return Promise.reject(new Error('Пароли не совпадают'));
          },
        }),
      ]}
    >
      <Input.Password
        readOnly={readOnly}
        bordered={bordered}
        placeholder={placeholder}
        className={`input-styles ${inputClassName}`}
        style={{ borderRadius: '7px' }}
        autoComplete='on'
        onChange={onChange}
        name={name}
      />
    </Form.Item>
  ) : !required ? (
    <Form.Item id={id} className={className || b()} label={label} name={name} hasFeedback>
      <Input.Password
        readOnly={readOnly}
        bordered={bordered}
        placeholder={placeholder}
        className={`input-styles ${inputClassName}`}
        style={{ borderRadius: '7px' }}
        autoComplete='on'
        onChange={onChange}
        name={name}
      />
    </Form.Item>
  ) : (
    <Form.Item
      id={id}
      className={className || b()}
      label={label}
      name={name}
      hasFeedback
      rules={[
        {
          required: true,
          message: 'Подтвердите пароль',
        },
        {
          min: 8,
          message: 'Пароль должен содержать минимум 8 символов',
        },
        {
          pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%_*?&])[A-Za-z\d@$!%_*?&]{8,}$/,
          message:
            'Пароль должен содержать минимум одну строчную букву, прописную букву, цифру и специальный символ',
        },
      ]}
    >
      <Input.Password
        readOnly={readOnly}
        bordered={bordered}
        placeholder={placeholder}
        className={`input-styles ${inputClassName}`}
        style={{ borderRadius: '7px' }}
        autoComplete='on'
        onChange={onChange}
        name={name}
      />
    </Form.Item>
  );
};

export default PasswordField;
