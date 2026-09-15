import React from 'react';
import { WifiOff, CloudOff } from 'lucide-react';
import { useOnlineStatus } from '../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="pwa-offline-indicator"
      className="fixed top-16 left-1/2 -translate-x-1/2 z-40 w-[92%] max-w-md animate-in slide-in-from-top duration-300 pointer-events-none"
    >
      <div className="flex items-center gap-2.5 rounded-full bg-[#15211d] text-white px-4 py-2 text-xs font-medium shadow-xl border border-[#d9d5c9]/30">
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
        </span>
        <WifiOff className="w-3.5 h-3.5 text-amber-400" />
        <span className="flex-1 truncate">
          Offline Mode active — drafts & inquiries saved locally.
        </span>
      </div>
    </div>
  );
};
