export const textSlice = (value: string | undefined) => {
  if (value) {
    return value.slice(0, 1);
  }

  return '';
};
