/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as channelMembers from "../channelMembers.js";
import type * as channels from "../channels.js";
import type * as conversation from "../conversation.js";
import type * as files from "../files.js";
import type * as http from "../http.js";
import type * as memberPreferences from "../memberPreferences.js";
import type * as members from "../members.js";
import type * as messages from "../messages.js";
import type * as notifications from "../notifications.js";
import type * as reactions from "../reactions.js";
import type * as saveLaters from "../saveLaters.js";
import type * as threads from "../threads.js";
import type * as upload from "../upload.js";
import type * as users from "../users.js";
import type * as workspaces from "../workspaces.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  channelMembers: typeof channelMembers;
  channels: typeof channels;
  conversation: typeof conversation;
  files: typeof files;
  http: typeof http;
  memberPreferences: typeof memberPreferences;
  members: typeof members;
  messages: typeof messages;
  notifications: typeof notifications;
  reactions: typeof reactions;
  saveLaters: typeof saveLaters;
  threads: typeof threads;
  upload: typeof upload;
  users: typeof users;
  workspaces: typeof workspaces;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
