import { Button, Card, Col, Form, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useState } from 'react';

import 'containers/User/Profile/_profile.scss';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import FormField from 'components/FormField/FormField';
import EditUserProfileModal from 'components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/EditUserProfileModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';

const { Title } = Typography;

const Profile = () => {
  const b = bem('Profile');
  const [form] = Form.useForm();
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

  const onFinish = (values: any) => {};

  return (
    <>
      <div className={b()}>
        <div className={b('card-block')}>
          <Card className={b('card-style')} bordered={false}>
            <Title className={b('card-title')}>Количество техники</Title>
            <div className={b('card-content')}>
              <img src={tractorBlue} alt='group' />
              <p>5</p>
            </div>
          </Card>
        </div>
        <div className='layout'>
          <Col
            className={b('')}
            xs={{ span: 20, offset: 2 }}
            md={{ span: 18, offset: 3 }}
            lg={{ span: 11, offset: 1 }}
          >
            <div className={b('title')}>
              <Title level={3} data-testid='sign_in_test' className={b('title')}>
                Профиль
              </Title>
              <p>
                Для того чтобы изменить или добавить информацию в вашем профиле обратись к вашему
                менеджеру.
              </p>
              <Button onClick={showModal} type='link'>
                Запрос на изменение личной информации
              </Button>
            </div>

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
                inputClassName={b('input-styles')}
                label='Username'
                name='username'
                placeholder='Username'
              />

              <div className={b('form-block')}>
                <FormField
                  readOnly
                  inputClassName={b('input-styles password-width')}
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
                  inputClassName={b('input-styles')}
                  data-testid='last_name_id'
                  id='last_name_id'
                  label='Фамилия'
                  name='last_name'
                  placeholder='Фамилия'
                />
                <FormField
                  readOnly
                  inputClassName={b('input-styles')}
                  data-testid='first_name_id'
                  id='first_name_id'
                  label='Имя'
                  name='first_name'
                  placeholder='Имя'
                />
                <FormField
                  readOnly
                  inputClassName={b('input-styles')}
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
                  inputClassName={b('input-styles')}
                  data-testid='email_id_login'
                  type='email'
                  id='email_id'
                  label='Email'
                  name='email'
                  placeholder='Email'
                />

                <FormField
                  readOnly
                  inputClassName={b('input-styles')}
                  type='phone'
                  name='phone'
                  label='Номер телефона'
                  placeholder='Номер телефона'
                />
              </div>

              <FormField
                readOnly
                inputClassName={b('input-styles')}
                data-testid='name_of_company_id'
                id='name_of_company_id'
                label='Название колхоза/фермы/компании'
                name='name_of_company'
                placeholder='Название колхоза/фермы/компании'
              />

              <FormField
                readOnly
                inputClassName={b('input-styles')}
                data-testid='name_of_region_id'
                id='name_of_region_id'
                label='Регион расположения'
                name='name_of_region'
                placeholder='Регион расположения'
              />

              <FormField
                readOnly
                inputClassName={b('input-styles')}
                data-testid='amount_id'
                id='amount_id'
                label='Количество оплаченных блоков автопилота'
                name='amount'
                placeholder='Количество оплаченных блоков автопилота'
              />
            </Form>
          </Col>
        </div>
      </div>

      <ModalComponent
        title='Запрос на изменение личной информации'
        open={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      >
        <EditUserProfileModal />
      </ModalComponent>
    </>
  );
};

export default Profile;
