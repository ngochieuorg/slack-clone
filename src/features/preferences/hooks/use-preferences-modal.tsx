import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import Preferences from '../components/preferences';

interface UsePreferencesModalProps {
  trigger: React.ReactNode;
}

const usePreferencesModal = ({ trigger }: UsePreferencesModalProps) => {
  const [open, setOpen] = useState<boolean | undefined>(false);

  const component = (
    <Dialog open={open} onOpenChange={(value) => setOpen(value)}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="flex flex-col p-0 max-w-3xl">
        <DialogHeader className="border-b p-3 py-6">
          <DialogTitle className="">Preferences</DialogTitle>
          <DialogDescription className=" text-sm font-extralight"></DialogDescription>
        </DialogHeader>
        <div className="px-3 pb-3">
          <Preferences />
        </div>
      </DialogContent>
    </Dialog>
  );
  return { component, setOpen };
};

export default usePreferencesModal;
