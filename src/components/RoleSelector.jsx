import React from 'react';
import { GraduationCap, Building2, ShieldCheck } from 'lucide-react';

export const RoleSelector = ({ selectedRole, onSelectRole }) => {
  const roles = [
    {
      id: 'student',
      label: 'Student',
      icon: GraduationCap,
    },
    {
      id: 'recruiter',
      label: 'Recruiter',
      icon: Building2,
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: ShieldCheck,
    },
  ];

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-[#0F172A] mb-2.5">
        Select your role
      </label>
      <div className="grid grid-cols-3 gap-3">
        {roles.map((role) => {
          const Icon = role.icon;
          const isSelected = selectedRole === role.id;

          return (
            <button
              key={role.id}
              type="button"
              onClick={() => onSelectRole(role.id)}
              className={`flex items-center justify-center gap-2.5 py-3 px-3 rounded-[14px] font-semibold text-sm transition-all duration-200 ${
                isSelected
                  ? 'border-2 border-[#2563EB] bg-white text-[#2563EB] shadow-sm'
                  : 'border border-[#E2E8F0] bg-white text-[#475569] hover:border-[#CBD5E1] hover:bg-[#F8FAFC]'
              }`}
            >
              <Icon 
                size={18} 
                className={isSelected ? 'text-[#2563EB]' : 'text-[#64748B]'} 
                strokeWidth={2.2}
              />
              <span>{role.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
