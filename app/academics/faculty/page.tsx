"use client"

import { useEffect, useState } from "react"
import { FacultyTabs } from "@/components/faculty/faculty-tabs"
import { Loader2 } from "lucide-react"
import { motion } from "framer-motion"

interface Faculty {
  _id: string;
  name: string;
  designation: string;
  department?: string;
  qualification?: string;
  experience?: string;
  specialization?: string;
  email?: string;
  bio?: string;
  imageId?: string;
  isTeaching?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

interface FacultyData {
  teaching: Faculty[];
  nonTeaching: Faculty[];
}

export default function FacultyPage() {
  const [facultyData, setFacultyData] = useState<FacultyData>({ teaching: [], nonTeaching: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchFaculty() {
      try {
        setLoading(true)
        const response = await fetch('/api/faculty', {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        })
        
        const data = await response.json()
        
        if (!data.success) {
          throw new Error(data.error || 'Failed to fetch faculty data')
        }
        
        const teaching = data.data.filter((f: Faculty) => f.isTeaching !== false)
        const nonTeaching = data.data.filter((f: Faculty) => f.isTeaching === false)
        
        setFacultyData({ teaching, nonTeaching })
      } catch (error) {
        console.error("Error fetching faculty:", error)
        setError(error instanceof Error ? error.message : 'An error occurred')
      } finally {
        setLoading(false)
      }
    }
    
    fetchFaculty()
  }, [])

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-pink-100 via-white to-rose-100 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 -left-32 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        animate={{ 
          x: [0, 10, 0], 
          y: [0, 15, 0],
        }} 
        transition={{ 
          repeat: Infinity, 
          duration: 8,
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute bottom-20 right-32 w-72 h-72 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-70"
        animate={{ 
          x: [0, -20, 0], 
          y: [0, -10, 0],
        }} 
        transition={{ 
          repeat: Infinity, 
          duration: 10,
          ease: "easeInOut" 
        }}
      />

      <div className="container mx-auto px-4 py-16 relative z-10">
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <motion.h1 
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-rose-700 to-pink-600 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Our Faculty & Staff
          </motion.h1>
          <motion.div 
            className="w-32 h-1 bg-gradient-to-r from-rose-600 to-pink-500 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 128 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          ></motion.div>
          <motion.p 
            className="mt-4 text-gray-600 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Meet our talented team of educators and administrative staff dedicated to nurturing the next generation of fashion designers
          </motion.p>
        </motion.div>

        {loading ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Loader2 className="h-12 w-12 text-rose-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading faculty data...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="text-center py-12 bg-red-50 rounded-xl border border-red-100 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-medium text-red-600 mb-2">Error Loading Faculty</h3>
            <p className="text-gray-500">{error}</p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
          >
            <FacultyTabs teaching={facultyData.teaching} nonTeaching={facultyData.nonTeaching} />
          </motion.div>
        )}
      </div>
    </div>
  )
}
