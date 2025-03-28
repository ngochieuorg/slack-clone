import { usePaginatedQuery } from 'convex/react';
import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

const BATCH_SIZE = 20;

interface UseGetThreadsProps {
  workspaceId: Id<'workspaces'>;
}

export type GetMessageReturnType =
  (typeof api.messages.get._returnType)['page'];

export const useGetThreads = ({ workspaceId }: UseGetThreadsProps) => {
  const { results, status, loadMore } = usePaginatedQuery(
    api.threads.get,
    { workspaceId },
    { initialNumItems: BATCH_SIZE }
  );

  return { results, status, loadMore: () => loadMore(BATCH_SIZE) };
};
