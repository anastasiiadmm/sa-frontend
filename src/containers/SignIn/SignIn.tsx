import { Button, Col, Form, Row, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

import logo from 'assets/images/logo.png';
import tractor from 'assets/images/tracktor.png';
import FormField from 'components/FormField/FormField';
import ModalPasswordReset from 'components/ModalComponent/ModalChildrenComponents/ModalPasswordReset/ModalPasswordReset';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import { authSelector } from 'redux/auth/authSlice';
import 'containers/SignIn/_signIn.scss';

const { Title } = Typography;

const SignIn: React.FC = () => {
  const b = bem('SignIn');
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const { loading, commonError, user, success } = useSelector(authSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = (values: any) => {
    console.log('Received values of form: ', values);
  };

  return (
    <>
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

            <FormField
              type='checkbox'
              name='remember'
              label='Запомнить меня'
              valuePropName='checked'
            />

            <Button
              disabled={!!commonError}
              type='primary'
              htmlType='submit'
              loading={!!loading}
              style={{ width: '100%', borderRadius: 4 }}
              className={b('login-form-button')}
            >
              Продолжить
            </Button>
          </Form>
          <Row
            gutter={{
              xs: 0,
              sm: 0,
              md: 0,
              lg: 0,
            }}
            className={b('buttons-col')}
          >
            <Button type='link'>
              <Link to='/sign-up/'>Зарегистрироваться</Link>
            </Button>
            <Button type='link' onClick={showModal}>
              Восстановить пароль
            </Button>
          </Row>
        </Col>
      </Row>
      <ModalComponent
        title='Восстановление пароля'
        open={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      >
        <ModalPasswordReset />
      </ModalComponent>
    </>
  );
};

export default SignIn;
