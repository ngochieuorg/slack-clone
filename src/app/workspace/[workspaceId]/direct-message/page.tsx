'use client';

import { useEffect, useMemo } from 'react';
import { useMemberId } from '@/hooks/use-member-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { directMessageAtom } from '@/store/direct-message.store';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';

const DirectMessagePage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [{ directMessages }] = useAtom(directMessageAtom);
  const memberId = useMemberId();

  const firstConversation = useMemo(
    () => directMessages?.[0] ?? null,
    [directMessages]
  );
  const firstConversationMemberId = useMemo(
    () => firstConversation?.conversationWith?.memberPreference?.memberId,
    [firstConversation]
  );
  const firstConversationId = useMemo(
    () => firstConversation?.conversationId,
    [firstConversation]
  );

  useEffect(() => {
    if (!memberId && firstConversationMemberId && firstConversationId) {
      const timeoutId = setTimeout(() => {
        router.push(
          `/workspace/${workspaceId}/direct-message/${firstConversationMemberId}?conversationId=${firstConversationId}`
        );
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [
    memberId,
    firstConversationMemberId,
    firstConversationId,
    workspaceId,
    router,
  ]);

  return null;
};

export default DirectMessagePage;
