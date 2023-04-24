import { Button, Card, Form, message, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import FormField from 'components/FormField/FormField';
import Spinner from 'components/Spinner/Spinner';
import FieldClimateSettingsDashboard from 'containers/FieldClimate/FieldClimateSettingsDashboard/FieldClimateSettingsDashboard';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { fetchStationInfo, putStation, stationsSelector } from 'redux/stations/stationsSlice';

const { Title } = Typography;

const FieldClimateConfigurations = () => {
  const { id } = useParams<{ id: string }>();
  const { stationInfo, isWeatherLoading, sensorPutLoading } = useAppSelector(stationsSelector);
  const dispatch = useAppDispatch();
  const [form] = Form.useForm();
  const [formValid, setFormValid] = useState(true);

  useEffect(() => {
    dispatch(fetchStationInfo({ id }));
  }, [dispatch, id]);

  useEffect(() => {
    if (stationInfo) {
      form.setFieldsValue({
        name: stationInfo?.name?.custom,
      });
    }
  }, [stationInfo, form]);

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

  return (
    <FieldClimateSettingsDashboard>
      <div style={{ marginTop: 20 }}>
        <React.Suspense fallback={<Spinner />}>
          {isWeatherLoading && <Spinner />}
          {!isWeatherLoading && (
            <Card bordered={false}>
              <Title
                level={5}
                style={{ margin: '0 0 15px 0', textTransform: 'uppercase', color: '#777' }}
              >
                Пользовательское имя базового устройства
              </Title>
              <Form
                form={form}
                name='register'
                initialValues={{ stationInfo }}
                onFinish={onFinish}
                className='login-form'
                autoComplete='off'
                layout='inline'
                onValuesChange={() =>
                  setFormValid(form.getFieldsError().some((item) => item.errors.length > 0))
                }
              >
                <FormField
                  defaultValue={stationInfo?.name?.custom}
                  bordered
                  data-testid='name_id'
                  id='name'
                  name='name'
                />

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
          )}
        </React.Suspense>
      </div>
    </FieldClimateSettingsDashboard>
  );
};

export default FieldClimateConfigurations;
