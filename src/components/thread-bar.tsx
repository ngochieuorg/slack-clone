/* eslint-disable @typescript-eslint/no-unused-vars */
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { ChevronRight } from 'lucide-react';
import { Doc } from '../../convex/_generated/dataModel';

interface ThreadBarProps {
  count?: number;
  image?: string;
  timstamp?: number;
  onClick?: () => void;
  name?: string;
  threadUsers?: (Doc<'users'> | null | undefined)[];
}

const ThreadBar = ({
  count,
  image,
  name = 'Member',
  timstamp,
  onClick,
  threadUsers,
}: ThreadBarProps) => {
  if (!count || !timstamp) return null;

  return (
    <button
      className="p-1 rounded-md hover:bg-white border border-transparent hover:border-border flex items-center justify-start group/thread-bar transition max-w-[600px]"
      onClick={onClick}
    >
      <div className="flex items-center gap-2 overflow-hidden">
        <div className="flex items-center gap-1">
          {threadUsers?.map((user) => {
            const avatarFallback = user?.name?.charAt(0).toUpperCase();
            return (
              <Avatar key={user?._id} className="size-6">
                <AvatarImage src={user?.image} />
                <AvatarFallback className="rounded-md bg-sky-500 text-white flex justify-center items-center">
                  {avatarFallback}
                </AvatarFallback>
              </Avatar>
            );
          })}
        </div>
        <span className="text-xs text-sky-700 hover:underline font-bold truncate">
          {count} {count > 1 ? 'replies' : 'reply'}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:hidden block">
          Last reply {formatDistanceToNow(timstamp, { addSuffix: true })}
        </span>
        <span className="text-xs text-muted-foreground truncate group-hover/thread-bar:block hidden">
          View thread
        </span>
      </div>
      <ChevronRight className="size-4 text-muted-foreground ml-auto opacity-0 group-hover/thread-bar:opacity-100 transition shrink-0" />
    </button>
  );
};

export default ThreadBar;
