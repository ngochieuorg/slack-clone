/* eslint-disable @typescript-eslint/no-unused-vars */
import { useCurrentMember } from "@/features/members/api/use-current-member";
import { useGetWorkspace } from "@/features/workspaces/api/use-get-workspace";
import { useWorkspaceId } from "@/hooks/use-workspace-id";
import { AlertTriangle, HashIcon, Loader, MessageSquareText, SendHorizontal } from "lucide-react";
import WorkspaceHeader from "./workspace-header";
import SidebarItem from "./sidebar-item";
import { useGetChannels } from "@/features/channels/api/use-get-channels";
import WorkspaceSection from "./workspace-section";
import { useGetMembers } from "@/features/members/api/use-get-members";
import UserItem from "./user-item";
import { useCreateChannelModal } from "@/features/channels/store/use-create-channel-modal";
import { useChannelId } from "@/hooks/use-channel-id";
import { useMemberId } from "@/hooks/use-member-id";
import { useGetNotifications } from "@/features/notifications/api/use-get-notifications";
import { useMarkAsReadNotifications } from "@/features/notifications/api/use-mark-as-read-notifications";
import { Id } from "../../../../convex/_generated/dataModel";

const WorkSpaceSidebar = () => {
  const memberId = useMemberId();
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();

  const [_open, setOpen] = useCreateChannelModal();

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
  const { data: notifications, isLoading: notificationsLoading } = useGetNotifications({
    workspaceId,
  });

  const { mutate: markAsReadChannelNoti } = useMarkAsReadNotifications();

  const markAsReadChannel = (channelId: Id<"channels">) => {
    markAsReadChannelNoti({ channelId, workspaceId }, {});
  };

  if (memberLoading || workspaceLoading) {
    return (
      <div className="flex flex-col bg-[#5E2C5F] h-full items-center justify-center">
        <Loader className=" size-5 animate-spin text-white" />
      </div>
    );
  }

  if (!member || !workspace) {
    return (
      <div className="flex flex-col gap-y-2 bg-[#5E2C5F] h-full items-center justify-center">
        <AlertTriangle className=" size-5 text-white" />
        <p className="text-white text-sm">Workspaces not found</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-[#5E2C5F] h-full ">
      <WorkspaceHeader
        workspace={workspace}
        isAdmin={member.role === "admin"}
      />
      <div className="flex flex-col px-2 mt-3">
        <SidebarItem
          label="Threads"
          icon={MessageSquareText}
          id="threads"
        />
        <SidebarItem
          label="Drafts & Sent"
          icon={SendHorizontal}
          id="sent"
        />
      </div>
      <WorkspaceSection
        label="Channels"
        hint="New channel"
        onNew={member.role === "admin" ? () => setOpen(true) : undefined}>
        {channels?.map((item) => {
          const countNotifs = notifications?.filter((noti) => noti.channelId === item._id).length;
          return (
            <div
              onClick={() => markAsReadChannel(item._id)}
              key={item._id}>
              <SidebarItem
                icon={HashIcon}
                label={item.name}
                id={item._id}
                variant={channelId === item._id ? "active" : "default"}
                countNotifs={countNotifs}
              />
            </div>
          );
        })}
      </WorkspaceSection>
      <WorkspaceSection
        label="Direct Message"
        hint="New message"
        onNew={() => {}}>
        {members?.map((item) => {
          return (
            <UserItem
              key={item._id}
              id={item._id}
              label={item.user.name}
              image={item.user.image}
              variant={item._id === memberId ? "active" : "default"}
            />
          );
        })}
      </WorkspaceSection>
    </div>
  );
};

export default WorkSpaceSidebar;
