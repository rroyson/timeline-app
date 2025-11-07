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
      <div className="container mx-auto flex max-w-7xl items-center justify-between">
        {/* Logo/Brand */}
        <Link href="/events" className="btn btn-ghost text-xl normal-case">
          <Calendar className="mr-2 h-6 w-6" />
          <span>Timeline</span>
        </Link>

        {/* User menu */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
            <div className="bg-base-300 flex w-10 items-center justify-center rounded-full">
              <span className="text-sm font-semibold">U</span>
            </div>
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu bg-base-100 rounded-box card-elevated z-50 mt-3 w-52 p-2"
          >
            <li>
              <a className="text-base-content/60 cursor-default">
                Signed in as Guest
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
