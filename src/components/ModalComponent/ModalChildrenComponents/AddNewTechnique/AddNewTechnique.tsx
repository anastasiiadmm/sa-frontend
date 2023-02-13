import { Button, Col, Form, Typography } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import FormField from 'components/FormField/FormField';
import UploadImageComponent from 'components/UploadImageComponent/UploadImageComponent';
import 'components/ModalComponent/ModalChildrenComponents/AddNewTechnique/_addNewTechnique.scss';

const { Title } = Typography;

const AddNewTechnique = () => {
  const b = bem('AddNewTechnique');

  const [form] = Form.useForm();

  const onFinish = (values: any) => {};

  return (
    <Col
      className={b('')}
      xs={{ span: 20, offset: 2 }}
      md={{ span: 22, offset: 1 }}
      lg={{ span: 22, offset: 1 }}
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
            // disabled={!!commonError}
            type='primary'
            htmlType='submit'
            // loading={!!loading}
            style={{ width: '100%', borderRadius: 4 }}
            className={b('save-button')}
          >
            Добавить технику
          </Button>
        </div>
      </Form>
    </Col>
  );
};

export default AddNewTechnique;
