import dynamic from 'next/dynamic';
import { Doc, Id } from '../../convex/_generated/dataModel';
import { format } from 'date-fns';
import Hint from './hint';
import { Avatar, AvatarImage } from './ui/avatar';
import { AvatarFallback } from '@radix-ui/react-avatar';
import Thumbnail from './thumbnail';
import Toolbar from './toolbar';
import { useUpdateMessage } from '@/features/messages/api/use-update-message';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useRemoveMessage } from '@/features/messages/api/use-remove-message';
import useConfirm from '@/hooks/use-confirm';
import { useToggleReaction } from '@/features/reactions/api/use-toggle-reaction';
import Reactions from './reactions';
import { usePanel } from '@/hooks/use-panel';
import ThreadBar from './thread-bar';
import { formatFulltime } from '@/app/utils/date-time';
import { useChannelId } from '@/hooks/use-channel-id';

const Renderer = dynamic(() => import('@/components/renderer'), { ssr: true });
const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface MessageProps {
  id: Id<'messages'>;
  memberId: Id<'members'>;
  authorImage?: string;
  authorName?: string;
  isAuthor: boolean;
  reactions: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number;
      memberIds: Id<'members'>[];
    }
  >;
  body: Doc<'messages'>['body'];
  image: string | null | undefined;
  createdAt: Doc<'messages'>['_creationTime'];
  updatedAt: Doc<'messages'>['updatedAt'];
  isEditing: boolean;
  isCompact?: boolean;
  setEditingId: (id: Id<'messages'> | null) => void;
  hideThreadButton?: boolean;
  threadCount?: number;
  threadImage?: string;
  threadName?: string;
  threadTimestamp?: number;
  threadUsers?: (Doc<'users'> | null | undefined)[];
}

const Message = ({
  id,
  memberId,
  authorImage,
  authorName = 'Member',
  isAuthor,
  reactions,
  body,
  image,
  createdAt,
  updatedAt,
  isEditing,
  isCompact,
  setEditingId,
  hideThreadButton,
  threadCount,
  threadImage,
  threadTimestamp,
  threadName,
  threadUsers,
}: MessageProps) => {
  const channelId = useChannelId();
  const { parentMessageId, onOpenMessage, onClose, onOpenProfileMember } =
    usePanel();
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete message',
    'Are you sure want to delete this message'
  );

  const { mutate: updateMessage, isPending: isUpdatingMessage } =
    useUpdateMessage();
  const { mutate: removeMessage, isPending: isRemovingMessage } =
    useRemoveMessage();
  const { mutate: toggleReaction, isPending: isTogglingReaction } =
    useToggleReaction();

  const isPending = isUpdatingMessage || isTogglingReaction;

  const handleUpdate = ({ body }: { body: string }) => {
    updateMessage(
      { id, body },
      {
        onSuccess: () => {
          toast.success('Message updated');
          setEditingId(null);
        },
        onError: () => {
          toast.success('Failed to update message');
        },
      }
    );
  };

  const handleRemove = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeMessage(
      { id },
      {
        onSuccess: () => {
          toast.success('Message deleted');

          if (parentMessageId === id) {
            onClose();
          }
        },
        onError: () => {
          toast.error('Failed to delete message');
        },
      }
    );
  };

  const handleReaction = (value: string) => {
    toggleReaction(
      { messageId: id, value, channelId },
      {
        onError: () => {
          toast.error('Failed to toggle reaction');
        },
      }
    );
  };

  if (isCompact) {
    return (
      <>
        <ConfirmDialog />
        <div
          className={cn(
            'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
            isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
            isRemovingMessage &&
              'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200'
          )}
        >
          <div className="flex items-start gap-2">
            <Hint label={formatFulltime(new Date(createdAt))}>
              <button className="text-xs text-muted-foreground opacity-0 group-hover:opacity-100 w-[40px] leading-[22px] text-center hover:underline">
                {format(new Date(createdAt), 'hh:mm')}
              </button>
            </Hint>
            {isEditing ? (
              <div className="w-full h-full">
                <Editor
                  onSubmit={handleUpdate}
                  disabled={isPending}
                  defaultValue={JSON.parse(body)}
                  onCancel={() => setEditingId(null)}
                  variant="update"
                />
              </div>
            ) : (
              <div className="flex  flex-col w-full">
                <Renderer value={body} />
                <Thumbnail url={image} />
                {updatedAt ? (
                  <span className="text-xs text-muted-foreground">
                    (edited)
                  </span>
                ) : null}
                <Reactions data={reactions} onChange={handleReaction} />
                <ThreadBar
                  count={threadCount}
                  image={threadImage}
                  timstamp={threadTimestamp}
                  onClick={() => onOpenMessage(id)}
                  name={threadName}
                  threadUsers={threadUsers}
                />
              </div>
            )}
          </div>
          {!isEditing && (
            <Toolbar
              isAuthor={isAuthor}
              isPending={isPending}
              handleEdit={() => setEditingId(id)}
              handleThread={() => onOpenMessage(id)}
              handleDelete={handleRemove}
              handleReaction={handleReaction}
              hideThreadButton={hideThreadButton}
            />
          )}
        </div>
      </>
    );
  }

  const avatarFallback = authorName.charAt(0).toUpperCase();
  return (
    <>
      <ConfirmDialog />
      <div
        className={cn(
          'flex flex-col gap-2 p-1.5 px-5 hover:bg-gray-100/60 group relative',
          isEditing && 'bg-[#f2c74433] hover:bg-[#f2c74433]',
          isRemovingMessage &&
            'bg-rose-500/50 transform transition-all scale-y-0 origin-bottom duration-200'
        )}
      >
        <div className="flex items-start gap-2">
          <button onClick={() => onOpenProfileMember(memberId)}>
            <Avatar className="size-10 hover:opacity-75 transition">
              <AvatarImage src={authorImage} />
              <AvatarFallback className="aspect-square rounded-md bg-sky-500 text-white">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
          </button>
          {isEditing ? (
            <div className="w-full h-full">
              <Editor
                onSubmit={handleUpdate}
                disabled={isPending}
                defaultValue={JSON.parse(body)}
                onCancel={() => setEditingId(null)}
                variant="update"
              />
            </div>
          ) : (
            <div className="flex flex-col w-full overflow-hidden">
              <div className="text-sm">
                <button
                  onClick={() => onOpenProfileMember(memberId)}
                  className="font-bold text-primary hover:underline"
                >
                  {authorName}
                </button>
                <span>&nbsp;&nbsp;</span>
                <Hint label={formatFulltime(new Date(createdAt))}>
                  <button className="text-xs text-muted-foreground hover:underline">
                    {format(new Date(createdAt), 'h:mm a')}
                  </button>
                </Hint>
              </div>
              <Renderer value={body} />
              <Thumbnail url={image} />
              {updatedAt ? (
                <span className="text-xs text-muted-foreground">(edited)</span>
              ) : null}
              <Reactions data={reactions} onChange={handleReaction} />
              <ThreadBar
                count={threadCount}
                image={threadImage}
                timstamp={threadTimestamp}
                onClick={() => onOpenMessage(id)}
                name={threadName}
                threadUsers={threadUsers}
              />
            </div>
          )}
        </div>
        {!isEditing && (
          <Toolbar
            isAuthor={isAuthor}
            isPending={isPending}
            handleEdit={() => setEditingId(id)}
            handleThread={() => onOpenMessage(id)}
            handleDelete={handleRemove}
            handleReaction={handleReaction}
            hideThreadButton={hideThreadButton}
          />
        )}
      </div>
    </>
  );
};

export default Message;
