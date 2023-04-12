import {
  CaretDownOutlined,
  CaretRightOutlined,
  ClusterOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Tag } from 'antd';
import bem from 'easy-bem';
import React, { useState } from 'react';

import 'components/Fields/CustomDropdown/_customDropdown.scss';

interface Props {
  id: string | undefined;
  dropdownOptions: any;
}

const CustomDropdown: React.FC<Props> = ({ id, dropdownOptions }) => {
  const b = bem('CustomDropdown');
  const [isOpen, setIsOpen] = useState(true);
  const [selectedOption, setSelectedOption] = useState('');

  const handleOptionClick = (option: any) => {
    setSelectedOption(option);
  };

  return (
    <div className={b()}>
      <div className={b('dropdown-toggle')}>
        <div
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
        <div>
          <EyeOutlined /> <EyeInvisibleOutlined />
        </div>
      </div>
      {isOpen && (
        <ul className={b('dropdown-menu')}>
          {dropdownOptions?.map((option: any) => (
            <li
              key={option?.groupId}
              onClick={() => handleOptionClick(option)}
              tabIndex={0}
              role='button'
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  setIsOpen(!isOpen);
                }
              }}
            >
              <Tag color={option?.sensor?.color} className={b('dropdown-tag')} />
              <a>
                {option?.sensor?.name}{' '}
                <span>{option?.sensor?.ch ? `[${option?.sensor?.ch}]` : null}</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;
