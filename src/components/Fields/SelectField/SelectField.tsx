import { Select } from 'antd';
import React from 'react';

import { climateOptions } from 'types/types';

interface Props {
  handleChange?: () => void;
  defaultValue?: string;
  options?: climateOptions[];
}

const SelectField: React.FC<Props> = ({ handleChange, defaultValue, options }) => {
  return (
    <Select
      defaultValue={defaultValue}
      style={{ width: 'auto' }}
      onChange={handleChange}
      options={options}
    />
  );
};

export default SelectField;
