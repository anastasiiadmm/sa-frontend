import { Button, Typography } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import deleteIcon from 'assets/images/icons/newIcon/warning.svg';
import 'components/ModalComponent/ModalChildrenComponents/DeleteModal/_DeleteModal.scss';

interface Props {
  handleDeleteCancel?: () => void;
  deleteButtonHandler?: () => void;
  loading?: boolean | { delay?: number | undefined } | undefined;
  title?: string;
  fullName: string;
}

const { Title, Text } = Typography;

const DeleteModal: React.FC<Props> = ({
  handleDeleteCancel,
  deleteButtonHandler,
  loading,
  fullName,
  title,
}) => {
  const b = bem('DeleteModal');

  return (
    <div className={b('delete-container')}>
      <img className={b('delete-image')} src={deleteIcon} alt='deleteIcon' />
      <Title level={4}>{title}</Title>
      <Text
        style={{
          textAlign: 'center',
        }}
      >
        Вы уверены, что хотите удалить <br /> <b>{fullName}</b>
      </Text>
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
          onClick={deleteButtonHandler}
        >
          Удалить
        </Button>
      </div>
    </div>
  );
};

export default DeleteModal;
