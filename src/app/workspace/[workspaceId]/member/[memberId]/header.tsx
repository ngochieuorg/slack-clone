import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { FaChevronDown } from 'react-icons/fa';

interface HeaderProps {
  memberName?: string;
  memberImage?: string;
  onclick?: () => void;
}

const Header = ({ memberName, memberImage, onclick }: HeaderProps) => {
  const avatarFallback = memberName?.charAt(0).toUpperCase();

  return (
    <div className="bg-white border-b h-[48px] flex items-center px-4 overflow-hidden">
      <Button
        variant={'ghost'}
        className="text-lg font-semibold px-2 overflow-hidden w-auto"
        size={'sm'}
        onClick={onclick}
      >
        <Avatar className="size-6 mr-2">
          <AvatarImage src={memberImage} />
          <AvatarFallback className="aspect-square rounded-md bg-sky-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <span className="truncate">{memberName}</span>
        <FaChevronDown className="mr-2 size-2.5" />
      </Button>
    </div>
  );
};

export default Header;
