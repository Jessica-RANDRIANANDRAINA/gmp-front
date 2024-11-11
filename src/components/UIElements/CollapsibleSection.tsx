import React, { useState } from "react";

interface CollapsibleSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  count?: number;
}

const CollapsibleSection = ({
  title,
  children,
  defaultOpen = false,
  count,
}: CollapsibleSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="w-full">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-2 text-sm text-gray-200 hover:bg-gray-700/50 transition-colors"
      >
        <div className="flex items-center gap-2">
          <span>{title}</span>
          {count !== undefined && (
            <span className="text-xs text-gray-400">({count})</span>
          )}
        </div>
        <svg
          className={`w-4 h-4 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-all duration-200 ease-in-out ${
          isOpen ? "max-h-96 overflow-y-auto   " : "max-h-0"
        }`}
      >
        <div className="px-4 py-2 bg-gray-800/50">{children}</div>
      </div>
    </div>
  );
};

export default CollapsibleSection;
