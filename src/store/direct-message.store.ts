import { atom } from 'jotai';

// Types
import { DirectMessageReturnType } from '@/features/notifications/api/api-get-direct-messages';

interface DirectMessageAtomProps {
  directMessages: DirectMessageReturnType;
  isLoading?: boolean;
  isUnread: boolean;
  selectActivityId?: string;
}

export const directMessageAtom = atom<DirectMessageAtomProps>({
  directMessages: [],
  isUnread: false,
});
