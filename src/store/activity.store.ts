import { atom } from 'jotai';

// Types
import { ActivitiesReturnType } from '@/features/notifications/api/use-get-activities';

interface ActivitiesAtomProps {
  activities: ActivitiesReturnType;
  isLoading?: boolean;
  isUnread: boolean;
  selectActivityId?: string;
}

export const activitiesAtom = atom<ActivitiesAtomProps>({
  activities: [],
  isUnread: false,
});
