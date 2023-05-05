import { Button, Col, Form, message, Typography } from 'antd';
import type { UploadFile } from 'antd/es/upload/interface';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';

import FormField from 'components/FormField/FormField';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import UploadImageComponent from 'components/UploadImageComponent/UploadImageComponent';
import { getErrorMessage } from 'helper';
import 'components/ModalComponent/ModalChildrenComponents/RequestsModals/RequestAddTechnique/_requestAddTechnique.scss';
import { IValueRequest, IVehicle } from 'interfaces';

import {
  techniqueVehicleConfirmation,
  techniqueVehicleConfirmationSelector,
  techniqueVehicleInfoPut,
  techniqueVehicleUpdateSelector,
} from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { getFilenameFromPath } from 'utils/files/files';

const { Title } = Typography;

interface Props {
  handleOkCancel: () => void;
  showRejectModal: () => void;
  resultsTechnique: IVehicle | null;
  resultsInfoClick: any; // добавить типизацию когда буду править запрос на добавление техники
  loading: boolean;
  modalOpen: () => void;
}

const RequestAddTechnique: React.FC<Props> = ({
  handleOkCancel,
  showRejectModal,
  resultsTechnique,
  loading,
  resultsInfoClick,
  modalOpen,
}) => {
  const b = bem('RequestAddTechnique');
  const dispatch = useAppDispatch();
  const techniqueVehicleUpdate = useAppSelector(techniqueVehicleUpdateSelector);
  const [images, setImages] = useState<UploadFile[]>([]);
  const saveTechniqueVehicleState = useAppSelector(techniqueVehicleConfirmationSelector);
  const [form] = Form.useForm();

  useEffect(() => {
    if (resultsTechnique?.image) {
      setImages([
        {
          uid: '-2',
          name: getFilenameFromPath(resultsTechnique.image),
          status: 'done',
          url: `https://agri.ltestl.com/${resultsTechnique.image}`,
        },
      ]);
    }
  }, [resultsTechnique]);

  useEffect(() => {
    form.setFieldsValue({
      fullName: `${resultsTechnique?.last_name} ${resultsTechnique?.first_name} ${resultsTechnique?.middle_name}`,
      ...resultsTechnique,
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
        const obj: { [key: string]: string } = {
          ...values,
          code: resultsTechnique.code,
          enterprise: `${resultsTechnique.enterprise}`,
        };
        const formData = new FormData();
        for (const name in obj) {
          if (name) {
            formData.append(name, obj[name]);
          }
        }
        if (images.length) {
          const file = images[0]?.originFileObj;
          if (file) {
            const blob = new Blob([file]);
            formData.append('image', blob, file.name);
          }
        }
        await dispatch(techniqueVehicleInfoPut({ data: resultsInfoClick, obj: formData })).unwrap();
        if (resultsInfoClick?.id) {
          await dispatch(techniqueVehicleConfirmation(resultsInfoClick.id)).unwrap();
        }
        modalOpen();
      }
    } catch (e) {
      const errorMessage = getErrorMessage(e, 'username');
      await message.error(`${errorMessage}`);
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
          fio: `${resultsTechnique?.last_name} ${resultsTechnique?.first_name} ${resultsTechnique?.middle_name}`,
          ...resultsTechnique,
        }}
        layout='vertical'
      >
        <Title level={3} className={b('title')}>
          Фото техники
        </Title>

        <div className={b('form-block')}>
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
            name='state_number'
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
            name='vin_code'
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
          className='form-fields'
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
            disabled={!images.length}
            type='primary'
            htmlType='submit'
            loading={techniqueVehicleUpdate.loading || saveTechniqueVehicleState.loading}
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
