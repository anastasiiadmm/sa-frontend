import { Button, Drawer, Form, Typography } from 'antd';
import bem from 'easy-bem';
import React from 'react';
import { Link } from 'react-router-dom';

import close from 'assets/images/icons/close_button.svg';
import tractorWhite from 'assets/images/icons/technique-white.svg';
import tractor from 'assets/images/technique.jpg';
import FormField from 'components/FormField/FormField';
import 'components/DrawerComponent/_drawerComponent.scss';

interface Props {
  onClose: () => void;
  open: boolean;
}

const { Title } = Typography;

const DrawerComponent: React.FC<Props> = ({ onClose, open }) => {
  const b = bem('DrawerComponent');

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
        <Button
          type='primary'
          danger
          icon={<img src={tractorWhite} alt={tractorWhite} />}
          style={{ borderRadius: 26, width: 130 }}
        >
          Неактивен
        </Button>

        <div className={b('profile-info')}>
          <Form layout='vertical'>
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

              <FormField
                readOnly
                id='vin_code_id'
                label='VIN код'
                name='vin'
                placeholder='VIN код'
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
                name={['operator', 'last_name']}
                placeholder='Фамилия'
                inputClassName='input-styles'
              />

              <FormField
                readOnly
                id='first_name_id'
                label='Имя'
                name={['operator', 'first_name']}
                placeholder='Имя'
                inputClassName='input-styles'
              />

              <FormField
                readOnly
                id='middle_name_id'
                label='Отчество'
                name={['operator', 'middle_name']}
                placeholder='Отчество'
                inputClassName='input-styles'
              />
            </div>

            <Link to='/technique-map'>
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
