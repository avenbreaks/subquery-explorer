"use client"

import { useTheme } from "next-themes"
import { useEffect, useRef } from "react"

export function GeometricLines() {
  const canvasRef = useRef(null)
  const { theme } = useTheme()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const isDark = theme === "dark"

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Draw geometric lines
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Set line style based on theme
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.03)" : "rgba(0, 0, 0, 0.03)"
      ctx.lineWidth = 1

      // Draw horizontal lines
      const horizontalGap = 40
      for (let y = 0; y < canvas.height; y += horizontalGap) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw vertical lines
      const verticalGap = 40
      for (let x = 0; x < canvas.width; x += verticalGap) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Draw diagonal lines
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.02)" : "rgba(0, 0, 0, 0.02)"
      const diagonalGap = 100
      for (let i = -canvas.height; i < canvas.width + canvas.height; i += diagonalGap) {
        ctx.beginPath()
        ctx.moveTo(i, 0)
        ctx.lineTo(i + canvas.height, canvas.height)
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(i, canvas.height)
        ctx.lineTo(i + canvas.height, 0)
        ctx.stroke()
      }

      // Add some blockchain-inspired hexagonal patterns
      const hexSize = 80
      ctx.strokeStyle = isDark ? "rgba(255, 255, 255, 0.015)" : "rgba(0, 0, 0, 0.015)"

      for (let x = 0; x < canvas.width + hexSize; x += hexSize * 1.5) {
        for (let y = 0; y < canvas.height + hexSize; y += hexSize * 1.7) {
          drawHexagon(ctx, x, y, hexSize)
        }
      }
    }

    function drawHexagon(ctx, x, y, size) {
      ctx.beginPath()
      for (let i = 0; i < 6; i++) {
        const angle = (Math.PI / 3) * i
        const xPos = x + size * Math.cos(angle)
        const yPos = y + size * Math.sin(angle)

        if (i === 0) {
          ctx.moveTo(xPos, yPos)
        } else {
          ctx.lineTo(xPos, yPos)
        }
      }
      ctx.closePath()
      ctx.stroke()
    }

    draw()

    // Redraw when theme changes
    const observer = new MutationObserver(() => {
      draw()
    })

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      observer.disconnect()
    }
  }, [theme])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
}

