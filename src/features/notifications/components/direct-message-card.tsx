// UI Components

import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, Loader } from 'lucide-react';

// Utils & Helpers

// Hooks & API Calls

// Types

// Notifications

// Store Management
import { useAtom } from 'jotai';
import { directMessageAtom } from '@/store/direct-message.store';

// Dynamic Imports
// const HoverCard = dynamic(
//   () => import('@/components/ui/hover-card').then((mod) => mod.HoverCard),
//   { ssr: false }
// );

const DirectMessageCard = () => {
  const [{ directMessages, isUnread, isLoading }, setDirectMessages] =
    useAtom(directMessageAtom);

  const LoaderComponent = (
    <div className="flex flex-col h-[480px] items-center justify-center">
      <Loader className=" size-5 animate-spin text-[#5E2C5F]" />
    </div>
  );

  const EmptyActivities = (
    <div className="flex flex-col h-[480px] items-center justify-center">
      <CheckCircle className=" size-5 text-[#5E2C5F]" />
    </div>
  );

  return (
    <div className="flex flex-col w-96">
      <div className="flex justify-between items-center p-2">
        <span className="font-semibold">Activity</span>
        <div className="flex items-center space-x-2">
          <Label htmlFor="status-read">Unreads</Label>
          <Switch
            id="dm-read"
            checked={isUnread}
            onCheckedChange={(value) => {
              setDirectMessages((prev) => ({ ...prev, isUnread: value }));
            }}
          />
        </div>
      </div>
      <Separator />
      {isLoading ? (
        LoaderComponent
      ) : (
        <div
          className="max-h-[480px] overflow-auto flex flex-col 
            [&::-webkit-scrollbar]:w-2
            [&::-webkit-scrollbar-track]:rounded-full
          [&::-webkit-scrollbar-track]:bg-gray-100
            [&::-webkit-scrollbar-thumb]:rounded-full
          [&::-webkit-scrollbar-thumb]:bg-gray-300
          dark:[&::-webkit-scrollbar-track]:bg-neutral-700
          dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500"
        >
          {directMessages?.length === 0 && EmptyActivities}
        </div>
      )}
    </div>
  );
};

export default DirectMessageCard;
