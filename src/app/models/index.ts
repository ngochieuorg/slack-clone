import { Id } from '../../../convex/_generated/dataModel';

export interface Mention {
  index: string;
  denotationChar: string;
  id: string;
  value: string;
}

export interface InsertOperation {
  insert: string | { mention: Mention };
}

export interface DeltaOps {
  ops: InsertOperation[];
}

export interface RenderMemberPreferences {
  displayName?: string;
  fullName?: string;
}

export type CreateMessageValues = {
  conversationId?: Id<'conversations'>;
  channelId?: Id<'channels'>;
  workspaceId: Id<'workspaces'>;
  parentMessageId?: Id<'messages'>;
  body: string;
  files: Id<'_storage'>[];
};

export interface FileStorage {
  url: string | null;
  info: {
    _id: Id<'_storage'>;
    _creationTime: number;
    contentType?: string | undefined | undefined;
    sha256: string;
    size: number;
  } | null;
  name?: string;
  fileId?: Id<'files'>;
}
