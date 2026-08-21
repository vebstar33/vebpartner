import React from 'react';

// Vebstar minimalist pure white logo emblem
export const VebstarLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <svg
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M5 6L16 26L27 6H21.2L16 16.8L10.8 6H5Z"
      fill="#FFFFFF"
    />
    <rect x="13" y="5" width="6" height="3" rx="1.5" fill="#FFFFFF" />
  </svg>
);

// Backward-compatible alias
export const OpenAltLogo: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
  <VebstarLogo className={className} />
);

// Verified Blue Badge with checkmark
export const VerifiedBadge: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="10" cy="10" r="9" fill="#3B82F6" />
    <path
      d="M6.5 10.2L8.8 12.5L13.8 7.5"
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Novu Brand Logo
export const NovuLogo: React.FC<{ className?: string }> = ({ className = 'w-5 h-5' }) => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      d="M17.333 4L6 18.667H14.667L12 28L26 13.333H17.333V4Z"
      fill="url(#novu-grad)"
    />
    <defs>
      <linearGradient id="novu-grad" x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#FF407D" />
        <stop offset="1" stopColor="#8A2BE2" />
      </linearGradient>
    </defs>
  </svg>
);

// Dirstarter Dove Logo
export const DirstarterLogo: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14.5v-3.88l3.12 3.12 1.41-1.41-4.53-4.53v-.3c1.54-.7 2.6-2.2 2.6-3.9 0-2.43-1.97-4.4-4.4-4.4-1.7 0-3.2 1.06-3.9 2.6h-.3l-4.53-4.53-1.41 1.41 3.12 3.12H5.5v2h3.88l-3.12 3.12 1.41 1.41 4.53-4.53h.3c.7 1.54 2.2 2.6 3.9 2.6 2.43 0 4.4-1.97 4.4-4.4 0-1.7-1.06-3.2-2.6-3.9v-.3l4.53-4.53 1.41 1.41-3.12 3.12H18.5v2h-5.5z" />
  </svg>
);

// Sevalla Orange Hex Logo
export const SevallaLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="24" height="24" rx="6" fill="#F97316" />
    <path
      d="M7 16L12 8L17 16H7Z"
      fill="white"
      stroke="white"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

// CodeRabbit Logo
export const CodeRabbitLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="24" height="24" rx="6" fill="#EA580C" />
    <path
      d="M12 6C10 6 8.5 7.5 8.5 9.5C8.5 11.5 10 13 12 13C14 13 15.5 11.5 15.5 9.5C15.5 7.5 14 6 12 6ZM9.5 17C8.1 17 7 18.1 7 19.5H17C17 18.1 15.9 17 14.5 17H9.5Z"
      fill="white"
    />
  </svg>
);

// Logto Logo
export const LogtoLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="24" height="24" rx="6" fill="#A855F7" />
    <path
      d="M7 6H17V18H7V6Z"
      stroke="white"
      strokeWidth="2"
    />
    <circle cx="10" cy="12" r="1.5" fill="white" />
  </svg>
);

// Docmost Logo
export const DocmostLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="24" height="24" rx="6" fill="#18181B" stroke="#3F3F46" />
    <path
      d="M7 6H13C15.2 6 17 7.8 17 10V14C17 16.2 15.2 18 13 18H7V6Z"
      fill="white"
    />
  </svg>
);

// InfluxData Logo
export const InfluxDataLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M12 2L2 7V17L12 22L22 17V7L12 2Z"
      fill="#22ADF6"
    />
  </svg>
);

// Sent Logo
export const SentLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 12L21 3L12 21L10 13L3 12Z"
      fill="white"
    />
  </svg>
);

// Capture.page Logo
export const CapturePageLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2" />
    <circle cx="12" cy="12" r="4" fill="white" />
  </svg>
);

// Openlane Logo
export const OpenlaneLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="24" height="24" rx="6" fill="#10B981" />
    <path
      d="M5 17L12 6L19 17H5Z"
      stroke="white"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path d="M12 11V15" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

// c15t Logo
export const C15tLogo: React.FC<{ className?: string }> = ({ className = 'w-4 h-4' }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <rect width="24" height="24" rx="6" fill="#059669" />
    <path
      d="M8 8L16 16M16 8L8 16"
      stroke="white"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

// Social Media Icons
export const XTwitterIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

export const ThreadsIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.186 24C5.466 24 0 18.627 0 12.016 0 5.405 5.466.032 12.186.032c6.64 0 11.956 5.219 11.956 11.984 0 .615-.05 1.23-.15 1.844h-3.924c.05-.614.075-1.229.075-1.844 0-4.48-3.585-8.064-8.032-8.064-4.448 0-8.033 3.584-8.033 8.064s3.585 8.064 8.033 8.064c2.815 0 5.277-1.442 6.711-3.64l3.197 2.385C19.782 21.948 16.23 24 12.186 24z" />
  </svg>
);

export const RedditIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.56 1.25 1.25a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.498 1.19-.498a1.724 1.724 0 0 1 1.723 1.723c0 .715-.438 1.328-1.055 1.587.058.29.088.586.088.887 0 2.946-3.414 5.334-7.625 5.334s-7.625-2.388-7.625-5.334c0-.301.03-.597.088-.887A1.72 1.72 0 0 1 2.83 11.96a1.724 1.724 0 0 1 1.723-1.723c.46 0 .882.189 1.19.498 1.194-.856 2.85-1.418 4.674-1.488l.8-3.747 3.655.77a1.25 1.25 0 0 1 2.138-1.526zM8.5 13a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm7 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm-3.5 3c-1.5 0-2.5.8-2.5.8a.5.5 0 0 0 .7.7s.7-.5 1.8-.5 1.8.5 1.8.5a.5.5 0 0 0 .7-.7s-1-.8-2.5-.8z" />
  </svg>
);

export const HackerNewsIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M0 0v24h24V0H0zm12.8 13.6v5.8h-1.6v-5.8L7.3 5.4h1.9l2.8 5.6 2.8-5.6h1.8l-3.8 8.2z" />
  </svg>
);

export const FacebookIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export const LinkedInIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

export const MastodonIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M23.268 5.313c-.35-2.578-2.617-4.61-5.304-5.004C16.035.035 14.015 0 11.996 0c-2.015 0-4.035.035-5.964.309C3.345.703 1.078 2.735.728 5.313.36 7.986.33 10.748.33 13.51c0 2.76.03 5.522.398 8.196.25 1.83 1.7 3.328 3.535 3.754 2.14.496 4.356.54 6.55.54h2.366c.26-.01.522-.02.783-.036 1.815-.11 3.593-.66 5.17-1.597l-.07-2.073c-1.39.782-2.92 1.258-4.5 1.397-1.84.16-3.697.09-5.52-.22-1.39-.236-2.31-1.332-2.43-2.724a13.34 13.34 0 0 1-.09-1.573c2.09.497 4.23.75 6.38.75 2.13 0 4.26-.25 6.34-.75 2.11-.51 3.86-2.2 4.14-4.34.42-3.19.45-6.44.08-9.664zm-5.074 8.767h-2.39v-5.71c0-1.22-.51-1.84-1.53-1.84-1.13 0-1.7.73-1.7 2.18v3.12h-1.16V8.71c0-1.45-.57-2.18-1.7-2.18-1.02 0-1.53.62-1.53 1.84v5.71H5.794V8.49c0-1.22.31-2.19.94-2.9.64-.72 1.48-1.08 2.53-1.08 1.22 0 2.15.47 2.76 1.41l.57.96.57-.96c.61-.94 1.54-1.41 2.76-1.41 1.05 0 1.89.36 2.53 1.08.63.71.94 1.68.94 2.9v5.59z" />
  </svg>
);

export const RssIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="M4 11a9 9 0 0 1 9 9" />
    <path d="M4 4a16 16 0 0 1 16 16" />
    <circle cx="5" cy="19" r="1" fill="currentColor" />
  </svg>
);

export const PinterestIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12 0a12 12 0 0 0-4.37 23.18c-.07-.94-.13-2.39.03-3.42l1.07-4.54s-.27-.54-.27-1.34c0-1.26.73-2.2 1.64-2.2.77 0 1.15.58 1.15 1.28 0 .78-.5 1.94-.75 3.02-.21.91.46 1.65 1.36 1.65 1.63 0 2.88-1.72 2.88-4.2 0-2.2-1.58-3.73-3.83-3.73-2.61 0-4.14 1.96-4.14 3.98 0 .79.3 1.63.68 2.09.07.09.08.17.06.26l-.26 1.05c-.04.17-.14.21-.32.13-1.2-.56-1.95-2.31-1.95-3.72 0-3.03 2.2-5.81 6.35-5.81 3.33 0 5.92 2.37 5.92 5.55 0 3.31-2.09 5.98-4.99 5.98-.97 0-1.89-.51-2.2-.11l-.6 2.28c-.22.84-.81 1.9-1.21 2.54A12 12 0 1 0 12 0z" />
  </svg>
);

export const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = 'w-3.5 h-3.5' }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2M12.05 3.67C14.25 3.67 16.31 4.53 17.87 6.09C19.42 7.65 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.04 20.16C10.66 20.16 9.3 19.8 8.1 19.09L7.81 18.92L4.69 19.74L5.52 16.7L5.33 16.39C4.55 15.16 4.13 13.56 4.13 11.92C4.13 7.38 7.83 3.67 12.05 3.67M9.25 7.49C9.07 7.49 8.78 7.56 8.53 7.83C8.28 8.11 7.58 8.77 7.58 10.11C7.58 11.45 8.56 12.75 8.7 12.93C8.83 13.12 10.62 15.89 13.38 17.07C14.03 17.36 14.55 17.53 14.95 17.65C15.61 17.86 16.2 17.84 16.67 17.76C17.2 17.69 18.3 17.1 18.53 16.46C18.76 15.81 18.76 15.26 18.69 15.14C18.62 15.03 18.43 14.96 18.15 14.82C17.88 14.68 16.5 14 16.25 13.91C16 13.82 15.84 13.77 15.68 14.05C15.5 14.33 15.03 14.89 14.89 15.05C14.75 15.21 14.61 15.23 14.34 15.09C14.06 14.96 13.17 14.66 12.12 13.72C11.3 12.99 10.74 12.08 10.6 11.83C10.46 11.58 10.59 11.44 10.73 11.3C10.85 11.18 11 10.99 11.14 10.83C11.28 10.67 11.33 10.55 11.42 10.37C11.51 10.18 11.47 10.02 11.4 9.88C11.33 9.74 10.77 8.38 10.54 7.82C10.31 7.29 10.08 7.36 9.9 7.36C9.74 7.36 9.55 7.49 9.25 7.49Z" />
  </svg>
);

// Proprietary Alternative Logo Helper
export const ProprietaryIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-3 h-3' }) => {
  const norm = name.toLowerCase();
  if (norm.includes('customer')) {
    return (
      <svg viewBox="0 0 24 24" fill="#00D26A" className={className}>
        <rect width="24" height="24" rx="4" />
        <path d="M6 18L10 12L14 15L18 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (norm.includes('notification')) {
    return (
      <svg viewBox="0 0 24 24" fill="#3B82F6" className={className}>
        <rect width="24" height="24" rx="4" />
        <path d="M12 5C9.79 5 8 6.79 8 9V14L6 16H18L16 14V9C16 6.79 14.21 5 12 5Z" fill="white" />
        <circle cx="12" cy="18" r="1.5" fill="white" />
      </svg>
    );
  }
  if (norm.includes('magic')) {
    return (
      <svg viewBox="0 0 24 24" fill="#EAB308" className={className}>
        <rect width="24" height="24" rx="4" />
        <path d="M12 4L14 9L19 11L14 13L12 18L10 13L5 11L10 9L12 4Z" fill="#000" />
      </svg>
    );
  }
  if (norm.includes('knock')) {
    return (
      <svg viewBox="0 0 24 24" fill="#18181B" className={className}>
        <rect width="24" height="24" rx="4" stroke="#52525B" />
        <path d="M7 6V18M17 6L11 12L17 18" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (norm.includes('courier')) {
    return (
      <svg viewBox="0 0 24 24" fill="#EC4899" className={className}>
        <rect width="24" height="24" rx="4" />
        <path d="M5 8L12 13L19 8M5 16H19" stroke="white" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }
  if (norm.includes('notion')) {
    return (
      <svg viewBox="0 0 24 24" fill="#000" className={className}>
        <rect width="24" height="24" rx="4" stroke="#71717A" />
        <path d="M7 6L14 6L17 18H14L10 9V18H7V6Z" fill="white" />
      </svg>
    );
  }
  if (norm.includes('buffer')) {
    return (
      <svg viewBox="0 0 24 24" fill="#2563EB" className={className}>
        <path d="M4 7L12 3L20 7L12 11L4 7ZM4 12L12 16L20 12M4 17L12 21L20 17" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  return <div className={`${className} rounded-full bg-zinc-600`} />;
};

// Tech Stack SVG Icons
export const TechIcon: React.FC<{ name: string; className?: string }> = ({ name, className = 'w-3.5 h-3.5' }) => {
  const norm = name.toLowerCase();
  if (norm.includes('react') || norm.includes('jsx')) {
    return (
      <svg viewBox="-11.5 -10.23174 23 20.46348" fill="#61DAFB" className={className}>
        <circle cx="0" cy="0" r="2.05" />
        <g stroke="#61DAFB" strokeWidth="1" fill="none">
          <ellipse rx="11" ry="4.2" />
          <ellipse rx="11" ry="4.2" transform="rotate(60)" />
          <ellipse rx="11" ry="4.2" transform="rotate(120)" />
        </g>
      </svg>
    );
  }
  if (norm.includes('typescript') || norm === 'ts') {
    return (
      <svg viewBox="0 0 24 24" fill="#3178C6" className={className}>
        <rect width="24" height="24" rx="4" />
        <path d="M11.5 9.5H6.5V11.5H8V18.5H10V11.5H11.5V9.5Z" fill="white" />
        <path d="M14 15.5C14.5 16.5 15.5 17 16.8 17C18 17 18.8 16.3 18.8 15.3C18.8 14.1 17.8 13.7 16.5 13.2C14.8 12.5 13.5 11.8 13.5 10.1C13.5 8.5 14.8 7.3 16.7 7.3C18.2 7.3 19.3 8 19.8 9.3L18 10.2C17.7 9.5 17.2 9.1 16.5 9.1C15.8 9.1 15.3 9.5 15.3 10.1C15.3 10.8 15.8 11.2 17.2 11.7C19 12.4 20.4 13.2 20.4 15.1C20.4 17.1 18.8 18.7 16.7 18.7C14.8 18.7 13.4 17.5 12.8 16.2L14 15.5Z" fill="white" />
      </svg>
    );
  }
  if (norm.includes('javascript') || norm === 'js') {
    return (
      <svg viewBox="0 0 24 24" fill="#F7DF1E" className={className}>
        <rect width="24" height="24" rx="4" />
        <path d="M7 16C7.5 17 8.5 17.5 9.8 17.5C11.5 17.5 12.5 16.5 12.5 14.5V8.5H10.5V14.5C10.5 15.3 10.1 15.7 9.5 15.7C8.9 15.7 8.5 15.3 8.3 14.8L7 16Z" fill="#000" />
        <path d="M14 15.5C14.5 16.5 15.5 17 16.8 17C18 17 18.8 16.3 18.8 15.3C18.8 14.1 17.8 13.7 16.5 13.2C14.8 12.5 13.5 11.8 13.5 10.1C13.5 8.5 14.8 7.3 16.7 7.3C18.2 7.3 19.3 8 19.8 9.3L18 10.2C17.7 9.5 17.2 9.1 16.5 9.1C15.8 9.1 15.3 9.5 15.3 10.1C15.3 10.8 15.8 11.2 17.2 11.7C19 12.4 20.4 13.2 20.4 15.1C20.4 17.1 18.8 18.7 16.7 18.7C14.8 18.7 13.4 17.5 12.8 16.2L14 15.5Z" fill="#000" />
      </svg>
    );
  }
  if (norm.includes('docker')) {
    return (
      <svg viewBox="0 0 24 24" fill="#2496ED" className={className}>
        <path d="M13.9 11.2h2.2v2.2h-2.2v-2.2zm-2.8 0h2.2v2.2h-2.2v-2.2zm-2.8 0h2.2v2.2H8.3v-2.2zm-2.8 0h2.2v2.2H5.5v-2.2zm8.4-2.8h2.2v2.2h-2.2V8.4zm-2.8 0h2.2v2.2h-2.2V8.4zm-2.8 0h2.2v2.2H8.3V8.4zm5.6-2.8h2.2v2.2h-2.2V5.6zm8.1 8.8c-.4-.3-1.6-.4-2.4-.3-.1-.9-.6-1.7-1.3-2.3l-.6-.5-.5.6c-.6.8-.7 1.8-.4 2.8-.7.4-1.6.5-2.6.5H2.4c-.4 1.7.3 3.5 1.7 4.5 1.9 1.4 4.5 1.8 7.3 1.8 5.7 0 10.2-2.7 11.1-7.1z" />
      </svg>
    );
  }
  if (norm.includes('node')) {
    return (
      <svg viewBox="0 0 24 24" fill="#339933" className={className}>
        <path d="M12 2L2 7.7v11.6L12 25l10-5.7V7.7L12 2zm0 3.2l7.2 4.1v8.2L12 21.6l-7.2-4.1V9.3L12 5.2z" />
      </svg>
    );
  }
  if (norm.includes('tailwind')) {
    return (
      <svg viewBox="0 0 24 24" fill="#06B6D4" className={className}>
        <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
      </svg>
    );
  }
  if (norm.includes('github') || norm.includes('actions')) {
    return (
      <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z" />
      </svg>
    );
  }
  if (norm.includes('css')) {
    return (
      <svg viewBox="0 0 24 24" fill="#264DE4" className={className}>
        <path d="M4 2L6 20L12 22L18 20L20 2H4Z" />
        <path d="M12 4V20L16.5 18.5L18 4H12Z" fill="#2965F1" />
        <path d="M12 7.5H7.5L8 11.5H12M12 15L9.5 14.5L9.3 13H7.8L8.2 16.5L12 17.5" stroke="white" strokeWidth="1.2" fill="none" />
      </svg>
    );
  }
  if (norm.includes('bash') || norm.includes('shell')) {
    return (
      <svg viewBox="0 0 24 24" fill="#4EAA25" className={className}>
        <rect width="24" height="24" rx="4" />
        <path d="M6 8L10 12L6 16M12 16H18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }
  if (norm.includes('eslint')) {
    return (
      <svg viewBox="0 0 24 24" fill="#4B32C3" className={className}>
        <path d="M12 2L21.5 7.5V18.5L12 24L2.5 18.5V7.5L12 2Z" />
        <path d="M12 6L18 9.5V16.5L12 20L6 16.5V9.5L12 6Z" fill="#8080F2" />
      </svg>
    );
  }
  if (norm.includes('prettier')) {
    return (
      <svg viewBox="0 0 24 24" fill="none" className={className}>
        <rect width="24" height="24" rx="4" fill="#1A2B34" />
        <circle cx="8" cy="8" r="2" fill="#F7B93E" />
        <circle cx="16" cy="8" r="2" fill="#E84D3D" />
        <circle cx="8" cy="16" r="2" fill="#56B6C2" />
        <circle cx="16" cy="16" r="2" fill="#98C379" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M16 18L22 12L16 6" />
      <path d="M8 6L2 12L8 18" />
    </svg>
  );
};
