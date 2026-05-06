import React, { useState } from 'react'

interface ImageWithFallbackProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  /** Initials to show in the avatar fallback (e.g. "SS" for Shweta Shah) */
  initials?: string;
}

export function ImageWithFallback({ initials, ...props }: ImageWithFallbackProps) {
  const [didError, setDidError] = useState(false)
  const { src, alt, style, className, ...rest } = props

  if (didError) {
    // Initials-based avatar fallback
    const letters = initials
      ? initials.toUpperCase()
      : alt
      ? alt
          .split(' ')
          .slice(0, 2)
          .map(w => w[0])
          .join('')
          .toUpperCase()
      : '?'

    return (
      <div
        className={`inline-flex items-center justify-center ${className ?? ''}`}
        style={{
          background: 'linear-gradient(135deg, #374151 0%, #1f2937 100%)',
          color: '#d1d5db',
          fontFamily: 'Inter, sans-serif',
          fontWeight: 300,
          letterSpacing: '0.06em',
          fontSize: typeof style?.width === 'number' ? style.width * 0.28 : 32,
          userSelect: 'none',
          ...style,
        }}
        aria-label={alt}
        data-original-url={src}
      >
        {letters}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      {...rest}
      onError={() => setDidError(true)}
    />
  )
}
