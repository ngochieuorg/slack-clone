/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import {
  AlertTriangle,
  HashIcon,
  MessageSquareText,
  SendHorizontal,
  LockKeyhole,
} from 'lucide-react';
import WorkspaceHeader from './workspace-header';
import SidebarItem from './sidebar-item';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import WorkspaceSection from './workspace-section';
import { useGetMembers } from '@/features/members/api/use-get-members';
import UserItem from './user-item';
import { useCreateChannelModal } from '@/features/channels/store/use-create-channel-modal';
import { useChannelId } from '@/hooks/use-channel-id';
import { useMemberId } from '@/hooks/use-member-id';
import { useGetNotifications } from '@/features/notifications/api/use-get-notifications';
import { useMarkAsReadNotifications } from '@/features/notifications/api/use-mark-as-read-notifications';
import { Id } from '../../../../convex/_generated/dataModel';
import { useGetConversations } from '@/features/conversations/api/use-get-conversations';
import { useCurrentUser } from '@/features/auth/api/use-current-user';
import { usePathname } from 'next/navigation';
import { renderDisplayName } from '@/utils/label';
import { useGetActivities } from '@/features/notifications/api/use-get-activities';

const WorkSpaceSidebar = () => {
  const path = usePathname();
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const [_open, setOpen] = useCreateChannelModal();

  const { data: currentUser } = useCurrentUser({ workspaceId });

  const { data: member, isLoading: memberLoading } = useCurrentMember({
    workspaceId,
  });
  const { data: workspace, isLoading: workspaceLoading } = useGetWorkspace({
    id: workspaceId,
  });
  const { data: channels, isLoading: channelsLoading } = useGetChannels({
    workspaceId,
  });
  const { data: members, isLoading: membersLoading } = useGetMembers({
    workspaceId,
  });
  const { data: conversations, isLoading: conversationsLoading } =
    useGetConversations({
      workspaceId,
    });
  const { data: notifications, isLoading: notificationsLoading } =
    useGetNotifications({
      workspaceId,
      isUnRead: true,
    });

  const { data: activities, isLoading: activitiesLoading } = useGetActivities({
    workspaceId,
    isUnRead: true,
  });

  const { mutate: markAsReadNoti } = useMarkAsReadNotifications();

  const markAsReadChannel = (channelId: Id<'channels'>) => {
    markAsReadNoti({ channelId, workspaceId }, {});
  };

  const markAsReadConversation = (conversationId: Id<'conversations'>) => {
    markAsReadNoti({ conversationId, workspaceId }, {});
  };

  if (memberLoading || workspaceLoading) {
    return <></>;
  }

  if (!member || !workspace) {
    return (
      <div className="gap-y-2 items-center justify-center">
        <AlertTriangle className=" size-5 text-white" />
        <p className="text-white text-sm">Workspaces not found</p>
      </div>
    );
  }

  const checkIsThreadPage = () => {
    return path.includes('/thread');
  };

  return (
    <>
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === 'admin'}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem
          label="Threads"
          icon={MessageSquareText}
          id="threads"
          linkTo={`/workspace/${workspaceId}/thread`}
          variant={checkIsThreadPage() ? 'active' : 'default'}
        />
        <SidebarItem label="Drafts & Sent" icon={SendHorizontal} id="sent" />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={member.role === 'admin' ? () => setOpen(true) : undefined}
      >
        {channels?.map((item) => {
          const countNotifs = activities?.filter((activity) => {
            return activity.channel?._id === item._id;
          }).length;
          return (
            <div onClick={() => markAsReadChannel(item._id)} key={item._id}>
              <SidebarItem
                icon={item.isPrivate ? LockKeyhole : HashIcon}
                label={item.name}
                id={item._id}
                variant={channelId === item._id ? 'active' : 'default'}
                countNotifs={countNotifs}
                linkTo={`/workspace/${workspaceId}/channel/${item._id}`}
              />
            </div>
          );
        })}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Message"
        hint="New message"
        onNew={() => {}}
      >
        {members?.map((member) => {
          let conversationId: Id<'conversations'>;
          const countNotifs = notifications?.filter((noti) => {
            return conversations?.find((conversation) => {
              const isMatch =
                conversation._id === noti.conversationId &&
                currentUser?._id !== member.userId &&
                (conversation.memberOneId === member._id ||
                  conversation.memberTwoId === member._id);
              if (isMatch) conversationId = conversation._id;
              return isMatch;
            });
          }).length;

          return (
            <div
              onClick={() => {
                markAsReadConversation(conversationId);
              }}
              key={member._id}
            >
              <UserItem
                key={member._id}
                id={member._id}
                label={renderDisplayName(
                  member.user.name,
                  member.user.memberPreference
                )}
                image={member.user.memberPreference.image || member.user.image}
                variant={member._id === memberId ? 'active' : 'default'}
                countNotifs={countNotifs}
                isYou={member.userId === currentUser?._id}
                onlineAt={member.onlineAt}
              />
            </div>
          );
        })}
      </WorkspaceSection>
    </>
  );
};

export default WorkSpaceSidebar;
