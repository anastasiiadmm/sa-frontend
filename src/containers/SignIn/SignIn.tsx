import { Button, Checkbox, Col, Form, Row } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import image from 'assets/images/tracktor.jpeg';
import FormField from 'components/FormField/FormField';
import 'containers/SignIn/_signIn.scss';

const SignIn: React.FC = () => {
  const b = bem('SignIn');

  const onFinish = () => {};
  return (
    <Row className={b()} justify='space-between' data-testid='sign-in'>
      <Col
        className={b('img-position')}
        xs={{ span: 6, offset: 0 }}
        lg={{ span: 6, offset: 0 }}
        md={{ span: 6, offset: 0 }}
      >
        <img className={b('img-styles')} src={image} alt='image2' />
      </Col>
      <Col xs={{ span: 12, offset: 6 }} lg={{ span: 6, offset: 9 }} md={{ span: 12, offset: 6 }}>
        <Form
          className={b('form-styles')}
          layout='vertical'
          name='basic'
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete='off'
        >
          <FormField
            data-testid='email_id_login'
            className='username'
            type='email'
            id='email_id'
            label='Логин'
            name='email'
            placeholder='Введите логин'
          />
          <FormField
            data-testid='password_id'
            className='username'
            type='password'
            label='Пароль'
            name='password'
            placeholder='Введите пароль'
          />
          <Form.Item name='remember' valuePropName='checked' wrapperCol={{ offset: 17 }}>
            <Checkbox className={b('checkbox-styles')}>Запомнить</Checkbox>
          </Form.Item>
          <Form.Item wrapperCol={{ offset: 9 }}>
            <Button type='primary' htmlType='submit'>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Col>
    </Row>
  );
};

export default SignIn;
