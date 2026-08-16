import React, { useState } from 'react';
import { Users, Eye, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { usePortal } from '../../context/PortalContext';
import { adminService } from '../../services/adminService';
import { StudentDetailsModal } from '../StudentDetailsModal';

export const TpoStudentsTab = () => {
  const { students, verifyStudent } = usePortal();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const handleOpenStudentDetails = async (student) => {
    const studentId = student.student_id || student.id || student._id || student.user_id;
    setLoadingDetails(true);
    setErrorMsg('');
    try {
      const detailed = await adminService.getStudentDetails(studentId);
      setSelectedStudent(detailed);
    } catch (err) {
      setErrorMsg(err.response?.data?.detail || 'Failed to load full student details');
      setSelectedStudent(student);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleVerify = async (studentId, status) => {
    setUpdatingId(studentId);
    setErrorMsg('');
    const res = await verifyStudent(studentId, status);
    setUpdatingId(null);

    if (!res.success) {
      setErrorMsg(res.message || 'Failed to update student verification status');
    } else {
      if (selectedStudent && (selectedStudent.student_id === studentId || selectedStudent.id === studentId || selectedStudent.user_id === studentId)) {
        setSelectedStudent((prev) => ({ ...prev, verification_status: status }));
      }
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Users size={18} />
          </div>
          <div>
            <h2 className="font-extrabold text-slate-900 text-lg">Registered Students Directory</h2>
            <p className="text-xs text-slate-500 font-medium">Browse student profiles, CGPAs, and verify academic enrollment status</p>
          </div>
        </div>

        <span className="px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
          {students.length} Students Listed
        </span>
      </div>

      {errorMsg && (
        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-xl text-xs font-semibold flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Student List Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-[11px]">
              <th className="pb-3 pl-1">Student Name</th>
              <th className="pb-3">Branch</th>
              <th className="pb-3">Semester</th>
              <th className="pb-3">CGPA</th>
              <th className="pb-3">Verification</th>
              <th className="pb-3 text-right pr-1">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-medium">
            {students.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-8 text-center text-slate-400 font-medium">
                  No registered students found for your college.
                </td>
              </tr>
            ) : (
              students.map((student) => {
                const studentId = student.student_id || student.id || student._id || student.user_id;
                const name = student.user?.name || student.name || 'Student';
                const email = student.user?.email || student.email || 'N/A';
                const avatar = name.substring(0, 2).toUpperCase();
                const status = student.verification_status || 'Pending';
                const isUpdating = updatingId === studentId;

                return (
                  <tr key={studentId} className="hover:bg-slate-50/70 transition-colors">
                    
                    {/* Student Name */}
                    <td className="py-3.5 pl-1">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center shadow-sm">
                          {avatar}
                        </div>
                        <div>
                          <span className="font-bold text-slate-900 text-xs block">{name}</span>
                          <span className="text-[10px] text-slate-400 font-medium">{email}</span>
                        </div>
                      </div>
                    </td>

                    {/* Branch */}
                    <td className="py-3.5 font-bold text-slate-800">
                      {student.branch || 'Computer Science'}
                    </td>

                    {/* Semester */}
                    <td className="py-3.5 font-bold text-slate-700">
                      Sem {student.semester || 8}
                    </td>

                    {/* CGPA */}
                    <td className="py-3.5 text-emerald-600 font-bold">
                      {student.cgpa || 8.5} / 10.0
                    </td>

                    {/* Verification Status Badge */}
                    <td className="py-3.5 font-bold">
                      {status === 'Approved' && (
                        <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] inline-flex items-center gap-1">
                          <CheckCircle2 size={12} /> Approved
                        </span>
                      )}
                      {status === 'Pending' && (
                        <span className="px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 text-[10px] inline-flex items-center gap-1 animate-pulse">
                          <Clock size={12} /> Pending Approval
                        </span>
                      )}
                      {status === 'Rejected' && (
                        <span className="px-2.5 py-1 rounded-full bg-red-50 text-red-700 border border-red-200 text-[10px] inline-flex items-center gap-1">
                          <XCircle size={12} /> Rejected
                        </span>
                      )}
                    </td>

                    {/* Action - View & Verify */}
                    <td className="py-3.5 text-right pr-1">
                      <div className="flex items-center justify-end gap-1.5">
                        {status !== 'Approved' && (
                          <button
                            onClick={() => handleVerify(studentId, 'Approved')}
                            disabled={isUpdating}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold rounded-xl text-xs transition-all shadow-xs cursor-pointer"
                          >
                            {isUpdating ? '...' : 'Approve'}
                          </button>
                        )}

                        {status !== 'Rejected' && (
                          <button
                            onClick={() => handleVerify(studentId, 'Rejected')}
                            disabled={isUpdating}
                            className="px-3 py-1.5 bg-red-50 hover:bg-red-100 disabled:opacity-50 text-red-600 font-bold rounded-xl text-xs transition-all cursor-pointer"
                          >
                            {isUpdating ? '...' : 'Reject'}
                          </button>
                        )}

                        <button
                          onClick={() => handleOpenStudentDetails(student)}
                          disabled={loadingDetails}
                          className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Eye size={13} />
                          <span>{loadingDetails ? 'Loading...' : 'View Profile'}</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Complete Student Details Modal */}
      <StudentDetailsModal
        isOpen={!!selectedStudent}
        onClose={() => setSelectedStudent(null)}
        student={selectedStudent}
      />

    </div>
  );
};
