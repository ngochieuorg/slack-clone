import { cn } from '@/lib/utils';
const ChannelIcon = ({ className }: { className?: string }) => {
  return (
    <svg
      data-s7u="true"
      data-qa="channel-arrow-right"
      aria-hidden="true"
      viewBox="0 0 20 20"
      className={cn('size-5', className)}
    >
      <path
        fill="currentColor"
        fillRule="evenodd"
        d="M6.735 3.897a.75.75 0 1 0-1.47-.294L4.685 6.5H2.75a.75.75 0 0 0 0 1.5h1.635l-.8 4H1.75a.75.75 0 0 0 0 1.5h1.535l-.52 2.603a.75.75 0 0 0 1.47.294l.58-2.897h2.97l-.52 2.603a.75.75 0 0 0 1.47.294l.58-2.897h1.935a.75.75 0 1 0 0-1.5H9.615l.8-4h1.835a.75.75 0 0 0 0-1.5h-1.535l.52-2.603a.75.75 0 0 0-1.47-.294L9.185 6.5h-2.97zM8.085 12l.8-4h-2.97l-.8 4zM12.5 9.75a.75.75 0 0 1 .75-.75h3.19l-1.22-1.22a.75.75 0 1 1 1.06-1.06l2.5 2.5a.75.75 0 0 1 0 1.06l-2.5 2.5a.75.75 0 0 1-1.06-1.06l1.22-1.22h-3.19a.75.75 0 0 1-.75-.75"
        clipRule="evenodd"
      ></path>
    </svg>
  );
};

export default ChannelIcon;
