import { Button, Card, Form, Spin, Typography } from 'antd';
import bem from 'easy-bem';
import { DivIcon, Icon, IconOptions, LatLngExpression } from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { CircleMarker, MapContainer, Marker, TileLayer } from 'react-leaflet';
import { useNavigate } from 'react-router';
import { Link, useParams } from 'react-router-dom';

import active from 'assets/images/icons/active_tracktor.svg';
import arrowLeft from 'assets/images/icons/arrow-left.svg';
import close from 'assets/images/icons/close_button.svg';
import inactive from 'assets/images/icons/inactive_tracktor.svg';
import speed from 'assets/images/icons/speedometer.svg';
import tractorWhite from 'assets/images/icons/technique-white.svg';
import tractorBlue from 'assets/images/icons/traktor-round.svg';
import tractor from 'assets/images/technique.jpg';
import DrawerComponent from 'components/DrawerComponent/DrawerComponent';
import FormField from 'components/FormField/FormField';
import {
  ITechniquesMap,
  ITechniquesMapActive,
  ITechniquesMapActiveButton,
  VehicleData,
} from 'interfaces';
import { accountsSelector, fetchConfigs } from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import useWebSocket from 'socket';
import { activeIcon, inactiveIcon } from 'utils/constantMap';
import 'containers/TechniqueMap/_techniqueMap.scss';

const { Text, Title } = Typography;

const b = bem('TechniqueMap');

const CardBlock = ({ image, title, value }: { image: string; title: string; value: number }) => (
  <Card className={b('card-style')} bordered={false}>
    <div className={b('title')}>
      <img src={image} alt={title} className={b('img-title')} />
      <div className={b('title-info')}>
        <Text className={b('title')}>{title}</Text>
        <Text strong>{value}</Text>
      </div>
    </div>
  </Card>
);

const TechniqueMap = () => {
  const markerRef = useRef(null);
  const history = useNavigate();
  const dispatch = useAppDispatch();
  const { techniqueId } = useParams() as { techniqueId: string };
  const { account, configs } = useAppSelector(accountsSelector);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [speedStatus, setSpeedStatus] = useState('');
  const [vehicle, setVehicle] = useState<ITechniquesMap | null>(null);
  const [vehicleActive, setVehicleActive] = useState<ITechniquesMapActiveButton | null>(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const moveSpeed = account?.coords_timeout ? account.coords_timeout * 1000 + 200 : 0;

  const { socketMap, socketLoading, latestSocketData } = useWebSocket(
    account?.coords_timeout ?? 0,
    configs?.websocket_auth_secret_key ?? '',
    null,
    techniqueId,
    'info',
  );

  const latLanData = socketMap as VehicleData;

  useEffect(() => {
    if (markerRef.current && latLanData?.online_vehicle_ids && latLanData?.all_vehicles_info) {
      latLanData?.all_vehicles_info?.forEach((vehicleData) => {
        const activeVehicleData = latLanData?.online_vehicle_ids?.find(
          (item) => item[vehicleData.id],
        );
        if (activeVehicleData) {
          const { latitude, longitude, speed } = activeVehicleData[vehicleData.id];
          const newPosition = [Number(latitude), Number(longitude)];
          const start = markerPosition || newPosition;
          const end = newPosition;

          const distance = Math.sqrt((end[0] - start[0]) ** 2 + (end[1] - start[1]) ** 2);

          if (Number(speed) >= 2) {
            const duration = Math.max(moveSpeed, distance * 50);

            let progress = 0;
            const steps = 60;

            const timer = setInterval(() => {
              progress += 1 / steps;
              const currentLng = start[1] + (end[1] - start[1]) * progress;
              const currentLat = start[0] + (end[0] - start[0]) * progress;
              const currentPos: [number, number] = [currentLat, currentLng];
              setMarkerPosition(currentPos);

              if (progress >= 1) {
                clearInterval(timer);
              }
            }, duration / steps);

            return () => clearInterval(timer);
          }
        }
      });
    }
  }, [latLanData?.online_vehicle_ids, latLanData?.all_vehicles_info]);

  useEffect(() => {
    if (vehicle && latestSocketData) {
      const activeVehicleData = latestSocketData?.online_vehicle_ids?.find(
        (item) => item[vehicle?.id],
      );

      if (activeVehicleData) {
        const activeVehicle = activeVehicleData[vehicle?.id];
        setVehicleActive(activeVehicle);
      }
    }
  }, [vehicle, latestSocketData]);

  useEffect(() => {
    dispatch(fetchConfigs());
  }, [dispatch]);

  useEffect(() => {
    if (vehicle) {
      form.setFieldsValue({
        description: vehicle?.description,
        license_plate: vehicle?.license_plate,
        last_name: vehicle?.operator?.last_name,
        first_name: vehicle?.operator?.first_name,
        middle_name: vehicle?.operator?.middle_name,
      });
    }
  }, [vehicle, form]);

  useEffect(() => {
    if (vehicleActive === null) {
      setSpeedStatus('Неактивен');
    } else {
      setSpeedStatus(vehicleActive ? `${vehicleActive.speed}` : '');
    }
  }, [speedStatus, vehicle?.speed, vehicleActive]);

  const showDrawer = (vehicleData: ITechniquesMap) => {
    setOpen(true);
    setVehicle(vehicleData);
  };

  const backHandler = () => {
    history(-1);
  };

  const renderCircleMarker = (
    vehicleData: ITechniquesMap,
    position: LatLngExpression,
    icon: Icon<IconOptions> | DivIcon | undefined,
    showDrawer: (vehicleData: ITechniquesMap) => void,
  ) => {
    const vehicleId = vehicleData.id;

    return (
      <CircleMarker
        ref={markerRef}
        key={vehicleId}
        center={markerPosition !== null ? markerPosition : (position as LatLngExpression)}
        opacity={0}
        radius={10}
        interactive={false}
      >
        <Marker
          position={markerPosition !== null ? markerPosition : (position as LatLngExpression)}
          icon={icon}
          eventHandlers={{ click: () => showDrawer(vehicleData) }}
        />
      </CircleMarker>
    );
  };

  const countVehicles = (
    allVehicles: ITechniquesMap[] | null | undefined,
    onlineVehicles: ITechniquesMapActive[] | null | undefined,
  ) => {
    let activeVehiclesCount = 0;

    allVehicles?.forEach((vehicle) => {
      const vehicleInOnlineVehicles = onlineVehicles?.find((item) => item[vehicle?.id]);
      const isActive = Boolean(vehicleInOnlineVehicles);

      if (isActive) {
        activeVehiclesCount++;
      }
    });

    const inactiveVehiclesCount = (allVehicles?.length || 0) - activeVehiclesCount;

    return { activeVehiclesCount, inactiveVehiclesCount };
  };

  const { activeVehiclesCount: activeCount, inactiveVehiclesCount: inactiveCount } = countVehicles(
    latLanData?.all_vehicles_info,
    latLanData?.online_vehicle_ids,
  );

  if (socketLoading) {
    return (
      <div data-testid='loading' className='loading'>
        <div>
          <Spin className='spin' size='large' />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className={b()}>
        <div className={b('card-block')}>
          <div>
            <Card className={`${b('card-style')} top_btn`} bordered={false}>
              <div className={b('header-title')}>
                <button type='button' className='btn_none_style' onClick={backHandler}>
                  <img className={b('arrow-left')} src={arrowLeft} alt='arrow' />
                </button>
                <p className={b('title_maps')}>Вся техника</p>
              </div>
            </Card>
          </div>
          <div className={b('card-block-info')}>
            <CardBlock
              image={tractorBlue}
              title='Всего техники'
              value={latLanData?.all_vehicles_info?.length || 0}
            />
            <CardBlock image={active} title='Активны' value={activeCount} />
            <CardBlock image={inactive} title='Неактивны' value={inactiveCount} />
          </div>
        </div>

        <div className={b('map-block')}>
          <MapContainer
            center={[60.735277, 92.628906]}
            zoom={3}
            minZoom={2}
            maxZoom={17}
            scrollWheelZoom
            style={{ width: '100%', height: '100vh' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.esri.com/">Esri</a>'
              url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            />
            {latLanData?.all_vehicles_info?.map((vehicle) => {
              const vehicleInOnlineVehicles = latLanData?.online_vehicle_ids?.find(
                (item) => item[vehicle?.id],
              );

              if (vehicleInOnlineVehicles) {
                const latitude = parseFloat(vehicleInOnlineVehicles[vehicle?.id]?.latitude);
                const longitude = parseFloat(vehicleInOnlineVehicles[vehicle?.id]?.longitude);
                return renderCircleMarker(vehicle, [latitude, longitude], activeIcon, showDrawer);
              }

              return renderCircleMarker(
                vehicle,
                [vehicle?.last_latitude, vehicle?.last_longitude],
                inactiveIcon,
                showDrawer,
              );
            })}
          </MapContainer>
        </div>
      </div>

      <DrawerComponent open={open} placement='right'>
        <Button
          data-testid='close-button-test'
          onClick={() => {
            setOpen(!open);
            setVehicleActive(null);
          }}
          size='large'
          className={b('close-button')}
          type='primary'
          shape='circle'
          icon={<img src={close} alt='close' />}
        />
        <div className={b('drawer-block')}>
          <div>
            <img src={tractor} alt='tractor' />
          </div>
          <div className={b('info-block')}>
            {speedStatus === 'Неактивен' ? (
              <Button
                type='primary'
                danger
                className='cursor'
                icon={<img src={tractorWhite} alt={tractorWhite} />}
                style={{ borderRadius: 26, width: 130 }}
              >
                Неактивен
              </Button>
            ) : (
              <div className={b('active-buttons-block')}>
                <Button
                  type='primary'
                  icon={<img src={tractorWhite} alt={tractorWhite} />}
                  className={b('active-button cursor')}
                >
                  Активен
                </Button>
                <Button
                  className={b('speed-button cursor')}
                  type='primary'
                  icon={<img src={speed} alt={speed} />}
                >
                  {`${Number(speedStatus) >= 2 ? Math.floor(Number(speedStatus)) : 0} км/ч`}
                </Button>
              </div>
            )}

            <div className={b('profile-info')}>
              <Form layout='vertical' form={form}>
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
                    inputClassName='input-styles'
                  />

                  <FormField
                    readOnly
                    id='state_number_id'
                    label='Гос номер'
                    name='license_plate'
                    placeholder='Гос номер'
                    inputClassName='input-styles'
                  />
                </div>

                <Title level={5} className={b('profile-title')}>
                  Информация о механизаторе
                </Title>
                <div className={b('form-block')}>
                  <FormField
                    readOnly
                    id='last_name'
                    label='Фамилия'
                    name='last_name'
                    placeholder='Фамилия'
                    inputClassName='input-styles'
                  />

                  <FormField
                    readOnly
                    id='first_name_id'
                    label='Имя'
                    name='first_name'
                    placeholder='Имя'
                    inputClassName='input-styles'
                  />

                  <FormField
                    readOnly
                    id='middle_name_id'
                    label='Отчество'
                    name='middle_name'
                    placeholder='Отчество'
                    inputClassName='input-styles'
                  />
                </div>

                <Link to={`/profile-technique/${vehicle?.id}`}>
                  <Button type='default' className={b('view-button')}>
                    Посмотреть полностью
                  </Button>
                </Link>
              </Form>
            </div>
          </div>
        </div>
      </DrawerComponent>
    </>
  );
};

export default TechniqueMap;
