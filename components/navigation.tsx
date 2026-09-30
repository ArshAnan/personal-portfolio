"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { useCyclingTelemetry } from "@/lib/use-telemetry"

export function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    if (path === "/") return pathname === "/"
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  return (
    <div className="border-b border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 px-2 py-1">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-4">
          <span className="font-semibold text-black dark:text-white">Arsh&apos;s Internet Corner</span>
            <nav className="flex gap-4 ml-8">
            <Link 
              href="/" 
              className={`px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                isActive("/") ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
            >
              File
            </Link>
            <Link
              href="/blog"
              className={`px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                isActive("/blog") ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
            >
              Blog
            </Link>
            <Link
              href="/lab"
              className={`px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                isActive("/lab") ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
            >
              Lab
            </Link>
            <Link
              href="/contact"
              className={`px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                isActive("/contact") ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
            >
              Contact
            </Link>
          </nav>
        </div>
        <ThemeToggle />
      </div>
    </div>
  )
}

export function StatusBar({ leftText, rightText }: { leftText: string; rightText: string }) {
  // Cycles through rightText and a few live, zero-network ephemeris
  // readouts (moon phase, what's overhead in NYC). Frame 0 is always
  // rightText itself, and server + first client render both show exactly
  // that — see lib/use-telemetry.ts for why that's what keeps this
  // hydration-safe without suppressHydrationWarning.
  const cycled = useCyclingTelemetry(rightText)
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 px-4 py-1 text-xs">
      <div className="flex justify-between text-black dark:text-white">
        <span>{leftText}</span>
        <span>{cycled}</span>
      </div>
    </div>
  )
}
