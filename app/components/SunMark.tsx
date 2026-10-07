type Variant = 'full' | 'compact' | 'success' | 'loading';

export default function SunMark({
  compact = false,
  variant,
}: {
  compact?: boolean;
  variant?: Variant;
}) {
  const resolved: Variant = variant ?? (compact ? 'compact' : 'full');
  const isCompact = resolved === 'compact';

  return (
    <span
      className={`sun-character ${isCompact ? 'is-compact' : ''} is-${resolved}`}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 180 180"
        role="img"
        focusable="false"
        className="sun-character-svg"
      >
        <defs>
          <linearGradient id="sunBody" x1="0" y1="0" x2="0.85" y2="1">
            <stop offset="0%" stopColor="#FFD85A" />
            <stop offset="65%" stopColor="#F3B82E" />
            <stop offset="100%" stopColor="#E7A720" />
          </linearGradient>
          <radialGradient id="sunGlow" cx="35%" cy="20%" r="80%">
            <stop offset="0%" stopColor="#FFF5B9" stopOpacity=".9" />
            <stop offset="52%" stopColor="#FFD65A" stopOpacity=".16" />
            <stop offset="100%" stopColor="#E9A81D" stopOpacity="0" />
          </radialGradient>
          <filter id="sunShadow" x="-30%" y="-30%" width="160%" height="180%">
            <feDropShadow dx="0" dy="8" stdDeviation="8" floodColor="#A77713" floodOpacity=".15" />
          </filter>
        </defs>

        {isCompact ? (
          <>
            <ellipse cx="90" cy="148" rx="38" ry="8" fill="#9C6D15" opacity=".10" />
            <g filter="url(#sunShadow)">
              <ellipse cx="90" cy="86" rx="55" ry="50" fill="url(#sunBody)" />
              <ellipse cx="90" cy="82" rx="52" ry="47" fill="url(#sunGlow)" />
              <path d="M44 79c-18 3-23 18-11 24 8 5 17-1 24-9" fill="#F0B52C" />
              <path d="M136 78c17 3 23 17 12 24-8 5-18-1-25-9" fill="#F0B52C" />
              <path d="M72 84c0-9 8-15 15-15" className="sun-eye-arc" />
              <path d="M108 84c0-9 8-15 15-15" className="sun-eye-arc" />
            </g>
          </>
        ) : (
          <>
            <ellipse cx="90" cy="159" rx="49" ry="9" fill="#9C6D15" opacity=".10" />
            <g filter="url(#sunShadow)">
              <path
                d="M90 22c35 0 57 27 57 61v24c0 14-3 28-10 39-7 12-17 17-29 17-8 0-13-5-18-13-5 8-10 13-18 13-12 0-22-5-29-17-7-11-10-25-10-39V83c0-34 22-61 57-61Z"
                fill="url(#sunBody)"
              />
              <path
                d="M90 23c29 0 50 21 55 49-9-24-31-39-56-39-25 0-47 14-57 38 5-27 27-48 58-48Z"
                fill="url(#sunGlow)"
              />
              <path d="M40 82c-18 4-26 21-14 29 8 5 18-1 29-12" fill="#EFB22A" />
              <path d="M140 79c18 2 27-14 34-7 10 10-6 29-31 33" fill="#F0B52C" />

              {resolved === 'success' ? (
                <>
                  <path d="M64 82c0-10 8-17 16-17" className="sun-eye-arc" />
                  <path d="M108 83c2-9 9-14 17-13" className="sun-eye-arc" />
                  <path d="M75 108c9 10 22 10 31 0" className="sun-mouth" />
                  <path d="M149 43l8-13M161 54l13-8" className="sun-ray" />
                </>
              ) : resolved === 'loading' ? (
                <>
                  <circle cx="73" cy="79" r="5" className="sun-eye-dot" />
                  <circle cx="111" cy="79" r="5" className="sun-eye-dot" />
                </>
              ) : (
                <>
                  <path d="M64 82c0-10 8-17 16-17" className="sun-eye-arc" />
                  <path d="M108 82c0-10 8-17 16-17" className="sun-eye-arc" />
                </>
              )}
            </g>
          </>
        )}
      </svg>
    </span>
  );
}
