import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'

function NotFound() {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>404 — Page Not Found | Universal Tool</title>

        <meta
          name="description"
          content="The page you're looking for doesn't exist."
        />

        <meta
          name="robots"
          content="noindex, follow"
        />
      </Helmet>

      <main className="relative min-h-screen overflow-hidden bg-[#09090b] text-white">

        {/* Background */}
        <div className="pointer-events-none absolute inset-0">

          <div className="home-grid absolute inset-0" />

          <div
            className="
              absolute
              left-1/2
              top-1/2
              h-[500px]
              w-[700px]
              -translate-x-1/2
              -translate-y-1/2
              rounded-full
              bg-violet-500/[0.08]
              blur-[140px]
            "
          />
        </div>

        {/* Content */}
        <div className="relative z-10 flex min-h-screen items-center justify-center px-6">

          <div className="text-center">

            {/* Logo */}
            <img
              src="/universal-icon.svg"
              alt=""
              className="mx-auto mb-8 h-16 w-16"
            />

            {/* 404 */}
            <div className="font-mono text-sm tracking-[0.3em] text-violet-300">
              ERROR 404
            </div>

            <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
              Nothing here.
            </h1>

            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/40">
              This tool doesn't exist.
              <br />
              Maybe it should.
            </p>

            <button
              onClick={() => navigate('/')}
              className="
                mt-8
                rounded-xl
                border
                border-violet-400/20
                bg-violet-400/10
                px-5
                py-2.5
                text-sm
                text-violet-200
                transition
                hover:border-violet-400/30
                hover:bg-violet-400/15
              "
            >
              ← Back to tools
            </button>

          </div>
        </div>
      </main>
    </>
  )
}

export default NotFound