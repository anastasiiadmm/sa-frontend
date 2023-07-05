import { Button, Drawer, Form, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import close from 'assets/images/icons/close_button.svg';
import speed from 'assets/images/icons/speedometer.svg';
import tractorWhite from 'assets/images/icons/technique-white.svg';
import tractor from 'assets/images/technique.jpg';
import FormField from 'components/FormField/FormField';
import { ITechniquesMap, ITechniquesMapActiveButton } from 'interfaces';
import 'components/DrawerComponent/_drawerComponent.scss';

interface Props {
  onClose: () => void;
  open: boolean;
  vehicle: ITechniquesMap | null | undefined;
  vehicleActive?: ITechniquesMapActiveButton | null | undefined;
}

const { Title } = Typography;

const DrawerComponent: React.FC<Props> = ({ onClose, open, vehicle, vehicleActive }) => {
  const b = bem('DrawerComponent');
  const [form] = Form.useForm();
  const [speedStatus, setSpeedStatus] = useState('');

  useEffect(() => {
    if (vehicle) {
      form.setFieldsValue({
        description: vehicle?.description,        license_plate: vehicle?.license_plate,
        last_name: vehicle?.operator.last_name,
        first_name: vehicle?.operator.first_name,
        middle_name: vehicle?.operator.middle_name,
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

  return (
    <Drawer
      className={b('')}
      placement='right'
      closable={false}
      onClose={onClose}
      open={open}
      data-testid='drawer-id'
    >
      <Button
        onClick={onClose}
        size='large'
        className={b('close-button')}
        type='primary'
        shape='circle'
        icon={<img src={close} alt='close' />}
      />
      <div>
        <img src={tractor} alt='tractor' />
      </div>
      <div className={b('info-block')}>
        {speedStatus === 'Неактивен' ? (
          <Button
            type='primary'
            danger
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
              style={{ borderRadius: 26, width: 130 }}
            >
              Активен
            </Button>
            <Button
              className={b('speed-button')}
              type='primary'
              icon={<img src={speed} alt={speed} />}
            >
              {`${speedStatus} км/ч`}
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
    </Drawer>
  );
};

export default DrawerComponent;
