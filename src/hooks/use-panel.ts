import useChannelId from '@/features/channels/store/use-channel-id';
import useProfileMemberId from '@/features/members/store/use-profile-member-id';
import useParentMessageId from '@/features/messages/store/use-parent-message-id';

export const usePanel = () => {
  const [parentMessageId, setParentMessageId] = useParentMessageId();
  const [profileMemberId, setProfileMemberId] = useProfileMemberId();
  const [channelId, setChannelId] = useChannelId();

  const onOpenMessage = (messageId: string, channelId?: string) => {
    setParentMessageId(messageId);
    if (channelId) setChannelId(channelId);
    setProfileMemberId(null);
  };

  const onOpenProfileMember = (memberId: string) => {
    setProfileMemberId(memberId);
    setParentMessageId(null);
  };

  const onClose = () => {
    setParentMessageId(null);
    setProfileMemberId(null);
    setChannelId(null);
  };

  return {
    parentMessageId,
    onOpenMessage,
    profileMemberId,
    onOpenProfileMember,
    channelId,
    onClose,
  };
};
