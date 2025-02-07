import UserButton from '@/features/auth/components/user-button';
import WorkspaceSwitcher from './workspace-switcher';
import SidebarButton from './sidebar-button';
import { Bell, Home, MessageSquare, MoreHorizontal } from 'lucide-react';
import { usePathname } from 'next/navigation';

import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import ActivityCard from '@/features/notifications/components/activity-card';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useGetActivities } from '@/features/notifications/api/use-get-activities';
import { useState } from 'react';

export const Sidebar = () => {
  const workspaceId = useWorkspaceId();
  const [isUnRead, setIsUnRead] = useState(false);

  const { data: activities, isLoading: notificationsLoading } =
    useGetActivities({
      workspaceId,
      isUnRead,
    });

  const pathName = usePathname();
  return (
    <aside className="w-[70px] h-full bg-[#481349] flex flex-col gap-y-4 items-center pt-[8px] p-1">
      <WorkspaceSwitcher />
      <SidebarButton
        icon={Home}
        label="Home"
        isActive={pathName.includes('/workspace')}
      />
      <SidebarButton icon={MessageSquare} label="DMs" />
      <HoverCard>
        <HoverCardTrigger>
          <SidebarButton icon={Bell} label="Activity" />
        </HoverCardTrigger>
        <HoverCardContent className="p-0">
          <ActivityCard
            activities={activities || []}
            isLoading={notificationsLoading}
            setIsUnRead={setIsUnRead}
          />
        </HoverCardContent>
      </HoverCard>
      <SidebarButton icon={MoreHorizontal} label="More" />
      <div className="flex flex-col items-center justify-center gap-y-1 mt-auto">
        <UserButton />
      </div>
    </aside>
  );
};
