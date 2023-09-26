import { Button, Form } from 'antd';
import bem from 'easy-bem';
import React, { useEffect } from 'react';

import FormField from 'components/FormField/FormField';
import useWindowWidth from 'hooks/useWindowWidth';
import { accountsManagerConfirmation, userMutation } from 'interfaces';

import 'components/ModalComponent/ModalChildrenComponents/CreateNewUserCredentials/_createNewUserCredentials.scss';

interface Props {
  userCreateData?: userMutation | null;
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
  const windowWidth = useWindowWidth();
  useEffect(() => {
    if (userCreateData) {
      form.setFieldsValue({
        username: userCreateData?.username,
        password: userCreateData?.password,
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
    <div className={b()}>
      {windowWidth < 600 && <h3>Логин и пароль</h3>}
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
          name='username'
          placeholder='Логин'
          inputClassName={b('username-info')}
        />

        <div className={b('mt_success')}>
          <FormField
            readOnly
            data-testid='generated_password_id'
            id='generated_password_id'
            label='Пароль'
            name='password'
            placeholder='Пароль'
            inputClassName={b('username-info')}
          />
        </div>
      </Form>

      <div className={b('profile-buttons')}>
        <Button
          size='large'
          type='primary'
          style={{ width: '100%', borderRadius: 6, marginTop: 10 }}
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
