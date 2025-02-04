import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const get = query({
  args: {
    workspaceId: v.id('workspaces'),
    channelId: v.optional(v.id('channels')),
    conversationId: v.optional(v.id('conversations')),
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

    const notifications = await ctx.db
      .query('notifications')
      .filter((q) =>
        q.and(
          q.eq(q.field('userId'), userId),
          q.eq(q.field('status'), 'unread'),
          q.or(
            q.eq(q.field('channelId'), args.channelId),
            q.eq(q.field('conversationId'), args.conversationId)
          )
        )
      )
      .collect();

    return notifications;
  },
});

export const markAsRead = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    channelId: v.optional(v.id('channels')),
    conversationId: v.optional(v.id('conversations')),
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

    const notifications = await ctx.db
      .query('notifications')
      .filter((q) =>
        q.and(
          q.eq(q.field('userId'), userId),
          q.eq(q.field('status'), 'unread'),
          q.or(
            q.and(
              q.neq(q.field('channelId'), undefined),
              q.eq(q.field('channelId'), args.channelId)
            ),
            q.and(
              q.neq(q.field('conversationId'), undefined),
              q.eq(q.field('conversationId'), args.conversationId)
            )
          )
        )
      )
      .collect();

    await Promise.all(
      notifications.map(async (noti) => {
        await ctx.db.patch(noti._id, {
          status: 'read',
        });
      })
    );

    return notifications;
  },
});
