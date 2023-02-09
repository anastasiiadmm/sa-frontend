import { Button, Col, Form, Typography } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import FormField from 'components/FormField/FormField';
import 'containers/Manager/Profile/_profile.scss';

const { Title } = Typography;

const Profile: React.FC = () => {
  const b = bem('Profile');
  const [form] = Form.useForm();

  const onFinish = (values: any) => {};

  return (
    <div className='layout'>
      <Col
        className={b('')}
        xs={{ span: 13, offset: 5 }}
        md={{ span: 9, offset: 5 }}
        lg={{ span: 11, offset: 1 }}
      >
        <Title level={3} data-testid='sign_in_test' className='title'>
          Иванов И.И
        </Title>

        <Form
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete='off'
          layout='vertical'
        >
          <FormField
            disabled
            bordered
            data-testid='username_id'
            id='username_id'
            inputClassName={b('username')}
            label='Username'
            name='username'
            placeholder='Username'
          />

          <div className={b('form-block')}>
            <FormField
              bordered
              id='password_id'
              type='password'
              className='username'
              name='password'
              label='Пароль'
              placeholder='Пароль'
            />

            <FormField
              bordered
              id='password_confirm'
              type='password'
              className='username'
              name='confirm_password'
              dependencies={['password']}
              label='Повторите пароль'
              placeholder='Повторите пароль'
            />
          </div>

          <div className={b('form-block')}>
            <FormField
              bordered
              data-testid='first_name_id'
              id='first_name_id'
              inputClassName={b('username')}
              label='Фамилия'
              name='first_name'
              placeholder='Фамилия'
            />

            <FormField
              bordered
              data-testid='last_name_id'
              id='last_name_id'
              inputClassName={b('username')}
              label='Имя'
              name='last_name'
              placeholder='Имя'
            />
          </div>

          <FormField
            bordered
            data-testid='surname_id'
            id='surname_id'
            inputClassName={b('username')}
            label='Отчество'
            name='surname'
            placeholder='Отчество'
          />

          <div className={b('form-block')}>
            <FormField
              bordered
              data-testid='email_id_login'
              type='email'
              id='email_id'
              inputClassName={b('username')}
              label='Email'
              name='email'
              placeholder='Email'
            />

            <FormField
              bordered
              type='phone'
              className='username'
              name='phone'
              label='Номер телефона'
              placeholder='Номер телефона'
            />
          </div>

          <Button
            // disabled={!!commonError}
            type='primary'
            htmlType='submit'
            // loading={!!loading}
            style={{ width: '100%', borderRadius: 4 }}
            className={b('login-form-button')}
          >
            Сохранить изменения
          </Button>
        </Form>
      </Col>
    </div>
  );
};

export default Profile;
