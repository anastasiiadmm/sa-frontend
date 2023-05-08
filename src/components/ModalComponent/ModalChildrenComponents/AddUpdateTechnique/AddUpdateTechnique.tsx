import { Button, Col, Form, message, Typography } from 'antd';
import { UploadFile } from 'antd/es/upload/interface';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';

import FormField from 'components/FormField/FormField';
import UploadImageComponent from 'components/UploadImageComponent/UploadImageComponent';
import { getErrorMessage, removeEmptyValuesFromObject } from 'helper';
import { IValueFinish } from 'interfaces';
import { accountsSelector, vehicleCreateRequest } from 'redux/accounts/accountsSlice';
import {
  companiesSelector,
  fetchUserVehicleInfo,
  patchUserVehicleInfo,
  vehicleCreate,
} from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';

import 'components/ModalComponent/ModalChildrenComponents/AddUpdateTechnique/_addUpdateTechnique.scss';

const { Title } = Typography;

interface Props {
  userId: string | null | undefined;
  vehicleId?: string | null | undefined;
  isEdit?: boolean;
  isRequest?: boolean;
  handleEditOkCancel?: () => void;
  titleBool?: boolean;
}

const AddUpdateTechnique: React.FC<Props> = ({
  isEdit = false,
  isRequest = false,
  userId,
  vehicleId,
  handleEditOkCancel,
  titleBool = true,
}) => {
  const b = bem('AddUpdateTechnique');
  const dispatch = useAppDispatch();
  const {
    vehicleCreateLoading,
    vehicleCreateSuccess,
    userVehicleInfo,
    patchUserVehicleInfoLoading,
  } = useAppSelector(companiesSelector);
  const { account, vehicleCreateRequestLoading, vehicleCreateRequestSuccess } =
    useAppSelector(accountsSelector);
  const [form] = Form.useForm();
  const [formValid, setFormValid] = useState(true);
  const [fileList, setFileList] = useState<UploadFile[]>([]);

  useEffect(() => {
    if (!isEdit && (!vehicleCreateSuccess || !vehicleCreateRequestSuccess)) {
      form.resetFields();
      setFileList([]);
    }
  }, [form, vehicleCreateSuccess, vehicleCreateRequestSuccess, isEdit]);

  useEffect(() => {
    if (isEdit) {
      dispatch(fetchUserVehicleInfo({ userId, vehicleId }));
    }
  }, [dispatch, isEdit, vehicleId]);

  useEffect(() => {
    if (userVehicleInfo && isEdit) {
      form.setFieldsValue({
        description: userVehicleInfo?.description,
        state_number: userVehicleInfo?.state_number,
        vin_code: userVehicleInfo?.vin_code,
        last_name: userVehicleInfo?.last_name,
        first_name: userVehicleInfo?.first_name,
        middle_name: userVehicleInfo?.middle_name,
      });
    }
  }, [userVehicleInfo, form]);

  const onFinish = async (values: IValueFinish) => {
    try {
      if (values) {
        const data = removeEmptyValuesFromObject(values);
        if (isEdit) {
          await dispatch(patchUserVehicleInfo({ userId, vehicleId, data })).unwrap();
          if (handleEditOkCancel) {
            handleEditOkCancel();
          }
        } else if (isRequest) {
          const obj = {
            vehicle: {
              vin: data.vin_code,
              description: data.description,
              license_plate: data.state_number,
            },
            operator: {
              first_name: data.first_name,
              last_name: data.last_name,
              middle_name: data.middle_name,
            },
          };
          const formData = new FormData();
          formData.append('category', '3');
          formData.append('object_id', String(account?.company.id));

          for (const name in obj.vehicle) {
            if (name) {
              formData.append(
                `data.vehicle.${name}`,
                obj.vehicle[name as keyof typeof obj.vehicle],
              );
            }
          }

          for (const name in obj.operator) {
            if (name) {
              formData.append(
                `data.operator.${name}`,
                obj.operator[name as keyof typeof obj.operator],
              );
            }
          }

          if (fileList.length) {
            const file = fileList[0]?.originFileObj;
            if (file) {
              const blob = new Blob([file]);
              formData.append('files', blob, file.name);
            }
          }
          await dispatch(vehicleCreateRequest({ data: formData })).unwrap();

          if (handleEditOkCancel) {
            handleEditOkCancel();
          }
        } else {
          await dispatch(vehicleCreate({ userId, data })).unwrap();
        }
      }
    } catch (e) {
      if (e?.detail) {
        const errorMessage = getErrorMessage(e?.detail, 'username');
        await message.error(`${errorMessage.replace('vehicle ', '')}`);
      }
    }
  };

  const onFileChange = (newFileList: UploadFile[]) => {
    setFileList(newFileList);
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
        {titleBool ? (
          <Title level={3} className={b('title')}>
            Фото техники
          </Title>
        ) : null}

        {isRequest ? <UploadImageComponent fileList={fileList} setFileList={onFileChange} /> : null}

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
            disabled={formValid || !fileList.length}
            type='primary'
            htmlType='submit'
            loading={
              vehicleCreateLoading || patchUserVehicleInfoLoading || vehicleCreateRequestLoading
            }
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
