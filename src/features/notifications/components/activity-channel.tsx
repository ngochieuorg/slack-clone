// Dynamic Imports
import dynamic from 'next/dynamic';

// Hooks
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useGetMessage } from '@/features/messages/api/use-get-message';
import { useGetMessages } from '@/features/messages/api/use-get-messages';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useCreateFile } from '@/features/upload/api/use-create-file';

// Utilities
import { format, differenceInMinutes } from 'date-fns';
import { cn } from '@/lib/utils';

// Components
import Message from '@/components/message';
import { Button } from '@/components/ui/button';

// Icons
import { Loader, XIcon } from 'lucide-react';

// Libraries
import Quill from 'quill';
import { toast } from 'sonner';

// React
import { useEffect, useRef, useState } from 'react';

// Types
import { Id } from '../../../../convex/_generated/dataModel';
import { renderDisplayName } from '@/app/utils/label';
import { CreateMessageValues } from '@/app/models';

// Dynamic Component
const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

const TIME_THRESHHOLD = 5;

interface ActivityChannelProps {
  channelId?: string;
  parentMessageId?: string;
  messageId: string;
}

const ActivityChannel = ({ channelId, messageId }: ActivityChannelProps) => {
  const workspaceId = useWorkspaceId();

  const editorRef = useRef<Quill | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);
  const [hightLight, setHightLight] = useState(true);

  const { data: currentMember } = useCurrentMember({ workspaceId });

  const { data: message, isLoading: loadingMessage } = useGetMessage({
    id: messageId as Id<'messages'>,
  });

  const { results, status, loadMore } = useGetMessages({
    channelId: channelId as Id<'channels'>,
  });

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: createFile } = useCreateFile();

  useEffect(() => {
    const timeout = setTimeout(() => {
      setHightLight(false);
    }, 3000);
    return () => {
      setHightLight(true);
      clearTimeout(timeout);
    };
  }, [messageId]);

  const canLoadMore = status === 'CanLoadMore';
  const isLoadingMore = status === 'LoadingMore';

  const groupedMessage = results?.reduce(
    (groups, message) => {
      const date = new Date(message._creationTime);
      const dateKey = format(date, 'yyyy-MM-dd');

      if (!groups[dateKey]) {
        groups[dateKey] = [];
      }
      groups[dateKey].unshift(message);
      return groups;
    },
    {} as Record<string, typeof results>
  );

  const handleSubmit = async ({
    body,
    files,
  }: {
    body: string;
    files: File[];
  }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        channelId: channelId as Id<'channels'>,
        workspaceId,
        body,
        files: [],
      };

      await Promise.all(
        files.map(async (file) => {
          if (file) {
            const url = await generateUploadUrl({}, { throwError: true });

            const result = await fetch(url, {
              method: 'POST',
              headers: { 'Content-Type': file.type },
              body: file,
            });

            if (!result) {
              throw new Error('Failed to upload image');
            }

            const { storageId } = await result.json();
            await createFile({ storageId, name: file.name }, {});

            values.files = [...values.files, storageId];
          }
        })
      );

      await createMessage(values, { throwError: true });
      setEditorKey((prevKey) => prevKey + 1);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  if (loadingMessage || status === 'LoadingFirstPage') {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Thread</p>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col max-h-full overflow-y-auto">
      <div className="min-h-[49px] flex items-center px-4 border-b gap-2">
        <p className="text-lg font-bold"># {message.channel?.name}</p>
        <Button
          onClick={() => {}}
          size={'iconSm'}
          variant={'ghost'}
          className="ml-auto"
        >
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex-1 flex flex-col-reverse pb-4 overflow-y-auto messages-scrollbar">
        <div className="px-4">
          <Editor
            key={editorKey}
            onSubmit={handleSubmit}
            innerRef={editorRef}
            disabled={isPending}
            placeholder="Reply..."
          />
        </div>
        {Object.entries(groupedMessage || {}).map(([dateKey, messages]) => (
          <div key={dateKey}>
            {messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const isCompact =
                prevMessage &&
                prevMessage.user._id === message.user._id &&
                differenceInMinutes(
                  new Date(prevMessage._creationTime),
                  new Date(message._creationTime)
                ) < TIME_THRESHHOLD;
              return (
                <Message
                  key={message._id}
                  id={message._id}
                  memberId={message.memberId}
                  authorImage={message.user.image}
                  authorName={renderDisplayName(
                    message.user.name,
                    message.user.memberPreference
                  )}
                  isAuthor={message.memberId === currentMember?._id}
                  reactions={message.reactions}
                  body={message.body}
                  files={message.files}
                  updatedAt={message.updatedAt}
                  createdAt={message._creationTime}
                  isEditing={editingId === message._id}
                  setEditingId={setEditingId}
                  isCompact={isCompact}
                  hideThreadButton={true}
                  threadCount={message.threadCount}
                  threadImage={message.threadImage}
                  threadTimestamp={message.threadTimestamp}
                  threadName={message.threadName}
                  threadUsers={message.usersInThread}
                  className={cn(
                    message._id === messageId && 'bg-gray-100/60',
                    message._id === messageId &&
                      hightLight &&
                      'bg-[#f2c74433] transition duration-2000 ease-in-out'
                  )}
                />
              );
            })}
          </div>
        ))}
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && canLoadMore) {
                    loadMore();
                  }
                },
                { threshold: 1.0 }
              );

              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />
        {isLoadingMore && (
          <div className="text-center my-2 relative">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block bg-white px-4 py-1 rounded-full text-xs border border-gray-300 shadow-sm">
              <Loader className="size-4 animate-spin" />
            </span>
          </div>
        )}
        {results.length > 0 && (
          <div className="my-2 relative mx-4">
            <hr className="absolute top-1/2 left-0 right-0 border-t border-gray-300" />
            <span className="relative inline-block px-2 py-1 text-xs bg-white left-10 text-muted-foreground">
              {results.length} replies
            </span>
          </div>
        )}
        <Message
          hideThreadButton
          memberId={message.memberId}
          authorImage={message?.user?.image}
          authorName={renderDisplayName(
            message.user?.name,
            message.user?.memberPreference
          )}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          files={message.files}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
      </div>
    </div>
  );
};

export default ActivityChannel;
