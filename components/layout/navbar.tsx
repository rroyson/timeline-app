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
    <nav className="navbar bg-base-100 border-base-300 border-b px-4">
      <div className="container mx-auto max-w-7xl">
        {/* Mobile menu button */}
        <div className="dropdown lg:hidden">
          <label tabIndex={0} className="btn btn-ghost">
            <Menu className="h-5 w-5" />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link
                href="/events"
                className={cn(isActive('/events') && 'active')}
              >
                <Calendar className="h-4 w-4" />
                Events
              </Link>
            </li>
          </ul>
        </div>

        {/* Logo/Brand */}
        <div className="flex-1">
          <Link href="/events" className="btn btn-ghost text-xl normal-case">
            <Calendar className="mr-2 h-6 w-6" />
            <span className="hidden sm:inline">Timeline</span>
          </Link>
        </div>

        {/* Desktop navigation */}
        <div className="hidden lg:flex">
          <ul className="menu menu-horizontal px-1">
            <li>
              <Link
                href="/events"
                className={cn(
                  'gap-2',
                  isActive('/events') && 'active font-semibold'
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
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="bg-base-300 flex w-10 items-center justify-center rounded-full">
                <span className="text-sm font-semibold">U</span>
              </div>
            </label>
            <ul
              tabIndex={0}
              className="dropdown-content menu bg-base-100 rounded-box z-50 mt-3 w-52 p-2 shadow"
            >
              <li>
                <a className="text-base-content/60 cursor-default">
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
