import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { BlogShareButton } from "@/components/blog-share-button"
import { Navigation, StatusBar } from "@/components/navigation"
import { getAllPostsSorted, getPostBySlug } from "@/lib/blog-posts"

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  return getAllPostsSorted().map((p) => ({ slug: p.slug }))
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const blogPost = getPostBySlug(slug)

  if (!blogPost) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-mono pb-24">
      <Navigation />

      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/blog">
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black mb-6 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
            <span>
              {new Date(blogPost.date).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </span>
            <span>•</span>
            <span>{blogPost.readTime}</span>
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {blogPost.tags.map((tag, index) => (
              <span key={index} className="bg-black dark:bg-white text-white dark:text-black px-2 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>

          <div className="w-16 h-0.5 bg-black dark:bg-white mb-8" />
        </div>

        <article className="prose prose-lg max-w-none dark:prose-invert">
          <div className="text-sm leading-relaxed space-y-6">
            {blogPost.content.split("\n\n").map((paragraph, index) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-2xl font-bold mt-8 mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">
                    {paragraph.replace("## ", "")}
                  </h2>
                )
              } else if (paragraph.startsWith("### ")) {
                return (
                  <h3 key={index} className="text-xl font-bold mt-6 mb-3">
                    {paragraph.replace("### ", "")}
                  </h3>
                )
              } else if (paragraph.startsWith("```")) {
                return (
                  <pre key={index} className="bg-gray-100 dark:bg-gray-800 p-4 border-2 border-black dark:border-white overflow-x-auto text-xs">
                    <code>{paragraph.replace(/```\w*\n?/, "").replace(/```$/, "")}</code>
                  </pre>
                )
              } else if (paragraph.match(/^\d+\./)) {
                const items = paragraph.split("\n").filter((line) => line.match(/^\d+\./))
                return (
                  <ol key={index} className="list-decimal list-inside space-y-2 ml-4">
                    {items.map((item, itemIndex) => (
                      <li key={itemIndex}>{item.replace(/^\d+\.\s*/, "")}</li>
                    ))}
                  </ol>
                )
              } else if (paragraph.includes("- **")) {
                const items = paragraph.split("\n").filter((line) => line.includes("- **"))
                return (
                  <ul key={index} className="list-disc list-inside space-y-2 ml-4">
                    {items.map((item, itemIndex) => (
                      <li
                        key={itemIndex}
                        dangerouslySetInnerHTML={{
                          __html: item.replace("- **", "<strong>").replace("**:", ":</strong>"),
                        }}
                      />
                    ))}
                  </ul>
                )
              } else if (paragraph.trim()) {
                return (
                  <p key={index} className="leading-relaxed text-gray-800 dark:text-gray-200">
                    {paragraph}
                  </p>
                )
              }
              return null
            })}
          </div>
        </article>

        <div className="mt-12 pt-8 border-t border-gray-300 dark:border-gray-600">
          <div className="flex flex-wrap justify-between items-center gap-4">
            <Link href="/blog">
              <Button
                variant="outline"
                className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            <BlogShareButton title={blogPost.title} />
          </div>
        </div>
      </div>

      <StatusBar leftText="Ready" rightText="Article loaded" />
    </div>
  )
}
