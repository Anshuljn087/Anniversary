"use client";

import { useState } from "react";

export default function PhotoFrame({
  src,
  alt,
  className = "",
  style,
}: {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        style={style}
        className={`flex items-center justify-center bg-gradient-to-br from-obsidian-2 via-obsidian-1 to-black text-champagne/40 ${className}`}
      >
        <span className="font-display italic text-lg">our photo</span>
      </div>
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading="lazy"
      draggable={false}
      onError={() => setErrored(true)}
      style={style}
      className={`object-cover ${className}`}
    />
  );
}
