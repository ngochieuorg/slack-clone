import { Id } from '../../convex/_generated/dataModel';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import UserDetailCard from './user-detail-card';

interface ConversationHeroProps {
  name?: string;
  image?: string;
  memberId?: string;
  memberTitle?: string;
}

const ConversationHero = ({
  name = 'Member',
  image,
  memberId,
  memberTitle,
}: ConversationHeroProps) => {
  const avatarFallback = name.charAt(0).toUpperCase();
  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="flex items-center gap-x-1 mb-2">
        <Avatar className="size-28 mr-2 border">
          <AvatarImage src={image} />
          <AvatarFallback className=" aspect-square rounded-md bg-sky-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="text-xl font-semibold "> {name}</p>
          <p className="text-base font-normal "> {memberTitle}</p>
        </div>
      </div>

      <div className="font-normal text-slate-800 mb-4 text-lg">
        This conversation is just between{' '}
        <UserDetailCard
          trigger={
            <span className=" text-[#1264a3] bg-[#d5e3ee] py-0.5 cursor-pointer">
              @{name}
            </span>
          }
          memberId={memberId as Id<'members'>}
        />{' '}
        and you. Check out their profile to learn more about them.
      </div>
      <Button variant={'outline'}>View Profile</Button>
    </div>
  );
};

export default ConversationHero;
