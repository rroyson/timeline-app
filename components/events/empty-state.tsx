import { Calendar } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <Calendar className="text-base-content/30 mb-4 h-16 w-16" />
      <h3 className="mb-2 text-xl font-semibold">{title}</h3>
      <p className="text-base-content/70 mb-6 max-w-md">{description}</p>
      {actionLabel && onAction && (
        <button className="btn btn-primary" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}
