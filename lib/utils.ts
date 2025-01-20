import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Convert a prisma object into a regular JS object
export function convertToPlainObject(obj: any) {
  return JSON.parse(JSON.stringify(obj))
}