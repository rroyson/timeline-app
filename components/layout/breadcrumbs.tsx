'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
}

export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <div className="breadcrumbs mb-6 text-sm">
      <ul>
        {items.map((item, index) => (
          <li key={index}>
            {item.href ? (
              <Link
                href={item.href}
                className="text-base-content/70 hover:text-base-content"
              >
                {item.label}
              </Link>
            ) : (
              <span className="text-base-content">{item.label}</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
