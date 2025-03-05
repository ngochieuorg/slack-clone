'use client';

import { directMessageAtom } from '@/store/direct-message.store';
import { useAtom } from 'jotai';
import { usePathname, useRouter } from 'next/navigation';
import React, { useEffect } from 'react';

const DirectMessagePage = () => {
  const path = usePathname();
  const router = useRouter();
  const [{ directMessages }] = useAtom(directMessageAtom);

  const firstConversation = directMessages?.[0];

  useEffect(() => {
    if (firstConversation) {
      router.replace(
        `${path}/${firstConversation.conversationWithMember}?conversationId=${firstConversation.conversationId}`
      );
    }
  }, [firstConversation, path, router]);

  return <></>;
};

export default DirectMessagePage;
