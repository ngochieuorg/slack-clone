import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useChannelId } from '@/hooks/use-channel-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import dynamic from 'next/dynamic';
import Quill from 'quill';

const Editor = dynamic(() => import('@/components/editor'), { ssr: true });

import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Id } from '../../../../../../convex/_generated/dataModel';

interface ChatInputProps {
  placeholder: string;
}

type CreateMesageValues = {
  channelId: Id<'channels'>;
  workspaceId: Id<'workspaces'>;
  body: string;
  image: Id<'_storage'> | undefined;
  type: 'mention' | 'keyword' | 'direct' | 'reply';
};

const ChatInput = ({ placeholder }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);

  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();

  const handleSubmit = async ({
    body,
    image,
  }: {
    body: string;
    image: File | null;
  }) => {
    try {
      setIsPending(true);
      editorRef?.current?.enable(false);

      const values: CreateMesageValues = {
        channelId,
        workspaceId,
        body,
        image: undefined,
        type: 'direct',
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

  return (
    <div className="px-5 w-full">
      <Editor
        key={editorKey}
        placeholder={placeholder}
        onSubmit={handleSubmit}
        disabled={isPending}
        innerRef={editorRef}
      />
    </div>
  );
};

export default ChatInput;
