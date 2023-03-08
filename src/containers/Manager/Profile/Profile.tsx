import { Button, Col, Form, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';

import FormField from 'components/FormField/FormField';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import { isObjectChangeValidate, removeEmptyValuesFromObject } from 'helper';
import {
  accountsSelector,
  fetchManager,
  managerChangeProfileHandler,
  managerProfileUpdate,
  setManagerProfile,
} from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import 'containers/Manager/Profile/_profile.scss';

const { Title } = Typography;

const Profile: React.FC = () => {
  const b = bem('Profile');
  const { fetchLoadingManager, manager, updateManagerData, updateManagerDataLoading } =
    useAppSelector(accountsSelector);
  const dispatch = useAppDispatch();
  const [validateForm, setValidateForm] = useState(false);
  const [isChangePassword, setIsChangePassword] = useState(false);
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
      dispatch(managerProfileUpdate({ data }));
      setIsChangePassword(false);
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
            <Title level={3} data-testid='sign_in_test' className='title'>
              {`${manager?.last_name} ${manager?.first_name?.charAt(
                0,
              )}. ${manager?.middle_name?.charAt(0)}.`}
            </Title>

            <Form form={form} initialValues={{ manager }} onFinish={onFinish} layout='vertical'>
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

              {isChangePassword ? (
                <div className={b('changed-password-buttons')}>
                  <div className={b('form-block form-block-buttons')}>
                    <FormField
                      data-testid='new_password'
                      bordered
                      id='password_id'
                      type='password'
                      className='username'
                      name='password'
                      label='Новый пароль'
                      placeholder='Новый пароль'
                      onChange={inputChangeHandler}
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
                      onChange={inputChangeHandler}
                    />
                  </div>
                  <Button
                    type='link'
                    onClick={() => {
                      dispatch(setManagerProfile(manager));
                      setIsChangePassword(false);
                    }}
                  >
                    Отменить
                  </Button>
                </div>
              ) : (
                <div className={b('form-block form-block-password')}>
                  <Button
                    data-testid='button_change_password'
                    type='link'
                    onClick={() => setIsChangePassword(true)}
                  >
                    Сменить пароль
                  </Button>
                </div>
              )}

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
    </div>
  );
};

export default Profile;
