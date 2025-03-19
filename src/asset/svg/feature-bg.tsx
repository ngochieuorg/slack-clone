import { cn } from '@/lib/utils';
import React from 'react';

const FeatureBg = ({
  className,
  color,
}: {
  className?: string;
  color: string;
}) => {
  return (
    <svg
      width="540"
      height="540"
      viewBox="0 0 540 540"
      fill="none"
      xmlns="http://www.w4.org/2000/svg"
      className={cn('', className)}
    >
      <path
        d="m0 270c-.00001304-149.117 120.883-269.99998696 270-270s270 120.883 270 270v270h-270c-149.117 0-269.99998696-120.883-270-270z"
        fill={color}
      ></path>
    </svg>
  );
};

export default FeatureBg;
