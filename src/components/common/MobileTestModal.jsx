import React, { useState, useEffect } from 'react';
import { 
  X, 
  Smartphone, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles, 
  Info,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import QRCode from 'qrcode';

export const MobileTestModal = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [selectedTarget, setSelectedTarget] = useState('shared');
  const [qrDataUrl, setQrDataUrl] = useState('');

  // Primary URL detection: uses current window.location.origin
  const rawCurrentUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:3000';
  
  // Public/Shared cloud URL generator
  const getSharedUrl = () => {
    return rawCurrentUrl;
  };

  const sharedUrl = getSharedUrl();
  const devUrl = rawCurrentUrl;

  const activeUrl = selectedTarget === 'shared' ? sharedUrl : devUrl;

  // Generate crisp high-res QR code on URL change
  useEffect(() => {
    if (!activeUrl || !isOpen) return;

    QRCode.toDataURL(activeUrl, {
      width: 320,
      margin: 1.5,
      color: {
        dark: '#000000',
        light: '#ffffff'
      },
      errorCorrectionLevel: 'M'
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => {
        console.error('QR code generation error:', err);
      });
  }, [activeUrl, isOpen]);

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-[#0c1427] rounded-3xl shadow-2xl border border-slate-800 max-w-md w-full overflow-hidden transform transition-all duration-300 scale-100 modal-content-animate text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-[#091122]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-md">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white leading-tight">Test App on Mobile Phone</h3>
              <p className="text-xs text-slate-400">Scan QR code using your phone's camera</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* URL Target Selector Tabs */}
        <div className="p-5 pb-0">
          <div className="grid grid-cols-2 p-1 bg-[#080d1b] rounded-xl text-xs font-medium border border-slate-800">
            <button
              onClick={() => setSelectedTarget('shared')}
              className={`py-2 px-2.5 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedTarget === 'shared'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Direct Link</span>
            </button>
            <button
              onClick={() => setSelectedTarget('dev')}
              className={`py-2 px-2.5 rounded-lg transition-all text-center flex items-center justify-center gap-1.5 cursor-pointer ${
                selectedTarget === 'dev'
                  ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>Local Dev</span>
            </button>
          </div>

          <div className="mt-3 px-3.5 py-2.5 bg-emerald-500/10 border border-emerald-500/30 rounded-xl flex items-start gap-2.5 text-left">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-200 leading-relaxed">
              <strong>Works on any device:</strong> Open directly in Safari, Chrome, or any mobile browser to test responsiveness.
            </p>
          </div>
        </div>

        {/* Content & QR Display */}
        <div className="p-6 flex flex-col items-center text-center">
          {/* QR Code Container */}
          <div className="p-3.5 bg-white rounded-2xl shadow-xl border border-slate-700 relative group mb-4">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt="Scan QR code to open app on mobile"
                className="w-52 h-52 object-contain rounded-xl"
                loading="eager"
              />
            ) : (
              <div className="w-52 h-52 flex items-center justify-center bg-slate-100 rounded-xl text-slate-400 text-xs">
                Generating QR code...
              </div>
            )}
            
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl backdrop-blur-xs">
              <a
                href={activeUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 px-4 py-2.5 rounded-xl shadow-lg transition-all"
              >
                <span>Open Link in New Tab</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Direct link & Copy */}
          <div className="w-full flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={activeUrl}
              className="flex-1 text-xs font-mono text-slate-200 bg-[#080d1b] border border-slate-800 rounded-xl px-3 py-2.5 select-all focus:outline-none"
            />
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-md shadow-indigo-600/30 shrink-0 cursor-pointer"
              title="Copy URL"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy URL</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-[#091122] border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Responsive & Touch Optimized</span>
          </span>
          <button
            onClick={onClose}
            className="text-xs font-semibold text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
