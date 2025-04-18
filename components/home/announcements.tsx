"use client"

import { useEffect, useState } from "react"
import { Megaphone } from "lucide-react"
import { motion } from "framer-motion"

interface Announcement {
  _id: string
  text: string
  link?: string
  isActive: boolean
}

interface AnnouncementsProps {
  announcements: Announcement[]
}

export default function Announcements({ announcements }: AnnouncementsProps) {
  const [activeAnnouncements, setActiveAnnouncements] = useState<Announcement[]>([])

  useEffect(() => {
    if (announcements && announcements.length > 0) {
      setActiveAnnouncements(announcements.filter((a) => a.isActive))
    }
  }, [announcements])

  if (!announcements || announcements.length === 0) {
    return null
  }

  if (activeAnnouncements.length === 0) {
    return null
  }

  return (
    <motion.div 
      className="bg-gradient-to-r from-rose-700 to-rose-500 text-white py-3 overflow-hidden shadow-lg"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-4 flex items-center">
        <motion.div 
          className="flex-shrink-0 flex items-center mr-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Megaphone className="h-5 w-5 mr-2" />
          <span className="font-medium">Announcements:</span>
        </motion.div>
        <div className="overflow-hidden relative flex-1">
          <motion.div 
            className="flex"
            animate={{ 
              x: [0, -1000],
              transition: { 
                x: { 
                  repeat: Infinity, 
                  duration: 20, 
                  ease: "linear" 
                }
              }
            }}
          >
            {activeAnnouncements.map((announcement) => (
              <div key={announcement._id} className="inline-block px-4 mr-8 whitespace-nowrap">
                {announcement.link ? (
                  <a 
                    href={announcement.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:underline transition-all duration-300 hover:text-white/90"
                  >
                    {announcement.text}
                  </a>
                ) : (
                  <span>{announcement.text}</span>
                )}
              </div>
            ))}
            {/* Duplicate announcements for seamless loop */}
            {activeAnnouncements.map((announcement) => (
              <div key={`dup-${announcement._id}`} className="inline-block px-4 mr-8 whitespace-nowrap">
                {announcement.link ? (
                  <a 
                    href={announcement.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:underline transition-all duration-300 hover:text-white/90"
                  >
                    {announcement.text}
                  </a>
                ) : (
                  <span>{announcement.text}</span>
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
