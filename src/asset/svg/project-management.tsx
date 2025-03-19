import { cn } from '@/lib/utils';

const ProjectManagement = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w4.org/2000/svg"
      className={cn('size-5', className)}
    >
      <g
        stroke="#1d1c1d"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.2"
      >
        <path d="m19.9097 5.91724v14.35006c0 .37-.1466.7248-.4077.9869-.2611.262-.6154.41-.9853.4113h-14.61814c-.36809-.0041-.7197-.1532-.97851-.415-.25882-.2618-.40396-.6151-.40394-.9832v-14.59711c-.00002-.36812.14512-.72139.40394-.98316.25881-.26176.61042-.41091.97851-.41506h13.10954"></path>
        <path d="m5.91211 8.84473h5.68219"></path>
        <path d="m5.91211 12.9766h5.29849"></path>
        <path d="m5.91211 17.1077h10.64959"></path>
        <path d="m20.2358 2.34772c.7727.52565 1.1091 1.35091.7569 1.90284l-4.6204 7.13824-3.0119 1.5769.1944-3.38511 4.6415-7.13825c.3522-.57295 1.2668-.57295 2.0395-.09462z"></path>
        <path d="m17.2446 3.90381 2.8963 1.66104"></path>
      </g>
    </svg>
  );
};

export default ProjectManagement;
