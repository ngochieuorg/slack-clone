'use client';

// Store Management
import { useAtom } from 'jotai';
import { activitiesAtom } from '@/store/activity.store';
import ActivityMention from '@/features/notifications/components/activity-mention';
import ActivityThread from '@/features/notifications/components/activity-threads';
import ActivityReaction from '@/features/notifications/components/activity-reactions';

const ActivityPage = () => {
  const [{ selectActivityId, activities }] = useAtom(activitiesAtom);

  const activity = activities?.find((act) => act._id === selectActivityId);

  const activityContent = () => {
    if (activity?.notiType === 'mention') {
      return <ActivityMention />;
    }

    if (activity?.notiType === 'reply') {
      if (
        activity?.newestNoti.channelId &&
        activity?.newestNoti.parentMessageId
      ) {
        return (
          <ActivityThread
            channelId={activity?.newestNoti.channelId}
            messageId={activity?.newestNoti.parentMessageId}
          />
        );
      }
    }

    if (activity?.notiType === 'reaction') {
      return <ActivityReaction />;
    }
  };

  if (!activity) {
    return <></>;
  }

  return <>{activityContent()}</>;
};

export default ActivityPage;
