"use client";

import { useState, useEffect } from 'react';

interface AnalyticsEvent {
  id: number;
  eventType: string;
  eventData: string | null;
  userId: number | null;
  timestamp: string;
  ipAddress: string | null;
  userAgent: string | null;
}

interface PaginationInfo {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsEvent[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchAnalytics(currentPage, pageSize);
  }, [currentPage, pageSize]);

  const fetchAnalytics = async (page: number = 1, limit: number = 10) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/analytics?page=${page}&limit=${limit}`);
      if (!response.ok) {
        throw new Error('Failed to fetch analytics');
      }
      const data = await response.json();
      setAnalytics(data.data);
      setPagination(data.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getEventStats = () => {
    if (!Array.isArray(analytics)) return [];
    const eventTypes = analytics.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(eventTypes).map(([type, count]) => ({
      type,
      count,
      percentage: Math.round((count / analytics.length) * 100)
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page when changing page size
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500 text-center">
          <p className="text-lg font-semibold">Error loading analytics</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  const eventStats = getEventStats();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">
            Analytics
          </h1>
          <p className="text-slate-500 mt-1 dark:text-slate-400">Track your performance metrics and insights</p>
        </div>
        <div className="flex items-center space-x-3">
          <button className="px-4 py-2 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 dark:bg-gray-800/80 dark:border-gray-700/20 dark:text-slate-200">
            Export Data
          </button>
          <button className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
            Generate Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Total Events</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">{pagination?.totalCount || 0}</p>
              <p className="text-sm text-green-600 font-medium mt-1 dark:text-green-400">Analytics events</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Event Types</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">{eventStats.length}</p>
              <p className="text-sm text-blue-600 font-medium mt-1 dark:text-blue-400">Unique event types</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Users Tracked</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">{Array.isArray(analytics) ? new Set(analytics.filter(a => a.userId).map(a => a.userId)).size : 0}</p>
              <p className="text-sm text-purple-600 font-medium mt-1 dark:text-purple-400">Identified users</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:scale-105 dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Page</p>
              <p className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">{currentPage}</p>
              <p className="text-sm text-orange-600 font-medium mt-1 dark:text-orange-400">of {pagination?.totalPages || 1} pages</p>
            </div>
            <div className="p-3 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl shadow-lg">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Event Types Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">
              Event Types Distribution
            </h3>
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
          </div>
          <div className="space-y-4">
            {eventStats.map((stat, index) => (
              <div key={stat.type} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-orange-500'][index % 4]
                  }`}></div>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{stat.type}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-semibold text-slate-800 dark:text-slate-200">{stat.count}</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">({stat.percentage}%)</span>
                </div>
              </div>
            ))}
            {eventStats.length === 0 && (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">No analytics events recorded yet</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:bg-gray-800/80 dark:border-gray-700/20">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">
              Recent Events
            </h3>
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {(Array.isArray(analytics) ? analytics.slice(0, 10) : []).map((event) => (
              <div key={event.id} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200">{event.eventType}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{formatDate(event.timestamp)}</p>
                  {event.userId && (
                    <p className="text-xs text-blue-600 dark:text-blue-400">User ID: {event.userId}</p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    event.eventType.includes('view') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                    event.eventType.includes('click') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                  }`}>
                    {event.eventType}
                  </span>
                </div>
              </div>
            ))}
            {(!Array.isArray(analytics) || analytics.length === 0) && (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">No recent events</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Raw Data Table */}
      <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:bg-gray-800/80 dark:border-gray-700/20">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">
            Analytics Events
          </h3>
          <div className="flex items-center space-x-2">
            <select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg border border-slate-200 dark:bg-gray-700 dark:text-slate-300 dark:border-gray-600"
            >
              <option value={5}>5 per page</option>
              <option value={10}>10 per page</option>
              <option value={25}>25 per page</option>
              <option value={50}>50 per page</option>
            </select>
            <button
              onClick={() => fetchAnalytics(currentPage, pageSize)}
              className="px-3 py-1 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block md:hidden space-y-4 mb-6">
          {(Array.isArray(analytics) ? analytics : []).map((event) => (
            <div key={event.id} className="bg-slate-50 dark:bg-gray-700/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  event.eventType.includes('view') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  event.eventType.includes('click') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                }`}>
                  {event.eventType}
                </span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{formatDate(event.timestamp)}</span>
              </div>
              <div className="text-sm text-slate-600 dark:text-slate-300">
                <p>User ID: {event.userId || 'Anonymous'}</p>
                {event.ipAddress && <p>IP: {event.ipAddress}</p>}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50/50 dark:bg-gray-700/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">Event Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">User ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider dark:text-slate-400">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/50 dark:divide-gray-700/50">
              {(Array.isArray(analytics) ? analytics : []).map((event) => (
                <tr key={event.id} className="hover:bg-slate-50/50 transition-colors dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      event.eventType.includes('view') ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                      event.eventType.includes('click') ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                      'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {event.eventType}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {event.userId || 'Anonymous'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {formatDate(event.timestamp)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 dark:text-slate-400">
                    {event.ipAddress || 'N/A'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-200/50 dark:border-gray-700/50">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              Showing {((currentPage - 1) * pageSize) + 1} to {Math.min(currentPage * pageSize, pagination.totalCount)} of {pagination.totalCount} events
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-700 dark:text-slate-300 dark:hover:bg-gray-600"
              >
                Previous
              </button>

              {/* Page Numbers */}
              {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                const pageNum = Math.max(1, Math.min(pagination.totalPages - 4, currentPage - 2)) + i;
                if (pageNum > pagination.totalPages) return null;
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                      pageNum === currentPage
                        ? 'bg-blue-500 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-gray-700 dark:text-slate-300 dark:hover:bg-gray-600'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                className="px-3 py-1 text-sm bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors dark:bg-gray-700 dark:text-slate-300 dark:hover:bg-gray-600"
              >
                Next
              </button>
            </div>
          </div>
        )}

        {(Array.isArray(analytics) && analytics.length === 0) && (
          <div className="text-center py-12">
            <p className="text-slate-500 dark:text-slate-400">No analytics data available</p>
            <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Events will appear here as users interact with your application</p>
          </div>
        )}
      </div>
    </div>
  );
}