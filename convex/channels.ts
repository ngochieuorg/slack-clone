import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';
import { arrayToHash } from '../src/app/utils';
import { populateMember, populateUser } from '../src/utils/convex.utils';

export const get = query({
  args: {
    workspaceId: v.id('workspaces'),
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
      return [];
    }

    const channelsThatMemberIn = await ctx.db
      .query('channelMembers')
      .withIndex('by_member_id', (q) => q.eq('memberId', member._id))
      .collect();

    const channelIdsThatMemberIn = arrayToHash(
      channelsThatMemberIn,
      'channelId'
    );

    const channels = await ctx.db
      .query('channels')
      .withIndex('by_workspace_id', (q) =>
        q.eq('workspaceId', args.workspaceId)
      )
      .collect();

    return channels.filter((channel) => {
      return channelIdsThatMemberIn[channel._id];
    });
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    workspaceId: v.id('workspaces'),
    isPrivate: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw Error('Unauthorized');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', args.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member || member.role !== 'admin') {
      throw Error('Unauthorized');
    }

    const parsedName = args.name.replace(/\s+/g, '-').toLowerCase();

    const channelId = await ctx.db.insert('channels', {
      name: parsedName,
      workspaceId: args.workspaceId,
      isPrivate: args.isPrivate,
    });

    await ctx.db.insert('channelMembers', {
      channelId,
      memberId: member._id,
    });

    return channelId;
  },
});

export const getById = query({
  args: {
    id: v.id('channels'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (!userId) {
      return null;
    }

    const channel = await ctx.db.get(args.id);

    if (!channel) {
      return null;
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', channel.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member) return null;

    const membersInChannel = await ctx.db
      .query('channelMembers')
      .withIndex('by_channel_id', (q) => q.eq('channelId', args.id))
      .collect();

    const usersInChannel = await Promise.all(
      membersInChannel.map(async (mem) => {
        const member = await populateMember(ctx, mem.memberId);
        if (member) {
          const user = await populateUser(ctx, member?.userId, {
            memberId: member._id,
          });
          return { ...mem, user };
        }
      })
    );

    return { ...channel, users: usersInChannel };
  },
});

export const update = mutation({
  args: {
    id: v.id('channels'),
    name: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw Error('Unauthorized');
    }

    const channel = await ctx.db.get(args.id);

    if (!channel) {
      throw new Error('Channel not found');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', channel.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member || member.role !== 'admin') {
      throw Error('Unauthorized');
    }

    await ctx.db.patch(args.id, {
      name: args.name,
    });

    return args.id;
  },
});

export const remove = mutation({
  args: {
    id: v.id('channels'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw Error('Unauthorized');
    }

    const channel = await ctx.db.get(args.id);

    if (!channel) {
      throw new Error('Channel not found');
    }

    const member = await ctx.db
      .query('members')
      .withIndex('by_workspace_id_user_id', (q) =>
        q.eq('workspaceId', channel.workspaceId).eq('userId', userId)
      )
      .unique();

    if (!member || member.role !== 'admin') {
      throw Error('Unauthorized');
    }

    const [messages] = await Promise.all([
      ctx.db
        .query('messages')
        .withIndex('by_channel_id', (q) => q.eq('channelId', args.id))
        .collect(),
    ]);

    for (const message of messages) {
      await ctx.db.delete(message._id);
    }

    await ctx.db.delete(args.id);

    return args.id;
  },
});
