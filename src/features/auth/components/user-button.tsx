import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useCurrentUser } from '../api/use-current-user';
import { Loader } from 'lucide-react';
import { useAuthActions } from '@convex-dev/auth/react';
import { Separator } from '@/components/ui/separator';
import { usePanel } from '@/hooks/use-panel';
import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

const UserButton = () => {
  const { signOut } = useAuthActions();
  const workspaceId = useWorkspaceId();
  const { data, isLoading } = useCurrentUser();
  const { data: currentMember } = useCurrentMember({ workspaceId });
  const { onOpenProfileMember } = usePanel();

  if (isLoading) {
    return <Loader className="size-4 animate-spin text-muted-foreground" />;
  }

  if (!data) {
    return null;
  }

  const { image, name } = data;

  const avatarFallback = name!.charAt(0).toUpperCase();

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger className="outline-none relative">
        <Avatar className="size-10 hover:opacity-75 transition">
          <AvatarImage alt={name} src={image} />
          <AvatarFallback className="rounded-md bg-sky-500 text-white">
            {avatarFallback}
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        side="right"
        className="w-80 px-0 py-4"
      >
        <div onClick={() => {}} className="h-10 px-4">
          <div className="flex gap-3">
            <Avatar className="size-8 hover:opacity-75 transition">
              <AvatarImage alt={'image'} src={image} />
              <AvatarFallback className="aspect-square rounded-md bg-sky-500 text-white flex justify-center items-center">
                {avatarFallback}
              </AvatarFallback>
            </Avatar>
            <span className="font-semibold">{name}</span>
          </div>
        </div>
        <UserButtonItem onClick={() => {}}>
          <p>
            Set yourself as <span className="font-semibold">away</span>
          </p>
        </UserButtonItem>
        <UserButtonItem onClick={() => {}}>Pause notification</UserButtonItem>
        <Separator />
        <UserButtonItem
          onClick={() => {
            if (currentMember?._id) onOpenProfileMember(currentMember?._id);
          }}
        >
          Profile
        </UserButtonItem>
        <UserButtonItem onClick={() => {}}>Preferences</UserButtonItem>
        <Separator />
        <UserButtonItem onClick={() => {}}>Upgrade</UserButtonItem>
        <UserButtonItem onClick={() => signOut()}>Sign out</UserButtonItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const UserButtonItem = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <div
      className="h-8 px-6 hover:bg-sky-800 hover:text-white flex items-center cursor-pointer"
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default UserButton;
