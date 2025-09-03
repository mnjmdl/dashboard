"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  sidebarOpen: boolean;
}

export default function Sidebar({ sidebarOpen }: SidebarProps) {
  const pathname = usePathname();

  return (
    <aside className={`bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 shadow-2xl transition-all duration-300 ease-in-out fixed lg:relative z-20 h-screen border-r border-slate-700 ${
      sidebarOpen ? 'w-64' : 'w-16'
    } ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
      <div className={`p-6 ${!sidebarOpen && 'px-4'}`}>
        {sidebarOpen ? (
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
              <span className="text-white text-sm font-bold">IT</span>
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              IT Support
            </h1>
          </div>
        ) : (
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white text-sm font-bold">IT</span>
          </div>
        )}
      </div>
      <nav className="mt-8">
        <div className={`px-4 ${!sidebarOpen && 'px-2'}`}>
          <Link href="/" className={`flex items-center px-4 py-3 text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 group relative ${
            !sidebarOpen && 'px-3 justify-center'
          } ${pathname === '/' ? 'bg-slate-700/50 text-white' : ''}`}>
            <div className={`p-2 rounded-lg transition-colors duration-200 ${
              pathname === '/' ? 'bg-blue-500/20' : 'bg-slate-700/50 group-hover:bg-blue-500/20'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
              </svg>
            </div>
            {sidebarOpen && <span className="ml-3 font-medium">Dashboard</span>}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Dashboard
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent border-l-slate-800"></div>
              </div>
            )}
          </Link>

          <Link href="/tickets" className={`flex items-center px-4 py-3 mt-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 group relative ${
            !sidebarOpen && 'px-3 justify-center'
          } ${pathname === '/tickets' ? 'bg-slate-700/50 text-white' : ''}`}>
            <div className={`p-2 rounded-lg transition-colors duration-200 ${
              pathname === '/tickets' ? 'bg-red-500/20' : 'bg-slate-700/50 group-hover:bg-red-500/20'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            {sidebarOpen && <span className="ml-3 font-medium">Tickets</span>}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Tickets
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent border-l-slate-800"></div>
              </div>
            )}
          </Link>

          <Link href="/assets" className={`flex items-center px-4 py-3 mt-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 group relative ${
            !sidebarOpen && 'px-3 justify-center'
          } ${pathname === '/assets' ? 'bg-slate-700/50 text-white' : ''}`}>
            <div className={`p-2 rounded-lg transition-colors duration-200 ${
              pathname === '/assets' ? 'bg-green-500/20' : 'bg-slate-700/50 group-hover:bg-green-500/20'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            {sidebarOpen && <span className="ml-3 font-medium">Assets</span>}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Assets
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent border-l-slate-800"></div>
              </div>
            )}
          </Link>

          <Link href="/analytics" className={`flex items-center px-4 py-3 mt-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 group relative ${
            !sidebarOpen && 'px-3 justify-center'
          } ${pathname === '/analytics' ? 'bg-slate-700/50 text-white' : ''}`}>
            <div className={`p-2 rounded-lg transition-colors duration-200 ${
              pathname === '/analytics' ? 'bg-purple-500/20' : 'bg-slate-700/50 group-hover:bg-purple-500/20'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            {sidebarOpen && <span className="ml-3 font-medium">Analytics</span>}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Analytics
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent border-l-slate-800"></div>
              </div>
            )}
          </Link>

          <Link href="/users" className={`flex items-center px-4 py-3 mt-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 group relative ${
            !sidebarOpen && 'px-3 justify-center'
          } ${pathname === '/users' ? 'bg-slate-700/50 text-white' : ''}`}>
            <div className={`p-2 rounded-lg transition-colors duration-200 ${
              pathname === '/users' ? 'bg-orange-500/20' : 'bg-slate-700/50 group-hover:bg-orange-500/20'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            {sidebarOpen && <span className="ml-3 font-medium">Users</span>}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Users
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent border-l-slate-800"></div>
              </div>
            )}
          </Link>

          <Link href="/settings" className={`flex items-center px-4 py-3 mt-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-xl transition-all duration-200 group relative ${
            !sidebarOpen && 'px-3 justify-center'
          } ${pathname === '/settings' ? 'bg-slate-700/50 text-white' : ''}`}>
            <div className={`p-2 rounded-lg transition-colors duration-200 ${
              pathname === '/settings' ? 'bg-yellow-500/20' : 'bg-slate-700/50 group-hover:bg-yellow-500/20'
            }`}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            {sidebarOpen && <span className="ml-3 font-medium">Settings</span>}
            {!sidebarOpen && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-slate-800 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
                Settings
                <div className="absolute right-full top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-r-0 border-t-4 border-b-4 border-transparent border-l-slate-800"></div>
              </div>
            )}
          </Link>
        </div>
      </nav>
    </aside>
  );
}