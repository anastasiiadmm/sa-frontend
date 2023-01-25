import { Button, Form } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import AlertComponent from 'components/AlertComponent/AlertComponent';
import FormField from 'components/FormField/FormField';
import 'containers/SignIn/_signIn.scss';

type Props = {};

const ModalPasswordReset: React.FC<Props> = () => {
  const b = bem('SignIn');
  const onFinish = () => {};

  return (
    <>
      <AlertComponent
        message='Для восстановления пароля к вашей учетной записи введите ваш email'
        type='info'
        showIcon
      />
      <Form
        style={{ marginTop: 20 }}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        className='login-form'
        autoComplete='off'
        layout='vertical'
      >
        <FormField
          data-testid='email_id_login'
          type='email'
          id='email_id'
          name='email'
          label='Ваш email'
        />
        <Button
          className={b('login-form-button')}
          type='primary'
          style={{ width: '100%', borderRadius: 4 }}
        >
          Продолжить
        </Button>
      </Form>
    </>
  );
};

export default ModalPasswordReset;
