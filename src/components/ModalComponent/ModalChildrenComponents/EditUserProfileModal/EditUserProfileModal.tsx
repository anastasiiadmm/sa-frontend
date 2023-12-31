import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form } from 'antd';
import bem from 'easy-bem';
import React, { useEffect } from 'react';

import FormField from 'components/FormField/FormField';
import useWindowWidth from 'hooks/useWindowWidth';
import { IAccount, ICompany, RequestType } from 'interfaces';
import { apiUrlCrop } from 'utils/config';
import 'components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/_editUserProfileModal.scss';

interface Props {
  updateUserData?: IAccount | ICompany | Object | null;
  account?: IAccount | null | undefined;
  userInfo?: RequestType | null;
  userId?: number | null;
  userInfoLoading?: boolean;
  changeUserInfoRequest?: boolean;
  validateForm?: boolean;
  loading?: boolean;
  handleOkCancel?: () => void;
  showRejectModal?: () => void;
  prevButtonHandler?: () => void;
  inputChangeHandler?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFinish?: (values: any) => void;
  onClick?: () => void;
  formValid?: boolean;
  image?: File | null;
  onFileChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onValuesChange?: (changedValues: any, allValues: any) => void;
}

const EditUserProfileModal: React.FC<Props> = ({
  updateUserData,
  loading,
  account,
  validateForm,
  inputChangeHandler,
  changeUserInfoRequest = false,
  prevButtonHandler,
  handleOkCancel,
  showRejectModal,
  onFinish,
  onClick,
  userInfo,
  onFileChange,
  image,
  formValid,
  onValuesChange,
}) => {
  const b = bem('EditUserProfileModal');
  const [form] = Form.useForm();
  const windowWidth = useWindowWidth();

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
  }, [account]);

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        name: userInfo?.requestor?.name,
        email: userInfo?.requestor?.email,
        phone: userInfo?.requestor?.phone,
        user: {
          username: userInfo?.data?.user?.username,
          last_name: userInfo?.data?.user?.last_name,
          first_name: userInfo?.data?.user?.first_name,
          middle_name: userInfo?.data?.user?.middle_name,
          email: userInfo?.data?.user?.email,
          phone: userInfo?.data?.user?.phone,
        },
        enterprise: {
          name: userInfo?.data?.enterprise?.name,
          location: userInfo?.data?.enterprise?.location,
        },
      });
    }
  }, [userInfo, form]);

  return (
    <Col xs={{ span: 24, offset: 0 }} md={{ span: 24, offset: 0 }} lg={{ span: 24, offset: 0 }}>
      <Form
        form={form}
        onFinish={onFinish}
        autoComplete='off'
        layout='vertical'
        className={b('form_block_edit')}
        onValuesChange={onValuesChange}
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
              name='phone'
              label='Номер телефона'
              placeholder='Номер телефона'
              inputClassName={b('username-info')}
            />
          </div>
        ) : null}

        {updateUserData ? null : (
          <div className={b('image-upload')}>
            <label htmlFor='image-input'>
              {image ? (
                <Avatar
                  size={64}
                  src={URL.createObjectURL(image)}
                  style={{ cursor: 'pointer' }}
                  className={b('avatar')}
                />
              ) : (
                <Avatar
                  size={64}
                  src={
                    account?.image
                      ? `${apiUrlCrop}${account?.image}`
                      : userInfo?.uploaded_files?.length
                      ? `${apiUrlCrop}${userInfo?.uploaded_files?.[0]?.file}`
                      : ''
                  }
                  style={{ cursor: 'pointer' }}
                  icon={<UserOutlined />}
                />
              )}
            </label>

            <input
              data-testid='image-input'
              id='image-input'
              type='file'
              onChange={onFileChange}
              accept='image/png, image/gif, image/jpeg'
            />
          </div>
        )}

        <FormField
          bordered
          data-testid='username_id'
          id='username_id'
          inputClassName={b('username')}
          label='Username'
          name={account || userInfo ? ['user', 'username'] : 'username'}
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
            name={account || userInfo ? ['user', 'last_name'] : 'last_name'}
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
            name={account || userInfo ? ['user', 'first_name'] : 'first_name'}
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
          name={account || userInfo ? ['user', 'middle_name'] : 'middle_name'}
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
            name={account || userInfo ? ['user', 'email'] : 'email'}
            placeholder='Email'
            onChange={inputChangeHandler}
            rules={[
              { required: true, message: 'Введите Email' },
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
            name={account || userInfo ? ['user', 'phone'] : 'phone'}
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
          name={account || userInfo ? ['enterprise', 'name'] : ['company', 'name']}
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
          name={account || userInfo ? ['enterprise', 'location'] : ['company', 'location']}
          placeholder='Регион расположения'
          onChange={inputChangeHandler}
          rules={[{ required: true, message: 'Введите регион расположения' }]}
        />

        {changeUserInfoRequest || account ? null : (
          <FormField
            bordered
            data-testid='autopilots_amount_id'
            id='autopilots_amount_id'
            inputClassName={b('username')}
            label='Количество оплаченных блоков автопилота'
            name={userInfo ? ['enterprise', 'autopilots_amount'] : ['company', 'autopilots_amount']}
            placeholder='Количество оплаченных блоков автопилота'
            onChange={inputChangeHandler}
          />
        )}

        <div className={b('profile-buttons')}>
          {changeUserInfoRequest ? (
            <>
              <Button
                size='large'
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
                Отклонить
              </Button>

              <Button
                size='large'
                data-testid='approve_button_id'
                onClick={onClick}
                type='primary'
                htmlType='submit'
                loading={loading}
                style={{ width: '100%', borderRadius: 4 }}
                className={b('save-button')}
              >
                Подтвердить
              </Button>
            </>
          ) : (
            <>
              {windowWidth <= 990 && updateUserData ? (
                <Button
                  data-testid='save_button_id'
                  onClick={prevButtonHandler}
                  type='primary'
                  htmlType='submit'
                  className={b('cancel-profile-button')}
                >
                  Отменить
                </Button>
              ) : null}
              <Button
                data-testid='save_button_id'
                onClick={onClick}
                disabled={validateForm || formValid}
                type='primary'
                htmlType='submit'
                loading={loading}
                style={{ width: '100%', borderRadius: 12 }}
                className={b('save-button')}
              >
                Сохранить
              </Button>
            </>
          )}
        </div>
      </Form>
    </Col>
  );
};

export default EditUserProfileModal;
