import { NOW } from "@/lib/now"

// A terse "what I'm actually doing right now" block. Edit lib/now.ts to
// change the content — this component just renders it.
export function NowStrip() {
  return (
    <div className="text-sm leading-relaxed text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 p-4">
      <div className="text-xs text-gray-500 mb-2">{`// now — updated ${NOW.updated}`}</div>
      <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <span className="text-gray-500">reading</span>
        <span>{NOW.reading.join(", ")}</span>
        <span className="text-gray-500">building</span>
        <span>{NOW.building.join(", ")}</span>
      </div>
    </div>
  )
}
