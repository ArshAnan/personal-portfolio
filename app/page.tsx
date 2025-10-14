import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Navigation, StatusBar } from "@/components/navigation"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-mono">
      <Navigation />

      {/* Main Content */}
      <div className="p-8 max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Arsh Anand</h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-4">Computer Science @ CCNY | has too many (cool) unfinished projects</p>
          <div className="w-16 h-0.5 bg-black dark:bg-white mb-6"></div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">About Me</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                Hello! I&apos;m a Arsh and I am a passionate builder of software that actually helps the people around me. It may seem altruistic, but I think that is just human.
                I believe in the power of simplicity and functionality over complexity.
              </p>
              <p>
                Currently pursuing my degree while working on various projects that span AI, mobile
                applications, and a lot more. Some of my recent projects includes an AI-powered catering agent that reduces time to order food for large events from hours to 2.5 minutes.
              </p>
              <p>
                When I&apos;m not coding, you can find me touching grass, creating videos for social media, or nerding about something in business/finance/investing.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 dark:border-gray-600 pb-2">Quick Stats</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>&quot;Experience:&quot;</span>
                <span>3+ years</span>
              </div>
              <div className="flex justify-between">
                <span>Real Experience Building Things:</span>
                <span>~2 years</span>
              </div>
              <div className="flex justify-between">
                <span>Projects Completed:</span>
                <span>8</span>
              </div>
              <div className="flex justify-between">
                <span>Incomplete (but equally cool) Projects:</span>
                <span>20+</span>
              </div>
              <div className="flex justify-between">
                <span>Friends:</span>
                <span>400+</span>
              </div>
              <div className="flex justify-between">
                <span>Real Friends:</span>
                <span>8</span>
              </div>
              <div className="flex justify-between">
                <span>Current Status:</span>
                <span>Excited About The Future!</span>
              </div>
            </div>

          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">Featured Projects</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2 border-black dark:border-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Cates</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  AI-powered catering solution that helps restaurants maximize profits through intelligent menu optimization and demand forecasting. Reduces time to order food for large events from hours to 2.5 minutes.
                </p>
                <div className="flex gap-2 text-xs">
                  <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-1">Python</span>
                  <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-1">TensorFlow</span>
                  <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-1">React</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black dark:border-white">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Petra</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                  Revolutionary AI dog poop analysis app that provides health insights to dog owners through computer vision and machine learning. Helps pet owners monitor their dog&apos;s health proactively.
                </p>
                <div className="flex gap-2 text-xs">
                  <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-1">Computer Vision</span>
                  <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-1">Python</span>
                  <span className="bg-black dark:bg-white text-white dark:text-black px-2 py-1">React Native</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 text-center">
            <Link href="/projects">
              <Button
                variant="outline"
                className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
              >
                View All Projects →
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">Latest Blog Posts</h2>
          <div className="border-2 border-black dark:border-white p-8 text-center">
            <h3 className="text-xl font-bold mb-4">🚧 Blog Under Construction 🚧</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Arsh is probably hunched over his keyboard right now, frantically typing away at what promises to be 
              the most epic blog post ever written. Or maybe he&apos;s just staring at a blinking cursor wondering 
              why writing is so much harder than coding.
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Either way, you can expect some brilliant insights about software engineering, 
              technology, finance, and the occasional existential crisis of a developer very soon!
            </p>
          </div>

          <div className="mt-6 text-center">
            <Link href="/blog">
              <Button
                variant="outline"
                className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
              >
                Visit Blog →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <StatusBar leftText="Ready" rightText={`Last updated: ${new Date().toLocaleDateString()}`} />
    </div>
  )
}