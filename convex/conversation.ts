import { v } from 'convex/values';
import { mutation, query, QueryCtx } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';
import { Id } from './_generated/dataModel';
import { populateUser } from '../src/utils/convex.utils';

const populateMember = (ctx: QueryCtx, memberId: Id<'members'>) => {
  return ctx.db.get(memberId);
};

export const createOrGet = mutation({
  args: {
    memberId: v.id('members'),
    workspaceId: v.id('workspaces'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    const currentMember = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId)
      )
      .unique();

    const otherMember = await ctx.db.get(args.memberId);

    if (!currentMember || !otherMember) {
      throw new Error('Member not found');
    }

    const existingConversation = await ctx.db
      .query('conversations')
      .filter((q) => q.eq(q.field('workspaceId'), args.workspaceId))
      .filter((q) =>
        q.or(
          q.and(
            q.eq(q.field('memberOneId'), currentMember._id),
            q.eq(q.field('memberTwoId'), otherMember._id)
          ),
          q.and(
            q.eq(q.field('memberTwoId'), currentMember._id),
            q.eq(q.field('memberOneId'), otherMember._id)
          )
        )
      )
      .unique();

    if (existingConversation) {
      return existingConversation._id;
    }

    const userOne = await populateMember(ctx, currentMember._id);
    const userTwo = await populateMember(ctx, otherMember._id);

    if (!userOne || !userTwo) {
      throw new Error('Member not found');
    }

    const conversationId = await ctx.db.insert('conversations', {
      workspaceId: args.workspaceId,
      memberOneId: currentMember._id,
      memberTwoId: otherMember._id,
      userOneId: userOne.userId,
      userTwoId: userTwo.userId,
    });

    return conversationId;
  },
});

export const get = query({
  args: { workspaceId: v.id('workspaces') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return [];
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member) {
      return [];
    }

    const conversations = await ctx.db
      .query('conversations')
      .filter((q) => q.eq(q.field('workspaceId'), args.workspaceId))
      .filter((q) =>
        q.or(
          q.eq(q.field('memberOneId'), member._id),
          q.eq(q.field('memberTwoId'), member._id)
        )
      )
      .collect();

    const populateConversations = Promise.all(
      conversations.map(async (conversation) => {
        let conversationWithMemberId;
        if (conversation.memberOneId === member._id) {
          conversationWithMemberId = conversation.memberTwoId;
        } else {
          conversationWithMemberId = conversation.memberOneId;
        }

        const memberWith = await populateMember(ctx, conversationWithMemberId);

        const user = memberWith
          ? await populateUser(ctx, memberWith.userId, {
              memberId: memberWith._id,
            })
          : null;

        return {
          ...conversation,
          withUser: user,
        };
      })
    );

    return populateConversations;
  },
});
