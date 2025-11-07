'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Calendar, Menu } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();

  const isActive = (path: string) => {
    if (path === '/events') {
      return pathname === '/events' || pathname.startsWith('/events');
    }
    return pathname === path;
  };

  return (
    <nav className="gradient-surface border-subtle border-b px-4 py-3 backdrop-blur-sm">
      <div className="container mx-auto max-w-7xl">
        {/* Mobile menu button */}
        <div className="dropdown lg:hidden">
          <label
            tabIndex={0}
            className="btn btn-ghost hover:bg-base-200/80 transition-all-smooth"
          >
            <Menu className="h-5 w-5" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box card-elevated z-50 mt-3 w-52 p-2"
          >
            <li>
              <Link
                href="/events"
                className={cn(
                  'transition-all-smooth',
                  isActive('/events') &&
                    'active gradient-primary text-primary-content font-semibold'
                )}
              >
                <Calendar className="h-4 w-4" />
                Events
              </Link>
            </li>
          </ul>
        </div>

        {/* Logo/Brand */}
        <div className="flex-1">
          <Link
            href="/events"
            className="group btn btn-ghost transition-all-smooth px-2 text-xl normal-case hover:bg-transparent sm:px-4"
          >
            <div className="gradient-primary transition-all-smooth group-hover:shadow-glow mr-2 flex h-9 w-9 items-center justify-center rounded-lg shadow-md">
              <Calendar className="text-primary-content h-5 w-5" />
            </div>
            <span className="from-primary to-secondary hidden bg-gradient-to-r bg-clip-text font-bold text-transparent sm:inline">
              Timeline
            </span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal gap-1 px-1">
            <li>
              <Link
                href="/events"
                className={cn(
                  'transition-all-smooth hover:bg-base-200/80 gap-2 rounded-lg',
                  isActive('/events') && 'bg-base-200 font-semibold shadow-sm'
                )}
              >
                <Calendar className="h-4 w-4" />
                Events
              </Link>
            </li>
          </ul>
        </div>

        {/* User menu placeholder */}
        <div className="flex-none">
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar hover:ring-primary/20 transition-all-smooth hover:ring-2"
            >
              <div className="gradient-primary flex h-10 w-10 items-center justify-center rounded-full shadow-md">
                <span className="text-primary-content text-sm font-bold">
                  U
                </span>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box card-elevated z-50 mt-3 w-52 p-2"
            >
              <li>
                <a className="text-base-content/60 cursor-default hover:bg-transparent">
                  Signed in as Guest
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}
