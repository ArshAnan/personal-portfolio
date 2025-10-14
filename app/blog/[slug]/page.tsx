import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export async function generateStaticParams() {
  // Return an empty array since we don't have any blog posts yet
  // In a real application, you would fetch all blog post slugs here
  return []
}

export default function BlogPostPage({}: BlogPostPageProps) {
  // In a real application, you would fetch the blog post data based on the slug
  // For this demo, we'll use static content
  const blogPost = {
    title: "Understanding React Server Components",
    date: "2024-01-15",
    readTime: "8 min read",
    tags: ["React", "Next.js", "Web Development"],
    content: `
React Server Components represent a paradigm shift in how we think about React applications. They allow us to render components on the server, reducing the amount of JavaScript sent to the client and improving performance.

## What are React Server Components?

React Server Components are a new type of component that runs exclusively on the server. Unlike traditional React components that run in the browser, Server Components execute during the build process or on each request, depending on your setup.

### Key Benefits

1. **Reduced Bundle Size**: Server Components don't add to your client-side JavaScript bundle
2. **Direct Database Access**: You can fetch data directly from databases without creating API endpoints
3. **Improved Performance**: Less JavaScript means faster page loads
4. **Better SEO**: Content is rendered on the server, making it immediately available to search engines

## How They Work

Server Components work by rendering on the server and sending the resulting HTML to the client. The client then hydrates only the interactive parts of your application.

\`\`\`jsx
// This is a Server Component
async function BlogPost({ id }) {
  // This runs on the server
  const post = await db.posts.findById(id)
  
  return (
    <article>
      <h1>{post.title}</h1>
      <p>{post.content}</p>
    </article>
  )
}
\`\`\`

## Client vs Server Components

It's important to understand when to use each type:

- **Server Components**: Use for static content, data fetching, and non-interactive elements
- **Client Components**: Use for interactive elements, event handlers, and browser APIs

## Implementation in Next.js

Next.js 13+ has built-in support for Server Components with the App Router:

\`\`\`jsx
// app/page.js - This is a Server Component by default
export default async function HomePage() {
  const posts = await fetchPosts()
  
  return (
    <div>
      {posts.map(post => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  )
}
\`\`\`

## Best Practices

1. **Keep Server Components Simple**: Avoid complex logic that might be better suited for the client
2. **Use Client Components for Interactivity**: Any component that needs event handlers should be a Client Component
3. **Optimize Data Fetching**: Take advantage of the ability to fetch data directly in Server Components
4. **Consider the Boundary**: Be mindful of where you place the boundary between server and client components

## Conclusion

React Server Components are a powerful addition to the React ecosystem. They offer significant performance benefits and open up new possibilities for how we structure our applications. While there's a learning curve, the benefits make them worth exploring for your next React project.

The future of React development is looking more server-centric, and Server Components are leading the way. As the ecosystem continues to evolve, we can expect to see more tools and frameworks embracing this pattern.
    `,
  }

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Menu Bar */}
      <div className="border-b border-gray-300 bg-gray-100 px-2 py-1">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold">Blog Post - Notepad</span>
          <nav className="flex gap-4 ml-8">
            <Link href="/" className="hover:bg-gray-200 px-2 py-1">
              File
            </Link>
            <Link href="/projects" className="hover:bg-gray-200 px-2 py-1">
              Projects
            </Link>
            <Link href="/skills" className="hover:bg-gray-200 px-2 py-1">
              Skills
            </Link>
            <Link href="/blog" className="hover:bg-gray-200 px-2 py-1">
              Blog
            </Link>
            <Link href="/contact" className="hover:bg-gray-200 px-2 py-1">
              Contact
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link href="/blog">
            <Button
              variant="outline"
              size="sm"
              className="border-2 border-black hover:bg-black hover:text-white mb-6 bg-transparent"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Blog
            </Button>
          </Link>

          <h1 className="text-4xl font-bold mb-4">{blogPost.title}</h1>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-4">
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
              <span key={index} className="bg-black text-white px-2 py-1 text-xs">
                {tag}
              </span>
            ))}
          </div>

          <div className="w-16 h-0.5 bg-black mb-8"></div>
        </div>

        <article className="prose prose-lg max-w-none">
          <div className="text-sm leading-relaxed space-y-6">
            {blogPost.content.split("\n\n").map((paragraph, index) => {
              if (paragraph.startsWith("## ")) {
                return (
                  <h2 key={index} className="text-2xl font-bold mt-8 mb-4 border-b border-gray-300 pb-2">
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
                  <pre key={index} className="bg-gray-100 p-4 border-2 border-black overflow-x-auto text-xs">
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
                  <p key={index} className="leading-relaxed">
                    {paragraph}
                  </p>
                )
              }
              return null
            })}
          </div>
        </article>

        <div className="mt-12 pt-8 border-t border-gray-300">
          <div className="flex justify-between items-center">
            <Link href="/blog">
              <Button
                variant="outline"
                className="border-2 border-black hover:bg-black hover:text-white bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Blog
              </Button>
            </Link>

            <div className="flex gap-4">
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-black hover:bg-black hover:text-white bg-transparent"
              >
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-2 border-black hover:bg-black hover:text-white bg-transparent"
              >
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 px-4 py-1 text-xs">
        <div className="flex justify-between">
          <span>Ready</span>
          <span>Article loaded</span>
        </div>
      </div>
    </div>
  )
}
