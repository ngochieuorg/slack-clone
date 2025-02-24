import { v } from 'convex/values';
import { mutation } from './_generated/server';

export const addMemberToChannel = mutation({
  args: {
    channelId: v.id('channels'),
    memberIds: v.array(v.id('members')),
  },
  handler: async (ctx, args) => {
    const { channelId, memberIds } = args;

    // Check if the member is already in the channel
    // const existingMember = await ctx.db
    //   .query('channelMembers')
    //   .withIndex('by_channel_member', (q) =>
    //     q.eq('channelId', channelId).eq('memberId', memberId)
    //   )
    //   .unique();

    // if (existingMember) {
    //   throw new Error('Member is already in the channel');
    // }

    await Promise.all(
      memberIds.map(async (memberId) => {
        // Add the member to the channel
        await ctx.db.insert('channelMembers', {
          channelId: channelId,
          memberId,
        });
      })
    );

    return { success: true };
  },
});
