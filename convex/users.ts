import { query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';
import { v } from 'convex/values';

export const current = query({
  args: { workspaceId: v.id('workspaces') },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      return null;
    }

    const user = await ctx.db.get(userId);

    const memberPreference = await ctx.db
      .query('memberPreferences')
      .withIndex('by_user_id_workspace_id', (q) =>
        q.eq('userId', userId).eq('workspaceId', args.workspaceId)
      )
      .unique();

    const image = memberPreference?.image
      ? await ctx.storage.getUrl(memberPreference.image)
      : undefined;

    return { ...user, memberPreference: { ...memberPreference, image } };
  },
});
