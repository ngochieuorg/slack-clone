import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Doc } from '../../../../../../convex/_generated/dataModel';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { TrashIcon } from 'lucide-react';
import { useChannelId } from '@/hooks/use-channel-id';
import { useUpdateChannel } from '@/features/channels/api/use-update-channel';
import { useState } from 'react';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { toast } from 'sonner';
import { useRemoveChannel } from '@/features/channels/api/use-remove-channel';
import { useRouter } from 'next/navigation';
import useConfirm from '@/hooks/use-confirm';

interface SettingChannelProps {
  channel: Doc<'channels'>;
}

const SettingChannel = ({ channel }: SettingChannelProps) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const [value, setValue] = useState(channel.name);
  const [editOpen, setEditOpen] = useState(false);
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete this channel?',
    'You are about to delete this channel. This action is irreversible'
  );

  const { data: member } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: updatingChannel } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel();

  const handleEditOpen = (value: boolean) => {
    if (member?.role !== 'admin') return;
    setEditOpen(value);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase();
    setValue(value);
  };

  const handleDelete = async () => {
    const ok = await confirm();

    if (!ok) return;

    removeChannel(
      { id: channelId },
      {
        onSuccess: () => {
          toast.success('Channel Deleted');
          router.push(`/workspace/${workspaceId}`);
        },
        onError: () => {
          toast.error('Failed to delete channel');
        },
      }
    );
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    updateChannel(
      {
        id: channelId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success('Channel updated');
          setEditOpen(false);
        },
        onError: () => {
          toast.error('Failed to update channel');
        },
      }
    );
  };
  return (
    <>
      <ConfirmDialog />
      <DialogContent className="p-0 bg-gray-50 overflow-hidden">
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle className="px-4 text-2xl font-semibold">
            # {channel.name}
          </DialogTitle>
          <div className="px-4 pb-4 flex flex-col gap-y-2">
            <Dialog open={editOpen} onOpenChange={handleEditOpen}>
              <DialogTrigger asChild>
                <div className="px-5 py-4 bg-white rounded-lg border cursor-pointer hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">Channel name</p>
                    <p className="text-sm text-[#1264a3] hover:underline font-semibold">
                      Edit
                    </p>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Rename this channel</DialogTitle>
                </DialogHeader>
                <form className="space-y-4" onSubmit={handleSubmit}>
                  <Input
                    value={value}
                    disabled={updatingChannel}
                    onChange={handleChange}
                    required
                    autoFocus
                    minLength={3}
                    maxLength={80}
                    placeholder="e.g Plan budget"
                  />
                  <DialogFooter>
                    <DialogClose asChild>
                      <Button variant={'outline'} disabled={updatingChannel}>
                        Cancel
                      </Button>
                    </DialogClose>
                    <Button disabled={updatingChannel}>Save</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
            {member?.role === 'admin' && (
              <button
                onClick={handleDelete}
                disabled={isRemovingChannel}
                className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
              >
                <TrashIcon className="size-4" />
                <p className="text-sm font-semibold"> Delete channel</p>
              </button>
            )}
          </div>
        </DialogHeader>
      </DialogContent>
    </>
  );
};

export default SettingChannel;
