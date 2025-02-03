import { useQuery } from "convex/react";
import { Id } from "../../../../convex/_generated/dataModel";
import { api } from "../../../../convex/_generated/api";

interface UseGetNotificationProps {
  workspaceId: Id<"workspaces">;
  channelId?: Id<"channels">;
  conversationId?: Id<"conversations">;
}

export type GetMessageReturnType = (typeof api.messages.get._returnType)["page"];

export const useGetNotifications = ({
  workspaceId,
  channelId,
  conversationId,
}: UseGetNotificationProps) => {
  const data = useQuery(api.notifications.get, {
    channelId,
    conversationId,
    workspaceId,
  });
  const isLoading = data === undefined;

  return { data, isLoading };
};
