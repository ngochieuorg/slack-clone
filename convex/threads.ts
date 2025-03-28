import { v } from 'convex/values';
import { query } from './_generated/server';
import { getAuthUserId } from '@convex-dev/auth/server';
import { paginationOptsValidator } from 'convex/server';
import {
  populateMember,
  populateReactions,
  populateThread,
  populateUser,
} from '../src/utils/convex.utils';
import { Doc, Id } from './_generated/dataModel';

export const get = query({
  args: {
    workspaceId: v.id('workspaces'),
    paginationOpts: paginationOptsValidator,
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);

    if (userId === null) {
      throw Error('Unauthorized');
    }

    const results = await ctx.db
      .query('messages')
      .withIndex('by_workspace_id', (q) =>
        q.eq('workspaceId', args.workspaceId)
      )
      .order('desc')
      .paginate(args.paginationOpts);

    return {
      ...results,
      page: (
        await Promise.all(
          results.page.map(async (message) => {
            const member = await populateMember(ctx, message.memberId);
            const user = member
              ? await populateUser(ctx, member.userId, {
                  memberId: message.memberId,
                })
              : null;

            if (!member || !user) {
              return null;
            }

            const reactions = await populateReactions(ctx, message._id);
            const thread = await populateThread(ctx, message._id);
            const files = await Promise.all(
              (message.files || []).map(async (f) => {
                const file = await ctx.storage.getUrl(f);
                return file;
              })
            );

            const reactionsWithCounts = reactions.map((reaction) => {
              return {
                ...reaction,
                count: reactions.filter((r) => r.value === reaction.value)
                  .length,
              };
            });

            const dedupedReactions = reactionsWithCounts.reduce(
              (acc, reaction) => {
                const existingReaction = acc.find(
                  (r) => r.value === reaction.value
                );

                if (existingReaction) {
                  existingReaction.memberIds = Array.from(
                    new Set([...existingReaction.memberIds, reaction.memberId])
                  );
                } else {
                  acc.push({
                    ...reaction,
                    memberIds: [reaction.memberId],
                  });
                }

                return acc;
              },
              [] as (Doc<'reactions'> & {
                count: number;
                memberIds: Id<'members'>[];
              })[]
            );

            const reactionWithoutMemberIdProperty = dedupedReactions.map(
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              ({ memberId, ...rest }) => rest
            );

            return {
              ...message,
              files,
              member,
              user,
              reactions: reactionWithoutMemberIdProperty,
              threadCount: thread.count,
              threadImage: thread.image,
              threadName: thread.name,
              threadTimestamp: thread.timeStamp,
              usersInThread: thread.usersInThread,
            };
          })
        )
      )
        .filter(
          (message): message is NonNullable<typeof message> => message !== null
        )
        .filter((message) => message.threadCount > 0)
        .sort((a, b) => b.threadTimestamp - a.threadTimestamp),
    };
  },
});
