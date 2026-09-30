"use client"

import { TriangleAlert } from "lucide-react"
import { Navigation, StatusBar } from "@/components/navigation"
import { Button } from "@/components/ui/button"

export default function LabError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-mono">
      <Navigation />
      <div className="p-8 max-w-2xl mx-auto pb-24">
        <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
          <TriangleAlert className="size-8" /> Lab
        </h1>
        <div className="w-16 h-0.5 bg-black dark:bg-white mb-6" />
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">Something in the lab crashed.</p>
        <pre className="text-xs bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-700 p-3 overflow-x-auto mb-6">
          {error.message}
        </pre>
        <Button
          variant="outline"
          className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
          onClick={reset}
        >
          Try again
        </Button>
      </div>
      <StatusBar leftText="Error" rightText="lab crashed" />
    </div>
  )
}
