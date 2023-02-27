import { Button, Col, Form, Typography } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import FormField from 'components/FormField/FormField';
import UploadImageComponent from 'components/UploadImageComponent/UploadImageComponent';
import 'components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestAddTechnique/_requestAddTechnique.scss';

const { Title } = Typography;

interface Props {
  handleOkCancel: () => void;
  showRejectModal: () => void;
}

const RequestAddTechnique: React.FC<Props> = ({ handleOkCancel, showRejectModal }) => {
  const b = bem('RequestAddTechnique');
  const [form] = Form.useForm();

  const onFinish = (values: any) => {};

  return (
    <Col
      className={b('')}
      xs={{ span: 24, offset: 0 }}
      md={{ span: 24, offset: 0 }}
      lg={{ span: 24, offset: 0 }}
    >
      <Form
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete='off'
        layout='vertical'
      >
        <Title level={3} className={b('title')}>
          Фото техники
        </Title>

        <div className={b('form-block')}>
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
            data-testid='new_technique_id'
            id='new_technique_id'
            inputClassName={b('username-info')}
            label='Название техники'
            name='new_technique'
            placeholder='Название техники'
          />
        </div>

        <UploadImageComponent />

        <Title level={3} className={b('title')}>
          Информация о технике
        </Title>

        <FormField
          bordered
          data-testid='new_technique_id'
          id='new_technique_id'
          inputClassName={b('username')}
          label='Название техники'
          name='new_technique'
          placeholder='Название техники'
        />

        <div className={b('form-block')}>
          <FormField
            bordered
            data-testid='state_number_id'
            id='state_number_id'
            inputClassName={b('username')}
            label='Гос номер'
            name='state_number'
            placeholder='Гос номер'
          />

          <FormField
            bordered
            data-testid='new_technique_id'
            id='new_technique_id'
            inputClassName={b('username')}
            label='VIN код'
            name='new_technique'
            placeholder='VIN код'
          />
        </div>

        <Title level={3} className={b('title')}>
          Информация о механизаторе
        </Title>

        <div className={b('form-block')}>
          <FormField
            bordered
            data-testid='last_name_id'
            id='last_name_id'
            inputClassName={b('username')}
            label='Фамилия'
            name='last_name'
            placeholder='Фамилия'
          />

          <FormField
            bordered
            data-testid='first_name_id'
            id='first_name_id'
            inputClassName={b('username')}
            label='Имя'
            name='first_name'
            placeholder='Имя'
          />
        </div>

        <FormField
          bordered
          data-testid='surname_id'
          id='surname_id'
          inputClassName={b('username')}
          className='form-fields'
          label='Отчество'
          name='surname'
          placeholder='Отчество'
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
          >
            Подтвердить запрос
          </Button>
        </div>
      </Form>
    </Col>
  );
};

export default RequestAddTechnique;
