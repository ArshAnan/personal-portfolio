import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, BookMarked } from "lucide-react"
import { Navigation, StatusBar } from "@/components/navigation"

export default function BooksPage() {
  const currentlyReading = [
    { title: "System Design Interview", author: "Alex Xu" },
    { title: "C++ Primer", author: "Stanley B. Lippman, Josee Lajoie, Barbara E. Moo" },
  ]

  const read = [
    { title: "Python Crash Course", author: "Eric Matthes" },
  ]

  const totalBooks = currentlyReading.length + read.length

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-mono">
      <Navigation />

      {/* Main Content */}
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Books</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">What I&apos;m reading and what I&apos;ve read</p>
          <div className="w-16 h-0.5 bg-black dark:bg-white mb-6"></div>
        </div>

        {/* Currently Reading */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 dark:border-gray-600 pb-2 flex items-center gap-2">
            <BookOpen className="w-6 h-6" />
            Currently Reading
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {currentlyReading.map((book, index) => (
              <Card key={index} className="border-2 border-black dark:border-white">
                <CardContent className="p-6">
                  <span className="text-xs px-2 py-1 bg-black dark:bg-white text-white dark:text-black mb-3 inline-block">
                    In Progress
                  </span>
                  <h3 className="text-xl font-bold mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Read */}
        <div>
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 dark:border-gray-600 pb-2 flex items-center gap-2">
            <BookMarked className="w-6 h-6" />
            Read
          </h2>
          <div className="grid gap-6 md:grid-cols-2">
            {read.map((book, index) => (
              <Card key={index} className="border-2 border-black dark:border-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{book.author}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <StatusBar leftText="Ready" rightText={`${totalBooks} books in library`} />
    </div>
  )
}
