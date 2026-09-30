import Link from "next/link"
import { Navigation, StatusBar } from "@/components/navigation"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-mono">
      <Navigation />

      <div className="p-8 max-w-2xl mx-auto pb-24">
        <h1 className="text-4xl font-bold mb-2">404</h1>
        <div className="w-16 h-0.5 bg-black dark:bg-white mb-6" />

        <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
          The object at this coordinate has either moved or never existed.
        </p>

        <div className="flex flex-wrap gap-4 text-sm">
          <Link href="/" className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-white">
            ← File
          </Link>
          <Link href="/blog" className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-white">
            Blog
          </Link>
          <Link href="/lab" className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-white">
            Lab
          </Link>
          <Link href="/contact" className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-white">
            Contact
          </Link>
        </div>
      </div>

      <StatusBar leftText="Error" rightText="404 · not found" />
    </div>
  )
}
