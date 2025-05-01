import CustomRenderer from '@/components/custom-renderer';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useGetLaters } from '@/features/later/api/use-get-laters';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { cn } from '@/lib/utils';
import { renderDisplayName } from '@/utils/label';
import { HashIcon, Loader, LockKeyhole } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const laterType: {
  label: string;
  value: 'inprogress' | 'archived' | 'completed';
}[] = [
  {
    label: 'Inprogress',
    value: 'inprogress',
  },
  {
    label: 'Archived',
    value: 'archived',
  },
  {
    label: 'Completed',
    value: 'completed',
  },
];

const LaterSidebar = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [selectedTab, setSelectedTab] = useState<
    'inprogress' | 'archived' | 'completed'
  >('inprogress');

  const {
    results: laters,
    status,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    loadMore,
  } = useGetLaters({ workspaceId, status: selectedTab });

  return (
    <div className="relative">
      <div className="flex justify-between items-center p-2 sticky top-0 h-10 z-50 bg-[#5E2C5F]">
        <span className="font-semibold  text-white">Later</span>
      </div>
      <Tabs defaultValue="inprogress">
        <TabsList className="w-full justify-start sticky top-10 z-50 bg-[#5E2C5F]">
          {laterType.map((type) => {
            return (
              <TabsTrigger
                value={type.value}
                key={type.value}
                onClick={() => setSelectedTab(type.value)}
              >
                <div className="flex items-center gap-0.5">
                  <div>{type.label}</div>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </Tabs>
      {status === 'LoadingFirstPage' ? (
        <LoaderComponent />
      ) : (
        <div className="mt-2">
          {(laters || []).map((later) => {
            return (
              <div
                key={later._id}
                className={cn(
                  'pt-2 pl-2 hover:bg-[#713a72] cursor-pointer text-white'
                )}
                onClick={() => {
                  router.replace(
                    `/workspace/${workspaceId}/later/${later._id}`
                  );
                }}
              >
                <div>
                  {later.channel && (
                    <div className="flex items-center gap-1 text-sm text-slate-300">
                      {later.channel.isPrivate ? (
                        <LockKeyhole className="size-3" />
                      ) : (
                        <HashIcon className="size-3" />
                      )}{' '}
                      {later.channel?.name}
                    </div>
                  )}
                  {later.conversationId && (
                    <div className="flex items-center gap-1 text-sm text-slate-300">
                      Direct message
                    </div>
                  )}
                </div>
                <div className="flex justify-start gap-2 items-start py-1">
                  <Avatar className="size-10 hover:opacity-75 transition rounded-md mt-1 overflow-visible">
                    <AvatarImage
                      className="rounded-md"
                      alt={'image'}
                      src={later.member?.memberPreference?.image || undefined}
                    />
                    <AvatarFallback className="aspect-square rounded-md bg-sky-500"></AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-semibold text-base">
                      {renderDisplayName('', later.member?.memberPreference)}
                    </div>
                    <div>
                      {later.message?.body && (
                        <CustomRenderer
                          value={later.message?.body}
                          textColor="white"
                        />
                      )}
                      {later.message?.files.slice(0, 1).map((file) => {
                        return <div key={file.name}>{file.name}</div>;
                      })}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

const LoaderComponent = () => {
  return (
    <div className="flex flex-col h-[480px] items-center justify-center">
      <Loader className=" size-5 animate-spin text-muted-foreground" />
    </div>
  );
};

export default LaterSidebar;
