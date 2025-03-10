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
