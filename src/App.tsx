import { Routes, Route, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Header from './components/Header'
import ToolCard from './components/ToolCard'
import NotFound from './components/NotFound'
import { Suspense, useState } from 'react'
import { tools } from './config/tools'

function Home() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')

  const filteredTools = tools.filter((tool) => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return true
    }

    const searchableText = [
      tool.title,
      tool.description,
      tool.category,
      ...tool.keywords,
    ]
      .join(' ')
      .toLowerCase()

    return searchableText.includes(query)
  })

  return (
    <>
      <Helmet>
  <title>Universal Tool — Fast, Private Online Tools</title>

  <meta
    name="description"
    content="Fast, private and free online tools that run directly in your browser. Format JSON, generate secure passwords, create QR codes and more."
  />

  <meta name="robots" content="index, follow" />

  {/* Open Graph */}
  <meta property="og:type" content="website" />

  <meta
    property="og:title"
    content="Universal Tool — Fast, Private Online Tools"
  />

  <meta
    property="og:description"
    content="Fast, private and free online tools. No accounts, no uploads, no nonsense."
  />

  <meta
    property="og:image"
    content="https://TU-DOMINIO.com/og-image.png"
  />

  <meta
    property="og:image:width"
    content="1200"
  />

  <meta
    property="og:image:height"
    content="630"
  />

  <meta
    property="og:image:alt"
    content="Universal Tool — Fast, private online tools"
  />

  <meta
    property="og:url"
    content="https://TU-DOMINIO.com/"
  />

  <meta
    property="og:site_name"
    content="Universal Tool"
  />

  {/* Twitter / X */}
  <meta
    name="twitter:card"
    content="summary_large_image"
  />

  <meta
    name="twitter:title"
    content="Universal Tool — Fast, Private Online Tools"
  />

  <meta
    name="twitter:description"
    content="Fast, private and free online tools. No accounts, no uploads, no nonsense."
  />

  <meta
    name="twitter:image"
    content="https://TU-DOMINIO.com/og-image.png"
  />
</Helmet>
    <main className="relative min-h-screen overflow-hidden bg-[#09090b] text-white">

      {/* Background effects */}
      <div className="pointer-events-none absolute inset-0">

        {/* Subtle grid */}
        <div className="home-grid absolute inset-0" />

        {/* Main violet ambient glow */}
        <div
          className="
            ambient-glow
            absolute
            left-1/2
            top-[32%]
            h-[650px]
            w-[850px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-violet-500/[0.08]
            blur-[140px]
          "
        />

        {/* Secondary glow */}
        <div
          className="
            absolute
            left-[20%]
            top-[60%]
            h-[300px]
            w-[300px]
            rounded-full
            bg-fuchsia-500/[0.035]
            blur-[120px]
          "
        />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto max-w-6xl px-6 py-10">
        <Header />

        <section className="flex min-h-[calc(100vh-120px)] flex-col items-center justify-center py-12 text-center sm:min-h-[70vh] sm:py-16">

          <div className="mb-6 rounded-full border border-violet-400/20 bg-violet-400/10 px-4 py-1.5 text-sm text-violet-300">
            ✦ Just what you need, no fluff.
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
            Tiny tools.
            <br />

            <span className="text-white/40">
              Ridiculously useful.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/50 sm:mt-6 sm:text-lg">
            Fast, private tools that run directly in your browser.
            No accounts. No uploads. No nonsense.
          </p>
<div className="relative mt-8 w-full max-w-xl">
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="
      pointer-events-none
      absolute
      left-4
      top-1/2
      h-4
      w-4
      -translate-y-1/2
      text-white/30
    "
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>

  <input
    type="text"
    value={search}
    onChange={(event) =>
      setSearch(event.target.value)
    }
    onKeyDown={(event) => {
      if (event.key === 'Escape') {
        setSearch('')
        event.currentTarget.blur()
      }
    }}
    placeholder="Search tools..."
    aria-label="Search tools"
    className="
      w-full
      rounded-2xl
      border
      border-white/10
      bg-white/[0.035]
      py-3.5
      pl-11
      pr-11
      text-sm
      text-white
      outline-none
      backdrop-blur-xl
      transition
      placeholder:text-white/25
      hover:border-white/15
      hover:bg-white/[0.05]
      focus:border-violet-400/40
      focus:bg-violet-400/[0.04]
      focus:ring-4
      focus:ring-violet-500/[0.06]
    "
  />

  {search && (
    <button
      type="button"
      onClick={() => setSearch('')}
      aria-label="Clear search"
      className="
        absolute
        right-3
        top-1/2
        flex
        h-7
        w-7
        -translate-y-1/2
        items-center
        justify-center
        rounded-lg
        text-white/30
        transition
        hover:bg-white/[0.06]
        hover:text-white/70
      "
    >
      ×
    </button>
  )}
</div>
<div className="mt-6 w-full max-w-3xl">
  {filteredTools.length > 0 ? (
    <div className="grid gap-3 sm:grid-cols-2 sm:gap-4">
      {filteredTools.map((tool) => (
        <ToolCard
          key={tool.id}
          icon={tool.icon}
          title={tool.title}
          description={tool.description}
          onClick={() =>
            navigate(tool.path)
          }
        />
      ))}
    </div>
  ) : (
    <div
      className="
        rounded-2xl
        border
        border-white/[0.07]
        bg-white/[0.02]
        px-6
        py-10
        text-center
      "
    >
      <div className="text-2xl">
        ¯\_(ツ)_/¯
      </div>

      <p className="mt-3 text-sm font-medium text-white/60">
        No tools found
      </p>

      <p className="mt-1 text-sm text-white/30">
        Nothing matches “{search}”
      </p>
    </div>
  )}
</div>
        </section>
      </div>
    </main>
     </>
  )
}

function ToolLoading() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#09090b] text-white">

      <div className="pointer-events-none absolute inset-0">
        <div className="home-grid absolute inset-0" />

        <div
          className="
            absolute
            left-1/2
            top-1/2
            h-[400px]
            w-[500px]
            -translate-x-1/2
            -translate-y-1/2
            rounded-full
            bg-violet-500/[0.06]
            blur-[120px]
          "
        />
      </div>

      <div className="relative z-10 flex flex-col items-center">
        <img
          src="/universal-icon.svg"
          alt=""
          className="h-12 w-12 animate-pulse"
        />

        <div className="mt-4 text-sm text-white/30">
          Loading tool...
        </div>
      </div>

    </main>
  )
}

function App() {
  const navigate = useNavigate()

  return (
    <Suspense fallback={<ToolLoading />}>
      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        {tools.map((tool) => {
          const ToolComponent =
            tool.component

          return (
            <Route
              key={tool.id}
              path={tool.path}
              element={
                <ToolComponent
                  onBack={() =>
                    navigate('/')
                  }
                />
              }
            />
          )
        })}

        <Route
          path="*"
          element={<NotFound />}
        />

      </Routes>
    </Suspense>
  )
}

export default App