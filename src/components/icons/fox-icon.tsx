import type { SVGProps } from 'react';

export function FoxIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M11.25 6.42a.5.5 0 0 1 .5-.42h.5a.5.5 0 0 1 .5.42v.03a.5.5 0 0 0 .5.47h.03a.5.5 0 0 0 .47-.5V6a2 2 0 0 0-2-2h-1a2 2 0 0 0-2 2v.5a.5.5 0 0 0 .5.5h.03a.5.5 0 0 0 .47-.5z" />
      <path d="m3.5 11.5-.5-1a2 2 0 0 1 1-2.5 2 2 0 0 1 2.5 1l.5 1" />
      <path d="M14.5 11.5 15 12" />
      <path d="M21.5 11.5.5 22" />
      <path d="m3 22 1-3" />
      <path d="M21 3.5 19 8" />
      <path d="M11.5 11.5 9 13" />
      <path d="m14 17 2-1" />
      <path d="m9 17 2-1" />
      <path d="m7 14-1.5 2.5" />
    </svg>
  );
}
