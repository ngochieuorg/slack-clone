import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';
import { paginationOptsValidator } from 'convex/server';
import { populateMember, populateMesssage } from '../src/utils/convex.utils';
import { Id } from './_generated/dataModel';

export const get = query({
  args: {
    workspaceId: v.id('workspaces'),
    status: v.union(
      v.literal('inprogress'),
      v.literal('archived'),
      v.literal('completed')
    ),
    paginationOpts: paginationOptsValidator,
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

    if (!member) {
      throw Error('Unauthorized');
    }

    const results = await ctx.db
      .query('savedLaters')
      .filter((q) => {
        return q.eq(q.field('status'), args.status);
      })
      .order('desc')
      .paginate(args.paginationOpts);

    return {
      ...results,
      page: await Promise.all(
        results.page.map(async (later) => {
          let member;
          let channel;
          let message;

          message = await populateMesssage(ctx, later.messageId);
          if (message) {
            member = await populateMember(ctx, message?.memberId);
          }
          if (later.channelId) {
            channel = await ctx.db.get(later.channelId);
          }

          if (message) {
            const populateFiles = await Promise.all(
              (message.files || []).map(async (f) => {
                const fileUrl = await ctx.storage.getUrl(f);
                const fileInfo = await ctx.db.system.get(f);
                const file = await ctx.db
                  .query('files')
                  .withIndex('by_storageId', (q) =>
                    q.eq('storageId', fileInfo?._id as Id<'_storage'>)
                  )
                  .unique();
                return {
                  url: fileUrl,
                  info: fileInfo,
                  name: file?.name,
                  fileId: file?._id,
                };
              })
            );
            message = { ...message, files: populateFiles };
          }

          return {
            ...later,
            member,
            channel,
            message,
          };
        })
      ),
    };
  },
});

export const getById = query({
  args: {
    id: v.id('savedLaters'),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw Error('Unauthorized');
    }

    const later = await ctx.db.get(args.id);

    let member;
    let channel;
    let message;

    if (later) message = await populateMesssage(ctx, later.messageId);
    if (message) {
      member = await populateMember(ctx, message?.memberId);
    }
    if (later?.channelId) {
      channel = await ctx.db.get(later.channelId);
    }

    if (message) {
      const populateFiles = await Promise.all(
        (message.files || []).map(async (f) => {
          const fileUrl = await ctx.storage.getUrl(f);
          const fileInfo = await ctx.db.system.get(f);
          const file = await ctx.db
            .query('files')
            .withIndex('by_storageId', (q) =>
              q.eq('storageId', fileInfo?._id as Id<'_storage'>)
            )
            .unique();
          return {
            url: fileUrl,
            info: fileInfo,
            name: file?.name,
            fileId: file?._id,
          };
        })
      );
      message = { ...message, files: populateFiles };
    }

    return {
      ...later,
      member,
      channel,
      message,
    };
  },
});

export const save = mutation({
  args: {
    workspaceId: v.id('workspaces'),
    messageId: v.id('messages'),
    fileId: v.optional(v.id('files')),
    channelId: v.optional(v.id('channels')),
    conversationId: v.optional(v.id('conversations')),
    parentMessageId: v.optional(v.id('messages')),
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
      channelId: args.channelId,
      conversationId: args.conversationId,
      parentMessageId: args.parentMessageId,
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
