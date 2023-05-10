import { Button, Card, Col, Divider, Form, message, Typography } from 'antd';

import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link, useParams } from 'react-router-dom';

import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import Errors from 'components/Errors/Errors';
import FormField from 'components/FormField/FormField';
import DeleteUserModal from 'components/ModalComponent/ModalChildrenComponents/DeleteUserModal/DeleteUserModal';
import EditUserProfileModal from 'components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/EditUserProfileModal';
import GeneratedPasswordModal from 'components/ModalComponent/ModalChildrenComponents/GeneratedPasswordModal/GeneratedPasswordModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import {
  getErrorMessage,
  isObjectChangeUserProfileValidate,
  removeEmptyValuesFromObject,
} from 'helper';
import { accountsSelector, generateNewPassword } from 'redux/accounts/accountsSlice';
import {
  companiesSelector,
  deleteUserInfo,
  fetchUserInfo,
  setChangeUserProfile,
  updateUserInfo,
} from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { companiesList } from 'types/types';

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
    userInfo,
    updateUserData,
    updateUserInfoLoading,
    deleteUserInfoLoading,
    userInfoLoading,
    userInfoError,
  } = useAppSelector(companiesSelector);
  const { generatedPassword, generatePasswordLoading } = useAppSelector(accountsSelector);
  const [validateForm, setValidateForm] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);
  const [userData, setUserData] = useState<companiesList>({
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
  const resultsObj: any = companies?.find((item) => item.id === +id) || userInfo;
  // буду править any когда подключим эндпоинт на v2

  useEffect(() => {
    if (!companies?.length) {
      dispatch(fetchUserInfo({ id }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (resultsObj) {
      form.setFieldsValue({
        username: resultsObj?.user?.username,
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

  const generatePassword = async () => {
    try {
      await dispatch(generateNewPassword({ company_id: resultsObj?.id })).unwrap();
      setIsModalPasswordOpen(true);
    } catch (e) {
      await message.error('Ошибка не получилось сменить пароль');
    }
  };

  const closePasswordModal = () => {
    setIsModalPasswordOpen(false);
  };

  const deleteUserHandler = async () => {
    try {
      await dispatch(deleteUserInfo(id)).unwrap();
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
        const {
          user: { image, ...userWithoutImage },
          ...rest
        } = userData;
        const newObj = { ...rest, user: userWithoutImage };
        const data = removeEmptyValuesFromObject(newObj);
        await dispatch(updateUserInfo({ id, data })).unwrap();
        history('/');
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e, 'username');
      await message.error(`${errorMessage}`);
    }
  };

  if (userInfoError) {
    return <Errors status={userInfoError.status} detail={userInfoError.detail} />;
  }

  return (
    <>
      <div className='layout' data-testid='user-profile-id'>
        <Col
          className={b('')}
          xs={{ span: 20, offset: 2 }}
          md={{ span: 18, offset: 3 }}
          lg={{ span: 11, offset: 1 }}
        >
          {userInfoLoading ? (
            <SkeletonBlock active={userInfoLoading} num={1} titleBool />
          ) : (
            <>
              <Title level={3} data-testid='sign_in_test' className='title'>
                {`${resultsObj?.user?.last_name} ${resultsObj?.user?.first_name?.charAt(0)}. ${
                  resultsObj?.user?.middle_name
                    ? `${resultsObj?.user?.middle_name?.charAt(0)}.`
                    : ''
                }`}
              </Title>

              <Link to={`/user-technique/${id}`}>
                <Card className={b('user-card-style')} bordered={false} style={{ width: '100%' }}>
                  <img src={tractorBlue} alt='tractorBlue' />
                  <div className={b('card-content')}>
                    <Title level={4} style={{ margin: 5 }} data-testid='sign_in_test'>
                      Техника пользователя
                    </Title>
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

                <Button
                  type='text'
                  className={b('password-button')}
                  onClick={generatePassword}
                  loading={generatePasswordLoading}
                >
                  Сгенерировать пароль
                </Button>
                <Divider />

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
      <ModalComponent
        title='Пароль'
        open={isModalPasswordOpen}
        dividerShow={false}
        handleOk={closePasswordModal}
        handleCancel={closePasswordModal}
        classNameTitle='title_signIn'
      >
        <GeneratedPasswordModal
          subtitle='Новый пароль пользователя'
          generatedPassword={generatedPassword}
          onClose={closePasswordModal}
        />
      </ModalComponent>
    </>
  );
};

export default UserProfile;
