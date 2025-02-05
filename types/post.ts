export type Comment = {
  id: number
  content: string
  authorId: number
  postId: number
  createdAt: Date
  author: {
    id: number
    username: string
    email: string
  }
}

export type Post = {
  id: number
  content: string
  fileUrl?: string
  fileType?: 'image' | 'video'
  authorId: number
  createdAt: Date
  author: {
    id: number
    username: string
    email: string
  }
  comments: Comment[]
  likes: number
}
