import React, { useState } from 'react';
import { AlertTriangle, X, Trash2 } from 'lucide-react';
import { usePortal } from '../context/PortalContext';

export const DeleteAccountModal = ({ isOpen, onClose, roleLabel = 'Account' }) => {
  const { deleteAccount } = usePortal();
  const [confirmText, setConfirmText] = useState('');
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleDelete = async (e) => {
    e.preventDefault();
    if (confirmText.trim() !== 'DELETE') {
      setErrorMsg('Please type DELETE in capital letters to confirm.');
      return;
    }

    setDeleting(true);
    setErrorMsg('');

    const res = await deleteAccount();
    setDeleting(false);

    if (!res.success) {
      setErrorMsg(res.message || 'Failed to delete account');
    } else {
      onClose();
    }
  };

  const handleClose = () => {
    setConfirmText('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-md rounded-[24px] shadow-2xl p-6 sm:p-8 relative border border-slate-100 space-y-5">
        <button
          onClick={handleClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100 cursor-pointer"
        >
          <X size={20} />
        </button>

        <div className="w-14 h-14 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <AlertTriangle size={32} />
        </div>

        <div className="text-center">
          <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-extrabold uppercase border border-red-200 inline-block mb-2">
            Danger Zone
          </span>
          <h3 className="text-xl font-extrabold text-slate-900">
            Delete {roleLabel}?
          </h3>
          <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
            This action is <strong className="text-red-600">permanent</strong> and cannot be undone. All your profile data, applications, and portal records will be permanently erased.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleDelete} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Type <span className="text-red-600 font-mono">DELETE</span> to confirm:
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="TYPE 'DELETE'"
              required
              className="w-full h-11 px-3.5 bg-slate-50 text-slate-900 font-bold text-xs border border-slate-200 rounded-xl outline-none focus:border-red-600 focus:bg-white focus:ring-2 focus:ring-red-600/10 font-mono"
            />
          </div>

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 h-11 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={confirmText.trim() !== 'DELETE' || deleting}
              className="flex-1 h-11 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Trash2 size={16} />
              <span>{deleting ? 'Deleting...' : 'Delete Permanently'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
