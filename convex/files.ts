import { Id } from './_generated/dataModel.d';
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

export const remove = mutation({
  args: {
    fileId: v.id('files'),
    messageId: v.id('messages'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw Error('Unauthorized');
    }

    const msg = await ctx.db.get(args.messageId);

    const file = await ctx.db.get(args.fileId);
    await ctx.db.patch(args.messageId, {
      files: msg?.files?.filter((id) => id !== file?.storageId),
    });
    await ctx.storage.delete(file?.storageId as Id<'_storage'>);
    await ctx.db.delete(args.fileId);

    return true;
  },
});
