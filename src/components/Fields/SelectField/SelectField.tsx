import { Select } from 'antd';
import React from 'react';

import { climateOptions } from 'interfaces';

interface Props {
  handleChange?: () => void;
  defaultValue?: string;
  disabled?: boolean;
  customStyle?: string;
  className?: string;
  suffixIcon?: React.ReactNode;
  options?: climateOptions[];
}

const SelectField: React.FC<Props> = ({
  handleChange,
  disabled,
  defaultValue,
  options,
  customStyle,
  className,
  suffixIcon,
}) => {
  return (
    <Select
      disabled={disabled}
      defaultValue={defaultValue}
      style={{ width: customStyle ?? '220px' }}
      className={className}
      onChange={handleChange}
      options={options}
      suffixIcon={suffixIcon}
    />
  );
};

export default SelectField;
