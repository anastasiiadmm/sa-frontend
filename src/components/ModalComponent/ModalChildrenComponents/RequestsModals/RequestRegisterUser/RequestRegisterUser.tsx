import { Button, Col, Form, message } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

import FormField from 'components/FormField/FormField';
import CreateNewUserCredentials from 'components/ModalComponent/ModalChildrenComponents/CreateNewUserCredentials/CreateNewUserCredentials';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import { RequestType } from 'interfaces';
import {
  accountManagerConfirmationRequest,
  accountsSelector,
  fetchRequests,
} from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { getErrorMessage, isEmptyObject, mergeAndRemoveDuplicateValues } from 'utils/helper';
import 'components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestRegisterUser/_requestRegisterUser.scss';

interface Props {
  userInfo: RequestType | null;
  userId: number | null;
  userInfoLoading: boolean;
  handleOkCancel: () => void;
  showRejectModal: () => void;
}

const RequestRegisterUser: React.FC<Props> = ({
  userInfo,
  userId,
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
  const [userData, setUserData] = useState<RequestType>({
    category: 0,
    created_at: '',
    id: 0,
    object_id: 0,
    requestor: null,
    uploaded_files: null,
    data: {
      user: {
        last_name: '',
        first_name: '',
        middle_name: '',
        email: '',
        phone: '',
      },
      enterprise: {
        name: '',
        location: '',
      },
    },
  });

  useEffect(() => {
    if (userInfo) {
      form.setFieldsValue({
        data: {
          user: {
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
        },
      });
    }
  }, [userInfo, form]);

  useEffect(() => {
    if (userInfo) {
      setUserData(userInfo);
    }
  }, [userInfo]);

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

    if (name.startsWith('data,user,')) {
      const userKey = name.split(',')[2];

      setUserData((prevUserData: RequestType) => ({
        ...prevUserData,
        data: {
          ...prevUserData.data,
          user: {
            ...prevUserData.data.user,
            [userKey]: value,
          },
        },
      }));
    } else if (name.startsWith('data,enterprise,')) {
      const userKey = name.split(',')[2];

      setUserData((prevUserData: RequestType) => ({
        ...prevUserData,
        data: {
          ...prevUserData.data,
          enterprise: {
            ...prevUserData.data.enterprise,
            [userKey]: value,
          },
        },
      }));
    }
  };

  const agreeHandler = async () => {
    try {
      const data = mergeAndRemoveDuplicateValues(userInfo, userData);
      await dispatch(
        accountManagerConfirmationRequest({
          id: userId,
          data: isEmptyObject(data) ? undefined : data,
        }),
      ).unwrap();
      showAgreeModal();
    } catch (e) {
      const errorMessage = getErrorMessage(e, 'username');
      await message.error(errorMessage);
    }
  };

  const handleCancel = async () => {
    setIsModalOpen(false);
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
                name={['data', 'user', 'last_name']}
                placeholder='Фамилия'
                onChange={inputChangeHandler}
              />
              <FormField
                bordered
                data-testid='first_name_id'
                id='first_name_id'
                inputClassName={b('username-info')}
                label='Имя'
                name={['data', 'user', 'first_name']}
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
              name={['data', 'user', 'middle_name']}
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
                name={['data', 'user', 'email']}
                placeholder='Email'
                onChange={inputChangeHandler}
              />
              <FormField
                bordered
                type='phone'
                className='username'
                name={['data', 'user', 'phone']}
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
              name={['data', 'enterprise', 'name']}
              placeholder='Название колхоза/фермы/компании'
              onChange={inputChangeHandler}
            />

            <FormField
              bordered
              data-testid='location_id'
              id='location_id'
              inputClassName={b('username-info')}
              label='Регион расположения'
              name={['data', 'enterprise', 'location']}
              placeholder='Регион расположения'
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
                data-testid='approve-id-button'
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
        handleCancel={handleCancel}
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
