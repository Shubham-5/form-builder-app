import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Text, Disc2, Link2, ArrowDown01 } from "lucide-react";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formFieldIcons = {
  short: <Text size={14} />,
  long: <Text size={14} />,
  "single-select": <Disc2 size={14} />,
  number: <ArrowDown01 size={14} />,
  url: <Link2 size={14} />,
};
