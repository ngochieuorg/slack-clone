import { Id } from '../../convex/_generated/dataModel';
import { QueryCtx } from '../../convex/_generated/server';

export const populateThread = async (
  ctx: QueryCtx,
  messageId: Id<'messages'>
) => {
  const messages = await ctx.db
    .query('messages')
    .withIndex('by_parent_message_id', (q) =>
      q.eq('parentMessageId', messageId)
    )
    .collect();

  if (messages.length === 0) {
    return {
      count: 0,
      image: undefined,
      timeStamp: 0,
      name: '',
    };
  }

  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timeStamp: 0,
      name: '',
    };
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId);

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timeStamp: lastMessage._creationTime,
    name: lastMessageUser?.name,
    message: lastMessage,
  };
};

export const populateReactions = (ctx: QueryCtx, messageId: Id<'messages'>) => {
  return ctx.db
    .query('reactions')
    .withIndex('by_message_id', (q) => q.eq('messageId', messageId))
    .collect();
};

export const populateUser = (ctx: QueryCtx, userId: Id<'users'>) => {
  return ctx.db.get(userId);
};

export const populateMember = (ctx: QueryCtx, memberId: Id<'members'>) => {
  return ctx.db.get(memberId);
};

export const populateMesssage = (ctx: QueryCtx, messageId: Id<'messages'>) => {
  return ctx.db.get(messageId);
};

export function extractMentionIds(jsonString: string): string[] {
  try {
    const jsonData = JSON.parse(jsonString); // Parse JSON
    const ids: string[] = [];

    if (jsonData.ops && Array.isArray(jsonData.ops)) {
      for (const op of jsonData.ops) {
        if (op.insert && typeof op.insert === 'object' && op.insert.mention) {
          ids.push(op.insert.mention.id);
        }
      }
    }

    return ids;
  } catch (error) {
    console.error('Invalid JSON:', error);
    return [];
  }
}
