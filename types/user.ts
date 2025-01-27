export interface User {
  id: number
  username: string
  email: string
  password: string
  bio?: string | null
  location?: string | null
  website?: string | null
  instagramProfile?: string | null
  githubProfile?: string | null
  linkedinProfile?: string | null
  skills?: string | null
  currentlyWorkingAt?: string | null
  pastWorkedAt?: string | null
  joinDate: Date
  session?: string | null
  isAdmin: boolean
}

export interface Post {
  id: number
  type: string
  content: string
  caption?: string | null
  authorId: number
  createdAt: Date
  author: User
  comments: Comment[]
}

export interface Comment {
  id: number
  content: string
  authorId: number
  postId: number
  createdAt: Date
  author: User
  post: Post
}

export interface Connection {
  id: number
  userId: number
  user: User
  createdAt: Date
}

export interface CarouselItem {
  id: number
  src: string
  alt: string
  createdAt: Date
}

export interface GalleryImage {
  id: number
  src: string
  alt: string
  createdAt: Date
}

export interface Highlight {
  id: number
  content: string
  createdAt: Date
}

