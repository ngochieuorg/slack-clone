import { useCreateMessage } from '@/features/messages/api/use-create-message';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import dynamic from 'next/dynamic';
import Quill from 'quill';

const Editor = dynamic(() => import('@/components/editor'), { ssr: true });

import React, { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { CreateMessageValues } from '@/models';
import { useCreateFile } from '@/features/upload/api/use-create-file';

interface ChatInputProps {
  placeholder: string;
  conversationId: Id<'conversations'>;
}

const ChatInput = ({ placeholder, conversationId }: ChatInputProps) => {
  const [editorKey, setEditorKey] = useState(0);
  const [isPending, setIsPending] = useState(false);
  const editorRef = useRef<Quill | null>(null);

  const workspaceId = useWorkspaceId();

  const { mutate: createMessage } = useCreateMessage();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: createFile } = useCreateFile();

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
        conversationId,
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
