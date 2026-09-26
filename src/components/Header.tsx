function Header() {
  return (
    <header className="flex items-center justify-between gap-4">

      {/* Logo */}
      <div className="text-lg font-semibold tracking-tight text-white">
        universal
        <span className="text-violet-400">.</span>
      </div>

      {/* Mobile privacy indicator */}
      <div
        className="
          flex
          items-center
          gap-2
          rounded-full
          border
          border-white/10
          bg-white/[0.03]
          px-3
          py-1.5
          text-[11px]
          text-white/40

          sm:hidden
        "
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

        Private
      </div>

      {/* Desktop privacy message */}
      <div
        className="
          hidden
          items-center
          gap-2
          rounded-full
          border
          border-white/10
          bg-white/[0.03]
          px-4
          py-2
          text-xs
          text-white/40

          sm:flex
        "
      >
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />

        Your information is safe with us. We do not collect any data.
      </div>

    </header>
  )
}

export default Header