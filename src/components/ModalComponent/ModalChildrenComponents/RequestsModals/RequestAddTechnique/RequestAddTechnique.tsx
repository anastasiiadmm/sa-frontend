import { Button, Col, Form, message, Typography } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';

import FormField from 'components/FormField/FormField';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import UploadImageComponent from 'components/UploadImageComponent/UploadImageComponent';
import useWindowWidth from 'hooks/useWindowWidth';
import { IValueRequest, IVehicle } from 'interfaces';
import {
  techniqueVehicleInfoPut,
  techniqueVehicleUpdateSelector,
} from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { getFilenameFromPath, urlFormat } from 'utils/files/files';
import { capitalizeFirstLetter, getErrorMessage } from 'utils/helper';
import 'components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestAddTechnique/_requestAddTechnique.scss';

const { Title } = Typography;

interface Props {
  handleOkCancel: () => void;
  showRejectModal: () => void;
  resultsTechnique: IVehicle | null;
  loading: boolean;
  modalOpen: () => void;
}

const RequestAddTechnique: React.FC<Props> = ({
  handleOkCancel,
  showRejectModal,
  resultsTechnique,
  loading,
  modalOpen,
}) => {
  const b = bem('RequestAddTechnique');
  const dispatch = useAppDispatch();
  const windowWidth = useWindowWidth();
  const techniqueVehicleUpdate = useAppSelector(techniqueVehicleUpdateSelector);
  const [images, setImages] = useState<UploadFile[]>([]);
  const [form] = Form.useForm();

  useEffect(() => {
    if (resultsTechnique?.uploaded_files.length) {
      setImages([
        {
          uid: '-2',
          name: getFilenameFromPath(resultsTechnique?.uploaded_files[0].file),
          status: 'done',
          url: urlFormat(resultsTechnique?.uploaded_files[0].file),
        },
      ]);
    }
  }, [resultsTechnique]);

  useEffect(() => {
    const fullName = `${capitalizeFirstLetter(
      resultsTechnique?.data.operator?.last_name,
    )} ${resultsTechnique?.data.operator?.first_name?.charAt(0)?.toUpperCase()}. ${
      resultsTechnique?.data.operator?.middle_name === ''
        ? null
        : resultsTechnique?.data.operator?.middle_name.charAt(0)?.toUpperCase()
    }`;
    form.setFieldsValue({
      fullName,
      ...resultsTechnique?.data.vehicle,
      ...resultsTechnique?.data.operator,
    });
  }, [resultsTechnique]);

  const setFileList = (photos: UploadFile[]) => {
    if (!photos.length) {
      setImages([]);
    } else {
      setImages(photos);
    }
  };

  const onFinish = async (values: IValueRequest) => {
    try {
      if (resultsTechnique) {
        const obj = {
          vehicle: {
            vin: values.vin,
            description: values.description,
            license_plate: values.license_plate,
          },
          operator: {
            first_name: values.first_name,
            last_name: values.last_name,
            middle_name: values.middle_name,
          },
        };
        const formData = new FormData();
        for (const name in obj.vehicle) {
          if (name) {
            formData.append(`data.vehicle.${name}`, obj.vehicle[name as keyof typeof obj.vehicle]);
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
        if (images.length) {
          const file = images[0]?.originFileObj;
          if (file) {
            const blob = new Blob([file]);
            formData.append('files', blob, file.name);
          }
        }
        await dispatch(techniqueVehicleInfoPut({ id: resultsTechnique.id, formData })).unwrap();
        modalOpen();
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e, 'username');
      await message.error(`${errorMessage.replace('vehicle ', '')}`);
    }
  };

  if (loading) {
    return <SkeletonBlock active num={1} titleBool />;
  }

  return (
    <Col
      className={b('')}
      xs={{ span: 24, offset: 0 }}
      md={{ span: 24, offset: 0 }}
      lg={{ span: 24, offset: 0 }}
    >
      <Form
        form={form}
        onFinish={onFinish}
        autoComplete='off'
        initialValues={{
          remember: true,
          ...resultsTechnique?.data.vehicle,
          ...resultsTechnique?.data.operator,
        }}
        layout='vertical'
      >
        <div className={b('form-block')}>
          <FormField
            readOnly
            data-testid='requestor_id'
            id='requestor_id'
            inputClassName={b('username-info')}
            label='Источник запроса'
            name={['requestor', 'name']}
            placeholder='Источник запроса'
          />
          <FormField
            readOnly
            data-testid='fullName_id'
            id='fullName_id'
            inputClassName={b('username-info')}
            label='ФИО'
            name='fullName'
            placeholder='ФИО'
          />
          <FormField
            readOnly
            data-testid='new_technique_id'
            id='description_id'
            inputClassName={b('username-info')}
            label='Название техники'
            name='description'
            placeholder='Название техники'
          />
        </div>

        <Title level={3} className={b('title')}>
          Фото техники
        </Title>

        <UploadImageComponent fileList={images} setFileList={setFileList} />

        <Title level={3} className={b('title')}>
          Информация о технике
        </Title>

        <FormField
          bordered
          data-testid='new_technique_id'
          id='description_id'
          inputClassName={b('username')}
          label='Название техники'
          name='description'
          rules={[
            {
              required: true,
              message: 'Заполните название техники',
            },
          ]}
          placeholder='Название техники'
        />

        <div className={b('form-block')}>
          <FormField
            bordered
            rules={[
              {
                required: true,
                message: 'Заполните гос номер',
              },
            ]}
            data-testid='state_number_id'
            id='state_number_id'
            inputClassName={b('username')}
            label='Гос номер'
            name='license_plate'
            placeholder='Гос номер'
          />

          <FormField
            bordered
            data-testid='new_technique_id'
            id='vin_code_technique_id'
            inputClassName={b('username')}
            label='VIN код'
            rules={[
              {
                required: true,
                message: 'Заполните VIN код',
              },
            ]}
            name='vin'
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
            rules={[
              {
                required: true,
                message: 'Заполните фамилию',
              },
            ]}
            name='last_name'
            placeholder='Фамилия'
          />

          <FormField
            bordered
            data-testid='first_name_id'
            id='first_name_id'
            inputClassName={b('username')}
            label='Имя'
            rules={[
              {
                required: true,
                message: 'Заполните имя',
              },
            ]}
            name='first_name'
            placeholder='Имя'
          />
        </div>

        <FormField
          bordered
          data-testid='surname_id'
          id='middle_name_id'
          inputClassName={b('username')}
          className={windowWidth >= 601 && 'form-fields'}
          label='Отчество'
          rules={[
            {
              required: true,
              message: 'Заполните отчество',
            },
          ]}
          name='middle_name'
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
            data-testid='approve-button'
            type='primary'
            htmlType='submit'
            loading={techniqueVehicleUpdate.loading}
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
