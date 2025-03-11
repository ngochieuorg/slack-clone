import { FileStorage } from '@/app/models';
import { getFileType } from '@/app/utils/upload-file.utils';
import React from 'react';
import Thumbnail from './thumbnail';
import Media from './media';

interface MessageMediaProps {
  files: FileStorage[];
}

const MessageMedia = ({ files }: MessageMediaProps) => {
  const isAllImage =
    files.filter((file) => getFileType(file.info?.contentType) === 'image')
      .length === files.length;

  if (isAllImage) {
    return (
      <div className="flex flex-wrap gap-2">
        {files.map((file) => {
          return <Thumbnail file={file} key={file.info?._id} />;
        })}
      </div>
    );
  }
  return (
    <div className=" w-full lg:w-3/4 grid grid-cols-2 lg:grid-cols-3 gap-2 ">
      {files.map((file) => {
        return (
          <Media
            key={file.info?._id}
            fileName={file.name || (file.info?.contentType as string)}
            type={file.info?.contentType as string}
            url={file.url}
          />
        );
      })}
    </div>
  );
};

export default MessageMedia;
