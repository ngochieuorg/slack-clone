import { getFileType } from '@/app/utils/upload-file.utils';
import Image from 'next/image';
import React from 'react';

interface MediaProps {
  type: string;
  fileName: string;
  url?: string | null;
}
const Media = ({ type, fileName, url }: MediaProps) => {
  let src = '';
  let fileNameLabel = '';
  if (getFileType(type) === 'pdf') {
    src = '/pdf.svg';
    fileNameLabel = 'PDF';
  } else if (getFileType(type) === 'sheet') {
    src = '/xlsx-file.svg';
    fileNameLabel = 'Excel Spreadsheet';
  } else if (getFileType(type) === 'doc') {
    src = '/word-document.svg';
    fileNameLabel = 'Word Document';
  }

  return (
    <div className="h-[62px] flex gap-2 rounded-lg overflow-hidden border object-cover p-3">
      {getFileType(type) === 'image' ? (
        <Image
          width={40}
          height={40}
          src={url as string}
          alt={`file image`}
          className="rounded"
          style={{ width: 'auto', height: 'auto' }}
        />
      ) : (
        <Image
          width={40}
          height={40}
          src={src}
          alt={`file image`}
          style={{ width: 'auto', height: 'auto' }}
        />
      )}
      <div>
        <span className=" font-semibold text-sm truncate">{fileName}</span>
        <p className=" text-sm">{fileNameLabel}</p>
      </div>
    </div>
  );
};

export default Media;
