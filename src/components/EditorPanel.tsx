import type { ReactNode } from 'react'

type EditorPanelProps = {
  title: string
  action: ReactNode
  children: ReactNode
}

function EditorPanel({
  title,
  action,
  children,
}: EditorPanelProps) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.025]">
      <div className="flex items-center justify-between border-b border-white/10 px-5 py-3">
        <span className="text-xs font-medium uppercase tracking-wider text-white/30">
          {title}
        </span>

        {action}
      </div>

      {children}
    </div>
  )
}

export default EditorPanel