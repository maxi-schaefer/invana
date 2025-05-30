import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getBadgeStyle(status: string): string {
  switch (status.toLowerCase()) {

    // Health status badget
    case "up-to-date":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "outdated":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    case "error":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"

    // Environment status badge
    case "production":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    case "staging":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "development":
      return "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-900/20 dark:text-fuchsia-400"

    // Script category badge
    case "docker":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    case "kubernetes":
      return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/20 dark:text-cyan-400"
    case "postgresql":
      return "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-400"
    case "mysql":
      return "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400"
    case "mongodb":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
    case "redis":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    case "nginx":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
    case "apache":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "haproxy":
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
    case "node.js":
      return "bg-blue-200 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
    case "python":
      return "bg-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
    case "ruby":
      return "bg-red-200 text-red-800 dark:bg-red-900/20 dark:text-red-400"
    case "java":
      return "bg-purple-200 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400"
    case "go":
      return "bg-green-200 text-green-800 dark:bg-green-900/20 dark:text-green-400"

    // Server status badge
    case "connected":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"

    default:
      return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400"
  }
}

export function timeAgo(timestamp: string) {
  const now: any = new Date();
  const date: any = new Date(timestamp);
  const diffInSeconds = Math.floor((now - date) / 1000);

  const units = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hour", seconds: 3600 },
      { label: "minute", seconds: 60 },
      { label: "second", seconds: 1 },
  ];

  for (const unit of units) {
      const amount = Math.floor(diffInSeconds / unit.seconds);
      if (amount >= 1) {
          return `${amount} ${unit.label}${amount > 1 ? "s" : ""} ago`;
      }
  }

  return "just now";
}
