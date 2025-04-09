import {
  Home,
  MessageCircle,
  Bell,
  Bookmark,
  LayoutTemplate,
  Workflow,
  FileText,
  Files,
  Layers,
  Users,
  File,
} from 'lucide-react';

export const navigationItems = [
  { id: 'home', label: 'Home', icon: Home, disable: true },
  { id: 'dms', label: 'DMs', icon: MessageCircle, disable: true },
  { id: 'activity', label: 'Activity', icon: Bell, disable: true },
  {
    id: 'later',
    label: 'Later',
    icon: Bookmark,
    description: 'Saved messages to review later',
  },
  {
    id: 'templates',
    label: 'Templates',
    icon: LayoutTemplate,
    description: 'Kickstart any job with these pre-built bundles',
  },
  {
    id: 'automations',
    label: 'Automations',
    icon: Workflow,
    description: 'Create and find workflows and apps',
  },
  {
    id: 'canvases',
    label: 'Canvases',
    icon: FileText,
    description: 'Curate content and collaborate',
  },
  {
    id: 'files',
    label: 'Files',
    icon: Files,
    description: 'Documents, clips, and attachments',
  },
  {
    id: 'channels',
    label: 'Channels',
    icon: Layers,
    description: 'Browse your team’s conversations',
  },
  {
    id: 'people',
    label: 'People',
    icon: Users,
    description: 'Your team and user groups',
  },
  {
    id: 'external',
    label: 'External',
    icon: File,
    description: 'Work with people from other organizations',
  },
];
