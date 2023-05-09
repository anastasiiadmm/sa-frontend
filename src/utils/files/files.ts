import { apiUrlCrop } from 'utils/config';

export function getFilenameFromPath(path: string | null) {
  if (path) {
    const parts = path.split('/');
    return parts[parts.length - 1];
  }
  return '';
}

export const urlFormat = (url: string) => {
  if (url) {
    const format = url.replace('http://sa-backend/', '');
    return `${apiUrlCrop}/${format}`;
  }

  return '';
};
