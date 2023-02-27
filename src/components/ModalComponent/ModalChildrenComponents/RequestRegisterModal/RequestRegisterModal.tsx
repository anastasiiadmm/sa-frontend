import { Button, Col, Form } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import FormField from 'components/FormField/FormField';
import 'components/ModalComponent/ModalChildrenComponents/RequestRegisterModal/_requestRegisterModal.scss';

const RequestRegisterModal = () => {
  const b = bem('RequestRegisterModal');
  const [form] = Form.useForm();

  const onFinish = (values: any) => {};

  /*  const successSend = (
    <>
      <AlertComponent
        message='Спасибо за заявку. Ваш запрос был отправлен модератору'
        type='info'
        showIcon
      />
      <Button
        className={b('close-form-button')}
        type='primary'
        style={{ width: '100%', borderRadius: 4 }}
      >
        Закрыть
      </Button>
    </>
  ); */

  return (
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
          inputClassName={b('username')}
          label='Отчество'
          name='surname'
          placeholder='Отчество'
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

        <div className={b('form-modal-buttons')}>
          <Button
            // disabled={!!commonError}
            type='primary'
            htmlType='submit'
            // loading={!!loading}
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
