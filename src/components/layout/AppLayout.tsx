import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppRedux';
import { openSidebar, closeSidebar } from '../../store/uiSlice';

export function AppLayout() {
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen);
  const dispatch = useAppDispatch();

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-ink-900/40 backdrop-blur-sm"
            onClick={() => dispatch(closeSidebar())}
          />
          <div className="relative z-50 flex h-full">
            <Sidebar onClose={() => dispatch(closeSidebar())} />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Mobile topbar */}
        <header className="lg:hidden flex items-center gap-3 px-4 h-14 bg-white border-b border-surface-200">
          <button
            onClick={() => dispatch(openSidebar())}
            className="p-1.5 rounded-md text-ink-500 hover:bg-surface-100"
          >
            <Menu size={20} />
          </button>
          <span className="font-semibold text-ink-900 text-sm">ExpenseTrack</span>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-6xl mx-auto p-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
