import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation, StatusBar } from "@/components/navigation"

export default function BlogPage() {

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-mono">
      <Navigation />

      {/* Main Content */}
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Blog</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Thoughts on software engineering, technology, finance, and learning</p>
          <div className="w-16 h-0.5 bg-black dark:bg-white mb-6"></div>
        </div>

        <div className="space-y-6">
          <Card className="border-2 border-black dark:border-white">
            <CardContent className="p-12 text-center">
              <div className="mb-6">
                <h2 className="text-3xl font-bold mb-4">🚧 Under Construction 🚧</h2>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
                  Arsh is probably hunched over his keyboard right now, frantically typing away at what promises to be 
                  the most epic blog post ever written. Or maybe he&apos;s just staring at a blinking cursor wondering 
                  why writing is so much harder than coding.
                </p>
                <p className="text-base text-gray-600 dark:text-gray-400 mb-8">
                  Either way, you can expect some brilliant insights about software engineering, 
                  technology, finance, and the occasional existential crisis of a developer very soon!
                </p>
              </div>
              
              <div className="flex justify-center">
                <div className="animate-pulse text-2xl">✍️</div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Want to stay updated with my latest posts? Follow me on social media or subscribe to my newsletter.
          </p>
          <div className="flex gap-4 justify-center">
            <Button variant="outline" className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent">
              Subscribe to Newsletter
            </Button>
            <Button variant="outline" className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent">
              RSS Feed
            </Button>
          </div>
        </div>
      </div>

      <StatusBar leftText="Writing in progress..." rightText="0 posts published (but working on it!)" />
    </div>
  )
}