import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

const ActivitySidebar = () => {
  const [isUnRead, setIsUnRead] = useState(false);

  return (
    <div>
      <div className="flex justify-between items-center p-2">
        <span className="font-semibold  text-white">Activity</span>
        <div className="flex items-center space-x-2">
          <Label htmlFor="status-read" className="text-slate-200">
            Unreads
          </Label>
          <Switch
            id="status-read"
            checked={isUnRead}
            onCheckedChange={(value) => setIsUnRead(value)}
          />
        </div>
      </div>
    </div>
  );
};

export default ActivitySidebar;
