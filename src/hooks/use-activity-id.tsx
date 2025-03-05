import { useParams } from 'next/navigation';

export const useActivityId = () => {
  const params = useParams();

  return params.activityId as string;
};
