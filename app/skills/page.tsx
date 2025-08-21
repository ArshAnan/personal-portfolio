import Link from "next/link"

export default function SkillsPage() {
  const skillCategories = [
    {
      category: "Programming Languages",
      skills: [
        { name: "JavaScript", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "Python", level: 80 },
        { name: "Java", level: 75 },
        { name: "C++", level: 70 },
        { name: "Go", level: 65 },
        { name: "Rust", level: 60 },
        { name: "SQL", level: 85 },
      ],
    },
    {
      category: "Frontend Development",
      skills: [
        { name: "React", level: 90 },
        { name: "Next.js", level: 85 },
        { name: "Vue.js", level: 80 },
        { name: "HTML/CSS", level: 95 },
        { name: "Tailwind CSS", level: 90 },
        { name: "SASS/SCSS", level: 85 },
        { name: "Webpack", level: 75 },
        { name: "Vite", level: 80 },
      ],
    },
    {
      category: "Backend Development",
      skills: [
        { name: "Node.js", level: 85 },
        { name: "Express.js", level: 85 },
        { name: "Django", level: 75 },
        { name: "Flask", level: 80 },
        { name: "FastAPI", level: 70 },
        { name: "GraphQL", level: 75 },
        { name: "REST APIs", level: 90 },
        { name: "Microservices", level: 70 },
      ],
    },
    {
      category: "Database & Storage",
      skills: [
        { name: "PostgreSQL", level: 85 },
        { name: "MongoDB", level: 80 },
        { name: "Redis", level: 75 },
        { name: "MySQL", level: 80 },
        { name: "Firebase", level: 85 },
        { name: "Supabase", level: 80 },
        { name: "AWS S3", level: 75 },
        { name: "Elasticsearch", level: 65 },
      ],
    },
    {
      category: "DevOps & Tools",
      skills: [
        { name: "Git", level: 95 },
        { name: "Docker", level: 80 },
        { name: "AWS", level: 75 },
        { name: "Vercel", level: 90 },
        { name: "GitHub Actions", level: 80 },
        { name: "Linux", level: 85 },
        { name: "Nginx", level: 70 },
        { name: "Kubernetes", level: 60 },
      ],
    },
    {
      category: "Mobile Development",
      skills: [
        { name: "React Native", level: 85 },
        { name: "Flutter", level: 70 },
        { name: "iOS Development", level: 65 },
        { name: "Android Development", level: 65 },
        { name: "Expo", level: 80 },
        { name: "PWA", level: 85 },
      ],
    },
  ]

  const getSkillBar = (level: number) => {
    return (
      <div className="flex items-center gap-2">
        <div className="w-32 h-2 border border-black bg-white">
          <div className="h-full bg-black" style={{ width: `${level}%` }}></div>
        </div>
        <span className="text-xs w-8">{level}%</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white text-black font-mono">
      {/* Menu Bar */}
      <div className="border-b border-gray-300 bg-gray-100 px-2 py-1">
        <div className="flex items-center gap-4 text-sm">
          <span className="font-semibold">Skills - Notepad</span>
          <nav className="flex gap-4 ml-8">
            <Link href="/" className="hover:bg-gray-200 px-2 py-1">
              File
            </Link>
            <Link href="/projects" className="hover:bg-gray-200 px-2 py-1">
              Projects
            </Link>
            <Link href="/skills" className="hover:bg-gray-200 px-2 py-1 bg-gray-200">
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
          <h1 className="text-4xl font-bold mb-2">Skills & Technologies</h1>
          <p className="text-lg text-gray-600 mb-4">My technical expertise and proficiency levels</p>
          <div className="w-16 h-0.5 bg-black mb-6"></div>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {skillCategories.map((category, index) => (
            <div key={index} className="border-2 border-black p-6">
              <h2 className="text-xl font-bold mb-4 border-b border-gray-300 pb-2">{category.category}</h2>
              <div className="space-y-3">
                {category.skills.map((skill, skillIndex) => (
                  <div key={skillIndex} className="flex justify-between items-center">
                    <span className="text-sm font-medium w-24">{skill.name}</span>
                    {getSkillBar(skill.level)}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-bold mb-6 border-b border-gray-300 pb-2">Additional Information</h2>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border-l-4 border-black pl-4">
              <h3 className="font-bold text-lg mb-2">Learning Philosophy</h3>
              <p className="text-sm text-gray-600">
                I believe in continuous learning and staying updated with the latest technologies. I regularly read
                documentation, take online courses, and work on personal projects to expand my skill set.
              </p>
            </div>

            <div className="border-l-4 border-black pl-4">
              <h3 className="font-bold text-lg mb-2">Current Focus</h3>
              <p className="text-sm text-gray-600">
                Currently diving deeper into cloud architecture, machine learning, and advanced React patterns. Also
                exploring Rust and WebAssembly for performance-critical applications.
              </p>
            </div>

            <div className="border-l-4 border-black pl-4">
              <h3 className="font-bold text-lg mb-2">Certifications</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• AWS Cloud Practitioner</li>
                <li>• Google Analytics Certified</li>
                <li>• MongoDB Developer</li>
                <li>• Scrum Master (PSM I)</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-gray-100 border-t border-gray-300 px-4 py-1 text-xs">
        <div className="flex justify-between">
          <span>Ready</span>
          <span>{skillCategories.reduce((total, cat) => total + cat.skills.length, 0)} skills loaded</span>
        </div>
      </div>
    </div>
  )
}
