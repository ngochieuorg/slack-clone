import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

import { useGetMembers } from '@/features/members/api/use-get-members';
import { GetChannelReturnType } from '../api/use-get-channel';
import MultiSelect from '@/components/multi-select';
import { cn } from '@/lib/utils';
import { useAddMember } from '../api/use-add-member';
import { Id } from '../../../../convex/_generated/dataModel';
import { toast } from 'sonner';
import { renderDisplayName } from '@/utils/label';

interface UseAddPeopleToChannelProps {
  trigger: React.ReactNode;
  channelName?: string;
  channel: GetChannelReturnType;
}

const useAddPeopleToChannel = ({
  trigger,
  channelName,
  channel,
}: UseAddPeopleToChannelProps) => {
  const workspaceId = useWorkspaceId();
  const { data: workspace } = useGetWorkspace({ id: workspaceId });
  const { data: members } = useGetMembers({ workspaceId });

  const { mutate: addMember, isPending: isAdding } = useAddMember();

  const [open, setOpen] = useState<boolean | undefined>(false);
  const [selects, setSelected] = useState<string[]>([]);

  const onSubmit = () => {
    if (selects.length)
      addMember(
        {
          memberIds: selects as Id<'members'>[],
          channelId: channel?._id as Id<'channels'>,
        },
        {
          onSuccess: () => {
            setOpen(false);
            setSelected([]);
            toast.error('Added!');
          },
        }
      );
  };

  const component = (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className=" flex flex-col">
        <DialogHeader>
          <DialogTitle>Add people to # {channelName}</DialogTitle>
          <DialogDescription className=" text-sm font-extralight">
            You can also add email addresses of people who aren&apos;t members
            of <span className="font-medium">{workspace?.name}</span>
          </DialogDescription>
        </DialogHeader>
        <MultiSelect
          options={(members || []).map((mem) => {
            const avatarFallback = mem.user.name?.charAt(0).toUpperCase();
            const isAlreadyInChannel = channel?.users.find(
              (user) => user?.memberId === mem._id
            )
              ? true
              : false;
            return {
              value: mem._id,
              label: renderDisplayName(
                mem.user.name,
                mem.user.memberPreference
              ),
              disabled: isAlreadyInChannel,
              component: (
                <div
                  key={mem._id}
                  className={cn('flex items-center gap-2 py-1')}
                >
                  <Avatar className="size-5 hover:opacity-75 transition">
                    <AvatarImage alt={'image'} src={mem.user.image} />
                    <AvatarFallback className="aspect-square rounded-md bg-sky-500 text-white flex justify-center items-center">
                      {avatarFallback}
                    </AvatarFallback>
                  </Avatar>
                  <span className="font-semibold">
                    {renderDisplayName(
                      mem.user.name,
                      mem.user.memberPreference
                    )}
                  </span>
                  {isAlreadyInChannel && (
                    <span className="text-muted-foreground text-xs ml-auto">
                      Already in this channel
                    </span>
                  )}
                </div>
              ),
            };
          })}
          selectedOptions={selects}
          onChange={(selects) => {
            setSelected(selects);
          }}
          placeHolder="Enter name or email"
        />
        <div className="flex justify-end mt-auto">
          <Button variant={'default'} disabled={isAdding} onClick={onSubmit}>
            Add
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
  return { component, setOpen };
};

export default useAddPeopleToChannel;
