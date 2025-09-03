"use client";

import { useState, useEffect } from 'react';
import UserSearch from './UserSearch';

interface Asset {
  id: number;
  name: string;
  type: string;
  model: string | null;
  serialNumber: string | null;
  location: string | null;
  status: string;
  assignedToId: number | null;
}

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  department: string | null;
  isActive: boolean;
}

interface BulkAssetAssignmentProps {
  isOpen: boolean;
  onClose: () => void;
  onAssignmentComplete: () => void;
  selectedAssets: Asset[];
}

export default function BulkAssetAssignment({
  isOpen,
  onClose,
  onAssignmentComplete,
  selectedAssets
}: BulkAssetAssignmentProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [assignmentType, setAssignmentType] = useState<'assign' | 'unassign'>('assign');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{
    successful: Asset[];
    failed: { asset: Asset; error: string }[];
  }>({
    successful: [],
    failed: []
  });

  useEffect(() => {
    if (isOpen) {
      setSelectedUser(null);
      setAssignmentType('assign');
      setProgress(0);
      setResults({
        successful: [],
        failed: []
      });
    }
  }, [isOpen]);

  const handleUserSelect = (user: User | null) => {
    setSelectedUser(user);
  };

  const handleAssignment = async () => {
    if (assignmentType === 'assign' && !selectedUser) {
      alert('Please select a user to assign assets to.');
      return;
    }

    setLoading(true);
    setProgress(0);
    const newResults: {
      successful: Asset[];
      failed: { asset: Asset; error: string }[];
    } = {
      successful: [],
      failed: []
    };

    for (let i = 0; i < selectedAssets.length; i++) {
      const asset = selectedAssets[i];

      try {
        const updateData = assignmentType === 'assign'
          ? { assignedToId: selectedUser!.id, status: 'active' }
          : { assignedToId: null, status: 'in_stock' };

        const response = await fetch(`/api/assets/${asset.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updateData),
        });

        if (response.ok) {
          newResults.successful.push(asset);
        } else {
          const errorData = await response.json();
          newResults.failed.push({
            asset,
            error: errorData.error || 'Failed to update asset'
          });
        }
      } catch (error) {
        newResults.failed.push({
          asset,
          error: error instanceof Error ? error.message : 'Network error'
        });
      }

      setProgress(((i + 1) / selectedAssets.length) * 100);
    }

    setResults(newResults);
    setLoading(false);

    if (newResults.failed.length === 0) {
      // All successful
      setTimeout(() => {
        onAssignmentComplete();
        onClose();
      }, 2000);
    }
  };

  const getAvailableAssets = () => {
    if (assignmentType === 'assign') {
      return selectedAssets.filter(asset => !asset.assignedToId);
    }
    return selectedAssets.filter(asset => asset.assignedToId);
  };

  const availableAssets = getAvailableAssets();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">
              Bulk Asset Assignment
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Assignment Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Assignment Type
            </label>
            <div className="flex space-x-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="assign"
                  checked={assignmentType === 'assign'}
                  onChange={(e) => setAssignmentType(e.target.value as 'assign')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Assign to User</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="unassign"
                  checked={assignmentType === 'unassign'}
                  onChange={(e) => setAssignmentType(e.target.value as 'unassign')}
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">Return to Stock</span>
              </label>
            </div>
          </div>

          {/* User Selection (only for assignment) */}
          {assignmentType === 'assign' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Select User to Assign Assets To
              </label>
              <UserSearch
                onUserSelect={handleUserSelect}
                placeholder="Search for a user..."
              />
              {selectedUser && (
                <div className="mt-2 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white text-sm font-bold">
                        {(selectedUser.name || selectedUser.email).charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-700 dark:text-blue-300">
                        {selectedUser.name || selectedUser.email}
                      </p>
                      <p className="text-xs text-blue-600 dark:text-blue-400">
                        {selectedUser.role} • {selectedUser.department || 'No department'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Assets Summary */}
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">
              Assets to {assignmentType === 'assign' ? 'Assign' : 'Return'}
            </h3>
            <div className="space-y-2">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total selected: <span className="font-medium">{selectedAssets.length}</span>
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Available for {assignmentType}: <span className="font-medium">{availableAssets.length}</span>
              </p>
              {availableAssets.length !== selectedAssets.length && (
                <p className="text-sm text-amber-600 dark:text-amber-400">
                  {selectedAssets.length - availableAssets.length} assets will be skipped (already {assignmentType === 'assign' ? 'assigned' : 'in stock'})
                </p>
              )}
            </div>

            {availableAssets.length > 0 && (
              <div className="mt-3 max-h-32 overflow-y-auto">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">Assets to process:</p>
                <div className="space-y-1">
                  {availableAssets.slice(0, 5).map((asset) => (
                    <div key={asset.id} className="text-xs text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-600 px-2 py-1 rounded">
                      {asset.name} ({asset.type})
                    </div>
                  ))}
                  {availableAssets.length > 5 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      ... and {availableAssets.length - 5} more
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Progress Bar (when processing) */}
          {loading && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Processing Assets...
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {Math.round(progress)}%
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Results */}
          {results.successful.length > 0 || results.failed.length > 0 ? (
            <div className="space-y-3">
              {results.successful.length > 0 && (
                <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                  <p className="text-green-700 dark:text-green-300 text-sm font-medium">
                    ✅ Successfully processed {results.successful.length} assets
                  </p>
                </div>
              )}

              {results.failed.length > 0 && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                  <p className="text-red-700 dark:text-red-300 text-sm font-medium mb-2">
                    ❌ Failed to process {results.failed.length} assets:
                  </p>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {results.failed.map((item, index) => (
                      <div key={index} className="text-xs text-red-600 dark:text-red-400">
                        {item.asset.name}: {item.error}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : null}

          {/* Action Buttons */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleAssignment}
              disabled={loading || availableAssets.length === 0 || (assignmentType === 'assign' && !selectedUser)}
              className="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? 'Processing...' : `${assignmentType === 'assign' ? 'Assign' : 'Return'} ${availableAssets.length} Assets`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}