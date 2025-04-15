'use client';

import { useCurrentMember } from '@/features/members/api/use-current-member';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { Id } from '../../convex/_generated/dataModel';
import { useAtom } from 'jotai';
import { preferencesAtom } from '@/store/preferences.store';
import { useGetMemberPreferences } from '@/features/members/api/use-get-member-preferences';
import { useEffect } from 'react';

function MemberPreferencesContent({
  workspaceId,
}: {
  workspaceId: Id<'workspaces'>;
}) {
  const { data: currentMember } = useCurrentMember({
    workspaceId,
  });
  const [{}, setPreferences] = useAtom(preferencesAtom);

  const { data: memberPreferences } = useGetMemberPreferences({
    memberId: currentMember?._id as Id<'members'>,
  });

  useEffect(() => {
    if (memberPreferences) {
      setPreferences({ preferences: memberPreferences });
    }
  }, [memberPreferences, setPreferences]);

  return <></>;
}

export default function MemberPreferences() {
  const workspaceId = useWorkspaceId();

  return (
    <>{workspaceId && <MemberPreferencesContent workspaceId={workspaceId} />}</>
  );
}
