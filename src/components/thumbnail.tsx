import { Dialog, DialogContent, DialogTitle, DialogTrigger } from "./ui/dialog";

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
          <img
            src={url}
            alt="Message image"
            className="rounded object-cover size-full"
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
