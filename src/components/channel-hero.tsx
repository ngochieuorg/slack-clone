import { format } from 'date-fns';
import { HashIcon, LockKeyholeIcon, PencilIcon, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Doc, Id } from '../../convex/_generated/dataModel';
import { useGetMember } from '@/features/members/api/use-get-member';
import { renderDisplayName } from '@/utils/label';
import UserDetailCard from './user-detail-card';
import useAddPeopleToChannel from '@/features/channels/hooks/add-people-to-channel';
import { GetChannelReturnType } from '@/features/channels/api/use-get-channel';

interface ChannelHeroProps {
  channel?: Doc<'channels'>;
}

const ChannelHero = ({ channel }: ChannelHeroProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const { data: memberCreated } = useGetMember({
    id: channel?.createdBy as Id<'members'>,
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { component: AddPeople, setOpen: setOpenAddPeople } =
    useAddPeopleToChannel({
      channelName: channel?.name,
      channel: channel as GetChannelReturnType,
      trigger: (
        <Button variant={'outline'} className="py-1 h-min border-gray-400">
          <UserPlus />
          Add people to channel
        </Button>
      ),
    });

  return (
    <div className="mt-[88px] mx-5 mb-4">
      <div className="text-4xl font-bold flex items-center mb-2 gap-2">
        {channel?.isPrivate ? (
          <LockKeyholeIcon className="size-8" />
        ) : (
          <HashIcon className="size-8" />
        )}{' '}
        {channel?.name}
      </div>
      <p className="font-normal text-slate-800 mb-4">
        {currentMember?._id === channel?.createdBy ? (
          'You'
        ) : (
          <UserDetailCard
            trigger={
              <span className="text-[#1264a3] bg-[#d5e3ee] py-0.5 cursor-pointer">
                {renderDisplayName(
                  memberCreated?.user.name,
                  memberCreated?.user.memberPreference
                )}
              </span>
            }
            memberId={memberCreated?._id as Id<'members'>}
          />
        )}{' '}
        created this channel{' '}
        {format(channel?._creationTime as number, 'MMMM do, yyyy')}. This is the
        very beginning of <strong> {channel?.name}</strong> channel
      </p>
      <div className="flex items-center gap-4">
        <Button variant={'outline'} className="py-1 h-min border-gray-400">
          <PencilIcon />
          Add description
        </Button>
        {AddPeople}
      </div>
    </div>
  );
};

export default ChannelHero;
