type Variant = 'full' | 'compact' | 'success' | 'loading';

const assets: Record<Variant, string> = {
  full: '/mascot/sun-friendly-full.svg',
  compact: '/mascot/sun-friendly-compact.svg',
  success: '/mascot/sun-friendly-success.svg',
  loading: '/mascot/sun-friendly-loading.svg',
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
