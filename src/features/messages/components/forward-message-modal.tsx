import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogTrigger,
  DialogFooter,
  DialogTitle,
  DialogContent,
} from '@/components/ui/dialog';
import { Id } from '../../../../convex/_generated/dataModel';
import { useGetMessage } from '../api/use-get-message';
import Message from '@/components/message';
import { renderDisplayName } from '@/utils/label';
import { Dispatch, SetStateAction, useRef, useState } from 'react';
import Quill from 'quill';
import { CreateMessageValues } from '@/models';
import { toast } from 'sonner';
import { useCreateMessage } from '../api/use-create-message';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import MultiSelect from '@/components/multi-select';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { HashIcon, LockKeyhole } from 'lucide-react';
import { useGetConversations } from '@/features/conversations/api/use-get-conversations';
import MessageMedia from '@/components/message-media';
import dynamic from 'next/dynamic';

const Editor = dynamic(() => import('@/components/editor'), { ssr: false });

interface ForwardMessageModalProps {
  trigger: React.ReactNode;
  messageId: Id<'messages'>;
  title?: string;
  shareFileId?: Id<'files'>;
}

const ForwardMessageModal = ({
  trigger,
  messageId,
  title = 'Forward Message',
  shareFileId,
}: ForwardMessageModalProps) => {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogTitle>{title}</DialogTitle>
        {messageId && (
          <ForwardMessageContent
            messageId={messageId}
            setOpen={setOpen}
            shareFileId={shareFileId}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

const ForwardMessageContent = ({
  messageId,
  setOpen,
  shareFileId,
}: {
  messageId: Id<'messages'>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  shareFileId?: Id<'files'>;
}) => {
  const workspaceId = useWorkspaceId();
  const { data: message, isLoading } = useGetMessage({ id: messageId });
  const { mutate: createMessage } = useCreateMessage();

  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef<Quill | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [selects, setSelected] = useState<string[]>([]);

  const { data: channels } = useGetChannels({ workspaceId });
  const { data: conversations } = useGetConversations({ workspaceId });

  const shareFiles = (message?.files || []).filter(
    (file) => file.fileId === shareFileId
  );

  const handleSubmit = async ({ body }: { body: string }) => {
    if (!selects.length) return;

    setIsPending(true);
    editorRef?.current?.enable(false);

    try {
      await Promise.allSettled(
        selects.map(async (select) => {
          const [id, type] = select.split('-');
          try {
            const values: CreateMessageValues = {
              workspaceId,
              conversationId:
                type === 'conversation'
                  ? (id as Id<'conversations'>)
                  : undefined,
              channelId:
                type === 'channel' ? (id as Id<'channels'>) : undefined,
              body,
              forwardMessageId: shareFileId ? undefined : messageId,
              files: [],
            };

            const shareFileStoreId = shareFiles[0].info?._id;

            await createMessage(
              {
                ...values,
                files: shareFileStoreId
                  ? [shareFileStoreId as Id<'_storage'>]
                  : undefined,
              },
              { throwError: true }
            );
            setEditorKey((prevKey) => prevKey + 1);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
          } catch (error) {
            toast.error('Message is forward');
          }
        })
      );
    } finally {
      toast.success('Message is forward');
      setIsPending(false);
      editorRef?.current?.enable(true);
      setOpen(false);
    }
  };

  if (isLoading || !message) return <></>;

  return (
    <div className="flex flex-col gap-2">
      <MultiSelect
        options={[
          ...(conversations || []).map((conversation) => {
            return {
              value: `${conversation._id}-conversation`,
              label: renderDisplayName(
                conversation.withUser?.name,
                conversation.withUser?.memberPreference
              ),
              component: (
                <div
                  key={conversation._id}
                  className={cn('flex items-center gap-2 py-1')}
                >
                  <Avatar className="size-5 hover:opacity-75 transition">
                    <AvatarImage
                      alt={'image'}
                      src={
                        conversation.withUser?.memberPreference.image ||
                        conversation.withUser?.image
                      }
                    />
                    <AvatarFallback className="aspect-square rounded-md bg-sky-500 text-white flex justify-center items-center"></AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">
                    {renderDisplayName(
                      conversation.withUser?.name,
                      conversation.withUser?.memberPreference
                    )}
                  </span>
                </div>
              ),
            };
          }),
          ...(channels || [])?.map((channel) => {
            return {
              value: `${channel._id}-channel`,
              label: channel.name,
              component: (
                <div className="flex items-center gap-2 py-1">
                  {channel?.isPrivate ? (
                    <LockKeyhole className="size-5" />
                  ) : (
                    <HashIcon className="size-5" />
                  )}{' '}
                  {channel.name}
                </div>
              ),
            };
          }),
        ]}
        selectedOptions={selects}
        onChange={(selects) => {
          setSelected(selects);
        }}
        placeHolder="Search for channel or person"
      />
      <Editor
        key={editorKey}
        onSubmit={handleSubmit}
        innerRef={editorRef}
        disabled={isPending}
        placeholder="Add a message, if you like."
        variant="forward"
      />
      {!shareFileId && (
        <Message
          id={messageId}
          memberId={message.memberId}
          authorImage={
            message.user.memberPreference.image || message.user.image
          }
          authorName={renderDisplayName(
            message.user.name,
            message.user.memberPreference
          )}
          isAuthor={true}
          reactions={message.reactions}
          body={message.body}
          files={message.files}
          isEditing={false}
          setEditingId={() => {}}
          updatedAt={message.updatedAt}
          createdAt={message._creationTime}
          isSmallContainer
          isForward
        />
      )}
      {shareFileId && (
        <MessageMedia
          files={shareFiles}
          messageId={messageId}
          isSmallContainer={true}
        />
      )}
      <DialogFooter className="flex items-center">
        <Button type="button" variant="secondary" className="mr-auto">
          Copy link
        </Button>
        <Button type="button" variant="secondary">
          Save Draft
        </Button>
        <Button
          type="button"
          variant="secondary"
          className="bg-emerald-800 text-white"
          disabled={!selects.length}
          // onClick={() =>
          //   handleSubmit({ body: editorRef.current?.root.innerHTML || '' })
          // }
        >
          Forwardddd
        </Button>
      </DialogFooter>
    </div>
  );
};

export default ForwardMessageModal;
