import React, { useState } from 'react';
import { Megaphone, PlusCircle, Trash2, Sparkles } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';

export const TpoAnnouncementsTab = () => {
  const { announcements, createAnnouncement, deleteAnnouncement } = usePortal();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  // Handle Add Notice
  const handleAddNotice = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    const res = await createAnnouncement(title.trim(), content.trim());
    setLoading(false);

    if (res.success) {
      setTitle('');
      setContent('');
      setShowAddForm(false);
      showToast('📢 Notice published to student dashboards!');
    } else {
      showToast(`✕ ${res.message}`);
    }
  };

  // Handle Delete Notice
  const handleDeleteNotice = async (id, noticeTitle) => {
    const res = await deleteAnnouncement(id);
    if (res.success) {
      showToast(`🗑️ Removed notice: "${noticeTitle.substring(0, 24)}..."`);
    } else {
      showToast(`✕ ${res.message}`);
    }
  };

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 border border-slate-700 animate-bounce">
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <Megaphone size={20} />
            </div>
            <div>
              <h2 className="font-extrabold text-slate-900 text-xl">Campus Placement Announcements</h2>
              <p className="text-xs text-slate-500 font-medium">Publish notices, assessment updates, and drive alerts for students</p>
            </div>
          </div>

          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition-all shadow-md flex items-center gap-2 flex-shrink-0 self-start sm:self-center"
          >
            <PlusCircle size={16} />
            <span>{showAddForm ? 'Close Form' : '+ Add New Notice'}</span>
          </button>
        </div>

        {/* ADD NOTICE FORM CARD */}
        {showAddForm && (
          <form onSubmit={handleAddNotice} className="p-5 bg-slate-50 rounded-2xl border border-slate-200/80 space-y-4 animate-fadeIn">
            <h3 className="font-extrabold text-slate-900 text-sm flex items-center gap-2">
              <Sparkles size={16} className="text-purple-600" />
              <span>Create Campus Announcement</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Notice Title *</label>
              <input
                type="text"
                required
                placeholder="e.g. Deloitte Digital OA Assessment Link Live"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full h-10 px-3 bg-white border border-slate-200 text-slate-900 text-xs font-medium rounded-xl outline-none focus:border-blue-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-900 mb-1">Notice Details & Message *</label>
              <textarea
                rows="3"
                required
                placeholder="Write announcement details for candidate inboxes..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-3 bg-white border border-slate-200 text-slate-900 text-xs font-medium rounded-xl outline-none focus:border-blue-600 leading-relaxed"
              ></textarea>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 font-bold rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-5 py-2 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs shadow-md transition-all"
              >
                {loading ? 'Broadcasting...' : 'Broadcast Notice'}
              </button>
            </div>
          </form>
        )}
      </div>

      {/* NOTICES LIST */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-4">
        <h3 className="font-extrabold text-slate-900 text-base border-b border-slate-100 pb-3">
          Published Notices List ({announcements.length})
        </h3>

        <div className="space-y-3">
          {announcements.length === 0 ? (
            <p className="text-xs text-slate-400 py-6 text-center">No announcements published yet.</p>
          ) : (
            announcements.map((notice) => {
              const noticeId = notice.announcement_id || notice.id;
              const dateStr = notice.created_at
                ? new Date(notice.created_at).toLocaleDateString()
                : notice.date || 'Recent';

              return (
                <div
                  key={noticeId}
                  className="p-4 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-white hover:shadow-sm transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 text-[10px] font-bold border border-purple-200">
                        Official Notice
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">• {dateStr}</span>
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-sm">{notice.title}</h4>
                    <p className="text-slate-600 text-xs leading-relaxed">{notice.description || notice.content}</p>
                  </div>

                  {/* Action: Delete Notice */}
                  <button
                    onClick={() => handleDeleteNotice(noticeId, notice.title)}
                    className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold rounded-xl text-xs transition-colors flex items-center gap-1.5 self-start sm:self-center flex-shrink-0"
                  >
                    <Trash2 size={14} />
                    <span>Delete Notice</span>
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
};
