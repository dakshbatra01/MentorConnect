import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

export default function TokenDebugger() {
  const { token, refreshToken, refreshAccessToken, user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [message, setMessage] = useState('');

  const handleRefreshToken = async () => {
    try {
      setRefreshing(true);
      setMessage('');
      await refreshAccessToken();
      setMessage('✅ Token refreshed successfully!');
    } catch (error) {
      setMessage(`❌ Token refresh failed: ${error.message}`);
    } finally {
      setRefreshing(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setMessage('📋 Copied to clipboard!');
    setTimeout(() => setMessage(''), 2000);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="bg-white shadow rounded-lg p-6 mt-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">🔧 Token Debugger</h2>
      
      {message && (
        <div className={`mb-4 p-3 rounded-lg text-sm ${
          message.includes('✅') ? 'bg-green-50 text-green-700' :
          message.includes('❌') ? 'bg-red-50 text-red-700' :
          'bg-blue-50 text-blue-700'
        }`}>
          {message}
        </div>
      )}

      <div className="space-y-4">
        {/* Access Token */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Access Token (JWT)</h3>
            <button
              onClick={() => copyToClipboard(token)}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
            >
              Copy
            </button>
          </div>
          <textarea
            readOnly
            value={token || 'No token available'}
            className="w-full h-20 text-xs font-mono bg-gray-50 border rounded p-2 resize-none"
          />
        </div>

        {/* Refresh Token */}
        <div className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-700">Refresh Token</h3>
            <button
              onClick={() => copyToClipboard(refreshToken)}
              className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded"
            >
              Copy
            </button>
          </div>
          <textarea
            readOnly
            value={refreshToken || 'No refresh token available'}
            className="w-full h-20 text-xs font-mono bg-gray-50 border rounded p-2 resize-none"
          />
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center">
          <button
            onClick={handleRefreshToken}
            disabled={refreshing || !refreshToken}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
          >
            {refreshing ? '🔄 Refreshing...' : '🔄 Refresh Access Token'}
          </button>
        </div>

        {/* Token Info */}
        <div className="text-xs text-gray-500 text-center space-y-1">
          <p>• Access tokens expire in 15 minutes and auto-refresh when needed</p>
          <p>• Refresh tokens expire in 7 days</p>
          <p>• Tokens are stored in localStorage for session persistence</p>
        </div>
      </div>
    </div>
  );
}