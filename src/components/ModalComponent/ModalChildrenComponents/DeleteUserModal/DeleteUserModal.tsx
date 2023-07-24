import { Button, Typography } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import deleteIcon from 'assets/images/icons/delete-round.svg';
import 'components/ModalComponent/ModalChildrenComponents/DeleteUserModal/_deleteUserModal.scss';

interface Props {
  handleDeleteCancel?: () => void;
  deleteUserHandler?: () => void;
  loading?: boolean | { delay?: number | undefined } | undefined;
}

const { Title, Text } = Typography;

const DeleteUserModal: React.FC<Props> = ({ handleDeleteCancel, deleteUserHandler, loading }) => {
  const b = bem('DeleteUserModal');

  return (
    <div className={b('delete-container')}>
      <img className={b('delete-image')} src={deleteIcon} alt='deleteIcon' />
      <Title level={4}>Удалить профиль?</Title>
      <Text>Вы уверены, что хотите удалить пользователя?</Text>
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
    </div>
  );
};

export default DeleteUserModal;
