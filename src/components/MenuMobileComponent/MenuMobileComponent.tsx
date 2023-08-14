import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';

import rightArrow from 'assets/images/icons/arrow-right.svg';
import cloud from 'assets/images/icons/cloud-tablet.svg';
import converter from 'assets/images/icons/converter.svg';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import { accountsSelector, fetchAccount } from 'redux/accounts/accountsSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import 'components/MenuMobileComponent/_menuMobileComponent.scss';
import { apiUrlCrop } from 'utils/config';

const { Title, Text } = Typography;

const MenuMobileComponent = () => {
  const b = bem('MenuMobileComponent');
  const dispatch = useAppDispatch();
  const { account, fetchLoadingAccount } = useAppSelector(accountsSelector);

  useEffect(() => {
    dispatch(fetchAccount());
  }, [dispatch]);

  const cardData = [
    {
      image: (
        <Avatar
          size={35}
          src={account?.image ? `${apiUrlCrop}${account?.image}` : ''}
          style={{ cursor: 'pointer' }}
          icon={<UserOutlined />}
        />
      ),
      title: `${account?.last_name} ${account?.first_name?.charAt(0)}. ${
        account?.middle_name.length ? account?.middle_name.charAt(0) + '.' : ''
      }`,
      subTitle: account?.is_manager ? 'Менеджер' : 'Пользователь',
      icon: rightArrow,
      link: account?.is_manager ? '/manager-profile' : '/user-profile-view',
    },
    {
      image: <img src={cloud} alt='cloud' />,
      title: 'Метеосервис',
      icon: rightArrow,
      link: '/field-climate',
    },
    {
      image: <img src={converter} alt='converter' />,
      title: 'Конвертер',
      icon: rightArrow,
      link: '/converter',
    },
  ];

  return (
    <div className={b('')}>
      <div className={b('cards-links')}>
        {fetchLoadingAccount ? (
          <SkeletonBlock active={fetchLoadingAccount} num={1} titleBool />
        ) : (
          cardData.map((item) => (
            <Link to={item.link} key={item.link}>
              <Card className={b('card-block')} hoverable>
                <div>{item.image}</div>
                <div className={b('info-block')}>
                  <Title level={5} className={b('title')}>
                    {item.title}
                  </Title>
                  {item.subTitle && <Text type='secondary'>{item.subTitle}</Text>}
                </div>
                <div>
                  <img src={item.icon} alt='rightArrow' />
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};

export default MenuMobileComponent;
