import React, { useState, useEffect } from "react";
import { shortenUrl } from "../services/api";

const URLForm = () => {
  const [originalUrl, setOriginalUrl] = useState("");
  const [customCode, setCustomCode] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [tags, setTags] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [focusedField, setFocusedField] = useState("");

  useEffect(() => {
    setIsFormVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setShortUrl("");
    setIsLoading(true);

    if (!originalUrl) {
      setError("Original URL is required");
      setIsLoading(false);
      return;
    }

    try {
      const response = await shortenUrl({
        originalUrl,
        customCode: customCode || undefined,
        expiryDate: expiryDate || undefined,
        tags: tags ? tags.split(",").map((t) => t.trim()) : [],
      });

      setShortUrl(response.data.shortUrl);
      setOriginalUrl("");
      setCustomCode("");
      setExpiryDate("");
      setTags("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to shorten URL");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const InputField = ({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    icon,
    required = false,
    name,
  }) => (
    <div className="relative group">
      <div className="relative">
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 group-focus-within:text-blue-400 transition-colors duration-300">
          {icon}
        </div>
        <input
          type={type}
          placeholder=" "
          value={value}
          onChange={onChange}
          onFocus={() => setFocusedField(name)}
          onBlur={() => setFocusedField("")}
          required={required}
          className={`
            peer w-full pl-12 pr-4 py-4 bg-slate-900/50 backdrop-blur-sm border-2 rounded-2xl text-white placeholder-transparent
            focus:outline-none focus:border-blue-500 focus:bg-slate-800/50 transition-all duration-300
            ${
              focusedField === name
                ? "border-blue-500 bg-slate-800/50 scale-[1.02]"
                : "border-white/20 hover:border-white/40"
            }
            ${error && required && !value ? "border-red-500 animate-shake" : ""}
          `}
        />
        <label
          className={`
          absolute left-12 top-4 text-white/60 transition-all duration-300 pointer-events-none
          peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-placeholder-shown:text-white/60
          peer-focus:-top-2 peer-focus:left-4 peer-focus:text-sm peer-focus:text-blue-400 peer-focus:bg-slate-900 peer-focus:px-2 peer-focus:rounded
          ${
            value
              ? "-top-2 left-4 text-sm text-blue-400 bg-slate-900 px-2 rounded"
              : ""
          }
        `}
        >
          {label} {required && <span className="text-red-400">*</span>}
        </label>
      </div>

      <div
        className={`
        mt-2 text-xs text-white/40 transition-all duration-300 overflow-hidden
        ${focusedField === name ? "max-h-6 opacity-100" : "max-h-0 opacity-0"}
      `}
      >
        {placeholder}
      </div>
    </div>
  );

  return (
    <div
      className={`
      transform transition-all duration-1000 
      ${isFormVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"}
    `}
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-3 mb-4">
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
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-white">URL Shortener</h2>
        </div>
        <p className="text-white/60">
          Transform your long URLs into short, shareable links
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="relative bg-gradient-to-br from-slate-900/80 to-slate-800/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/10 hover:border-white/20 transition-all duration-500"
      >
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-t-3xl"></div>
        <div className="absolute -top-px left-1/2 transform -translate-x-1/2 w-32 h-px bg-gradient-to-r from-transparent via-white to-transparent"></div>

        <div className="space-y-6">
          <InputField
            label="Original URL"
            type="url"
            placeholder="Enter the URL you want to shorten (e.g., https://example.com/very-long-url)"
            value={originalUrl}
            onChange={(e) => setOriginalUrl(e.target.value)}
            icon={
              <svg
                className="w-5 h-5"
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
            }
            required
            name="originalUrl"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputField
              label="Custom Code"
              placeholder="Create a custom short code (optional)"
              value={customCode}
              onChange={(e) => setCustomCode(e.target.value)}
              icon={
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
                  />
                </svg>
              }
              name="customCode"
            />

            <InputField
              label="Expiry Date"
              type="datetime-local"
              placeholder="Set when this link should expire (optional)"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              icon={
                <svg
                  className="w-5 h-5"
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
              }
              name="expiryDate"
            />
          </div>

          <InputField
            label="Tags"
            placeholder="Add comma-separated tags for organization (e.g., social, marketing, campaign)"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            icon={
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            }
            name="tags"
          />

          <div className="flex justify-center pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className={`
                group relative overflow-hidden px-8 py-4 rounded-2xl font-semibold text-white transition-all duration-300
                ${
                  isLoading
                    ? "bg-gray-600 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
                }
                transform active:scale-95
              `}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="relative flex items-center gap-3">
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg
                      className="w-5 h-5 group-hover:rotate-12 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                    Shorten URL
                  </>
                )}
              </div>
            </button>
          </div>
        </div>
      </form>

      {shortUrl && (
        <div className="mt-8 bg-gradient-to-br from-emerald-900/50 to-emerald-800/50 backdrop-blur-xl rounded-3xl p-6 border border-emerald-500/30 animate-fade-in-up">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-emerald-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-emerald-400">Success!</h3>
          </div>

          <p className="text-white/80 mb-4">Your shortened URL is ready:</p>

          <div className="flex items-center gap-3 p-4 bg-white/10 rounded-2xl border border-white/20">
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 text-blue-400 hover:text-blue-300 transition-colors duration-300 break-all font-mono"
            >
              {shortUrl}
            </a>
            <button
              onClick={copyToClipboard}
              className={`
                relative px-4 py-2 rounded-xl font-medium transition-all duration-300
                ${
                  copied
                    ? "bg-emerald-500 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white hover:scale-105"
                }
              `}
            >
              {copied ? (
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
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copied!
                </div>
              ) : (
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
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy
                </div>
              )}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mt-8 bg-gradient-to-br from-red-900/50 to-red-800/50 backdrop-blur-xl rounded-3xl p-6 border border-red-500/30 animate-fade-in-up">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-red-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-red-400">Error</h3>
              <p className="text-white/80">{error}</p>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.5s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default URLForm;
