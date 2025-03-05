'use client';
import React from 'react';
import Conversation from '../../member/[memberId]/conversation';
import { AlertCircle } from 'lucide-react';
import { Id } from '../../../../../../convex/_generated/dataModel';
import useConversationId from '@/features/notifications/store/use-conversation-id';

const DirectMessageMemberPage = () => {
  const [conversationId] = useConversationId();

  if (!conversationId) {
    return (
      <div className="h-full flex flex-col gap-y-2 items-center justify-center">
        <AlertCircle className="size-6  text-muted-foreground" />
        <span className="text-sm text-muted-foreground">
          Conversation not found
        </span>
      </div>
    );
  }

  return <Conversation id={conversationId as Id<'conversations'>} />;
};

export default DirectMessageMemberPage;
