import { Button, Typography } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import deleteIcon from 'assets/images/icons/delete-round.svg';
import 'components/ModalComponent/ModalChildrenComponents/DeleteModal/_DeleteModal.scss';

interface Props {
  handleDeleteCancel?: () => void;
  deleteUserHandler?: () => void;
  title: string;
  text: string;
  loading?: boolean | { delay?: number | undefined } | undefined;
}

const { Title, Text } = Typography;

const DeleteModal: React.FC<Props> = ({
  title,
  text,
  handleDeleteCancel,
  deleteUserHandler,
  loading,
}) => {
  const b = bem('DeleteModal');

  return (
    <div className={b('delete-container')}>
      <img className={b('delete-image')} src={deleteIcon} alt='deleteIcon' />
      <Title level={4}>{title}</Title>
      <Text>{text}</Text>
      <div className={b('delete-modal-buttons')}>
        <Button
          type='primary'
          style={{ width: '100%', borderRadius: 4 }}
          className='button-style'
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

export default DeleteModal;
