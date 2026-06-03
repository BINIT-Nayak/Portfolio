import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const downloadFile = (url: string, filename: string) => {
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
};

export const getResponsiveScale = () => {
  const minScale = 0.55;
  const maxScale = 1;
  const minWidth = 300;
  const maxWidth = 640;
  const width = window.innerWidth;

  if (width >= maxWidth) {
    return maxScale;
  }

  if (width <= minWidth) {
    return minScale;
  }

  const progress = (width - minWidth) / (maxWidth - minWidth);
  return minScale + progress * (maxScale - minScale);
};
