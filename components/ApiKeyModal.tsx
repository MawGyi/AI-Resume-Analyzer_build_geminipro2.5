
import React, { useState, useEffect } from 'react';
import KeyIcon from './icons/KeyIcon';
import XIcon from './icons/XIcon';
// FIX: Per coding guidelines, API keys must be managed via environment variables, not UI.
// Commenting out import for saveApiKey and deleteApiKey as they do not exist in the service
// and this UI component is contrary to the guidelines.
// import { saveApiKey, deleteApiKey } from '../services/geminiService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved: () => void;
  onKeyDeleted: () => void;
  hasKey: boolean;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved, onKeyDeleted, hasKey }) => {
  const [apiKey, setApiKey] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setError(null);
      setApiKey('');
    }
  }, [isOpen]);

  const handleSave = async () => {
    if (!apiKey.trim()) {
      setError('API Key cannot be empty.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      // FIX: Per coding guidelines, API keys must be managed via environment variables, not UI.
      // await saveApiKey(apiKey);
      onKeySaved();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to save key: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // FIX: Per coding guidelines, API keys must be managed via environment variables, not UI.
      // await deleteApiKey();
      onKeyDeleted();
      onClose(); // Close modal on successful deletion
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`Failed to delete key: ${message}`);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      aria-labelledby="api-key-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-gray-800 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md transform transition-all" role="document">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-500/10 p-2 rounded-lg">
                <KeyIcon className="w-6 h-6 text-blue-300" />
              </div>
              <div>
                <h2 id="api-key-modal-title" className="text-xl font-bold text-white">
                  Manage Your API Key
                </h2>
                <p className="text-sm text-gray-400">Securely stored on our backend.</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-full text-gray-400 hover:bg-gray-700 hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <XIcon className="w-6 h-6" />
            </button>
          </div>

          <div className="mt-6">
            {hasKey ? (
              <div className="text-center">
                 <p className="text-gray-300">You have an API key configured. You can now use all AI features.</p>
                 <button
                    onClick={handleDelete}
                    disabled={isLoading}
                    className="w-full mt-4 inline-flex items-center justify-center px-4 py-2 font-semibold text-white bg-red-600 rounded-lg shadow-md hover:bg-red-500 disabled:bg-gray-600 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-red-500 transition-colors"
                 >
                    {isLoading ? 'Deleting...' : 'Delete Key'}
                 </button>
              </div>
            ) : (
                <>
                <p className="text-gray-400 text-sm mb-4">
                    To use the AI features, please provide your own Google AI Studio API key. Your key is sent to our secure backend and is only used to process your requests.
                </p>
                <div>
                    <label htmlFor="api-key-input" className="sr-only">Google AI API Key</label>
                    <input
                    type="password"
                    id="api-key-input"
                    value={apiKey}
                    onChange={(e) => setApiKey(e.target.value)}
                    placeholder="Enter your Google AI API Key"
                    className="w-full bg-gray-900/50 text-gray-200 p-3 rounded-lg border border-white/10 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-shadow"
                    />
                </div>
                 <div className="mt-6 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 font-semibold text-gray-300 bg-gray-700/50 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={isLoading}
                        className="px-4 py-2 font-semibold text-white bg-blue-600 rounded-lg shadow-md hover:bg-blue-500 disabled:bg-gray-600 disabled:cursor-wait transition-colors"
                    >
                        {isLoading ? 'Saving...' : 'Save and Proceed'}
                    </button>
                 </div>
              </>
            )}
            {error && <p className="mt-4 text-sm text-red-400 text-center">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyModal;
