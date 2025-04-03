"use client"

import type { RefObject } from "react"

interface AnimatedBeamProps {
  containerRef: RefObject<HTMLDivElement>
  fromRef: RefObject<HTMLDivElement>
  toRef: RefObject<HTMLDivElement>
  startYOffset?: number
  endYOffset?: number
  curvature?: number
  reverse?: boolean
  duration?: number
}

export function AnimatedBeam({
  containerRef,
  fromRef,
  toRef,
  startYOffset = 0,
  endYOffset = 0,
  curvature = 0,
  reverse = false,
  duration = 2,
}: AnimatedBeamProps) {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 100 100"
      preserveAspectRatio="none"
      className="pointer-events-none absolute left-0 top-0 z-0 h-full w-full"
      style={{
        transform: reverse ? "scaleY(-1)" : "none",
        "--startPoint": reverse ? "100%" : "0%",
        "--endPoint": reverse ? "0%" : "100%",
      }}
    >
      <path
        className="stroke-blue-500/50"
        fill="none"
        strokeWidth="0.5"
        pathLength="1"
        d={`M0,${50 + startYOffset} C${50 - curvature},${50 + startYOffset} ${50 + curvature},${
          50 + endYOffset
        } 100,${50 + endYOffset}`}
      >
        <animate attributeName="stroke-dashoffset" from="1" to="0" dur={`${duration}s`} repeatCount="indefinite" />
        <animate
          attributeName="stroke-dasharray"
          values="0 1; 0.05 0.95; 0.1 0.9; 0.15 0.85; 0.2 0.8; 0.25 0.75; 0.3 0.7; 0.35 0.65; 0.4 0.6; 0.45 0.55; 0.5 0.5; 0.55 0.45; 0.6 0.4; 0.65 0.35; 0.7 0.3; 0.75 0.25; 0.8 0.2; 0.85 0.15; 0.9 0.1; 0.95 0.05; 1 0"
          dur={`${duration}s`}
          repeatCount="indefinite"
        />
      </path>
    </svg>
  )
}

