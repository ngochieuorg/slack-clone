import { useParams } from 'next/navigation';

import { Id } from '../../convex/_generated/dataModel';

export const useLaterId = () => {
  const params = useParams();

  return params.laterId as Id<'savedLaters'>;
};
