import React from 'react';

import DefaultField from 'components/Fields/DefaultField/DefaultField';
import EmailField from 'components/Fields/EmailField/EmailField';
import PasswordField from 'components/Fields/PasswordField/PasswordField';

interface Props {
  type: string;
  label: string;
  name: string;
  [p: string]: any;
}

const FormField: React.FC<Props> = ({ type, label, name, ...props }) => {
  switch (type) {
    case 'email':
      return <EmailField label={label} name={name} {...props} />;
    case 'password':
      return <PasswordField label={label} name={name} {...props} />;
    default:
      return <DefaultField {...props} />;
  }
};

export default FormField;
