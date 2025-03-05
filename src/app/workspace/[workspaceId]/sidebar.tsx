// UI Components
import UserButton from '@/features/auth/components/user-button';
import WorkspaceSwitcher from './workspace-switcher';
import SidebarButton from './sidebar-button';
import { Bell, Home, MessageCircle, MoreHorizontal } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import ActivityCard from '@/features/notifications/components/activity-card';
import DirectMessageCard from '@/features/notifications/components/direct-message-card';

// Hooks & API Calls
import { usePathname, useRouter } from 'next/navigation';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useCurrentUser } from '@/features/auth/api/use-current-user';
import { useAtom } from 'jotai';
import { activitiesAtom } from '@/store/activity.store';
import { directMessageAtom } from '@/store/direct-message.store';

// Notifications API
import { useGetActivities } from '@/features/notifications/api/use-get-activities';
import { useGetChannels } from '@/features/channels/api/use-get-channels';
import { useGetDirectMessages } from '@/features/notifications/api/api-get-direct-messages';

// Types
import { ActivitiesReturnType } from '@/features/notifications/api/use-get-activities';
import { DirectMessageReturnType } from '@/features/notifications/api/api-get-direct-messages';

// React Hooks
import { useEffect, useMemo } from 'react';

export const Sidebar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: currentUser } = useCurrentUser({ workspaceId });

  const [{ activities, isUnread: isUnreadActivities }, setActivities] =
    useAtom(activitiesAtom);
  const [
    { directMessages, isUnread: isUnreadDirectMessage },
    setDirectMessages,
  ] = useAtom(directMessageAtom);

  const { data: activitiesData, isLoading: notificationsLoading } =
    useGetActivities({
      workspaceId,
      isUnRead: isUnreadActivities,
    });

  const { data: directMessagesData, isLoading: directMessageLoading } =
    useGetDirectMessages({
      workspaceId,
      isUnRead: isUnreadDirectMessage,
    });

  const { data: channels } = useGetChannels({
    workspaceId,
  });

  useEffect(() => {
    setActivities((prev) => ({
      ...prev,
      activities: activitiesData || [],
      isLoading: notificationsLoading,
    }));
  }, [
    isUnreadActivities,
    workspaceId,
    setActivities,
    activitiesData,
    notificationsLoading,
  ]);

  useEffect(() => {
    setDirectMessages((prev) => ({
      ...prev,
      directMessages: directMessagesData || [],
      isLoading: directMessageLoading,
    }));
  }, [
    isUnreadDirectMessage,
    workspaceId,
    setDirectMessages,
    directMessagesData,
    directMessageLoading,
  ]);

  const countActivitiesNoti = (activities?: ActivitiesReturnType) => {
    return (activities || []).filter((activity) => activity.unreadCount).length;
  };

  const countDirectMessageNoti = (directMessages?: DirectMessageReturnType) => {
    return (directMessages || []).filter((msg) => msg.unreadCount).length;
  };

  const onNavigateToActivityPage = () => {
    router.push(`/workspace/${workspaceId}/activity`);
  };

  const onNavigateToDirectMessagePage = () => {
    router.push(`/workspace/${workspaceId}/direct-message`);
  };

  const activeSideButton = (): 'home' | 'activity' | 'direct-message' => {
    if (pathName.includes('/activity')) {
      return 'activity';
    }
    if (pathName.includes('/direct-message')) {
      return 'direct-message';
    }
    return 'home';
  };

  const channelId = useMemo(() => channels?.[0]?._id, [channels]);

  const pathName = usePathname();

  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[8px] p-1">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={activeSideButton() === 'home'}
        onClick={() =>
          router.replace(`/workspace/${workspaceId}/channel/${channelId}`)
        }
      />
      <div>
        <HoverCard>
          <HoverCardTrigger>
            <SidebarButton
              onClick={() => onNavigateToDirectMessagePage()}
              icon={MessageCircle}
              label="DMs"
              notiCount={countDirectMessageNoti(directMessages)}
              isActive={activeSideButton() === 'direct-message'}
            />
          </HoverCardTrigger>
          <HoverCardContent className="p-0">
            <DirectMessageCard />
          </HoverCardContent>
        </HoverCard>
      </div>
      <div>
        <HoverCard>
          <HoverCardTrigger>
            <SidebarButton
              onClick={() => onNavigateToActivityPage()}
              icon={Bell}
              label="Activity"
              notiCount={countActivitiesNoti(activities)}
              isActive={activeSideButton() === 'activity'}
            />
          </HoverCardTrigger>
          <HoverCardContent className="p-0">
            <ActivityCard currentUser={currentUser} />
          </HoverCardContent>
        </HoverCard>
      </div>
      <SidebarButton icon={MoreHorizontal} label="More" />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};
