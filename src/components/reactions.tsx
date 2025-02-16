import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Doc, Id } from '../../convex/_generated/dataModel';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { cn } from '@/lib/utils';
import Hint from './hint';
import EmojiPopover from './emoji-popover';
import { MdOutlineAddReaction } from 'react-icons/md';
import { useCurrentUser } from '@/features/auth/api/use-current-user';

interface ReactionsProps {
  data: Array<
    Omit<Doc<'reactions'>, 'memberId'> & {
      count: number;
      memberIds: Id<'members'>[];
      users: Doc<'users'>[];
    }
  >;
  onChange: (value: string) => void;
}

const Reactions = ({ data, onChange }: ReactionsProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { data: currentUser } = useCurrentUser();

  const currentMemberId = currentMember?._id;

  if (data.length === 0 || !currentMemberId) {
    return null;
  }

  return (
    <div className="flex items-center gap-1 mt-1 mb-1">
      {data.map((reaction) => {
        const usersReact = () => {
          let string = '';
          reaction.users.forEach((user, idx) => {
            string += `${user._id === currentUser?._id ? 'You' : user.name}${idx !== reaction.users.length - 1 ? ', ' : ''} `;
          });
          return string;
        };
        return (
          <Hint
            key={reaction._id}
            label={`${usersReact()} react with ${reaction.value}`}
          >
            <button
              onClick={() => onChange(reaction.value)}
              className={cn(
                'h-6 px-2 rounded-full bg-slate-200/70 border border-transparent text-slate-800 flex items-center gap-x-1',
                reaction.memberIds.includes(currentMemberId) &&
                  'bg-blue-100/70 border-blue-500 text-white'
              )}
            >
              {reaction.value}
              <span
                className={cn(
                  'text-xs font-semibold text-muted-foreground',
                  reaction.memberIds.includes(currentMemberId) &&
                    'text-blue-500'
                )}
              >
                {reaction.count}
              </span>
            </button>
          </Hint>
        );
      })}
      <EmojiPopover
        hint="Add reaction"
        onEmojiSelect={(emoji) => onChange(emoji.native)}
      >
        <button className="h-7 px-3 rounded-full bg-slate-200 border border-transparent hover:border-slate-500 text-slate-800 flex items-center gap-x-1">
          <MdOutlineAddReaction className="size-4" />
        </button>
      </EmojiPopover>
    </div>
  );
};

export default Reactions;
