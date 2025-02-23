/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Doc } from '../../../../convex/_generated/dataModel';
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
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TabsContent } from '@radix-ui/react-tabs';

interface SettingChannelProps {
  channel: Doc<'channels'>;
  trigger: React.ReactNode;
}

const SettingChannelModal = ({ channel, trigger }: SettingChannelProps) => {
  const router = useRouter();
  const channelId = useChannelId();
  const workspaceId = useWorkspaceId();

  const [value, setValue] = useState(channel.name);
  const [ConfirmDialog, confirm] = useConfirm(
    'Delete this channel?',
    'You are about to delete this channel. This action is irreversible'
  );

  const { data: member } = useCurrentMember({ workspaceId });
  const { mutate: updateChannel, isPending: updatingChannel } =
    useUpdateChannel();
  const { mutate: removeChannel, isPending: isRemovingChannel } =
    useRemoveChannel();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase();
    setValue(value);
  }

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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    updateChannel(
      {
        id: channelId,
        name: value,
      },
      {
        onSuccess: () => {
          toast.success('Channel updated');
          setOpenEditName(false);
        },
        onError: () => {
          toast.error('Failed to update channel');
        },
      }
    );
  }

  const { component: EditName, setOpen: setOpenEditName } =
    useSettingChannelItem({
      title: 'Channel name',
      des: `# ${channel.name}`,
      toggleModal: true,
      contentTitle: 'Rename this channel',
      content: (
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
      ),
    });

  const { component: EditTopic, setOpen: setOpenEditTopic } =
    useSettingChannelItem({
      title: 'Topic',
      des: `Add a topic`,
      toggleModal: true,
      contentTitle: 'Edit topic',
      content: (
        <form className="space-y-4" onSubmit={() => {}}>
          <Input
            value={''}
            disabled={false}
            onChange={() => {}}
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
      ),
    });

  const { component: EditDes, setOpen: setOpenEditDes } = useSettingChannelItem(
    {
      title: 'Description',
      des: `This channel is for everything #new-channel. Hold meetings, share docs, and make decisions together with your team.`,
      toggleModal: true,
      contentTitle: 'Edit description',
      content: (
        <form className="space-y-4" onSubmit={() => {}}>
          <Input
            value={`This channel is for everything #new-channel. Hold meetings, share docs, and make decisions together with your team.`}
            disabled={false}
            onChange={() => {}}
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
      ),
    }
  );

  const { component: Created, setOpen: setOpenCreated } = useSettingChannelItem(
    {
      title: 'Created by',
      des: `${format(channel._creationTime, 'MMM d, yyyy')} at ${format(channel._creationTime, 'h:mm:ss a')}`,
      toggleModal: false,
      contentTitle: 'Rename this channel',
      content: (
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
      ),
    }
  );

  return (
    <Dialog>
      <ConfirmDialog />
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="p-0 bg-gray-50 overflow-hidden h-[65vh]">
        <DialogHeader className="p-4 border-b bg-white">
          <DialogTitle className="px-4 text-2xl font-semibold">
            # {channel.name}
          </DialogTitle>
          <Tabs>
            <TabsList className="w-full justify-start sticky top-10 z-50 mb-4 text-slate-700">
              <TabsTrigger
                value={'about'}
                className="data-[state=active]:text-black data-[state=active]:after:bg-[#5E2C5F]"
              >
                <div className="flex items-center gap-0.5">
                  <div>About</div>
                </div>
              </TabsTrigger>
              <TabsTrigger
                value={'members'}
                className="data-[state=active]:text-black data-[state=active]:after:bg-[#5E2C5F]"
              >
                <div className="flex items-center gap-0.5">
                  <div>Members</div>
                </div>
              </TabsTrigger>
            </TabsList>
            <TabsContent value={'about'}>
              <div className="px-4 pb-4 flex flex-col gap-y-6 ">
                <div className="rounded-lg border overflow-hidden">
                  {EditName}
                </div>
                <div className="rounded-lg border overflow-hidden">
                  {EditTopic}
                  <Separator />
                  {EditDes}
                  <Separator />
                  {Created}
                </div>
                {member?.role === 'admin' && (
                  <button
                    onClick={() => {}}
                    disabled={isRemovingChannel}
                    className="flex items-center gap-x-2 px-5 py-4 bg-white rounded-lg cursor-pointer border hover:bg-gray-50 text-rose-600"
                  >
                    <TrashIcon className="size-4" />
                    <p className="text-sm font-semibold"> Delete channel</p>
                  </button>
                )}
              </div>
            </TabsContent>
            <TabsContent value={'members'}>
              <div className="px-4 pb-4 flex flex-col gap-y-6">Members</div>
            </TabsContent>
          </Tabs>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

const useSettingChannelItem = ({
  title,
  des,
  toggleModal,
  content,
  contentTitle,
}: {
  title: string;
  des?: string;
  toggleModal?: boolean;
  content: React.ReactNode;
  contentTitle?: string;
}) => {
  const [open, setOpen] = useState<boolean | undefined>(
    toggleModal ? undefined : false
  );
  const component = (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        if (toggleModal) {
          setOpen(value);
        }
      }}
    >
      <DialogTrigger asChild>
        <div className="flex items-start justify-between px-5 py-4">
          <div>
            <p className="text-base font-semibold">{title}</p>
            <p className="text-base text-muted-foreground">{des}</p>
          </div>
          {toggleModal && (
            <p className="text-sm text-[#1264a3] hover:underline font-semibold cursor-pointer">
              Edit
            </p>
          )}
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{contentTitle}</DialogTitle>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
  return { component, setOpen };
};

export default SettingChannelModal;
