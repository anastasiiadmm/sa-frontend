import { Button, Col, Form, message, Row, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router';

import logo from 'assets/images/logo.png';
import tractor from 'assets/images/tracktor.png';
import FormField from 'components/FormField/FormField';
import { authSelector, loginUser } from 'redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { LoginMutation } from 'types';
import { userLocalStorage } from 'utils/token';
import 'containers/SignIn/_signIn.scss';

const { Title } = Typography;

const SignIn: React.FC = () => {
  const b = bem('SignIn');
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { success, loading, user } = useAppSelector(authSelector);
  const history = useNavigate();

  const onFinish = async (values: LoginMutation) => {
    try {
      await dispatch(loginUser(values)).unwrap();
    } catch (e) {
      await message.error(`${e?.detail}`);
    }
  };

  const pushToMainPage = () => {
    if (success && user && userLocalStorage()) {
      history('/');
    }
  };

  useEffect(() => {
    pushToMainPage();
  }, [user, success]);

  return (
    <Row justify='space-between' data-testid='sign-in' className={b()}>
      <Col xs={{ span: 24, offset: 0 }} md={{ span: 24, offset: 0 }} lg={{ span: 12, offset: 0 }}>
        <img src={tractor} alt='tractor' className={b('image-styles')} />
      </Col>
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
            bordered
            data-testid='email_id_login'
            type='email'
            id='email_id'
            label='Логин'
            name='username'
            placeholder='Логин'
          />

          <FormField
            bordered
            data-testid='password_id'
            type='password'
            label='Пароль'
            name='password'
            placeholder='Пароль'
          />

          <FormField
            id='remember_id'
            type='checkbox'
            label='Запомнить меня'
            valuePropName='checked'
          />

          <Button
            type='primary'
            htmlType='submit'
            loading={!!loading}
            style={{ width: '100%', borderRadius: 4 }}
            className={b('login-form-button')}
          >
            Продолжить
          </Button>
        </Form>
      </Col>
    </Row>
  );
};

export default SignIn;
