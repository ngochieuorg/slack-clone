import { CheckCircle, Loader, MessageSquareTextIcon } from 'lucide-react';
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
import { Doc } from '../../../../convex/_generated/dataModel';

const Renderer = dynamic(() => import('@/components/renderer'), { ssr: true });

interface ActivityCardProps {
  activities: ActivitiesReturnType;
  isLoading: boolean;
  isUnRead: boolean;
  setIsUnRead: Dispatch<SetStateAction<boolean>>;
  currentUser?: Doc<'users'> | null;
}

const ActivityCard = ({
  activities,
  isLoading,
  isUnRead,
  setIsUnRead,
  currentUser,
}: ActivityCardProps) => {
  const LoaderComponent = (
    <div className="flex flex-col h-[480px] items-center justify-center">
      <Loader className=" size-5 animate-spin text-[#5E2C5F]" />
    </div>
  );

  const EmptyActivities = (
    <div className="flex flex-col h-[480px] items-center justify-center">
      <CheckCircle className=" size-5 text-[#5E2C5F]" />
    </div>
  );

  console.log(activities);

  return (
    <div className="flex flex-col w-96">
      <div className="flex justify-between items-center p-2">
        <span className="font-semibold">Activity</span>
        <div className="flex items-center space-x-2">
          <Label htmlFor="status-read">Unreads</Label>
          <Switch
            id="status-read"
            checked={isUnRead}
            onCheckedChange={(value) => setIsUnRead(value)}
          />
        </div>
      </div>
      <Separator />
      {isLoading ? (
        LoaderComponent
      ) : (
        <div className="max-h-[480px] overflow-auto flex flex-col">
          {activities?.length === 0 && EmptyActivities}
          {activities?.map((activity, index: number) => {
            const memberInActivity = () => {
              return (
                <>
                  {activity.senders.map((sender, index) => (
                    <span key={sender._id}>
                      {sender.name}
                      {index !== activity.senders.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </>
              );
            };
            const activityLocate = () => {
              if (activity.notiType === 'reply') {
                return (
                  <span>
                    Thread in{' '}
                    {activity.threadName
                      ? `# ${activity.threadName}`
                      : 'direct message'}
                  </span>
                );
              } else if (activity.notiType === 'reaction') {
                return (
                  <span className="text-xs font-extralight">
                    {memberInActivity()} reacted in{' '}
                    {activity.threadName
                      ? `# ${activity.threadName}`
                      : 'direct message'}
                  </span>
                );
              } else return null;
            };

            const activityContent = () => {
              if (activity.notiType === 'reply') {
                return (
                  <>
                    {activity.newestNoti.parentMessage?.body && (
                      <div className="flex items-center gap-1">
                        <div className="w-max">replied to:</div>
                        <Renderer
                          value={activity.newestNoti.parentMessage?.body}
                          cutWord={2}
                        />
                      </div>
                    )}
                  </>
                );
              } else if (activity.notiType === 'reaction') {
                return (
                  <>
                    {(activity?.reactionsList || []).map(
                      (
                        reaction: {
                          value: string;
                          reactor: string | undefined;
                          reactorId: string | undefined;
                        },
                        idx: number
                      ) => {
                        return <span key={idx}>{reaction.value}</span>;
                      }
                    )}
                  </>
                );
              }
            };

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
                      'text-sm text-muted-foreground flex gap-2 items-center',
                      activity.unreadCount > 0 && 'font-medium text-black'
                    )}
                  >
                    <MessageSquareTextIcon className="size-4" />
                    {activityLocate()}
                  </div>
                  <div className="flex gap-1 ">
                    <span className="text-base">
                      {formatDateNotiTime(
                        new Date(activity.newestNoti._creationTime)
                      )}
                    </span>
                    {activity.unreadCount > 0 && (
                      <div className="w-8 h-5 bg-[#5E2C5F] flex justify-center items-center rounded-3xl text-white font-normal text-sm">
                        {activity.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex justify-start gap-2 items-start">
                  <div className="relative w-10">
                    <Avatar
                      className={cn(
                        'size-10 hover:opacity-75 transition rounded-md mt-1',
                        true && 'absolute size-6'
                      )}
                    >
                      <AvatarImage
                        className="rounded-md"
                        src={activity.newestNoti.sender?.image}
                        alt={activity.newestNoti.sender?.name}
                      />
                      <AvatarFallback className="rounded-md bg-sky-500 text-white">
                        {activity.newestNoti.sender?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <Avatar
                      className={cn(
                        'size-10 hover:opacity-75 transition rounded-md mt-1',
                        true && 'absolute size-6 translate-x-3 translate-y-3'
                      )}
                    >
                      <AvatarImage
                        className="rounded-md"
                        src={currentUser?.image}
                        alt={currentUser?.name}
                      />
                      <AvatarFallback className="rounded-md bg-sky-500 text-white">
                        {currentUser?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div>
                    <p className="font-bold text-base">
                      {memberInActivity()} and you
                    </p>
                    <div className="text-muted-foreground">
                      {activityContent()}
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
      )}
    </div>
  );
};

export default ActivityCard;
