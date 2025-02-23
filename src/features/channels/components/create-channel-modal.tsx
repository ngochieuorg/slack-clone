import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useCreateChannelModal } from '../store/use-create-channel-modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateChannel } from '../api/use-create-channel';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useGetWorkspace } from '@/features/workspaces/api/use-get-workspace';
import { HashIcon, LockKeyholeIcon } from 'lucide-react';

const CreateChannelModal = () => {
  const router = useRouter();

  const workspaceId = useWorkspaceId();

  const { mutate, isPending } = useCreateChannel();
  const [open, setOpen] = useCreateChannelModal();
  const { data: currentWorkspace } = useGetWorkspace({ id: workspaceId });

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [isPrivate, setIsPrivate] = useState(false);

  const handleClose = () => {
    setName('');
    setOpen(false);
    setStep(1);
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s+/g, '-').toLowerCase();
    setName(value);
  };

  const handleNextStep = () => {
    if (!name.trim()) {
      toast.error('Channel name is required');
      return;
    }
    setStep(2);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(
      { name, workspaceId, isPrivate },
      {
        onSuccess: (id) => {
          toast.success('Channel created');
          router.push(`/workspace/${workspaceId}/channel/${id}`);
          handleClose();
        },
        onError: () => {
          toast.error('Failed to create a channel');
        },
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Create a channel
          </DialogTitle>
          {step === 2 && (
            <span className="text-sm flex items-center">
              <div className="w-3">
                {isPrivate ? (
                  <LockKeyholeIcon className="size-3" />
                ) : (
                  <HashIcon className="size-3" />
                )}
              </div>

              {name}
            </span>
          )}
        </DialogHeader>
        <form className="space-y-1" onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <label className="font-semibold text-sm">Name</label>
              <div>
                <Input
                  value={name}
                  disabled={isPending}
                  onChange={handleChange}
                  required
                  autoFocus
                  minLength={3}
                  maxLength={80}
                  placeholder="# e.g plan budget"
                />
                <span className="text-sm text-slate-600">
                  Channels are where conversations happen around a topic. Use a
                  name that is easy to find and understand.
                </span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-muted-foreground ">Step {step} of 2</span>
                <Button
                  className="bg-emerald-700"
                  type="button"
                  onClick={handleNextStep}
                  disabled={!name.trim()}
                >
                  Next
                </Button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <label className="font-semibold text-sm">Visibility</label>
              <div className="flex items-center space-x-2">
                <input
                  type="radio"
                  id="public"
                  name="privacy"
                  value="false"
                  checked={!isPrivate}
                  onChange={() => setIsPrivate(false)}
                />
                <label htmlFor="public">
                  Public - anyone in{' '}
                  <span className="font-semibold">
                    {currentWorkspace?.name}
                  </span>
                </label>
              </div>
              <div className="flex items-start space-x-2">
                <input
                  className="mt-2"
                  type="radio"
                  id="private"
                  name="privacy"
                  value="true"
                  checked={isPrivate}
                  onChange={() => setIsPrivate(true)}
                />
                <label htmlFor="private">
                  Private - only specific people
                  <br />
                  <span className="text-slate-700 text-sm">
                    Can only be view or joined by invitation
                  </span>
                </label>
              </div>

              <div className="flex justify-end gap-4 items-center">
                <span className="text-muted-foreground text-sm mr-auto">
                  Step {step} of 2
                </span>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                >
                  Back
                </Button>
                <Button
                  className="bg-emerald-700"
                  type="submit"
                  disabled={isPending}
                >
                  Create
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;
