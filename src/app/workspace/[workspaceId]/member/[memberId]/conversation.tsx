import { useMemberId } from '@/hooks/use-member-id';
import { Id } from '../../../../../../convex/_generated/dataModel';
import { useGetMember } from '@/features/members/api/use-get-member';

import { useGetMessages } from '@/features/messages/api/use-get-messages';
import { Loader } from 'lucide-react';
import Header from './header';
import ChatInput from './chat-input';
import MessageList from '@/components/message-list';
import { usePanel } from '@/hooks/use-panel';
import { useEffect } from 'react';
import { renderDisplayName } from '@/app/utils/label';

interface ConversationProps {
  id: Id<'conversations'>;
}

const Conversation = ({ id }: ConversationProps) => {
  const memberId = useMemberId();

  const { onOpenProfileMember } = usePanel();

  const { data: member, isLoading: memberLoading } = useGetMember({
    id: memberId,
  });
  const { results, status, loadMore } = useGetMessages({ conversationId: id });

  useEffect(() => {
    if (member?.user.name) {
      document.title = `${member?.user.name} (DM)`;
    } else {
      document.title = 'Loading ...';
    }
  }, [member?.user.name]);

  if (memberLoading || status === 'LoadingFirstPage') {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader className="size-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <Header
        memberName={renderDisplayName(
          member?.user.name,
          member?.user.memberPreference
        )}
        memberImage={member?.user.memberPreference.image || member?.user.image}
        onclick={() => onOpenProfileMember(memberId)}
      />
      <MessageList
        data={results}
        variant="conversation"
        memberName={renderDisplayName(
          member?.user.name,
          member?.user.memberPreference
        )}
        memberImage={member?.user.memberPreference.image || member?.user.image}
        memberId={member?._id}
        memberTitle={member?.user.memberPreference.title}
        loadMore={loadMore}
        isLoadingMore={status === 'LoadingMore'}
        canLoadMore={status === 'CanLoadMore'}
      />
      <ChatInput
        placeholder={`Message ${renderDisplayName(
          member?.user.name,
          member?.user.memberPreference
        )}`}
        conversationId={id}
      />
    </div>
  );
};

export default Conversation;
