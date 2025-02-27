import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { ChevronRight, HashIcon, LockKeyhole } from 'lucide-react';
import { FaChevronDown } from 'react-icons/fa';
import { EllipsisVertical } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card';
import SettingChannelModal from '@/features/channels/components/setting-chanel-modal';
import { GetChannelReturnType } from '@/features/channels/api/use-get-channel';
import dynamic from 'next/dynamic';
import { renderDisplayName } from '@/app/utils/label';

const HoverCard = dynamic(
  () => import('@/components/ui/hover-card').then((mod) => mod.HoverCard),
  { ssr: false }
);

interface HeaderProps {
  channel: GetChannelReturnType;
}

const Header = ({ channel }: HeaderProps) => {
  return (
    <div className="bg-white border-b h-[48px] flex items-center px-4 overflow-hidden">
      <div className=" w-full flex justify-between items-center">
        <SettingChannelModal
          channel={channel}
          defaultTab="about"
          trigger={
            <Button
              variant={'ghost'}
              className="text-lg font-semibold px-2 overflow-hidden w-auto "
              size={'sm'}
            >
              <HoverCard>
                <HoverCardTrigger asChild>
                  <div className="flex items-center">
                    <span className="truncate flex items-center gap-1">
                      {channel?.isPrivate ? <LockKeyhole /> : <HashIcon />}{' '}
                      {channel?.name}
                    </span>
                    <FaChevronDown className="size-2.5 ml-2" />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="bg-zinc-900 p-3">
                  <p className="text-white text-sm">Get channel details</p>
                </HoverCardContent>
              </HoverCard>
            </Button>
          }
        />
        <div className="flex justify-end">
          <Dialog>
            <SettingChannelModal
              channel={channel}
              defaultTab="members"
              trigger={
                <Button variant={'outline'} className="h-8 px-1">
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="flex items-center gap-2">
                        <div className="flex -space-x-1">
                          {channel?.users.slice(0, 3).map((user, index) => {
                            return (
                              <div
                                key={user?._id}
                                className={`p-0.5 rounded-md bg-white z-${index * 10}`}
                              >
                                <Avatar className="size-5">
                                  <AvatarImage
                                    src={
                                      user?.user?.memberPreference.image ||
                                      user?.user?.image
                                    }
                                  />
                                  <AvatarFallback className="rounded-md bg-sky-500 text-white flex justify-center items-center text-xs font-light"></AvatarFallback>
                                </Avatar>
                              </div>
                            );
                          })}
                        </div>
                        <span className=" font-normal mr-1">
                          {channel?.users.length}
                        </span>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent className=" bg-zinc-900 text-center font-semibold text-sm ">
                      <p className="text-white ">
                        View all member of this channel
                      </p>
                      <p className="text-slate-400">
                        Includes{' '}
                        {channel?.users
                          .slice(0, 3)
                          .map((user) => (
                            <span key={user?._id}>
                              {' '}
                              {renderDisplayName(
                                user?.user?.name,
                                user?.user?.memberPreference
                              )}
                              ,
                            </span>
                          ))}
                      </p>
                    </HoverCardContent>
                  </HoverCard>
                </Button>
              }
            />
          </Dialog>
          <Popover>
            <PopoverTrigger asChild>
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
                  <HoverCardTrigger asChild>
                    <div className="flex justify-between items-center">
                      <span>Copy</span>
                      <ChevronRight className="size-4" />
                    </div>
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
