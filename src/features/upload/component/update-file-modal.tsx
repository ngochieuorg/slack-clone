import { FileStorage } from '@/app/models';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { useUpdateFile } from '../api/use-update-file';
import { toast } from 'sonner';

interface UpdateFileModalProps {
  children: React.ReactNode;
  file?: FileStorage;
}

const UpdateFileModal = ({ children, file }: UpdateFileModalProps) => {
  const [open, setOpen] = useState<boolean | undefined>(false);
  const [name, setName] = useState(file?.name);
  const [description, setDescription] = useState(
    'Consider the information in the image, and convey it as concisely as possible.'
  );

  const { mutate: updateFile } = useUpdateFile();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (file?.fileId) {
      updateFile(
        {
          fileId: file?.fileId,
          name: name || '',
        },
        {
          onSuccess: () => {
            toast.success('Update');
            setOpen(false);
          },
        }
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        setOpen((prev) => !prev);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>File details</DialogTitle>
        </DialogHeader>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="font-semibold text-sm">File name</label>
            <Input
              value={name}
              disabled={false}
              onChange={(e) => setName(e.target.value)}
              required
              autoFocus
              minLength={1}
              maxLength={80}
              placeholder="e.g Plan budget"
            />
          </div>
          <div>
            <label className="font-semibold text-sm">Description</label>
            <DialogDescription className="text-sm text-slate-600 mt-0!">
              A description (or alt text) helps people who cannot see or parse
              this image understand what you’re sharing. Consider the
              information in the image, and convey it as concisely as possible.
            </DialogDescription>
            <Textarea
              value={description}
              disabled={false}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              maxLength={80}
              placeholder="e.g Plan budget"
            />
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button variant={'outline'} disabled={false}>
                Cancel
              </Button>
            </DialogClose>
            <Button disabled={false} type="submit" className="bg-emerald-800">
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateFileModal;
