'use client';

import { useMemberId } from '@/hooks/use-member-id';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { directMessageAtom } from '@/store/direct-message.store';
import { useAtom } from 'jotai';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const DirectMessagePage = () => {
  const router = useRouter();
  const workspaceId = useWorkspaceId();
  const [{ directMessages }] = useAtom(directMessageAtom);
  const memberId = useMemberId();

  const firstConversationMemberId =
    directMessages?.[0]?.conversationWith?.memberPreference?.memberId;
  const firstConversationId = directMessages?.[0]?.conversationId;

  useEffect(() => {
    if (!memberId && firstConversationMemberId && firstConversationId) {
      setTimeout(() => {
        router.push(
          `/workspace/${workspaceId}/direct-message/${firstConversationMemberId}?conversationId=${firstConversationId}`
        );
      }, 100);
    }
  }, [
    firstConversationMemberId,
    firstConversationId,
    workspaceId,
    router,
    memberId,
  ]);

  return <></>;
};

export default DirectMessagePage;
