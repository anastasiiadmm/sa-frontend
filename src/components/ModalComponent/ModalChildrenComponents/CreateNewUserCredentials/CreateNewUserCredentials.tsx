import { Button, Form } from 'antd';
import bem from 'easy-bem';
import React, { useEffect } from 'react';

import FormField from 'components/FormField/FormField';
import { accountsManagerConfirmation, PostNewUser } from 'types/types';
import 'components/ModalComponent/ModalChildrenComponents/CreateNewUserCredentials/_createNewUserCredentials.scss';

interface Props {
  userCreateData?: PostNewUser | null;
  requestRegisterUserData?: accountsManagerConfirmation | null;
  handleOkCancel: () => void;
}

const CreateNewUserCredentials: React.FC<Props> = ({
  handleOkCancel,
  userCreateData,
  requestRegisterUserData,
}) => {
  const b = bem('CreateNewUserCredentials');
  const [form] = Form.useForm();

  useEffect(() => {
    if (userCreateData) {
      form.setFieldsValue({
        user: {
          username: userCreateData?.user?.username,
          generated_password: userCreateData?.user?.generated_password,
        },
      });
    }

    if (requestRegisterUserData) {
      form.setFieldsValue({
        username: requestRegisterUserData?.username,
        password: requestRegisterUserData?.password,
      });
    }
  }, [userCreateData, requestRegisterUserData, form]);

  return (
    <div>
      <p className={b('text')}>Пожалуйста отправьте эти данные пользователю</p>

      <Form
        form={form}
        initialValues={userCreateData ? { userCreateData } : { requestRegisterUserData }}
        autoComplete='off'
        layout='vertical'
      >
        <FormField
          readOnly
          data-testid='username_id'
          id='username_id'
          label='Логин'
          name={userCreateData ? ['user', 'username'] : 'username'}
          placeholder='Логин'
          inputClassName={b('username-info')}
        />

        <div className={b('mt_success')}>
          <FormField
            readOnly
            data-testid='generated_password_id'
            id='generated_password_id'
            label='Пароль'
            name={userCreateData ? ['user', 'generated_password'] : 'password'}
            placeholder='Пароль'
            inputClassName={b('username-info')}
          />
        </div>
      </Form>

      <div className={b('profile-buttons')}>
        <Button
          type='primary'
          style={{ width: '100%', borderRadius: 4 }}
          className={b('save-button')}
          onClick={handleOkCancel}
        >
          Готово
        </Button>
      </div>
    </div>
  );
};

export default CreateNewUserCredentials;
