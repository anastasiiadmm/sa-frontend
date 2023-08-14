import { Button, List, Typography } from 'antd';
import bem from 'easy-bem';
import React from 'react';

import 'containers/Converter/ConverterList/_converterList.scss';

const { Text } = Typography;

const data = [
  'Название файла.jpg',
  'Название файла.jpg',
  'Название файла.jpg',
  'Название файла.jpg',
  'Название файла.jpg',
];

const ConverterList = () => {
  const b = bem('ConverterList');

  return (
    <div className={b('')}>
      <div className={b('list-block')}>
        <List
          className={b('files-item')}
          bordered
          dataSource={data}
          renderItem={(item) => (
            <List.Item>
              <Text strong>{item}</Text>
            </List.Item>
          )}
        />
      </div>

      <div className={b('button-block')}>
        <Button type='primary'>Конвертировать</Button>
      </div>
    </div>
  );
};

export default ConverterList;
