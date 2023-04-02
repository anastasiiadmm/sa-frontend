import { Button } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import warning from 'assets/images/icons/warning.svg';
import ResultComponent from 'components/ResultComponent/ResultComponent';
import 'components/ModalComponent/ModalChildrenComponents/DeleteTechniqueModal/_deleteTechniqueModal.scss';

interface Props {
  title: string;
  subTitle: string;
  loading: boolean;
  techniqueName?: string;
  handleDeleteCancel?: () => void;
  deleteRejectTechniqueHandler: () => void;
}

const DeleteRejectTechniqueModal: React.FC<Props> = ({
  title,
  subTitle,
  loading,
  techniqueName,
  handleDeleteCancel,
  deleteRejectTechniqueHandler,
}) => {
  const b = bem('DeleteRejectTechniqueModal');

  return (
    <>
      <ResultComponent
        status='error'
        icon={<img src={warning} alt='warning' />}
        title={title}
        subTitle={subTitle}
        techniqueName={techniqueName}
      />
      <div className={b('delete-modal-buttons')}>
        <Button
          type='primary'
          style={{ width: '100%', borderRadius: 4 }}
          className={b('cancel-profile-button')}
          onClick={handleDeleteCancel}
        >
          Отменить
        </Button>
        <Button
          type='primary'
          loading={loading}
          style={{ width: '100%', borderRadius: 4 }}
          className={b('delete-profile-button')}
          onClick={deleteRejectTechniqueHandler}
        >
          Отклонить
        </Button>
      </div>
    </>
  );
};

export default DeleteRejectTechniqueModal;
