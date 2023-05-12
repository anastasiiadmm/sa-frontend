import { Button, Col, Form } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';

import FormField from 'components/FormField/FormField';
import { IAccount, ICompany, requestUserProfileData } from 'types/types';
import 'components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/_editUserProfileModal.scss';

interface Props {
  updateUserData?: requestUserProfileData | ICompany | Object | null;
  account?: IAccount | null | undefined;
  changeUserInfoRequest?: boolean;
  validateForm?: boolean;
  loading?: boolean;
  handleOkCancel?: () => void;
  showRejectModal?: () => void;
  inputChangeHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFinish?: (values: any) => void;
  onClick?: () => void;
}

const EditUserProfileModal: React.FC<Props> = ({
  updateUserData,
  loading,
  account,
  validateForm,
  inputChangeHandler,
  changeUserInfoRequest = false,
  handleOkCancel,
  showRejectModal,
  onFinish,
  onClick,
}) => {
  const b = bem('EditUserProfileModal');
  const [form] = Form.useForm();
  const [formValid, setFormValid] = useState(true);

  useEffect(() => {
    if (updateUserData) {
      if ('email' in updateUserData) {
        form.setFieldsValue({
          email: updateUserData?.email,
          first_name: updateUserData?.first_name,
          image: updateUserData?.image,
          last_name: updateUserData?.last_name,
          middle_name: updateUserData?.middle_name,
          phone: updateUserData?.phone,
          username: updateUserData?.username,
          company: {
            autopilots_amount: updateUserData?.company?.autopilots_amount,
            location: updateUserData?.company?.location,
            name: updateUserData?.company?.name,
          },
        });
      }
    }
  }, [updateUserData, form]);

  useEffect(() => {
    if (account) {
      if (account) {
        form.setFieldsValue({
          user: {
            username: account?.username,
            last_name: account?.last_name,
            first_name: account?.first_name,
            middle_name: account?.middle_name,
            email: account?.email,
            phone: account?.phone,
          },
          enterprise: {
            name: account?.company?.name,
            location: account?.company?.location,
            autopilots_amount: account?.company?.autopilots_amount,
          },
        });
      }
    }
  }, [account]);

  return (
    <Col
      className={b('')}
      xs={{ span: 24, offset: 0 }}
      md={{ span: 24, offset: 0 }}
      lg={{ span: 24, offset: 0 }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        autoComplete='off'
        layout='vertical'
        onValuesChange={() =>
          setFormValid(form.getFieldsError().some((item) => item.errors.length > 0))
        }
      >
        {changeUserInfoRequest ? (
          <div className={b('form-modal-block')}>
            <FormField
              readOnly
              data-testid='name_id'
              id='name_id'
              inputClassName={b('username-info')}
              label='ФИО'
              name='name'
              placeholder='ФИО'
            />
            <FormField
              readOnly
              data-testid='email_id'
              id='email_id'
              inputClassName={b('username-info')}
              label='Email'
              name='email'
              placeholder='Email'
            />
            <FormField
              readOnly
              type='phone'
              className='username'
              name='phone_number'
              label='Номер телефона'
              placeholder='Номер телефона'
              inputClassName={b('username-info')}
            />
          </div>
        ) : null}

        <FormField
          bordered
          data-testid='username_id'
          id='username_id'
          inputClassName={b('username')}
          label='Username'
          name={account ? ['user', 'username'] : 'username'}
          placeholder='Username'
          onChange={inputChangeHandler}
          rules={[{ required: true, message: 'Введите username' }]}
        />

        <div className={b('form-modal-block')}>
          <FormField
            bordered
            data-testid='first_name_id'
            id='first_name_id'
            inputClassName={b('username')}
            label='Фамилия'
            name={account ? ['user', 'first_name'] : 'first_name'}
            placeholder='Фамилия'
            onChange={inputChangeHandler}
            rules={[{ required: true, message: 'Введите фамилию' }]}
          />

          <FormField
            bordered
            data-testid='last_name_id'
            id='last_name_id'
            inputClassName={b('username')}
            label='Имя'
            name={account ? ['user', 'last_name'] : 'last_name'}
            placeholder='Имя'
            onChange={inputChangeHandler}
            rules={[{ required: true, message: 'Введите имя' }]}
          />
        </div>

        <FormField
          bordered
          data-testid='middle_name_id'
          id='middle_name_id'
          label='Отчество'
          name={account ? ['user', 'middle_name'] : 'middle_name'}
          placeholder='Отчество'
          onChange={inputChangeHandler}
        />

        <div className={b('form-modal-block')}>
          <FormField
            bordered
            data-testid='email_id_login'
            type='email'
            id='email_id'
            inputClassName={b('username')}
            label='Email'
            name={account ? ['user', 'email'] : 'email'}
            placeholder='Email'
            onChange={inputChangeHandler}
            rules={[{ required: true, message: 'Введите Email' }]}
          />

          <FormField
            bordered
            type='phone'
            className='username'
            name={account ? ['user', 'phone'] : 'phone'}
            label='Номер телефона'
            placeholder='Номер телефона'
            onChange={inputChangeHandler}
          />
        </div>

        <FormField
          bordered
          data-testid='name_id'
          id='name_id'
          inputClassName={b('username')}
          label='Название колхоза/фермы/компании'
          name={account ? ['enterprise', 'name'] : ['company', 'name']}
          placeholder='Название колхоза/фермы/компании'
          onChange={inputChangeHandler}
          rules={[{ required: true, message: 'Введите название колхоза/фермы/компании' }]}
        />

        <FormField
          bordered
          data-testid='location_id'
          id='location_id'
          inputClassName={b('username')}
          label='Регион расположения'
          name={account ? ['enterprise', 'location'] : ['company', 'location']}
          placeholder='Регион расположения'
          onChange={inputChangeHandler}
          rules={[{ required: true, message: 'Введите регион расположения' }]}
        />

        <FormField
          bordered
          data-testid='autopilots_amount_id'
          id='autopilots_amount_id'
          inputClassName={b('username')}
          label='Количество оплаченных блоков автопилота'
          name={account ? ['enterprise', 'autopilots_amount'] : ['company', 'autopilots_amount']}
          placeholder='Количество оплаченных блоков автопилота'
          onChange={inputChangeHandler}
        />

        <div className={b('profile-buttons')}>
          {changeUserInfoRequest ? (
            <>
              <Button
                type='primary'
                style={{ width: '100%', borderRadius: 4 }}
                className={b('delete-button')}
                onClick={() => {
                  if (showRejectModal) {
                    showRejectModal();
                  }
                  if (handleOkCancel) {
                    handleOkCancel();
                  }
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
            </>
          ) : (
            <Button
              onClick={onClick}
              disabled={validateForm || formValid}
              type='primary'
              htmlType='submit'
              loading={loading}
              style={{ width: '100%', borderRadius: 4 }}
              className={b('save-button')}
            >
              Сохранить изменения
            </Button>
          )}
        </div>
      </Form>
    </Col>
  );
};

export default EditUserProfileModal;
