import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { ChevronRight } from 'lucide-react';
import { FaChevronDown } from 'react-icons/fa';
import { EllipsisVertical } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@/components/ui/hover-card';
import { Doc } from '../../../../../../convex/_generated/dataModel';
import SettingChannelModal from '@/features/channels/components/setting-chanel-modal';

interface HeaderProps {
  channel: Doc<'channels'>;
}

const Header = ({ channel }: HeaderProps) => {
  return (
    <div className="bg-white border-b h-[48px] flex items-center px-4 overflow-hidden">
      <div className=" w-full flex justify-between items-center">
        <SettingChannelModal
          channel={channel}
          trigger={
            <Button
              variant={'ghost'}
              className="text-lg font-semibold px-2 overflow-hidden w-auto"
              size={'sm'}
            >
              <span className="truncate"># {channel.name}</span>
              <FaChevronDown className="size-2.5 ml-2" />
            </Button>
          }
        />
        <div className="flex justify-end">
          <Dialog>
            <SettingChannelModal
              channel={channel}
              trigger={
                <Button variant={'outline'} className="h-8">
                  Member
                </Button>
              }
            />
          </Dialog>
          <Popover>
            <PopoverTrigger>
              <Button variant={'ghost'} className="h-8 py-0">
                <EllipsisVertical />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="py-2 px-0">
              <MoreActionButton>Open channel details</MoreActionButton>
              <Separator />
              <MoreActionButton>Edit notifications</MoreActionButton>
              <MoreActionButton>Star channel</MoreActionButton>
              <Separator />
              <MoreActionButton>Add a workflow</MoreActionButton>
              <MoreActionButton>Edit settings</MoreActionButton>
              <Separator />
              <MoreActionButton>
                <HoverCard>
                  <HoverCardTrigger className="flex justify-between items-center">
                    <span>Copy</span>
                    <ChevronRight className="size-4" />
                  </HoverCardTrigger>
                  <HoverCardContent className="py-2 px-0" side="left">
                    <MoreActionButton>Copy name</MoreActionButton>
                    <MoreActionButton>Copy link</MoreActionButton>
                  </HoverCardContent>
                </HoverCard>
              </MoreActionButton>
              <MoreActionButton>Search in channel</MoreActionButton>
              <MoreActionButton>Open in new window</MoreActionButton>
              <Separator />
              <MoreActionButton>Leave channel</MoreActionButton>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
};

const MoreActionButton = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="py-2 px-5 text-base hover:bg-sky-800 hover:text-white cursor-pointer">
      {children}
    </div>
  );
};

export default Header;
