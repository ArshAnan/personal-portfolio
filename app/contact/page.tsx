import { Card, CardContent } from "@/components/ui/card"
import { Mail, Github, Linkedin, Twitter, MapPin } from "lucide-react"
import { Navigation, StatusBar } from "@/components/navigation"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-mono">
      <Navigation />

      {/* Main Content */}
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Contact</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">Let&apos;s connect and discuss opportunities</p>
          <div className="w-16 h-0.5 bg-black dark:bg-white mb-6"></div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Get in Touch Card */}
          <Card className="border-2 border-black dark:border-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">arshanand2524@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <MapPin className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">New York, NY</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Social Links Card */}
          <Card className="border-2 border-black dark:border-white">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 dark:border-gray-600 pb-2">Social Links</h2>
              <div className="space-y-3">
                <a
                  href="https://github.com/ArshAnan"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 -m-2 transition-colors"
                >
                  <Github className="w-5 h-5" />
                  <div>
                    <p className="font-medium">GitHub</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">@ArshAnan</p>
                  </div>
                </a>

                <a
                  href="https://linkedin.com/in/arshanand568"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 -m-2 transition-colors"
                >
                  <Linkedin className="w-5 h-5" />
                  <div>
                    <p className="font-medium">LinkedIn</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Arsh Anand</p>
                  </div>
                </a>

                <a
                  href="https://twitter.com/arshinvests"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 hover:bg-gray-100 dark:hover:bg-gray-800 p-2 -m-2 transition-colors"
                >
                  <Twitter className="w-5 h-5" />
                  <div>
                    <p className="font-medium">Twitter</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">@arshinvests</p>
                  </div>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <StatusBar leftText="Ready" rightText="Contact form loaded" />
    </div>
  )
}