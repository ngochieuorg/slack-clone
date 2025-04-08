import React, { useState, useEffect } from 'react';
// Import necessary components and hooks
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
import { Id } from '../../../../convex/_generated/dataModel';
import { useCurrentMember } from '../api/use-current-member';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateMemberPreferences } from '../api/use-update-member-preferences';
import useConfirm from '@/hooks/use-confirm';
import { useGenerateUploadUrl } from '@/features/upload/api/use-generate-upload-url';
import { useUpdateMemberAvatar } from '../api/use-update-member-avatar';
import { useAtom } from 'jotai';
import { preferencesAtom } from '@/store/preferences.store';

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
  const { data: currentUser } = useCurrentUser({ workspaceId });
  const { data: currentMember } = useCurrentMember({ workspaceId });

  const [{ preferences: memberPreferences }] = useAtom(preferencesAtom);
  const {
    mutate: updateMemberPreferences,
    isPending: isUpdatingMemberPreferences,
  } = useUpdateMemberPreferences();
  const { mutate: generateUploadUrl } = useGenerateUploadUrl();
  const { mutate: updateMemberAvatar } = useUpdateMemberAvatar();

  const [open, setOpen] = useState<boolean | undefined>(false);
  const [selectedImage, setSelectedImage] = useState<File | string | null>(
    null
  );

  const [ConfirmUploadAvatar, confirmUploadAvatar] = useConfirm(
    'Are you sure want to use this image as avatar?',
    <Avatar className="w-full h-auto p-5 ">
      <AvatarImage
        src={
          selectedImage
            ? typeof selectedImage === 'string'
              ? selectedImage
              : URL.createObjectURL(selectedImage)
            : currentUser?.image
        }
        alt="img"
      />
    </Avatar>
  );

  const [ConfirmRemoveAvatar, confirmRemoveAvatar] = useConfirm(
    'Remove profile photo',
    <>
      <Avatar className="w-1/2 h-auto p-5 mx-auto">
        {!!memberPreferences?.image && (
          <AvatarImage src={memberPreferences?.image} alt="img" />
        )}
      </Avatar>
      <span className=" text-center">
        Are you sure you want to remove your photo? We’ll replace it with a
        default Slack avatar.
      </span>
    </>
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (memberPreferences) {
      reset({
        fullName: memberPreferences.fullName,
        displayName: memberPreferences.displayName,
        title: memberPreferences.title,
        pronunciation: memberPreferences.pronunciation,
        timeZone: memberPreferences.timeZone,
      });
      setSelectedImage(memberPreferences.image || null);
    }
  }, [memberPreferences, reset]);

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

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    let image;
    if (event.target.files && event.target.files[0]) {
      setSelectedImage(event.target.files[0]);
      image = event.target.files[0];
    }

    const ok = await confirmUploadAvatar();
    if (!ok) return;

    if (image) {
      const url = await generateUploadUrl({}, { throwError: true });

      const result = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': image.type },
        body: image,
      });

      if (!result) {
        throw new Error('Failed to upload image');
      }

      const { storageId } = await result.json();

      await updateMemberAvatar(
        {
          memberId: currentMember?._id as Id<'members'>,
          image: storageId,
        },
        {}
      );
    }
  };

  const handleRemoveAvatar = async () => {
    const ok = await confirmRemoveAvatar();
    if (!ok) return;

    await updateMemberAvatar(
      {
        memberId: currentMember?._id as Id<'members'>,
        isRemove: true,
      },
      {}
    );
  };

  const component = (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <ConfirmUploadAvatar />
      <ConfirmRemoveAvatar />
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
                  {!!memberPreferences?.image && (
                    <AvatarImage src={memberPreferences?.image} alt="img" />
                  )}
                  <AvatarFallback className="aspect-square text-6xl rounded-md bg-slate-300 text-white"></AvatarFallback>
                </Avatar>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: 'none' }}
                  id="upload-photo"
                />
                <Button
                  variant={'outline'}
                  type="button"
                  onClick={() =>
                    document.getElementById('upload-photo')?.click()
                  }
                >
                  Upload Photo
                </Button>
                <Button
                  variant={'link'}
                  className="h-min py-0 font-normal text-sky-700"
                  type="button"
                  onClick={() => handleRemoveAvatar()}
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
