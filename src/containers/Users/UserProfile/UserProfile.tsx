import { Button, Card, Col, Form, Typography } from 'antd';
import bem from 'easy-bem';
import React from 'react';
import { Link } from 'react-router-dom';

import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import FormField from 'components/FormField/FormField';
import 'containers/Users/UserProfile/_UserProfile.scss';

const { Title } = Typography;

const UserProfile: React.FC = () => {
  const b = bem('UserProfile');
  const [form] = Form.useForm();

  const onFinish = (values: any) => {};

  return (
    <div className='layout'>
      <Col
        className={b('')}
        xs={{ span: 20, offset: 2 }}
        md={{ span: 18, offset: 3 }}
        lg={{ span: 11, offset: 1 }}
      >
        <Title level={3} data-testid='sign_in_test' className='title'>
          Петр В.И
        </Title>

        <Link to='/user-technique'>
          <Card className={b('user-card-style')} bordered={false} style={{ width: 350 }}>
            <img src={tractorBlue} alt='tractorBlue' />
            <div className={b('card-content')}>
              <Title level={5} data-testid='sign_in_test'>
                Техника пользователя
              </Title>
              <p className={b('subtext')}>Добавить или удалить технику</p>
            </div>
          </Card>
        </Link>

        <Form
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete='off'
          layout='vertical'
        >
          <FormField
            readOnly
            data-testid='username_id'
            id='username_id'
            inputClassName={b('username')}
            label='Username'
            name='username'
            placeholder='Username'
          />

          <div className={b('form-block')}>
            <FormField
              readOnly
              id='password_id'
              type='password'
              name='password'
              label='Пароль'
              placeholder='Пароль'
            />
          </div>

          <div className={b('form-block')}>
            <FormField
              readOnly
              data-testid='last_name_id'
              id='last_name_id'
              label='Фамилия'
              name='last_name'
              placeholder='Фамилия'
            />
            <FormField
              readOnly
              data-testid='first_name_id'
              id='first_name_id'
              label='Имя'
              name='first_name'
              placeholder='Имя'
            />
            <FormField
              readOnly
              data-testid='surname_id'
              id='surname_id'
              label='Отчество'
              name='surname'
              placeholder='Отчество'
            />
          </div>

          <div className={b('form-block')}>
            <FormField
              readOnly
              data-testid='email_id_login'
              type='email'
              id='email_id'
              inputClassName={b('username')}
              label='Email'
              name='email'
              placeholder='Email'
            />

            <FormField
              readOnly
              type='phone'
              className='username'
              name='phone'
              label='Номер телефона'
              placeholder='Номер телефона'
            />
          </div>

          <FormField
            readOnly
            data-testid='username_id'
            id='username_id'
            label='Название колхоза/фермы/компании'
            name='username'
            placeholder='Название колхоза/фермы/компании'
          />

          <FormField
            readOnly
            data-testid='username_id'
            id='username_id'
            label='Регион расположения'
            name='username'
            placeholder='Регион расположения'
          />

          <FormField
            readOnly
            data-testid='username_id'
            id='username_id'
            label='Количество оплаченных блоков автопилота'
            name='username'
            placeholder='Количество оплаченных блоков автопилота'
          />

          <div className={b('profile-buttons')}>
            <Button
              // disabled={!!commonError}
              type='primary'
              htmlType='submit'
              // loading={!!loading}
              style={{ width: '100%', borderRadius: 4 }}
              className={b('delete-profile-button')}
            >
              Удалить
            </Button>
            <Button
              // disabled={!!commonError}
              type='primary'
              htmlType='submit'
              // loading={!!loading}
              style={{ width: '100%', borderRadius: 4 }}
              className={b('edit-profile-button')}
            >
              Редактировать
            </Button>
          </div>
        </Form>
      </Col>
    </div>
  );
};

export default UserProfile;
