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

import { useGetMembers } from '@/features/members/api/use-get-members';
import { GetChannelReturnType } from '../api/use-get-channel';

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

  const [open, setOpen] = useState<boolean | undefined>(false);

  const component = (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="min-h-[50vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Add people to # {channelName}</DialogTitle>
          <DialogDescription className=" text-sm font-extralight">
            You can also add email addresses of people who aren’t members of{' '}
            <span className="font-medium">{workspace?.name}</span>
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end mt-auto">
          <Button variant={'default'}>Add</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
  return { component, setOpen };
};

export default useAddPeopleToChannel;
