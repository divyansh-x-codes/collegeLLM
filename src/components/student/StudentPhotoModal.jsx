import React, { useState, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  X, 
  Sparkles, 
  Check, 
  Trash2, 
  User 
} from 'lucide-react';
import { useCollege } from '../../context/CollegeContext.jsx';

const SAMPLE_PORTRAITS = [
  { label: 'Portrait 1', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80' },
  { label: 'Portrait 2', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80' },
  { label: 'Portrait 3', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80' },
  { label: 'Portrait 4', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80' },
  { label: 'Portrait 5', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80' },
  { label: 'Portrait 6', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80' },
];

export const StudentPhotoModal = ({ isOpen, onClose }) => {
  const { currentStudent, updateStudent, showToast } = useCollege();
  const [customUrl, setCustomUrl] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('');
  const fileInputRef = useRef(null);

  if (!isOpen) return null;
  const targetStudentId = currentStudent?.id || 's-1';

  const handleApplyPreset = (url) => {
    setSelectedPreset(url);
    if (updateStudent) {
      updateStudent(targetStudentId, { avatarUrl: url });
    }
    showToast('Student portrait updated successfully.', 'success');
    onClose();
  };

  const handleApplyCustomUrl = (e) => {
    e.preventDefault();
    if (!customUrl.trim()) return;
    if (updateStudent) {
      updateStudent(targetStudentId, { avatarUrl: customUrl.trim() });
    }
    showToast('Student profile picture link applied.', 'success');
    setCustomUrl('');
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      showToast('Please select a valid image file (PNG, JPG, WebP)', 'error');
      return;
    }

    if (file.size > 8 * 1024 * 1024) {
      showToast('Image file size must be less than 8MB', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      if (dataUrl) {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const maxDim = 320;
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);

          if (updateStudent) {
            updateStudent(targetStudentId, { avatarUrl: compressedDataUrl });
          }
          showToast('New photo uploaded and updated successfully.', 'success');
          onClose();
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    if (updateStudent) {
      updateStudent(targetStudentId, { avatarUrl: null });
    }
    setSelectedPreset('');
    showToast('Photo removed. Using student monogram.', 'info');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md modal-backdrop-animate">
      <div 
        className="relative w-full max-w-md bg-[#0c1427] rounded-3xl shadow-2xl border border-slate-800 overflow-hidden modal-content-animate text-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-[#091122]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-md">
              <Camera className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Student Profile Picture
              </h2>
              <p className="text-xs text-slate-400">
                Put your picture for official campus ID and portal presence
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-5">
          {/* Active Preview */}
          <div className="flex items-center gap-4 p-4 bg-[#080d1b] rounded-2xl border border-slate-800">
            <div className="relative group shrink-0">
              {currentStudent.avatarUrl ? (
                <img
                  src={currentStudent.avatarUrl}
                  alt={currentStudent.firstName}
                  className="w-16 h-16 rounded-2xl object-cover ring-2 ring-indigo-500 shadow-md"
                />
              ) : (
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${currentStudent.avatarBg || 'from-indigo-600 to-indigo-800'} text-white flex items-center justify-center font-bold text-xl shadow-md`}
                >
                  {currentStudent.firstName ? currentStudent.firstName[0] : 'S'}
                </div>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="font-bold text-white text-sm truncate">
                {currentStudent.firstName} {currentStudent.lastName}
              </div>
              <div className="text-xs text-slate-400 font-mono mt-0.5">
                {currentStudent.studentId} · {currentStudent.department}
              </div>
              <p className="text-[11px] text-indigo-400 font-medium mt-1">
                {currentStudent.avatarUrl ? 'Custom photo active' : 'Default monogram badge'}
              </p>
            </div>

            {currentStudent.avatarUrl && (
              <button
                onClick={handleRemovePhoto}
                title="Remove current photo"
                className="p-2 text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 rounded-xl transition-colors cursor-pointer"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Action 1: Upload from Device */}
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-indigo-600/30 cursor-pointer group"
            >
              <Upload className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
              <span>Upload Picture from Computer / Phone</span>
            </button>
            <p className="text-[11px] text-slate-400 text-center mt-1.5 font-mono">
              Supports PNG, JPG, WebP up to 8MB
            </p>
          </div>

          {/* Action 2: Choose from Campus Portraits */}
          <div>
            <div className="text-xs font-bold text-slate-300 mb-2.5 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Or Select a Student Portrait Preset:</span>
            </div>
            <div className="grid grid-cols-6 gap-2.5">
              {SAMPLE_PORTRAITS.map((portrait, idx) => {
                const isSelected = currentStudent.avatarUrl === portrait.url;
                return (
                  <button
                    key={idx}
                    onClick={() => handleApplyPreset(portrait.url)}
                    className={`relative rounded-2xl aspect-square overflow-hidden border-2 transition-all cursor-pointer group ${
                      isSelected
                        ? 'border-indigo-500 ring-2 ring-indigo-400/50 scale-105'
                        : 'border-slate-800 hover:border-indigo-400 hover:scale-105'
                    }`}
                  >
                    <img
                      src={portrait.url}
                      alt={portrait.label}
                      className="w-full h-full object-cover"
                    />
                    {isSelected && (
                      <div className="absolute inset-0 bg-indigo-950/60 backdrop-blur-xs flex items-center justify-center">
                        <Check className="w-3.5 h-3.5 text-white font-bold" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action 3: Image URL input */}
          <form onSubmit={handleApplyCustomUrl} className="pt-3 border-t border-slate-800 flex gap-2">
            <input
              type="url"
              placeholder="Or paste an image web link (https://...)"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              className="flex-1 bg-[#080d1b] border border-slate-800 text-xs text-white placeholder:text-slate-500 rounded-xl px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
            <button
              type="submit"
              disabled={!customUrl.trim()}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer shrink-0 shadow-md"
            >
              Apply
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
