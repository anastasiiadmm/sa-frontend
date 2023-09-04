import { authSelector } from 'redux/auth/authSlice';
import { useAppSelector } from 'redux/hooks';

export const useTokenConfigs = () => {
  const { tokens } = useAppSelector(authSelector);

  return tokens?.access && tokens?.refresh;
};
