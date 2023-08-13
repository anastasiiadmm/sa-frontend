import { Button } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import deleteIcon from 'assets/images/icons/newIcon/deleteIcons.svg';
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
        icon={<img src={deleteIcon} alt='warning' />}
        title={title}
        subTitle={subTitle}
      />
      <div className={b('delete-modal-buttons')}>
        <Button
          type='primary'
          style={{ width: '100%', borderRadius: 8 }}
          className={b('cancel-profile-button')}
          onClick={handleDeleteCancel}
        >
          Отменить
        </Button>
        <Button
          type='primary'
          loading={loading}
          style={{ width: '100%', borderRadius: 8 }}
          className={b('delete_btn')}
          onClick={requestHandler}
        >
          {textCancel}
        </Button>
      </div>
    </>
  );
};

export default RequestModal;
