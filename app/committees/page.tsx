"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { CommitteeTabs } from "@/components/committees/committee-tabs"

interface Committee {
  _id?: string
  name: string
  description?: string
  members: any[]
}

export default function CommitteesPage() {
  const [committees, setCommittees] = useState<Committee[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Define default committees if none are found in the database
  const defaultCommittees = [
    { name: "Placement Cell", members: [] },
    { name: "Grievance Committee", members: [] },
    { name: "Anti-Ragging Committee", members: [] },
    { name: "Anti-Discrimination Cell", members: [] },
    { name: "Vishakha Committee", members: [] },
    { name: "Avishkar Cell", members: [] },
    { name: "Development Committee", members: [] },
    { name: "Managing Committee", members: [] },
  ]

  useEffect(() => {
    const fetchCommittees = async () => {
      try {
        const response = await fetch('/api/committees')
        
        if (!response.ok) {
          throw new Error(`Error fetching committees: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.success && data.data && data.data.length > 0) {
          setCommittees(data.data)
        } else {
          setCommittees(defaultCommittees)
        }
      } catch (err) {
        console.error("Failed to load committees:", err)
        setError("Unable to load committees. Please try again later.")
        setCommittees(defaultCommittees)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCommittees()
  }, [])

  // Animation variants for staggered list animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { type: "spring", stiffness: 100 }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="h-16 w-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-blue-700 font-medium">Loading committees...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-[70vh] container mx-auto px-4 py-12 flex items-center justify-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-100 shadow-md max-w-lg w-full">
          <h2 className="text-xl font-bold text-red-700 mb-2">Something went wrong</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(224,231,255,0.5)_0%,rgba(255,255,255,0)_70%),radial-gradient(ellipse_at_bottom_left,rgba(199,210,254,0.5)_0%,rgba(255,255,255,0)_70%)] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-center mb-2 text-indigo-800 bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-500">Committees</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-400 to-blue-600 mx-auto mb-6 rounded-full"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Our institute operates through various committees to ensure smooth functioning and 
            provide the best environment for our students and faculty.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white/80 backdrop-blur-sm rounded-xl shadow-xl p-6 border border-blue-100"
        >
          <CommitteeTabs committees={committees} />
        </motion.div>

        <motion.section 
          className="mt-16"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <h2 className="text-2xl font-bold text-center mb-8 text-indigo-700">All Committees</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {committees.map((committee, index) => (
              <motion.div
                key={committee._id || index}
                variants={itemVariants}
                whileHover={{ 
                  scale: 1.03, 
                  boxShadow: "0 10px 25px -5px rgba(66, 75, 178, 0.15)" 
                }}
                className="bg-white rounded-lg shadow-md p-5 border-l-4 border-indigo-500 hover:border-indigo-600 transition-all duration-300"
              >
                <h3 className="font-bold text-indigo-700 mb-2">{committee.name}</h3>
                {committee.description && (
                  <p className="text-sm text-gray-600 mb-3">{committee.description}</p>
                )}
                <p className="text-sm text-gray-500">
                  {committee.members && committee.members.length > 0
                    ? `${committee.members.length} members`
                    : "No members yet"}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.section>
      </div>
    </div>
  )
}
