// SVG Illustrations for empty states, loading, and success

export function EmptyCartSVG() {
  return (
    <svg viewBox="0 0 200 200" className="svg-illustration" aria-label="Empty shopping cart">
      <defs>
        <linearGradient id="cartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6c5ce7" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#00cec9" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#cartGrad)" />
      <g className="svg-draw" stroke="#6c5ce7" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M60 70 L75 70 L85 120 L140 120 L150 80 L80 80" />
        <circle cx="90" cy="135" r="6" />
        <circle cx="130" cy="135" r="6" />
        <path d="M95 95 L125 95" strokeDasharray="4 4" />
        <path d="M100 105 L120 105" strokeDasharray="4 4" />
      </g>
    </svg>
  );
}

export function SuccessSVG() {
  return (
    <svg viewBox="0 0 200 200" className="svg-illustration svg-success" aria-label="Order successful">
      <defs>
        <linearGradient id="successGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00b894" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#00cec9" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#successGrad)" className="svg-pulse" />
      <circle cx="100" cy="100" r="50" fill="none" stroke="#00b894" strokeWidth="4" className="svg-circle-draw" />
      <path
        d="M75 100 L92 117 L125 84"
        fill="none"
        stroke="#00b894"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="svg-check-draw"
      />
    </svg>
  );
}

export function LoadingSVG() {
  return (
    <svg viewBox="0 0 100 100" className="svg-loading" aria-label="Loading">
      <circle cx="50" cy="50" r="40" fill="none" stroke="#e0e0e0" strokeWidth="6" />
      <circle
        cx="50" cy="50" r="40"
        fill="none"
        stroke="#6c5ce7"
        strokeWidth="6"
        strokeLinecap="round"
        strokeDasharray="80 200"
        className="svg-spinner"
      />
    </svg>
  );
}

export function NoResultsSVG() {
  return (
    <svg viewBox="0 0 200 200" className="svg-illustration" aria-label="No results found">
      <defs>
        <linearGradient id="searchGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6c5ce7" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#a29bfe" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="80" fill="url(#searchGrad)" />
      <g stroke="#6c5ce7" strokeWidth="3" fill="none" strokeLinecap="round">
        <circle cx="90" cy="90" r="30" className="svg-draw" />
        <line x1="112" y1="112" x2="140" y2="140" strokeWidth="5" className="svg-draw" />
        <path d="M80 85 L100 85" strokeDasharray="3 3" />
        <path d="M80 95 L100 95" strokeDasharray="3 3" />
      </g>
    </svg>
  );
}

export function CartIconAnimated({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`svg-cart-icon ${className}`} aria-hidden="true">
      <g stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 6h15l-1.5 9h-12z" />
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M1 1h4l1 5" />
      </g>
    </svg>
  );
}
