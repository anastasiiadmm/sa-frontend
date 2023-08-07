import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, message, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router';

import blockIcon from 'assets/images/icons/newIcon/block.svg';
import Errors from 'components/Errors/Errors';
import FormField from 'components/FormField/FormField';
import GeneratedPasswordModal from 'components/ModalComponent/ModalChildrenComponents/GeneratedPasswordModal/GeneratedPasswordModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import {
  accountsSelector,
  fetchAccount,
  generateNewPassword,
  managerChangeProfileHandler,
  managerProfileUpdate,
  setManagerProfile,
} from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { apiUrlCrop } from 'utils/config';
import { isObjectChangeValidate, removeEmptyValuesFromObject } from 'utils/helper';
import { fileSizeValidate, fileValidateImg } from 'utils/validate/validate';
import 'containers/Manager/Profile/_profile.scss';

const { Title } = Typography;

const Profile: React.FC = () => {
  const b = bem('Profile');
  const push = useNavigate();
  const {
    generatedPassword,
    generatePasswordLoading,
    fetchLoadingAccount,
    account,
    updateManagerData,
    updateManagerDataLoading,
    fetchErrorAccount,
  } = useAppSelector(accountsSelector);
  const dispatch = useAppDispatch();
  const [validateForm, setValidateForm] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchAccount());
  }, [dispatch]);

  useEffect(() => {
    if (account) {
      form.setFieldsValue({
        username: account?.username,
        old_password: account?.password,
        first_name: account?.first_name,
        last_name: account?.last_name,
        middle_name: account?.middle_name,
        email: account?.email,
        phone: account?.phone,
      });
    }
  }, [account, form]);

  useEffect(() => {
    if (account) {
      dispatch(setManagerProfile(account));
    }
  }, [account, dispatch]);

  useEffect(() => {
    if (account) {
      const validate = isObjectChangeValidate(account, updateManagerData);
      setValidateForm(validate);
    }
  }, [account, updateManagerData]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    dispatch(managerChangeProfileHandler({ [name]: value }));
  };

  const onFinish = () => {
    if (updateManagerData) {
      const data = removeEmptyValuesFromObject(updateManagerData);
      const formData = new FormData();

      for (const name in data) {
        if (name) {
          formData.append(name, data[name]);
        }
      }

      if (image) {
        formData.append('image', image);
      }

      dispatch(managerProfileUpdate({ data: formData }));
    }
  };

  const generatePassword = async () => {
    try {
      await dispatch(generateNewPassword({ user_id: account?.id })).unwrap();
      setIsModalPasswordOpen(true);
    } catch (e) {
      await message.error('Ошибка не получилось сменить пароль');
    }
  };

  const closePasswordModal = () => {
    setIsModalPasswordOpen(false);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (fileSizeValidate(files[0]) && fileValidateImg(files[0])) {
        setImage(files[0]);
        setValidateForm(false);
      }
    }
  };

  if (fetchErrorAccount) {
    return <Errors status={fetchErrorAccount.status} detail={fetchErrorAccount.detail} />;
  }

  return (
    <div className='layout' data-testid='accounts-id'>
      <Col
        className={b('')}
        xs={{ span: 18, offset: 2 }}
        md={{ span: 18, offset: 2 }}
        lg={{ span: 11, offset: 1 }}
      >
        {fetchLoadingAccount ? (
          <SkeletonBlock active={fetchLoadingAccount} num={1} titleBool />
        ) : (
          <>
            <div className={b('form-header')}>
              <div className={b('image-upload')}>
                <label htmlFor='image-input' className={b('avatar_block')}>
                  {image ? (
                    <Avatar
                      size={64}
                      src={URL.createObjectURL(image)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <Avatar
                      size={64}
                      src={account?.image ? `${apiUrlCrop}${account?.image}` : ''}
                      style={{ cursor: 'pointer' }}
                      icon={<UserOutlined />}
                    />
                  )}
                </label>

                <input
                  data-testid='image-input'
                  id='image-input'
                  type='file'
                  onChange={onFileChange}
                  accept='image/png, image/gif, image/jpeg'
                />
              </div>

              <Title level={3} data-testid='sign_in_test' className='title'>
                {`${account?.last_name} ${account?.first_name?.charAt(
                  0,
                )}. ${account?.middle_name?.charAt(0)}.`}
              </Title>
            </div>

            <Form form={form} initialValues={{ account }} onFinish={onFinish} layout='vertical'>
              <div className={b('form-block')}>
                <FormField
                  bordered
                  data-testid='last_name_id'
                  id='last_name_id'
                  inputClassName={b('username')}
                  label='Фамилия'
                  name='last_name'
                  placeholder='Фамилия'
                  onChange={inputChangeHandler}
                />

                <FormField
                  bordered
                  data-testid='first_name_id'
                  id='first_name_id'
                  inputClassName={b('username')}
                  label='Имя'
                  name='first_name'
                  placeholder='Имя'
                  onChange={inputChangeHandler}
                />
              </div>

              <FormField
                bordered
                data-testid='middle_name_id'
                id='middle_name_id'
                inputClassName={b('username')}
                label='Отчество'
                name='middle_name'
                placeholder='Отчество'
                onChange={inputChangeHandler}
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
                  onChange={inputChangeHandler}
                />

                <FormField
                  bordered
                  type='phone'
                  className='username'
                  name='phone'
                  label='Номер телефона'
                  placeholder='Номер телефона'
                  onChange={inputChangeHandler}
                />
              </div>

              <FormField
                disabled
                bordered
                data-testid='username_id'
                id='username_id'
                inputClassName={b('username')}
                label='Username'
                name='username'
                placeholder='Username'
                onChange={inputChangeHandler}
              />
              <div className={b('generate-password')}>
                <Button
                  type='text'
                  className={b('password-button')}
                  onClick={generatePassword}
                  loading={generatePasswordLoading}
                >
                  Сгенерировать пароль
                </Button>
              </div>
              <Button
                data-testid='button_change'
                disabled={validateForm}
                type='primary'
                htmlType='submit'
                loading={updateManagerDataLoading}
                style={{ width: '100%', borderRadius: 4, marginTop: 30 }}
                className={b('login-form-button')}
              >
                Сохранить изменения
              </Button>
              <div className={b('button_mobile')}>
                <Button className='cancel' onClick={() => push(-1)}>
                  Отменить
                </Button>
                <Button
                  disabled={validateForm}
                  type='primary'
                  htmlType='submit'
                  loading={updateManagerDataLoading}
                >
                  Сохранить
                </Button>
              </div>
            </Form>
          </>
        )}
      </Col>
      <div className={b('block_generator_mobile')}>
        <Button onClick={generatePassword}>
          <div>
            <img src={blockIcon} alt='block' />
          </div>
          <p>Сгенерировать пароль</p>
        </Button>
      </div>
      <ModalComponent
        title='Пароль'
        open={isModalPasswordOpen}
        dividerShow={false}
        handleOk={closePasswordModal}
        handleCancel={closePasswordModal}
        classNameTitle='title_signIn'
      >
        <GeneratedPasswordModal
          subtitle='Ваш новый пароль'
          generatedPassword={generatedPassword}
          onClose={closePasswordModal}
        />
      </ModalComponent>
    </div>
  );
};

export default Profile;
