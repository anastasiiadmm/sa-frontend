import { Button, Card, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useState } from 'react';

import close from 'assets/images/icons/close.svg';
import DeleteUserModal from 'components/ModalComponent/ModalChildrenComponents/DeleteModal/DeleteModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import 'containers/Converter/Files/_files.scss';

const { Title, Text } = Typography;

const Files = () => {
  const b = bem('Files');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showDeleteModal = () => {
    setIsModalOpen(true);
  };

  const handleDeleteOkCancel = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div className={b('history-list')}>
        <Card className={b('card-file-block')}>
          <div className={b('converter-card')}>
            <div className={b('info')}>
              <div>
                <Title className={b('heading')} level={5}>
                  Название файла.jpg
                </Title>
                <Text type='secondary'>14.05.2023 18:35</Text>
              </div>
              <Button
                onClick={showDeleteModal}
                className={b('close-button')}
                icon={<img src={close} alt={close} />}
              />
            </div>
            <Button className='button-style'>Скачать</Button>
          </div>
        </Card>
      </div>

      <ModalComponent
        dividerShow={false}
        open={isModalOpen}
        handleOk={handleDeleteOkCancel}
        handleCancel={handleDeleteOkCancel}
      >
        <DeleteUserModal
          title='Удалить?'
          fullName='файл'
          handleDeleteCancel={handleDeleteOkCancel}
        />
      </ModalComponent>
    </>
  );
};

export default Files;
