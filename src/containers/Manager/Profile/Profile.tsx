import { Avatar, Button, Col, Form, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';

import FormField from 'components/FormField/FormField';
import GeneratedPasswordModal from 'components/ModalComponent/ModalChildrenComponents/GeneratedPasswordModal/GeneratedPasswordModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import { isObjectChangeValidate, removeEmptyValuesFromObject } from 'helper';
import {
  accountsSelector,
  fetchManager,
  generateNewPassword,
  managerChangeProfileHandler,
  managerProfileUpdate,
  setManagerProfile,
} from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import 'containers/Manager/Profile/_profile.scss';
import { apiUrlCrop } from 'utils/config';

const { Title } = Typography;

const Profile: React.FC = () => {
  const b = bem('Profile');
  const {
    generatedPassword,
    generatePasswordLoading,
    fetchLoadingManager,
    manager,
    updateManagerData,
    updateManagerDataLoading,
  } = useAppSelector(accountsSelector);
  const dispatch = useAppDispatch();
  const [validateForm, setValidateForm] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [isModalPasswordOpen, setIsModalPasswordOpen] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    dispatch(fetchManager());
  }, [dispatch]);

  useEffect(() => {
    if (manager) {
      form.setFieldsValue({
        username: manager?.username,
        old_password: manager?.password,
        first_name: manager?.first_name,
        last_name: manager?.last_name,
        middle_name: manager?.middle_name,
        email: manager?.email,
        phone: manager?.phone,
      });
    }
  }, [manager, form]);

  useEffect(() => {
    if (manager) {
      dispatch(setManagerProfile(manager));
    }
  }, [manager, dispatch]);

  useEffect(() => {
    if (manager) {
      const validate = isObjectChangeValidate(manager, updateManagerData);
      setValidateForm(validate);
    }
  }, [manager, updateManagerData]);

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
    await dispatch(generateNewPassword({ company_id: 0 }));
    setIsModalPasswordOpen(true);
  };

  const closePasswordModal = () => {
    setIsModalPasswordOpen(false);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setImage(files[0]);
      setValidateForm(false);
    }
  };

  return (
    <div className='layout' data-testid='accounts-id'>
      <Col
        className={b('')}
        xs={{ span: 18, offset: 2 }}
        md={{ span: 18, offset: 2 }}
        lg={{ span: 11, offset: 1 }}
      >
        {fetchLoadingManager ? (
          <SkeletonBlock active={fetchLoadingManager} num={1} titleBool />
        ) : (
          <>
            <div className={b('form-header')}>
              <div className={b('image-upload')}>
                <label htmlFor='image-input'>
                  {image ? (
                    <Avatar
                      size={64}
                      src={URL.createObjectURL(image)}
                      style={{ cursor: 'pointer' }}
                    />
                  ) : (
                    <Avatar
                      size={64}
                      src={manager?.image ? `${apiUrlCrop}${manager?.image}` : ''}
                      style={{ cursor: 'pointer' }}
                    />
                  )}
                </label>

                <input
                  id='image-input'
                  type='file'
                  onChange={onFileChange}
                  accept='image/png, image/gif, image/jpeg'
                />
              </div>
              <Title level={3} data-testid='sign_in_test' className='title'>
                {`${manager?.last_name} ${manager?.first_name?.charAt(
                  0,
                )}. ${manager?.middle_name?.charAt(0)}.`}
              </Title>
            </div>

            <Form form={form} initialValues={{ manager }} onFinish={onFinish} layout='vertical'>
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
            </Form>
          </>
        )}
      </Col>
      <ModalComponent
        title='Пароль'
        open={isModalPasswordOpen}
        dividerShow={false}
        handleOk={closePasswordModal}
        handleCancel={closePasswordModal}
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
