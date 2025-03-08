'use client';
import { activitiesAtom } from '@/store/activity.store';
import { differenceInMinutes } from 'date-fns';
import { useAtom } from 'jotai';
import { useEffect } from 'react';

const requestNotificationPermission = async () => {
  if ('Notification' in window && Notification.permission !== 'granted') {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
    }
  } else {
    console.log('Browser does not support notifications.');
  }
};

const showNotification = (content: string) => {
  if (Notification.permission === 'granted') {
    new Notification('Hello!', {
      body: content,
    });
  }
};

export default function BrowserNotification() {
  const [{ activities, isLoading }] = useAtom(activitiesAtom);

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const handleNotification = () => {
    activities?.forEach((activity) => {
      if (
        Math.abs(
          differenceInMinutes(activity.newestNoti._creationTime, new Date())
        ) < 1
      ) {
        showNotification(activity.newestNoti.content);
      }
    });
  };

  useEffect(() => {
    if (!isLoading) {
      handleNotification();
    }

    return () => {
      return;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, activities]);

  return <></>;
}
