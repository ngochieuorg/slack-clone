import OfflineDot from '@/asset/svg/offline-dot';
import OnlineDot from '@/asset/svg/online-dot';
import { cn } from '@/lib/utils';
import { differenceInMinutes } from 'date-fns';
import React, { useMemo } from 'react';

interface ActiveStatusProps {
  onlineAt?: number;
  activeBg?: string;
  defaultBg?: string;
  isSelected?: boolean;
  className?: string;
}

const ActiveStatus = ({
  onlineAt,
  activeBg,
  defaultBg,
  isSelected,
  className,
}: ActiveStatusProps) => {
  const isOnline = useMemo(
    () => differenceInMinutes(new Date(), onlineAt as number) < 1,
    [onlineAt]
  );

  return (
    <div
      className={cn(
        'absolute -bottom-2 -right-2 bg-inherit rounded-full overflow-hidden ',
        defaultBg ? `bg-[${defaultBg}]` : '',
        isSelected && activeBg ? `bg-[#ffffff]` : ''
      )}
    >
      {onlineAt ? (
        <>
          {isOnline ? (
            <OnlineDot className={className} />
          ) : (
            <OfflineDot className={className} />
          )}
        </>
      ) : null}
    </div>
  );
};

export default ActiveStatus;
