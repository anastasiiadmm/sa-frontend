import { Button, Col, Form, message, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';

import Errors from 'components/Errors/Errors';
import FormField from 'components/FormField/FormField';
import EditUserProfileModal from 'components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/EditUserProfileModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import { IMyData, IMyDataApi } from 'interfaces';
import { accountsSelector, requestChangeProfile } from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

import 'containers/User/Profile/_profile.scss';

const { Title } = Typography;

const Profile = () => {
  const b = bem('Profile');
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { account, fetchErrorAccount, fetchLoadingAccount, changeProfileLoading } =
    useAppSelector(accountsSelector);
  const [data, setData] = useState<IMyDataApi>({
    data: {
      user: {
        last_name: '',
        first_name: '',
        middle_name: '',
        email: '',
        phone: '',
        username: '',
      },
      enterprise: {
        name: '',
        location: '',
        autopilots_amount: '',
      },
    },
  });

  useEffect(() => {
    if (account) {
      form.setFieldsValue({
        username: account?.username,
        last_name: account?.last_name,
        first_name: account?.first_name,
        middle_name: account?.middle_name,
        email: account?.email,
        phone: account?.phone,
        name: account?.company?.name,
        location: account?.company?.location,
        autopilots_amount: account?.company?.autopilots_amount,
      });
    }
  }, [account, form]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOkCancel = () => {
    setIsModalOpen(!isModalOpen);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [objName, propName] = name.split(',');
    setData((prevData: IMyData | any) => {
      const updatedObj = { ...prevData?.[objName], [propName]: value };
      return { ...prevData, [objName]: updatedObj };
    });
  };

  const onClickSendDataHandler = async () => {
    try {
      const changeUserObj: any = {
        category: 2,
        object_id: account?.id,
        data,
      };
      await dispatch(requestChangeProfile(changeUserObj)).unwrap();
      await setIsModalOpen(false);
    } catch (e) {
      await setIsModalOpen(false);
      await message.error(
        e?.response?.data?.non_field_errors[0] === 'Inquiry has already been sent to manager.'
          ? 'Запрос ранне был отправлен. Дождитесь подтверждения.'
          : 'Произошла ошибка.',
      );
    }
  };

  if (fetchErrorAccount) {
    return <Errors status={fetchErrorAccount.status} detail={fetchErrorAccount.detail} />;
  }

  return (
    <>
      <div className={b()} data-testid='user-profile-id'>
        <div className='layout'>
          {fetchLoadingAccount ? (
            <SkeletonBlock active={fetchLoadingAccount} num={1} titleBool />
          ) : (
            <Col
              className={b('')}
              xs={{ span: 20, offset: 2 }}
              md={{ span: 18, offset: 3 }}
              lg={{ span: 11, offset: 1 }}
            >
              <div className={b('title')}>
                <Title level={3} data-testid='sign_in_test' className={b('title')}>
                  Профиль
                </Title>
                <p>
                  Для того чтобы изменить или добавить информацию в вашем профиле обратись к вашему
                  менеджеру.
                </p>
                <Button onClick={showModal} type='link' className={b('request_link')}>
                  Запрос на изменение личной информации
                </Button>
              </div>

              <Form
                form={form}
                initialValues={{ remember: true }}
                autoComplete='off'
                layout='vertical'
              >
                <FormField
                  readOnly
                  className='label-styles'
                  data-testid='username_id'
                  id='username_id'
                  inputClassName={b('input-styles')}
                  label='Username'
                  name='username'
                  placeholder='Username'
                />

                <div className={b('form-block')}>
                  <FormField
                    readOnly
                    className='label-styles'
                    inputClassName={b('input-styles')}
                    data-testid='last_name_id'
                    id='last_name_id'
                    label='Фамилия'
                    name='last_name'
                    placeholder='Фамилия'
                  />
                  <FormField
                    readOnly
                    className='label-styles'
                    inputClassName={b('input-styles')}
                    data-testid='first_name_id'
                    id='first_name_id'
                    label='Имя'
                    name='first_name'
                    placeholder='Имя'
                  />
                  <FormField
                    readOnly
                    className='label-styles'
                    inputClassName={b('input-styles')}
                    data-testid='surname_id'
                    id='middle_name_id'
                    label='Отчество'
                    name='middle_name'
                    placeholder='Отчество'
                  />
                </div>

                <div className={b('form-block')}>
                  <FormField
                    readOnly
                    className='label-styles'
                    inputClassName={b('input-styles')}
                    data-testid='email_id_login'
                    type='email'
                    id='email_id'
                    label='Email'
                    name='email'
                    placeholder='Email'
                  />

                  <FormField
                    readOnly
                    className='label-styles'
                    inputClassName={b('input-styles')}
                    type='phone'
                    name='phone'
                    label='Номер телефона'
                    placeholder='Номер телефона'
                  />
                </div>

                <FormField
                  readOnly
                  className='label-styles'
                  inputClassName={b('input-styles')}
                  data-testid='name_id'
                  id='name_id'
                  label='Название колхоза/фермы/компании'
                  name='name'
                  placeholder='Название колхоза/фермы/компании'
                />

                <FormField
                  readOnly
                  className='label-styles'
                  inputClassName={b('input-styles')}
                  data-testid='location_id'
                  id='location_id'
                  label='Регион расположения'
                  name='location'
                  placeholder='Регион расположения'
                />

                <FormField
                  className='label-styles'
                  readOnly
                  inputClassName={b('input-styles')}
                  data-testid='autopilots_amount_id'
                  id='autopilots_amount_id'
                  label='Количество оплаченных блоков автопилота'
                  name='autopilots_amount'
                  placeholder='Количество оплаченных блоков автопилота'
                />
              </Form>
            </Col>
          )}
        </div>
      </div>

      <ModalComponent
        title='Запрос на изменение личной информации'
        open={isModalOpen}
        handleOk={handleOkCancel}
        handleCancel={handleOkCancel}
      >
        <EditUserProfileModal
          onClick={onClickSendDataHandler}
          account={account}
          inputChangeHandler={inputChangeHandler}
          loading={changeProfileLoading}
        />
      </ModalComponent>
    </>
  );
};

export default Profile;
