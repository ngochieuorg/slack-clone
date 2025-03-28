export const getFileType = (
  type?: string
): 'image' | 'pdf' | 'doc' | 'sheet' | 'unknown' => {
  if (type?.includes('image')) {
    return 'image';
  } else if (type?.includes('pdf')) {
    return 'pdf';
  } else if (type?.includes('wordprocessingml.document')) {
    return 'doc';
  } else if (type?.includes('spreadsheetml.sheet')) {
    return 'sheet';
  } else return 'unknown';
};
