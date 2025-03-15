import { DeltaOps, RenderMemberPreferences } from '../models';

export const renderDisplayName = (
  defaultName?: string,
  preferences?: RenderMemberPreferences
) => {
  return preferences?.displayName || preferences?.fullName || defaultName;
};

export const convertJsonToString = (value: string) => {
  const data: DeltaOps = JSON.parse(value);
  const returnData = data.ops
    .map((op) => {
      if (typeof op.insert === 'string') {
        const htmlString = op.insert.replace(/\n/g, `\n`);
        return htmlString;
      } else if (op.insert.mention) {
        const mention = op.insert.mention;
        return `${mention.denotationChar}${mention.value}`;
      }
      return '';
    })
    .join(' ');
  return returnData;
};
