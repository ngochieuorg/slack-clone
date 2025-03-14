import React from 'react';
import { Button } from './ui/button';
import {
  Forward,
  MessageSquareTextIcon,
  Pencil,
  Smile,
  Trash,
} from 'lucide-react';
import Hint from './hint';
import EmojiPopover from './emoji-popover';
import ForwardMessageModal from '@/features/messages/components/forward-message-modal';
import { Id } from '../../convex/_generated/dataModel';

interface ToolbarProps {
  isAuthor: boolean;
  isPending: boolean;
  handleEdit: () => void;
  handleThread: () => void;
  handleDelete: () => void;
  handleReaction: (value: string) => void;
  hideThreadButton?: boolean;
  messageId: Id<'messages'>;
}

const Toolbar = ({
  isAuthor,
  isPending,
  handleEdit,
  handleThread,
  handleDelete,
  handleReaction,
  hideThreadButton,
  messageId,
}: ToolbarProps) => {
  return (
    <div className="absolute top-0 right-5">
      <div className="group-hover:opacity-100 opacity-0 transition-opacity border bg-white rounded-md shadow-sm">
        <EmojiPopover
          hint="Add reaction"
          onEmojiSelect={(emoji) => handleReaction(emoji.native)}
        >
          <Button variant={'ghost'} size={'sm'} disabled={isPending}>
            <Smile className="size-4" />
          </Button>
        </EmojiPopover>
        {!hideThreadButton && (
          <Hint label="Reply in thread">
            <Button
              variant={'ghost'}
              size={'sm'}
              disabled={isPending}
              onClick={handleThread}
            >
              <MessageSquareTextIcon className="size-4" />
            </Button>
          </Hint>
        )}
        <Hint label="Forward message">
          <ForwardMessageModal
            trigger={
              <Button variant={'ghost'} size={'sm'} disabled={isPending}>
                <Forward className="size-4" />
              </Button>
            }
            messageId={messageId}
          />
        </Hint>
        {isAuthor && (
          <>
            <Hint label="Edit message">
              <Button
                variant={'ghost'}
                size={'sm'}
                disabled={isPending}
                onClick={handleEdit}
              >
                <Pencil className="size-4" />
              </Button>
            </Hint>
            <Hint label="Remove this message">
              <Button
                variant={'ghost'}
                size={'sm'}
                disabled={isPending}
                onClick={handleDelete}
              >
                <Trash className="size-4" />
              </Button>
            </Hint>
          </>
        )}
      </div>
    </div>
  );
};

export default Toolbar;
