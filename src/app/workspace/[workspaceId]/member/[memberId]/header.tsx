import ActiveStatus from '@/components/active-status';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FaChevronDown } from 'react-icons/fa';

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onclick?: () => void;
  onlineAt?: number;
}

const Header = ({
  memberName,
  memberImage,
  onclick,
  onlineAt,
}: HeaderProps) => {
  const avatarFallback = memberName?.charAt(0).toUpperCase();
  console.log(onlineAt);

  return (
    <div className="bg-white border-b h-[48px] flex items-center px-2 overflow-hidden">
      <Button
        variant={'ghost'}
        className="text-lg font-semibold px-2 w-auto"
        size={'sm'}
        onClick={onclick}
      >
        <Avatar className="relative size-7 mr-2 overflow-visible">
          <AvatarImage src={memberImage} alt={memberName} />
          <AvatarFallback className="aspect-square rounded-md bg-sky-500 text-white">
            {avatarFallback}
          </AvatarFallback>
          <ActiveStatus onlineAt={onlineAt} defaultBg="white" />
        </Avatar>
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="mr-1 size-2.5" />
      </Button>
    </div>
  );
};

export default Header;
