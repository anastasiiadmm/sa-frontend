import { Button, Checkbox, Col, Form, Row } from 'antd';
import React from 'react';

import image from 'assets/images/tracktor.jpeg';
import FormField from 'components/FormField/FormField';

const SignIn: React.FC = () => {
  const onFinish = () => {};
  return (
    <Row
      justify='space-between'
      data-testid='sign-in'
      style={{ position: 'relative', height: '100vh', overflow: 'hidden' }}
    >
      <Col
        style={{ position: 'absolute' }}
        xs={{ span: 6, offset: 0 }}
        lg={{ span: 6, offset: 0 }}
        md={{ span: 6, offset: 0 }}
      >
        <img style={{ width: 1500 }} src={image} alt='image2' />
      </Col>
      <Col xs={{ span: 12, offset: 6 }} lg={{ span: 6, offset: 9 }} md={{ span: 12, offset: 6 }}>
        <Form
          style={{ margin: '160px auto' }}
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
            <Checkbox style={{ color: '#fff' }}>Запомнить</Checkbox>
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
