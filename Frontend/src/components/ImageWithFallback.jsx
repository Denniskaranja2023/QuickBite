import { useState } from 'react';

function ImageWithFallback({ src, alt, className }) {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <svg
          className="w-1/2 h-1/2 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
          />
        </svg>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setError(true)}
    />
  );
}

export default ImageWithFallback;

