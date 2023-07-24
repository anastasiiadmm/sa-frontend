import bem from 'easy-bem';
import React, { FC } from 'react';
import 'components/HeaderMobile/_headerMobile.scss';

interface HeaderMobileProps {
  children: React.ReactNode;
}
const HeaderMobile: FC<HeaderMobileProps> = ({ children }) => {
  const b = bem('HeaderMobile');
  return <div className={b()}>{children}</div>;
};

export default HeaderMobile;
