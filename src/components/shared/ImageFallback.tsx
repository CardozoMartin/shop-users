interface ImageFallbackProps {
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

export default function ImageFallback({
  label = 'Aun no cargo imagen',
  className = '',
  style,
}: ImageFallbackProps) {
  return (
    <div
      className={`flex h-full w-full items-center justify-center text-center ${className}`}
      style={style}
    >
      <span className="px-4 text-xs font-bold uppercase tracking-[0.12em] opacity-60">
        {label}
      </span>
    </div>
  );
}
