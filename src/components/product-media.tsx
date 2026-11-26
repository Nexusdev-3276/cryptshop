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
          <span className="media-brand">{brand}</span>
          <span className="media-name">{name}</span>
        </div>
      )}
    </div>
  );
}
