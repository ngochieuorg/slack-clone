// UI Components
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Loader } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import CustomRenderer from '@/components/custom-renderer';

// Utils & Helpers
import { renderDisplayName } from '@/app/utils/label';
import { formatDateNotiTime } from '@/app/utils/date-time';
import { cn } from '@/lib/utils';

// Hooks & API Calls
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useMarkAsReadNotifications } from '../api/use-mark-as-read-notifications';
import { useRouter } from 'next/navigation';

// Types
import { Id } from '../../../../convex/_generated/dataModel';

// Notifications

// Store Management
import { useAtom } from 'jotai';
import { directMessageAtom } from '@/store/direct-message.store';

const DirectMessageCard = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [{ directMessages, isUnread, isLoading }, setDirectMessages] =
    useAtom(directMessageAtom);

  const { mutate: markAsReadNoti } = useMarkAsReadNotifications();

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

  const markAsReadConversation = (conversationId: Id<'conversations'>) => {
    markAsReadNoti({ conversationId, workspaceId }, {});
  };

  return (
    <div className="flex flex-col w-96">
      <div className="flex justify-between items-center p-2">
        <span className="font-semibold">Activity</span>
        <div className="flex items-center space-x-2">
          <Label htmlFor="status-read">Unreads</Label>
          <Switch
            id="dm-read"
            checked={isUnread}
            onCheckedChange={(value) => {
              setDirectMessages((prev) => ({ ...prev, isUnread: value }));
            }}
          />
        </div>
      </div>
      <Separator />
      {isLoading ? (
        LoaderComponent
      ) : (
        <div
          className="h-[480px] overflow-auto flex flex-col 
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          {directMessages?.length === 0 && EmptyActivities}
          {directMessages?.map((noti, index) => {
            return (
              <div
                className=" px-4 pb-0 cursor-pointer hover:bg-slate-100"
                key={index}
                onClick={() => {
                  if (noti.conversationId) {
                    markAsReadConversation(noti.conversationId);
                  }
                  router.push(
                    `/workspace/${workspaceId}/direct-message/${noti.conversationWith?.memberPreference.memberId}?conversationId=${noti.conversationId}`
                  );
                }}
              >
                <div className="flex justify-start gap-2 items-start py-4">
                  <Avatar className="size-10 hover:opacity-75 transition rounded-md mt-1">
                    <AvatarImage
                      className="rounded-md"
                      alt={'image'}
                      src={
                        noti.conversationWith?.memberPreference.image ||
                        noti.conversationWith?.image
                      }
                    />
                    <AvatarFallback className="aspect-square rounded-md bg-sky-500 text-white flex justify-center items-center"></AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div
                      className={cn(
                        'flex justify-between items-end ',
                        noti.unreadCount > 0 && 'font-medium text-black'
                      )}
                    >
                      <div className="font-bold text-base">
                        {renderDisplayName(
                          noti.conversationWith?.name,
                          noti.conversationWith?.memberPreference
                        )}
                      </div>
                      <div className="flex gap-1 ">
                        <span className=" text-sm">
                          {formatDateNotiTime(
                            new Date(noti.newestNoti._creationTime),
                            'MMMM do'
                          )}
                        </span>
                        {noti.unreadCount > 0 && (
                          <div className="w-8 h-5 bg-[#5E2C5F] flex justify-center items-center rounded-3xl text-white font-normal text-sm">
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
                        <CustomRenderer value={noti.newestNoti.content} />{' '}
                      </div>
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

export default DirectMessageCard;
