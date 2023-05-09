import { Button, Col, Form, message } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';

import AlertComponent from 'components/AlertComponent/AlertComponent';
import FormField from 'components/FormField/FormField';
import 'components/ModalComponent/ModalChildrenComponents/RequestRegisterModal/_requestRegisterModal.scss';
import { getErrorMessage, removeEmptyValuesFromObject } from 'helper';
import { accountsSelector, approveFieldClimateRequest } from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

type Props = {
  onClose: () => void;
};

const RequestRegisterModal: React.FC<Props> = ({ onClose }) => {
  const b = bem('RequestRegisterModal');
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { inquiriesLoading: loading, inquiriesSuccess } = useAppSelector(accountsSelector);
  const [userData, setUserData] = useState({
    user: {
      last_name: '',
      first_name: '',
      middle_name: '',
      email: '',
      phone: '',
    },
    name: '',
    location: '',
  });

  useEffect(() => {
    if (userData) {
      form.setFieldsValue({
        first_name: userData?.user.first_name,
        last_name: userData?.user.last_name,
        middle_name: userData?.user.middle_name,
        email: userData?.user.email,
        phone: userData?.user.phone,
        name: userData?.name,
        location: userData?.location,
      });
    }
  }, [userData, form]);

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === 'location' || name === 'name') {
      setUserData({ ...userData, [name]: value });
    } else {
      setUserData((prevUserData) => ({
        ...prevUserData,
        user: {
          ...prevUserData.user,
          [name]: value,
        },
      }));
    }
  };

  const onFinish = async () => {
    try {
      if (userData) {
        const data = removeEmptyValuesFromObject(userData);
        const registerUserObj = {
          category: 1,
          data: {
            user: {
              ...data.user,
            },
            enterprise: {
              name: data.name,
              location: data.location,
            },
          },
        };
        await dispatch(inquiriesRequests(registerUserObj)).unwrap();
        onClose();
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e, 'username');
      await message.error(`${errorMessage}`);
    }
  };

  const successSend = (
    <>
      <AlertComponent
        message='Спасибо за заявку. Ваш запрос был отправлен модератору'
        type='info'
        showIcon
      />
      <Button
        className={b('close-form-button')}
        type='primary'
        style={{ width: '100%', borderRadius: 4, marginTop: 40 }}
        onClick={onClose}
      >
        Закрыть
      </Button>
    </>
  );

  return inquiriesSuccess ? (
    successSend
  ) : (
    <Col
      className={b('')}
      xs={{ span: 24, offset: 0 }}
      md={{ span: 24, offset: 0 }}
      lg={{ span: 24, offset: 0 }}
    >
      <p style={{ marginBottom: 25 }}>После отправки заявки с вами свяжется наш менеджер.</p>
      <Form
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete='off'
        layout='vertical'
      >
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
            rules={[{ required: true, message: 'Введите фамилию' }]}
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
            rules={[{ required: true, message: 'Введите имя' }]}
          />
        </div>

        <FormField
          bordered
          data-testid='middle_name_id'
          id='missle_name_id'
          inputClassName={b('username')}
          label='Отчество'
          name='middle_name'
          placeholder='Отчество'
          onChange={inputChangeHandler}
          rules={[{ required: true, message: 'Введите отчество' }]}
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
            rules={[
              {
                type: 'email',
                message: 'Введен неверный E-mail!',
              },
            ]}
          />

          <FormField
            bordered
            type='phone'
            className='username'
            name='phone'
            label='Номер телефона'
            placeholder='Номер телефона'
            onChange={inputChangeHandler}
            rules={[{ required: true, message: 'Введите номер телефона' }]}
          />
        </div>

        <FormField
          bordered
          data-testid='name_of_farm_id'
          id='name_of_farm_id'
          inputClassName={b('username')}
          label='Название колхоза/фермы/компании'
          name='name'
          placeholder='Название колхоза/фермы/компании'
          onChange={inputChangeHandler}
          rules={[{ required: true, message: 'Введите название' }]}
        />

        <FormField
          bordered
          data-testid='location_id'
          id='location_id'
          inputClassName={b('username')}
          label='Регион расположения'
          name='location'
          placeholder='Регион расположения'
          onChange={inputChangeHandler}
          rules={[{ required: true, message: 'Введите регион' }]}
        />

        <div className={b('form-modal-buttons')}>
          <Button
            type='primary'
            htmlType='submit'
            loading={loading}
            style={{ width: '100%', borderRadius: 4 }}
            className={b('login-form-button')}
          >
            Отправить запрос
          </Button>
        </div>
      </Form>
    </Col>
  );
};

export default RequestRegisterModal;
