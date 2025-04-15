import {
  Bell,
  HomeIcon,
  MessageCircleMore,
  Globe,
  Laptop,
  CheckCircle,
  Camera,
  Plug,
  LockKeyhole,
  SettingsIcon,
  PenTool,
  Navigation as NavigationIcon,
} from 'lucide-react';
import React, { useState } from 'react';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Navigation } from './navigation';
import NotificationSettings from './notification';
import Home from './home';
import LanguageAndTimezoneSettings from './language-and-region';

const preferenceItems = [
  { icon: Bell, label: 'Notifications', component: <NotificationSettings /> },
  { icon: NavigationIcon, label: 'Navigation', component: <Navigation /> },
  { icon: HomeIcon, label: 'Home', component: <Home /> },
  { icon: PenTool, label: 'Appearance', component: <div></div> },
  {
    icon: MessageCircleMore,
    label: 'Messages & media',
    component: <div></div>,
  },
  {
    icon: Globe,
    label: 'Language & region',
    component: <LanguageAndTimezoneSettings />,
  },
  { icon: Laptop, label: 'Accessibility', component: <div></div> },
  { icon: CheckCircle, label: 'Mark as read', component: <div></div> },
  { icon: Camera, label: 'Audio & video', component: <div></div> },
  { icon: Plug, label: 'Connected accounts', component: <div></div> },
  { icon: LockKeyhole, label: 'Privacy & visibility', component: <div></div> },
  { icon: SettingsIcon, label: 'Advanced', component: <div></div> },
];

const preferencesItemVariant = cva(
  'flex items-center w-48 gap-2 cursor-pointer hover:bg-slate-100 py-1 px-2 rounded',
  {
    variants: {
      variant: {
        default: '',
        active: 'text-[#fff] bg-sky-600  hover:bg-sky-600',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const Preferences = ({ preSelect }: { preSelect?: number }) => {
  const [selected, setSelected] = useState(preferenceItems[preSelect || 0]);

  return (
    <div className="flex">
      <div className="flex flex-col gap-1">
        {preferenceItems.map(({ label, icon: Icon, component }) => {
          return (
            <div
              className={cn(
                preferencesItemVariant({
                  variant: selected.label === label ? 'active' : 'default',
                })
              )}
              onClick={() => setSelected({ label, icon: Icon, component })}
              key={label}
            >
              <Icon className="size-4" />
              <p className=" max-w"> {label} </p>
            </div>
          );
        })}
      </div>
      <div className="flex-1 px-5 text-[15px] h-[60vh] overflow-y-scroll">
        {
          preferenceItems.find((item) => {
            return item.label === selected.label;
          })?.component
        }
      </div>
    </div>
  );
};

export default Preferences;
