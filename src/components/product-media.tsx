"use client";

import { useEffect, useRef, useState } from "react";

export function ProductMedia({
  src,
  name,
  brand,
}: {
  src: string;
  name: string;
  brand: string;
}) {
  const [failed, setFailed] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const image = imageRef.current;
    if (image && image.complete && image.naturalWidth === 0) {
      setFailed(true);
    }
  }, []);

  return (
    <div className="product-media">
      {!failed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img ref={imageRef} src={src} alt={name} loading="lazy" onError={() => setFailed(true)} />
      ) : (
        <div className="media-fallback">
          <span className="media-fallback-icon" aria-hidden="true">
            <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </span>
          <span className="media-brand">{brand}</span>
          <span className="media-name">{name}</span>
        </div>
      )}
    </div>
  );
}
