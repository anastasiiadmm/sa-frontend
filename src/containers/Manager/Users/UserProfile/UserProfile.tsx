import { Button, Card, Col, Divider, Drawer, Form, message, Typography } from 'antd';

import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';
import { Link, useParams } from 'react-router-dom';

import arrowRight from 'assets/images/icons/arrow-right.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import Errors from 'components/Errors/Errors';
import FormField from 'components/FormField/FormField';
import DeleteUserModal from 'components/ModalComponent/ModalChildrenComponents/DeleteUserModal/DeleteUserModal';
import EditUserProfileModal from 'components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/EditUserProfileModal';
import GeneratedPasswordModal from 'components/ModalComponent/ModalChildrenComponents/GeneratedPasswordModal/GeneratedPasswordModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import useWindowWidth from 'hooks/useWindowWidth';
import { IAccount } from 'interfaces';
import { FunctionMap } from 'interfaces/IConfig';
import { accountsSelector, generateNewPassword } from 'redux/accounts/accountsSlice';
import {
  companiesSelector,
  deleteUserInfo,
  fetchUserInfoByManager,
  setChangeUserProfile,
  updateUserInfo,
} from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { buttonsMenu } from 'utils/constants';
import { capitalizeFirstLetter, getErrorMessage, inputChangeFormHandler } from 'utils/helper';

import 'containers/Manager/Users/UserProfile/_UserProfile.scss';
import deleteIcon from '../../../../assets/images/icons/newIcon/warning.svg';

const { Title } = Typography;

const UserProfile: React.FC = () => {
  const b = bem('UserProfile');
  const { id } = useParams() as { id: string };
  const [form] = Form.useForm();
  const history = useNavigate();
  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();
  const {
    updateUserData,
    updateUserInfoLoading,
    deleteUserInfoLoading,
    userInfoByManager,
    userInfoByManagerLoading,
    userInfoByManagerError,
  } = useAppSelector(companiesSelector);
  const { generatedPassword, generatePasswordLoading } = useAppSelector(accountsSelector);
  const [formValid, setFormValid] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalDeleteOpen, setIsModalDeleteOpen] = useState(false);
  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);
  const [openDrawerDelete, setOpenDraweDelete] = useState(false);
  const [userInfoData, setUserInfoData] = useState<IAccount>({
    coords_timeout: 0,
    email: '',
    first_name: '',
    image: '',
    is_manager: false,
    last_name: '',
    middle_name: '',
    phone: '',
    username: '',
    company: {
      autopilots_amount: 0,
      location: '',
      meteo_requested: false,
      name: '',
      vehicles_number: 0,
      weather_service: false,
    },
  });

  useEffect(() => {
    if (id) {
      dispatch(fetchUserInfoByManager({ id }));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (userInfoByManager) {
      form.setFieldsValue({
        username: userInfoByManager?.username,
        last_name: userInfoByManager?.last_name,
        first_name: userInfoByManager?.first_name,
        middle_name: userInfoByManager?.middle_name,
        image: userInfoByManager?.image,
        email: userInfoByManager?.email,
        phone: userInfoByManager?.phone,
        name: userInfoByManager?.company?.name,
        location: userInfoByManager?.company?.location,
        autopilots_amount: userInfoByManager?.company?.autopilots_amount,
      });
    }
  }, [userInfoByManager, form]);

  useEffect(() => {
    if (userInfoByManager) {
      dispatch(setChangeUserProfile(userInfoByManager));
      setUserInfoData(userInfoByManager);
    }
  }, [userInfoByManager, dispatch]);

  const showDeleteModal = () => {
    if (windowWidth < 500) {
      setOpenDraweDelete(true);
    } else {
      setIsModalDeleteOpen(true);
    }
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
      await dispatch(generateNewPassword({ user_id: userInfoByManager?.id })).unwrap();
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
    inputChangeFormHandler(e, userInfoData, setUserInfoData);
  };

  const functionMap: FunctionMap = {
    showDeleteModal,
    generatePassword,
  };

  const onFinish = async (values: IAccount) => {
    try {
      if (values) {
        await dispatch(updateUserInfo({ id, data: values })).unwrap();
        setIsModalOpen(!isModalOpen);
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e, 'username');
      await message.error(`${errorMessage}`);
    }
  };

  if (userInfoByManagerError) {
    return <Errors status={userInfoByManagerError.status} detail={userInfoByManagerError.detail} />;
  }

  const formItem = (
    <Form
      form={form}
      initialValues={{ userInfoData }}
      onFinish={onFinish}
      autoComplete='off'
      layout='vertical'
    >
      <>
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
      </>

      {windowWidth <= 990 ? null : (
        <>
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
              type='primary'
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
        </>
      )}
    </Form>
  );

  return (
    <>
      {windowWidth <= 990 ? (
        <>
          <div className={b('tablet-layout')}>
            {userInfoByManagerLoading ? (
              <SkeletonBlock active={userInfoByManagerLoading} num={1} titleBool />
            ) : (
              <>
                <Title level={3} data-testid='user_info_test' className='title'>
                  {userInfoByManager?.last_name} {userInfoByManager?.first_name?.charAt(0)}.
                  {userInfoByManager?.middle_name && `${userInfoByManager?.middle_name.charAt(0)}.`}
                </Title>
                {formItem}
              </>
            )}
          </div>
          <div className={b('buttons-block')}>
            {buttonsMenu.map((button, index) => {
              const handleClick = functionMap[button.action];
              const shouldOpenModal =
                button.action === 'showDeleteModal' || button.action === 'generatePassword';

              return (
                <Card
                  key={button?.key}
                  className={b('buttons-card-style')}
                  bordered={false}
                  onClick={shouldOpenModal ? handleClick : undefined}
                >
                  {shouldOpenModal ? (
                    <>
                      <img src={button?.image} alt='icon' />
                      <div className={b('card-content')}>
                        <Title
                          level={windowWidth <= 601 ? 5 : 4}
                          style={{ margin: 5 }}
                          data-testid={`button_card_test_${index}`}
                        >
                          {button?.text}
                        </Title>
                      </div>
                      {windowWidth <= 601 ? (
                        <img src={arrowRight} alt='arrowRight' className={b('right_float')} />
                      ) : null}
                    </>
                  ) : (
                    <Link
                      to={
                        button.action === 'user-technique'
                          ? `/user-technique/${id}/${userInfoByManager?.company?.id}`
                          : `/${button.action}/${id}`
                      }
                    >
                      <img src={button?.image} alt='icon' />
                      <div className={b('card-content')}>
                        <Title
                          level={windowWidth <= 601 ? 5 : 4}
                          style={{ margin: 5 }}
                          data-testid={`button_card_test_${index}`}
                        >
                          {button?.text}
                        </Title>
                      </div>
                      {windowWidth <= 601 ? (
                        <img src={arrowRight} alt='arrowRight' className={b('right_float')} />
                      ) : null}
                    </Link>
                  )}
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        <div className='layout' data-testid='user-profile-id'>
          <Col
            className={b('')}
            xs={{ span: 20, offset: 2 }}
            md={{ span: 18, offset: 3 }}
            lg={{ span: 11, offset: 1 }}
          >
            {userInfoByManagerLoading ? (
              <SkeletonBlock active={userInfoByManagerLoading} num={1} titleBool />
            ) : (
              <>
                <div className={b('header-title')}>
                  <Title level={3} data-testid='sign_in_test' className='title'>
                    {capitalizeFirstLetter(userInfoByManager?.last_name)}{' '}
                    {userInfoByManager?.first_name?.charAt(0)?.toUpperCase()}.{' '}
                    {userInfoByManager?.middle_name === ''
                      ? null
                      : `${userInfoByManager?.middle_name.charAt(0)?.toUpperCase()}.`}
                  </Title>
                </div>

                <Link to={`/user-technique/${id}/${userInfoByManager?.company?.id}`}>
                  <div className={b('user-card-style')} style={{ width: '100%' }}>
                    <img src={tractorBlue} alt='tractorBlue' className={b('icons_tractor')} />
                    <div className={b('card-content')}>
                      <div data-testid='sign_in_test' className={b('user-card-style-title')}>
                        <p className='user-card-style-1'>Техника пользователя</p>
                        <p className='user-card-style-2'>Добавить или удалить технику</p>
                      </div>
                    </div>
                  </div>
                </Link>
                <div className={b('form_info')}>
                  <div className='info_data'>
                    <p className='title_info'>Username</p>
                    <p className='text_info'>{userInfoData?.username}</p>
                  </div>
                  <div className={b('flex_info')}>
                    <div className='info_data'>
                      <p className='title_info'>Фамилия</p>
                      <p className='text_info'>{capitalizeFirstLetter(userInfoData?.last_name)}</p>
                    </div>
                    <div className='info_data'>
                      <p className='title_info'>Имя</p>
                      <p className='text_info'>{capitalizeFirstLetter(userInfoData?.first_name)}</p>
                    </div>
                    <div className='info_data'>
                      <p className='title_info'>Отчество</p>
                      <p className='text_info'>
                        {capitalizeFirstLetter(userInfoData?.middle_name)}
                      </p>
                    </div>
                  </div>
                  <div className={b('flex_info')}>
                    <div className='info_data'>
                      <p className='title_info'>Email</p>
                      <p className='text_info'>{userInfoData?.email}</p>
                    </div>
                    <div className='info_data'>
                      <p className='title_info'>Номер телефона</p>
                      <p className='text_info'>{userInfoData?.phone}</p>
                    </div>
                  </div>
                  <div className='info_data'>
                    <p className='title_info'>Название колхоза/фермы/компании</p>
                    <p className='text_info'>
                      {capitalizeFirstLetter(userInfoData?.company?.name)}
                    </p>
                  </div>
                  <div className='info_data'>
                    <p className='title_info'>Регион расположения</p>
                    <p className='text_info'>
                      {capitalizeFirstLetter(userInfoData?.company?.location)}
                    </p>
                  </div>
                  <div className='info_data'>
                    <p className='title_info'>Количество оплаченных блоков автопилота</p>
                    <p className='text_info'>{userInfoData?.company?.autopilots_amount}</p>
                  </div>
                </div>
                <div
                  style={{
                    marginTop: 30,
                  }}
                >
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
                      type='primary'
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
                </div>
              </>
            )}
          </Col>
        </div>
      )}

      <ModalComponent
        title='Редактирование профиля пользователя'
        open={isModalOpen}
        width={572}
        handleOk={handleOkCancel}
        handleCancel={handleOkCancel}
        className={b('fons_none')}
      >
        <EditUserProfileModal
          updateUserData={updateUserData}
          onFinish={onFinish}
          inputChangeHandler={inputChangeHandler}
          loading={updateUserInfoLoading}
          formValid={formValid}
          onValuesChange={() =>
            setFormValid(form.getFieldsError().some((item) => item.errors.length > 0))
          }
        />
      </ModalComponent>

      <ModalComponent
        dividerShow={false}
        open={isModalDeleteOpen}
        handleOk={handleDeleteOkCancel}
        handleCancel={handleDeleteOkCancel}
      >
        <DeleteUserModal
          fio={`${capitalizeFirstLetter(
            userInfoByManager?.last_name,
          )} ${userInfoByManager?.first_name
            ?.charAt(0)
            ?.toUpperCase()}.${userInfoByManager?.middle_name.charAt(0)?.toUpperCase()}`}
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
      <Drawer
        height={320}
        placement='bottom'
        closable={false}
        onClose={() => setOpenDraweDelete(false)}
        open={openDrawerDelete}
      >
        <div className={b('delete_mobile')}>
          <img className={b('delete-image')} src={deleteIcon} alt='deleteIcon' />
          <p className='title_delete'>Удалить профиль?</p>
          <p className='text_delete'>
            Вы уверены, что хотите удалить <br />{' '}
            <b>{`${capitalizeFirstLetter(
              userInfoByManager?.last_name,
            )} ${userInfoByManager?.first_name
              ?.charAt(0)
              ?.toUpperCase()}.${userInfoByManager?.middle_name.charAt(0)?.toUpperCase()}`}</b>
          </p>
          <Button
            className='delete'
            onClick={() => {
              deleteUserHandler();
              setOpenDraweDelete(false);
            }}
          >
            Удалить
          </Button>
          <Button className='cancel' onClick={() => setOpenDraweDelete(false)}>
            Отменить
          </Button>
        </div>
      </Drawer>
    </>
  );
};

export default UserProfile;
