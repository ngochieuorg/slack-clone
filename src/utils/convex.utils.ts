import { groupBy } from '../app/utils';
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
      usersInThread: [],
    };
  }

  const groupByMember = groupBy(messages, 'memberId');

  const memberIds = Object.keys(groupByMember);

  const users = await Promise.all(
    memberIds.map(async (member) => {
      const populateMem = await populateMember(ctx, member as Id<'members'>);
      if (populateMem) {
        const user = await populateUser(ctx, populateMem.userId, {
          memberId: populateMem._id,
        });
        return user;
      }
    })
  );

  const lastMessage = messages[messages.length - 1];
  const lastMessageMember = await populateMember(ctx, lastMessage.memberId);

  if (!lastMessageMember) {
    return {
      count: 0,
      image: undefined,
      timeStamp: 0,
      name: '',
      usersInThread: users,
    };
  }

  const lastMessageUser = await populateUser(ctx, lastMessageMember.userId, {
    memberId: lastMessageMember._id,
  });

  return {
    count: messages.length,
    image: lastMessageUser?.image,
    timeStamp: lastMessage._creationTime,
    name: lastMessageUser?.name,
    message: lastMessage,
    usersInThread: users,
  };
};

export const populateReactions = (ctx: QueryCtx, messageId: Id<'messages'>) => {
  return ctx.db
    .query('reactions')
    .withIndex('by_message_id', (q) => q.eq('messageId', messageId))
    .collect();
};

export const populateUser = async (
  ctx: QueryCtx,
  userId: Id<'users'>,
  options: { workspaceId?: Id<'workspaces'>; memberId?: Id<'members'> } = {}
) => {
  const { workspaceId, memberId } = options;
  const user = await ctx.db.get(userId); // Ensure this is awaited

  if (!user) {
    return null; // Return null if user is not found
  }

  let memberPreference = null;
  if (workspaceId) {
    memberPreference = await ctx.db
      .query('memberPreferences')
      .withIndex('by_user_id_workspace_id', (q) =>
        q.eq('userId', userId).eq('workspaceId', workspaceId)
      )
      .unique();
  } else if (memberId) {
    // Use else if to avoid overwriting memberPreference
    memberPreference = await ctx.db
      .query('memberPreferences')
      .withIndex('by_member_id_user_id', (q) =>
        q.eq('memberId', memberId).eq('userId', userId)
      )
      .unique();
  }

  const image = memberPreference?.image
    ? await ctx.storage.getUrl(memberPreference.image)
    : undefined;

  const returnUser = {
    ...user,
    memberPreference: { ...memberPreference, image },
  };

  return returnUser;
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
