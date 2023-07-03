import { apiUrlCrop } from 'utils/config';

export function getFilenameFromPath(path: string | null) {
  if (path) {
    const parts = path.split('/');
    return parts[parts.length - 1];
  }
  return '';
}

export const urlFormat = (url: string | undefined) => {
  if (url) {
    return `${apiUrlCrop}${url}`;
  }

  return '';
};
