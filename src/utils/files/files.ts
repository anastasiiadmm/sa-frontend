export function getFilenameFromPath(path: string | null) {
  if (path) {
    const parts = path.split('/');
    return parts[parts.length - 1];
  }
  return '';
}
