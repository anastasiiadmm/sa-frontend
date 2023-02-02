import { Button, Col, Form, Typography } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import logo from 'assets/images/logo.png';
import FormField from 'components/FormField/FormField';
import 'containers/SignIn/_signIn.scss';

const { Title } = Typography;

const Registration = () => {
  const b = bem('SignIn');
  const [form] = Form.useForm();

  const onFinish = (values: any) => {};

  return (
    <Col
      className={b('main-colum-styles')}
      xs={{ span: 13, offset: 5 }}
      md={{ span: 13, offset: 5 }}
      lg={{ span: 7, offset: 1 }}
    >
      <img src={logo} alt='logo' />
      <p className={b('subtitle')}>Добро пожаловать</p>
      <Title data-testid='sign_in_test' className={b('title')}>
        Вход в аккаунт
      </Title>

      <Form
        form={form}
        name='register'
        initialValues={{ remember: true }}
        onFinish={onFinish}
        className='login-form'
        autoComplete='off'
        layout='vertical'
      >
        <FormField
          data-testid='email_id_login'
          id='email_id'
          inputClassName={b('username')}
          label='Логин'
          name='email'
          placeholder='Логин'
        />

        <FormField
          data-testid='email_id_login'
          type='email'
          id='email_id'
          inputClassName={b('username')}
          label='Логин'
          name='email'
          placeholder='Логин'
        />

        <FormField
          data-testid='password_id'
          className='username'
          type='password'
          label='Пароль'
          name='remember'
          placeholder='Пароль'
        />

        <FormField type='checkbox' name='remember' label='Запомнить меня' valuePropName='checked' />

        <Button
          // disabled={!!commonError}
          type='primary'
          htmlType='submit'
          // loading={!!loading}
          style={{ width: '100%', borderRadius: 4 }}
          className={b('login-form-button')}
        >
          Продолжить
        </Button>
      </Form>
    </Col>
  );
};

export default Registration;
