/**
 * SideNav Component
 * Props:
 * - links: Array of { label: string, path: string, icon: React.ReactNode }
 * - collapsed: boolean
 * - currentPath: string
 * - onNavigate: (path: string) => void
 * 
 * Displays the side navigation with collapsible functionality
 */
import "../../styles/globals.css"
import { Home, MapPin, History, Wallet, Users, BarChart3, Settings, ChevronLeft, ChevronRight, Zap } from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../ui/utils';

interface NavLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

interface SideNavProps {
  links: NavLink[];
  collapsed: boolean;
  currentPath: string;
  onNavigate: (path: string) => void;
  onToggleCollapse: () => void;
}

export function SideNav({ links, collapsed, currentPath, onNavigate, onToggleCollapse }: SideNavProps) {
  return (
    <aside
      className={cn(
        'fixed left-0 top-16 h-[calc(100vh-4rem)] border-r bg-white transition-all duration-300 z-40',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        {/* Navigation Links */}
        <nav className="flex-1 space-y-1 p-2">
          {links.map((link) => {
            const isActive = currentPath === link.path;
            return (
              <Button
                key={link.path}
                variant={isActive ? 'default' : 'ghost'}
                className={cn(
                  'w-full justify-start gap-3',
                  isActive && 'bg-[#0f766e] hover:bg-[#0f766e]/90',
                  collapsed && 'justify-center'
                )}
                onClick={() => onNavigate(link.path)}
              >
                {link.icon}
                {!collapsed && <span>{link.label}</span>}
              </Button>
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div className="border-t p-2">
          <Button
            variant="ghost"
            className={cn('w-full', collapsed && 'justify-center')}
            onClick={onToggleCollapse}
          >
            {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
            {!collapsed && <span className="ml-2">Collapse</span>}
          </Button>
        </div>
      </div>
    </aside>
  );
}

// Predefined navigation links for different roles
export const driverLinks: NavLink[] = [
  { label: 'Dashboard', path: '/driver/dashboard', icon: <Home className="h-5 w-5" /> },
  { label: 'Find Stations', path: '/driver/stations', icon: <MapPin className="h-5 w-5" /> },
  { label: 'History', path: '/driver/history', icon: <History className="h-5 w-5" /> },
  { label: 'Wallet', path: '/driver/wallet', icon: <Wallet className="h-5 w-5" /> },
  { label: 'Settings', path: '/driver/settings', icon: <Settings className="h-5 w-5" /> },
];

export const staffLinks: NavLink[] = [
  { label: 'Dashboard', path: '/staff/dashboard', icon: <Home className="h-5 w-5" /> },
  { label: 'Stations', path: '/staff/stations', icon: <MapPin className="h-5 w-5" /> },
  { label: 'Active Sessions', path: '/staff/sessions', icon: <Zap className="h-5 w-5" /> },
  { label: 'Transactions', path: '/staff/transactions', icon: <History className="h-5 w-5" /> },
  { label: 'Settings', path: '/staff/settings', icon: <Settings className="h-5 w-5" /> },
];

export const adminLinks: NavLink[] = [
  { label: 'Dashboard', path: '/admin/dashboard', icon: <Home className="h-5 w-5" /> },
  { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="h-5 w-5" /> },
  { label: 'Stations', path: '/admin/stations', icon: <MapPin className="h-5 w-5" /> },
  { label: 'Users', path: '/admin/users', icon: <Users className="h-5 w-5" /> },
  { label: 'Reports', path: '/admin/reports', icon: <History className="h-5 w-5" /> },
  { label: 'Settings', path: '/admin/settings', icon: <Settings className="h-5 w-5" /> },
];
