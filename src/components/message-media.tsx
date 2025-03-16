/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { Dialog, DialogClose, DialogContent, DialogTitle } from './ui/dialog';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden'; // Import VisuallyHidden
import PreviewFile from './preview-file';
import ForwardMessageModal from '@/features/messages/components/forward-message-modal';

interface MessageMediaProps {
  files: FileStorage[];
  messageId: Id<'messages'>;
  isSmallContainer?: boolean;
}

const MessageMedia = ({
  files,
  messageId,
  isSmallContainer,
}: MessageMediaProps) => {
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
        <div
          className={cn(
            'w-full lg:w-3/4 grid grid-cols-1 lg:grid-cols-2 gap-2',
            isSmallContainer && 'lg:grid-cols-1 lg:w-full'
          )}
        >
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
  const [openPreview, setOpenPreview] = useState(false);

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

  const handleDownloadFile = async () => {
    if (file?.url) {
      try {
        // Check if the File System Access API is supported
        if ('showSaveFilePicker' in window) {
          // Fetch the file from the URL
          const response = await fetch(file.url);
          const blob = await response.blob();

          // Show the file save dialog
          try {
            const fileHandle = await (window as any).showSaveFilePicker({
              suggestedName: file.name || 'downloaded-file',
              types: [
                {
                  description: 'All Files',
                  accept: { '*/*': [] },
                },
              ],
            });

            const writable = await fileHandle.createWritable();
            await writable.write(blob);
            await writable.close();
          } catch (error: any) {
            if (error.name === 'AbortError') {
              console.log('User canceled the file save dialog.');
            } else {
              console.error('Error saving file:', error);
            }
          }
        } else {
          // Fallback for browsers that do not support the File System Access API
          const link = document.createElement('a');
          link.href = file.url;
          link.download = file.name || (file.info?.contentType as string);
          link.target = '_blank';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(link.href);
        }
      } catch (error) {
        console.error('Error downloading file:', error);
        toast.error('Failed to download file');
      }
    }
  };

  return (
    <>
      <div className="z-40 media-wrapper relative cursor-zoom-in group/media">
        <ConfirmDeleteFileDialog />
        <div className="media-action z-50 absolute top-3 right-3">
          <div className="group-hover/media:opacity-100 opacity-0 transition-opacity border bg-white rounded-2xl shadow-sm p-1">
            <Hint label="Download">
              <Button
                variant={'ghost'}
                size={'sm'}
                disabled={!file?.url}
                onClick={handleDownloadFile}
              >
                <Download className="size-4" />
              </Button>
            </Hint>
            <Hint label="Share file...">
              <ForwardMessageModal
                trigger={
                  <Button
                    variant={'ghost'}
                    size={'sm'}
                    disabled={false}
                    onClick={() => {}}
                  >
                    <Forward className="size-4" />
                  </Button>
                }
                messageId={messageId}
                shareFileId={file?.fileId}
                title="Share this file"
              />
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
        <div onClick={() => setOpenPreview(true)}>{children}</div>
      </div>
      <Dialog open={openPreview}>
        <DialogContent
          className="h-[98%] max-w-[98vw] border-none bg-black bg-opacity-40  p-0 shadow-none"
          hiddenClose
        >
          <VisuallyHidden>
            <DialogTitle>File Preview</DialogTitle>
          </VisuallyHidden>
          {file && <PreviewFile file={file} />}
          <DialogClose asChild className=" absolute top-0 right-0">
            <Button
              type="button"
              variant="secondary"
              className="size-1 p-3"
              onClick={() => setOpenPreview(false)}
            >
              x
            </Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </>
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
