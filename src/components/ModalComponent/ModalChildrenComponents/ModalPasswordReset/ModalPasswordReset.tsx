import { Button, Form } from 'antd';
import bem from 'easy-bem';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import AlertComponent from 'components/AlertComponent/AlertComponent';
import FormField from 'components/FormField/FormField';
import { authSelector, resetUserPasswordSendEmail } from 'redux/auth/authSlice';
import { AppDispatch } from 'redux/hooks';
import { ResetEmail } from 'types/types';
import 'containers/SignIn/_signIn.scss';

const ModalPasswordReset: React.FC = () => {
  const b = bem('SignIn');
  const [form] = Form.useForm();
  const dispatch = useDispatch<AppDispatch>();
  const { loading, success, errors } = useSelector(authSelector);
  const [state, setState] = useState<ResetEmail | null>(null);

  const onFinish = (value: ResetEmail) => {
    setState(value);
    dispatch(resetUserPasswordSendEmail(value));
  };

  const successSend = (
    <>
      <AlertComponent
        message={`Временный пароль был выслан на ${state?.email}`}
        type='info'
        showIcon
      />
      <Button
        className={b('login-form-button')}
        type='primary'
        style={{ width: '100%', borderRadius: 4 }}
      >
        Закрыть
      </Button>
    </>
  );

  const errorSend = (
    <>
      <AlertComponent message='Такой email не найден' type='error' showIcon />
      <Form
        style={{ marginTop: 20 }}
        initialValues={{ email: state?.email }}
        onFinish={onFinish}
        className='login-form'
        autoComplete='off'
        layout='vertical'
      >
        <FormField
          data-testid='email_id_login'
          type='email'
          id='email_id'
          name='email'
          label='Ваш email'
        />
        <Button
          loading={!!loading}
          className={b('login-form-button')}
          type='primary'
          htmlType='submit'
          style={{ width: '100%', borderRadius: 4 }}
        >
          Продолжить
        </Button>
      </Form>
    </>
  );

  return success ? (
    successSend
  ) : errors ? (
    errorSend
  ) : (
    <>
      <AlertComponent
        message='Для восстановления пароля к вашей учетной записи введите ваш E-mail'
        type='info'
        showIcon
      />
      <Form
        style={{ marginTop: 20 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        className='login-form'
        autoComplete='off'
        layout='vertical'
      >
        <FormField
          data-testid='email_id_login'
          type='email'
          id='email_id'
          name='email'
          label='Ваш email'
        />
        <Button
          loading={!!loading}
          className={b('login-form-button')}
          type='primary'
          htmlType='submit'
          style={{ width: '100%', borderRadius: 4 }}
        >
          Продолжить
        </Button>
      </Form>
    </>
  );
};

export default ModalPasswordReset;
