'use client';

import React, { useEffect, useMemo } from 'react';
import { Sidebar } from './sidebar';
import Toolbar from './toolbar';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import WorkSpaceSidebar from './work-space-sidebar';
import { usePanel } from '@/hooks/use-panel';
import { Loader } from 'lucide-react';
import { Id } from '../../../../convex/_generated/dataModel';
import Thread from '@/features/messages/components/thread';
import Profile from '@/features/members/components/profile';
import { usePathname } from 'next/navigation';
import ActivitySidebar from './activity-sidebar';
import DirectMessageSidebar from './direct-message-sidebar';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useUpdateOnlineStatus } from '@/features/members/api/use-update-online-status';

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const path = usePathname();
  const workspaceId = useWorkspaceId();
  const { data: member } = useCurrentMember({
    workspaceId,
  });
  const { mutate: updateOnlineStatus } = useUpdateOnlineStatus();

  const { parentMessageId, profileMemberId, onClose } = usePanel();

  useEffect(() => {
    if (member?._id) {
      updateOnlineStatus({ memberId: member._id }, {});
      const interval = setInterval(() => {
        updateOnlineStatus({ memberId: member._id }, {});
      }, 58000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [member?._id, updateOnlineStatus]);

  const isActivityPage = useMemo(() => path.includes('/activity'), [path]);
  const isDirectMessagePage = useMemo(
    () => path.includes('/direct-message'),
    [path]
  );
  const showPanel = useMemo(
    () => !!parentMessageId || !!profileMemberId,
    [parentMessageId, profileMemberId]
  );

  const renderSidebar = useMemo(() => {
    if (isActivityPage) {
      return <ActivitySidebar />;
    } else if (isDirectMessagePage) {
      return <DirectMessageSidebar />;
    }
    return <WorkSpaceSidebar />;
  }, [isActivityPage, isDirectMessagePage]);

  const defaultSidebarSize = useMemo(() => {
    return isActivityPage || isDirectMessagePage ? 45 : 15;
  }, [isActivityPage, isDirectMessagePage]);

  const sidebarId = useMemo(() => {
    if (isActivityPage) {
      return 'activity';
    } else if (isDirectMessagePage) {
      return 'direct-message';
    }
    return 'home';
  }, [isActivityPage, isDirectMessagePage]);

  return (
    <div className="h-full">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={'ca-workspace-layout'}
        >
          <ResizablePanel
            id={sidebarId}
            defaultSize={defaultSidebarSize}
            minSize={11}
            className="rounded-tl-lg rounded-bl-lg mb-0.5"
            order={1}
          >
            <div
              className="flex flex-col bg-[#5E2C5F] h-full overflow-y-scroll overflow-x-clip
                         [&::-webkit-scrollbar]:w-0"
            >
              {renderSidebar}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            minSize={20}
            defaultSize={100}
            order={2}
            id="content"
            className="bg-white mb-0.5"
          >
            {children}
          </ResizablePanel>
          {showPanel && (
            <>
              <ResizableHandle withHandle />
              <ResizablePanel
                minSize={20}
                order={3}
                defaultSize={29}
                id="right"
                className="mb-0.5"
              >
                {parentMessageId ? (
                  <Thread
                    messageId={parentMessageId as Id<'messages'>}
                    onClose={onClose}
                  />
                ) : profileMemberId ? (
                  <Profile
                    memberId={profileMemberId as Id<'members'>}
                    onClose={onClose}
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <Loader className="size-5 animate-spin text-muted-foreground" />
                  </div>
                )}
              </ResizablePanel>
            </>
          )}
        </ResizablePanelGroup>
      </div>
    </div>
  );
};

export default WorkspaceLayout;
