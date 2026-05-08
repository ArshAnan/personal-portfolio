import Link from "next/link"
import { Navigation, StatusBar } from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-mono">
      <Navigation />

      <div className="p-8 max-w-2xl mx-auto pb-24">
        <header className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Arsh Anand</h1>
          <div className="w-16 h-0.5 bg-black dark:bg-white" />
        </header>

        <div className="space-y-4 text-sm leading-relaxed text-gray-700 dark:text-gray-300">
          <p>
            I&apos;m a student at CUNY - City College of New York, studying computer science. I work on research touching AI, AI agents, and
            optimizations, the same areas I like to read about and go deep on.
            
          </p>

          <p>
          Lately I&apos;m building things like a multi-threaded Redis system, adversarial AI stock traders, and similar projects.
          </p>
          <p className="text-gray-600 dark:text-gray-400">
            Longer notes and experiments live on the{" "}
            <Link href="/blog" className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-white">
              blog
            </Link>
            . To reach me, use{" "}
            <Link href="/contact" className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-white">
              contact
            </Link>
            .
          </p>
        </div>
      </div>

      <StatusBar leftText="Ready" rightText={`Last updated: ${new Date().toLocaleDateString()}`} />
    </div>
  )
}
