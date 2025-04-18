'use client';

import { useGetNotifications } from '@/features/notifications/api/use-get-notifications';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { differenceInSeconds } from 'date-fns';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Id } from '../../convex/_generated/dataModel';
import { convertJsonToString, renderDisplayName } from '@/utils/label';
import { useCurrentMember } from '@/features/members/api/use-current-member';

const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    }
  } else {
    console.log('Browser does not support notifications.');
  }
};

function BrowserNotificationContent({
  workspaceId,
}: {
  workspaceId: Id<'workspaces'>;
}) {
  const router = useRouter();

  const { data: notifications, isLoading } = useGetNotifications({
    workspaceId,
  });

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleNotification = () => {
    notifications?.forEach((noti) => {
      const isReactNotification = noti.type === 'reaction';

      if (
        Math.abs(differenceInSeconds(noti._creationTime, new Date())) < 2 &&
        !isReactNotification
      ) {
        const body = convertJsonToString(noti.content);

        if (Notification.permission === 'granted') {
          let title = '';
          if (noti.type === 'reply') {
            title = `Thread in ${
              noti.channel?.name ? `# ${noti.channel?.name}` : 'direct message'
            }
              `;
          } else if (noti.type === 'mention') {
            title = `${noti.sender?.name} mention you in ${
              noti.channel?.name ? `# ${noti.channel?.name}` : 'a message'
            }`;
          }
          const notification = new Notification(title, {
            body: `${renderDisplayName(noti.sender?.name, noti.sender?.memberPreference)}: ${body}`,
          });

          notification.onclick = () => {
            router.replace('/');
          };
        }
      }
    });
  };

  useEffect(() => {
    if (!isLoading) {
      handleNotification();
    }

    return () => {
      return;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, notifications]);

  return <></>;
}

export default function BrowserNotification() {
  const workspaceId = useWorkspaceId();

  const { data: currentMember } = useCurrentMember({
    workspaceId,
  });

  return (
    <>
      {workspaceId && currentMember?._id && (
        <BrowserNotificationContent workspaceId={workspaceId} />
      )}
    </>
  );
}
