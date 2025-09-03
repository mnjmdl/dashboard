"use client";

import { useState, useEffect } from 'react';

interface AssetTransaction {
  id: number;
  assetId: number;
  action: string;
  oldValue: string | null;
  newValue: string | null;
  userId: number | null;
  notes: string | null;
  createdAt: string;
}

interface AssetTransactionHistoryProps {
  assetId: number;
  isOpen: boolean;
  onClose: () => void;
}

export default function AssetTransactionHistory({ assetId, isOpen, onClose }: AssetTransactionHistoryProps) {
  const [transactions, setTransactions] = useState<AssetTransaction[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && assetId) {
      fetchTransactions();
    }
  }, [isOpen, assetId]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/assets/transactions?assetId=${assetId}&limit=50`);
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      setTransactions(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case 'assigned': return '👤';
      case 'returned': return '↩️';
      case 'maintenance': return '🔧';
      case 'status_change': return '📝';
      case 'created': return '➕';
      case 'updated': return '✏️';
      case 'deleted': return '🗑️';
      default: return '📋';
    }
  };

  const getActionColor = (action: string) => {
    switch (action) {
      case 'assigned': return 'text-blue-600 dark:text-blue-400';
      case 'returned': return 'text-green-600 dark:text-green-400';
      case 'maintenance': return 'text-orange-600 dark:text-orange-400';
      case 'status_change': return 'text-purple-600 dark:text-purple-400';
      case 'created': return 'text-emerald-600 dark:text-emerald-400';
      case 'updated': return 'text-slate-600 dark:text-slate-400';
      case 'deleted': return 'text-red-600 dark:text-red-400';
      default: return 'text-slate-600 dark:text-slate-400';
    }
  };

  const formatValue = (value: string | null) => {
    if (!value) return 'N/A';
    try {
      const parsed = JSON.parse(value);
      if (typeof parsed === 'object') {
        return Object.entries(parsed)
          .map(([key, val]) => `${key}: ${val}`)
          .join(', ');
      }
      return String(parsed);
    } catch {
      return value;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">
              Asset Transaction History
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Asset ID: {assetId}
          </p>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-500 dark:text-red-400">{error}</p>
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-slate-500 dark:text-slate-400">No transaction history found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 border border-gray-200 dark:border-gray-600"
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">{getActionIcon(transaction.action)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`font-medium capitalize ${getActionColor(transaction.action)}`}>
                          {transaction.action.replace('_', ' ')}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400">
                          {formatDate(transaction.createdAt)}
                        </span>
                      </div>

                      {transaction.notes && (
                        <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">
                          {transaction.notes}
                        </p>
                      )}

                      {(transaction.oldValue || transaction.newValue) && (
                        <div className="text-xs space-y-1">
                          {transaction.oldValue && (
                            <div className="text-red-600 dark:text-red-400">
                              <span className="font-medium">From:</span> {formatValue(transaction.oldValue)}
                            </div>
                          )}
                          {transaction.newValue && (
                            <div className="text-green-600 dark:text-green-400">
                              <span className="font-medium">To:</span> {formatValue(transaction.newValue)}
                            </div>
                          )}
                        </div>
                      )}

                      {transaction.userId && (
                        <div className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                          Performed by: User {transaction.userId}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
          <div className="flex items-center justify-between">
            <div className="text-sm text-slate-500 dark:text-slate-400">
              {transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}