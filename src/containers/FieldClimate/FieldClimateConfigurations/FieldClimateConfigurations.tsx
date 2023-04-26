import { Alert, Button, Card, Divider, Form, message, Typography } from 'antd';
import bem from 'easy-bem';
import L, { LatLngExpression, LatLngTuple } from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import { CircleMarker, MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useParams } from 'react-router-dom';

import marker from 'assets/images/icons/location-marker.png';
import FormField from 'components/FormField/FormField';
import Spinner from 'components/Spinner/Spinner';
import FieldClimateSettingsDashboard from 'containers/FieldClimate/FieldClimateSettingsDashboard/FieldClimateSettingsDashboard';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import {
  fetchStationInfo,
  getElevation,
  getLocationParams,
  getTimezone,
  putStation,
  stationsSelector,
} from 'redux/stations/stationsSlice';
import 'containers/FieldClimate/FieldClimateConfigurations/_fieldClimateConfigurations.scss';

const { Text, Title } = Typography;

const icon = new L.Icon({
  iconUrl: marker,
  iconRetinaUrl: marker,
  iconAnchor: new L.Point(16, 17),
  popupAnchor: new L.Point(16, 0),
  iconSize: new L.Point(50, 50),
  className: 'leaflet-div-icon',
});

const DraggableMarker = ({
  position,
  onDragEnd,
  coordinates,
  centerMap,
}: {
  position: [number, number];
  onDragEnd: (position: number[]) => void;
  coordinates: number[];
  centerMap: () => [number, number];
}) => {
  const [markerPosition, setMarkerPosition] = useState<LatLngExpression | LatLngTuple>(position);
  const markerRef = useRef<L.Marker | null>(null);
  const map = useMap();

  useEffect(() => {
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }
    const newMarker = L.marker(markerPosition, {
      draggable: true,
      icon,
    });
    newMarker.on('dragend', handleMarkerDragEnd);
    newMarker.addTo(map);
    markerRef.current = newMarker;
  }, [markerPosition, map]);

  useEffect(() => {
    setMarkerPosition(centerMap());
  }, [coordinates, centerMap, setMarkerPosition]);

  const handleMarkerDragEnd = async (event: L.LeafletEvent) => {
    const latlng = event.target.getLatLng();
    setMarkerPosition([latlng.lat, latlng.lng]);
    onDragEnd([latlng.lat, latlng.lng]);
  };

  return null;
};

const FieldClimateConfigurations = () => {
  const b = bem('FieldClimateConfigurations');
  const { id } = useParams<{ id: string }>();
  const { stationInfo, isWeatherLoading, sensorPutLoading, timezone, location, locationLoading } =
    useAppSelector(stationsSelector);
  const dispatch = useAppDispatch();
  const FormName = Form.useForm()[0];
  const FormLocationSearch = Form.useForm()[0];
  const FormLocationSet = Form.useForm()[0];
  const [data, setData] = useState({
    position: { geo: { coordinates: [0, 0] }, altitude: 0, timezoneCode: '' },
  });
  const [formValid, setFormValid] = useState(true);
  const [formSearchValid, setFormSearchValid] = useState(true);
  const [bounds] = useState<number[][]>([
    [-90, -180],
    [90, 180],
  ]);

  useEffect(() => {
    dispatch(fetchStationInfo({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (stationInfo?.position) {
      setData((prevState) => ({
        ...prevState,
        position: {
          ...prevState.position,
          geo: {
            coordinates: stationInfo?.position?.geo?.coordinates || [0, 0],
          },
          altitude: stationInfo?.position?.altitude || 0,
          timezoneCode: stationInfo?.position?.timezoneCode || '',
        },
      }));
    }
  }, [stationInfo?.position]);

  useEffect(() => {
    if (timezone?.timeZoneId) {
      setData((prevState) => ({
        ...prevState,
        position: {
          ...prevState.position,
          timezoneCode: timezone?.timeZoneId,
        },
      }));
    }
  }, [timezone]);

  useEffect(() => {
    if (Array.isArray(location) && location.length > 0) {
      setData((prevState) => ({
        ...prevState,
        position: {
          ...prevState.position,
          geo: {
            coordinates: [location[0]?.lat, location[0]?.lon] || [0, 0],
          },
        },
      }));
    }
  }, [location]);

  useEffect(() => {
    if (stationInfo || data) {
      FormName.setFieldsValue({
        name: stationInfo?.name?.custom,
      });
      FormLocationSet.setFieldsValue({
        longitude: data?.position?.geo?.coordinates[0],
        latitude: data?.position?.geo?.coordinates[1],
        elevation: data?.position?.altitude,
        timezone_code: data?.position?.timezoneCode,
      });
    }
  }, [stationInfo, data, FormName, FormLocationSet]);

  useEffect(() => {
    if (stationInfo && stationInfo.position?.geo?.coordinates?.length) {
      const lat = Number(stationInfo.position?.geo?.coordinates[0]);
      const lon = Number(stationInfo.position?.geo?.coordinates[1]);
      setData((prevData) => ({
        ...prevData,
        position: {
          ...prevData.position,
          geo: {
            ...prevData.position.geo,
            coordinates: [lat, lon],
          },
        },
      }));
    }
  }, [stationInfo]);

  useEffect(() => {
    if (Array.isArray(location) && location.length > 0) {
      const lat = Number(location[0].lat);
      const lon = Number(location[0].lon);
      setData((prevData) => ({
        ...prevData,
        position: {
          ...prevData.position,
          geo: {
            ...prevData.position.geo,
            coordinates: [lat, lon],
          },
        },
      }));
      dispatch(getTimezone({ position: [location[0].lat, location[0].lon] }));
    }
  }, [location, dispatch]);

  const latLngBounds: L.LatLngBoundsExpression = L.latLngBounds(
    bounds.map((coords: number[]) => [coords[0], coords[1]]),
  );

  const centerMap = (): [number, number] => {
    return [data.position.geo.coordinates[0], data.position.geo.coordinates[1]];
  };

  const lineMap = () => {
    return [data.position.geo.coordinates[0], data.position.geo.coordinates[1]];
  };

  const handleMarkerDragEnd = async (position: number[]) => {
    dispatch(getTimezone({ position: [position[0], position[1]] }));
    dispatch(getElevation({ position: [position[0], position[1]] }));
    setData((prevState) => ({
      ...prevState,
      position: {
        ...prevState.position,
        geo: {
          coordinates: [position[0], position[1]] || [0, 0],
        },
      },
    }));
  };

  const onFinish = async (data: string) => {
    try {
      await dispatch(putStation({ id, data })).unwrap();
      await message.success('Данные успешно обновлены!');
      await dispatch(fetchStationInfo({ id }));
      await setFormValid(true);
    } catch (e) {
      await message.error(e?.detail);
    }
  };

  const changeDataHandler = async () => {
    try {
      await dispatch(putStation({ id, data })).unwrap();
      await message.success('Данные успешно обновлены!');
      await dispatch(fetchStationInfo({ id }));
    } catch (e) {
      await message.error(e?.detail);
    }
  };

  const searchLocationHandler = (values: any) => {
    dispatch(getLocationParams(values));
  };

  return (
    <FieldClimateSettingsDashboard>
      <React.Suspense fallback={<Spinner />}>
        {isWeatherLoading && <Spinner />}
        {!isWeatherLoading && (
          <div
            className={b('')}
            style={{ marginTop: 15, display: 'flex', flexDirection: 'column', gap: 15 }}
          >
            <Card bordered={false}>
              <Title
                level={5}
                style={{ margin: '0 0 15px 0', textTransform: 'uppercase', color: '#777' }}
              >
                Пользовательское имя базового устройства
              </Title>
              <Form
                form={FormName}
                name='register'
                initialValues={{ stationInfo }}
                onFinish={onFinish}
                className='login-form'
                autoComplete='off'
                layout='inline'
                onValuesChange={() =>
                  setFormValid(FormName.getFieldsError().some((item) => item.errors.length > 0))
                }
              >
                <FormField bordered data-testid='name_id' id='name' name='name' />

                <Button
                  disabled={formValid}
                  type='primary'
                  htmlType='submit'
                  loading={sensorPutLoading}
                  style={{ borderRadius: 4 }}
                >
                  Обновить
                </Button>
              </Form>
            </Card>
            <Card bordered={false}>
              <Title level={5} style={{ textTransform: 'uppercase', color: '#777' }}>
                Часовой пояс и местоположение
              </Title>
              <Text>
                Имейте в виду, что точные настройки местоположения и часового пояса необходимы для
                правильной работы прогноза погоды и других служб.
              </Text>
              <div className={b('map-block')}>
                <MapContainer
                  center={
                    stationInfo && stationInfo.position?.geo?.coordinates?.length
                      ? (lineMap() as LatLngExpression)
                      : (centerMap() as LatLngExpression)
                  }
                  zoom={6}
                  minZoom={2}
                  maxZoom={18}
                  scrollWheelZoom
                  bounds={latLngBounds}
                  maxBounds={latLngBounds}
                  style={{ width: '60%', height: '400px', zIndex: 2 }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
                  />
                  <CircleMarker center={centerMap() as LatLngExpression} opacity={0} radius={10}>
                    <DraggableMarker
                      position={centerMap()}
                      onDragEnd={handleMarkerDragEnd}
                      coordinates={data?.position?.geo?.coordinates}
                      centerMap={centerMap}
                    />
                  </CircleMarker>
                </MapContainer>
                <div>
                  <Form
                    form={FormLocationSearch}
                    name='basic'
                    className='login-form'
                    onFinish={searchLocationHandler}
                    autoComplete='off'
                    layout='vertical'
                    onValuesChange={() =>
                      setFormSearchValid(
                        FormLocationSearch.getFieldsError().some((item) => item.errors.length > 0),
                      )
                    }
                  >
                    <div className={b('map-block-inner')}>
                      <FormField
                        bordered
                        placeholder='Поиск локации'
                        data-testid='location_id'
                        id='location'
                        name='location'
                        inputClassName={b('input-style')}
                      />

                      <Button
                        disabled={formSearchValid}
                        loading={locationLoading}
                        type='primary'
                        htmlType='submit'
                        style={{ borderRadius: 4 }}
                      >
                        Искать
                      </Button>
                    </div>
                  </Form>

                  <Form
                    form={FormLocationSet}
                    initialValues={{ stationInfo }}
                    className='login-form'
                    autoComplete='off'
                    layout='vertical'
                  >
                    <div className={b('map-block')}>
                      <FormField
                        defaultValue={stationInfo?.name?.custom}
                        bordered
                        label='Longitude'
                        data-testid='longitude_id'
                        id='longitude'
                        name='longitude'
                      />

                      <FormField
                        defaultValue={stationInfo?.name?.custom}
                        bordered
                        label='Latitude'
                        data-testid='latitude_id'
                        id='latitude'
                        name='latitude'
                      />

                      <FormField
                        defaultValue={stationInfo?.name?.custom}
                        bordered
                        label='Elevation'
                        data-testid='elevation_id'
                        id='elevation'
                        name='elevation'
                      />
                    </div>

                    <Divider />

                    <Alert
                      message='Часовой пояс устанавливается автоматически, если вы перетаскиваете маркер на карте.'
                      type='info'
                      showIcon
                    />

                    <FormField
                      readOnly
                      bordered
                      label='Station timezone'
                      data-testid='timezone_code_id'
                      id='timezone_code'
                      name='timezone_code'
                    />

                    <Button
                      type='primary'
                      htmlType='submit'
                      loading={sensorPutLoading}
                      danger
                      style={{ float: 'right' }}
                      onClick={changeDataHandler}
                    >
                      Сохранить локацию
                    </Button>
                  </Form>
                </div>
              </div>
            </Card>
          </div>
        )}
      </React.Suspense>
    </FieldClimateSettingsDashboard>
  );
};

export default FieldClimateConfigurations;
