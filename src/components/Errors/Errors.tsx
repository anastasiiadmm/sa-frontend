import React, { FC } from 'react';

import NotFound from 'components/Errors/NotFound/NotFound';

interface ErrorsProps {
  status: number | null | undefined;
  detail: string | null | undefined;
}
const Errors: FC<ErrorsProps> = ({ status, detail }) => {
  if (status === 404) {
    return (
      <NotFound
        showButton
        status={status}
        statusBool
        title={detail || 'Страница не найдена'}
        text='Попробуйте перейти на главную страницу или другую интересующую вас'
      />
    );
  }

  return (
    <NotFound
      showButton
      status={status}
      statusBool
      title={detail || 'Что-то пошло не так!'}
      text='Попробуйте перейти на главную страницу или другую интересующую вас'
    />
  );
};

export default Errors;
