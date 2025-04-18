'use client'

import { useState, useEffect } from 'react'
import HeroBanner from "@/components/home/hero-banner"
import Announcements from "@/components/home/announcements"
import InstituteHighlights from "@/components/home/institute-highlights"
import WhyChooseUs from "@/components/home/why-choose-us"
import CallToAction from "@/components/home/call-to-action"
import { motion } from "framer-motion"
import { Loader2 } from 'lucide-react'

export default function Home() {
  const [announcements, setAnnouncements] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true)
        const res = await fetch('/api/announcements', { 
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache'
          }
        })
        if (!res.ok) {
          throw new Error('Failed to fetch announcements')
        }
        const data = await res.json()
        setAnnouncements(data.data || [])
      } catch (err) {
        console.error('Error fetching announcements:', err)
        setError('Failed to load announcements. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAnnouncements()
  }, [])

  // Page fade-in animation
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" }
    }
  }

  // Page background with gradient
  return (
    <div className="bg-gradient-to-b from-white via-rose-50/30 to-white min-h-screen">
      {/* Beautiful radial gradient background effect */}
      <div className="fixed inset-0 z-[-1] bg-white">
        <div className="absolute top-0 left-0 right-0 h-[50vh] bg-gradient-to-br from-rose-100/50 via-purple-50/30 to-transparent rounded-full blur-3xl transform -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-full h-[40vh] bg-gradient-to-tl from-blue-50/40 via-rose-50/30 to-transparent rounded-full blur-3xl transform translate-y-1/3" />
      </div>
      
      {isLoading ? (
        <div className="flex items-center justify-center h-screen">
          <Loader2 className="h-12 w-12 animate-spin text-rose-500" />
        </div>
      ) : (
        <motion.div 
          className="flex flex-col w-full overflow-hidden"
          initial="hidden"
          animate="show"
          variants={containerVariants}
        >
          <motion.div variants={itemVariants}>
            <Announcements announcements={announcements} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <HeroBanner />
          </motion.div>
          <motion.div variants={itemVariants}>
            <InstituteHighlights />
          </motion.div>
          <motion.div variants={itemVariants}>
            <WhyChooseUs />
          </motion.div>
          <motion.div variants={itemVariants}>
            <CallToAction />
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
