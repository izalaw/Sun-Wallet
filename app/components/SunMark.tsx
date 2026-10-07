export default function SunMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className={compact ? 'sun-mark compact' : 'sun-mark'} aria-hidden="true">
      <span className="sun-mark-eye left" />
      <span className="sun-mark-eye right" />
    </span>
  );
}
