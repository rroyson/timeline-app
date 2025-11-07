'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createTimelineItem, updateTimelineItem } from '@/lib/database';
import {
  combineDateTime,
  extractTime,
  CATEGORY_LABELS,
} from '@/lib/timeline-utils';
import { TEMP_USER_ID } from '@/lib/constants';
import type { Database, Tables } from '@/types/database';

type TimelineItem = Tables<'timeline_items'>;

interface TimelineItemFormProps {
  eventId: string;
  eventDate: string; // YYYY-MM-DD format from event
  item?: TimelineItem; // If editing existing item
  onSuccess?: () => void; // Callback after save
  onCancel?: () => void; // Callback for cancel
  mode?: 'inline' | 'modal'; // Default: inline for add, modal for edit
}

export function TimelineItemForm({
  eventId,
  eventDate,
  item,
  onSuccess,
  onCancel,
  mode = 'inline',
}: TimelineItemFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: item?.title || '',
    start_time: item ? extractTime(item.start_time) : '',
    end_time: item?.end_time ? extractTime(item.end_time) : '',
    category:
      (item?.category as Database['public']['Enums']['timeline_item_category']) ||
      'general',
    description: item?.description || '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      errors.title = 'Title must be at least 3 characters';
    } else if (formData.title.length > 200) {
      errors.title = 'Title must be less than 200 characters';
    }

    if (!formData.start_time) {
      errors.start_time = 'Start time is required';
    }

    if (formData.end_time && formData.start_time) {
      if (formData.end_time <= formData.start_time) {
        errors.end_time = 'End time must be after start time';
      }
    }

    if (formData.description && formData.description.length > 2000) {
      errors.description = 'Description must be less than 2000 characters';
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      // Combine date and time
      const start_time = combineDateTime(eventDate, formData.start_time);
      const end_time = formData.end_time
        ? combineDateTime(eventDate, formData.end_time)
        : null;

      if (item) {
        // Update existing
        await updateTimelineItem(supabase, item.id, {
          title: formData.title,
          start_time,
          end_time,
          category: formData.category,
          description: formData.description || null,
        });
      } else {
        // Create new
        await createTimelineItem(supabase, {
          event_id: eventId,
          title: formData.title,
          start_time,
          end_time,
          category: formData.category,
          description: formData.description || null,
          created_by: TEMP_USER_ID,
          assigned_to: [],
          order_index: 0,
        });
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.refresh(); // Refresh server component data
        // Reset form for add mode
        if (!item) {
          setFormData({
            title: '',
            start_time: '',
            end_time: '',
            category: 'general',
            description: '',
          });
        }
      }
    } catch (err) {
      console.error('Error saving timeline item:', err);
      setError('Failed to save timeline item. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      router.back();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {/* Title */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">
            Title <span className="text-error">*</span>
          </span>
        </label>
        <input
          type="text"
          className={`input input-bordered ${
            fieldErrors.title ? 'input-error' : ''
          }`}
          placeholder="Guest Arrival, Dinner Service, Band Performance..."
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
            if (fieldErrors.title) {
              setFieldErrors({ ...fieldErrors, title: '' });
            }
          }}
          disabled={loading}
        />
        {fieldErrors.title && (
          <label className="label">
            <span className="label-text-alt text-error">
              {fieldErrors.title}
            </span>
          </label>
        )}
      </div>

      {/* Start Time */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">
            Scheduled Time <span className="text-error">*</span>
          </span>
        </label>
        <input
          type="time"
          className={`input input-bordered ${
            fieldErrors.start_time ? 'input-error' : ''
          }`}
          value={formData.start_time}
          onChange={(e) => {
            setFormData({ ...formData, start_time: e.target.value });
            if (fieldErrors.start_time) {
              setFieldErrors({ ...fieldErrors, start_time: '' });
            }
          }}
          disabled={loading}
        />
        {fieldErrors.start_time && (
          <label className="label">
            <span className="label-text-alt text-error">
              {fieldErrors.start_time}
            </span>
          </label>
        )}
      </div>

      {/* End Time */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">End Time (optional)</span>
        </label>
        <input
          type="time"
          className={`input input-bordered ${
            fieldErrors.end_time ? 'input-error' : ''
          }`}
          value={formData.end_time}
          onChange={(e) => {
            setFormData({ ...formData, end_time: e.target.value });
            if (fieldErrors.end_time) {
              setFieldErrors({ ...fieldErrors, end_time: '' });
            }
          }}
          disabled={loading}
        />
        {fieldErrors.end_time && (
          <label className="label">
            <span className="label-text-alt text-error">
              {fieldErrors.end_time}
            </span>
          </label>
        )}
      </div>

      {/* Category */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">
            Category <span className="text-error">*</span>
          </span>
        </label>
        <select
          className="select select-bordered"
          value={formData.category}
          onChange={(e) =>
            setFormData({
              ...formData,
              category: e.target
                .value as Database['public']['Enums']['timeline_item_category'],
            })
          }
          disabled={loading}
        >
          {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div className="form-control">
        <label className="label">
          <span className="label-text">Description (optional)</span>
          {formData.description && (
            <span className="label-text-alt text-base-content/60">
              {formData.description.length}/2000
            </span>
          )}
        </label>
        <textarea
          className={`textarea textarea-bordered h-32 ${
            fieldErrors.description ? 'textarea-error' : ''
          }`}
          placeholder="Add details about this timeline item..."
          value={formData.description}
          onChange={(e) => {
            setFormData({ ...formData, description: e.target.value });
            if (fieldErrors.description) {
              setFieldErrors({ ...fieldErrors, description: '' });
            }
          }}
          disabled={loading}
        />
        {fieldErrors.description && (
          <label className="label">
            <span className="label-text-alt text-error">
              {fieldErrors.description}
            </span>
          </label>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-4">
        {(onCancel || mode === 'modal') && (
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleCancel}
            disabled={loading}
          >
            Cancel
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading && <span className="loading loading-spinner" />}
          {item ? 'Update Item' : 'Add Item'}
        </button>
      </div>
    </form>
  );
}
