import { useCallback, useEffect, useState, type ImgHTMLAttributes } from "react";
import { ImageOff, RotateCw } from "lucide-react";

interface SafeImageProps extends Omit<ImgHTMLAttributes<HTMLImageElement>, "onError" | "onLoad"> {
  src: string;
  alt: string;
  /** Optional caption shown in the fallback, defaults to alt. */
  fallbackLabel?: string;
}

/**
 * Drop-in <img> replacement with a quiet fallback panel and retry.
 * Uses a cache-busting query param on retry so a transient failure can recover.
 */
export const SafeImage = ({ src, alt, className, fallbackLabel, ...rest }: SafeImageProps) => {
  const [failed, setFailed] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    setFailed(false);
    setAttempt(0);
  }, [src]);

  const retry = useCallback(() => {
    setFailed(false);
    setAttempt((n) => n + 1);
  }, []);

  if (failed) {
    return (
      <div
        role="img"
        aria-label={`${alt} (failed to load)`}
        className={`relative flex flex-col items-center justify-center gap-3 bg-surface-container text-on-surface-variant ${className ?? ""}`}
      >
        <ImageOff size={28} strokeWidth={1.25} aria-hidden="true" className="opacity-60" />
        <p className="font-label uppercase tracking-[0.2em] text-[10px] text-center px-4 max-w-[80%] truncate">
          {fallbackLabel ?? alt}
        </p>
        <button
          type="button"
          onClick={retry}
          className="inline-flex items-center gap-1.5 font-label uppercase tracking-[0.2em] text-[10px] text-secondary hover:text-primary transition-colors"
        >
          <RotateCw size={12} strokeWidth={1.5} aria-hidden="true" />
          Retry
        </button>
      </div>
    );
  }

  const finalSrc = attempt > 0 ? `${src}${src.includes("?") ? "&" : "?"}r=${attempt}` : src;

  return (
    <img
      {...rest}
      src={finalSrc}
      alt={alt}
      className={className}
      onError={() => setFailed(true)}
    />
  );
};

export default SafeImage;
