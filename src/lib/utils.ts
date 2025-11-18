import moment from "moment";
// import "moment/locale/id";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getInitial = (name: string) => {
  if (!name || typeof name !== "string") return null;
  const words = name.trim().split(/\s+/);

  if (words.length === 1) {
    return words[0][0]?.toUpperCase() || null;
  }

  return words.map((word) => word[0]?.toUpperCase()).join("");
};

export const formatDateTime = (
  isoString: string,
  format: string = "DD MMM YYYY, hh:mm A"
) => {
  return moment(isoString).utc().format(format);
};
