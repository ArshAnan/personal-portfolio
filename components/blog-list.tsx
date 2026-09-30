"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { BlogTag, PostSummary } from "@/lib/blog-posts"

type BlogListProps = {
  summaries: PostSummary[]
  allTags: BlogTag[]
}

export function BlogList({ summaries, allTags }: BlogListProps) {
  const [active, setActive] = React.useState<BlogTag | null>(null)
  const filtered = active === null ? summaries : summaries.filter((p) => p.tags.includes(active))

  return (
    <div>
      {/* With one topic in use there's nothing to filter — the row appears
          on its own the moment a second one shows up. */}
      {allTags.length > 1 ? (
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActive(null)}
            className={cn(
              "px-2 py-1 text-xs border-2 border-black dark:border-white transition-colors",
              active === null ? "bg-black dark:bg-white text-white dark:text-black" : "hover:bg-gray-100 dark:hover:bg-gray-800",
            )}
          >
            all
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setActive(tag)}
              className={cn(
                "px-2 py-1 text-xs border-2 border-black dark:border-white transition-colors",
                active === tag ? "bg-black dark:bg-white text-white dark:text-black" : "hover:bg-gray-100 dark:hover:bg-gray-800",
              )}
            >
              {tag.toLowerCase()}
            </button>
          ))}
        </div>
      ) : null}

      <div className="space-y-6">
        {filtered.length === 0 ? (
          <Card className="border-2 border-black dark:border-white">
            <CardContent className="p-10 text-center text-sm text-gray-600 dark:text-gray-400">
              No posts tagged {active}.
            </CardContent>
          </Card>
        ) : (
          filtered.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <Card className="border-2 border-black dark:border-white transition-colors group-hover:bg-gray-50 dark:group-hover:bg-gray-800/50">
                <CardContent className="p-8 md:p-10">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mb-3">
                    <time dateTime={post.date}>
                      {new Date(post.date).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </time>
                    <span aria-hidden>•</span>
                    <span>{post.readTime}</span>
                  </div>
                  <h2 className="text-2xl font-bold mb-4 group-hover:underline underline-offset-4 decoration-2">{post.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="bg-black dark:bg-white text-white dark:text-black px-2 py-1 text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  )
}
