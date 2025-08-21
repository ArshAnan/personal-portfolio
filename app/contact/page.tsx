import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Mail, Github, Linkedin, Twitter, MapPin, Phone } from "lucide-react"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Menu Bar */}
      <div className="border-b border-gray-300 bg-gray-100 px-2 py-1">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold">Contact - Notepad</span>
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
            <Link href="/contact" className="hover:bg-gray-200 px-2 py-1 bg-gray-200">
              Contact
            </Link>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Contact</h1>
          <p className="text-lg text-gray-600 mb-4">Let's connect and discuss opportunities</p>
          <div className="w-16 h-0.5 bg-black mb-6"></div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Contact Form */}
          <Card className="border-2 border-black">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Send Message</h2>
              <form className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    className="mt-1 border-2 border-black focus:border-black"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    className="mt-1 border-2 border-black focus:border-black"
                    placeholder="your.email@example.com"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </Label>
                  <Input
                    id="subject"
                    type="text"
                    className="mt-1 border-2 border-black focus:border-black"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium">
                    Message
                  </Label>
                  <Textarea
                    id="message"
                    rows={6}
                    className="mt-1 border-2 border-black focus:border-black resize-none"
                    placeholder="Tell me about your project or opportunity..."
                  />
                </div>

                <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800 border-2 border-black">
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <div className="space-y-6">
            <Card className="border-2 border-black">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Get in Touch</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Email</p>
                      <p className="text-sm text-gray-600">john.doe@example.com</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Phone className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Phone</p>
                      <p className="text-sm text-gray-600">+1 (555) 123-4567</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <MapPin className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Location</p>
                      <p className="text-sm text-gray-600">San Francisco, CA</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Social Links</h2>
                <div className="space-y-3">
                  <a
                    href="https://github.com/johndoe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:bg-gray-100 p-2 -m-2 transition-colors"
                  >
                    <Github className="w-5 h-5" />
                    <div>
                      <p className="font-medium">GitHub</p>
                      <p className="text-sm text-gray-600">@johndoe</p>
                    </div>
                  </a>

                  <a
                    href="https://linkedin.com/in/johndoe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:bg-gray-100 p-2 -m-2 transition-colors"
                  >
                    <Linkedin className="w-5 h-5" />
                    <div>
                      <p className="font-medium">LinkedIn</p>
                      <p className="text-sm text-gray-600">John Doe</p>
                    </div>
                  </a>

                  <a
                    href="https://twitter.com/johndoe"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 hover:bg-gray-100 p-2 -m-2 transition-colors"
                  >
                    <Twitter className="w-5 h-5" />
                    <div>
                      <p className="font-medium">Twitter</p>
                      <p className="text-sm text-gray-600">@johndoe</p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-black">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Availability</h2>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="bg-black text-white px-2 py-1">Available</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Response Time:</span>
                    <span>Within 24 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Preferred Contact:</span>
                    <span>Email</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Time Zone:</span>
                    <span>PST (UTC-8)</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Let's Work Together</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border-l-4 border-black pl-4">
              <h3 className="font-bold text-lg mb-2">Freelance Projects</h3>
              <p className="text-sm text-gray-600">
                Available for web development projects, mobile apps, and consulting work. Let's discuss your
                requirements and timeline.
              </p>
            </div>

            <div className="border-l-4 border-black pl-4">
              <h3 className="font-bold text-lg mb-2">Full-time Opportunities</h3>
              <p className="text-sm text-gray-600">
                Open to full-time software engineering positions with innovative companies. Interested in both remote
                and on-site opportunities.
              </p>
            </div>

            <div className="border-l-4 border-black pl-4">
              <h3 className="font-bold text-lg mb-2">Collaboration</h3>
              <p className="text-sm text-gray-600">
                Always interested in collaborating on open source projects, hackathons, and technical writing
                opportunities.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 px-4 py-1 text-xs">
        <div className="flex justify-between">
          <span>Ready</span>
          <span>Contact form loaded</span>
        </div>
      </div>
    </div>
  )
}
