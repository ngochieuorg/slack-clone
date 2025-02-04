import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useGetNotifications } from '../api/use-get-notifications';
import { Loader } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const ActivityCard = () => {
  const workspaceId = useWorkspaceId();

  const { data: notifications, isLoading: notificationsLoading } =
    useGetNotifications({
      workspaceId,
    });

  if (notificationsLoading) {
    return (
      <div className="flex flex-col h-full items-center justify-center">
        <Loader className=" size-5 animate-spin text-[#5E2C5F]" />
      </div>
    );
  }
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <span className="font-semibold">Activity</span>
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Unread</Label>
        </div>
      </div>
      {notifications?.map((noti) => {
        return (
          <div className="w-80" key={noti._id}>
            <div className="mb-5 overflow-clip">Noti</div>
          </div>
        );
      })}
    </div>
  );
};

export default ActivityCard;
