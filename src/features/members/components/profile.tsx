// /* eslint-disable @typescript-eslint/no-unused-vars */
import { Button } from '@/components/ui/button';
import { Id } from '../../../../convex/_generated/dataModel';
import { useGetMember } from '../api/use-get-member';
import {
  AlertTriangle,
  Clock,
  EllipsisVertical,
  Headset,
  Loader,
  MailIcon,
  MessageCircle,
  XIcon,
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

import { useCurrentMember } from '../api/use-current-member';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { format } from 'date-fns';
import useSettingMembers from '../hooks/setting-member';
import { renderDisplayName } from '@/app/utils/label';

interface ProfileProps {
  memberId: Id<'members'>;
  onClose: () => void;
}

const Profile = ({ memberId, onClose }: ProfileProps) => {
  const workspaceId = useWorkspaceId();

  const { data: currentMember, isLoading: isLoadingCurrentMember } =
    useCurrentMember({
      workspaceId,
    });
  const { data: member, isLoading: isLoadingMember } = useGetMember({
    id: memberId,
  });

  const { component: SettingMember } = useSettingMembers({
    trigger: (
      <Button variant={'link'} className="text-sky-700 text-base">
        Edit
      </Button>
    ),
  });

  if (isLoadingMember || isLoadingCurrentMember) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size={'iconSm'} variant={'ghost'}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <Loader className="size-5 animate-spin text-muted-foreground" />
        </div>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="h-full flex flex-col bg-white">
        <div className="h-[49px] flex justify-between items-center px-4 border-b">
          <p className="text-lg font-bold">Profile</p>
          <Button onClick={onClose} size={'iconSm'} variant={'ghost'}>
            <XIcon className="size-5 stroke-[1.5]" />
          </Button>
        </div>
        <div className="flex flex-col gap-y-2 h-full items-center justify-center">
          <AlertTriangle className="size-5 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Profile not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-40px)] mb-1 bg-white">
      <div className="h-[49px] flex justify-between items-center px-4 ">
        <p className="text-lg font-bold">Profile</p>
        <Button onClick={onClose} size={'iconSm'} variant={'ghost'}>
          <XIcon className="size-5 stroke-[1.5]" />
        </Button>
      </div>
      <div className="flex flex-col justify-center py-4 gap-4">
        <Avatar className="max-w-[256px] max-h-[256px] size-full self-center">
          <AvatarImage
            src={member.user.memberPreference.image || member.user.image}
          />
          <AvatarFallback className=" aspect-square text-6xl rounded-md bg-sky-500 text-white"></AvatarFallback>
        </Avatar>
        <div className="flex flex-col px-4 gap-2">
          <div className="flex justify-between">
            <p className="font-bold text-2xl">
              {renderDisplayName(
                member.user.name,
                member.user.memberPreference
              )}
            </p>
            {currentMember?._id === memberId && <>{SettingMember}</>}
          </div>
          {currentMember?._id === memberId && (
            <Button
              variant={'link'}
              className="text-base w-min px-0 font-normal text-sky-700"
            >
              + Add name pronunciation
            </Button>
          )}
          <div>Away</div>
          <div className="flex items-center gap-2">
            <Clock className="size-4" /> {format(new Date(), 'h:mm a')} local
            time
          </div>
        </div>
        <div className="px-4 flex gap-4">
          <Button variant={'outline'} className="flex-1">
            <MessageCircle />
            Message
          </Button>
          <Button variant={'outline'} className="flex-1">
            <Headset />
            Huddle
          </Button>
          <Button variant={'outline'}>
            <EllipsisVertical />
          </Button>
        </div>
        <Separator />
        <div className="flex flex-col p-4">
          <p className="text-sm font-bold mb-4">Contact information</p>
          <div className="flex items-center gap-2">
            <div className="size-9 rounded-md bg-muted flex items-center justify-center">
              <MailIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <p className="text-[13px] font-semibold text-muted-foreground">
                Email Address
              </p>
              <Link
                href={`mailto:${member.user.email}`}
                className="text-sm hover:underline text-[#1264a3]"
              >
                {member.user.email}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
