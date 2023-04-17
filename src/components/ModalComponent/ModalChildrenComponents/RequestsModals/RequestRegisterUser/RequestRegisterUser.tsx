import { Button, Col, Form, message } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import FormField from 'components/FormField/FormField';
import CreateNewUserCredentials from 'components/ModalComponent/ModalChildrenComponents/CreateNewUserCredentials/CreateNewUserCredentials';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import {
  isObjectChangeUserConfirmationProfileValidate,
  mergeAndRemoveDuplicateValues,
} from 'helper';
import {
  accountManagerConfirmationRequest,
  accountsSelector,
  fetchRequests,
} from 'redux/accounts/accountsSlice';
import { updateUserInfo } from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { companiesList, UserIds } from 'types/types';
import 'components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestRegisterUser/_requestRegisterUser.scss';

interface Props {
  userInfo: companiesList | null;
  userIds: UserIds | null;
  userInfoLoading: boolean;
  handleOkCancel: () => void;
  showRejectModal: () => void;
}

const RequestRegisterUser: React.FC<Props> = ({
  userInfo,
  userIds,
  userInfoLoading,
  handleOkCancel,
  showRejectModal,
}) => {
  const b = bem('RequestRegisterUser');
  const [form] = Form.useForm();
  const history = useNavigate();
  const dispatch = useAppDispatch();
  const { accountManagerConfirmation, accountManagerConfirmationLoading } =
    useAppSelector(accountsSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
    autopilots_amount: 0,
  });
  const [validate, setValidate] = useState(false);

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        user: {
          last_name: userInfo?.user?.last_name,
          first_name: userInfo?.user?.first_name,
          middle_name: userInfo?.user?.middle_name,
          email: userInfo?.user?.email,
          phone: userInfo?.user?.phone,
        },
        name: userInfo?.name,
        autopilots_amount: userInfo?.autopilots_amount,
        location: userInfo?.location,
      });
    }
  }, [userInfo, form]);

  useEffect(() => {
    if (userInfo) {
      setUserData(userInfo);
    }
  }, [userInfo]);

  useEffect(() => {
    if (userInfo) {
      const validate = isObjectChangeUserConfirmationProfileValidate(userInfo, userData);
      setValidate(validate);
    }
  }, [userInfo, userData]);

  const showAgreeModal = () => {
    setIsModalOpen(true);
    handleOkCancel();
  };

  const handleAgreeOkCancel = async () => {
    await setIsModalOpen(!isModalOpen);
    history('/user-requests');
    const data = {
      query: {
        page: 1,
      },
    };
    await dispatch(fetchRequests({ data }));
    message.success('Новый пользователь успешно зарегистирирован!');
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('user,')) {
      const userKey = name.split(',')[1];
      setUserData((prevUserData) => ({
        ...prevUserData,
        user: {
          ...prevUserData.user,
          [userKey]: value,
        },
      }));
    } else if (name === 'autopilots_amount') {
      setUserData((prevUserData) => ({
        ...prevUserData,
        autopilots_amount: Number(value),
      }));
    } else {
      setUserData({ ...userData, [name]: value });
    }
  };

  const agreeHandler = async () => {
    try {
      if (validate) {
        const data = mergeAndRemoveDuplicateValues(userInfo, userData);
        await dispatch(updateUserInfo({ id: userInfo?.id?.toString(), data })).unwrap();
        message.success('Данные успешно изменены!');
      }
      await dispatch(accountManagerConfirmationRequest({ id: userIds?.requestId })).unwrap();
      showAgreeModal();
    } catch (e) {
      await message.error(`${e}`);
    }
  };

  return (
    <>
      <Col
        className={b('')}
        xs={{ span: 24, offset: 0 }}
        md={{ span: 24, offset: 0 }}
        lg={{ span: 24, offset: 0 }}
      >
        {userInfoLoading ? (
          <SkeletonBlock active={userInfoLoading} num={1} titleBool />
        ) : (
          <Form form={form} initialValues={{ userInfo }} autoComplete='off' layout='vertical'>
            <div className={b('form-block info-block')}>
              <FormField
                bordered
                data-testid='last_name_id'
                id='last_name_id'
                inputClassName={b('username-info')}
                label='Фамилия'
                name={['user', 'last_name']}
                placeholder='Фамилия'
                onChange={inputChangeHandler}
              />
              <FormField
                bordered
                data-testid='first_name_id'
                id='first_name_id'
                inputClassName={b('username-info')}
                label='Имя'
                name={['user', 'first_name']}
                placeholder='Имя'
                onChange={inputChangeHandler}
              />
            </div>

            <FormField
              bordered
              data-testid='middle_name_id'
              id='middle_name_id'
              inputClassName={b('username-info')}
              label='Отчество'
              name={['user', 'middle_name']}
              placeholder='Отчество'
              onChange={inputChangeHandler}
            />

            <div className={b('form-block info-block')}>
              <FormField
                bordered
                data-testid='email_id'
                id='email_id'
                inputClassName={b('username-info')}
                label='Email'
                name={['user', 'email']}
                placeholder='Email'
                onChange={inputChangeHandler}
              />
              <FormField
                bordered
                type='phone'
                className='username'
                name={['user', 'phone']}
                label='Номер телефона'
                placeholder='Номер телефона'
                inputClassName={b('username-info')}
                onChange={inputChangeHandler}
              />
            </div>

            <FormField
              bordered
              data-testid='name_id'
              id='name_id'
              inputClassName={b('username-info')}
              label='Название колхоза/фермы/компании'
              name='name'
              placeholder='Название колхоза/фермы/компании'
              onChange={inputChangeHandler}
            />

            <FormField
              bordered
              data-testid='location_id'
              id='location_id'
              inputClassName={b('username-info')}
              label='Регион расположения'
              name='location'
              placeholder='Регион расположения'
              onChange={inputChangeHandler}
            />

            <FormField
              bordered
              data-testid='autopilots_amount_id'
              id='autopilots_amount_id'
              inputClassName={b('username-info')}
              label='Количество оплаченных блоков автопилота'
              name='autopilots_amount'
              placeholder='Количество оплаченных блоков автопилота'
              onChange={inputChangeHandler}
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
                type='primary'
                htmlType='submit'
                loading={accountManagerConfirmationLoading}
                style={{ width: '100%', borderRadius: 4 }}
                className={b('save-button')}
                onClick={agreeHandler}
              >
                Подтвердить запрос
              </Button>
            </div>
          </Form>
        )}
      </Col>

      <ModalComponent
        title='Логин и пароль'
        open={isModalOpen}
        dividerShow={false}
        handleOk={handleAgreeOkCancel}
        handleCancel={() => setIsModalOpen(false)}
        classNameTitle='title_signIn'
      >
        <CreateNewUserCredentials
          handleOkCancel={handleAgreeOkCancel}
          requestRegisterUserData={accountManagerConfirmation}
        />
      </ModalComponent>
    </>
  );
};

export default RequestRegisterUser;
