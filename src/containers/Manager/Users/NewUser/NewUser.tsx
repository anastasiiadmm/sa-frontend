import { Button, Col, Form, message, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import DrawerComponent from 'components/DrawerComponent/DrawerComponent';
import Errors from 'components/Errors/Errors';
import FormField from 'components/FormField/FormField';
import CreateNewUserCredentials from 'components/ModalComponent/ModalChildrenComponents/CreateNewUserCredentials/CreateNewUserCredentials';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import useWindowWidth from 'hooks/useWindowWidth';
import { IUserAdd } from 'interfaces';
import { accountsSelector } from 'redux/accounts/accountsSlice';
import { companiesSelector, userCreate } from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { getErrorMessage, removeEmptyValuesFromObject } from 'utils/helper';
import 'containers/Manager/Users/NewUser/_NewUser.scss';

const { Title } = Typography;

const NewUser: React.FC = () => {
  const b = bem('NewUser');
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const history = useNavigate();
  const windowWidth = useWindowWidth();
  const { fetchErrorAccount } = useAppSelector(accountsSelector);
  const { userCreateLoading, userCreate: userCreateData } = useAppSelector(companiesSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formValid, setFormValid] = useState(true);
  const [openDraw, setOpenDraw] = useState(false);

  const showModal = () => {
    windowWidth <= 601 ? setOpenDraw(true) : setIsModalOpen(true);
  };

  const handleOkCancel = async () => {
    windowWidth <= 601 ? setOpenDraw(false) : setIsModalOpen(false);
    history('/');
    await message.success('Новый пользователь успешно создан!');
  };

  const onFinish = async (values: IUserAdd) => {
    try {
      if (values) {
        const data = removeEmptyValuesFromObject(values);
        await dispatch(userCreate({ data })).unwrap();
        await showModal();
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e, 'username');
      await message.error(`${errorMessage}`);
    }
  };

  if (fetchErrorAccount) {
    return <Errors status={fetchErrorAccount.status} detail={fetchErrorAccount.detail} />;
  }

  return (
    <>
      <div className='layout'>
        <Col
          className={b('')}
          xs={{ span: 20, offset: 2 }}
          md={{ span: 20, offset: 2 }}
          lg={{ span: 11, offset: 1 }}
        >
          {windowWidth > 600 && (
            <Title level={3} data-testid='new_user_test' className={b('title')}>
              Добавить нового пользователя
            </Title>
          )}
          <p className={b('subtext')}>Создать учетную запись нового пользователя и добавить его</p>

          <Form
            form={form}
            initialValues={{ remember: true }}
            onFinish={onFinish}
            autoComplete='off'
            layout='vertical'
            onValuesChange={() =>
              setFormValid(form.getFieldsError().some((item) => item.errors.length > 0))
            }
          >
            <div className={b('form-block')}>
              <FormField
                bordered
                data-testid='last_name_id'
                id='last_name_id'
                inputClassName={b('username')}
                label='Фамилия'
                name='last_name'
                placeholder='Фамилия'
                rules={[{ required: true, message: 'Введите фамилию' }]}
              />

              <FormField
                bordered
                data-testid='first_name_id'
                id='first_name_id'
                inputClassName={b('username')}
                label='Имя'
                name='first_name'
                placeholder='Имя'
                rules={[{ required: true, message: 'Введите имя' }]}
              />
            </div>

            <FormField
              bordered
              data-testid='middle_name_id'
              id='middle_name_id'
              inputClassName={b('username')}
              label='Отчество'
              name='middle_name'
              placeholder='Отчество'
            />

            <div className={b('form-block')}>
              <FormField
                bordered
                data-testid='email_id_login'
                type='email'
                id='email_id'
                inputClassName={b('username')}
                label='Email'
                name='email'
                placeholder='Email'
                rules={[{ required: true, message: 'Введите Email' }]}
              />

              <FormField
                bordered
                type='phone'
                className='username'
                name='phone'
                label='Номер телефона'
                placeholder='Номер телефона'
              />
            </div>

            <FormField
              bordered
              data-testid='name_id'
              id='name_id'
              inputClassName={b('username')}
              label='Название колхоза/фермы/компании'
              name={['company', 'name']}
              placeholder='Название колхоза/фермы/компании'
              rules={[{ required: true, message: 'Введите название колхоза/фермы/компании' }]}
            />

            <FormField
              bordered
              data-testid='location_id'
              id='location_id'
              inputClassName={b('username')}
              label='Регион расположения'
              name={['company', 'location']}
              placeholder='Регион расположения'
              rules={[{ required: true, message: 'Введите регион расположения' }]}
            />
            <div className={b('btn')}>
              <Button className={b('cancel')} onClick={() => history(-1)}>
                Отмена
              </Button>
              <Button
                disabled={formValid}
                type='primary'
                htmlType='submit'
                loading={userCreateLoading}
                style={{ width: '100%', borderRadius: 8, boxShadow: 'none' }}
                className={b('login-form-button')}
              >
                {windowWidth < 990 ? 'Добавить' : 'Добавить нового пользователя'}
              </Button>
            </div>
          </Form>
        </Col>
      </div>

      <ModalComponent
        title='Логин и пароль'
        open={isModalOpen}
        dividerShow={false}
        handleOk={handleOkCancel}
        handleCancel={() => setIsModalOpen(false)}
        classNameTitle='title_signIn'
      >
        <CreateNewUserCredentials handleOkCancel={handleOkCancel} userCreateData={userCreateData} />
      </ModalComponent>

      <DrawerComponent
        open={openDraw}
        onClose={() => setOpenDraw(false)}
        placement='bottom'
        className={b('scroll_hidden_mobile')}
        title=''
        height={330}
      >
        <div className={b('drawer_password')}>
          <h2 className={b('title_user_mobile')}>Логин и пароль</h2>
          <CreateNewUserCredentials
            handleOkCancel={handleOkCancel}
            userCreateData={userCreateData}
          />
        </div>
      </DrawerComponent>
    </>
  );
};

export default NewUser;
