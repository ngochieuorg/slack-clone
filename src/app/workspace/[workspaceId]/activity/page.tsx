'use client';

// Hooks
import { useActivityId } from '@/hooks/use-activity-id';
import { useEffect } from 'react';

// Store Management
import { useAtom } from 'jotai';
import { activitiesAtom } from '@/store/activity.store';
import { useRouter } from 'next/navigation';
import { useWorkspaceId } from '@/hooks/use-workspace-id';

const ActivityPage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [{ activities }] = useAtom(activitiesAtom);
  const activityId = useActivityId();

  const firstActivityId = activities?.[0]?._id;

  useEffect(() => {
    if (!activityId && firstActivityId) {
      router.push(`/workspace/${workspaceId}/activity/${firstActivityId}`);
    }
  }, [activityId, firstActivityId, router, workspaceId]);

  return <></>;
};

export default ActivityPage;
