import React from 'react';
import { Id } from '../../convex/_generated/dataModel';
import { useGetMessage } from '@/features/messages/api/use-get-message';
import Message from './message';
import { renderDisplayName } from '@/app/utils/label';

interface ForwardMessageProps {
  messageId: Id<'messages'>;
}

const ForwardMessage = ({ messageId }: ForwardMessageProps) => {
  const { data: message } = useGetMessage({ id: messageId });

  if (!message) {
    return <></>;
  }

  return (
    <div>
      <Message
        key={message._id}
        id={message._id}
        memberId={message.memberId}
        authorImage={message.user.memberPreference.image || message.user.image}
        authorName={renderDisplayName(
          message.user.name,
          message.user.memberPreference
        )}
        isAuthor={false}
        reactions={message.reactions}
        body={message.body}
        files={message.files}
        updatedAt={message.updatedAt}
        createdAt={message._creationTime}
        isEditing={false}
        setEditingId={() => {}}
        isCompact={false}
        isForward
      />
    </div>
  );
};

export default ForwardMessage;
