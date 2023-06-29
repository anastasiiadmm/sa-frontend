import { Button, Col, Divider, Form, message, Row, Typography } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import logo from 'assets/images/logo.png';
import tractor from 'assets/images/tracktor.png';
import FormField from 'components/FormField/FormField';
import RequestRegisterModal from 'components/ModalComponent/ModalChildrenComponents/RequestRegisterModal/RequestRegisterModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import { userMutation } from 'interfaces';
import { inquiriesSuccessNull } from 'redux/accounts/accountsSlice';
import { authSelector, loginUser } from 'redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { userLocalStorage } from 'utils/token';
import 'containers/SignIn/_signIn.scss';

const { Title, Text } = Typography;

const SignIn: React.FC = () => {
  const b = bem('SignIn');
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const { success, loading, user } = useAppSelector(authSelector);
  const history = useNavigate();
  const [checked, setChecked] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
    dispatch(inquiriesSuccessNull());
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onFinish = async (values: userMutation) => {
    try {
      await dispatch(loginUser(values)).unwrap();
    } catch (e) {
      await message.error(e?.detail);
    }
  };

  const onChangeCheckbox = (e: CheckboxChangeEvent) => {
    setChecked(e.target.checked);
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
    <>
      <Row justify='space-between' data-testid='sign-in' className={b()}>
        <Col
          xs={{ span: 24, offset: 0 }}
          md={{ span: 24, offset: 0 }}
          lg={{ span: 12, offset: 0 }}
          className={b('image-block')}
        >
          <img src={tractor} alt='tractor' className={b('image-styles')} />
        </Col>
        <Col
          className={b('main-colum-styles')}
          xs={{ span: 16, offset: 5 }}
          md={{ span: 13, offset: 5 }}
          lg={{ span: 7, offset: 1 }}
        >
          <div className={b('block_form')}>
            <img src={logo} alt='logo' className={b('logo-image')} />
            <Divider style={{ margin: '34px 0' }} />
            <Text type='secondary'>Рады вас видеть</Text>
            <Title data-testid='sign_in_test' className={b('title-text')}>
              Войдите в аккаунт
            </Title>

            <Form
              form={form}
              initialValues={{ remember: true }}
              onFinish={onFinish}
              className='login-form'
              autoComplete='off'
              layout='vertical'
              size='large'
            >
              <FormField
                bordered
                data-testid='email_id_login'
                type='email'
                id='email_id'
                name='username'
                rules={[
                  {
                    required: true,
                    message: 'Заполните логин',
                  },
                ]}
                placeholder='Логин'
                inputClassName={b('sign-in-input')}
              />

              <FormField
                bordered
                data-testid='password_id'
                type='password'
                name='password'
                placeholder='Пароль'
                inputClassName={b('sign-in-input')}
              />

              <FormField
                id='remember_id'
                type='checkbox'
                label='Запомнить меня'
                valuePropName='password'
                checked={checked}
                onChange={onChangeCheckbox}
              />

              <Button
                type='primary'
                htmlType='submit'
                loading={!!loading}
                className={b('login-form-button')}
              >
                Войти
              </Button>
            </Form>
            <Row className={b('buttons-row')}>
              <p style={{ margin: '17px auto' }}>Хотите стать клиентом?</p>
              <Button size='large' type='primary' onClick={showModal}>
                Зарегистрироваться
              </Button>
            </Row>
          </div>
        </Col>
      </Row>

      <ModalComponent
        dividerShow={false}
        title='Отправить запрос на регистрацию'
        open={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      >
        <RequestRegisterModal onClose={() => setIsModalOpen(false)} />
      </ModalComponent>
    </>
  );
};

export default SignIn;
