import { Button, Col, Form, message } from 'antd';
import bem from 'easy-bem';
import React, { useState } from 'react';
import { useNavigate } from 'react-router';

import FormField from 'components/FormField/FormField';
import CreateNewUserCredentials from 'components/ModalComponent/ModalChildrenComponents/CreateNewUserCredentials/CreateNewUserCredentials';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import 'components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestRegisterUser/_requestRegisterUser.scss';

interface Props {
  handleOkCancel: () => void;
  showRejectModal: () => void;
}

const RequestRegisterUser: React.FC<Props> = ({ handleOkCancel, showRejectModal }) => {
  const b = bem('RequestRegisterUser');
  const [form] = Form.useForm();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const history = useNavigate();

  const showAgreeModal = () => {
    setIsModalOpen(true);
    handleOkCancel();
  };

  const handleAgreeOkCancel = () => {
    setIsModalOpen(!isModalOpen);
    history('/user-requests');
    message.success('Новый пользователь успешно зарегистирирован!');
  };

  const onFinish = (values: any) => {};

  return (
    <>
      <Col
        className={b('')}
        xs={{ span: 24, offset: 0 }}
        md={{ span: 24, offset: 0 }}
        lg={{ span: 24, offset: 0 }}
      >
        <p>Для регистрации нового пользователя, присвойте ему username и пароль</p>
        <Form
          form={form}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          autoComplete='off'
          layout='vertical'
        >
          <div className={b('form-block info-block')}>
            <FormField
              readOnly
              bordered
              data-testid='last_name_id'
              id='last_name_id'
              inputClassName={b('username-info')}
              label='Фамилия'
              name='last_name'
              placeholder='Фамилия'
            />
            <FormField
              readOnly
              bordered
              data-testid='first_name_id'
              id='first_name_id'
              inputClassName={b('username-info')}
              label='Имя'
              name='first_name'
              placeholder='Имя'
            />
          </div>

          <FormField
            readOnly
            bordered
            data-testid='surname_id'
            id='surname_id'
            inputClassName={b('username-info')}
            label='Отчество'
            name='surname'
            placeholder='Отчество'
          />

          <div className={b('form-block info-block')}>
            <FormField
              readOnly
              bordered
              data-testid='email_id'
              id='email_id'
              inputClassName={b('username-info')}
              label='Email'
              name='email'
              placeholder='Email'
            />
            <FormField
              readOnly
              bordered
              type='phone'
              className='username'
              name='phone'
              label='Номер телефона'
              placeholder='Номер телефона'
              inputClassName={b('username-info')}
            />
          </div>

          <FormField
            readOnly
            bordered
            data-testid='farm_name_id'
            id='farm_name_id'
            inputClassName={b('username-info')}
            label='Название колхоза/фермы/компании'
            name='farm_name'
            placeholder='Название колхоза/фермы/компании'
          />

          <FormField
            readOnly
            bordered
            data-testid='region_id'
            id='region_id'
            inputClassName={b('username-info')}
            label='Регион расположения'
            name='region'
            placeholder='Регион расположения'
          />

          <FormField
            readOnly
            bordered
            data-testid='amount_id'
            id='amount_id'
            inputClassName={b('username-info')}
            label='Количество оплаченных блоков автопилота'
            name='amount'
            placeholder='Количество оплаченных блоков автопилота'
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
              // disabled={!!commonError}
              type='primary'
              htmlType='submit'
              // loading={!!loading}
              style={{ width: '100%', borderRadius: 4 }}
              className={b('save-button')}
              onClick={showAgreeModal}
            >
              Подтвердить запрос
            </Button>
          </div>
        </Form>
      </Col>

      <ModalComponent
        title='Логин и пароль'
        open={isModalOpen}
        dividerShow={false}
        handleOk={handleAgreeOkCancel}
        handleCancel={() => setIsModalOpen(false)}
      >
        <CreateNewUserCredentials handleOkCancel={handleAgreeOkCancel} userCreateData={null} />
      </ModalComponent>
    </>
  );
};

export default RequestRegisterUser;
