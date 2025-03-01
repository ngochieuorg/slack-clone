import React, { useState } from 'react';

import { HoverCardTrigger } from './ui/hover-card';
import { Id } from '../../convex/_generated/dataModel';
import dynamic from 'next/dynamic';
import { useGetMember } from '@/features/members/api/use-get-member';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from './ui/separator';
import { format } from 'date-fns';
import { Clock, Headset, MessageCircle } from 'lucide-react';
import { Button } from './ui/button';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useCurrentMember } from '@/features/members/api/use-current-member';

// Dynamic Imports
const HoverCard = dynamic(
  () => import('@/components/ui/hover-card').then((mod) => mod.HoverCard),
  { ssr: false }
);
const HoverCardContent = dynamic(
  () =>
    import('@/components/ui/hover-card').then((mod) => mod.HoverCardContent),
  { ssr: false }
);

interface UserDetailCardProps {
  trigger: React.ReactNode;
  memberId: Id<'members'>;
}

const UserDetailCard = ({ trigger, memberId }: UserDetailCardProps) => {
  const [isHovered, setIsHovered] = useState(false); // New state for hover
  return (
    <HoverCard onOpenChange={(value) => setIsHovered(value)}>
      <HoverCardTrigger>{trigger}</HoverCardTrigger>
      <HoverCardContent className="p-0 min-w-[300px]">
        {isHovered && <UserDetailCardContent memberId={memberId} />}
      </HoverCardContent>
    </HoverCard>
  );
};

const UserDetailCardContent = ({ memberId }: { memberId: Id<'members'> }) => {
  const workspaceId = useWorkspaceId();

  const { data: currentMember } = useCurrentMember({
    workspaceId,
  });
  const { data: member } = useGetMember({
    id: memberId,
  });

  return (
    <>
      <div className="flex items-center gap-4 p-4">
        <Avatar className="size-20">
          <AvatarImage
            src={member?.user?.memberPreference.image || member?.user?.image}
          />
          <AvatarFallback className="rounded-md bg-slate-100 text-white flex justify-center items-center text-xs font-light"></AvatarFallback>
        </Avatar>
        <div className="text-left">
          <p className="font-semibold">
            {member?.user.memberPreference.fullName || member?.user.name}
          </p>
          <p className="font-thin text-muted-foreground">
            {member?.user.memberPreference.title}
          </p>
        </div>
      </div>
      <Separator />
      <div className="p-4">
        <div className="flex items-center gap-2">
          <Clock className="size-4" /> {format(new Date(), 'h:mm a')} local time
        </div>
        {memberId === currentMember?._id ? (
          <div className="flex gap-4 mt-2">
            <Button variant={'outline'} className="flex-1 h-min py-1">
              Set a status
            </Button>
          </div>
        ) : (
          <div className="flex gap-4 mt-2">
            <Button variant={'outline'} className="flex-1 h-min py-1">
              <MessageCircle />
              Message
            </Button>
            <Button variant={'outline'} className="flex-1 h-min py-1">
              <Headset />
              Huddle
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

export default UserDetailCard;
