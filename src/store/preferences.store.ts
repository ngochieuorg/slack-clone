import { atom } from 'jotai';

// Types

import { MemberPreferencesReturnType } from '@/features/members/api/use-get-member-preferences';

interface PreferencesProps {
  preferences: MemberPreferencesReturnType | null;
}

export const preferencesAtom = atom<PreferencesProps>({
  preferences: null,
});
