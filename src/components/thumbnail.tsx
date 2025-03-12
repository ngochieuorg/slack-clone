import { FileStorage } from '@/app/models';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import Image from 'next/image';

/* eslint-disable @next/next/no-img-element */
interface ThumbnailProps {
  file: FileStorage;
}

const Thumbnail = ({ file }: ThumbnailProps) => {
  if (!file.url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden h-[240px] aspect-square border rounded-lg my-2">
          <Image
            fill
            src={file.url}
            alt="Message image"
            className="rounded object-cover"
            priority
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] border-none bg-transparent p-0 shadow-none">
        <DialogTitle></DialogTitle>
        <img
          src={file.url}
          alt="Message image"
          className="rounded object-cover size-full"
        />
      </DialogContent>
    </Dialog>
  );
};

export default Thumbnail;
