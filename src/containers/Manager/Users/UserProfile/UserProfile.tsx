import { Button, Card, Col, Form, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import FormField from 'components/FormField/FormField';
import DeleteUserModal from 'components/ModalComponent/ModalChildrenComponents/DeleteUserModal/DeleteUserModal';
import EditUserProfileModal from 'components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/EditUserProfileModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import 'containers/Manager/Users/UserProfile/_UserProfile.scss';

const { Title } = Typography;

const UserProfile: React.FC = () => {
  const b = bem('UserProfile');
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);

  const showDeleteModal = () => {
    setIsModalDeleteOpen(true);
  };

  const handleDeleteOk = () => {
    setIsModalDeleteOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsModalDeleteOpen(false);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const deleteUserHandler = () => {};

  const onFinish = (values: any) => {};

  return (
    <>
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
                label='Email'
                name='email'
                placeholder='Email'
              />

              <FormField
                readOnly
                type='phone'
                name='phone'
                label='Номер телефона'
                placeholder='Номер телефона'
              />
            </div>

            <FormField
              readOnly
              data-testid='name_of_company_id'
              id='name_of_company_id'
              label='Название колхоза/фермы/компании'
              name='name_of_company'
              placeholder='Название колхоза/фермы/компании'
            />

            <FormField
              readOnly
              data-testid='name_of_region_id'
              id='name_of_region_id'
              label='Регион расположения'
              name='name_of_region'
              placeholder='Регион расположения'
            />

            <FormField
              readOnly
              data-testid='amount_id'
              id='amount_id'
              label='Количество оплаченных блоков автопилота'
              name='amount'
              placeholder='Количество оплаченных блоков автопилота'
            />

            <div className={b('profile-buttons')}>
              <Button
                // disabled={!!commonError}
                type='primary'
                // loading={!!loading}
                style={{ width: '100%', borderRadius: 4 }}
                className={b('delete-profile-button')}
                onClick={showDeleteModal}
              >
                Удалить
              </Button>
              <Button
                type='primary'
                style={{ width: '100%', borderRadius: 4 }}
                className={b('edit-profile-button')}
                onClick={showModal}
              >
                Редактировать
              </Button>
            </div>
          </Form>
        </Col>
      </div>

      <ModalComponent
        title='Редактирование профиля пользователя'
        open={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
      >
        <EditUserProfileModal />
      </ModalComponent>

      <ModalComponent
        title='Удаление профиля пользователя'
        open={isModalDeleteOpen}
        handleOk={handleDeleteOk}
        handleCancel={handleDeleteCancel}
      >
        <DeleteUserModal
          handleDeleteCancel={handleDeleteCancel}
          deleteUserHandler={deleteUserHandler}
        />
      </ModalComponent>
    </>
  );
};

export default UserProfile;
