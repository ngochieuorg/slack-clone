import React, { useRef, useState } from 'react';
import { Doc, Id } from '../../../../../convex/_generated/dataModel';
import { useGetMessage } from '@/features/messages/api/use-get-message';
import Message from '@/components/message';
import { AlertTriangle } from 'lucide-react';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useGetMessages } from '@/features/messages/api/use-get-messages';
import Editor from '@/components/editor';
import Quill from 'quill';
import { toast } from 'sonner';
import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';

interface ThreadComponentProps {
  messageId: Id<'messages'>;
  userInThreads: (Doc<'users'> | null | undefined)[];
}

type CreateMessageValues = {
  channelId: Id<'channels'>;
  workspaceId: Id<'workspaces'>;
  parentMessageId: Id<'messages'>;
  body: string;
  image: Id<'_storage'> | undefined;
};

const initMessLoad = 2;

const ThreadComponent = ({
  messageId,
  userInThreads,
}: ThreadComponentProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const [isFetchAll, setIsFetchAll] = useState(false);

  const { data: message, isLoading: loadingMessage } = useGetMessage({
    id: messageId,
  });

  const { results, status, totalItems } = useGetMessages({
    channelId: message?.channelId,
    parentMessageId: messageId,
    initialNumItems: initMessLoad,
    fetchAll: isFetchAll,
  });

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const [editingId, setEditingId] = useState<Id<'messages'> | null>(null);
  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef<Quill | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      if (!message?.channelId) return;

      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        channelId: message?.channelId,
        workspaceId,
        body,
        image: undefined,
        parentMessageId: messageId,
      };

      if (image) {
        const url = await generateUploadUrl({}, { throwError: true });

        const result = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': image.type },
          body: image,
        });

        if (!result) {
          throw new Error('Failed to upload image');
        }

        const { storageId } = await result.json();

        values.image = storageId;
      }

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
    return null;
  }

  if (!message) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Message not found</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div>
        <div className="font-medium text-slate-800">
          # {message.channel?.name}
        </div>
        <div className="text-xs font-medium text-muted-foreground">
          {userInThreads.map(
            (user, idx) =>
              `${user?.name}${idx !== userInThreads.length - 1 ? ',' : ''}`
          )}{' '}
          and you
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <Message
          hideThreadButton
          memberId={message.memberId}
          authorImage={message?.user?.image}
          authorName={message.user?.name}
          isAuthor={message.memberId === currentMember?._id}
          body={message.body}
          image={message.image}
          createdAt={message._creationTime}
          updatedAt={message.updatedAt}
          id={message._id}
          reactions={message.reactions}
          isEditing={editingId === message._id}
          setEditingId={setEditingId}
        />
        <div className="flex flex-col-reverse">
          {results.map((message) => {
            return (
              <Message
                key={message._id}
                id={message._id}
                memberId={message.memberId}
                authorImage={message.user.image}
                authorName={message.user.name}
                isAuthor={message.memberId === currentMember?._id}
                reactions={message.reactions}
                body={message.body}
                image={message.image}
                updatedAt={message.updatedAt}
                createdAt={message._creationTime}
                isEditing={editingId === message._id}
                setEditingId={setEditingId}
                isCompact={false}
                hideThreadButton={true}
                threadCount={message.threadCount}
                threadImage={message.threadImage}
                threadTimestamp={message.threadTimestamp}
                threadName={message.threadName}
                threadUsers={message.usersInThread}
              />
            );
          })}
          {totalItems > initMessLoad && !isFetchAll && (
            <span
              className="px-4 text-sky-500 hover:underline cursor-pointer"
              onClick={() => setIsFetchAll(true)}
            >
              Show {totalItems - initMessLoad} more replies
            </span>
          )}
        </div>
        <div className="px-4">
          <Editor
            key={editorKey}
            onSubmit={handleSubmit}
            innerRef={editorRef}
            disabled={isPending}
            placeholder="Reply..."
          />
        </div>
      </div>
    </>
  );
};

export default ThreadComponent;
