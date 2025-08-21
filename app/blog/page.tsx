import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function BlogPage() {
  const blogPosts = [
    {
      id: "react-server-components",
      title: "Understanding React Server Components",
      excerpt:
        "A deep dive into the new React Server Components and how they're changing the way we build React applications. Learn about the benefits, use cases, and implementation details.",
      date: "2024-01-15",
      readTime: "8 min read",
      tags: ["React", "Next.js", "Web Development"],
    },
    {
      id: "typescript-journey",
      title: "My Journey Learning TypeScript",
      excerpt:
        "Sharing my experience transitioning from JavaScript to TypeScript and the benefits I've discovered along the way. Tips for beginners and common pitfalls to avoid.",
      date: "2024-01-08",
      readTime: "6 min read",
      tags: ["TypeScript", "JavaScript", "Programming"],
    },
    {
      id: "database-optimization",
      title: "Database Optimization Techniques",
      excerpt:
        "Essential strategies for optimizing database performance in web applications. Covering indexing, query optimization, and caching strategies with practical examples.",
      date: "2024-01-01",
      readTime: "10 min read",
      tags: ["Database", "PostgreSQL", "Performance"],
    },
    {
      id: "clean-code-principles",
      title: "Clean Code Principles Every Developer Should Know",
      excerpt:
        "Exploring the fundamental principles of writing clean, maintainable code. From naming conventions to function design, learn how to write code that others can easily understand.",
      date: "2023-12-25",
      readTime: "7 min read",
      tags: ["Clean Code", "Best Practices", "Software Engineering"],
    },
    {
      id: "api-design-best-practices",
      title: "RESTful API Design Best Practices",
      excerpt:
        "A comprehensive guide to designing robust and scalable RESTful APIs. Covering HTTP methods, status codes, authentication, and documentation strategies.",
      date: "2023-12-18",
      readTime: "12 min read",
      tags: ["API", "REST", "Backend Development"],
    },
    {
      id: "frontend-testing-strategies",
      title: "Frontend Testing Strategies with Jest and React Testing Library",
      excerpt:
        "Learn effective testing strategies for React applications. From unit tests to integration tests, discover how to build confidence in your frontend code.",
      date: "2023-12-11",
      readTime: "9 min read",
      tags: ["Testing", "React", "Jest"],
    },
  ]

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Menu Bar */}
      <div className="border-b border-gray-300 bg-gray-100 px-2 py-1">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold">Blog - Notepad</span>
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
            <Link href="/blog" className="hover:bg-gray-200 px-2 py-1 bg-gray-200">
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
          <h1 className="text-4xl font-bold mb-2">Blog</h1>
          <p className="text-lg text-gray-600 mb-4">Thoughts on software engineering, technology, and learning</p>
          <div className="w-16 h-0.5 bg-black mb-6"></div>
        </div>

        <div className="space-y-6">
          {blogPosts.map((post, index) => (
            <Card key={index} className="border-2 border-black">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <Link href={`/blog/${post.id}`} className="hover:underline">
                      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                    </Link>
                    <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                      <span>
                        {new Date(post.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                </div>

                <p className="text-sm text-gray-700 mb-4 leading-relaxed">{post.excerpt}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="bg-gray-100 text-black px-2 py-1 text-xs border">
                      {tag}
                    </span>
                  ))}
                </div>

                <Link href={`/blog/${post.id}`}>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-black hover:bg-black hover:text-white bg-transparent"
                  >
                    Read More →
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Want to stay updated with my latest posts? Follow me on social media or subscribe to my newsletter.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" className="border-2 border-black hover:bg-black hover:text-white bg-transparent">
              Subscribe to Newsletter
            </Button>
            <Button variant="outline" className="border-2 border-black hover:bg-black hover:text-white bg-transparent">
              RSS Feed
            </Button>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 px-4 py-1 text-xs">
        <div className="flex justify-between">
          <span>Ready</span>
          <span>{blogPosts.length} posts published</span>
        </div>
      </div>
    </div>
  )
}
