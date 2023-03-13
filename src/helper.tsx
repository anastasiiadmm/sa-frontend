import { updateManagerDataMutation } from 'types';

export const removeEmptyValuesFromObject = (obj: any) => {
  return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== ''));
};

export const isObjectChangeValidate = (
  origin: updateManagerDataMutation,
  update: updateManagerDataMutation,
) => {
  const originJson = {
    username: origin.username,
    password: origin.password,
    first_name: origin.first_name,
    middle_name: origin.middle_name,
    last_name: origin.last_name,
    email: origin.email,
    phone: origin.phone,
  };
  const updateJson = {
    username: update.username,
    password: update.password,
    first_name: update.first_name,
    middle_name: update.middle_name,
    last_name: update.last_name,
    email: update.email,
    phone: update.phone,
  };
  return (
    JSON.stringify(originJson).replace(/ /g, '') === JSON.stringify(updateJson).replace(/ /g, '')
  );
};
