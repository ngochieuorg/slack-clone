import { cn } from '@/lib/utils';
import React from 'react';
import UserDetailCard from './user-detail-card';
import { Id } from '../../convex/_generated/dataModel';

interface Mention {
  index: string;
  denotationChar: string;
  id: string;
  value: string;
}

interface InsertOperation {
  insert: string | { mention: Mention };
}

interface DeltaOps {
  ops: InsertOperation[];
}

interface ConvertJsonToHtmlProps {
  value: string;
  mentionBackground?: string;
  mentionColor?: string;
}

const ConvertJsonToHtml: React.FC<ConvertJsonToHtmlProps> = ({
  value,
  mentionBackground,
  mentionColor,
}) => {
  try {
    const data: DeltaOps = JSON.parse(value);
    return (
      <div>
        {data.ops.map((op, index) => {
          if (typeof op.insert === 'string') {
            // Replace newlines with <br /> and set HTML directly
            const htmlString = op.insert.replace(/\n/g, '<br />');
            return (
              <span
                key={index}
                dangerouslySetInnerHTML={{ __html: htmlString }}
              />
            );
          } else if (op.insert.mention) {
            const mention = op.insert.mention;
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const [_, memberId] = op.insert.mention.id.split('-');
            return (
              <UserDetailCard
                key={op.insert.mention.id}
                memberId={memberId as Id<'members'>}
                trigger={
                  <span
                    key={index}
                    className={cn(
                      `mention bg-[#d5e3ee] text-[#1264a3] cursor-pointer`,
                      mentionBackground && `bg-[${mentionBackground}]`,
                      mentionColor && `text-[${mentionColor}]`
                    )}
                    data-id={mention.id}
                  >
                    {mention.denotationChar}
                    {mention.value}
                  </span>
                }
              />
            );
          }
          return null;
        })}
      </div>
    );
  } catch (error) {
    console.error('Invalid JSON format', error);
    return <div>Error parsing JSON</div>;
  }
};

interface CustomRendererProps {
  mentionBackground?: string;
  mentionColor?: string;
  value: string;
  textColor?: string;
}

const CustomRenderer = ({
  value,
  mentionBackground,
  mentionColor,
  textColor = '#1d1c1d',
}: CustomRendererProps) => {
  return (
    <div
      style={{ fontStyle: 'inherit', fontFamily: 'inherit', color: textColor }}
    >
      <ConvertJsonToHtml
        value={value}
        mentionBackground={mentionBackground}
        mentionColor={mentionColor}
      />
    </div>
  );
};

export default CustomRenderer;
