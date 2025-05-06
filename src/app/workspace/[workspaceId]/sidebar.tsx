// UI Components
import UserButton from '@/features/auth/components/user-button';
import WorkspaceSwitcher from './workspace-switcher';
import SidebarButton from './sidebar-button';
import {
  Bell,
  Home,
  MessageCircle,
  Bookmark,
  LayoutTemplate,
  Workflow,
  FileText,
  Files,
  Layers,
  Users,
  File,
  MoreHorizontal,
} from 'lucide-react';

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
import { useEffect, useMemo, useState } from 'react';
import { preferencesAtom } from '@/store/preferences.store';
import MoreCard from '@/components/more-card';

export const Sidebar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [maxItem, setMaxItem] = useState<number | undefined>(undefined);
  const { data: currentUser } = useCurrentUser({ workspaceId });

  const [{ preferences }] = useAtom(preferencesAtom);
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

  useEffect(() => {
    const navigationItem = document.querySelector('.navigation-item');
    const navigationItems = document.querySelector('.navigation-items');

    const blockHeight = navigationItems?.clientHeight || 0;
    const itemHeight = navigationItem?.clientHeight || 0;

    const totalItems = (preferences?.navigation || []).length;
    const totalItemsHeight = itemHeight * totalItems;

    if (totalItemsHeight / blockHeight > 0.5) {
      setMaxItem(preferences?.navigation?.length);
    } else {
      setMaxItem(undefined);
    }
  }, [preferences?.navigation]);

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

  const onNavigateToAnotherPage = (url: string) => {
    router.push(url);
  };

  const activeSideButton = ():
    | 'home'
    | 'activity'
    | 'direct-message'
    | 'later' => {
    if (pathName.includes('/later')) {
      return 'later';
    }
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

  const sidebarItems = useMemo(
    () => [
      {
        id: 'home',
        route: 'home',
        label: 'Home',
        onClick: () => {
          return router.replace(
            `/workspace/${workspaceId}/channel/${channelId}`
          );
        },
        icon: Home,
      },
      {
        id: 'dms',
        route: 'direct-message',
        label: 'DMs',
        onClick: () => {
          onNavigateToDirectMessagePage();
        },
        icon: MessageCircle,
        notiCount: countDirectMessageNoti(directMessages),
        hoverContent: <DirectMessageCard />,
      },
      {
        id: 'activity',
        route: 'activity',
        label: 'Activity',
        onClick: () => {
          onNavigateToActivityPage();
        },
        icon: Bell,
        notiCount: countActivitiesNoti(activities),
        hoverContent: <ActivityCard currentUser={currentUser} />,
      },
      {
        id: 'later',
        route: 'later',
        label: 'Later',
        onClick: () => {
          onNavigateToAnotherPage(`/workspace/${workspaceId}/later`);
        },
        icon: Bookmark,
      },
      {
        id: 'templates',
        route: 'templates',
        label: 'Templates',
        onClick: () => {},
        icon: LayoutTemplate,
      },
      {
        id: 'automations',
        route: 'automations',
        label: 'Automations',
        onClick: () => {},
        icon: Workflow,
      },
      {
        id: 'canvases',
        route: 'canvases',
        label: 'Canvases',
        onClick: () => {},
        icon: FileText,
      },
      {
        id: 'files',
        route: 'files',
        label: 'Files',
        onClick: () => {},
        icon: Files,
      },
      {
        id: 'channels',
        route: 'channels',
        label: 'Channels',
        onClick: () => {},
        icon: Layers,
      },
      {
        id: 'people',
        route: 'people',
        label: 'People',
        onClick: () => {},
        icon: Users,
      },

      {
        id: 'external',
        route: 'external',
        label: 'External',
        onClick: () => {},
        icon: File,
      },
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [workspaceId, currentUser, activities, directMessages]
  );

  return (
    <aside className="w-[78px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[8px] p-1">
      <WorkspaceSwitcher />
      <div className="navigation-items flex-1">
        <div className="flex flex-col gap-y-2">
          {sidebarItems
            .filter((item) => {
              if (preferences?.navigation?.includes(item.id)) return true;
              return false;
            })
            .slice(0, 7)
            .map((item) => {
              if (item.hoverContent) {
                return (
                  <div key={item.id} className="navigation-item">
                    <HoverWrapper
                      item={
                        <SidebarButton
                          onClick={item.onClick}
                          icon={item.icon}
                          label={item.label}
                          notiCount={item.notiCount}
                          isActive={activeSideButton() === item.route}
                        />
                      }
                      hoverContent={item.hoverContent}
                    />
                  </div>
                );
              } else {
                return (
                  <div key={item.id} className="navigation-item">
                    <SidebarButton
                      onClick={item.onClick}
                      icon={item.icon}
                      label={item.label}
                      notiCount={item.notiCount}
                      isActive={activeSideButton() === item.route}
                    />
                  </div>
                );
              }
            })}
          <HoverWrapper
            item={<SidebarButton icon={MoreHorizontal} label="More" />}
            hoverContent={<MoreCard />}
          />
        </div>
      </div>
      <div className="flex flex-col items-center justify-center gap-y-1">
        <UserButton />
      </div>
    </aside>
  );
};

const HoverWrapper = ({
  item,
  hoverContent,
}: {
  item: React.ReactNode;
  hoverContent: React.ReactNode;
}) => {
  return (
    <HoverCard>
      <HoverCardTrigger>{item}</HoverCardTrigger>
      <HoverCardContent className="p-0" side="right" align="start">
        {hoverContent}
      </HoverCardContent>
    </HoverCard>
  );
};
