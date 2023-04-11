import { Button } from 'antd';
import bem from 'easy-bem';
import React, { FC } from 'react';

import 'components/ModalComponent/ModalChildrenComponents/RequestModals/_requestModals.scss';
import successLogo from 'assets/images/icons/success.svg';

interface RequestModalsProps {
  onClick: () => void;
}
const RequestModals: FC<RequestModalsProps> = ({ onClick }) => {
  const b = bem('RequestModals');
  return (
    <div className={b()}>
      <div>
        <div>
          <img src={successLogo} alt='successLogo' />
        </div>
        <h3>Запрос подтвержден</h3>
        <div className={b('btn')}>
          <Button onClick={onClick}>Хорошо</Button>
        </div>
      </div>
    </div>
  );
};

export default RequestModals;
