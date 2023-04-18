import { CaretDownOutlined, CaretRightOutlined, ClusterOutlined } from '@ant-design/icons';
import { Tag } from 'antd';
import bem from 'easy-bem';
import React, { useState } from 'react';

import { rangeDataDaysSensors, rangeDataHoursSensors } from 'utils/constants';
import 'components/Fields/CustomDropdown/_customDropdown.scss';

interface Props {
  id: string | undefined;
  dropdownOptions: typeof rangeDataHoursSensors | typeof rangeDataDaysSensors | null | undefined;
}

const CustomDropdown: React.FC<Props> = ({ id, dropdownOptions }) => {
  const b = bem('CustomDropdown');
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className={b()}>
      <div className={b('dropdown-toggle')}>
        <div
          className={b('dropdown-info')}
          tabIndex={0}
          role='button'
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              setIsOpen(!isOpen);
            }
          }}
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <CaretDownOutlined /> : <CaretRightOutlined />} <ClusterOutlined /> {id}{' '}
        </div>
      </div>
      {isOpen && (
        <ul className={b('dropdown-menu')}>
          {dropdownOptions?.map((option: any) => (
            <li key={option?.groupId}>
              <Tag color={option?.sensor?.color} className={b('dropdown-tag')} />
              {option?.sensor?.name}{' '}
              <span>{option?.sensor?.ch ? `[${option?.sensor?.ch}]` : null}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
