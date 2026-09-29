import React from 'react';

interface ForvestLogoProps {
  className?: string;
  size?: number;
}

/**
 * Forvest Logo:
 * A flat vector wooden-post signpost with three direction arrows stacked:
 * top arrow filled stamp green (#1B7A54), lower two outlined in ink navy (#1C2733).
 */
export const ForvestLogo: React.FC<ForvestLogoProps> = ({ className = 'w-6 h-6', size = 24 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Central wooden vertical post */}
      <rect x="15" y="2" width="2" height="28" rx="1" fill="#1C2733" />
      {/* Post cap */}
      <polygon points="14,2 16,0.5 18,2" fill="#1C2733" />
      
      {/* Top arrow (pointing right) - filled with stamp green #1B7A54 */}
      <path
        d="M8 5H21L26 8.5L21 12H8V5Z"
        fill="#1B7A54"
      />

      {/* Middle arrow (pointing left) - outlined in ink navy #1C2733 */}
      <path
        d="M24 14H11L6 17.5L11 21H24V14Z"
        fill="#FAF8F4"
        stroke="#1C2733"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />

      {/* Bottom arrow (pointing right) - outlined in ink navy #1C2733 */}
      <path
        d="M8 23H21L26 26.5L21 30H8V23Z"
        fill="#FAF8F4"
        stroke="#1C2733"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
};
