'use client';

import Image from 'next/image';

const LaterPage = () => {
  return (
    <div className="flex justify-center items-center h-full">
      <Image
        src={'/empty-later-light.svg'}
        alt="Empty"
        width={500}
        height={500}
      />
    </div>
  );
};

export default LaterPage;
