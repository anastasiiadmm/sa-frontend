import { Button, Card, Col, Form, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';

import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import FormField from 'components/FormField/FormField';
import EditUserProfileModal from 'components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/EditUserProfileModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import { accountsSelector, fetchUser } from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import 'containers/User/Profile/_profile.scss';

const { Title } = Typography;

const Profile = () => {
  const b = bem('Profile');
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { user: userAccount, fetchLoadingUser } = useAppSelector(accountsSelector);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchUser());
  }, [dispatch]);

  useEffect(() => {
    if (userAccount) {
      form.setFieldsValue({
        username: userAccount?.user?.username,
        last_name: userAccount?.user?.last_name,
        first_name: userAccount?.user?.first_name,
        middle_name: userAccount?.user?.middle_name,
        email: userAccount?.user?.email,
        phone: userAccount?.user?.phone,
        name: userAccount?.name,
        location: userAccount?.location,
        autopilots_amount: userAccount?.autopilots_amount,
      });
    }
  }, [userAccount, form]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOkCancel = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onFinish = (values: any) => {};

  return (
    <>
      <div className={b()}>
        <div className={b('card-block')}>
          {fetchLoadingUser ? (
            <SkeletonBlock active={fetchLoadingUser} num={1} titleBool />
          ) : (
            <Card className={b('card-style')} bordered={false}>
              <Title className={b('card-title')}>Количество техники</Title>
              <div className={b('card-content')}>
                <img src={tractorBlue} alt='group' />
                <p>{userAccount?.vehicles_amount}</p>
              </div>
            </Card>
          )}
        </div>
        <div className='layout'>
          {fetchLoadingUser ? (
            <SkeletonBlock active={fetchLoadingUser} num={1} titleBool />
          ) : (
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
                <Button onClick={showModal} type='link' className={b('request_link')}>
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
                  className='label-styles'
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
                    className='label-styles'
                    inputClassName={b('input-styles')}
                    data-testid='last_name_id'
                    id='last_name_id'
                    label='Фамилия'
                    name='last_name'
                    placeholder='Фамилия'
                  />
                  <FormField
                    readOnly
                    className='label-styles'
                    inputClassName={b('input-styles')}
                    data-testid='first_name_id'
                    id='first_name_id'
                    label='Имя'
                    name='first_name'
                    placeholder='Имя'
                  />
                  <FormField
                    readOnly
                    className='label-styles'
                    inputClassName={b('input-styles')}
                    data-testid='surname_id'
                    id='middle_name_id'
                    label='Отчество'
                    name='middle_name'
                    placeholder='Отчество'
                  />
                </div>

                <div className={b('form-block')}>
                  <FormField
                    readOnly
                    className='label-styles'
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
                    className='label-styles'
                    inputClassName={b('input-styles')}
                    type='phone'
                    name='phone'
                    label='Номер телефона'
                    placeholder='Номер телефона'
                  />
                </div>

                <FormField
                  readOnly
                  className='label-styles'
                  inputClassName={b('input-styles')}
                  data-testid='name_id'
                  id='name_id'
                  label='Название колхоза/фермы/компании'
                  name='name'
                  placeholder='Название колхоза/фермы/компании'
                />

                <FormField
                  readOnly
                  className='label-styles'
                  inputClassName={b('input-styles')}
                  data-testid='location_id'
                  id='location_id'
                  label='Регион расположения'
                  name='location'
                  placeholder='Регион расположения'
                />

                <FormField
                  className='label-styles'
                  readOnly
                  inputClassName={b('input-styles')}
                  data-testid='autopilots_amount_id'
                  id='autopilots_amount_id'
                  label='Количество оплаченных блоков автопилота'
                  name='autopilots_amount'
                  placeholder='Количество оплаченных блоков автопилота'
                />
              </Form>
            </Col>
          )}
        </div>
      </div>

      <ModalComponent
        title='Запрос на изменение личной информации'
        open={isModalOpen}
        handleOk={handleOkCancel}
        handleCancel={handleOkCancel}
      >
        <EditUserProfileModal />
      </ModalComponent>
    </>
  );
};

export default Profile;
