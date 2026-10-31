/**
 * A portrait phone cannot hold a 16:9 sheet at a readable size, so ask for
 * the quarter turn instead of showing a strip. Visibility is a media query
 * alone: rotating the phone dismisses it with nothing to listen for.
 *
 * The icon is drawn in line work, like everything else on the sheet.
 */
export function RotateHint() {
  return (
    <div className="rotate-hint" data-no-advance="">
      <svg
        className="rotate-hint__icon"
        viewBox="0 0 96 96"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        aria-hidden="true"
      >
        {/* the phone, mid-turn */}
        <rect x="34" y="20" width="28" height="48" rx="3" />
        <line x1="34" y1="28" x2="62" y2="28" opacity="0.5" />
        <line x1="34" y1="60" x2="62" y2="60" opacity="0.5" />
        {/* the turn */}
        <path d="M 22 50 A 26 26 0 0 0 48 76" strokeDasharray="3 4" />
        <path d="M 48 76 l -7 -5 M 48 76 l -5 7" />
      </svg>
      <p style={{ margin: 0 }}>Turn your phone sideways</p>
    </div>
  )
}
