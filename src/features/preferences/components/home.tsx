'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  ListIcon,
  HeadphonesIcon,
  MessageSquareIcon,
  SendIcon,
  CircleDotIcon,
  InfoIcon,
} from 'lucide-react';
import { useState } from 'react';

export default function Home() {
  const [settings, setSettings] = useState({
    organizeChannel: true,
    showActivityDot: false,
    showUnreads: false,
    showHuddles: false,
    showThreads: true,
    showDrafts: true,
    showConversations: 'all',
    sortBy: 'alphabetical',

    showProfilePhotos: true,
    separatePrivatePublic: false,
    separateDMsFromChannels: false,
    moveMentionsToTop: true,
    organizeExternal: true,
    moveOnlineToTop: true,
    showMutedOutside: false,
  });

  return (
    <div className="space-y-6 max-w-xl  rounded-xl">
      {/* Channel organization */}
      <div className="space-y-2">
        <h2 className="font-medium">Show channel organization options</h2>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={settings.organizeChannel}
            onCheckedChange={(v) =>
              setSettings({ ...settings, organizeChannel: !!v })
            }
          />
          <label>
            Show options to personally organize a channel when joining
          </label>
        </div>
      </div>

      <hr />

      {/* Activity dot */}
      <div className="space-y-2">
        <h2 className="font-medium">Show activity</h2>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={settings.showActivityDot}
            onCheckedChange={(v) =>
              setSettings({ ...settings, showActivityDot: !!v })
            }
          />
          <label className="flex items-center gap-1">
            <CircleDotIcon className="w-4 h-4" />
            Show a dot on the Home icon when there is unread activity
          </label>
        </div>
      </div>

      <hr />

      {/* Always show in sidebar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Always show in the sidebar:</h2>
          <a href="#" className="text-blue-600 text-sm flex items-center gap-1">
            Learn more <InfoIcon className="w-4 h-4" />
          </a>
        </div>
        <div className="space-y-3 pl-1">
          {[
            {
              key: 'showUnreads',
              label: 'Unreads',
              icon: <ListIcon className="w-4 h-4" />,
            },
            {
              key: 'showHuddles',
              label: 'Huddles',
              icon: <HeadphonesIcon className="w-4 h-4" />,
            },
            {
              key: 'showThreads',
              label: 'Threads',
              icon: <MessageSquareIcon className="w-4 h-4" />,
            },
            {
              key: 'showDrafts',
              label: 'Drafts & sent',
              icon: <SendIcon className="w-4 h-4" />,
            },
          ].map(({ key, label, icon }) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                checked={settings[key as keyof typeof settings] as boolean}
                onCheckedChange={(v) =>
                  setSettings({ ...settings, [key]: !!v })
                }
              />
              <label className="flex items-center gap-2">
                {icon}
                {label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <hr />

      {/* Show */}
      <div className="space-y-2">
        <h2 className="font-medium">Show…</h2>
        <RadioGroup
          value={settings.showConversations}
          onValueChange={(v) =>
            setSettings({ ...settings, showConversations: v })
          }
          className="pl-1 space-y-0"
        >
          {[
            { value: 'all', label: 'All your conversations' },
            { value: 'unreads', label: 'Unreads only' },
            { value: 'mentions', label: 'Mentions only' },
            {
              value: 'unread-starred',
              label: 'Unread conversations, plus your Starred section',
            },
          ].map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.value} id={opt.value} />
              <label htmlFor={opt.value}>{opt.label}</label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <hr />

      {/* Sort */}
      <div className="space-y-2">
        <h2 className="font-medium">Sort…</h2>
        <RadioGroup
          value={settings.sortBy}
          onValueChange={(v) => setSettings({ ...settings, sortBy: v })}
          className="pl-1 space-y-0"
        >
          {[
            { value: 'alphabetical', label: 'Alphabetically' },
            { value: 'recent', label: 'By most recent' },
            {
              value: 'mixed',
              label: 'Channels alphabetically and DMs by recent activity',
            },
          ].map((opt) => (
            <div key={opt.value} className="flex items-center space-x-2">
              <RadioGroupItem value={opt.value} id={opt.value} />
              <label htmlFor={opt.value}>{opt.label}</label>
            </div>
          ))}
        </RadioGroup>
      </div>

      <hr />

      {/* Sidebar behavior */}
      <div className="space-y-1">
        {[
          {
            key: 'showProfilePhotos',
            label: 'Show profile photos next to DMs',
          },
          {
            key: 'separatePrivatePublic',
            label: 'Separate private channels from public ones in sidebar',
          },
          {
            key: 'separateDMsFromChannels',
            label: 'Separate direct messages and apps from channels in sidebar',
          },
          {
            key: 'moveMentionsToTop',
            label: 'Move items with unread Mentions (🔴1) to top of sections',
          },
          {
            key: 'organizeExternal',
            label:
              'Organize external conversations into the External Connections section',
          },
          {
            key: 'moveOnlineToTop',
            label: 'Move online users to the top of the DM section',
          },
          {
            key: 'showMutedOutside',
            label: 'Display muted items outside of sidebar menus',
          },
        ].map((opt) => (
          <div key={opt.key} className="flex items-center space-x-2">
            <Checkbox
              checked={settings[opt.key as keyof typeof settings] as boolean}
              onCheckedChange={(v) =>
                setSettings({ ...settings, [opt.key]: !!v })
              }
            />
            <label>{opt.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
}
