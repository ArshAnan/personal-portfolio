import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation, StatusBar } from "@/components/navigation"
import { getAllPostsSorted } from "@/lib/blog-posts"

export default function BlogPage() {
  const posts = getAllPostsSorted()
  const postCount = posts.length

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-mono">
      <Navigation />

      <div className="p-8 max-w-4xl mx-auto pb-24">
        <div className="mb-10">
          <h1 className="text-4xl font-bold mb-2">Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">
            i write sometimes :)
          </p>
          <div className="w-16 h-0.5 bg-black dark:bg-white mb-6" />
        </div>

        <div className="space-y-6">
          {posts.length === 0 ? (
            <Card className="border-2 border-black dark:border-white">
              <CardContent className="p-10 md:p-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Nothing published yet</h2>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed mb-6 max-w-lg mx-auto">
                  First posts are in the works. Check back soon, or say hi on{" "}
                  <Link href="/contact" className="underline underline-offset-2 hover:text-gray-900 dark:hover:text-white">
                    Contact
                  </Link>{" "}
                  if you want a heads-up when something goes live.
                </p>
                <div className="flex justify-center">
                  <div className="animate-pulse text-2xl" aria-hidden>
                    ✍️
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            posts.map((post) => (
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
                        <span
                          key={tag}
                          className="bg-black dark:bg-white text-white dark:text-black px-2 py-1 text-xs"
                        >
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

        <div className="mt-12 flex flex-wrap gap-4 justify-center">
          <Link href="/">
            <Button
              variant="outline"
              className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
            >
              ← File
            </Button>
          </Link>
          <Link href="/contact">
            <Button
              variant="outline"
              className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
            >
              Contact
            </Button>
          </Link>
        </div>
      </div>

      <StatusBar
        leftText="Blog"
        rightText={`${postCount} post${postCount === 1 ? "" : "s"} published`}
      />
    </div>
  )
}
