import { message } from 'antd';

export const fileValidateImg = (file: File) => {
  if (!file.type.includes('image/jpeg') && !file.type.includes('image/png')) {
    message.error('Неверный формат изображения');
    return false;
  }

  return true;
};

export const fileSizeValidate = (file: File) => {
  if (+file.size.toString() >= 5000000) {
    message.error('Размер изображения слишком большой');
    return false;
  }

  return true;
};
