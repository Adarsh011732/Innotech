import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function CustomDropdown({
  options = [],
  value,
  onChange,
  placeholder = 'Select option',
  className = '',
  buttonClassName = '',
  menuClassName = '',
  align = 'right',
  icon: LeadingIcon = null
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close when clicked outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (e.key === 'Escape') setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isOpen]);

  const selectedOption = options.find((opt) => opt.id === value || opt.value === value);

  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-between gap-2 px-3.5 py-2 text-xs font-semibold rounded-full bg-white border border-black/[0.08] text-zinc-800 shadow-sm hover:border-zinc-400 hover:bg-zinc-50 transition-all duration-200 outline-none select-none btn-interactive ${buttonClassName}`}
      >
        <div className="flex items-center gap-2 truncate">
          {LeadingIcon && <LeadingIcon className="w-3.5 h-3.5 text-zinc-500 shrink-0" />}
          {selectedOption?.icon && (
            <span className="shrink-0">{selectedOption.icon}</span>
          )}
          <span className="truncate">
            {selectedOption ? (selectedOption.label || selectedOption.name) : placeholder}
          </span>
          {selectedOption?.badge && (
            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded-md bg-zinc-100 text-zinc-600 font-bold">
              {selectedOption.badge}
            </span>
          )}
        </div>
        <ChevronDown 
          className={`w-3.5 h-3.5 text-zinc-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180 text-zinc-800' : ''}`} 
        />
      </button>

      {/* Glassmorphic Dropdown Menu */}
      {isOpen && (
        <div
          className={`absolute ${align === 'right' ? 'right-0' : 'left-0'} mt-2 w-64 max-h-80 overflow-y-auto bg-white/95 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.12)] p-1.5 z-50 animate-dropdown select-none ${menuClassName}`}
        >
          {options.map((option) => {
            const optVal = option.id ?? option.value;
            const isSelected = optVal === value;

            return (
              <button
                key={optVal}
                type="button"
                onClick={() => {
                  onChange(optVal);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-left text-xs transition-colors duration-150 group ${
                  isSelected 
                    ? 'bg-[#18191E] text-white font-bold shadow-sm' 
                    : 'text-zinc-700 hover:bg-zinc-100/90 hover:text-zinc-950 font-medium'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  {option.icon && (
                    <span className="shrink-0 text-sm">{option.icon}</span>
                  )}
                  <div className="truncate">
                    <div className="truncate">{option.label || option.name}</div>
                    {option.sublabel && (
                      <div className={`text-[10px] truncate ${isSelected ? 'text-zinc-400' : 'text-zinc-400'}`}>
                        {option.sublabel}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0 ml-2">
                  {option.badge && (
                    <span 
                      className={`text-[9px] font-mono px-1.5 py-0.5 rounded-full font-bold ${
                        isSelected 
                          ? 'bg-white/20 text-white' 
                          : 'bg-zinc-100 text-zinc-600'
                      }`}
                    >
                      {option.badge}
                    </span>
                  )}
                  {isSelected && (
                    <Check className="w-3.5 h-3.5 text-teal-400" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
