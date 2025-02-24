import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const add = mutation({
  args: {
    channelId: v.id('channels'),
    memberIds: v.array(v.id('members')),
  },
  handler: async (ctx, args) => {
    const { channelId, memberIds } = args;

    await Promise.all(
      memberIds.map(async (memberId) => {
        // Check if the member is already in the channel
        const existingMember = await ctx.db
          .query('channelMembers')
          .withIndex('by_channel_member', (q) =>
            q.eq('channelId', channelId).eq('memberId', memberId)
          )
          .unique();

        if (!existingMember) {
          await ctx.db.insert('channelMembers', {
            channelId: channelId,
            memberId,
          });
        }
      })
    );

    return { success: true };
  },
});

export const remove = mutation({
  args: {
    channelId: v.id('channels'),
    memberId: v.id('members'),
  },
  handler: async (ctx, args) => {
    const { channelId, memberId } = args;

    // Check if the member is in the channel
    const existingMember = await ctx.db
      .query('channelMembers')
      .withIndex('by_channel_member', (q) =>
        q.eq('channelId', channelId).eq('memberId', memberId)
      )
      .unique();

    if (!existingMember) {
      throw new Error('Member is not in the channel');
    }

    // Remove the member from the channel
    await ctx.db.delete(existingMember._id);

    return { success: true };
  },
});
