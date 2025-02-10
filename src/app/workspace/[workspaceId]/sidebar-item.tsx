import { Button } from '@/components/ui/button';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { IconType } from 'react-icons/lib';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const sidebarItemVariants = cva(
  'flex items-center gap-1.5 justify-start font-normal h-7 px-[18px] text-sm overflow-hidden',
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

interface SidebarItemProps {
  label: string;
  id: string;
  icon: LucideIcon | IconType;
  variant?: VariantProps<typeof sidebarItemVariants>['variant'];
  countNotifs?: number;
}

const SidebarItem = ({
  label,
  id,
  icon: Icon,
  variant,
  countNotifs,
}: SidebarItemProps) => {
  const workspaceId = useWorkspaceId();

  return (
    <Button
      variant={'transparent'}
      size={'sm'}
      className={cn(sidebarItemVariants({ variant: variant }))}
      asChild
    >
      <Link href={`/workspace/${workspaceId}/channel/${id}`}>
        <div className="flex items-center w-full">
          <Icon className="size-3.5 mr-1 shrink-0" />
          <span
            className={cn(
              'text-sm truncate',
              Number(countNotifs) > 0 && 'font-bold '
            )}
          >
            {label}
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

export default SidebarItem;
