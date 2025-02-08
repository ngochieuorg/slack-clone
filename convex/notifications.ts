import { v } from 'convex/values';
import { mutation, query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';
import { Doc } from './_generated/dataModel';
import { groupBy } from '../src/app/utils/index';

import {
  populateUser,
  populateMesssage,
  populateThread,
} from '../src/utils/convex.utils';
import { Id } from './_generated/dataModel';
export const get = query({
  args: {
    workspaceId: v.id('workspaces'),
    channelId: v.optional(v.id('channels')),
    conversationId: v.optional(v.id('conversations')),
    isUnRead: v.optional(v.boolean()),
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
      .filter((q) => {
        if (args.isUnRead === true) {
          return q.eq(q.field('status'), 'unread');
        }
        return true;
      })
      .filter((q) =>
        q.and(
          q.eq(q.field('userId'), userId),
          q.or(
            q.eq(q.field('channelId'), args.channelId),
            q.eq(q.field('conversationId'), args.conversationId)
          )
        )
      )
      .order('desc')
      .collect();

    const notificationWithPopulate = await Promise.all(
      notifications.map(async (notification) => {
        let channelData = null;
        if (notification.channelId) {
          channelData = await ctx.db.get(notification.channelId);
        }
        const senderData = await populateUser(ctx, notification.senderId);
        return {
          ...notification,
          channel: channelData,
          sender: senderData,
        };
      })
    );

    return notificationWithPopulate;
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

// export interface ActivityDto {
//   threadName: string;
//   newestNoti: Doc<'notifications'>;
//   threadMsgCount: number;
//   senders: Doc<'users'>[];
//   thread: any;
//   unreadCount: number;
// }

export const activities = query({
  args: {
    workspaceId: v.id('workspaces'),
    isUnRead: v.optional(v.boolean()),
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
      .filter((q) => {
        if (args.isUnRead === true) {
          return q.eq(q.field('status'), 'unread');
        }
        return true;
      })
      .filter((q) => q.eq(q.field('userId'), userId))
      .order('desc')
      .collect();

    const notificationWithPopulate = await Promise.all(
      notifications.map(async (notification) => {
        let channelData = null;
        let parentMessageData = null;
        if (notification.channelId) {
          channelData = await ctx.db.get(notification.channelId);
        }
        if (notification.parentMessageId) {
          parentMessageData = await populateMesssage(
            ctx,
            notification.parentMessageId
          );
        }
        const senderData = await populateUser(ctx, notification.senderId);
        const thread = await populateThread(
          ctx,
          notification.parentMessageId as Id<'messages'>
        );

        return {
          ...notification,
          channel: channelData,
          sender: senderData,
          parentMessage: parentMessageData,
          thread,
        };
      })
    );

    const groupNotifByParentMess = groupBy(
      notificationWithPopulate || [],
      'parentMessageId'
    );

    if (groupNotifByParentMess['undefined']) {
      for (const noti of groupNotifByParentMess['undefined']) {
        if (noti.messageId) {
          if (groupNotifByParentMess[noti.messageId]) {
            groupNotifByParentMess[noti.messageId].push(noti);
            groupNotifByParentMess['undefined'] = groupNotifByParentMess[
              'undefined'
            ].filter((n) => n._id !== noti._id);
          } else {
            groupNotifByParentMess[noti.messageId] = [noti];
            groupNotifByParentMess['undefined'] = groupNotifByParentMess[
              'undefined'
            ].filter((n) => n._id !== noti._id);
          }
        }
      }
    }

    const activities = Object.values(groupNotifByParentMess)
      .filter((gr) => gr.length)
      .map((group) => {
        let threadName;
        let newestNoti = group[0];
        let threadMsgCount = 0;
        const senders: Record<string, Doc<'users'>> = {};
        let thread = group[0].thread;
        let unreadCount = 0;

        group.forEach((noti) => {
          threadName = noti.channel?.name;
          if (noti._creationTime > newestNoti._creationTime) {
            newestNoti = noti;
            thread = noti.thread;
            threadMsgCount = noti.thread.count;
          }
          if (noti.sender && !senders[noti.senderId]) {
            senders[noti.senderId] = noti.sender;
          }
          if (noti.status === 'unread') {
            unreadCount = unreadCount + 1;
          }
        });
        return {
          threadName,
          newestNoti,
          threadMsgCount,
          senders: Object.values(senders),
          thread,
          unreadCount,
        };
      });

    return activities;
  },
});
