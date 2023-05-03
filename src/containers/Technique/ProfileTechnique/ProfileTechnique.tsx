import { Button, Form, Image, Skeleton, Tooltip, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import arrowLeft from 'assets/images/icons/arrow-left.svg';
import planet from 'assets/images/icons/planet.svg';
import tractorBlue from 'assets/images/icons/tractor-blue.svg';
import Errors from 'components/Errors/Errors';
import FormField from 'components/FormField/FormField';
import TableComponent from 'components/TableComponent/TableComponent';
import { accountsSelector, fetchVehicleInfo } from 'redux/accounts/accountsSlice';
import { authSelector } from 'redux/auth/authSlice';
import { companiesSelector, fetchUserVehicleInfo } from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fieldsList, userVehicleInfo } from 'types/types';
import { apiUrlCrop } from 'utils/config';
import 'containers/Technique/ProfileTechnique/_profileTechnique.scss';

const { Title } = Typography;

const ProfileTechnique = () => {
  const b = bem('ProfileTechnique');
  const dispatch = useAppDispatch();
  const { userId, vehicleId } = useParams() as { userId: string; vehicleId: string };
  const { userVehicleInfo: managerVehicle, userVehicleInfoLoading: managerLoading } =
    useAppSelector(companiesSelector);
  const userVehicleInfoState = useAppSelector(companiesSelector);
  const {
    userVehicleInfo: userVehicle,
    userVehicleInfoLoading: userLoading,
    userVehicleInfoError,
  } = useAppSelector(accountsSelector);
  const [form] = Form.useForm();
  const { tokens } = useAppSelector(authSelector);
  const [state, setState] = useState<userVehicleInfo[]>([]);
  const [fields, setFields] = useState<fieldsList[]>([]);
  const userVehicleInfo = tokens?.is_manager ? managerVehicle : userVehicle;
  const userVehicleInfoLoading = tokens?.is_manager ? managerLoading : userLoading;

  useEffect(() => {
    if (tokens?.is_manager) {
      dispatch(fetchUserVehicleInfo({ userId, vehicleId }));
    } else {
      dispatch(fetchVehicleInfo({ vehicleId }));
    }
  }, [dispatch]);

  useEffect(() => {
    if (userVehicleInfo) {
      setState([userVehicleInfo]);
      setFields(() =>
        userVehicleInfo.processing_data.map((item) => {
          return {
            ...item,
            field_name: (
              <Tooltip
                title={item.field_name}
                color='#BBBBBB'
                overlayInnerStyle={{ padding: '5px 15px', borderRadius: 15 }}
                placement='topRight'
              >
                <p className='text_hidden'>{item.field_name}</p>
              </Tooltip>
            ),
          };
        }),
      );
    }
  }, [userVehicleInfo]);
  useEffect(() => {
    if (state) {
      form.setFieldsValue({
        technique_name: userVehicle?.description,
        state_number: state[0]?.state_number,
        vin_code: state[0]?.vin_code,
        last_name: state[0]?.last_name,
        first_name: state[0]?.first_name,
        middle_name: state[0]?.middle_name,
      });
    }
  }, [state]);

  const columns: ColumnsType<fieldsList> = [
    {
      key: 'processing_data',
      title: 'Наименование поля',
      dataIndex: 'field_name',
      width: '20%',
      fixed: 'left',
    },
    {
      key: 'description',
      title: 'Инструмент',
      dataIndex: 'description',
      filterSearch: true,
      width: '20%',
      render: (text: string, record) => {
        return <p className={b('name-column-style')}>{record?.attachments?.toolsName}</p>;
      },
    },
    {
      key: 'toolsWidth',
      title: 'Обрабатываемая ширина',
      dataIndex: 'toolsWidth',
      filterSearch: true,
      width: '20%',
      render: (text: string, record) => {
        return <p className={b('name-column-style')}>{record?.attachments?.toolsWidth} м</p>;
      },
    },
    {
      key: 'skipOverlap',
      title: 'Ширина перекрытия',
      dataIndex: 'skipOverlap',
      filterSearch: true,
      width: '20%',
      render: (text: string, record) => {
        return <p className={b('name-column-style')}>{record?.attachments?.skipOverlap} м</p>;
      },
    },
    {
      key: 'toolsWidthResult',
      title: 'Итоговая ширина',
      dataIndex: 'toolsWidthResult',
      filterSearch: true,
      width: '20%',
      render: (text: string, record) => {
        return <p className={b('name-column-style')}>{record?.attachments?.toolsWidthResult} м</p>;
      },
    },
    {
      key: 'leftRight',
      title: 'Смещение',
      dataIndex: 'leftRight',
      filterSearch: true,
      width: '20%',
      render: (text: string, record) => {
        return <p className={b('name-column-style')}>{record?.attachments?.leftRight} м</p>;
      },
    },
    {
      key: 'work_area',
      title: 'Обрабатываемая площадь',
      dataIndex: 'description',
      filterSearch: true,
      width: '20%',
      render: (text: string, record) => {
        return <p className={b('name-column-style')}>{record?.work_area} га</p>;
      },
    },
    {
      dataIndex: 'profile',
      filterSearch: true,
      width: '18%',
      render: (_, record) => (
        <div style={{ display: 'flex', gap: 37, justifyContent: 'right' }}>
          <Tooltip
            title='Просмотреть на карте'
            color='#BBBBBB'
            overlayInnerStyle={{ padding: '5px 15px', borderRadius: 15 }}
            placement='topRight'
          >
            <Link
              className={b('profile-link')}
              to={
                tokens?.is_manager
                  ? `/open-map/${record?.id}/${vehicleId}/manager`
                  : `/open-map/${record?.id}/${vehicleId}`
              }
            >
              <Button type='text'>
                <img src={planet} alt='Просмотреть на карте' width={20} />
              </Button>
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (userVehicleInfoError || userVehicleInfoState.userVehicleInfoError) {
    return (
      <Errors
        status={userVehicleInfoError?.status || userVehicleInfoState.userVehicleInfoError?.status}
        detail={userVehicleInfoError?.detail || userVehicleInfoState.userVehicleInfoError?.detail}
      />
    );
  }

  return (
    <div className={b()}>
      <div className={b('table')}>
        <div className={b('header')}>
          <div className={b('header-title')}>
            <Link to={tokens?.is_manager ? `/user-technique/${userId}` : '/'}>
              <img className={b('arrow-left')} src={arrowLeft} alt='arrow' />
            </Link>
            {userVehicleInfoLoading ? (
              <div style={{ margin: '30px 0' }}>
                <Skeleton.Button active={userVehicleInfoLoading} style={{ width: 800 }} />
              </div>
            ) : (
              <Title level={3} className={b('title')}>
                Профиль техники - <p className={b('subtitle')}> {state[0]?.code} </p> -{' '}
                {`${state[0]?.last_name} ${state[0]?.first_name?.charAt(
                  0,
                )}. ${state[0]?.middle_name?.charAt(0)}.`}
              </Title>
            )}
          </div>
          <div>
            <Link
              to={
                tokens?.is_manager
                  ? `/open-map/${userId}/${vehicleId}/local-tractor`
                  : `/open-map/local-tractor/${vehicleId}`
              }
            >
              <Button
                type='link'
                icon={<img src={tractorBlue} alt='Техника на карте' width={18} />}
                size='large'
                className={b('open-map')}
              >
                Техника на карте
              </Button>
            </Link>
          </div>
        </div>
        {!userVehicleInfoLoading ? (
          <div className={b('technique-profile-info')}>
            <Image
              preview={false}
              className={b('technique-image')}
              src={apiUrlCrop + (state[0] ? state[0].image : '')}
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
                    id='description'
                    label='Название техники'
                    name='description'
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
              </Form>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: 20 }}>
            <Skeleton.Button
              size='large'
              active={userVehicleInfoLoading}
              style={{
                height: 180,
                width: 242,
              }}
            />
            <Skeleton active={userVehicleInfoLoading} />
          </div>
        )}

        <TableComponent
          rowKey={(record) => record.id as number}
          loading={userVehicleInfoLoading}
          columns={columns}
          data={fields}
          disabledButton
        />
      </div>
    </div>
  );
};

export default ProfileTechnique;
