import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Github } from "lucide-react"
import { Navigation, StatusBar } from "@/components/navigation"

export default function ProjectsPage() {
  const projects = [
    {
      title: "Cates",
      description:
        "AI-powered catering solution that helps restaurants maximize profits through intelligent menu optimization and demand forecasting. Uses machine learning to analyze customer preferences and optimize pricing strategies.",
      technologies: ["Python", "TensorFlow", "React", "Node.js", "PostgreSQL", "AWS"],
      github: "https://github.com/arsh/cates",
      demo: "https://cates-demo.com",
      status: "Completed",
    },
    {
      title: "Vert",
      description:
        "TikTok-like mobile app focused on delivering the most accurate news efficiently through AI-powered content curation. Combines social media engagement with reliable journalism.",
      technologies: ["React Native", "Node.js", "MongoDB", "AI/ML", "Real-time APIs"],
      github: "https://github.com/arsh/vert",
      demo: "https://vert-app.com",
      status: "In Progress",
    },
    {
      title: "Petra",
      description:
        "Revolutionary AI dog poop analysis app that provides health insights to dog owners through computer vision and machine learning. Helps pet owners monitor their dog's health proactively.",
      technologies: ["Computer Vision", "Python", "React Native", "AWS", "OpenCV", "TensorFlow"],
      github: "https://github.com/arsh/petra",
      demo: "https://petra-app.com",
      status: "Completed",
    },
    {
      title: "Ignition Labs",
      description:
        "Comprehensive end-to-end platform for startup founders where they can validate ideas, connect with real potential users, employees, and investors all within a single application.",
      technologies: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "WebRTC", "Matching AI"],
      github: "https://github.com/arsh/ignition-labs",
      demo: "https://ignition-labs.com",
      status: "In Progress",
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-mono">
      <Navigation />

      {/* Main Content */}
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Projects</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">A collection of my software engineering work</p>
          <div className="w-16 h-0.5 bg-black dark:bg-white mb-6"></div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <Card key={index} className="border-2 border-black dark:border-white">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-bold">{project.title}</h3>
                  <span
                    className={`text-xs px-2 py-1 ${
                      project.status === "Completed" 
                        ? "bg-black dark:bg-white text-white dark:text-black" 
                        : "bg-gray-200 dark:bg-gray-700 text-black dark:text-white"
                    }`}
                  >
                    {project.status}
                  </span>
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">{project.description}</p>

                <div className="flex flex-wrap gap-2 mb-4">
                  {project.technologies.map((tech, techIndex) => (
                    <span key={techIndex} className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-2 py-1 text-xs border dark:border-gray-600">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
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
                      className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
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
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Want to see more of my work? Check out my GitHub profile for additional projects and contributions.
          </p>
          <Button
            variant="outline"
            className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
            asChild
          >
            <a href="https://github.com/ArshAnan" target="_blank" rel="noopener noreferrer">
              <Github className="w-4 h-4 mr-2" />
              View GitHub Profile
            </a>
          </Button>
        </div>
      </div>

      <StatusBar leftText="Ready" rightText={`${projects.length} projects loaded`} />
    </div>
  )
}