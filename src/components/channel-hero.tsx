import { format } from 'date-fns';
import { HashIcon, LockKeyholeIcon, PencilIcon, UserPlus } from 'lucide-react';
import { Button } from './ui/button';

interface ChannelHeroProps {
  name: string;
  creationTime: number;
  isPrivate?: boolean;
}

const ChannelHero = ({ name, creationTime, isPrivate }: ChannelHeroProps) => {
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="text-4xl font-bold flex items-center mb-2 gap-2">
        {isPrivate ? (
          <LockKeyholeIcon className="size-8" />
        ) : (
          <HashIcon className="size-8" />
        )}{' '}
        {name}
      </div>
      <p className="font-normal text-slate-800 mb-4">
        This channel was created on {format(creationTime, 'MMMM do, yyyy')}.
        This is the very beginning of <strong>{name}</strong> channel
      </p>
      <div className="flex items-center gap-4">
        <Button variant={'outline'} className="py-1 h-min border-gray-400">
          <PencilIcon />
          Add description
        </Button>
        <Button variant={'outline'} className="py-1 h-min border-gray-400">
          <UserPlus />
          Add people to channel
        </Button>
      </div>
    </div>
  );
};

export default ChannelHero;
