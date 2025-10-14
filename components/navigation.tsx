"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function Navigation() {
  const pathname = usePathname()

  const isActive = (path: string) => {
    return pathname === path
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
              href="/projects" 
              className={`px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                isActive("/projects") ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
            >
              Projects
            </Link>
            <Link 
              href="/skills" 
              className={`px-2 py-1 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors ${
                isActive("/skills") ? "bg-gray-200 dark:bg-gray-700" : ""
              }`}
            >
              Skills
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
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-100 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600 px-4 py-1 text-xs">
      <div className="flex justify-between text-black dark:text-white">
        <span>{leftText}</span>
        <span>{rightText}</span>
      </div>
    </div>
  )
}
