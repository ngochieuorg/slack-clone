import { v } from 'convex/values';
import { query, mutation } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const get = query({
  args: { memberId: v.id('members') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    const memberPreference = await ctx.db
      .query('memberPreferences')
      .withIndex('by_member_id_user_id', (q) =>
        q.eq('memberId', args.memberId).eq('userId', userId)
      )
      .unique();

    if (!memberPreference) {
      return null;
    }

    return memberPreference;
  },
});

export const update = mutation({
  args: {
    memberId: v.id('members'),
    fullName: v.optional(v.string()),
    displayName: v.optional(v.string()),
    title: v.optional(v.string()),
    pronunciation: v.optional(v.string()),
    timeZone: v.optional(v.string()),
    image: v.optional(v.id('_storage')),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw new Error('Unauthorized');
    }

    const memberPreference = await ctx.db
      .query('memberPreferences')
      .withIndex('by_member_id_user_id', (q) =>
        q.eq('memberId', args.memberId).eq('userId', userId)
      )
      .unique();

    if (!memberPreference) {
      throw new Error('Member preferences not found');
    }

    await ctx.db.patch(memberPreference._id, {
      fullName: args.fullName,
      displayName: args.displayName,
      title: args.title,
      pronunciation: args.pronunciation,
      timeZone: args.timeZone,
      image: args.image,
    });

    return memberPreference._id;
  },
});
