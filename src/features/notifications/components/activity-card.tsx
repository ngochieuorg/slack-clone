import dynamic from 'next/dynamic';
import { useCallback } from 'react';

// UI Components
import { CheckCircle, Loader, MessageCircleCodeIcon } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AvatarFallback, AvatarImage, Avatar } from '@/components/ui/avatar';
import { HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

// Utils & Helpers
import { cn } from '@/lib/utils';
import { formatDateNotiTime } from '@/app/utils/date-time';
import { groupBy } from '@/app/utils';

// Hooks & API Calls
import { useToggleReaction } from '@/features/reactions/api/use-toggle-reaction';
import { useChannelId } from '@/hooks/use-channel-id';
import { useMarkAsReadNotifications } from '../api/use-mark-as-read-notifications';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

// Types
import { Id } from '../../../../convex/_generated/dataModel';

// Notifications
import { toast } from 'sonner';

// Store Management
import { useAtom } from 'jotai';
import { activitiesAtom } from '@/store/activity.store';
import { GetUserReturnType } from '@/features/auth/api/use-current-user';
import { renderDisplayName } from '@/app/utils/label';

// Dynamic Imports
const Renderer = dynamic(() => import('@/components/renderer'), { ssr: false });
const HoverCard = dynamic(
  () => import('@/components/ui/hover-card').then((mod) => mod.HoverCard),
  { ssr: false }
);

interface ActivityCardProps {
  currentUser?: GetUserReturnType;
}

const ActivityCard = ({ currentUser }: ActivityCardProps) => {
  const workspaceId = useWorkspaceId();
  const channelId = useChannelId();
  const { mutate: toggleReaction } = useToggleReaction();

  const [{ activities, isUnread, isLoading }, setActivities] =
    useAtom(activitiesAtom);

  const handleReaction = useCallback(
    ({ value, messageId }: { value: string; messageId: Id<'messages'> }) => {
      toggleReaction(
        { messageId, value, channelId },
        {
          onError: () => {
            toast.error('Failed to toggle reaction');
          },
        }
      );
    },
    [toggleReaction, channelId]
  );

  const { mutate: markAsReadNoti } = useMarkAsReadNotifications();

  // const markAsReadChannel = (channelId: Id<'channels'>) => {
  //   markAsReadNoti({ channelId, workspaceId }, {});
  // };

  // const markAsReadConversation = (conversationId: Id<'conversations'>) => {
  //   markAsReadNoti({ conversationId, workspaceId }, {});
  // };

  const markAsReadMessage = (messageId?: Id<'messages'>) => {
    markAsReadNoti({ workspaceId, messageId }, {});
  };

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

  return (
    <div className="flex flex-col w-96">
      <div className="flex justify-between items-center p-2">
        <span className="font-semibold">Activity</span>
        <div className="flex items-center space-x-2">
          <Label htmlFor="status-read">Unreads</Label>
          <Switch
            id="status-read"
            checked={isUnread}
            onCheckedChange={(value) =>
              setActivities((prev) => ({ ...prev, isUnread: value }))
            }
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
            function memberInActivity() {
              return (
                <>
                  {activity.senders.map((sender, index) => (
                    <span key={sender?._id}>
                      {renderDisplayName(
                        sender?.name,
                        sender?.memberPreference
                      )}
                      {index !== activity.senders.length - 1 ? ',' : ''}
                    </span>
                  ))}
                </>
              );
            }

            function activityIcon() {
              if (activity.notiType === 'reply') {
                return <MessageCircleCodeIcon className="size-4" />;
              } else if (activity.notiType === 'mention') {
                return <span className="text-muted-foreground">@</span>;
              }
            }

            function activityLocate() {
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
              } else if (activity.notiType === 'mention') {
                return (
                  <span className="text-xs font-extralight">
                    {activity.senders[0]?.name} mention you in{' '}
                    {activity.threadName
                      ? `# ${activity.threadName}`
                      : 'a message'}
                  </span>
                );
              } else return null;
            }

            function activityAvatar() {
              let isDoubleAvatar = false;
              if (activity.notiType === 'reply') isDoubleAvatar = true;

              if (activity.notiType === 'reaction') {
                const lastReact = [...activity.notifications].pop();
                return (
                  <div className="relative w-10">
                    <div className="size-10 hover:opacity-75 transition rounded-md mt-1 text-[40px] flex justify-center items-center">
                      {lastReact?.content}
                    </div>
                  </div>
                );
              }

              return (
                <div className="relative w-10">
                  <Avatar
                    className={cn(
                      'size-10 hover:opacity-75 transition rounded-md mt-1',
                      isDoubleAvatar && 'absolute size-6'
                    )}
                  >
                    <AvatarImage
                      className="rounded-md"
                      src={
                        activity.newestNoti.sender?.memberPreference.image ||
                        activity.newestNoti.sender?.image
                      }
                      alt={activity.newestNoti.sender?.name}
                    />
                    <AvatarFallback className="rounded-md bg-sky-500 text-white">
                      {activity.newestNoti.sender?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Avatar
                    className={cn(
                      'hover:opacity-75 transition rounded-md mt-1 hidden',
                      isDoubleAvatar &&
                        'absolute size-6 translate-x-3 translate-y-3 block'
                    )}
                  >
                    <AvatarImage
                      className="rounded-md"
                      src={
                        currentUser?.memberPreference.image ||
                        currentUser?.image
                      }
                      alt={currentUser?.name}
                    />
                    <AvatarFallback className="rounded-md bg-sky-500 text-white">
                      {currentUser?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                </div>
              );
            }

            function activityContent() {
              if (activity.notiType === 'reply') {
                return (
                  <>
                    {activity.newestNoti.parentMessage?.body && (
                      <div className="flex items-center gap-1">
                        <div className="w-max">replied to:</div>
                        <Renderer
                          value={activity.newestNoti.parentMessage?.body}
                        />
                      </div>
                    )}
                  </>
                );
              } else if (activity.notiType === 'mention') {
                return (
                  <>
                    {activity.newestNoti.message?.body && (
                      <div className="flex items-center gap-1">
                        <Renderer value={activity.newestNoti.message?.body} />
                      </div>
                    )}
                  </>
                );
              } else if (activity.notiType === 'reaction') {
                return reactsList();
              }
            }

            function reactsList() {
              if (activity.notiType === 'reaction') {
                const groupReact = groupBy(activity?.notifications, 'content');

                return (
                  <div className="flex items-center gap-1 cursor-pointer">
                    {Object.entries(groupReact).map(([key, reacts]) => {
                      const messageId = reacts[0].messageId;
                      const reactBelongtoCurrentUser = reacts.find(
                        (react) => react.senderId === currentUser?._id
                      );
                      return (
                        <HoverCard key={key}>
                          <HoverCardTrigger>
                            <button
                              onClick={() =>
                                messageId &&
                                handleReaction({ value: key, messageId })
                              }
                              className={cn(
                                'h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1',
                                reactBelongtoCurrentUser &&
                                  'bg-blue-100/70 border-blue-500 text-white'
                              )}
                            >
                              {key}
                            </button>
                          </HoverCardTrigger>
                          <HoverCardContent className=" bg-zinc-900">
                            <div className="flex justify-center items-center">
                              <div className="size-16 bg-white rounded-2xl w-min flex items-center justify-center text-5xl">
                                {key}
                              </div>
                            </div>

                            <div className="text-sm font-semibold text-white">
                              {reacts.map((user, idx) => (
                                <span key={idx} className="">
                                  {currentUser?._id === user.senderId
                                    ? 'You'
                                    : renderDisplayName(
                                        user.sender?.name,
                                        user.sender?.memberPreference
                                      )}
                                  {`${idx !== reacts.length - 1 ? ', ' : ''}`}{' '}
                                </span>
                              ))}
                              <span className="text-muted-foreground ">
                                reacted with {key}
                              </span>
                            </div>
                          </HoverCardContent>
                        </HoverCard>
                      );
                    })}
                  </div>
                );
              }
            }

            function content() {
              if (activity.notiType === 'reply') {
                const reads = activity.notifications.filter(
                  (noti) => noti.status === 'read'
                );
                const unreads = activity.notifications.filter(
                  (noti) => noti.status === 'unread'
                );
                const oldestRead = reads[0];
                return (
                  <>
                    {oldestRead?.message && (
                      <div className="flex justify-start items-start gap-1">
                        <div className=" whitespace-nowrap">
                          {renderDisplayName(
                            oldestRead.sender?.name,
                            oldestRead.sender?.memberPreference
                          )}
                          :
                        </div>
                        <Renderer value={oldestRead.message?.body} />
                      </div>
                    )}
                    {unreads.length > 0 && (
                      <span className=" text-sky-700 font-semibold cursor-pointer hover:underline">
                        {unreads.length} more{' '}
                        {unreads.length > 1 ? 'replies' : 'reply'}
                      </span>
                    )}
                  </>
                );
              } else if (activity.notiType === 'reaction') {
                return (
                  <>
                    {activity.notifications?.[0]?.message?.body && (
                      <div className="flex justify-start items-start gap-1 ">
                        <Renderer
                          value={activity.notifications?.[0]?.message?.body}
                        />
                      </div>
                    )}
                  </>
                );
              }
            }

            function onHandleClickActivity() {
              if (
                activity.notiType === 'mention' ||
                activity.notiType === 'reaction'
              ) {
                markAsReadMessage(activity.newestNoti.messageId);
              }
            }

            return (
              <div
                className="p-2 pb-0 cursor-pointer hover:bg-slate-100"
                key={index}
                onClick={() => onHandleClickActivity()}
              >
                <div
                  className={cn(
                    'flex justify-between items-end',
                    activity.unreadCount > 0 && 'font-medium text-black'
                  )}
                >
                  <div
                    className={cn(
                      'text-sm text-muted-foreground flex gap-1 items-center',
                      activity.unreadCount > 0 && 'font-medium text-black'
                    )}
                  >
                    {activityIcon()}
                    {activityLocate()}
                  </div>
                  <div className="flex gap-1 ">
                    <span className=" text-sm">
                      {formatDateNotiTime(
                        new Date(activity.newestNoti._creationTime),
                        'MMMM do'
                      )}
                    </span>
                    {activity.notiType !== 'reaction' &&
                      activity.unreadCount > 0 && (
                        <div className="w-8 h-5 bg-[#5E2C5F] flex justify-center items-center rounded-3xl text-white font-normal text-sm">
                          {activity.unreadCount}
                        </div>
                      )}
                  </div>
                </div>
                <div className="flex justify-start gap-2 items-start">
                  {activityAvatar()}
                  <div>
                    <p className="font-bold text-base">{memberInActivity()}</p>
                    <div className="text-muted-foreground">
                      {activityContent()}
                    </div>
                    <div className="mb-5">{content()}</div>
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
