import React from 'react';
import { cn } from '@/lib/utils';

const OnlineDot = ({ className }: { className?: string }) => {
  return (
    <svg
      data-xh2="true"
      data-qa="presence_indicator"
      aria-hidden="false"
      aria-label="Active"
      data-qa-type="status-member"
      data-qa-presence-self="true"
      data-qa-presence-active="true"
      data-qa-presence-dnd="false"
      viewBox="0 0 20 20"
      className={cn('size-4', className)}
    >
      <path
        fill="#00a67e"
        d="M14.5 10a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0"
      ></path>
    </svg>
  );
};

export default OnlineDot;
