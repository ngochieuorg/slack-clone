import { usePaginatedQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

const BATCH_SIZE = 20;

interface UseGetLatersProps {
  workspaceId: Id<'workspaces'>;
  status: 'inprogress' | 'archived' | 'completed';
  initialNumItems?: number;
}

export type GetLatersReturnType =
  (typeof api.saveLaters.get._returnType)['page'];

export const useGetLaters = ({
  workspaceId,
  status,
  initialNumItems = BATCH_SIZE,
}: UseGetLatersProps) => {
  const {
    results,
    status: fetchStatus,
    loadMore,
  } = usePaginatedQuery(
    api.saveLaters.get,
    { workspaceId, status },
    { initialNumItems: initialNumItems }
  );

  return { results, status: fetchStatus, loadMore: () => loadMore(BATCH_SIZE) };
};
