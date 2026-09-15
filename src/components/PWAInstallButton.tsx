import React, { useState } from 'react';
import {
  Download,
  Share2,
  X,
  Smartphone,
  CheckCircle,
  ExternalLink,
  Monitor,
  Info,
  Check,
  Sparkles,
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'primary' | 'outline' | 'compact' | 'banner';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'compact',
  className = '',
}) => {
  const { isInstallable, isInstalled, isIOS, isAndroid, isInIframe, install } = usePWAInstall();
  const [showModal, setShowModal] = useState(false);
  const [justInstalled, setJustInstalled] = useState(false);
  const [activeTab, setActiveTab] = useState<'android' | 'ios' | 'desktop'>(
    isIOS ? 'ios' : isAndroid ? 'android' : 'android'
  );

  // If already installed in standalone mode
  if (isInstalled) {
    if (variant === 'banner') {
      return (
        <div className="flex items-center gap-2 text-xs text-[#39735a] bg-[#39735a]/10 px-3 py-1.5 rounded-full">
          <CheckCircle className="w-3.5 h-3.5" />
          <span>App installed & active offline</span>
        </div>
      );
    }
    return null;
  }

  const handleInstallClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // If browser triggered the native beforeinstallprompt event (e.g. top-level Chrome/Edge/Android)
    if (isInstallable) {
      try {
        const ok = await install();
        if (ok) {
          setJustInstalled(true);
          return;
        }
      } catch (err) {
        console.warn('Direct prompt failed, opening guide modal:', err);
      }
    }

    // Always provide the clear, interactive in-app guide modal (especially inside iframe preview or iOS)
    setShowModal(true);
  };

  const handleOpenInNewTab = () => {
    try {
      window.open(window.location.href, '_blank', 'noopener,noreferrer');
    } catch {
      window.location.href = window.location.href;
    }
  };

  if (justInstalled) {
    return (
      <span className="inline-flex items-center gap-1.5 text-xs text-[#39735a] font-medium bg-[#39735a]/10 px-3 py-1.5 rounded-full">
        <CheckCircle className="w-3.5 h-3.5" />
        Installed!
      </span>
    );
  }

  return (
    <>
      {variant === 'banner' ? (
        <div
          className={`flex items-center justify-between gap-3 bg-[#173d34] text-white p-3.5 rounded-2xl shadow-md ${className}`}
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#d9b77d] text-[#173d34] flex items-center justify-center font-bold text-lg shadow-inner">
              P.
            </div>
            <div>
              <p className="text-xs font-bold tracking-tight">Install PitchReady App</p>
              <p className="text-[11px] text-[#eee9dc]/80">Instant offline access & fast talent updates</p>
            </div>
          </div>
          <button
            type="button"
            id="pwa-install-banner-btn"
            onClick={handleInstallClick}
            className="flex items-center gap-1.5 bg-[#d9b77d] hover:bg-[#b48643] text-[#173d34] font-semibold text-xs px-3.5 py-2 rounded-full transition shadow-sm active:scale-95 whitespace-nowrap cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            Install
          </button>
        </div>
      ) : variant === 'primary' ? (
        <button
          type="button"
          id="pwa-install-primary-btn"
          onClick={handleInstallClick}
          className={`flex items-center justify-center gap-2 rounded-full bg-[#173d34] hover:bg-[#0d2a24] text-white px-5 py-3 text-sm font-semibold transition active:scale-95 shadow-sm cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4 text-[#d9b77d]" />
          Install Mobile App
        </button>
      ) : variant === 'outline' ? (
        <button
          type="button"
          id="pwa-install-outline-btn"
          onClick={handleInstallClick}
          className={`flex items-center justify-center gap-2 rounded-full border border-[#173d34] text-[#173d34] hover:bg-[#173d34] hover:text-white px-4 py-2 text-xs font-semibold transition active:scale-95 cursor-pointer ${className}`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          Install App
        </button>
      ) : (
        <button
          type="button"
          id="pwa-install-compact-btn"
          onClick={handleInstallClick}
          className={`inline-flex items-center gap-1.5 rounded-full border border-[#d9d5c9] bg-white/80 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-[#173d34] hover:bg-[#eee9dc] active:scale-95 transition shadow-xs cursor-pointer ${className}`}
          title="Install PitchReady as Progressive Web App"
        >
          <Download className="w-3.5 h-3.5 text-[#b48643]" />
          <span>Install</span>
        </button>
      )}

      {/* Cross-Platform Guided Install Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-200"
          onClick={() => setShowModal(false)}
        >
          <div
            className="w-full max-w-md rounded-3xl bg-[#f7f4ec] border border-[#d9d5c9] p-5 sm:p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#173d34] text-[#d9b77d] flex items-center justify-center font-bold text-lg shadow-sm">
                  P.
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#173d34] font-serif">
                    Install PitchReady
                  </h3>
                  <p className="text-[11px] text-[#68736e]">
                    Progressive Web App (PWA) · Mobile &amp; Desktop
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1.5 rounded-full text-[#68736e] hover:bg-[#eee9dc] cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Iframe Preview Notice with 1-Click Launch */}
            {isInIframe && (
              <div className="rounded-2xl bg-[#173d34]/10 border border-[#173d34]/20 p-3.5 text-xs text-[#173d34] space-y-2.5">
                <div className="flex items-start gap-2">
                  <Info className="w-4 h-4 text-[#b48643] shrink-0 mt-0.5" />
                  <p className="leading-relaxed">
                    <strong>Preview environment notice:</strong> Browsers restrict 1-tap installation prompts inside embedded iframes. Open PitchReady directly in a full browser tab to trigger the native installation prompt.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenInNewTab}
                  className="w-full rounded-xl bg-[#173d34] hover:bg-[#0d2a24] text-white py-2.5 px-4 text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition active:scale-98 cursor-pointer"
                >
                  <span>Open in Full Browser &amp; Install</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#d9b77d]" />
                </button>
              </div>
            )}

            {/* OS Selector Tabs */}
            <div className="flex bg-[#eee9dc] p-1 rounded-xl border border-[#d9d5c9] text-xs font-semibold text-[#68736e]">
              <button
                type="button"
                onClick={() => setActiveTab('android')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'android'
                    ? 'bg-[#173d34] text-white shadow-xs'
                    : 'hover:text-[#173d34]'
                }`}
              >
                <Smartphone className="w-3.5 h-3.5" />
                <span>Android</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('ios')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'ios'
                    ? 'bg-[#173d34] text-white shadow-xs'
                    : 'hover:text-[#173d34]'
                }`}
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>iPhone / iOS</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('desktop')}
                className={`flex-1 py-1.5 rounded-lg flex items-center justify-center gap-1.5 transition cursor-pointer ${
                  activeTab === 'desktop'
                    ? 'bg-[#173d34] text-white shadow-xs'
                    : 'hover:text-[#173d34]'
                }`}
              >
                <Monitor className="w-3.5 h-3.5" />
                <span>Desktop</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="space-y-2.5 text-xs text-[#15211d]">
              {activeTab === 'android' && (
                <>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#d9d5c9]">
                    <div className="w-6 h-6 rounded-full bg-[#173d34] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-[#173d34]">Open Chrome Menu</p>
                      <p className="text-[#68736e] mt-0.5">
                        Tap the <strong>three vertical dots (⋮)</strong> in the top-right corner of Chrome.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#d9d5c9]">
                    <div className="w-6 h-6 rounded-full bg-[#173d34] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-[#173d34]">Select Install App</p>
                      <p className="text-[#68736e] mt-0.5">
                        Tap <strong>"Install app"</strong> or <strong>"Add to Home screen"</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#d9d5c9]">
                    <div className="w-6 h-6 rounded-full bg-[#173d34] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-semibold text-[#173d34]">Confirm Installation</p>
                      <p className="text-[#68736e] mt-0.5">
                        Tap <strong>"Install"</strong>. PitchReady will be added to your home screen and app drawer just like a native app.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'ios' && (
                <>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#d9d5c9]">
                    <div className="p-1.5 rounded-lg bg-[#eee9dc] text-[#173d34] shrink-0">
                      <Share2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#173d34]">1. Tap Share in Safari</p>
                      <p className="text-[#68736e] mt-0.5">
                        In Safari, tap the <strong>Share</strong> button (square with arrow) on the bottom navigation bar.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#d9d5c9]">
                    <div className="p-1.5 rounded-lg bg-[#eee9dc] text-[#173d34] shrink-0">
                      <Download className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#173d34]">2. Add to Home Screen</p>
                      <p className="text-[#68736e] mt-0.5">
                        Scroll down the sheet and tap <strong>"Add to Home Screen"</strong>.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#d9d5c9]">
                    <div className="p-1.5 rounded-lg bg-[#eee9dc] text-[#173d34] shrink-0">
                      <Check className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-semibold text-[#173d34]">3. Tap Add</p>
                      <p className="text-[#68736e] mt-0.5">
                        Tap <strong>"Add"</strong> in the top right. PitchReady launches in full standalone mode.
                      </p>
                    </div>
                  </div>
                </>
              )}

              {activeTab === 'desktop' && (
                <>
                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#d9d5c9]">
                    <div className="w-6 h-6 rounded-full bg-[#173d34] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-semibold text-[#173d34]">Omnibox Install Icon</p>
                      <p className="text-[#68736e] mt-0.5">
                        In Chrome or Edge, click the <strong>Install icon (monitor with down arrow)</strong> on the right side of the address bar.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-white rounded-xl border border-[#d9d5c9]">
                    <div className="w-6 h-6 rounded-full bg-[#173d34] text-white flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-semibold text-[#173d34]">Or via Browser Menu</p>
                      <p className="text-[#68736e] mt-0.5">
                        Click <strong>Menu (⋮) &gt; "Save and share" &gt; "Install PitchReady"</strong>.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Benefits pill */}
            <div className="flex items-center gap-2 p-3 bg-[#39735a]/10 text-[#39735a] rounded-xl text-[11px]">
              <CheckCircle className="w-4 h-4 shrink-0" />
              <span>Full offline auto-saving, fast load times, and standalone native display.</span>
            </div>

            {/* Close Button */}
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="w-full rounded-full bg-[#173d34] hover:bg-[#0d2a24] text-white py-2.5 text-xs font-semibold active:scale-98 transition cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};
