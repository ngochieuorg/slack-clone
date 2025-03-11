import { v } from 'convex/values';
import { mutation } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';

export const create = mutation({
  args: {
    name: v.string(),
    storageId: v.id('_storage'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw Error('Unauthorized');
    }
    const fileId = await ctx.db.insert('files', {
      name: args.name,
      storageId: args.storageId,
    });

    return fileId;
  },
});

export const updateName = mutation({
  args: {
    name: v.string(),
    fileId: v.id('files'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw Error('Unauthorized');
    }

    const fileId = await ctx.db.patch(args.fileId, {
      name: args.name,
    });

    return fileId;
  },
});
