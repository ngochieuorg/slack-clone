import { Button } from '@/components/ui/button';
import { Id } from '../../../../convex/_generated/dataModel';
import { cva, type VariantProps } from 'class-variance-authority';
import Link from 'next/link';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import ActiveStatus from '@/components/active-status';

const userItemVariants = cva(
  'flex items-center gap-1.5 justify-start font-normal h-7 px-4 text-sm overflow-hidden',
  {
    variants: {
      variant: {
        default: 'text-[#f9edffcc]',
        active: 'text-[#481349] bg-white/90 hover:bg-white/90',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

interface UserItemProps {
  id: Id<'members'>;
  label?: string;
  image?: string;
  variant?: VariantProps<typeof userItemVariants>['variant'];
  countNotifs?: number;
  isYou?: boolean;
  onlineAt?: number;
}

const UserItem = ({
  id,
  label = 'Member',
  image,
  variant,
  countNotifs,
  isYou,
  onlineAt,
}: UserItemProps) => {
  const workspaceId = useWorkspaceId();
  const avatarFallback = label.charAt(0).toUpperCase();

  return (
    <Button
      variant={'transparent'}
      className={cn(userItemVariants({ variant: variant }))}
      size={'sm'}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/member/${id}`}>
        <div className="flex items-center w-full">
          <Avatar className="relative size-5 hover:opacity-75 transition overflow-visible">
            <AvatarImage alt={'image'} src={image} className="rounded" />
            <AvatarFallback className="aspect-square rounded bg-sky-500 text-white flex justify-center items-center">
              {avatarFallback}
            </AvatarFallback>
            <ActiveStatus
              onlineAt={onlineAt}
              defaultBg="#5E2C5F"
              activeBg="white/90"
              isSelected={variant === 'active'}
            />
          </Avatar>
          <span
            className={cn(
              'text-sm truncate ml-2',
              Number(countNotifs) > 0 && 'font-bold text-white'
            )}
          >
            {label}
            {isYou ? ' (You)' : ''}
          </span>
          {Number(countNotifs) > 0 && (
            <span className="ml-auto h-5 w-6 bg-[#EFB8FB] rounded-lg flex items-center justify-center text-[#481349] font-semibold text-xs">
              {countNotifs}
            </span>
          )}
        </div>
      </Link>
    </Button>
  );
};

export default UserItem;
