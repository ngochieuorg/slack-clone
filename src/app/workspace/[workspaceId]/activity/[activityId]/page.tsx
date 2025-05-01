'use client';

// Store Management
import { useAtom } from 'jotai';
import { activitiesAtom } from '@/store/activity.store';

// Components
import ActivityThread from '@/features/notifications/components/activity-threads';

// Hooks
import { usePanel } from '@/hooks/use-panel';
import { useActivityId } from '@/hooks/use-activity-id';

// React
import { useEffect } from 'react';
import SubChannelView from '@/components/sub-view/sub-channel-view';

const ActivityIdPage = () => {
  const [{ activities }] = useAtom(activitiesAtom);
  const activityId = useActivityId();

  const { onClose } = usePanel();

  useEffect(() => {
    return () => {
      onClose();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activity = activities?.find((act) => act._id === activityId);

  const activityContent = () => {
    if (activity?.notiType === 'mention') {
      if (activity.newestNoti.messageId) {
        if (activity.newestNoti.parentMessageId) {
          if (activity?.newestNoti.channelId) {
            return (
              <ActivityThread
                channelId={activity?.newestNoti.channelId}
                parentMessageId={activity?.newestNoti.parentMessageId}
                messageId={activity.newestNoti.messageId}
              />
            );
          }
        }
        return (
          <SubChannelView
            channelId={activity?.newestNoti.channelId}
            parentMessageId={activity?.newestNoti.parentMessageId}
            messageId={activity.newestNoti.messageId}
          />
        );
      }
    }

    if (activity?.notiType === 'reply') {
      if (
        activity?.newestNoti.channelId &&
        activity?.newestNoti.parentMessageId
      ) {
        return (
          <ActivityThread
            channelId={activity?.newestNoti.channelId}
            parentMessageId={activity?.newestNoti.parentMessageId}
            messageId={activity.newestNoti.messageId}
          />
        );
      }
    }

    if (activity?.notiType === 'reaction') {
      if (activity?.newestNoti.messageId) {
        return (
          <SubChannelView
            messageId={activity?.newestNoti.messageId}
            channelId={activity?.newestNoti.channelId}
            parentMessageId={activity?.newestNoti.parentMessageId}
          />
        );
      }
    }
  };

  if (!activity) {
    return <></>;
  }

  return <>{activityContent()}</>;
};

export default ActivityIdPage;
