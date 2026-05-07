import { Link, Outlet, useLocation } from 'react-router-dom';
import { LayoutDashboard, FileText, BarChart3 } from 'lucide-react';
import { Header } from '../components/Header';
import { NotificationBell } from '../components/NotificationBell';
import { cn } from '../lib/utils';

export function DashboardLayout() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAdmin = user.role === 'admin';

  const navigation = [
    ...(isAdmin ? [{ name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard }] : []),
    { name: 'Surveys', href: '/dashboard/surveys', icon: FileText },
    ...(isAdmin ? [{ name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 }] : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="text-xl font-bold">Survey App</h1>
        <NotificationBell />
      </div>
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden md:flex md:w-64 md:flex-col">
          <div className="flex flex-col flex-grow pt-5 overflow-y-auto bg-white border-r min-h-[calc(100vh-64px)]">
            <div className="px-4 mt-2">
              <p className="text-xs text-gray-500">
                {user.username} ({isAdmin ? 'Admin' : 'User'})
              </p>
            </div>
            <div className="mt-8 flex-grow flex flex-col">
              <nav className="flex-1 px-2 space-y-1">
                {navigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      to={item.href}
                      className={cn(
                        'group flex items-center px-2 py-2 text-sm font-medium rounded-md',
                        isActive
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                      )}
                    >
                      <item.icon
                        className={cn(
                          'mr-3 flex-shrink-0 h-5 w-5',
                          isActive ? 'text-gray-900' : 'text-gray-400 group-hover:text-gray-500'
                        )}
                      />
                      {item.name}
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-y-auto">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
