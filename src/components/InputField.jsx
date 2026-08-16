import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export const InputField = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  icon: Icon,
  isPassword = false,
  required = true
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-[#0F172A] mb-2">
        {label}
      </label>
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-4 text-[#94A3B8] pointer-events-none flex items-center justify-center">
            <Icon size={19} strokeWidth={2} />
          </div>
        )}

        <input
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className={`w-full h-12 rounded-[14px] bg-white text-[#0F172A] placeholder-[#94A3B8] text-sm font-medium border border-[#E2E8F0] focus:border-[#2563EB] focus:ring-4 focus:ring-[#2563EB]/10 outline-none transition-all duration-200 ${
            Icon ? 'pl-11' : 'pl-4'
          } ${isPassword ? 'pr-11' : 'pr-4'}`}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-[#94A3B8] hover:text-[#475569] transition-colors focus:outline-none"
            title={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? (
              <EyeOff size={19} strokeWidth={2} />
            ) : (
              <Eye size={19} strokeWidth={2} />
            )}
          </button>
        )}
      </div>
    </div>
  );
};
