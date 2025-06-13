import React, { useState } from 'react';
import { shortenUrl } from '../services/api';

const URLForm = () => {
  const [originalUrl, setOriginalUrl] = useState('');
  const [customCode, setCustomCode] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [tags, setTags] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setShortUrl('');

    if (!originalUrl) {
      setError('Original URL is required');
      return;
    }

    try {
      const response = await shortenUrl({
        originalUrl,
        customCode: customCode || undefined,
        expiryDate: expiryDate || undefined,
        tags: tags ? tags.split(',').map(t => t.trim()) : []
      });

      setShortUrl(response.data.shortUrl);
      setOriginalUrl('');
      setCustomCode('');
      setExpiryDate('');
      setTags('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to shorten URL');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white/5 p-6 rounded-2xl backdrop-blur-md shadow-xl mb-8 border border-white/10 space-y-4"
    >
      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-300">Original URL</label>
        <input
          type="url"
          placeholder="https://example.com"
          value={originalUrl}
          onChange={(e) => setOriginalUrl(e.target.value)}
          className="bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
          required
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-300">Custom Code (optional)</label>
        <input
          type="text"
          placeholder="e.g., mycustom1"
          value={customCode}
          onChange={(e) => setCustomCode(e.target.value)}
          className="bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-300">Expiry Date (optional)</label>
        <input
          type="datetime-local"
          value={expiryDate}
          onChange={(e) => setExpiryDate(e.target.value)}
          className="bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <div className="flex flex-col">
        <label className="text-sm font-medium text-gray-300">Tags (comma-separated)</label>
        <input
          type="text"
          placeholder="e.g., social,marketing"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          className="bg-gray-800 text-white rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-orange-400"
        />
      </div>

      <button
        type="submit"
        className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-xl transition-all"
      >
        Shorten URL
      </button>

      {shortUrl && (
        <div className="mt-4 text-green-400">
          ✅ Short URL:&nbsp;
          <a href={shortUrl} target="_blank" rel="noopener noreferrer" className="underline">
            {shortUrl}
          </a>
        </div>
      )}

      {error && <div className="mt-4 text-red-400">⚠️ {error}</div>}
    </form>
  );
};

export default URLForm;
