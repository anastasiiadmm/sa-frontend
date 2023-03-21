import { EyeOutlined } from '@ant-design/icons';
import { Button, Form, Image, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import arrowLeft from 'assets/images/icons/arrow-left.svg';
import FormField from 'components/FormField/FormField';
import TableComponent from 'components/TableComponent/TableComponent';
import { companiesSelector, fetchUserVehicleInfo } from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { userVehicleInfo } from 'types';
import 'containers/Technique/ProfileTechnique/_profileTechnique.scss';

const { Title } = Typography;

const ProfileTechnique = () => {
  const b = bem('ProfileTechnique');
  const dispatch = useAppDispatch();
  const { userId, vehicleId } = useParams() as { userId: string; vehicleId: string };
  const { userVehicleInfo, userVehicleInfoLoading } = useAppSelector(companiesSelector);
  const [form] = Form.useForm();
  const [state, setState] = useState<userVehicleInfo[]>([]);

  useEffect(() => {
    dispatch(fetchUserVehicleInfo({ userId, vehicleId }));
  }, [dispatch]);

  useEffect(() => {
    if (userVehicleInfo) {
      setState((prevState) => [...prevState, userVehicleInfo]);
    }
  }, [userVehicleInfo]);

  useEffect(() => {
    if (state) {
      form.setFieldsValue({
        technique_name: `${state[0]?.last_name} ${state[0]?.first_name?.charAt(
          0,
        )}. ${state[0]?.middle_name?.charAt(0)}.`,
        state_number: state[0]?.state_number,
        vin_code: state[0]?.vin_code,
        last_name: state[0]?.last_name,
        first_name: state[0]?.first_name,
        middle_name: state[0]?.middle_name,
      });
    }
  }, [state]);

  const columns: ColumnsType<userVehicleInfo> = [
    {
      key: 'processing_data',
      title: 'Поля техники',
      dataIndex: 'fields',
      width: '18%',
      fixed: 'left',
      render: (text: string, record) => {
        return <p className={b('name-column-style')}>{record?.processing_data[0]?.field_name}</p>;
      },
    },
    {
      key: 'description',
      title: 'Инструмент',
      dataIndex: 'description',
      filterSearch: true,
      width: '17%',
    },
    {
      key: 'toolsWidth',
      title: 'Обрабатываемая ширина',
      dataIndex: 'description',
      filterSearch: true,
      width: '24%',
      render: (text: string, record) => {
        return (
          <p className={b('name-column-style')}>
            {record?.processing_data[0]?.attachments?.toolsWidth} м
          </p>
        );
      },
    },
    {
      key: 'skipOverlap',
      title: 'Ширина перекрытия',
      dataIndex: 'description',
      filterSearch: true,
      width: '17%',
      render: (text: string, record) => {
        return (
          <p className={b('name-column-style')}>
            {record?.processing_data[0]?.attachments?.skipOverlap} м
          </p>
        );
      },
    },
    {
      key: 'toolsWidthResult',
      title: 'Итоговая ширина',
      dataIndex: 'description',
      filterSearch: true,
      width: '15%',
      render: (text: string, record) => {
        return (
          <p className={b('name-column-style')}>
            {record?.processing_data[0]?.attachments?.toolsWidthResult} м
          </p>
        );
      },
    },
    {
      key: 'leftRight',
      title: 'Смещение',
      dataIndex: 'description',
      filterSearch: true,
      width: '15%',
      render: (text: string, record) => {
        return (
          <p className={b('name-column-style')}>
            {record?.processing_data[0]?.attachments?.leftRight} м
          </p>
        );
      },
    },
    {
      key: 'work_area',
      title: 'Обрабатываемая площадь',
      dataIndex: 'description',
      filterSearch: true,
      width: '21%',
      render: (text: string, record) => {
        return <p className={b('name-column-style')}>{record?.processing_data[0]?.work_area} га</p>;
      },
    },
    {
      dataIndex: 'profile',
      filterSearch: true,
      width: '23%',
      render: () => (
        <div style={{ display: 'flex', gap: 37 }}>
          <Link className={b('profile-link')} to='/open-map'>
            Просмотр на карте
          </Link>
        </div>
      ),
    },
  ];

  return (
    <div className={b()}>
      <div className={b('table')}>
        <div className={b('header')}>
          <div className={b('header-title')}>
            <Link to={`/user-technique/${userId}`}>
              <img className={b('arrow-left')} src={arrowLeft} alt='arrow' />
            </Link>
            <Title level={3} className={b('title')}>
              Профиль техники - <p className={b('subtitle')}> {state[0]?.vin_code} </p> -{' '}
              {`${state[0]?.last_name} ${state[0]?.first_name?.charAt(
                0,
              )}. ${state[0]?.middle_name?.charAt(0)}.`}
            </Title>
          </div>

          <div>
            <Link to='/open-map'>
              <Button type='link' icon={<EyeOutlined />} size='large'>
                Техника на карте
              </Button>
            </Link>
          </div>
        </div>

        <div className={b('technique-profile-info')}>
          <Image
            src={`https://agri.ltestl.com${state[0]?.image}`}
            width={242}
            style={{ borderRadius: 4 }}
          />
          <div className={b('profile-info')}>
            <Form form={form} initialValues={state[0]} layout='vertical'>
              <Title level={5} className={b('profile-title')}>
                Информация о технике
              </Title>
              <div className={b('form-block')}>
                <FormField
                  readOnly
                  id='technique_name_id'
                  label='Название техники'
                  name='technique_name'
                  placeholder='Название техники'
                  defaultValue={state[0]?.vin_code}
                />

                <FormField
                  readOnly
                  id='state_number_id'
                  label='Гос номер'
                  name='state_number'
                  placeholder='Гос номер'
                />

                <FormField
                  readOnly
                  id='vin_code_id'
                  label='VIN код'
                  name='vin_code'
                  placeholder='VIN код'
                />
              </div>
              <Title level={5} className={b('profile-title')}>
                Информация о механизаторе
              </Title>
              <div className={b('form-block')}>
                <FormField
                  readOnly
                  id='last_name_id'
                  label='Фамилия'
                  name='last_name'
                  placeholder='Фамилия'
                />

                <FormField
                  readOnly
                  id='first_name_id'
                  label='Имя'
                  name='first_name'
                  placeholder='Имя'
                />

                <FormField
                  readOnly
                  id='middle_name_id'
                  label='Отчество'
                  name='middle_name'
                  placeholder='Отчество'
                />
              </div>
            </Form>
          </div>
        </div>

        <TableComponent
          rowKey={(record) => record.id}
          loading={userVehicleInfoLoading}
          columns={columns}
          data={state}
          disabledButton
        />
      </div>
    </div>
  );
};

export default ProfileTechnique;
