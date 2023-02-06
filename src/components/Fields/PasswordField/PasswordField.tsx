import { Form, Input } from 'antd';
import bem from 'easy-bem';
import React from 'react';

interface Props {
  id?: string;
  label?: string;
  name?: string;
  placeholder?: string;
  className?: string;
  dependencies?: string[] | undefined;
}

const PasswordField: React.FC<Props> = ({
  id = '',
  label,
  name,
  placeholder,
  className,
  dependencies,
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
          message: 'Введите пароль',
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
      <Input.Password placeholder={placeholder} style={{ borderRadius: '7px' }} />
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
      <Input.Password placeholder={placeholder} style={{ borderRadius: '7px' }} />
    </Form.Item>
  );
};

export default PasswordField;
