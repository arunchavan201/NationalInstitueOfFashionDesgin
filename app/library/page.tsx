"use client"

import { useEffect, useState } from "react"
import { LibraryTabs } from "@/components/library/library-tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Search, Book, Clock } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

// Define interfaces
interface LibraryContent {
  about?: string;
  hours?: string;
}

interface LibraryResource {
  id: string;
  title: string;
  author?: string;
  description?: string;
  category: string;
  coverImage?: string;
  year?: number;
  publisher?: string;
}

interface GroupedResources {
  books: LibraryResource[];
  journals: LibraryResource[];
  digital: LibraryResource[];
  archives: LibraryResource[];
}

export default function LibraryPage() {
  const [content, setContent] = useState<LibraryContent>({})
  const [resources, setResources] = useState<LibraryResource[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState<string>("")
  
  // Fetch library content and resources
  useEffect(() => {
    const fetchLibraryData = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/library')
        
        if (!response.ok) {
          throw new Error('Failed to fetch library data')
        }
        
        const data = await response.json()
        if (data.success && data.data) {
          setContent(data.data.content || {})
          setResources(data.data.resources || [])
        } else {
          throw new Error('No data available')
        }
      } catch (err: unknown) {
        console.error("Error fetching library data:", err)
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchLibraryData()
  }, [])

  // Default content if none is found in the database
  const defaultContent = {
    about: `
      <p>
        The National Institute of Fashion Designing library is a comprehensive resource center for fashion
        design students and faculty. Our library houses an extensive collection of books, journals, magazines,
        digital resources, and archives related to fashion design, textile science, fashion history, and
        industry practices.
      </p>
      <p>
        Our mission is to provide students with access to quality resources that enhance their learning
        experience and support their academic and creative endeavors. The library is continuously updated with
        the latest publications and digital resources to keep pace with the evolving fashion industry.
      </p>
    `,
    hours: `
      <li class="flex justify-between">
        <span>Monday - Friday</span>
        <span>9:00 AM - 6:00 PM</span>
      </li>
      <li class="flex justify-between">
        <span>Saturday</span>
        <span>10:00 AM - 4:00 PM</span>
      </li>
      <li class="flex justify-between">
        <span>Sunday</span>
        <span>Closed</span>
      </li>
    `
  }

  // Group resources by category
  const groupedResources: GroupedResources = {
    books: resources.filter((r) => r.category === "books"),
    journals: resources.filter((r) => r.category === "journals"),
    digital: resources.filter((r) => r.category === "digital"),
    archives: resources.filter((r) => r.category === "archives"),
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-rose-600 mx-auto mb-4" />
          <p className="text-lg font-medium text-gray-700">Loading library resources...</p>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-gradient-to-br from-red-50 to-rose-50">
        <div className="text-center p-8 rounded-lg shadow-lg bg-white/80 backdrop-blur-sm">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    )
  }

  // Main content
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-orange-50">
      <div className="container mx-auto px-4 py-16">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-amber-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Library & Resources
        </motion.h1>
        
        <motion.p 
          className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Discover our extensive collection of fashion literature, journals, and digital resources to fuel your creativity and learning.
        </motion.p>

        <div className="grid md:grid-cols-5 gap-8 mb-12">
          <motion.div 
            className="md:col-span-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-none overflow-hidden h-full">
              <CardContent className="p-6">
                <h2 className="text-2xl font-bold mb-6 text-rose-800 flex items-center gap-2">
                  <Book className="h-6 w-6" />
                  <span>About Our Library</span>
                </h2>
                <div className="prose max-w-none text-gray-700">
                  {content.about ? (
                    <div dangerouslySetInnerHTML={{ __html: content.about }} />
                  ) : (
                    <div dangerouslySetInnerHTML={{ __html: defaultContent.about }} />
                  )}
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-4 text-rose-700 flex items-center gap-2">
                    <Clock className="h-5 w-5" />
                    <span>Library Hours</span>
                  </h3>
                  <ul className="space-y-2 text-gray-700 bg-rose-50/50 p-4 rounded-lg">
                    {content.hours ? (
                      <div dangerouslySetInnerHTML={{ __html: content.hours }} />
                    ) : (
                      <div dangerouslySetInnerHTML={{ __html: defaultContent.hours }} />
                    )}
                  </ul>
                </div>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div 
            className="md:col-span-2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
       
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <h2 className="text-2xl font-bold mb-8 text-rose-800 text-center">Library Resources</h2>

          <Card className="shadow-xl bg-white/80 backdrop-blur-sm border-none overflow-hidden">
            <CardContent className="p-6">
              <LibraryTabs resources={groupedResources} />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
