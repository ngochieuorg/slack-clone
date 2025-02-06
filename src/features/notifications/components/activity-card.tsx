import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useGetNotifications } from '../api/use-get-notifications';
import { Loader } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatDateNotiTime } from '@/app/utils/date-time';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

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
      <div className="flex justify-between items-center p-2">
        <span className="font-semibold">Activity</span>
        <div className="flex items-center space-x-2">
          <Switch id="airplane-mode" />
          <Label htmlFor="airplane-mode">Unread</Label>
        </div>
      </div>
      <Separator />
      {notifications?.map((noti) => {
        return (
          <div className="w-96 p-2" key={noti._id}>
            <div
              className={cn(
                'flex justify-between items-center',
                noti.status === 'unread' && 'font-semibold text-black'
              )}
            >
              <span
                className={cn(
                  'text-sm text-muted-foreground ',
                  noti.status === 'unread' && 'font-semibold text-black'
                )}
              >
                Thread in # {noti.channel?.name}
              </span>
              <span className="text-sm">
                {formatDateNotiTime(new Date(noti._creationTime))}
              </span>
            </div>
            <div className="flex gap-2 item-st">
              <Avatar className="size-[48px] rounded-md mr-1">
                <AvatarImage
                  className="rounded-md bg-sky-500 text-white"
                  src={''}
                />
                <AvatarFallback>N</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-bold">ngochieu276</p>
                <span className="text-muted-foreground text-sm">
                  replied to:{' '}
                </span>
              </div>
            </div>
            <div className="mb-5 overflow-clip">{noti.content}</div>
            <Separator />
          </div>
        );
      })}
    </div>
  );
};

export default ActivityCard;
