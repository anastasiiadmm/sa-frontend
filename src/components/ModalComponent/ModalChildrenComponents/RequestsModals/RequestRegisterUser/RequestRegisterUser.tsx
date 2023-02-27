import { Button, Col, Form } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import 'components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestRegisterUser/_requestRegisterUser.scss';
import FormField from 'components/FormField/FormField';

interface Props {
  handleOkCancel: () => void;
  showRejectModal: () => void;
}

const RequestRegisterUser: React.FC<Props> = ({ handleOkCancel, showRejectModal }) => {
  const b = bem('RequestRegisterUser');
  const [form] = Form.useForm();

  const onFinish = (values: any) => {};

  return (
    <Col
      className={b('')}
      xs={{ span: 24, offset: 0 }}
      md={{ span: 24, offset: 0 }}
      lg={{ span: 24, offset: 0 }}
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
          label='Название техники'
          name='Username'
          placeholder='Название техники'
        />

        <div className={b('form-block')}>
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
            placeholder='Подтвердить пароль'
          />
        </div>

        <div className={b('form-block info-block')}>
          <FormField
            readOnly
            data-testid='last_name_id'
            id='last_name_id'
            inputClassName={b('username-info')}
            label='Фамилия'
            name='last_name'
            placeholder='Фамилия'
          />
          <FormField
            readOnly
            data-testid='first_name_id'
            id='first_name_id'
            inputClassName={b('username-info')}
            label='Имя'
            name='first_name'
            placeholder='Имя'
          />
          <FormField
            readOnly
            data-testid='surname_id'
            id='surname_id'
            inputClassName={b('username-info')}
            label='Отчество'
            name='surname'
            placeholder='Отчество'
          />
        </div>

        <div className={b('form-block')}>
          <FormField
            readOnly
            data-testid='email_id'
            id='email_id'
            className={b('email-input')}
            inputClassName={b('username-info')}
            label='Email'
            name='email'
            placeholder='Email'
          />
          <FormField
            readOnly
            type='phone'
            className='username'
            name='phone'
            label='Номер телефона'
            placeholder='Номер телефона'
            inputClassName={b('username-info')}
          />
        </div>

        <FormField
          readOnly
          data-testid='farm_name_id'
          id='farm_name_id'
          inputClassName={b('username-info')}
          label='Название колхоза/фермы/компании'
          name='farm_name'
          placeholder='Название колхоза/фермы/компании'
        />

        <FormField
          data-testid='region_id'
          id='region_id'
          inputClassName={b('username-info')}
          label='Регион расположения'
          name='region'
          placeholder='Регион расположения'
        />

        <div className={b('profile-buttons')}>
          <Button
            type='primary'
            style={{ width: '100%', borderRadius: 4 }}
            className={b('delete-button')}
            onClick={() => {
              showRejectModal();
              handleOkCancel();
            }}
          >
            Отклонить запрос
          </Button>

          <Button
            // disabled={!!commonError}
            type='primary'
            htmlType='submit'
            // loading={!!loading}
            style={{ width: '100%', borderRadius: 4 }}
            className={b('save-button')}
          >
            Подтвердить запрос
          </Button>
        </div>
      </Form>
    </Col>
  );
};

export default RequestRegisterUser;
