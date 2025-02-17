import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { IconType } from 'react-icons/lib';

interface SidebarButtonProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: LucideIcon | IconType | any;
  label: string;
  isActive?: boolean;
  notiCount?: number;
  onClick?: () => void;
}

const SidebarButton = ({
  icon: Icon,
  label,
  isActive,
  notiCount,
  onClick,
}: SidebarButtonProps) => {
  return (
    <div
      className="flex flex-col items-center justify-center gap-y-0.5 cursor-pointer group relative"
      onClick={onClick}
    >
      {Number(notiCount) > 0 && (
        <div className="size-4 absolute top-0 -right-2 rounded-full bg-[#EFB8FB] flex justify-center items-center ">
          <span className=" text-[11px]">{notiCount}</span>
        </div>
      )}
      <Button
        variant="transparent"
        className={cn(
          'size-9 p-2 group-hover:bg-accent/20',
          isActive && 'bg-accent/20'
        )}
      >
        <Icon className="size-6 text-white group-hover:scale-110 transition-all  font-bold" />
      </Button>
      <span className="text-[11px] text-white group-hover:text-accent font-medium">
        {label}
      </span>
    </div>
  );
};

export default SidebarButton;
