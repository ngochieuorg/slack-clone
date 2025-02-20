import dynamic from 'next/dynamic';
import { useCallback, useMemo, useState } from 'react';

// UI Components
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';

// Icons
import {
  MessageSquare,
  SmileIcon,
  SendIcon,
  AtSign,
  Logs,
  Loader,
  MessageCircleIcon,
} from 'lucide-react';

// Hooks
import { useChannelId } from '@/hooks/use-channel-id';
import { useCurrentUser } from '@/features/auth/api/use-current-user';

// API Calls
import { useToggleReaction } from '@/features/reactions/api/use-toggle-reaction';
import { useMarkAsReadNotifications } from '@/features/notifications/api/use-mark-as-read-notifications';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

// Utilities
import { cn } from '@/lib/utils';
import { groupBy } from '@/app/utils';
import { formatDateNotiTime } from '@/app/utils/date-time';

// Notifications
import { toast } from 'sonner';

// Types
import { Id } from '../../../../convex/_generated/dataModel';

// Store Management
import { useAtom } from 'jotai';
import { activitiesAtom } from '@/store/activity.store';

// Dynamic Imports
const Renderer = dynamic(() => import('@/components/renderer'), { ssr: false });
const HoverCard = dynamic(
  () => import('@/components/ui/hover-card').then((mod) => mod.HoverCard),
  { ssr: false }
);

const activityType = [
  {
    label: 'All',
    value: 'all',
  },
  {
    label: 'Mentions',
    value: 'mention',
    icon: <AtSign className="size-4" />,
  },
  {
    label: 'Threads',
    value: 'reply',
    icon: <MessageSquare className="size-4" />,
  },
  {
    label: 'Reactions',
    value: 'reaction',
    icon: <SmileIcon className="size-4" />,
  },
  {
    label: 'Invitations',
    value: 'invitations',
    icon: <SendIcon className="size-4" />,
  },
  {
    label: 'Apps',
    value: 'apps',
    icon: <Logs className="size-4 " />,
  },
];

const ActivitySidebar = () => {
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const { data: currentUser } = useCurrentUser();
  const { mutate: toggleReaction } = useToggleReaction();

  const [{ activities, isUnread, isLoading }, setActivities] =
    useAtom(activitiesAtom);

  const { mutate: markAsReadNoti } = useMarkAsReadNotifications();

  const [selectedTab, setSelectedTab] = useState('all');

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

  const markAsReadMessage = (messageId?: Id<'messages'>) => {
    markAsReadNoti({ workspaceId, messageId }, {});
  };

  const filteredActivities = useMemo(() => {
    return (activities || []).filter((activity) => {
      if (selectedTab === 'all') return true;
      return activity.notiType === selectedTab;
    });
  }, [activities, selectedTab]);

  const LoaderComponent = (
    <div className="flex flex-col h-[480px] items-center justify-center">
      <Loader className=" size-5 animate-spin text-muted-foreground" />
    </div>
  );

  return (
    <div className="relative">
      <div className="flex justify-between items-center p-2 sticky top-0 h-10 z-50 bg-[#5E2C5F]">
        <span className="font-semibold  text-white">Activity</span>
        <div className="flex items-center space-x-2">
          <Label htmlFor="status-read" className="text-slate-200">
            Unreads
          </Label>
          <Switch
            id="status-read"
            checked={isUnread}
            onCheckedChange={(value) =>
              setActivities((prev) => ({ ...prev, isUnread: value }))
            }
          />
        </div>
      </div>
      <Tabs defaultValue="all">
        <TabsList className="w-full justify-start sticky top-10 z-50 bg-[#5E2C5F]">
          {activityType.map((type) => {
            return (
              <TabsTrigger
                value={type.value}
                key={type.value}
                onClick={() => setSelectedTab(type.value)}
              >
                <div className="flex items-center gap-0.5">
                  <div className="">{type.icon}</div>
                  <div>{type.label}</div>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {isLoading ? (
          LoaderComponent
        ) : (
          <>
            {activityType.map((type) => {
              return (
                <TabsContent value={type.value} key={type.value}>
                  {filteredActivities
                    ?.filter((activity) => {
                      if (type.value === 'all') return true;
                      return activity.notiType === type.value;
                    })
                    .map((activity, index: number) => {
                      function memberInActivity() {
                        return (
                          <>
                            {activity.senders.map((sender, index) => (
                              <span key={sender._id}>
                                {sender.name}
                                {index !== activity.senders.length - 1
                                  ? ','
                                  : ''}
                              </span>
                            ))}
                          </>
                        );
                      }

                      function activityIcon() {
                        if (activity.notiType === 'reply') {
                          return <MessageCircleIcon className="size-4" />;
                        } else if (activity.notiType === 'mention') {
                          return <span className="text-slate-200">@</span>;
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
                              {activity.senders[0].name} mention you in{' '}
                              {activity.threadName
                                ? `# ${activity.threadName}`
                                : 'a message'}
                            </span>
                          );
                        } else return null;
                      }

                      function activityAvatar() {
                        let isDoubleAvatar = false;
                        if (activity.notiType === 'reply') {
                          isDoubleAvatar = true;
                        }

                        if (activity.notiType === 'reaction') {
                          const lastReact = [...activity.notifications].pop();
                          return (
                            <div className="relative w-10">
                              <div className="size-10 hover:opacity-75 transition rounded-md mt-1 text-[32px] flex justify-center items-center">
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
                                src={activity.newestNoti.sender?.image}
                                alt={activity.newestNoti.sender?.name}
                              />
                              <AvatarFallback className="rounded-md bg-sky-500 text-white size-10">
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
                                src={currentUser?.image}
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
                                    value={
                                      activity.newestNoti.parentMessage?.body
                                    }
                                    textColor="#fff"
                                    mentionBackground="#573502"
                                    mentionColor="#e4bf19"
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
                                  <Renderer
                                    value={activity.newestNoti.message?.body}
                                    textColor="#fff"
                                    mentionBackground="#573502"
                                    mentionColor="#e4bf19"
                                  />
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
                          const groupReact = groupBy(
                            activity?.notifications,
                            'content'
                          );

                          return (
                            <div className="flex items-center gap-1 cursor-pointer">
                              {Object.entries(groupReact).map(
                                ([key, reacts]) => {
                                  const messageId = reacts[0].messageId;
                                  const reactBelongtoCurrentUser = reacts.find(
                                    (react) =>
                                      react.senderId === currentUser?._id
                                  );
                                  return (
                                    <HoverCard key={key}>
                                      <HoverCardTrigger>
                                        <button
                                          onClick={() =>
                                            messageId &&
                                            handleReaction({
                                              value: key,
                                              messageId,
                                            })
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
                                              {currentUser?._id ===
                                              user.senderId
                                                ? 'You'
                                                : user.sender?.name}
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
                                }
                              )}
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
                                    {oldestRead.sender?.name}:
                                  </div>
                                  <Renderer
                                    value={oldestRead.message?.body}
                                    textColor="#fff"
                                    mentionBackground="#573502"
                                    mentionColor="#e4bf19"
                                  />
                                </div>
                              )}
                              {unreads.length > 0 && (
                                <span className=" text-sky-300 font-bold cursor-pointer hover:underline text-sm hover:text-sky-700 transition-all">
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
                                    value={
                                      activity.notifications?.[0]?.message?.body
                                    }
                                    textColor="#fff"
                                    mentionBackground="#573502"
                                    mentionColor="#e4bf19"
                                  />
                                </div>
                              )}
                            </>
                          );
                        }
                      }

                      function onClickNoti() {
                        if (
                          activity.notiType === 'mention' ||
                          activity.notiType === 'reaction'
                        ) {
                          markAsReadMessage(activity.newestNoti.messageId);
                        }
                        setActivities((prev) => ({
                          ...prev,
                          selectActivityId: activity._id,
                        }));
                      }

                      return (
                        <div
                          className="pt-2 hover:bg-[#713a72] cursor-pointer"
                          key={index}
                          onClick={() => onClickNoti()}
                        >
                          <div
                            className={cn(
                              'flex justify-between items-end text-slate-200 px-2',
                              activity.unreadCount > 0 &&
                                'font-medium text-white'
                            )}
                          >
                            <div
                              className={cn(
                                'text-sm text-slate-200 flex gap-1 items-center',
                                activity.unreadCount > 0 &&
                                  'font-medium text-white'
                              )}
                            >
                              {activityIcon()}
                              {activityLocate()}
                            </div>
                            <div className="flex gap-1 ">
                              <span className="text-sm">
                                {formatDateNotiTime(
                                  new Date(activity.newestNoti._creationTime),
                                  'MMMM do'
                                )}
                              </span>
                              {activity.notiType !== 'reaction' &&
                                activity.unreadCount > 0 && (
                                  <div className="w-8 h-5 bg-[#ee95f0] text-[#5E2C5F] flex justify-center items-center rounded-3xl font-normal text-sm">
                                    {activity.unreadCount}
                                  </div>
                                )}
                            </div>
                          </div>
                          <div className="flex justify-start gap-2 items-start px-2">
                            {activityAvatar()}
                            <div>
                              <p className="font-bold text-base text-slate-200">
                                {memberInActivity()}
                              </p>
                              <div className="text-slate-200">
                                {activityContent()}
                              </div>
                              <div className="mb-5 text-slate-200">
                                {content()}
                              </div>
                            </div>
                          </div>
                          <Separator className="bg-neutral-500" />
                        </div>
                      );
                    })}
                </TabsContent>
              );
            })}
          </>
        )}
      </Tabs>
    </div>
  );
};

export default ActivitySidebar;
