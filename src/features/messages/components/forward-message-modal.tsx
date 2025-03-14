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
import { renderDisplayName } from '@/app/utils/label';
import Editor from '@/components/editor';
import { useRef, useState } from 'react';
import Quill from 'quill';
import { CreateMessageValues } from '@/app/models';
import { toast } from 'sonner';
import { useCreateMessage } from '../api/use-create-message';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

interface ForwardMessageModalProps {
  trigger: React.ReactNode;
  messageId: Id<'messages'>;
}

const ForwardMessageModal = ({
  trigger,
  messageId,
}: ForwardMessageModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-xl">
        <DialogTitle>Forward Message</DialogTitle>
        {messageId && <ForwardMessageContent messageId={messageId} />}
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
          >
            Forward
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const ForwardMessageContent = ({
  messageId,
}: {
  messageId: Id<'messages'>;
}) => {
  const workspaceId = useWorkspaceId();
  const { data: message, isLoading } = useGetMessage({ id: messageId });
  const { mutate: createMessage } = useCreateMessage();

  const [editorKey, setEditorKey] = useState(0);
  const editorRef = useRef<Quill | null>(null);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async ({ body }: { body: string }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMessageValues = {
        workspaceId,
        body,
        files: [],
      };

      await createMessage(values, { throwError: true });
      setEditorKey((prevKey) => prevKey + 1);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Message is forward');
    } finally {
      setIsPending(false);
      editorRef?.current?.enable(true);
    }
  };

  if (isLoading || !message) return <></>;

  return (
    <div>
      <Editor
        key={editorKey}
        onSubmit={handleSubmit}
        innerRef={editorRef}
        disabled={isPending}
        placeholder="Add a message, if you like."
        variant="forward"
      />
      <Message
        id={messageId}
        memberId={message.memberId}
        authorImage={message.user.memberPreference.image || message.user.image}
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
    </div>
  );
};

export default ForwardMessageModal;
