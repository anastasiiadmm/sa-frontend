import { Button } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import AlertComponent from 'components/AlertComponent/AlertComponent';
import 'components/ModalComponent/ModalChildrenComponents/DeleteUserModal/_deleteUserModal.scss';

interface Props {
  handleDeleteCancel?: () => void;
  deleteUserHandler?: () => void;
  loading?: boolean | { delay?: number | undefined } | undefined;
}

const DeleteUserModal: React.FC<Props> = ({ handleDeleteCancel, deleteUserHandler, loading }) => {
  const b = bem('DeleteUserModal');

  return (
    <>
      <AlertComponent
        message='Вы действительно хотите удалить профиль пользователя? После удаления данные невозможно будет восстановить'
        type='error'
        showIcon
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
          htmlType='submit'
          style={{ width: '100%', borderRadius: 4 }}
          className={b('delete-profile-button')}
          onClick={deleteUserHandler}
        >
          Удалить
        </Button>
      </div>
    </>
  );
};

export default DeleteUserModal;
