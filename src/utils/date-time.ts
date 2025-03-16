import {
  format,
  isToday,
  isYesterday,
  isThisMinute,
  isThisHour,
  formatDistanceToNow,
} from 'date-fns';

export const formatFulltime = (date: Date) => {
  return `${isToday(date) ? 'Today' : isYesterday(date) ? 'Yesterday' : format(date, 'MMM d, yyyy')} at ${format(date, 'h:mm:ss a')}`;
};

export const formatDateLabel = (dateStr: string) => {
  const date = new Date(dateStr);
  if (isToday(date)) return 'Today';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'EEEE, MMMM d');
};

export const formatDateNotiTime = (date: Date, formatType = 'EEEE, MMMM d') => {
  if (isThisMinute(date)) return `Just now`;
  if (isThisHour(date)) return `${formatDistanceToNow(date)}`;
  if (isToday(date)) return `${format(date, 'h:mm a')}`;
  if (isYesterday(date)) return 'Yesterday';
  return format(date, formatType);
};
