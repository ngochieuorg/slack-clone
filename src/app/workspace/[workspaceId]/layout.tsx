'use client';

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

interface WorkspaceIdLayoutProps {
  children: React.ReactNode;
}

const WorkspaceLayout = ({ children }: WorkspaceIdLayoutProps) => {
  const path = usePathname();
  const { parentMessageId, profileMemberId, onClose } = usePanel();

  const isActivityPage = path.includes('/activity');
  const isDirectMessagePage = path.includes('/direct-message');

  const showPanel = !!parentMessageId || !!profileMemberId;

  const sidebar = () => {
    if (isActivityPage) {
      return <ActivitySidebar />;
    } else if (isDirectMessagePage) {
      return <DirectMessageSidebar />;
    } else return <WorkSpaceSidebar />;
  };

  const defaultSidebarSize = () => {
    if (isActivityPage || isDirectMessagePage) {
      return 45;
    } else {
      return 15;
    }
  };

  const sidebarId = () => {
    if (isActivityPage) {
      return 'activity';
    } else if (isDirectMessagePage) {
      return 'direct-message';
    } else return 'home';
  };

  return (
    <div className="h-full ">
      <Toolbar />
      <div className="flex h-[calc(100vh-40px)]">
        <Sidebar />
        <ResizablePanelGroup
          direction="horizontal"
          autoSaveId={'ca-workspace-layout'}
        >
          <ResizablePanel
            id={sidebarId()}
            defaultSize={defaultSidebarSize()}
            minSize={11}
            className="rounded-tl-lg rounded-bl-lg mb-0.5"
            order={1}
          >
            <div
              className="flex flex-col bg-[#5E2C5F] h-full overflow-y-scroll overflow-x-clip
              [&::-webkit-scrollbar]:w-0"
            >
              {sidebar()}
            </div>
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel
            minSize={20}
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
