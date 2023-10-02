import { UserOutlined } from '@ant-design/icons';
import { Avatar, Card, Typography } from 'antd';
import bem from 'easy-bem';
import React, { ReactNode, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import rightArrow from 'assets/images/icons/arrow-right.svg';
import cloud from 'assets/images/icons/cloud-tablet.svg';
import converter from 'assets/images/icons/converter.svg';
import logout from 'assets/images/icons/logout.svg';
import SkeletonBlock from 'components/SkeletonBlock/SkeletonBlock';
import { accountsSelector, fetchAccount } from 'redux/accounts/accountsSlice';
import { logoutUser } from 'redux/auth/authSlice';
import { useAppDispatch, useAppSelector } from 'redux/hooks';
import { deleteCookie, nameRefreshCookies } from 'utils/addCookies/addCookies';
import { logoutLocalStorage } from 'utils/addLocalStorage/addLocalStorage';
import { apiUrlCrop } from 'utils/config';
import 'components/MenuMobileComponent/_menuMobileComponent.scss';

const { Title, Text } = Typography;

const MenuMobileComponent = () => {
  const b = bem('MenuMobileComponent');
  const dispatch = useAppDispatch();
  const push = useNavigate();
  const { account, fetchLoadingAccount } = useAppSelector(accountsSelector);

  useEffect(() => {
    dispatch(fetchAccount());
  }, [dispatch]);

  const logoutHandler = () => {
    push('/');
    logoutLocalStorage();
    deleteCookie(nameRefreshCookies);
    dispatch(logoutUser());
    window.location.reload();
  };

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
      title: `${account?.last_name || ''} ${account?.first_name?.charAt(0)}. ${
        account?.middle_name?.length ? `${account?.middle_name?.charAt(0)}.` : ''
      }`,
      subTitle: account?.is_manager ? 'Менеджер' : 'Пользователь',
      icon: rightArrow,
      link: account?.is_manager ? '/manager-profile' : '/user-profile-view',
    },
    account?.company?.weather_service && {
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
  ].filter(Boolean) as {
    image: ReactNode;
    title: string;
    subTitle?: string;
    icon: string;
    link: string;
  }[];

  return (
    <div className={b('')} data-testid='mobile'>
      <div className={b('cards-links')}>
        {fetchLoadingAccount ? (
          <SkeletonBlock active={fetchLoadingAccount} num={1} titleBool />
        ) : (
          cardData.map((item) => (
            <Link to={item?.link || '#'} key={item.link}>
              <Card className={b('card-block')} hoverable>
                <div>{item?.image}</div>
                <div className={b('info-block')}>
                  <Title level={5} className={b('title')}>
                    {item?.title}
                  </Title>
                  {item?.subTitle && <Text type='secondary'>{item.subTitle}</Text>}
                </div>
                <div>
                  <img src={item?.icon} alt='rightArrow' />
                </div>
              </Card>
            </Link>
          ))
        )}
      </div>
      <div className={b('logout-block')}>
        <Card className={b('card-block')} hoverable onClick={logoutHandler}>
          <div>
            <img src={logout} alt='logout' />
          </div>
          <div className={b('info-block')}>
            <Title level={5} className={b('title')}>
              Выйти из аккаунта
            </Title>
          </div>
          <div>
            <img src={rightArrow} alt='rightArrow' />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default MenuMobileComponent;
