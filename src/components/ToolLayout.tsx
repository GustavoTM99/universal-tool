import type { ReactNode } from 'react'
import Header from './Header'

type ToolLayoutProps = {
  icon: string
  title: string
  description: string
  status?: string
  onBack: () => void
  children: ReactNode
  maxWidth?: '5xl' | '7xl'
}

function ToolLayout({
  icon,
  title,
  description,
  status = 'processed locally',
  onBack,
  children,
  maxWidth = '5xl',
}: ToolLayoutProps) {
  const width =
    maxWidth === '7xl'
      ? 'max-w-7xl'
      : 'max-w-5xl'

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#09090b] text-white">

      {/* ================================= */}
      {/* AMBIENT BACKGROUND                */}
      {/* ================================= */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        {/* Grid */}

        <div className="home-grid absolute inset-0 opacity-25 sm:opacity-40" />

        {/* Main violet glow */}

        <div
          className="
            absolute
            left-1/2
            top-[-80px]
            h-[300px]
            w-[300px]
            -translate-x-1/2
            rounded-full
            bg-violet-500/[0.06]
            blur-[100px]

            sm:top-[-140px]
            sm:h-[450px]
            sm:w-[550px]
            sm:blur-[130px]

            lg:top-[-180px]
            lg:h-[500px]
            lg:w-[700px]
            lg:blur-[140px]
          "
        />
      </div>

      {/* ================================= */}
      {/* CONTENT                           */}
      {/* ================================= */}

      <div
        className={`
          relative
          z-10
          mx-auto
          ${width}
          px-4
          py-6

          sm:px-6
          sm:py-8

          lg:py-10
        `}
      >
        <Header />

        {/* ================================= */}
        {/* BACK                              */}
        {/* ================================= */}

        <button
          onClick={onBack}
          className="
            group
            mt-8
            inline-flex
            min-h-10
            items-center
            gap-2
            text-sm
            text-white/35
            transition
            duration-200
            hover:text-white

            sm:mt-10
            lg:mt-12
          "
        >
          <span className="transition-transform duration-200 group-hover:-translate-x-1">
            ←
          </span>

          All tools
        </button>

        {/* ================================= */}
        {/* TOOL                              */}
        {/* ================================= */}

        <section className="mt-5 sm:mt-7 lg:mt-8">

          {/* Heading */}

          <div
            className="
              flex
              flex-col
              gap-5

              md:flex-row
              md:items-end
              md:justify-between
              md:gap-6
            "
          >
            <div className="min-w-0">

              {/* Icon */}

              <div
                className="
                  mb-4
                  flex
                  h-10
                  w-10
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-violet-400/10
                  bg-violet-400/10
                  font-mono
                  text-base
                  text-violet-300
                  shadow-[0_0_30px_rgba(139,92,246,0.05)]

                  sm:h-11
                  sm:w-11
                  sm:text-lg
                "
              >
                {icon}
              </div>

              {/* Title */}

              <h1
                className="
                  text-3xl
                  font-semibold
                  tracking-tight

                  sm:text-4xl
                "
              >
                {title}
              </h1>

              {/* Description */}

              <p
                className="
                  mt-2
                  max-w-xl
                  text-sm
                  leading-relaxed
                  text-white/40

                  sm:text-base
                "
              >
                {description}
              </p>
            </div>

            {/* Local status

                Desktop: right side.
                Mobile: below description.
            */}

            <div
              className="
                flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                border-emerald-400/10
                bg-emerald-400/[0.035]
                px-3
                py-1.5
                text-[11px]
                text-emerald-400/70

                sm:text-xs

                md:shrink-0
              "
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-30" />

                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>

              {status}
            </div>
          </div>

          {/* Tool content */}

          <div className="mt-7 sm:mt-8 lg:mt-10">
            {children}
          </div>
        </section>
      </div>
    </main>
  )
}

export default ToolLayout