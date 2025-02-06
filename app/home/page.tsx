"use client"

import { useState, useRef } from "react"
import withAuth from "@/hoc/withAuth"
import Navbar from "@/components/Navbar"
import ContentSection, { ContentSectionRef } from "@/components/ContentSection"
import ChatSection from "@/components/ChatSection"
import ConnectionSection from "@/components/ConnectionSection"
import PostForm from "@/components/PostForm"
import MobileChatButton from "@/components/MobileChatButton"
import MobileConnectionButton from "@/components/MobileConnectionButton"
import MobileChatList from "@/components/MobileChatList"
import MobileConnectionList from "@/components/MobileConnectionList"
import Carousel from "@/components/Carousel"

function HomePage() {
  const [isPostFormOpen, setIsPostFormOpen] = useState(false)
  const contentSectionRef = useRef<ContentSectionRef>(null)

  const handlePostCreated = () => {
    setIsPostFormOpen(false)
    // Refresh posts in ContentSection
    contentSectionRef.current?.fetchPosts()
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onPostClick={() => setIsPostFormOpen(true)} />
      <div className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Carousel />
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="hidden lg:block lg:col-span-3">
              <ChatSection />
            </div>
            <div className="lg:col-span-6">
              <ContentSection ref={contentSectionRef} />
            </div>
            <div className="hidden lg:block lg:col-span-3">
              <ConnectionSection />
            </div>
          </div>
        </div>
      </div>
      <PostForm 
        isOpen={isPostFormOpen} 
        onClose={() => setIsPostFormOpen(false)} 
        onPostCreated={handlePostCreated}
      />
      <div className="lg:hidden">
        <MobileChatButton />
        <MobileConnectionButton />
      </div>
    </div>
  )
}

export default withAuth(HomePage)
