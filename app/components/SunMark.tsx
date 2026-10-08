type Variant = 'full' | 'compact' | 'success' | 'loading' | 'thinking';

const assets: Record<Variant, string> = {
  full: '/mascot/sun-friendly-full.webp',
  compact: '/mascot/sun-friendly-compact.webp',
  success: '/mascot/sun-friendly-success.webp',
  loading: '/mascot/sun-friendly-loading.webp',
  thinking: '/mascot/sun-friendly-loading.webp',
};

export default function SunMark({
  compact = false,
  variant,
}: {
  compact?: boolean;
  variant?: Variant;
}) {
  const resolved: Variant = variant ?? (compact ? 'compact' : 'full');

  return (
    <span
      className={`sun-character ${resolved === 'compact' ? 'is-compact ' : ''}is-${resolved}`}
      aria-hidden="true"
    >
      <img
        src={assets[resolved]}
        alt=""
        draggable={false}
      />
    </span>
  );
}
