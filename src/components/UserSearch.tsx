"use client";

import { useState, useEffect } from 'react';

interface User {
  id: number;
  email: string;
  name: string | null;
  role: string;
  department: string | null;
  isActive: boolean;
}

interface UserSearchProps {
  onUserSelect: (user: User | null) => void;
  selectedUserId?: number | null;
  placeholder?: string;
  disabled?: boolean;
}

export default function UserSearch({
  onUserSelect,
  selectedUserId,
  placeholder = "Search for a user...",
  disabled = false
}: UserSearchProps) {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Load selected user if selectedUserId is provided
  useEffect(() => {
    if (selectedUserId) {
      loadSelectedUser();
    }
  }, [selectedUserId]);

  const loadSelectedUser = async () => {
    if (!selectedUserId) return;

    try {
      const response = await fetch(`/api/users/${selectedUserId}`);
      if (response.ok) {
        const user = await response.json();
        setSelectedUser(user);
        setQuery(user.name || user.email);
      }
    } catch (error) {
      console.error('Error loading selected user:', error);
    }
  };

  const searchUsers = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setUsers([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/users?search=${encodeURIComponent(searchQuery)}&limit=10`);
      if (response.ok) {
        const result = await response.json();
        setUsers(result.data || []);
        setShowDropdown(true);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error searching users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchUsers(value);
  };

  const handleUserSelect = (user: User) => {
    setSelectedUser(user);
    setQuery(user.name || user.email);
    setShowDropdown(false);
    onUserSelect(user);
  };

  const handleClear = () => {
    setSelectedUser(null);
    setQuery('');
    setUsers([]);
    setShowDropdown(false);
    onUserSelect(null);
  };

  const getUserDisplayName = (user: User) => {
    return user.name || user.email;
  };

  const getUserSubtitle = (user: User) => {
    const parts = [];
    if (user.role) parts.push(user.role);
    if (user.department) parts.push(user.department);
    return parts.join(' • ');
  };

  return (
    <div className="relative">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full pl-4 pr-10 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500 dark:bg-gray-700 dark:text-slate-300 dark:border-gray-600 dark:focus:ring-blue-400"
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {loading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
          ) : query ? (
            <button
              onClick={handleClear}
              className="text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          ) : (
            <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>
      </div>

      {showDropdown && users.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg max-h-60 overflow-y-auto dark:bg-gray-800 dark:border-gray-600">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleUserSelect(user)}
              className="w-full px-4 py-3 text-left hover:bg-slate-50 focus:bg-slate-50 focus:outline-none dark:hover:bg-gray-700 dark:focus:bg-gray-700"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-slate-900 truncate dark:text-slate-200">
                    {getUserDisplayName(user)}
                  </div>
                  <div className="text-xs text-slate-500 truncate dark:text-slate-400">
                    {getUserSubtitle(user)}
                  </div>
                </div>
                <div className="ml-3 flex items-center">
                  {!user.isActive && (
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                      Inactive
                    </span>
                  )}
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center ml-2">
                    <span className="text-white text-xs font-bold">
                      {(user.name || user.email).charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {showDropdown && query && users.length === 0 && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-4 dark:bg-gray-800 dark:border-gray-600">
          <p className="text-sm text-slate-500 dark:text-slate-400">No users found matching "{query}"</p>
        </div>
      )}
    </div>
  );
}