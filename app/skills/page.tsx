import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ExternalLink, Github } from "lucide-react"
import { Navigation, StatusBar } from "@/components/navigation"

export default function SkillsPage() {
  const expertiseAreas = [
    {
      title: "AI-Powered Solutions",
      description: "Building intelligent applications that leverage artificial intelligence to solve real-world problems and create value for businesses and users.",
      skills: ["Machine Learning", "Computer Vision", "Natural Language Processing", "Python", "TensorFlow", "OpenAI API"],
      projects: [
        {
          name: "Cates",
          description: "AI-powered catering solution that helps restaurants maximize profits through intelligent menu optimization and demand forecasting",
          tech: ["Python", "TensorFlow", "React", "Node.js", "PostgreSQL"]
        },
        {
          name: "Petra",
          description: "AI dog poop analysis app that provides health insights to dog owners through computer vision and machine learning",
          tech: ["Computer Vision", "Python", "React Native", "AWS", "OpenCV"]
        }
      ]
    },
    {
      title: "Social & Media Platforms",
      description: "Creating engaging social platforms and media applications that prioritize user experience and efficient information delivery.",
      skills: ["React Native", "Real-time Systems", "Video Processing", "Social Features", "Content Moderation"],
      projects: [
        {
          name: "Vert",
          description: "TikTok-like app focused on delivering the most accurate news efficiently through AI-powered content curation",
          tech: ["React Native", "Node.js", "MongoDB", "AI/ML", "Real-time APIs"]
        }
      ]
    },
    {
      title: "End-to-End Startup Platforms",
      description: "Building comprehensive platforms that support entrepreneurs throughout their entire journey from idea validation to scaling.",
      skills: ["Full-Stack Development", "User Management", "Payment Processing", "Matching Algorithms", "Scalable Architecture"],
      projects: [
        {
          name: "Ignition Labs",
          description: "Complete platform for startup founders to validate ideas, connect with users, employees, and investors all in one app",
          tech: ["Next.js", "Node.js", "PostgreSQL", "Stripe", "WebRTC", "Matching AI"]
        }
      ]
    },
    {
      title: "Mobile & Cross-Platform Development",
      description: "Creating seamless mobile experiences that work flawlessly across iOS and Android while maintaining native performance.",
      skills: ["React Native", "Flutter", "iOS", "Android", "Cross-Platform", "Performance Optimization"],
      projects: [
        {
          name: "Petra Mobile App",
          description: "Cross-platform mobile app for dog health monitoring with camera integration and AI analysis",
          tech: ["React Native", "Camera API", "AI Integration", "Cloud Storage"]
        },
        {
          name: "Vert Mobile Platform",
          description: "High-performance mobile app for news consumption with video streaming and social features",
          tech: ["React Native", "Video Streaming", "Real-time Updates", "Push Notifications"]
        }
      ]
    },
    {
      title: "Backend & Infrastructure",
      description: "Designing and implementing robust backend systems that can handle complex business logic and scale with growing user bases.",
      skills: ["Node.js", "Python", "PostgreSQL", "MongoDB", "AWS", "Docker", "Microservices"],
      projects: [
        {
          name: "Cates Backend System",
          description: "Scalable backend handling AI model inference, restaurant data processing, and real-time analytics",
          tech: ["Python", "FastAPI", "PostgreSQL", "Redis", "AWS Lambda"]
        },
        {
          name: "Ignition Labs API",
          description: "Comprehensive API supporting user matching, payment processing, and real-time communication features",
          tech: ["Node.js", "Express", "PostgreSQL", "WebSocket", "Stripe API"]
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white font-mono">
      <Navigation />

      {/* Main Content */}
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">What I&apos;m Great At</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">My core areas of expertise demonstrated through real projects</p>
          <div className="w-16 h-0.5 bg-black dark:bg-white mb-6"></div>
        </div>

        <div className="space-y-12">
          {expertiseAreas.map((area, index) => (
            <div key={index} className="border-2 border-black dark:border-white p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold mb-3">{area.title}</h2>
                <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{area.description}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 dark:border-gray-600 pb-1">Key Technologies</h3>
                <div className="flex flex-wrap gap-2">
                  {area.skills.map((skill, skillIndex) => (
                    <span key={skillIndex} className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white px-3 py-1 text-sm border dark:border-gray-600 font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-3 border-b border-gray-300 dark:border-gray-600 pb-1">Featured Projects</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {area.projects.map((project, projectIndex) => (
                    <Card key={projectIndex} className="border border-gray-300 dark:border-gray-600">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-lg mb-2">{project.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{project.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {project.tech.map((tech, techIndex) => (
                            <span key={techIndex} className="bg-black dark:bg-white text-white dark:text-black px-2 py-1 text-xs">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="border-2 border-black dark:border-white p-8 bg-gray-50 dark:bg-gray-800">
            <h2 className="text-2xl font-bold mb-4">Ready to Build Something Amazing?</h2>
            <p className="text-gray-700 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
              I combine technical expertise with creative problem-solving to deliver solutions that make a real impact. 
              Whether it&apos;s a web application, mobile app, or complex backend system, I bring passion and precision to every project.
            </p>
            <div className="flex gap-4 justify-center">
              <Button
                variant="outline"
                className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
                asChild
              >
                <a href="https://github.com/ArshAnan" target="_blank" rel="noopener noreferrer">
                  <Github className="w-4 h-4 mr-2" />
                  View GitHub
                </a>
              </Button>
              <Button
                variant="outline"
                className="border-2 border-black dark:border-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black bg-transparent"
                asChild
              >
                <Link href="/contact">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  Get In Touch
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <StatusBar 
        leftText="Ready" 
        rightText={`${expertiseAreas.length} expertise areas • ${expertiseAreas.reduce((total, area) => total + area.projects.length, 0)} featured projects`} 
      />
    </div>
  )
}