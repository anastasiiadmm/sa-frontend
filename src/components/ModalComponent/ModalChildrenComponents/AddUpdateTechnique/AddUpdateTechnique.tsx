import { Button, Col, Form, message, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';

import FormField from 'components/FormField/FormField';
import { getErrorMessage, removeEmptyValuesFromObject } from 'helper';
import { companiesSelector, vehicleCreate } from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import 'components/ModalComponent/ModalChildrenComponents/AddUpdateTechnique/_addUpdateTechnique.scss';

const { Title } = Typography;

interface Props {
  userId: string | null | undefined;
  isEdit?: boolean;
}

const AddUpdateTechnique: React.FC<Props> = ({ isEdit = false, userId }) => {
  const b = bem('AddUpdateTechnique');
  const dispatch = useAppDispatch();
  const { vehicleCreateLoading, vehicleCreateSuccess } = useAppSelector(companiesSelector);
  const [form] = Form.useForm();
  const [formValid, setFormValid] = useState(true);

  useEffect(() => {
    if (!vehicleCreateSuccess) {
      form.resetFields();
    }
  }, [form, vehicleCreateSuccess]);

  const onFinish = async (values: any) => {
    try {
      if (values) {
        const data = removeEmptyValuesFromObject(values);
        await dispatch(vehicleCreate({ userId, data })).unwrap();
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e, 'username');
      await message.error(`${errorMessage}`);
    }
  };

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
        onValuesChange={() =>
          setFormValid(form.getFieldsError().some((item) => item.errors.length > 0))
        }
      >
        <Title level={3} className={b('title')} data-testid='title_id'>
          Информация о технике
        </Title>

        <FormField
          bordered
          data-testid='description_id'
          id='description_id'
          inputClassName={b('username')}
          label='Название техники'
          name='description'
          placeholder='Название техники'
          rules={[{ required: true, message: 'Введите название техники' }]}
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
            rules={[{ required: true, message: 'Введите гос номер' }]}
          />

          <FormField
            bordered
            data-testid='code_id'
            id='code_id'
            inputClassName={b('username')}
            label='VIN код'
            name='vin_code'
            placeholder='VIN код'
            rules={[{ required: true, message: 'Введите VIN код' }]}
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
          className='form-fields'
          label='Отчество'
          name='middle_name'
          placeholder='Отчество'
          rules={[{ required: true, message: 'Введите отчество' }]}
        />

        <div className={b('profile-buttons')}>
          <Button
            data-testid='button_id'
            disabled={formValid}
            type='primary'
            htmlType='submit'
            loading={vehicleCreateLoading}
            style={{ width: '100%', borderRadius: 4 }}
            className={b('save-button')}
          >
            {isEdit ? 'Редактировать технику' : 'Добавить технику'}
          </Button>
        </div>
      </Form>
    </Col>
  );
};

export default AddUpdateTechnique;
