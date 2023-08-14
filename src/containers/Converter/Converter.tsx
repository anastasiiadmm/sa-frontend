import { Button, Card, Typography } from 'antd';
import bem from 'easy-bem';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import arrowDown from 'assets/images/icons/arrow-down.svg';
import close from 'assets/images/icons/close.svg';
import converterFile from 'assets/images/icons/converter-file.svg';
import FormField from 'components/FormField/FormField';
import DeleteUserModal from 'components/ModalComponent/ModalChildrenComponents/DeleteModal/DeleteModal';
import ModalComponent from 'components/ModalComponent/ModalComponent';
import useWindowWidth from 'hooks/useWindowWidth';
import 'containers/Converter/_converter.scss';

const { Title, Text } = Typography;

const Converter = () => {
  const b = bem('Converter');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const windowWidth = useWindowWidth();

  const showDeleteModal = () => {
    setIsModalOpen(true);
  };

  const handleDeleteOkCancel = () => {
    setIsModalOpen(!isModalOpen);
  };

  return (
    <>
      <div className={b('')}>
        <Card>
          <div className={b('converter-block')}>
            <div>
              <img src={converterFile} alt={converterFile} />
            </div>
            <div className={b('convert-item')}>
              <Title className={b('title')} level={3}>
                Конвертер
              </Title>
              <p>Сконвертируйте ваши файлы в любой формат</p>
              <div className={b('select-block')}>
                из{' '}
                <FormField
                  className={b('select-field')}
                  type='select'
                  customStyle='80px'
                  suffixIcon={<img src={arrowDown} alt='arrowDown' />}
                />{' '}
                в{' '}
                <FormField
                  className={b('select-field')}
                  type='select'
                  customStyle='80px'
                  suffixIcon={<img src={arrowDown} alt='arrowDown' />}
                />
              </div>
              <Button className='button-style'>Выбрать файл</Button>
            </div>
          </div>
        </Card>

        {windowWidth <= 990 ? (
          <Link to='/files'>
            <Card hoverable style={{ width: 170 }}>
              <div className={b('files-link-block')}>
                <img src={converterFile} alt='converterFile' className={b('link-img')} />
                <Text strong>Мои файлы</Text>
              </div>
            </Card>
          </Link>
        ) : (
          <>
            <Text className={b('title title-heading')}>История конвертаций</Text>
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
          </>
        )}
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

export default Converter;
