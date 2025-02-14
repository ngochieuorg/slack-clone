'use client';

import ThreadList from './thread-list';

const ThreadPage = () => {
  return (
    <div className="flex flex-col h-full overflow-auto relative">
      <div className="sticky top-0 left-0 w-full bg-white border-b min-h-12 z-50 flex items-center">
        <span className="font-bold text-lg">Threads</span>
      </div>
      <div className="min-h-full pt-12 z-40 bg-neutral-100 p-2 flex flex-col gap-2 shrink-1">
        <ThreadList />
      </div>
    </div>
  );
};

export default ThreadPage;
