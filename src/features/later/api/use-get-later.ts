import { useQuery } from 'convex/react';
import { Id } from '../../../../convex/_generated/dataModel';
import { api } from '../../../../convex/_generated/api';

interface UseGetLaterProps {
  id: Id<'savedLaters'>;
}

export const useGetLater = ({ id }: UseGetLaterProps) => {
  const data = useQuery(api.saveLaters.getById, { id });
  const isLoading = data === undefined;

  return { data, isLoading };
};
