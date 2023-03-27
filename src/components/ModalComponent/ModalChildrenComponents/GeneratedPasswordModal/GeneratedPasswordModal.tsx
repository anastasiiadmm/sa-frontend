import { Button } from 'antd';
import bem from 'easy-bem';
import React from 'react';
import 'components/ModalComponent/ModalChildrenComponents/GeneratedPasswordModal/_generatedPasswordModal.scss';

interface Props {
  generatedPassword: string | null;
  onClose: () => void;
}

const GeneratedPasswordModal: React.FC<Props> = ({ generatedPassword, onClose }) => {
  const b = bem('GeneratedPasswordModal');

  return (
    <div className={b()}>
      <p>Новый пароль пользователя</p>
      <p data-testid='generated-password' className={b('new-password')}>
        {generatedPassword}
      </p>
      <Button data-testid='ok-button' type='primary' style={{ width: '100%' }} onClick={onClose}>
        Готово
      </Button>
    </div>
  );
};

export default GeneratedPasswordModal;
