import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  MessageSquare,
  SmileIcon,
  SendIcon,
  AtSign,
  Logs,
  MessageSquareIcon,
  Loader,
} from 'lucide-react';
import { useGetActivities } from '@/features/notifications/api/use-get-activities';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Avatar } from '@radix-ui/react-avatar';
import { AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { groupBy } from '@/app/utils';
import dynamic from 'next/dynamic';
import { useCurrentUser } from '@/features/auth/api/use-current-user';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { formatDateNotiTime } from '@/app/utils/date-time';
import { Separator } from '@/components/ui/separator';
import { Id } from '../../../../convex/_generated/dataModel';
import { useToggleReaction } from '@/features/reactions/api/use-toggle-reaction';
import { toast } from 'sonner';
import { useChannelId } from '@/hooks/use-channel-id';

const Renderer = dynamic(() => import('@/components/renderer'), { ssr: true });

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
  const { data: activities, isLoading: activitiesLoading } = useGetActivities({
    workspaceId,
  });

  useEffect(() => {
    const mentions = document.querySelectorAll('.mention');
    mentions.forEach((mention) => {
      (mention as HTMLElement).style.background = 'red';
      (mention as HTMLElement).style.color = 'red';
    });
  }, []);

  const [isUnRead, setIsUnRead] = useState(false);

  const handleReaction = ({
    value,
    messageId,
  }: {
    value: string;
    messageId: Id<'messages'>;
  }) => {
    toggleReaction(
      { messageId, value, channelId },
      {
        onError: () => {
          toast.error('Failed to toggle reaction');
        },
      }
    );
  };

  const LoaderComponent = (
    <div className="flex flex-col h-[480px] items-center justify-center">
      <Loader className=" size-5 animate-spin text-muted-foreground" />
    </div>
  );

  if (activitiesLoading) {
    return LoaderComponent;
  }
  return (
    <div>
      <div className="flex justify-between items-center p-2">
        <span className="font-semibold  text-white">Activity</span>
        <div className="flex items-center space-x-2">
          <Label htmlFor="status-read" className="text-slate-200">
            Unreads
          </Label>
          <Switch
            id="status-read"
            checked={isUnRead}
            onCheckedChange={(value) => setIsUnRead(value)}
          />
        </div>
      </div>
      <Tabs defaultValue="all">
        <TabsList className="w-full justify-start">
          {activityType.map((type) => {
            return (
              <TabsTrigger value={type.value} key={type.value}>
                <div className="flex items-center gap-0.5">
                  <div className="">{type.icon}</div>
                  <div>{type.label}</div>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>
        {activityType.map((type) => {
          return (
            <TabsContent value={type.value} key={type.value}>
              {(activities || [])
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
                            {index !== activity.senders.length - 1 ? ',' : ''}
                          </span>
                        ))}
                      </>
                    );
                  }

                  function activityIcon() {
                    if (activity.notiType === 'reply') {
                      return <MessageSquareIcon className="size-4" />;
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
                    if (activity.notiType === 'reply') isDoubleAvatar = true;

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
                                value={activity.newestNoti.parentMessage?.body}
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

                  return (
                    <div className="p-2" key={index}>
                      <div
                        className={cn(
                          'flex justify-between items-end text-slate-200',
                          activity.unreadCount > 0 && 'font-medium text-white'
                        )}
                      >
                        <div
                          className={cn(
                            'text-sm text-slate-200 flex gap-1 items-center',
                            activity.unreadCount > 0 && 'font-medium text-white'
                          )}
                        >
                          {activityIcon()}
                          {activityLocate()}
                        </div>
                        <div className="flex gap-1 ">
                          <span className="text-base">
                            {formatDateNotiTime(
                              new Date(activity.newestNoti._creationTime)
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
                      <div className="flex justify-start gap-2 items-start">
                        {activityAvatar()}
                        <div>
                          <p className="font-bold text-base text-slate-200">
                            {memberInActivity()}
                          </p>
                          <div className="text-slate-200">
                            {activityContent()}
                          </div>
                          <div className="mb-5 text-slate-200">{content()}</div>
                        </div>
                      </div>
                      <Separator />
                    </div>
                  );
                })}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
};

export default ActivitySidebar;
