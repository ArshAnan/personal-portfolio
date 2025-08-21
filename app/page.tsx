import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Menu Bar */}
      <div className="border-b border-gray-300 bg-gray-100 px-2 py-1">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold">Arsh's Internet Corner</span>
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
          <h1 className="text-4xl font-bold mb-2">Arsh Anand</h1>
          <p className="text-xl text-gray-600 mb-4">Computer Science @ CCNY | has too many (cool) unfinished projects</p>
          <div className="w-16 h-0.5 bg-black mb-6"></div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">About Me</h2>
            <div className="space-y-4 text-sm leading-relaxed">
              <p>
                Hello! I'm a Arsh and I am a passionate builder of software that actually helps the people around me. It may seem altruistic, but I think that is just human.
                I believe in the power of simplicity and functionality over complexity.
              </p>
              <p>
                Currently pursuing my degree while working on various projects that span AI, mobile
                applications, and a lot more. Some of my recent projects includes an AI-powered catering agent that reduces time to order food for large events from hours to 2.5 minutes.
              </p>
              <p>
                When I'm not coding, you can find me touching grass, creating videos for social media, or nerding about something in business/finance/investing.
              </p>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4 border-b border-gray-300 pb-2">Quick Stats</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span>"Experience:"</span>
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

            <div className="mt-8">
              <h3 className="text-lg font-bold mb-3">Recent Activity</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>• Updated portfolio website</span>
                  <span>2 days ago</span>
                </div>
                <div className="flex justify-between">
                  <span>• Published new blog post</span>
                  <span>1 week ago</span>
                </div>
                <div className="flex justify-between">
                  <span>• Completed React project</span>
                  <span>2 weeks ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Featured Projects</h2>
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="border-2 border-black">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">E-Commerce Platform</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Full-stack web application built with React, Node.js, and PostgreSQL. Features user authentication,
                  payment processing, and admin dashboard.
                </p>
                <div className="flex gap-2 text-xs">
                  <span className="bg-black text-white px-2 py-1">React</span>
                  <span className="bg-black text-white px-2 py-1">Node.js</span>
                  <span className="bg-black text-white px-2 py-1">PostgreSQL</span>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold mb-2">Task Management App</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Mobile application for iOS and Android using React Native. Includes offline sync, push notifications,
                  and team collaboration features.
                </p>
                <div className="flex gap-2 text-xs">
                  <span className="bg-black text-white px-2 py-1">React Native</span>
                  <span className="bg-black text-white px-2 py-1">Firebase</span>
                  <span className="bg-black text-white px-2 py-1">TypeScript</span>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 text-center">
            <Link href="/projects">
              <Button
                variant="outline"
                className="border-2 border-black hover:bg-black hover:text-white bg-transparent"
              >
                View All Projects →
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Latest Blog Posts</h2>
          <div className="space-y-4">
            <div className="border-l-4 border-black pl-4">
              <h3 className="font-bold text-lg">Understanding React Server Components</h3>
              <p className="text-sm text-gray-600 mb-2">
                A deep dive into the new React Server Components and how they're changing the way we build React
                applications...
              </p>
              <span className="text-xs text-gray-500">Published 1 week ago</span>
            </div>

            <div className="border-l-4 border-black pl-4">
              <h3 className="font-bold text-lg">My Journey Learning TypeScript</h3>
              <p className="text-sm text-gray-600 mb-2">
                Sharing my experience transitioning from JavaScript to TypeScript and the benefits I've discovered along
                the way...
              </p>
              <span className="text-xs text-gray-500">Published 2 weeks ago</span>
            </div>
          </div>

          <div className="mt-6 text-center">
            <Link href="/blog">
              <Button
                variant="outline"
                className="border-2 border-black hover:bg-black hover:text-white bg-transparent"
              >
                Read All Posts →
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 px-4 py-1 text-xs">
        <div className="flex justify-between">
          <span>Ready</span>
          <span>Last updated: {new Date().toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}
