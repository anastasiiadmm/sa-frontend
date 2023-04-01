import { Button } from 'antd';
import bem from 'easy-bem';
import React, { FC } from 'react';

import { useNavigate } from 'react-router';

import notFoundImg from 'assets/images/notFound.svg';
import 'components/Errors/NotFound/_notFound.scss';

interface NotFoundProps {
  title: string;
  text: string;
}
const NotFound: FC<NotFoundProps> = ({ title, text }) => {
  const b = bem('NotFound');
  const push = useNavigate();

  return (
    <div className={b()}>
      <div>
        <div className={b('img')}>
          <img src={notFoundImg} alt='notFound' />
        </div>
        <div className={b('btn')}>
          <div>
            <h3>{title}</h3>
            <p>{text}</p>
            <Button onClick={() => push('/')}>На главную</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
