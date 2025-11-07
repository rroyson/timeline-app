/**
 * Timeline Utilities
 * Helper functions and constants for timeline item management
 */

import type { Database } from '@/types/database';

/**
 * Category labels for timeline items
 */
export const CATEGORY_LABELS: Record<
  Database['public']['Enums']['timeline_item_category'],
  string
> = {
  setup: 'Setup',
  performance: 'Performance',
  catering: 'Catering',
  breakdown: 'Breakdown',
  general: 'General',
};

/**
 * DaisyUI badge classes for timeline item categories
 */
export const CATEGORY_BADGE_CLASSES: Record<
  Database['public']['Enums']['timeline_item_category'],
  string
> = {
  setup: 'badge-info',
  performance: 'badge-secondary',
  catering: 'badge-accent',
  breakdown: 'badge-warning',
  general: 'badge-ghost',
};

/**
 * Combine event date with time input to create ISO timestamp in user's local timezone
 * @param eventDate - Date string in YYYY-MM-DD format or full timestamp
 * @param timeInput - Time string in HH:MM format
 * @returns ISO 8601 timestamp string with timezone
 */
export function combineDateTime(eventDate: string, timeInput: string): string {
  // Extract just the date portion if it's a full timestamp
  const dateOnly = eventDate.split('T')[0];

  // Create a date object in the user's local timezone
  const [hours, minutes] = timeInput.split(':').map(Number);
  const date = new Date(dateOnly);
  date.setHours(hours, minutes, 0, 0);

  // Return ISO string which includes timezone offset
  return date.toISOString();
}

/**
 * Format timestamp for display in 12-hour format
 * @param timestamp - ISO 8601 timestamp string
 * @returns Formatted time string (e.g., "2:30 PM")
 */
export function formatTime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
}

/**
 * Extract time from timestamp for time input field
 * @param timestamp - ISO 8601 timestamp string
 * @returns Time string in HH:MM format
 */
export function extractTime(timestamp: string): string {
  const date = new Date(timestamp);
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}
