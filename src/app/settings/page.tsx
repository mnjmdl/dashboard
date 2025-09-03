"use client";

import { useState, useEffect } from 'react';

interface Setting {
  id: number;
  key: string;
  value: string;
  type: string;
}

export default function SettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newSetting, setNewSetting] = useState({ key: '', value: '', type: 'string' });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (!response.ok) {
        throw new Error('Failed to fetch settings');
      }
      const data = await response.json();
      setSettings(data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateSetting = async (key: string, value: string, type: string) => {
    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ key, value, type }),
      });

      if (!response.ok) {
        throw new Error('Failed to update setting');
      }

      const updatedSetting = await response.json();
      setSettings(prev =>
        prev.map(setting =>
          setting.key === key ? updatedSetting : setting
        )
      );
    } catch (error) {
      console.error('Error updating setting:', error);
    } finally {
      setSaving(false);
    }
  };

  const addSetting = async () => {
    if (!newSetting.key || !newSetting.value) return;

    setSaving(true);
    try {
      const response = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newSetting),
      });

      if (!response.ok) {
        throw new Error('Failed to add setting');
      }

      const addedSetting = await response.json();
      setSettings(prev => [...prev, addedSetting]);
      setNewSetting({ key: '', value: '', type: 'string' });
    } catch (error) {
      console.error('Error adding setting:', error);
    } finally {
      setSaving(false);
    }
  };

  const deleteSetting = async (key: string) => {
    try {
      const response = await fetch(`/api/settings/${encodeURIComponent(key)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete setting');
      }

      setSettings(prev => prev.filter(setting => setting.key !== key));
    } catch (error) {
      console.error('Error deleting setting:', error);
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent dark:from-slate-200 dark:to-slate-400">
            Settings Management
          </h1>
          <p className="text-slate-500 mt-1 dark:text-slate-400">Manage application settings and preferences</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={fetchSettings}
            className="px-4 py-2 bg-white/80 backdrop-blur-xl rounded-xl shadow-lg border border-white/20 hover:shadow-xl transition-all duration-200 dark:bg-gray-800/80 dark:border-gray-700/20 dark:text-slate-200"
          >
            Refresh
          </button>
          <button
            onClick={() => setSettings([])}
            className="px-4 py-2 bg-red-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add New Setting */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:bg-gray-800/80 dark:border-gray-700/20">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">Add New Setting</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Setting key"
                value={newSetting.key}
                onChange={(e) => setNewSetting(prev => ({ ...prev, key: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-slate-200"
              />
              <input
                type="text"
                placeholder="Setting value"
                value={newSetting.value}
                onChange={(e) => setNewSetting(prev => ({ ...prev, value: e.target.value }))}
                className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-slate-200"
              />
              <div className="flex space-x-2">
                <select
                  value={newSetting.type}
                  onChange={(e) => setNewSetting(prev => ({ ...prev, type: e.target.value }))}
                  className="flex-1 px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-slate-200"
                >
                  <option value="string">String</option>
                  <option value="number">Number</option>
                  <option value="boolean">Boolean</option>
                  <option value="json">JSON</option>
                </select>
                <button
                  onClick={addSetting}
                  disabled={saving || !newSetting.key || !newSetting.value}
                  className="px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>

          {/* Settings List */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:bg-gray-800/80 dark:border-gray-700/20">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-6">Application Settings</h3>
            <div className="space-y-4">
              {settings.map((setting) => (
                <div key={setting.id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-gray-700/50 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-slate-800 dark:text-slate-200">{setting.key}</span>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        setting.type === 'string' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                        setting.type === 'number' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                        setting.type === 'boolean' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                        'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
                      }`}>
                        {setting.type}
                      </span>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{setting.value}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        const newValue = prompt(`Update ${setting.key}:`, setting.value);
                        if (newValue !== null && newValue !== setting.value) {
                          updateSetting(setting.key, newValue, setting.type);
                        }
                      }}
                      className="p-2 text-blue-600 hover:text-blue-900 transition-colors dark:text-blue-400 dark:hover:text-blue-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete setting "${setting.key}"?`)) {
                          deleteSetting(setting.key);
                        }
                      }}
                      className="p-2 text-red-600 hover:text-red-900 transition-colors dark:text-red-400 dark:hover:text-red-300"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
              {settings.length === 0 && (
                <div className="text-center py-12">
                  <p className="text-slate-500 dark:text-slate-400">No settings configured yet</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">Add your first setting above</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Settings Stats */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:bg-gray-800/80 dark:border-gray-700/20">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Settings Overview</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Total Settings</span>
                <span className="text-lg font-bold text-slate-800 dark:text-slate-200">{settings.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">String Values</span>
                <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
                  {settings.filter(s => s.type === 'string').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Number Values</span>
                <span className="text-lg font-bold text-green-600 dark:text-green-400">
                  {settings.filter(s => s.type === 'number').length}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Boolean Values</span>
                <span className="text-lg font-bold text-purple-600 dark:text-purple-400">
                  {settings.filter(s => s.type === 'boolean').length}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:bg-gray-800/80 dark:border-gray-700/20">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  const key = prompt('Setting key:');
                  const value = prompt('Setting value:');
                  if (key && value) {
                    updateSetting(key, value, 'string');
                  }
                }}
                className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-left dark:bg-gray-700 dark:text-slate-300 dark:hover:bg-gray-600"
              >
                Add Setting
              </button>
              <button
                onClick={() => {
                  if (confirm('Export all settings to console?')) {
                    console.log('Settings:', settings);
                  }
                }}
                className="w-full px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors text-left dark:bg-gray-700 dark:text-slate-300 dark:hover:bg-gray-600"
              >
                Export Settings
              </button>
              <button
                onClick={() => {
                  if (confirm('This will delete all settings. Are you sure?')) {
                    Promise.all(settings.map(s => deleteSetting(s.key))).then(fetchSettings);
                  }
                }}
                className="w-full px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-left dark:bg-red-900 dark:text-red-300 dark:hover:bg-red-800"
              >
                Clear All Settings
              </button>
            </div>
          </div>

          {/* Database Info */}
          <div className="bg-white/80 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-white/20 dark:bg-gray-800/80 dark:border-gray-700/20">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-4">Database Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Database</span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">SQLite</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Tables</span>
                <span className="text-sm font-medium text-slate-800 dark:text-slate-200">3</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Status</span>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full dark:bg-green-900 dark:text-green-200">Connected</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}