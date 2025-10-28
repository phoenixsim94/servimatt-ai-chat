import { APP_CONFIG } from '../config';

export function truncateTitle(content: string): string {
  return content.split(' ').slice(0, APP_CONFIG.chat.truncateTitleLength).join(' ') + '...';
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString();
}

export function generateTempId(): string {
  return 'temp-' + Date.now();
}