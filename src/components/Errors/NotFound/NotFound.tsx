import { Button } from 'antd';
import bem from 'easy-bem';
import React, { FC } from 'react';

import { useNavigate } from 'react-router';

import notFoundImg from 'assets/images/notFound.svg';
import 'components/Errors/NotFound/_notFound.scss';

interface NotFoundProps {
  title: string;
  text: string;
  status?: number | null | undefined;
  statusBool?: boolean;
}
const NotFound: FC<NotFoundProps> = ({ title, text, status, statusBool = false }) => {
  const b = bem('NotFound');
  const push = useNavigate();

  return (
    <div className={b()}>
      <div>
        <div className={b('img')}>
          {statusBool ? <p className={b('status')}>{status}</p> : null}
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
