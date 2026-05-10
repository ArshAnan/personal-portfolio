"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"

type BlogShareButtonProps = {
  title: string
}

export function BlogShareButton({ title }: BlogShareButtonProps) {
  const [label, setLabel] = useState("Share")

  async function handleShare() {
    const url = window.location.href

    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return
        }
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setLabel("Copied!")
      window.setTimeout(() => setLabel("Share"), 2000)
    } catch {
      setLabel("Failed")
      window.setTimeout(() => setLabel("Share"), 2000)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
      onClick={() => void handleShare()}
    >
      {label}
    </Button>
  )
}
