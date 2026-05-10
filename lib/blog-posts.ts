export type BlogPost = {
  slug: string
  title: string
  date: string
  readTime: string
  tags: string[]
  content: string
}

export const blogPosts: BlogPost[] = [
  {
    slug: "the-intentionality-of-search-that-is-lacking-with-algorithms",
    title: "[1] The Intentionality of Search That is Lacking with Algorithms",
    date: "2026-05-09",
    readTime: "3 min read",
    tags: ["Life"],
    content: `Today is May 9th, 2026, and like any other day, I was watching a video on YouTube as I ate. While that itself is a problem I need to work on, I want to talk about a much more troubling problem underlying problem that I noted — I was watching the videos that YouTube recommended.

The story of this realization starts from earlier in the day when my family visited another for lunch. For some reason, the conversation went to watching cooking videos on YouTube. On this topic, I heard two competing thoughts — one person said that they first look at the videos recommended by YouTube’s algorithm, and then decide that they would like to cook something that day, while the other person said that they decide what they want to cook, before going to YouTube to look at videos about that specific topic. The difference in the way people approach different things struck me at that time, but didn’t really materialize when I was watching the video later in the day.

Coming back to my point of realization. The video I was watching today was about Private Credit (from Bloomberg), and while I am quite interested in these kinds of videos, that wouldn’t have been the thing I would’ve watched today, primarily because I have a very scary exam coming up on Monday. If I weren’t recommended this video by YouTube, I would’ve probably watched something that I truly wanted to or watched nothing and just talked about stuff with my family, who were right there when I was watching this video.

I was lacking intentionality with my actions!

I don’t wish to point specifically to YouTube. Any service that tries to “personalize” recommendations can really be clubbed together here — anything from clothing brands recommending “clothes you might like” to social media platforms showing you posts from specific people.

But, I believe this experience is quite different from when we just searched something in books, or even Google to an extent, where we mostly got the things that we were there for, and maybe a little more. Any other things that we came across (whether by flipping to the wrong page of the book, or typing incorrectly and being shown something else) were mostly luck and sheer happenstance (which is not really a bad thing). This, in my opinion, is a better way to explore the world than being “recommended” something by an algorithm created for an alternate purpose.

Having said all that, I do realize that the lack of intentionality is on myself alone. After all, YouTube, and all the other platforms do have a search offering that I could use, and should use more often.`,
  },
]

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((p) => p.slug === slug)
}

export function getAllPostsSorted(): BlogPost[] {
  return [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}
