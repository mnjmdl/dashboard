"use client";

import { useState, useEffect } from 'react';

interface DashboardStats {
  users: number;
  analytics: number;
  settings: number;
  recentUsers: Array<{
    id: number;
    email: string;
    name: string | null;
    createdAt: string;
  }>;
  recentAnalytics: Array<{
    id: number;
    eventType: string;
    timestamp: string;
  }>;
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    users: 0,
    analytics: 0,
    settings: 0,
    recentUsers: [],
    recentAnalytics: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [usersRes, analyticsRes, settingsRes] = await Promise.all([
        fetch('/api/users'),
        fetch('/api/analytics?limit=5'),
        fetch('/api/settings')
      ]);

      const [users, analytics, settings] = await Promise.all([
        usersRes.json(),
        analyticsRes.json(),
        settingsRes.json()
      ]);

      setStats({
        users: Array.isArray(users) ? users.length : 0,
        analytics: Array.isArray(analytics) ? analytics.length : 0,
        settings: Array.isArray(settings) ? settings.length : 0,
        recentUsers: Array.isArray(users) ? users.slice(0, 3) : [],
        recentAnalytics: Array.isArray(analytics) ? analytics.slice(0, 3) : []
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffMinutes = Math.floor(diffTime / (1000 * 60));

    if (diffMinutes < 60) {
      return `${diffMinutes}m ago`;
    } else if (diffMinutes < 1440) {
      return `${Math.floor(diffMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffMinutes / 1440)}d ago`;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Total Users</p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">{stats.users}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Analytics Events</p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">{stats.analytics}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Settings</p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">{stats.settings}</p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="flex items-center">
            <div className="p-2 sm:p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <div className="ml-3 sm:ml-4">
              <p className="text-xs sm:text-sm font-medium text-slate-500 dark:text-slate-400">Database</p>
              <p className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">SQLite</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">Recent Users</h3>
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {stats.recentUsers.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-bold">
                      {(user.name || user.email)[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{user.name || 'No name'}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-gray-600 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                  {formatDate(user.createdAt)}
                </span>
              </div>
            ))}
            {stats.recentUsers.length === 0 && (
              <div className="text-center py-6 sm:py-8">
                <p className="text-slate-500 dark:text-slate-400">No users yet</p>
                <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">Users will appear here when registered</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-4 sm:p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">Recent Analytics</h3>
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {stats.recentAnalytics.map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                    event.eventType.includes('view') ? 'bg-blue-500' :
                    event.eventType.includes('click') ? 'bg-green-500' :
                    'bg-purple-500'
                  }`}>
                    <span className="text-white text-xs font-bold">
                      {event.eventType[0].toUpperCase()}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{event.eventType}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">Analytics event</p>
                  </div>
                </div>
                <span className="text-xs text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-gray-600 px-2 py-1 rounded-full flex-shrink-0 ml-2">
                  {formatDate(event.timestamp)}
                </span>
              </div>
            ))}
            {stats.recentAnalytics.length === 0 && (
              <div className="text-center py-6 sm:py-8">
                <p className="text-slate-500 dark:text-slate-400">No analytics events yet</p>
                <p className="text-xs sm:text-sm text-slate-400 dark:text-slate-500 mt-1">Events will appear here as users interact</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Database Status */}
      <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 dark:bg-gray-800/80 dark:border-gray-700/20">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-slate-200/50 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            <h3 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">Database Status</h3>
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base">SQLite Database</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Local file-based storage</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base">Connected</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Database is operational</p>
            </div>
            <div className="text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-800 dark:text-slate-200 text-sm sm:text-base">Prisma ORM</h4>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">Type-safe database access</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
