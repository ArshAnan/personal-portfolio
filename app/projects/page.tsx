import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Github } from "lucide-react"

export default function ProjectsPage() {
  const projects = [
    {
      title: "E-Commerce Platform",
      description:
        "Full-stack web application with user authentication, payment processing, and admin dashboard. Built with modern technologies for scalability and performance.",
      technologies: ["React", "Node.js", "PostgreSQL", "Stripe", "AWS"],
      github: "https://github.com/johndoe/ecommerce-platform",
      demo: "https://ecommerce-demo.com",
      status: "Completed",
    },
    {
      title: "Task Management App",
      description:
        "Cross-platform mobile application for task management with offline sync, push notifications, and team collaboration features.",
      technologies: ["React Native", "Firebase", "TypeScript", "Redux"],
      github: "https://github.com/johndoe/task-manager",
      demo: "https://taskmanager-demo.com",
      status: "Completed",
    },
    {
      title: "Weather Dashboard",
      description:
        "Real-time weather dashboard with interactive maps, forecasts, and weather alerts. Features responsive design and data visualization.",
      technologies: ["Vue.js", "D3.js", "OpenWeather API", "Chart.js"],
      github: "https://github.com/johndoe/weather-dashboard",
      demo: "https://weather-demo.com",
      status: "Completed",
    },
    {
      title: "Code Editor Extension",
      description:
        "VS Code extension for enhanced productivity with custom snippets, themes, and debugging tools. Published on VS Code Marketplace.",
      technologies: ["TypeScript", "VS Code API", "Node.js"],
      github: "https://github.com/johndoe/vscode-extension",
      demo: "https://marketplace.visualstudio.com/items?itemName=johndoe.extension",
      status: "Completed",
    },
    {
      title: "Machine Learning Model",
      description:
        "Predictive model for stock price analysis using historical data and technical indicators. Includes web interface for visualization.",
      technologies: ["Python", "TensorFlow", "Flask", "Pandas", "Matplotlib"],
      github: "https://github.com/johndoe/ml-stock-predictor",
      demo: null,
      status: "In Progress",
    },
    {
      title: "Social Media Analytics",
      description:
        "Analytics platform for social media performance tracking with automated reporting and insights generation.",
      technologies: ["Next.js", "MongoDB", "Chart.js", "Social APIs"],
      github: "https://github.com/johndoe/social-analytics",
      demo: "https://social-analytics-demo.com",
      status: "In Progress",
    },
  ]

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Menu Bar */}
      <div className="border-b border-gray-300 bg-gray-100 px-2 py-1">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold">Projects - Notepad</span>
          <nav className="flex gap-4 ml-8">
            <Link href="/" className="hover:bg-gray-200 px-2 py-1">
              File
            </Link>
            <Link href="/projects" className="hover:bg-gray-200 px-2 py-1 bg-gray-200">
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
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Projects</h1>
          <p className="text-lg text-gray-600 mb-4">A collection of my software engineering work</p>
          <div className="w-16 h-0.5 bg-black mb-6"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <Card key={index} className="border-2 border-black">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 ${
                      project.status === "Completed" ? "bg-black text-white" : "bg-gray-200 text-black"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-gray-100 text-black px-2 py-1 text-xs border">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-black hover:bg-black hover:text-white bg-transparent"
                    asChild
                  >
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </a>
                  </Button>

                  {project.demo && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-2 border-black hover:bg-black hover:text-white bg-transparent"
                      asChild
                    >
                      <a href={project.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="w-4 h-4 mr-2" />
                        Demo
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 mb-4">
            Want to see more of my work? Check out my GitHub profile for additional projects and contributions.
          </p>
          <Button
            variant="outline"
            className="border-2 border-black hover:bg-black hover:text-white bg-transparent"
            asChild
          >
            <a href="https://github.com/johndoe" target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              View GitHub Profile
            </a>
          </Button>
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 px-4 py-1 text-xs">
        <div className="flex justify-between">
          <span>Ready</span>
          <span>{projects.length} projects loaded</span>
        </div>
      </div>
    </div>
  )
}
