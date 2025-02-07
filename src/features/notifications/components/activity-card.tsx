import { Loader } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { formatDateNotiTime } from '@/app/utils/date-time';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import { Dispatch } from 'react';
import { SetStateAction } from 'jotai';
import { ActivitiesReturnType } from '../api/use-get-activities';

const Renderer = dynamic(() => import('@/components/renderer'), { ssr: true });

interface ActivityCardProps {
  activities: ActivitiesReturnType;
  isLoading: boolean;
  setIsUnRead: Dispatch<SetStateAction<boolean>>;
}

const ActivityCard = ({
  activities,
  isLoading,
  setIsUnRead,
}: ActivityCardProps) => {
  if (isLoading) {
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
          <Switch
            id="status-read"
            onCheckedChange={(value) => setIsUnRead(value)}
          />
          <Label htmlFor="status-read">Unreads</Label>
        </div>
      </div>
      <Separator />
      <div className="max-h-[480px] overflow-auto">
        {activities?.map((activity, index: number) => {
          return (
            <div className="p-2" key={index}>
              <div
                className={cn(
                  'flex justify-between items-end',
                  activity.unreadCount > 0 && 'font-medium text-black'
                )}
              >
                <div
                  className={cn(
                    'text-sm text-muted-foreground ',
                    activity.unreadCount > 0 && 'font-medium text-black'
                  )}
                >
                  Thread in # {activity.threadName}
                </div>
                <div className="flex gap-1 ">
                  <span>
                    {formatDateNotiTime(
                      new Date(activity.newestNoti._creationTime)
                    )}
                  </span>
                  <div className="w-8 h-5 bg-[#5E2C5F] flex justify-center items-center rounded-xl text-white font-normal ">
                    {activity.unreadCount}
                  </div>
                </div>
              </div>
              <div className="flex justify-start gap-1 items-start">
                <Avatar className="min-w-8 max-w-8 h-8 hover:opacity-75 transition rounded-md mt-1">
                  <AvatarImage
                    className="rounded-md"
                    src={activity.newestNoti.sender?.image}
                    alt={activity.newestNoti.sender?.name}
                  />
                  <AvatarFallback className="rounded-md bg-sky-500 text-white">
                    {activity.newestNoti.sender?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-bold">
                    {activity.newestNoti.sender?.name} and you
                  </p>
                  <div className="text-muted-foreground">
                    {activity.newestNoti.parentMessage?.body && (
                      <div className="flex items-center gap-1">
                        <div className="w-max">replied to:</div>
                        <Renderer
                          value={activity.newestNoti.parentMessage?.body}
                          cutWord={2}
                        />
                      </div>
                    )}
                  </div>
                  <div className="mb-5">
                    {activity.thread.message?.body && (
                      <div className="flex justify-start items-start gap-1">
                        <div className=" whitespace-nowrap">
                          {activity.thread.name}:
                        </div>
                        <Renderer value={activity.thread.message?.body} />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <Separator />
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityCard;
