import React from 'react';
import { cn } from '@/lib/utils';

const OfflineDot = ({ className }: { className?: string }) => {
  return (
    <svg
      data-ieh="true"
      data-qa="presence_indicator"
      aria-hidden="false"
      aria-label="Away"
      data-qa-type="status-member"
      data-qa-presence-self="false"
      data-qa-presence-active="false"
      data-qa-presence-dnd="false"
      viewBox="0 0 20 20"
      className={cn('size-4 rounded-full', className)}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M7 10a3 3 0 1 1 6 0 3 3 0 0 1-6 0m3-4.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export default OfflineDot;
