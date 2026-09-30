import type * as React from "react"
import { Card, CardContent } from "@/components/ui/card"

type LabPanelProps = {
  title: string
  meta?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
}

// Shared shell for every /lab demo: a titlebar strip (name + optional meta,
// e.g. solve timing) over the content, matching the rest of the site's
// `border-2 border-black dark:border-white` Card override rather than
// shadcn's default rounded/shadowed look.
export function LabPanel({ title, meta, children, footer }: LabPanelProps) {
  return (
    <Card className="border-2 border-black dark:border-white rounded-none gap-0 py-0">
      <div className="flex items-center justify-between gap-3 border-b-2 border-black dark:border-white px-4 py-2 bg-gray-100 dark:bg-gray-800">
        <h2 className="text-sm font-semibold">{title}</h2>
        {meta ? <div className="text-xs text-gray-600 dark:text-gray-400">{meta}</div> : null}
      </div>
      <CardContent className="p-4 md:p-6">{children}</CardContent>
      {footer ? (
        <div className="border-t border-gray-300 dark:border-gray-700 px-4 py-2 text-xs text-gray-600 dark:text-gray-400">
          {footer}
        </div>
      ) : null}
    </Card>
  )
}
