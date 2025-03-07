import { Dialog, DialogContent, DialogTitle, DialogTrigger } from './ui/dialog';
import Image from 'next/image';

/* eslint-disable @next/next/no-img-element */
interface ThumbnailProps {
  url: string | null | undefined;
}

const Thumbnail = ({ url }: ThumbnailProps) => {
  if (!url) return null;

  return (
    <Dialog>
      <DialogTrigger>
        <div className="relative overflow-hidden max-w-[360px] border rounded-lg my-2 cursor-zoom-in">
          <Image
            width={360}
            height={300}
            src={url}
            alt="Message image"
            className="rounded object-cover"
            priority
          />
        </div>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] border-none bg-transparent p-0 shadow-none">
        <DialogTitle></DialogTitle>
        <img
          src={url}
          alt="Message image"
          className="rounded object-cover size-full"
        />
      </DialogContent>
    </Dialog>
  );
};

export default Thumbnail;
