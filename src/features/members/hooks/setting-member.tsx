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
import { useGetMemberPreferences } from '../api/use-get-member-preferences';
import { Id } from '../../../../convex/_generated/dataModel';
import { useCurrentMember } from '../api/use-current-member';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateMemberPreferences } from '../api/use-update-member-preferences';

interface UseAddPeopleToChannelProps {
  trigger: React.ReactNode;
  channelName?: string;
}

const schema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .max(80),
  displayName: z
    .string()
    .min(3, 'Display name must be at least 3 characters')
    .max(80),
  title: z.string().min(3, 'Title must be at least 3 characters').max(80),
  pronunciation: z
    .string()
    .min(3, 'Pronunciation must be at least 3 characters')
    .max(80),
  timeZone: z
    .string()
    .min(3, 'Time zone must be at least 3 characters')
    .max(80),
});

type FormData = z.infer<typeof schema>;

const useSettingMembers = ({ trigger }: UseAddPeopleToChannelProps) => {
  const workspaceId = useWorkspaceId();
  const { data: currentUser } = useCurrentUser();
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const { data: memberPreferences } = useGetMemberPreferences({
    memberId: currentMember?._id as Id<'members'>,
  });
  const {
    mutate: updateMemberPreferences,
    isPending: isUpdatingMemberPreferences,
  } = useUpdateMemberPreferences();

  const [open, setOpen] = useState<boolean | undefined>(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      fullName: memberPreferences?.fullName,
      displayName: memberPreferences?.displayName,
      title: memberPreferences?.title,
      pronunciation: memberPreferences?.pronunciation,
      timeZone: memberPreferences?.timeZone,
    },
  });

  const onSubmit: SubmitHandler<FormData> = (data) => {
    updateMemberPreferences(
      { ...data, memberId: currentMember?._id as Id<'members'> },
      {
        onSuccess: () => {
          setOpen(false);
        },
      }
    );
  };

  const component = (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex flex-col min-h-[70vh] max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit your profile </DialogTitle>
          <form
            className="flex flex-col gap-4 py-6"
            onSubmit={handleSubmit(onSubmit)}
          >
            <div className="flex gap-4">
              <div className="flex flex-col gap-4 flex-1">
                <div>
                  <label className="font-semibold text-sm">Full name</label>
                  <div>
                    <Input
                      {...register('fullName')}
                      placeholder="# e.g plan budget"
                    />
                    {errors.fullName && <span>{errors.fullName.message}</span>}
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-sm">Display name</label>
                  <div>
                    <Input
                      {...register('displayName')}
                      placeholder="Name in here"
                    />
                    {errors.displayName && (
                      <span>{errors.displayName.message}</span>
                    )}
                    <span className="text-sm text-slate-600">
                      This could be your first name, or a nickname — however
                      you’d like people to refer to you in Slack.
                    </span>
                  </div>
                </div>
                <div>
                  <label className="font-semibold text-sm">Title</label>
                  <div>
                    <Input {...register('title')} placeholder="Title" />
                    {errors.title && <span>{errors.title.message}</span>}
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
                  <AvatarFallback className="aspect-square text-6xl rounded-md bg-sky-500 text-white">
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
                  {...register('pronunciation')}
                  placeholder="Name in here"
                />
                {errors.pronunciation && (
                  <span>{errors.pronunciation.message}</span>
                )}
                <span className="text-sm text-slate-600">
                  This could be a phonetic pronunciation, or an example of
                  something your name sounds like.
                </span>
              </div>
            </div>
            <div>
              <label className="font-semibold text-sm">Time zone</label>
              <div>
                <Input {...register('timeZone')} placeholder="Name in here" />
                {errors.timeZone && <span>{errors.timeZone.message}</span>}
                <span className="text-sm text-slate-600">
                  Your current time zone. Used to send summary and notification
                  emails, for times in your activity feeds, and for reminders.
                </span>
              </div>
            </div>
            <div className="flex justify-end gap-4">
              <Button
                variant={'outline'}
                type="button"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant={'default'}
                type="submit"
                className="bg-emerald-800"
                disabled={isUpdatingMemberPreferences}
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
