import { Routes, Route, useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import Header from './components/Header'
import ToolCard from './components/ToolCard'
import JsonFormatter from './tools/json/JsonFormatter'
import PasswordGenerator from './tools/password/PasswordGenerator'
import QrGenerator from './tools/qr/QrGenerator'
import NotFound from './components/NotFound'

function Home() {
  const navigate = useNavigate()

  return (
    <>
      <Helmet>
        <title>
          Universal Tool — Fast, Private Online Tools
        </title>

        <meta
          name="description"
          content="Fast, private and free online tools that run directly in your browser. Format JSON, generate secure passwords, create QR codes and more."
        />

        <meta
          name="robots"
          content="index, follow"
        />

        <meta
          property="og:title"
          content="Universal Tool — Fast, Private Online Tools"
        />

        <meta
          property="og:description"
          content="Fast, private and free online tools. No accounts, no uploads, no nonsense."
        />

        <meta
          property="og:type"
          content="website"
        />

        <meta
          name="twitter:title"
          content="Universal Tool — Fast, Private Online Tools"
        />

        <meta
          name="twitter:description"
          content="Fast, private and free online tools. No accounts, no uploads, no nonsense."
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

          <div className="mt-10 grid w-full max-w-3xl gap-3 sm:mt-12 sm:gap-4 md:grid-cols-3">

            <ToolCard
              icon="{ }"
              title="JSON"
              description="Format & validate"
              onClick={() => navigate('/tools/json-formatter')}
            />

            <ToolCard
              icon="✦"
              title="Password"
              description="Generate securely"
              onClick={() => navigate('/tools/password-generator')}
            />

            <ToolCard
              icon="▦"
              title="QR Code"
              description="Generate instantly"
              onClick={() => navigate('/tools/qr-generator')}
            />

          </div>
        </section>
      </div>
    </main>
     </>
  )
}

function App() {
  const navigate = useNavigate()

  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/tools/json-formatter"
        element={
          <JsonFormatter
            onBack={() => navigate('/')}
          />
        }
      />

      <Route
        path="/tools/password-generator"
        element={
          <PasswordGenerator
            onBack={() => navigate('/')}
          />
        }
      />

      <Route
        path="/tools/qr-generator"
        element={
          <QrGenerator
            onBack={() => navigate('/')}
          />
        }
      />
       <Route
        path="*"
        element={<NotFound />}
      />
    </Routes>
  )
}

export default App