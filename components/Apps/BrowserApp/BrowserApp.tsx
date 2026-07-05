'use client';

import { useState, useRef } from 'react';
import { AppComponentProps } from '@/types';

// Sites that send X-Frame-Options / frame-ancestors and refuse to render in an
// iframe. Frame refusal isn't detectable from JS (onLoad still fires and the
// error page is cross-origin), so a known list is the only reliable signal.
const FRAME_BLOCKED_HOSTS = [
  'linkedin.com', 'google.com', 'facebook.com', 'instagram.com', 'x.com',
  'twitter.com', 'github.com', 'youtube.com', 'reddit.com', 'anz.com.au',
  'macquarie.com', 'fenergo.com',
];

function isFrameBlocked(target: string): boolean {
  try {
    const host = new URL(target).hostname.replace(/^www\./, '');
    return FRAME_BLOCKED_HOSTS.some((b) => host === b || host.endsWith('.' + b));
  } catch {
    return false;
  }
}

export default function BrowserApp({ appProps }: AppComponentProps) {
  const initialUrl = appProps?.url ?? 'https://example.com';
  const [url, setUrl] = useState(initialUrl);
  const [inputVal, setInputVal] = useState(initialUrl);
  const [loading, setLoading] = useState(true);
  const [blocked, setBlocked] = useState(() => isFrameBlocked(initialUrl));
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const navigate = (target: string) => {
    let normalized = target.trim();
    if (normalized && !normalized.startsWith('http') && !normalized.startsWith('/')) {
      normalized = 'https://' + normalized;
    }
    setUrl(normalized);
    setInputVal(normalized);
    const isBlocked = isFrameBlocked(normalized);
    setBlocked(isBlocked);
    setLoading(!isBlocked);
  };

  const handleLoad = () => {
    setLoading(false);
  };

  const displayDomain = (() => {
    try { return new URL(url).hostname; } catch { return url; }
  })();

  return (
    <div className="flex flex-col h-full" style={{ background: '#13141f' }}>
      {/* Browser chrome */}
      <div
        className="flex items-center gap-2 px-3 py-2 shrink-0 border-b border-white/5"
        style={{ background: '#1a1b2e' }}
      >
        {/* Nav buttons */}
        <button
          onClick={() => iframeRef.current?.contentWindow?.history.back()}
          className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all text-sm"
          title="Back"
        >←</button>
        <button
          onClick={() => iframeRef.current?.contentWindow?.history.forward()}
          className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all text-sm"
          title="Forward"
        >→</button>
        <button
          onClick={() => navigate(url)}
          className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all text-sm"
          title="Reload"
        >↻</button>

        {/* URL bar */}
        <form
          className="flex-1 flex items-center gap-2 px-3 py-1 rounded-lg text-sm"
          style={{ background: '#0d0e1a', border: '1px solid rgba(255,255,255,0.08)' }}
          onSubmit={(e) => { e.preventDefault(); navigate(inputVal); }}
        >
          <span className="text-green-400 text-xs shrink-0">🔒</span>
          <input
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
            className="flex-1 bg-transparent outline-none text-gray-300 text-sm"
            spellCheck={false}
          />
        </form>

        {/* Open externally */}
        <a
          href={url}
          target="_blank"
          rel="noreferrer"
          className="w-7 h-7 rounded-md flex items-center justify-center text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-all text-sm"
          title="Open in new tab"
        >↗</a>
      </div>

      {/* Content area */}
      <div className="flex-1 relative overflow-hidden">
        {loading && !blocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 z-10"
            style={{ background: '#13141f' }}>
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm">Loading {displayDomain}…</p>
          </div>
        )}

        {blocked ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-center px-8">
            <span className="text-4xl">🚫</span>
            <div>
              <p className="text-white font-semibold mb-1">Can't display this page</p>
              <p className="text-gray-400 text-sm mb-4">
                {displayDomain} doesn't allow embedding. Open it in a new tab instead.
              </p>
              <a
                href={url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{ background: '#2a2b3d', color: '#7aa2f7', border: '1px solid #3a3b52' }}
              >
                ↗ Open {displayDomain} in new tab
              </a>
            </div>
          </div>
        ) : (
          <iframe
            ref={iframeRef}
            key={url}
            src={url}
            className="w-full h-full border-0"
            onLoad={handleLoad}
            onError={() => { setBlocked(true); setLoading(false); }}
            title={displayDomain}
          />
        )}
      </div>
    </div>
  );
}
