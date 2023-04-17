import { Select } from 'antd';
import React from 'react';

import { climateOptions } from 'types/types';

interface Props {
  handleChange?: () => void;
  defaultValue?: string;
  disabled?: boolean;
  customStyle?: string;
  options?: climateOptions[];
}

const SelectField: React.FC<Props> = ({
  handleChange,
  disabled,
  defaultValue,
  options,
  customStyle,
}) => {
  return (
    <Select
      disabled={disabled}
      defaultValue={defaultValue}
      style={{ width: customStyle ?? 'auto' }}
      onChange={handleChange}
      options={options}
    />
  );
};

export default SelectField;
