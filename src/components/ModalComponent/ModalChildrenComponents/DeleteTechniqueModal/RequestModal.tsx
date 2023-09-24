import { Button } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import warning from 'assets/images/icons/notification-round.svg';
import ResultComponent from 'components/ResultComponent/ResultComponent';
import 'components/ModalComponent/ModalChildrenComponents/DeleteTechniqueModal/_requestModal.scss';

interface Props {
  title: string;
  subTitle: string;
  loading: boolean;
  handleDeleteCancel?: () => void;
  requestHandler: () => void;
  textCancel: string;
}

const RequestModal: React.FC<Props> = ({
  title,
  subTitle,
  loading,
  handleDeleteCancel,
  requestHandler,
  textCancel,
}) => {
  const b = bem('RequestModal');

  return (
    <>
      <ResultComponent
        status='error'
        icon={<img src={warning} alt='warning' className={b('icons')} />}
        title={title}
        subTitle={subTitle}
      />
      <div className={b('delete-modal-buttons')}>
        <Button
          size='large'
          type='primary'
          loading={loading}
          style={{ width: '100%', borderRadius: 8 }}
          onClick={requestHandler}
        >
          {textCancel}
        </Button>
        <Button
          size='large'
          type='primary'
          style={{ width: '100%', borderRadius: 8 }}
          className={b('cancel-profile-button')}
          onClick={handleDeleteCancel}
        >
          Отменить
        </Button>
      </div>
    </>
  );
};

export default RequestModal;
