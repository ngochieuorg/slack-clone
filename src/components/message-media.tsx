import { FileStorage } from '@/app/models';
import { getFileType } from '@/app/utils/upload-file.utils';
import React, { useMemo, useState } from 'react';
import Thumbnail from './thumbnail';
import Media from './media';
import Hint from './hint';
import { Button } from './ui/button';
import {
  ChevronDown,
  Download,
  EllipsisVertical,
  ExternalLink,
  Forward,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Separator } from './ui/separator';
import useConfirm from '@/hooks/use-confirm';
import { Id } from '../../convex/_generated/dataModel';
import { useRemoveFile } from '@/features/upload/api/use-remove-file';
import { toast } from 'sonner';
import UpdateFileModal from '@/features/upload/component/update-file-modal';

interface MessageMediaProps {
  files: FileStorage[];
  messageId: Id<'messages'>;
}

const MessageMedia = ({ files, messageId }: MessageMediaProps) => {
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
              !expend && '-rotate-90'
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
                  <MediaWrapper
                    key={file.info?._id}
                    messageId={messageId}
                    file={file}
                  >
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
        <div className=" w-full lg:w-3/4 grid grid-cols-1 lg:grid-cols-2 gap-2 ">
          {files.map((file) => {
            return (
              <MediaWrapper
                messageId={messageId}
                key={file.info?._id}
                file={file}
              >
                <Media
                  fileName={file.name || (file.info?.contentType as string)}
                  type={file.info?.contentType as string}
                  url={file.url}
                />
              </MediaWrapper>
            );
          })}
        </div>
      )}
    </div>
  );
};

const MediaWrapper = ({
  children,
  messageId,
  file,
}: {
  children: React.ReactNode;
  messageId: Id<'messages'>;
  file?: FileStorage;
}) => {
  const { mutate: removeFile } = useRemoveFile();

  const [ConfirmDeleteFileDialog, confirmDeleteFile] = useConfirm(
    'Delete file?',
    <div className="mt-4">
      <p className="mb-4">
        Are you sure you want to delete this file permanently?
      </p>
      <Media
        fileName={file?.name || (file?.info?.contentType as string)}
        type={file?.info?.contentType as string}
        url={file?.url}
      />
    </div>
  );

  const handleRemoveMember = async () => {
    console.log(file);
    if (file?.fileId) {
      const ok = await confirmDeleteFile();

      if (!ok) return;
      removeFile(
        {
          fileId: file?.fileId,
          messageId,
        },
        {
          onSuccess: () => {
            toast.success('Remove');
          },
        }
      );
    }
  };
  return (
    <div className="media-wrapper relative cursor-pointer group/media">
      <ConfirmDeleteFileDialog />
      <div className="z-[50] absolute top-3 right-3">
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
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={'ghost'}
                  size={'sm'}
                  disabled={false}
                  onClick={() => {}}
                >
                  <EllipsisVertical className="size-4" />
                </Button>
              </PopoverTrigger>
              <PopoverContent side="left" className="py-2 px-0">
                <MediaOption>
                  <div className="flex items-center justify-between">
                    <p>Open in new tab</p>
                    <ExternalLink className="size-4" />
                  </div>
                </MediaOption>
                <MediaOption>View file details</MediaOption>
                <MediaOption>Copy link to the file</MediaOption>
                <MediaOption>Save for later</MediaOption>
                <Separator />
                <UpdateFileModal file={file}>
                  <MediaOption>Edit file details</MediaOption>
                </UpdateFileModal>
                <Separator />
                <div
                  onClick={handleRemoveMember}
                  className="px-4 py-1 cursor-pointer text-red-800 hover:text-white hover:bg-red-800"
                >
                  Delete file
                </div>
              </PopoverContent>
            </Popover>
          </Hint>
        </div>
      </div>
      {children}
    </div>
  );
};

const MediaOption = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      onClick={onClick}
      className="px-4 py-1 cursor-pointer hover:text-white hover:bg-sky-600"
    >
      {children}
    </div>
  );
};

export default MessageMedia;
