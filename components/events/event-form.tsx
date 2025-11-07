'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { createEvent, updateEvent } from '@/lib/database';
import { TEMP_USER_ID } from '@/lib/constants';
import type { Database } from '@/types/database';

type Event = Database['public']['Tables']['events']['Row'];

interface EventFormProps {
  event?: Event;
  onSuccess?: (event: Event) => void;
  onCancel?: () => void;
}

export function EventForm({ event, onSuccess, onCancel }: EventFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: event?.name || '',
    event_date: event?.event_date || '',
    location: event?.location || '',
    description: event?.description || '',
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) {
      errors.name = 'Event name is required';
    } else if (formData.name.length < 3) {
      errors.name = 'Event name must be at least 3 characters';
    } else if (formData.name.length > 200) {
      errors.name = 'Event name must be less than 200 characters';
    }

    if (!formData.event_date) {
      errors.event_date = 'Event date is required';
    }

    if (formData.location && formData.location.length > 500) {
      errors.location = 'Location must be less than 500 characters';
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

      if (event) {
        // Update existing event
        await updateEvent(supabase, event.id, {
          name: formData.name,
          event_date: formData.event_date,
          location: formData.location || null,
          description: formData.description || null,
        });

        const updatedEvent = { ...event, ...formData };

        if (onSuccess) {
          onSuccess(updatedEvent);
        } else {
          router.push(`/events/${event.id}`);
        }
      } else {
        // Create new event
        const newEvent = await createEvent(supabase, {
          name: formData.name,
          event_date: formData.event_date,
          location: formData.location || null,
          description: formData.description || null,
          created_by: TEMP_USER_ID,
          status: 'draft',
        });

        if (onSuccess) {
          onSuccess(newEvent);
        } else {
          router.push(`/events/${newEvent.id}`);
        }
      }
    } catch (err) {
      console.error('Error saving event:', err);
      setError('Failed to save event. Please try again.');
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

      <div className="form-control">
        <label className="label">
          <span className="label-text">
            Event Name <span className="text-error">*</span>
          </span>
        </label>
        <input
          type="text"
          className={`input input-bordered ${
            fieldErrors.name ? 'input-error' : ''
          }`}
          placeholder="Annual Corporate Gala"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            if (fieldErrors.name) {
              setFieldErrors({ ...fieldErrors, name: '' });
            }
          }}
          disabled={loading}
        />
        {fieldErrors.name && (
          <label className="label">
            <span className="label-text-alt text-error">
              {fieldErrors.name}
            </span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">
            Event Date <span className="text-error">*</span>
          </span>
        </label>
        <input
          type="date"
          className={`input input-bordered ${
            fieldErrors.event_date ? 'input-error' : ''
          }`}
          value={formData.event_date}
          onChange={(e) => {
            setFormData({ ...formData, event_date: e.target.value });
            if (fieldErrors.event_date) {
              setFieldErrors({ ...fieldErrors, event_date: '' });
            }
          }}
          disabled={loading}
        />
        {fieldErrors.event_date && (
          <label className="label">
            <span className="label-text-alt text-error">
              {fieldErrors.event_date}
            </span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Location</span>
        </label>
        <input
          type="text"
          className={`input input-bordered ${
            fieldErrors.location ? 'input-error' : ''
          }`}
          placeholder="Grand Ballroom, Downtown Convention Center"
          value={formData.location}
          onChange={(e) => {
            setFormData({ ...formData, location: e.target.value });
            if (fieldErrors.location) {
              setFieldErrors({ ...fieldErrors, location: '' });
            }
          }}
          disabled={loading}
        />
        {fieldErrors.location && (
          <label className="label">
            <span className="label-text-alt text-error">
              {fieldErrors.location}
            </span>
          </label>
        )}
      </div>

      <div className="form-control">
        <label className="label">
          <span className="label-text">Description</span>
        </label>
        <textarea
          className={`textarea textarea-bordered h-32 ${
            fieldErrors.description ? 'textarea-error' : ''
          }`}
          placeholder="Describe the event, its purpose, and any important details..."
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

      <div className="flex justify-end gap-4">
        {(onCancel || !event) && (
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
          {event ? 'Update Event' : 'Create Event'}
        </button>
      </div>
    </form>
  );
}
