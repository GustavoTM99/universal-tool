import {
  useRef,
  useState,
  type MouseEvent,
} from 'react'

type ToolCardProps = {
  icon: string
  title: string
  description: string
  onClick?: () => void
}

function ToolCard({
  icon,
  title,
  description,
  onClick,
}: ToolCardProps) {
  const cardRef =
    useRef<HTMLButtonElement>(null)

  const [mousePosition, setMousePosition] =
    useState({
      x: 0,
      y: 0,
    })

  const [isHovering, setIsHovering] =
    useState(false)

  function handleMouseMove(
    event: MouseEvent<HTMLButtonElement>
  ) {
    const card =
      cardRef.current

    if (!card) return

    const rect =
      card.getBoundingClientRect()

    setMousePosition({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    })
  }

  return (
    <button
      ref={cardRef}
      onClick={onClick}
      onMouseMove={handleMouseMove}
      onMouseEnter={() =>
        setIsHovering(true)
      }
      onMouseLeave={() =>
        setIsHovering(false)
      }
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:border-violet-400/40 hover:bg-white/[0.045]"
    >
      {/* Cursor glow */}

      <div
        className="pointer-events-none absolute -inset-px transition-opacity duration-300"
        style={{
          opacity: isHovering ? 1 : 0,

          background: `
            radial-gradient(
              220px circle at
              ${mousePosition.x}px
              ${mousePosition.y}px,
              rgba(167, 139, 250, 0.16),
              transparent 70%
            )
          `,
        }}
      />

      {/* Subtle top highlight */}

      <div className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      {/* Card content */}

      <div className="relative z-10">
        <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-violet-400/10 font-mono text-sm text-violet-300 transition-transform duration-300 group-hover:scale-105">
          {icon}
        </div>

        <h2 className="text-lg font-medium">
          {title}
        </h2>

        <p className="mt-1 text-sm text-white/40">
          {description}
        </p>

        <div className="mt-6 text-sm text-white/20 transition-all duration-300 group-hover:translate-x-1 group-hover:text-violet-300">
          Open →
        </div>
      </div>
    </button>
  )
}

export default ToolCard