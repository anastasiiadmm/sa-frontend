import { Button, Col, Form } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import FormField from 'components/FormField/FormField';

const AddNewTechnique = () => {
  const b = bem('AddNewTechnique');

  const [form] = Form.useForm();

  const onFinish = (values: any) => {};

  return (
    <Col
      className={b('')}
      xs={{ span: 20, offset: 2 }}
      md={{ span: 18, offset: 3 }}
      lg={{ span: 22, offset: 1 }}
    >
      <Form
        form={form}
        initialValues={{ remember: true }}
        onFinish={onFinish}
        autoComplete='off'
        layout='vertical'
      >
        <FormField
          bordered
          data-testid='new_technique_id'
          id='new_technique_id'
          inputClassName={b('username')}
          label='Название техники'
          name='new_technique'
          placeholder='Название техники'
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
