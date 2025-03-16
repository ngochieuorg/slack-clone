import { FileStorage } from '@/models';
import Image from 'next/image';

interface ThumbnailProps {
  file: FileStorage;
}

const Thumbnail = ({ file }: ThumbnailProps) => {
  if (!file.url) return null;

  return (
    <div className="relative overflow-hidden h-[240px] aspect-square border rounded-lg my-2">
      <Image
        fill
        src={file.url}
        alt="Message image"
        className="rounded object-cover"
        priority
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};

export default Thumbnail;
