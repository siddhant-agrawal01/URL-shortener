import React, { useEffect, useState } from "react";
import { getAnalytics, getUrls } from "../services/api";
import URLAnalytics from "./URLAnalytics";

const URLList = () => {
  const [urls, setUrls] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnalytics, setSelectedAnalytics] = useState({});
  const [copiedCode, setCopiedCode] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [loadingAnalytics, setLoadingAnalytics] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getUrls();
      setUrls(res.data);
      setTimeout(() => setIsVisible(true), 100);
    } catch (error) {
      console.error("Error fetching URLs:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggle = async (code) => {
    if (expanded === code) {
      setExpanded(null);
      return;
    }

    try {
      setLoadingAnalytics(code);
      const res = await getAnalytics(code);
      setSelectedAnalytics((prev) => ({
        ...prev,
        [code]: res.data,
      }));
      setExpanded(code);
    } catch (error) {
      console.error("Error fetching analytics:", error.message);
    } finally {
      setLoadingAnalytics("");
    }
  };

  const copyToClipboard = async (shortCode) => {
    try {
      const url = `http://localhost:5000/short/${shortCode}`;
      await navigator.clipboard.writeText(url);
      setCopiedCode(shortCode);
      setTimeout(() => setCopiedCode(""), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusColor = (url) => {
    if (url.expiryDate && new Date(url.expiryDate) < new Date()) {
      return "from-red-600/20 to-red-800/20 border-red-500/30";
    }
    if (url.totalVisits > 100) {
      return "from-emerald-600/20 to-emerald-800/20 border-emerald-500/30";
    }
    if (url.totalVisits > 10) {
      return "from-blue-600/20 to-blue-800/20 border-blue-500/30";
    }
    return "from-slate-600/20 to-slate-800/20 border-white/10";
  };

  const LoadingCard = () => (
    <div className="bg-gradient-to-br from-slate-900/50 to-slate-800/50 backdrop-blur-xl rounded-3xl p-6 border border-white/10 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="h-6 bg-white/10 rounded-lg mb-3 w-3/4"></div>
          <div className="h-4 bg-white/5 rounded mb-2"></div>
          <div className="h-4 bg-white/5 rounded mb-2 w-1/2"></div>
          <div className="h-4 bg-white/5 rounded w-2/3"></div>
        </div>
        <div className="h-10 w-24 bg-white/10 rounded-xl"></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white animate-pulse"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">
              Your Shortened URLs
            </h2>
            <p className="text-white/60">Loading your links...</p>
          </div>
        </div>
        <div className="space-y-6">
          {[...Array(3)].map((_, i) => (
            <LoadingCard key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`transform transition-all duration-1000 ${
        isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
      }`}
    >
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <div>
            <h2 className="text-3xl font-bold text-white">
              Your Shortened URLs
            </h2>
            <p className="text-white/60">
              {urls.length} {urls.length === 1 ? "link" : "links"} created
            </p>
          </div>
        </div>

        <button
          onClick={fetchData}
          className="group px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl backdrop-blur-sm border border-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105"
        >
          <svg
            className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>
      </div>

      {urls.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 mx-auto mb-6 rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
            <svg
              className="w-12 h-12 text-white/40"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-white mb-2">No URLs found</h3>
          <p className="text-white/60 max-w-md mx-auto">
            Start by shortening your first URL using the form above. Your
            shortened links will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {urls.map((url, index) => (
            <div
              key={url.shortCode}
              className={`group relative bg-gradient-to-br ${getStatusColor(
                url
              )} backdrop-blur-xl rounded-3xl border hover:border-white/30 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/10 transform hover:scale-[1.02]`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="absolute top-6 right-6">
                <div
                  className={`w-3 h-3 rounded-full ${
                    url.expiryDate && new Date(url.expiryDate) < new Date()
                      ? "bg-red-500 animate-pulse"
                      : url.totalVisits > 100
                      ? "bg-emerald-500"
                      : url.totalVisits > 10
                      ? "bg-blue-500"
                      : "bg-gray-500"
                  }`}
                ></div>
              </div>

              <div className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-6">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center flex-shrink-0">
                        <svg
                          className="w-5 h-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                          />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <a
                            href={`http://localhost:5000/short/${url.shortCode}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-lg font-bold text-blue-400 hover:text-blue-300 transition-colors duration-300 font-mono"
                          >
                            /{url.shortCode}
                          </a>
                          <button
                            onClick={() => copyToClipboard(url.shortCode)}
                            className={`px-3 py-1 rounded-lg text-xs font-medium transition-all duration-300 ${
                              copiedCode === url.shortCode
                                ? "bg-emerald-500 text-white"
                                : "bg-white/10 text-white/70 hover:bg-white/20 hover:text-white"
                            }`}
                          >
                            {copiedCode === url.shortCode ? "Copied!" : "Copy"}
                          </button>
                        </div>
                        <p className="text-white/60 text-sm mt-1">
                          Created {formatDate(url.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <p className="text-sm text-white/50 mb-1">
                        Original URL:
                      </p>
                      <p className="text-white/80 break-all bg-white/5 rounded-lg p-3 text-sm font-mono">
                        {url.originalUrl}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-white">
                          {url.totalVisits}
                        </p>
                        <p className="text-xs text-white/60">Total Visits</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-white">
                          {url.uniqueVisitors}
                        </p>
                        <p className="text-xs text-white/60">Unique Visitors</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-white">
                          {url.tags?.length || 0}
                        </p>
                        <p className="text-xs text-white/60">Tags</p>
                      </div>
                      <div className="bg-white/5 rounded-xl p-3 text-center">
                        <p className="text-2xl font-bold text-white">
                          {url.expiryDate ? "⏰" : "∞"}
                        </p>
                        <p className="text-xs text-white/60">Expiry</p>
                      </div>
                    </div>

                    {url.tags && url.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {url.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="px-3 py-1 bg-gradient-to-r from-purple-600/20 to-blue-600/20 text-purple-300 text-xs rounded-full border border-purple-500/30"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {url.expiryDate && (
                      <div
                        className={`p-3 rounded-xl text-sm ${
                          new Date(url.expiryDate) < new Date()
                            ? "bg-red-500/20 text-red-300 border border-red-500/30"
                            : "bg-orange-500/20 text-orange-300 border border-orange-500/30"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          {new Date(url.expiryDate) < new Date()
                            ? "Expired"
                            : "Expires"}{" "}
                          on {formatDate(url.expiryDate)}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0">
                    <button
                      onClick={() => handleToggle(url.shortCode)}
                      disabled={loadingAnalytics === url.shortCode}
                      className={`group relative overflow-hidden px-6 py-3 rounded-2xl font-medium transition-all duration-300 ${
                        expanded === url.shortCode
                          ? "bg-gradient-to-r from-red-600 to-pink-600 text-white shadow-lg"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-lg"
                      }`}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative flex items-center gap-2">
                        {loadingAnalytics === url.shortCode ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            Loading...
                          </>
                        ) : expanded === url.shortCode ? (
                          <>
                            <svg
                              className="w-4 h-4 group-hover:rotate-180 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                            Hide Analytics
                          </>
                        ) : (
                          <>
                            <svg
                              className="w-4 h-4 group-hover:scale-110 transition-transform duration-300"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                              />
                            </svg>
                            View Analytics
                          </>
                        )}
                      </div>
                    </button>
                  </div>
                </div>

                <div
                  className={`overflow-hidden transition-all duration-500 ease-in-out ${
                    expanded === url.shortCode &&
                    selectedAnalytics[url.shortCode]
                      ? "max-h-[2000px] opacity-100"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  {expanded === url.shortCode &&
                    selectedAnalytics[url.shortCode] && (
                      <div className="border-t border-white/10 pt-6 animate-fade-in">
                        <URLAnalytics
                          analytics={selectedAnalytics[url.shortCode]}
                        />
                      </div>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default URLList;
