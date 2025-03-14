import type { SVGProps } from "react"

export function BackerBoostLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect width="64" height="64" rx="16" fill="url(#gradient)" />
      <path
        d="M32 16C23.164 16 16 23.164 16 32C16 40.836 23.164 48 32 48C40.836 48 48 40.836 48 32C48 23.164 40.836 16 32 16Z"
        fill="white"
        fillOpacity="0.2"
      />
      <path
        d="M32 20C25.373 20 20 25.373 20 32C20 38.627 25.373 44 32 44C38.627 44 44 38.627 44 32C44 25.373 38.627 20 32 20Z"
        fill="white"
        fillOpacity="0.2"
      />
      <path
        d="M32 24C27.582 24 24 27.582 24 32C24 36.418 27.582 40 32 40C36.418 40 40 36.418 40 32C40 27.582 36.418 24 32 24Z"
        fill="white"
      />
      <path d="M32 28L36 32L32 36L28 32L32 28Z" fill="url(#diamond)" />
      <path d="M32 14L34 18H30L32 14Z" fill="white" />
      <path d="M32 50L30 46H34L32 50Z" fill="white" />
      <path d="M14 32L18 30V34L14 32Z" fill="white" />
      <path d="M50 32L46 34V30L50 32Z" fill="white" />
      <path d="M44 20L40 22L42 18L44 20Z" fill="white" />
      <path d="M20 44L22 40L18 42L20 44Z" fill="white" />
      <path d="M20 20L22 24L18 22L20 20Z" fill="white" />
      <path d="M44 44L42 46L40 42L44 44Z" fill="white" />
      <defs>
        <linearGradient id="gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
        <linearGradient id="diamond" x1="28" y1="28" x2="36" y2="36" gradientUnits="userSpaceOnUse">
          <stop stopColor="#6366F1" />
          <stop offset="1" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>
    </svg>
  )
}

