import { Button, Card, Col, Form, message, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link, useParams } from 'react-router-dom';

import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import FormField from 'components/FormField/FormField';
import DeleteUserModal from 'components/ModalComponent/ModalChildrenComponents/DeleteUserModal/DeleteUserModal';
import EditUserProfileModal from 'components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/EditUserProfileModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import {
  getErrorMessage,
  isObjectChangeUserProfileValidate,
  removeEmptyValuesFromObject,
} from 'helper';
import {
  companiesSelector,
  deleteUserInfo,
  fetchUserInfo,
  setChangeUserProfile,
  updateUserInfo,
} from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import 'containers/Manager/Users/UserProfile/_UserProfile.scss';

const { Title } = Typography;

const UserProfile: React.FC = () => {
  const b = bem('UserProfile');
  const { id } = useParams() as { id: string };
  const [form] = Form.useForm();
  const history = useNavigate();
  const dispatch = useAppDispatch();
  const {
    companies,
    fetchCompaniesLoading,
    userInfo,
    updateUserData,
    updateUserInfoLoading,
    deleteUserInfoLoading,
  } = useAppSelector(companiesSelector);
  const [validateForm, setValidateForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [userData, setUserData] = useState({
    user: {
      username: '',
      password: '',
      last_name: '',
      first_name: '',
      middle_name: '',
      email: '',
      phone: '',
      image: '',
    },
    name: '',
    location: '',
    autopilots_amount: 0,
  });
  const resultsObj = companies?.find((item) => item.id === +id) || userInfo;

  useEffect(() => {
    if (!companies?.length) {
      const data = {
        id,
      };
      dispatch(fetchUserInfo({ data }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (resultsObj) {
      form.setFieldsValue({
        username: resultsObj?.user?.username,
        password: resultsObj?.user?.password,
        last_name: resultsObj?.user?.last_name,
        first_name: resultsObj?.user?.first_name,
        middle_name: resultsObj?.user?.middle_name,
        image: resultsObj?.user?.image,
        email: resultsObj?.user?.email,
        phone: resultsObj?.user?.phone,
        name: resultsObj?.name,
        location: resultsObj?.location,
        autopilots_amount: resultsObj?.autopilots_amount,
      });
    }
  }, [resultsObj, form]);

  useEffect(() => {
    if (resultsObj) {
      dispatch(setChangeUserProfile(resultsObj));
      setUserData(resultsObj);
    }
  }, [resultsObj, dispatch]);

  useEffect(() => {
    if (resultsObj) {
      const validate = isObjectChangeUserProfileValidate(resultsObj, userData);
      setValidateForm(validate);
    }
  }, [resultsObj, userData]);

  const showDeleteModal = () => {
    setIsModalDeleteOpen(true);
  };

  const handleDeleteOkCancel = () => {
    setIsModalDeleteOpen(!isModalDeleteOpen);
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOkCancel = () => {
    setIsModalOpen(!isModalOpen);
  };

  const deleteUserHandler = async () => {
    try {
      await dispatch(deleteUserInfo(id));
      history('/');
    } catch (e) {
      const errorMessage = getErrorMessage(e, 'password');
      await message.error(`${errorMessage}`);
    }
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('user,')) {
      const userKey = name.split(',')[1];
      setUserData((prevUserData) => ({
        ...prevUserData,
        user: {
          ...prevUserData.user,
          [userKey]: value,
        },
      }));
    } else if (name === 'autopilots_amount') {
      setUserData((prevUserData) => ({
        ...prevUserData,
        autopilots_amount: Number(value),
      }));
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const onFinish = async () => {
    try {
      if (userData) {
        const data = removeEmptyValuesFromObject(userData);
        await dispatch(updateUserInfo({ id, data })).unwrap();
        history('/');
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e, 'username');
      await message.error(`${errorMessage}`);
    }
  };

  return (
    <>
      <div className='layout' data-testid='user-profile-id'>
        <Col
          className={b('')}
          xs={{ span: 20, offset: 2 }}
          md={{ span: 18, offset: 3 }}
          lg={{ span: 11, offset: 1 }}
        >
          {fetchCompaniesLoading ? (
            <SkeletonBlock active={fetchCompaniesLoading} num={1} titleBool />
          ) : (
            <>
              <Title level={3} data-testid='sign_in_test' className='title'>
                Петр В.И
              </Title>

              <Link to={`/user-technique/${id}`}>
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
                initialValues={{ resultsObj }}
                onFinish={onFinish}
                autoComplete='off'
                layout='vertical'
              >
                <FormField
                  readOnly
                  inputClassName={b('username-info')}
                  data-testid='username_id'
                  id='username_id'
                  label='Username'
                  name='username'
                  placeholder='Username'
                />

                <FormField
                  readOnly
                  id='password_id'
                  type='password'
                  name='password'
                  label='Пароль'
                  placeholder='Пароль'
                  inputClassName={b('username-info')}
                />

                <div className={b('form-block')}>
                  <FormField
                    readOnly
                    data-testid='last_name_id'
                    id='last_name_id'
                    label='Фамилия'
                    name='last_name'
                    placeholder='Фамилия'
                    inputClassName={b('username-info')}
                  />
                  <FormField
                    readOnly
                    data-testid='first_name_id'
                    id='first_name_id'
                    label='Имя'
                    name='first_name'
                    placeholder='Имя'
                    inputClassName={b('username-info')}
                  />
                  <FormField
                    readOnly
                    data-testid='middle_name_id'
                    id='middle_name_id'
                    label='Отчество'
                    name='middle_name'
                    placeholder='Отчество'
                    inputClassName={b('username-info')}
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
                    inputClassName={b('username-info')}
                  />

                  <FormField
                    readOnly
                    type='phone'
                    name='phone'
                    label='Номер телефона'
                    placeholder='Номер телефона'
                    inputClassName={b('username-info')}
                  />
                </div>

                <FormField
                  readOnly
                  data-testid='name_id'
                  id='name_id'
                  label='Название колхоза/фермы/компании'
                  name='name'
                  placeholder='Название колхоза/фермы/компании'
                  inputClassName={b('username-info')}
                />

                <FormField
                  readOnly
                  data-testid='location_id'
                  id='location_id'
                  label='Регион расположения'
                  name='location'
                  placeholder='Регион расположения'
                  inputClassName={b('username-info')}
                />

                <FormField
                  readOnly
                  data-testid='autopilots_amount_id'
                  id='autopilots_amount_id'
                  label='Количество оплаченных блоков автопилота'
                  name='autopilots_amount'
                  placeholder='Количество оплаченных блоков автопилота'
                  inputClassName={b('username-info')}
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
            </>
          )}
        </Col>
      </div>

      <ModalComponent
        title='Редактирование профиля пользователя'
        open={isModalOpen}
        handleOk={handleOkCancel}
        handleCancel={handleOkCancel}
      >
        <EditUserProfileModal
          updateUserData={updateUserData}
          onFinish={onFinish}
          validateForm={validateForm}
          inputChangeHandler={inputChangeHandler}
          loading={updateUserInfoLoading}
        />
      </ModalComponent>

      <ModalComponent
        title='Удаление профиля пользователя'
        open={isModalDeleteOpen}
        handleOk={handleDeleteOkCancel}
        handleCancel={handleDeleteOkCancel}
      >
        <DeleteUserModal
          handleDeleteCancel={handleDeleteOkCancel}
          deleteUserHandler={deleteUserHandler}
          loading={deleteUserInfoLoading}
        />
      </ModalComponent>
    </>
  );
};

export default UserProfile;
