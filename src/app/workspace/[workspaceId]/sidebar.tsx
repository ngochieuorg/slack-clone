import UserButton from '@/features/auth/components/user-button';
import WorkspaceSwitcher from './workspace-switcher';
import SidebarButton from './sidebar-button';
import { Bell, Home, MessageCircle, MoreHorizontal } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import ActivityCard from '@/features/notifications/components/activity-card';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import {
  ActivitiesReturnType,
  useGetActivities,
} from '@/features/notifications/api/use-get-activities';
import { useEffect } from 'react';
import { useCurrentUser } from '@/features/auth/api/use-current-user';
import { useAtom } from 'jotai';
import { activitiesAtom } from '@/store/activity.store';

export const Sidebar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const { data: currentUser } = useCurrentUser();

  const [{ activities, isUnread }, setActivities] = useAtom(activitiesAtom);

  const { data, isLoading: notificationsLoading } = useGetActivities({
    workspaceId,
    isUnRead: isUnread,
  });

  useEffect(() => {
    setActivities((prev) => ({
      ...prev,
      activities: data || [],
      isLoading: notificationsLoading,
    }));
  }, [isUnread, workspaceId, setActivities, data, notificationsLoading]);

  const countActivitiesNoti = (activities?: ActivitiesReturnType) => {
    return (activities || []).filter((activity) => activity.unreadCount).length;
  };

  const onNavigateToActivityPage = () => {
    router.push(`/workspace/${workspaceId}/activity`);
  };

  const activeSideButton = (): 'home' | 'activity' => {
    if (pathName.includes('/activity')) {
      return 'activity';
    }
    return 'home';
  };

  const pathName = usePathname();

  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[8px] p-1">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={activeSideButton() === 'home'}
        onClick={() => router.replace(`/workspace/${workspaceId}/channel`)}
      />
      <SidebarButton icon={MessageCircle} label="DMs" />
      <div onClick={onNavigateToActivityPage}>
        <HoverCard>
          <HoverCardTrigger>
            <SidebarButton
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
