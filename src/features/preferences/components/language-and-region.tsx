'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { languages, timezones } from '@/constant/time-language';

export default function LanguageAndTimezoneSettings() {
  const [autoTimezone, setAutoTimezone] = useState(true);
  const [language, setLanguage] = useState('en-uk');
  const [timezone, setTimezone] = useState('UTC+07:00');

  return (
    <div>
      {/* Language section */}
      <div className="space-y-2">
        <Label htmlFor="language" className="font-medium">
          Language
        </Label>
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger id="language" className="w-full">
            <SelectValue placeholder="Select language" />
          </SelectTrigger>
          <SelectContent>
            {languages.map((lang) => (
              <SelectItem key={lang.value} value={lang.value}>
                {lang.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Choose the language you want to use in Slack.
        </p>
      </div>

      {/* Timezone section */}
      <div className="space-y-2">
        <Label htmlFor="timezone" className="font-medium">
          Time zone
        </Label>
        <div className="flex items-center space-x-2">
          <Checkbox
            checked={autoTimezone}
            onCheckedChange={(v) => setAutoTimezone(!!v)}
          />
          <Label>Set time zone automatically</Label>
        </div>
        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger id="timezone" className="w-full">
            <SelectValue placeholder="Select timezone" />
          </SelectTrigger>
          <SelectContent>
            {timezones.map((tz) => (
              <SelectItem key={tz.value} value={tz.value}>
                {tz.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          Slack uses your time zone to send summary and notification emails, for
          times in your activity feeds and for reminders.
        </p>
      </div>
    </div>
  );
}
