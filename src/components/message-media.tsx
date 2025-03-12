import { FileStorage } from '@/app/models';
import { getFileType } from '@/app/utils/upload-file.utils';
import React, { useMemo, useState } from 'react';
import Thumbnail from './thumbnail';
import Media from './media';
import Hint from './hint';
import { Button } from './ui/button';
import { ChevronDown, Download, EllipsisVertical, Forward } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageMediaProps {
  files: FileStorage[];
}

const MessageMedia = ({ files }: MessageMediaProps) => {
  const [expend, setExpand] = useState(true);
  const isAllImage =
    files.filter((file) => getFileType(file.info?.contentType) === 'image')
      .length === files.length;

  const title = useMemo(() => {
    const filesLength = files.length;
    if (filesLength === 1) {
      return files[0].name;
    } else {
      return `${files.length} files`;
    }
  }, [files]);

  const Header = useMemo(() => {
    return (
      <div className="flex items-center gap-2">
        <p className="text-sm text-slate-600">{title}</p>
        <Button
          variant={'ghost'}
          className="p-1 h-min group/media-header"
          onClick={() => {
            setExpand((prev) => !prev);
          }}
        >
          <ChevronDown
            className={cn(
              'text-slate-600 size-3 group-hover/media-header:text-slate-900',
              expend && '-rotate-90'
            )}
          />
        </Button>
      </div>
    );
  }, [title, expend]);

  if (isAllImage) {
    return (
      <div>
        {Header}
        {expend && (
          <div className="flex flex-wrap gap-2">
            {files.map((file) => {
              return (
                <div key={file.info?._id}>
                  <MediaWrapper key={file.info?._id}>
                    <Thumbnail file={file} />
                  </MediaWrapper>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }
  return (
    <div>
      {Header}
      {expend && (
        <div className=" w-full lg:w-3/4 grid grid-cols-2 lg:grid-cols-3 gap-2 ">
          {files.map((file) => {
            return (
              <div key={file.info?._id}>
                <MediaWrapper>
                  <Media
                    fileName={file.name || (file.info?.contentType as string)}
                    type={file.info?.contentType as string}
                    url={file.url}
                  />
                </MediaWrapper>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const MediaWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="media-wrapper relative cursor-pointer group/media">
      <div className="z-[99] absolute top-3 right-3">
        <div className=" group-hover/media:opacity-100 opacity-0 transition-opacity border bg-white rounded-2xl shadow-sm p-1">
          <Hint label="Download">
            <Button
              variant={'ghost'}
              size={'sm'}
              disabled={false}
              onClick={() => {}}
            >
              <Download className="size-4" />
            </Button>
          </Hint>
          <Hint label="Share file...">
            <Button
              variant={'ghost'}
              size={'sm'}
              disabled={false}
              onClick={() => {}}
            >
              <Forward className="size-4" />
            </Button>
          </Hint>
          <Hint label="More actions">
            <Button
              variant={'ghost'}
              size={'sm'}
              disabled={false}
              onClick={() => {}}
            >
              <EllipsisVertical className="size-4" />
            </Button>
          </Hint>
        </div>
      </div>
      {children}
    </div>
  );
};

export default MessageMedia;
