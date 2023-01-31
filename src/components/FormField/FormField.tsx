import React from 'react';

import CheckboxField from 'components/Fields/CheckboxField/CheckboxField';
import DefaultField from 'components/Fields/DefaultField/DefaultField';
import EmailField from 'components/Fields/EmailField/EmailField';
import PasswordField from 'components/Fields/PasswordField/PasswordField';

interface Props {
  type?: string;
  [p: string]: any;
}

const FormField: React.FC<Props> = ({ type, ...props }) => {
  switch (type) {
    case 'email':
      return <EmailField {...props} />;
    case 'password':
      return <PasswordField {...props} />;
    case 'checkbox':
      return <CheckboxField {...props} />;
    default:
      return <DefaultField {...props} />;
  }
};

export default FormField;
