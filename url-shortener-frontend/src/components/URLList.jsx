

import React, { useEffect, useState } from "react";
import { getAnalytics, getUrls } from "../services/api";
import URLAnalytics from "./URLAnalytics";

const URLList = () => {
  const [urls, setUrls] = useState([]);
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedAnalytics, setSelectedAnalytics] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const res = await getUrls();
      setUrls(res.data);
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
      const res = await getAnalytics(code);
      setSelectedAnalytics((prev) => ({
        ...prev,
        [code]: res.data,
      }));
      setExpanded(code);
    } catch (error) {
      console.error("Error fetching analytics:", error.message);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4 text-orange-300">
        Your Shortened URLs
      </h2>
      {loading ? (
        <p className="text-gray-400">Loading...</p>
      ) : urls.length === 0 ? (
        <p className="text-gray-400">No URLs found.</p>
      ) : (
        <div className="space-y-4">
          {urls.map((url) => (
            <div
              key={url.shortCode}
              className="bg-white/5 p-4 rounded-xl border border-white/10 backdrop-blur-md"
            >
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-white font-medium">
                    🔗{" "}
                    <a
                      href={`http://localhost:5000/short/${url.shortCode}`}
                      className="underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      {url.shortCode}
                    </a>
                  </p>
                  <p className="text-sm text-gray-300 truncate">
                    Original: {url.originalUrl}
                  </p>
                  <p className="text-sm text-gray-400">
                    Visits: {url.totalVisits} | Unique: {url.uniqueVisitors}
                  </p>
                  <p className="text-sm text-gray-400">
                    Tags: {url.tags?.join(", ") || "None"}
                  </p>
                </div>
                <button
                  onClick={() => handleToggle(url.shortCode)}
                  className="text-sm text-orange-400 underline"
                >
                  {expanded === url.shortCode ? "Hide Analytics" : "View Analytics"}
                </button>
              </div>

              {/* Only render if this URL is expanded and analytics are loaded */}
              {expanded === url.shortCode &&
                selectedAnalytics[url.shortCode] && (
                  <URLAnalytics analytics={selectedAnalytics[url.shortCode]} />
                )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default URLList;
