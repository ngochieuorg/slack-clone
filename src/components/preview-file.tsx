import { FileStorage } from '@/models';
import { getFileType } from '@/utils/upload-file.utils';

import Image from 'next/image';

export default function PreviewFile({ file }: { file: FileStorage }) {
  if (getFileType(file.info?.contentType) === 'pdf') {
    return (
      <div className="w-full h-full">
        <iframe
          src={file?.url as string}
          width="100%"
          height="100%"
          style={{ border: 'none' }}
        >
          Your browser does not support PDFs.
        </iframe>
      </div>
    );
  }
  if (getFileType(file.info?.contentType) === 'image') {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Image
          src={file.url as string}
          alt="Preview Image"
          width={500}
          height={300}
        />
      </div>
    );
  }
  if (
    getFileType(file.info?.contentType) === 'doc' ||
    getFileType(file.info?.contentType) === 'sheet'
  ) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
            file.url as string
          )}`}
          width="100%"
          height="600px"
          style={{ border: 'none' }}
        >
          Your browser does not support iframes.
        </iframe>
      </div>
    );
  }
}
