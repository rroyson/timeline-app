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
 * Combine event date (YYYY-MM-DD) with time input (HH:MM) to create ISO timestamp
 * @param eventDate - Date string in YYYY-MM-DD format
 * @param timeInput - Time string in HH:MM format
 * @returns ISO 8601 timestamp string
 */
export function combineDateTime(eventDate: string, timeInput: string): string {
  return `${eventDate}T${timeInput}:00`;
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
