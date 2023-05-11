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
import { getPageParam } from 'helper';
import { accountsSelector, fetchVehicleInfo } from 'redux/accounts/accountsSlice';
import { authSelector } from 'redux/auth/authSlice';
import { companiesSelector } from 'redux/companies/companiesSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { Result } from 'types/types';
import { urlFormat } from 'utils/files/files';

import 'containers/Technique/ProfileTechnique/_profileTechnique.scss';

const { Title } = Typography;

const ProfileTechnique = () => {
  const b = bem('ProfileTechnique');
  const dispatch = useAppDispatch();
  const { userId, vehicleId } = useParams() as { userId: string; vehicleId: string };
  const userVehicleInfoState = useAppSelector(companiesSelector);
  const { userVehicleInfo, userVehicleInfoLoading, userVehicleInfoError } =
    useAppSelector(accountsSelector);
  const [form] = Form.useForm();
  const { tokens } = useAppSelector(authSelector);
  const [fields, setFields] = useState<Result[]>([]);

  useEffect(() => {
    dispatch(fetchVehicleInfo({ vehicleId, pageUrl: '1' }));
  }, [dispatch]);
  useEffect(() => {
    if (userVehicleInfo?.results.length) {
      setFields(
        userVehicleInfo.results.map((item) => {
          return {
            ...item,
            readable_id: (
              <Tooltip
                title={item.readable_id}
                color='#BBBBBB'
                overlayInnerStyle={{ padding: '5px 15px', borderRadius: 15 }}
                placement='topRight'
              >
                <p className='text_hidden'>{item.readable_id}</p>
              </Tooltip>
            ),
          };
        }),
      );
    } else {
      setFields([]);
    }
    form.setFieldsValue({
      ...userVehicleInfo?.vehicle,
    });
  }, [userVehicleInfo]);

  const columns: ColumnsType<Result> = [
    {
      key: 'processing_data',
      title: 'Задача на обработку',
      dataIndex: 'readable_id',
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
        return <p className={b('name-column-style')}>{record?.tool}</p>;
      },
    },
    {
      key: 'toolsWidth',
      title: 'Обрабатываемая ширина, м',
      dataIndex: 'toolsWidth',
      filterSearch: true,
      width: '20%',
      render: (text: string, record) => {
        return <p className={b('name-column-style')}>{record?.tool_width}</p>;
      },
    },
    {
      key: 'skipOverlap',
      title: 'Ширина перекрытия, м',
      dataIndex: 'skipOverlap',
      filterSearch: true,
      width: '20%',
      render: (text: string, record) => {
        return <p className={b('name-column-style')}>{record?.tool_overlap}</p>;
      },
    },
    {
      key: 'toolsWidthResult',
      title: 'Итоговая ширина, м',
      dataIndex: 'toolsWidthResult',
      filterSearch: true,
      width: '20%',
      render: (text: string, record) => {
        return <p className={b('name-column-style')}>{record?.tool_width_total}</p>;
      },
    },
    {
      key: 'leftRight',
      title: 'Смещение, м',
      dataIndex: 'leftRight',
      filterSearch: true,
      width: '20%',
      render: (text: string, record) => {
        return <p className={b('name-column-style')}>{record?.left_right}</p>;
      },
    },
    {
      key: 'work_area',
      title: 'Обрабатываемая площадь, га',
      dataIndex: 'description',
      filterSearch: true,
      width: '20%',
      render: (text: string, record) => {
        return <p className={b('name-column-style')}>{record?.area}</p>;
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
            <Link className={b('profile-link')} to={`/open-map/${vehicleId}/${record.id}`}>
              <Button type='text'>
                <img src={planet} alt='Просмотреть на карте' width={20} />
              </Button>
            </Link>
          </Tooltip>
        </div>
      ),
    },
  ];

  const pageNextHandler = () => {
    dispatch(fetchVehicleInfo({ vehicleId, pageUrl: getPageParam(userVehicleInfo?.next) }));
  };

  const pagePrevHandler = () => {
    dispatch(
      fetchVehicleInfo({ vehicleId, pageUrl: getPageParam(userVehicleInfo?.previous) || '1' }),
    );
  };

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
                Профиль техники -{' '}
                <p className={b('subtitle')}> {userVehicleInfo?.vehicle.license_plate} </p> -{' '}
                {userVehicleInfo?.vehicle?.operator.middle_name}{' '}
                {userVehicleInfo?.vehicle?.operator.first_name?.slice(0, 1)}.{' '}
                {userVehicleInfo?.vehicle?.operator.last_name?.slice(0, 1)}
              </Title>
            )}
          </div>
          <div>
            <Link to={`/open-map/${vehicleId}/local-tractor`}>
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
              src={urlFormat(userVehicleInfo?.vehicle.image)}
              width={242}
              style={{ borderRadius: 4 }}
            />
            <div className={b('profile-info')}>
              <Form form={form} initialValues={{ ...userVehicleInfo?.vehicle }} layout='vertical'>
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
                  />

                  <FormField
                    readOnly
                    id='state_number_id'
                    label='Гос номер'
                    name='license_plate'
                    placeholder='Гос номер'
                  />

                  <FormField
                    readOnly
                    id='vin_code_id'
                    label='VIN код'
                    name='vin'
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
          pagePrevHandler={pagePrevHandler}
          pageNextHandler={pageNextHandler}
          params={{
            count: userVehicleInfo?.count,
            next: userVehicleInfo?.next,
            previous: userVehicleInfo?.previous,
          }}
        />
      </div>
    </div>
  );
};

export default ProfileTechnique;
