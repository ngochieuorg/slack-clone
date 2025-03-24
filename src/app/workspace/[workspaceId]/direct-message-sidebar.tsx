import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { directMessageAtom } from '@/store/direct-message.store';
import { useAtom } from 'jotai';
import { ChevronDownIcon, ChevronRight, EditIcon, Loader } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  HoverCardContent,
  HoverCardTrigger,
  HoverCard,
} from '@/components/ui/hover-card';
import InputSearch from '@/components/input-search';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useGetMembers } from '@/features/members/api/use-get-members';
import { renderDisplayName } from '@/utils/label';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { formatDateNotiTime } from '@/utils/date-time';
import CustomRenderer from '@/components/custom-renderer';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import useConversationId from '@/features/notifications/store/use-conversation-id';
import { useMarkAsReadNotifications } from '@/features/notifications/api/use-mark-as-read-notifications';
import { Id } from '../../../../convex/_generated/dataModel';
import ActiveStatus from '@/components/active-status';

const DirectMessageSidebar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [{ directMessages, isUnread, isLoading }, setDirectMessages] =
    useAtom(directMessageAtom);
  const [conversationId] = useConversationId();
  const { mutate: markAsReadNoti } = useMarkAsReadNotifications();

  const { data: members } = useGetMembers({ workspaceId });

  const [search, setSearch] = useState('');

  const LoaderComponent = (
    <div className="flex flex-col h-[480px] items-center justify-center">
      <Loader className=" size-5 animate-spin text-muted-foreground" />
    </div>
  );

  const markAsReadConversation = (conversationId: Id<'conversations'>) => {
    markAsReadNoti({ conversationId, workspaceId }, {});
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center p-2 sticky top-0 h-10 z-50 bg-[#5E2C5F]">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={'transparent'}
              className="h-8 py-0 font-bold text-white text-xl flex items-center "
            >
              Direct messages
              <ChevronDownIcon className="size-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="py-2 px-0">
            <div className="py-1 px-5 text-base hover:bg-sky-800 hover:text-white cursor-pointer">
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex justify-between items-center">
                    <span> Filter conversation</span>
                    <ChevronRight className="size-4" />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="py-2 px-4 ml-6" side="left">
                  <div>Every one</div>
                  <div>Only external people</div>
                  <div>Only internal people</div>
                </HoverCardContent>
              </HoverCard>
            </div>
          </PopoverContent>
        </Popover>
        <div className="flex items-center space-x-2">
          <Label htmlFor="status-read" className="text-slate-200">
            Unreads
          </Label>
          <Switch
            id="status-read"
            checked={isUnread}
            onCheckedChange={(value) =>
              setDirectMessages((prev) => ({ ...prev, isUnread: value }))
            }
          />
          <Button variant={'transparent'} className="p-2">
            <EditIcon className="size-5 text-white" />
          </Button>
        </div>
      </div>
      <div className="px-2 mt-4">
        <InputSearch
          placeholder="Find a DM"
          className="bg-accent/25 hover:bg-accent-25 placeholder:text-slate-200 text-white focus-visible:ring-1 focus-visible:ring-accent/5"
          onChange={(e) => setSearch(e.target.value)}
          search={search}
          options={(members || [])?.map((member) => {
            return (
              <div
                key={member._id}
                className="flex items-center hover:bg-sky-700 hover:text-white p-2 cursor-pointer gap-2"
                onClick={() => {
                  setSearch('');
                }}
              >
                <Avatar className="size-5 hover:opacity-75 transition">
                  <AvatarImage
                    alt={'image'}
                    src={
                      member.user.memberPreference.image || member.user.image
                    }
                  />
                  <AvatarFallback className="aspect-square rounded-md bg-sky-500 text-white flex justify-center items-center"></AvatarFallback>
                </Avatar>
                <span className="font-semibold">
                  {renderDisplayName(
                    member.user.name,
                    member.user.memberPreference
                  )}
                </span>
                <span className="font-normal text-sm">
                  {member.user.memberPreference.fullName}
                </span>
              </div>
            );
          })}
        />
      </div>
      {isLoading ? (
        LoaderComponent
      ) : (
        <div className="mt-2">
          {directMessages?.map((noti, idx) => {
            return (
              <div
                className={cn(
                  'pt-2 hover:bg-[#713a72] cursor-pointer text-white',
                  noti.conversationId === conversationId && 'bg-[#713a72]'
                )}
                key={idx}
                onClick={() => {
                  if (noti.conversationId) {
                    markAsReadConversation(noti.conversationId);
                  }
                  router.replace(
                    `/workspace/${workspaceId}/direct-message/${noti.conversationWith?.memberPreference.memberId}?conversationId=${noti.conversationId}`
                  );
                }}
              >
                <div className="flex justify-start gap-2 items-start py-4 px-2">
                  <Avatar className="size-10 hover:opacity-75 transition rounded-md mt-1 overflow-visible">
                    <AvatarImage
                      className="rounded-md"
                      alt={'image'}
                      src={
                        noti.conversationWith?.memberPreference.image ||
                        noti.conversationWith?.image
                      }
                    />
                    <AvatarFallback className="aspect-square rounded-md bg-sky-500"></AvatarFallback>
                    <ActiveStatus
                      onlineAt={
                        members?.find(
                          (member) => member._id === noti.conversationWithMember
                        )?.onlineAt
                      }
                      defaultBg="#5E2C5F"
                      className="size-5"
                    />
                  </Avatar>
                  <div className="flex-1">
                    <div
                      className={cn(
                        'flex justify-between items-end ',
                        noti.unreadCount > 0 && 'font-medium '
                      )}
                    >
                      <div className="font-bold text-base">
                        {renderDisplayName(
                          noti.conversationWith?.name,
                          noti.conversationWith?.memberPreference
                        )}
                      </div>
                      <div className="flex gap-1 text-slate-200">
                        <span className=" text-sm">
                          {formatDateNotiTime(
                            new Date(noti.newestNoti._creationTime),
                            'MMMM do'
                          )}
                        </span>
                        {noti.unreadCount > 0 && (
                          <div className="w-8 h-5 bg-[#ee95f0] text-[#5E2C5F] flex justify-center items-center rounded-3xl font-normal text-sm">
                            {noti.unreadCount}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center">
                      <p>
                        {renderDisplayName(
                          noti.newestNoti.sender?.name,
                          noti.newestNoti.sender?.memberPreference
                        )}
                        :&nbsp;
                      </p>
                      <div className="text-muted-foreground">
                        <CustomRenderer
                          value={noti.newestNoti.content}
                          textColor="white"
                        />{' '}
                      </div>
                    </div>
                  </div>
                </div>
                <Separator className="bg-neutral-500" />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default DirectMessageSidebar;
