'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { useEffect, useState } from 'react';

import { useUpdateNavigation } from '../api/use-update-navigation';
import { useWorkspaceId } from '@/hooks/use-workspace-id';
import { useAtom } from 'jotai';
import { preferencesAtom } from '@/store/preferences.store';
import { navigationItems } from '@/constant/navigation';

export const Navigation = () => {
  const workspaceId = useWorkspaceId();
  const [{ preferences }] = useAtom(preferencesAtom);
  const [selected, setSelected] = useState(['home', 'dms', 'activity']);

  const toggleTab = (id: string) => {
    setSelected((prev) => {
      const newSelected = prev.includes(id)
        ? prev.filter((t) => t !== id)
        : [...prev, id];
      updateNavigation(
        {
          navigation: newSelected,
          workspaceId,
        },
        {}
      );
      return newSelected;
    });
  };

  const { mutate: updateNavigation } = useUpdateNavigation();

  useEffect(() => {
    if (preferences?.navigation) setSelected(preferences?.navigation);
  }, [preferences?.navigation]);

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium">
        Show these tabs in the navigation bar:
      </p>
      <p className="text-xs text-muted-foreground">
        At smaller window sizes, not all selected tabs may appear.
      </p>

      <div className="space-y-2 pt-2">
        {navigationItems.map((tab) => {
          const Icon = tab.icon;
          return (
            <div
              key={tab.id}
              className="flex items-center space-x-2 cursor-pointer"
              onClick={() => toggleTab(tab.id)}
            >
              <Checkbox
                checked={selected.includes(tab.id)}
                disabled={tab.disable}
                className="data-[state=checked]:bg-sky-500 data-[state=checked]:border-none data-[state=checked]:rounded-none"
              />
              <Icon className="w-4 h-4 " />
              <span>{tab.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
