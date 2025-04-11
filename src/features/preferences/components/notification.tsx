'use client';

import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Bell } from 'lucide-react';
import { useState } from 'react';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

export default function NotificationSettings() {
  const [messageSetting, setMessageSetting] = useState('mentions');
  const [mobileSettings, setMobileSettings] = useState(false);
  const [huddleNotify, setHuddleNotify] = useState(true);
  const [replyNotify, setReplyNotify] = useState(true);

  return (
    <div className="space-y-6 max-w-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="font-medium">
            We strongly recommend enabling notifications so that you’ll know
            when important activity happens in your Slack workspace.
          </p>
        </div>
      </div>
      <div className="flex justify-between items-start">
        <Button variant="default" className="flex gap-2 bg-[#007a5a]">
          <Bell className="w-4 h-4" />
          Enable Desktop Notifications
        </Button>
        <p className=" text-sky-800">About notifications</p>
      </div>
      <div className="space-y-2">
        <p className="text-sm font-medium">Notify me about…</p>
        <RadioGroup
          value={messageSetting}
          onValueChange={setMessageSetting}
          className="space-y-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="all" />
            <label htmlFor="all" className="text-sm">
              All new messages
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="mentions" id="mentions" />
            <label htmlFor="mentions" className="text-sm">
              Direct messages, mentions & keywords
            </label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="none" id="none" />
            <label htmlFor="none" className="text-sm">
              Nothing
            </label>
          </div>
        </RadioGroup>
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="mobile"
          checked={mobileSettings}
          onCheckedChange={(val) => setMobileSettings(!!val)}
        />
        <label htmlFor="mobile" className="text-sm">
          Use different settings for my mobile devices
        </label>
      </div>
      <Separator />
      <div className=" space-y-2">
        <div className="flex items-center space-x-2">
          <Checkbox
            id="huddle"
            checked={huddleNotify}
            onCheckedChange={(val) => setHuddleNotify(!!val)}
          />
          <label htmlFor="huddle" className="text-sm">
            Notify me when a huddle starts in one of my channels
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="replies"
            checked={replyNotify}
            onCheckedChange={(val) => setReplyNotify(!!val)}
          />
          <label htmlFor="replies" className="text-sm">
            Notify me about replies to threads I’m following
          </label>
        </div>
      </div>
      <Separator />
      <Keywords />
      <Separator />
      <NotifySchedule />
      <Separator />
      <SoundAndAppearance />
      <Separator />
    </div>
  );
}

const Keywords = () => {
  const [keywords, setKeywords] = useState('');
  return (
    <div className="space-y-2">
      <Label>My keywords</Label>
      <p className="text-sm text-muted-foreground">
        Show a badge (
        <span className="inline-block px-2 py-0.5 text-xs bg-black text-white rounded">
          1
        </span>
        ) in my channel list when someone uses one of my keywords:
      </p>
      <Textarea
        value={keywords}
        onChange={(e) => setKeywords(e.target.value)}
        placeholder="e.g. urgent, design, launch"
      />
      <p className="text-xs text-muted-foreground">
        Use commas to separate each keyword. Keywords are not case sensitive.
      </p>
    </div>
  );
};

const days = ['Every day', 'Weekdays', 'Weekends'];
const times = Array.from({ length: 24 * 2 }, (_, i) => {
  const hour = Math.floor(i / 2);
  const minutes = i % 2 === 0 ? '00' : '30';
  const label = `${((hour + 11) % 12) + 1}:${minutes} ${hour < 12 ? 'AM' : 'PM'}`;
  return label;
});

const NotifySchedule = () => {
  const [selectedDay, setSelectedDay] = useState('Every day');
  const [fromTime, setFromTime] = useState('8:00 AM');
  const [toTime, setToTime] = useState('10:00 PM');
  const [reminderTime, setReminderTime] = useState('9:00 AM');

  return (
    <>
      <div className="space-y-4">
        <div className="space-y-1">
          <Label>Notification schedule</Label>
          <p className="text-sm text-muted-foreground">
            You’ll only receive notifications in the hours you choose. Outside
            of those times, notifications will be paused.
          </p>
        </div>
        <div>
          <Label className="w-32">Allow notifications:</Label>
          <div className="flex flex-col md:flex-row gap-4 items-center">
            <Select value={selectedDay} onValueChange={setSelectedDay}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Select day" />
              </SelectTrigger>
              <SelectContent>
                {days.map((day) => (
                  <SelectItem key={day} value={day}>
                    {day}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={fromTime} onValueChange={setFromTime}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {times.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>to</span>
            <Select value={toTime} onValueChange={setToTime}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {times.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {/* Default reminder time */}
        <div className="">
          <Label className="w-64">
            Set a default time for reminder notifications:
          </Label>
          <Select value={reminderTime} onValueChange={setReminderTime}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {times.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <p className="text-xs text-muted-foreground">
          Reminders you set for a specific day (like “tomorrow”) will be sent at
          the time you select.
        </p>
      </div>
    </>
  );
};

const notificationSounds = ['Boop', 'Boop Plus', 'Ding', 'Knock'];
const mobileNotificationOptions = [
  "as soon as I'm inactive",
  'after 5 minutes',
  'after 10 minutes',
  'never',
];

const SoundAndAppearance = () => {
  const [settings, setSettings] = useState({
    threadReplies: true,
    previewMessage: true,
    muteAll: false,
    muteHuddles: false,
    sound: 'Boop Plus',
    mobileNotify: "as soon as I'm inactive",
    emailNotify: true,
    emailFreq: '15',
    inactive30Days: true,
  });
  return (
    <>
      <div>
        <h2 className="font-semibold text-lg mb-2">Sound & appearance</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Choose how notifications look, sound, and behave.
        </p>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              checked={settings.threadReplies}
              onCheckedChange={(v) =>
                setSettings({ ...settings, threadReplies: !!v })
              }
            />
            <label>Include thread replies in badge count on Activity</label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={settings.previewMessage}
              onCheckedChange={(v) =>
                setSettings({ ...settings, previewMessage: !!v })
              }
            />
            <label>
              Include a preview of the message in each notification{' '}
              <span className="text-muted-foreground">
                (disable this for extra privacy)
              </span>
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={settings.muteAll}
              onCheckedChange={(v) =>
                setSettings({ ...settings, muteAll: !!v })
              }
            />
            <label>Mute all messaging sounds from Slack</label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              checked={settings.muteHuddles}
              onCheckedChange={(v) =>
                setSettings({ ...settings, muteHuddles: !!v })
              }
            />
            <label>Mute all huddle sounds from Slack</label>
          </div>

          {/* Select sound */}
          <div className="">
            <Label className="w-48">Notification sound (huddles)</Label>
            <Select
              value={settings.sound}
              onValueChange={(v) => setSettings({ ...settings, sound: v })}
            >
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder="Select sound" />
              </SelectTrigger>
              <SelectContent>
                {notificationSounds.map((sound) => (
                  <SelectItem key={sound} value={sound}>
                    {sound}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      <hr />
      <div className="space-y-4">
        <h2 className="font-semibold text-lg">
          When I&lsquo;m not active on desktop ...
        </h2>
        <div className="">
          <Label className="w-56">
            Send notifications to my mobile devices:
          </Label>
          <Select
            value={settings.mobileNotify}
            onValueChange={(v) => setSettings({ ...settings, mobileNotify: v })}
          >
            <SelectTrigger className="w-[240px]">
              <SelectValue placeholder="Select" />
            </SelectTrigger>
            <SelectContent>
              {mobileNotificationOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Email notifications */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={settings.emailNotify}
            onCheckedChange={(v) =>
              setSettings({ ...settings, emailNotify: !!v })
            }
          />
          <Label>
            Send me email notifications for mentions and direct messages
          </Label>
        </div>

        <RadioGroup
          value={settings.emailFreq}
          onValueChange={(v) => setSettings({ ...settings, emailFreq: v })}
          className="pl-6 space-y-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="15" id="r1" />
            <Label htmlFor="r1">once every 15 minutes</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="60" id="r2" />
            <Label htmlFor="r2">once an hour</Label>
          </div>
        </RadioGroup>
      </div>
      {/* Inactivity 30+ days */}
      <div className="flex items-center space-x-2">
        <Checkbox
          checked={settings.inactive30Days}
          onCheckedChange={(v) =>
            setSettings({ ...settings, inactive30Days: !!v })
          }
        />
        <Label>
          Send me a mobile notification, summarizing activity I’ve missed
        </Label>
      </div>
    </>
  );
};
