import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useCurrentUser } from '@/features/auth/api/use-current-user';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface UseAddPeopleToChannelProps {
  trigger: React.ReactNode;
  channelName?: string;
}

const useSettingMembers = ({ trigger }: UseAddPeopleToChannelProps) => {
  const { data: currentUser } = useCurrentUser();

  const [name, setName] = useState('');

  const [open, setOpen] = useState<boolean | undefined>(false);

  const component = (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className=" flex flex-col min-h-[70vh] max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit your profile </DialogTitle>
          <form className="flex flex-col gap-4 py-6">
            <div className="flex gap-4">
              <div className="flex flex-col gap-4 flex-1">
                <div>
                  <label className="font-semibold text-sm">Full name</label>
                  <div>
                    <Input
                      value={name}
                      disabled={false}
                      onChange={(e) => setName(e.target.value)}
                      required
                      autoFocus
                      minLength={3}
                      maxLength={80}
                      placeholder="# e.g plan budget"
                    />
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-sm">Display name</label>
                  <div>
                    <Input
                      value={name}
                      disabled={false}
                      onChange={() => {}}
                      required
                      autoFocus
                      minLength={3}
                      maxLength={80}
                      placeholder="Name in here"
                    />
                    <span className="text-sm text-slate-600">
                      This could be your first name, or a nickname — however
                      you’d like people to refer to you in Slack.
                    </span>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-sm">Title</label>
                  <div>
                    <Input
                      value={name}
                      disabled={false}
                      onChange={() => {}}
                      required
                      autoFocus
                      minLength={3}
                      maxLength={80}
                      placeholder="Title"
                    />
                    <span className="text-sm text-slate-600">
                      Let people know what you do at CodingLearn.
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-[200px] flex flex-col gap-4">
                <label className="font-semibold text-sm">Profile photo</label>
                <Avatar className="max-w-[200px] max-h-[200px] size-full self-center -top-3">
                  <AvatarImage src={currentUser?.image} />
                  <AvatarFallback className=" aspect-square text-6xl rounded-md bg-sky-500 text-white">
                    {currentUser?.name?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <Button variant={'outline'}>Upload Photo</Button>
                <Button
                  variant={'link'}
                  className="h-min py-0 font-normal text-sky-700"
                >
                  Remove Photo
                </Button>
              </div>
            </div>
            <div>
              <label className="font-semibold text-sm">
                Name pronunciation
              </label>
              <div>
                <Input
                  value={name}
                  disabled={false}
                  onChange={() => {}}
                  required
                  autoFocus
                  minLength={3}
                  maxLength={80}
                  placeholder="Name in here"
                />
                <span className="text-sm text-slate-600">
                  This could be a phonetic pronunciation, or an example of
                  something your name sounds like.
                </span>
              </div>
            </div>
            <div>
              <label className="font-semibold text-sm">Time zone</label>
              <div>
                <Input
                  value={name}
                  disabled={false}
                  onChange={() => {}}
                  required
                  autoFocus
                  minLength={3}
                  maxLength={80}
                  placeholder="Name in here"
                />
                <span className="text-sm text-slate-600">
                  Your current time zone. Used to send summary and notification
                  emails, for times in your activity feeds, and for reminders.
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button variant={'outline'} type="submit">
                Cancel
              </Button>
              <Button
                variant={'default'}
                type="submit"
                className="bg-emerald-800"
              >
                Save Changes
              </Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
  return { component, setOpen };
};

export default useSettingMembers;
