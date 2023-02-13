import { Button } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import warning from 'assets/images/icons/warning.svg';
import ResultComponent from 'components/ResultComponent/ResultComponent';
import 'components/ModalComponent/ModalChildrenComponents/DeleteTechniqueModal/_deleteTechniqueModal.scss';

interface Props {
  handleDeleteCancel?: () => void;
  deleteTechniqueHandler?: () => void;
}

const DeleteTechniqueModal: React.FC<Props> = ({ handleDeleteCancel, deleteTechniqueHandler }) => {
  const b = bem('DeleteTechniqueModal');

  return (
    <>
      <ResultComponent
        status='error'
        icon={<img src={warning} alt='warning' />}
        title='Удалить?'
        subTitle='Вы уверены, что хотите удалить'
        techniqueName='Камаз 6595?'
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
          htmlType='submit'
          style={{ width: '100%', borderRadius: 4 }}
          className={b('delete-profile-button')}
          onClick={deleteTechniqueHandler}
        >
          Удалить
        </Button>
      </div>
    </>
  );
};

export default DeleteTechniqueModal;
