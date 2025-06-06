import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatAddress(address: string): string {
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

export function formatEther(wei: string | number, decimals: number = 4): string {
  // Basic implementation - for a production app, use ethers.js formatEther
  const weiNum = typeof wei === 'string' ? parseFloat(wei) : wei;
  const ether = weiNum / 1e18;
  return ether.toFixed(decimals);
}

export function generateSecret(length: number = 10): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}