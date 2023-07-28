import { Button, Col, Form, message, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router';

import edit from 'assets/images/icons/newIcon/editWhite.svg';
import frame from 'assets/images/icons/newIcon/frame.svg';
import next from 'assets/images/icons/newIcon/next.svg';
import Errors from 'components/Errors/Errors';
import FormField from 'components/FormField/FormField';
import EditUserProfileModal from 'components/ModalComponent/ModalChildrenComponents/EditUserProfileModal/EditUserProfileModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import useWindowWidth from 'hooks/useWindowWidth';
import { IMyData, IMyDataApi } from 'interfaces';
import { accountsSelector, requestChangeProfile } from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { urlFormat } from 'utils/files/files';
import { appendDataFields } from 'utils/helper';
import { fileSizeValidate, fileValidateImg } from 'utils/validate/validate';
import 'containers/User/Profile/_profile.scss';

const { Title } = Typography;

const Profile = () => {
  const b = bem('Profile');
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useNavigate();
  const windowWidth = useWindowWidth();

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
  const [image, setImage] = useState<File | null>(null);
  const [formValid, setFormValid] = useState(true);

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

  useEffect(() => {
    if (account) {
      setData((prevData) => ({
        data: {
          ...prevData.data,
          user: {
            ...prevData.data?.user,
            email: account.email,
            last_name: account.last_name,
            first_name: account.first_name,
            middle_name: account.middle_name,
            phone: account.phone,
            username: account.username,
          },
          enterprise: {
            ...prevData.data?.enterprise,
            name: account?.company?.name,
            location: account?.company?.location,
            autopilots_amount: String(account?.company?.autopilots_amount),
          },
        },
      }));
    }
  }, [account]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOkCancel = () => {
    setIsModalOpen(!isModalOpen);
  };

  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      if (fileSizeValidate(files[0]) && fileValidateImg(files[0])) {
        setImage(files[0]);
      }
    }
    setFormValid(false);
  };

  const inputChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const [objName, propName] = name.split(',');
    setData((prevData: IMyData | any) => {
      const updatedObj = { ...prevData?.data?.[objName], [propName]: value };
      return { ...prevData, data: { ...prevData?.data, [objName]: updatedObj } };
    });
  };

  const onClickSendDataHandler = async () => {
    try {
      const changeUserObj: any = {
        category: 2,
        object_id: account?.id,
        data,
      };

      const formData = new FormData();

      for (const name in changeUserObj) {
        if (name === 'data') {
          appendDataFields(formData, changeUserObj[name]);
        } else {
          formData.append(name, changeUserObj[name]);
        }
      }

      if (image) {
        formData.append('files', image);
      }

      await dispatch(requestChangeProfile(formData)).unwrap();
      await setIsModalOpen(false);
    } catch (e) {
      if (e.response.data.non_field_errors) {
        const errorMessage = e.response.data.non_field_errors[0];

        if (errorMessage === 'Inquiry has already been sent to manager.') {
          await message.error('Запрос ранее был отправлен. Дождитесь подтверждения.');
        }
      } else if (e.response.data.data.user.email[0]) {
        await message.error(e.response.data.data.user.email[0]);
      } else {
        await message.error('Произошла ошибка.');
      }
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
            <div className={b('loading')}>
              <SkeletonBlock active={fetchLoadingAccount} num={1} titleBool />
            </div>
          ) : (
            <Col
              className={b('')}
              xs={{ span: 20, offset: 2 }}
              md={{ span: 18, offset: 3 }}
              lg={{ span: 11, offset: 1 }}
            >
              {windowWidth < 990 ? (
                <>
                  <div className={b('mobile_navigate')}>
                    <Button onClick={() => history(-1)}>
                      <img src={next} alt='next' />
                    </Button>
                    <p>Профиль</p>
                  </div>
                  <div className={b('avatar_title')}>
                    <div>
                      <img src={urlFormat(account?.image)} alt='avatar' className={b('avatar')} />
                      <h2 className={b('title_first_name')}>
                        {account?.first_name} {account?.last_name.slice(0, 1)}.
                        {account?.middle_name.slice(0, 1)}
                      </h2>
                    </div>
                  </div>
                </>
              ) : (
                <div className={b('title')}>
                  <Title level={3} data-testid='sign_in_test' className={b('title')}>
                    Профиль
                  </Title>
                  <p>
                    Для того чтобы изменить или добавить информацию в вашем профиле обратись к
                    вашему менеджеру.
                  </p>
                  <Button onClick={showModal} type='link' className={b('request_link')}>
                    Запрос на изменение личной информации
                  </Button>
                </div>
              )}

              <Form
                form={form}
                initialValues={{ remember: true }}
                autoComplete='off'
                style={{
                  paddingRight: 20,
                  paddingLeft: 20,
                }}
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
        {windowWidth < 990 && windowWidth > 600 ? (
          <Button className={b('request_link_mobile')} onClick={showModal}>
            <div>
              <img src={frame} alt='frame' /> <br />
              <p>
                Запрос на изменение <br /> личной информации
              </p>
            </div>
          </Button>
        ) : null}
        {windowWidth < 600 ? (
          <div className={b('block_request_link')}>
            <Button className={b('request_link_mobiles')} onClick={showModal}>
              <img src={edit} alt='frame' />
              <span>Запрос на редактирование</span>
            </Button>
          </div>
        ) : null}
      </div>

      <ModalComponent
        dividerShow={false}
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
          image={image}
          onFileChange={onFileChange}
          formValid={formValid}
          onValuesChange={() =>
            setFormValid(form.getFieldsError().some((item) => item.errors.length > 0))
          }
        />
      </ModalComponent>
    </>
  );
};

export default Profile;
