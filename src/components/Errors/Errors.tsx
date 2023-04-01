import React, { FC } from 'react';

import NotFound from 'components/Errors/NotFound/NotFound';

interface ErrorsProps {
  status: number | undefined;
  detail: string | undefined;
}
const Errors: FC<ErrorsProps> = ({ status, detail }) => {
  if (Number(status) >= 500) {
    return (
      <NotFound
        title={detail || 'Что то пошло не так!'}
        text='Попробуйте перейти на главную страницу или любую интересующую вас'
      />
    );
  }
  return (
    <NotFound
      title={detail || 'Что то пошло не так!'}
      text='Попробуйте перейти на главную страницу или любую интересующую вас'
    />
  );
};

export default Errors;
