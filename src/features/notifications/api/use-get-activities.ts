import { useQuery } from 'convex/react';
import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

interface UseGetActivitiesProps {
  workspaceId: Id<'workspaces'>;
  isUnRead?: boolean;
}

export type ActivitiesReturnType =
  typeof api.notifications.activities._returnType;

export const useGetActivities = ({
  workspaceId,
  isUnRead,
}: UseGetActivitiesProps) => {
  const data = useQuery(api.notifications.activities, {
    workspaceId,
    isUnRead,
  });
  const isLoading = data === undefined;

  return { data, isLoading };
};
