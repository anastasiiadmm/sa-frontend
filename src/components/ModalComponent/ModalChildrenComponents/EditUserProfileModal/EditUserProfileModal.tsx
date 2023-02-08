import { Button, Col, Form } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import FormField from 'components/FormField/FormField';
import 'components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/_editUserProfileModal.scss';

const EditUserProfileModal = () => {
  const b = bem('EditUserProfileModal');
  const [form] = Form.useForm();

  const onFinish = (values: any) => {};

  return (
    <Col
      className={b('')}
      xs={{ span: 20, offset: 2 }}
      md={{ span: 18, offset: 3 }}
      lg={{ span: 22, offset: 1 }}
    >
      <Form
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete='off'
        layout='vertical'
      >
        <FormField
          bordered
          data-testid='username_id'
          id='username_id'
          inputClassName={b('username')}
          label='Username'
          name='username'
          placeholder='Username'
        />

        <div className={b('form-modal-block')}>
          <FormField
            bordered
            id='password_id'
            type='password'
            className='username'
            name='password'
            label='Пароль'
            placeholder='Пароль'
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
          />
        </div>

        <div className={b('form-modal-block')}>
          <FormField
            bordered
            data-testid='first_name_id'
            id='first_name_id'
            inputClassName={b('username')}
            label='Фамилия'
            name='first_name'
            placeholder='Фамилия'
          />

          <FormField
            bordered
            data-testid='last_name_id'
            id='last_name_id'
            inputClassName={b('username')}
            label='Имя'
            name='last_name'
            placeholder='Имя'
          />
        </div>

        <FormField
          bordered
          data-testid='surname_id'
          id='surname_id'
          label='Отчество'
          name='surname'
          placeholder='Отчество'
        />

        <div className={b('form-modal-block')}>
          <FormField
            bordered
            data-testid='email_id_login'
            type='email'
            id='email_id'
            inputClassName={b('username')}
            label='Email'
            name='email'
            placeholder='Email'
          />

          <FormField
            bordered
            type='phone'
            className='username'
            name='phone'
            label='Номер телефона'
            placeholder='Номер телефона'
          />
        </div>

        <FormField
          bordered
          data-testid='name_of_farm_id'
          id='name_of_farm_id'
          inputClassName={b('username')}
          label='Название колхоза/фермы/компании'
          name='name_of_farm'
          placeholder='Название колхоза/фермы/компании'
        />

        <FormField
          bordered
          data-testid='region_id'
          id='region_id'
          inputClassName={b('username')}
          label='Регион расположения'
          name='region'
          placeholder='Регион расположения'
        />

        <FormField
          bordered
          data-testid='amount_id'
          id='amount_id'
          inputClassName={b('username')}
          label='Количество оплаченных блоков автопилота'
          name='amount'
          placeholder='Количество оплаченных блоков автопилота'
        />

        <div className={b('profile-buttons')}>
          <Button
            // disabled={!!commonError}
            type='primary'
            htmlType='submit'
            // loading={!!loading}
            style={{ width: '100%', borderRadius: 4 }}
            className={b('save-button')}
          >
            Сохранить изменения
          </Button>
        </div>
      </Form>
    </Col>
  );
};

export default EditUserProfileModal;
