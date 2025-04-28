import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const get = query({
  args: {
    workspaceId: v.id('workspaces'),
    status: v.union(
      v.literal('inprogress'),
      v.literal('archived'),
      v.literal('completed')
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member) {
      throw Error('Unauthorized');
    }

    const savedLaters = await ctx.db
      .query('savedLaters')
      .filter((q) => q.eq(q.field('status'), args.status))
      .order('desc')
      .collect();

    return savedLaters;
  },
});

export const save = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    messageId: v.optional(v.id('messages')),
    fileId: v.optional(v.id('files')),
    status: v.union(
      v.literal('inprogress'),
      v.literal('archived'),
      v.literal('completed')
    ),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member) {
      throw Error('Unauthorized');
    }

    const savedLaterId = await ctx.db.insert('savedLaters', {
      memberId: member._id,
      messageId: args.messageId,
      fileId: args.fileId,
      status: 'inprogress',
    });

    return savedLaterId;
  },
});

export const removeSave = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    saveId: v.id('savedLaters'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member) {
      throw Error('Unauthorized');
    }

    await ctx.db.delete(args.saveId);
  },
});
