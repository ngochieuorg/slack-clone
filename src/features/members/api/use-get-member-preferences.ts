import { useQuery } from 'convex/react';
import { api } from '../../../../convex/_generated/api';
import { Id } from '../../../../convex/_generated/dataModel';

interface UseGetMemberProps {
  memberId: Id<'members'>;
}

export type MemberPreferencesReturnType =
  typeof api.memberPreferences.get._returnType;

export const useGetMemberPreferences = ({ memberId }: UseGetMemberProps) => {
  const data = useQuery(api.memberPreferences.get, { memberId });
  const isLoading = data === undefined;

  return { data, isLoading };
};
