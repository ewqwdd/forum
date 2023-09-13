import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function formatDistanceSimple(date: Date, options?: any): string {
  options = options || {};
  const now = new Date();
  //@ts-ignore
  const timeDifferenceInSeconds = Math.floor((now - date) / 1000);

  if (timeDifferenceInSeconds < 60) {
    return 'just now';
  } else if (timeDifferenceInSeconds < 3600) {
    const minutes = Math.floor(timeDifferenceInSeconds / 60);
    return `${minutes}m${options.addSuffix ? (options.comparison > 0 ? ' in' : ' ago') : ''}`;
  } else if (timeDifferenceInSeconds < 86400) {
    const hours = Math.floor(timeDifferenceInSeconds / 3600);
    return `${hours}h${options.addSuffix ? (options.comparison > 0 ? ' in' : ' ago') : ''}`;
  } else if (timeDifferenceInSeconds < 604800) {
    const days = Math.floor(timeDifferenceInSeconds / 86400);
    return `${days}d${options.addSuffix ? (options.comparison > 0 ? ' in' : ' ago') : ''}`;
  } else if (timeDifferenceInSeconds < 2419200) {
    const weeks = Math.floor(timeDifferenceInSeconds / 604800);
    return `${weeks}w${options.addSuffix ? (options.comparison > 0 ? ' in' : ' ago') : ''}`;
  } else if (timeDifferenceInSeconds < 29030400) {
    const months = Math.floor(timeDifferenceInSeconds / 2419200);
    return `${months}m${options.addSuffix ? (options.comparison > 0 ? ' in' : ' ago') : ''}`;
  } else {
    const years = Math.floor(timeDifferenceInSeconds / 29030400);
    return `${years}y${options.addSuffix ? (options.comparison > 0 ? ' in' : ' ago') : ''}`;
  }
}