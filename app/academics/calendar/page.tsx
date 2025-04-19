'use client'

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Download, Info, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

// Define type for calendar items
interface CalendarItem {
  _id: string
  title: string
  fileId: string
  academicYear?: string
  createdAt: string
}

export default function AcademicCalendarPage() {
  const [calendars, setCalendars] = useState<CalendarItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCalendars = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/academics/calendar')
        const result = await response.json()
        
        if (result.success) {
          setCalendars(result.data)
        } else {
          setError("Failed to load calendars")
        }
      } catch (err) {
        setError("An error occurred while fetching the data")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCalendars()
  }, [])

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    show: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100
      }
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-b from-rose-100 via-white to-rose-200 px-4 py-12"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.h1 
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ 
            type: "spring", 
            damping: 12,
            delay: 0.2
          }}
          className="text-4xl font-bold text-center mb-12 relative"
        >
          <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-rose-900 via-rose-700 to-rose-500">
            Academic Calendar
          </span>
          <motion.span 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.4 }}
            className="absolute inset-x-0 bottom-2 h-3 bg-rose-300 opacity-40 transform -rotate-1 z-0 rounded-full"
          ></motion.span>
        </motion.h1>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="grid md:grid-cols-2 gap-8 mb-12 bg-white/90 backdrop-blur-sm rounded-xl p-8 shadow-xl border-2 border-rose-100"
        >
          <motion.div whileInView={{ opacity: [0.8, 1], x: [-10, 0] }} transition={{ duration: 0.5 }}>
            <p className="text-gray-700 mb-6 leading-relaxed text-lg">
              The academic calendar provides important dates and schedules for the academic year, including:
            </p>
            <motion.ul 
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              variants={containerVariants}
              className="list-disc pl-5 space-y-2 text-gray-700 mb-6"
            >
              {["Semester start and end dates", "Examination schedules", "Holiday and vacation periods", 
                "Events and workshops", "Project submission deadlines", "Result announcements"].map((item, i) => (
                <motion.li key={i} variants={itemVariants}>{item}</motion.li>
              ))}
            </motion.ul>
            <p className="text-gray-700 leading-relaxed">
              Students are advised to regularly check the academic calendar for any updates or changes to the schedule.
            </p>
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.03 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="relative h-[300px] rounded-lg overflow-hidden shadow-lg"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-rose-300/40 to-pink-500/40 z-10"></div>
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1.5 }}
              className="h-full w-full"
            >
              <img
                src="/image4.png"
                alt="Academic Calendar"
                className="object-cover w-full h-full transform hover:scale-105 transition-all duration-1000"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/30 to-transparent z-10"></div>
          </motion.div>
        </motion.div>

        {loading ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
            >
              <Loader2 className="h-12 w-12 text-rose-600 mb-4" />
            </motion.div>
            <p className="text-lg text-gray-600">Loading academic calendars...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-red-50/80 backdrop-blur-sm rounded-lg border border-red-200 shadow-lg"
          >
            <motion.div 
              animate={{ scale: [0.9, 1, 0.9] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4"
            >
              <Info className="h-8 w-8 text-red-600" />
            </motion.div>
            <h3 className="text-xl font-medium text-red-800 mb-2">Error Loading Data</h3>
            <p className="text-red-600">{error}</p>
            <Button 
              onClick={() => window.location.reload()} 
              variant="outline" 
              className="mt-4 border-red-300 text-red-700 hover:bg-red-50"
            >
              Try Again
            </Button>
          </motion.div>
        ) : calendars.length > 0 ? (
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {calendars.map((calendar, index) => (
              <motion.div
                key={calendar._id}
                variants={itemVariants}
                whileHover={{ y: -8, transition: { type: "spring", stiffness: 300 } }}
              >
                <Card className="overflow-hidden border-rose-100 group h-full bg-white/80 backdrop-blur-sm shadow-md hover:shadow-2xl transition-all duration-300">
                  <div className="h-2 bg-gradient-to-r from-rose-500 via-pink-500 to-rose-400"></div>
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <motion.div 
                      whileHover={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.6 }}
                      className="bg-gradient-to-br from-rose-100 to-rose-200 p-4 rounded-full mb-4 shadow-inner"
                    >
                      <Calendar className="h-10 w-10 text-rose-700" />
                    </motion.div>
                    <h3 className="font-semibold mb-2 text-rose-800 text-lg">{calendar.title}</h3>
                    {calendar.academicYear && (
                      <p className="text-sm text-gray-500 mb-4">Academic Year: {calendar.academicYear}</p>
                    )}
                    <p className="text-sm text-gray-500 mb-6">
                      Added on {new Date(calendar.createdAt).toLocaleDateString()}
                    </p>
                    <Button asChild className="mt-auto bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 transition-all duration-300 shadow-md hover:shadow-lg group">
                      <a href={`/api/files/${calendar.fileId}`} target="_blank" rel="noopener noreferrer" className="flex items-center">
                        <motion.span
                          whileHover={{ y: [0, -4, 0] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="flex items-center"
                        >
                          <Download className="h-4 w-4 mr-2 group-hover:animate-bounce" /> Download Calendar
                        </motion.span>
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-lg border border-gray-100 shadow-lg"
          >
            <motion.div 
              animate={{ rotateY: 360 }}
              transition={{ repeat: Infinity, duration: 7, ease: "linear" }}
              className="bg-gradient-to-br from-rose-100 to-rose-200 p-4 rounded-full inline-flex items-center justify-center mb-6"
            >
              <Calendar className="h-12 w-12 text-rose-600" />
            </motion.div>
            <h3 className="text-xl font-medium text-gray-700 mb-2">No Academic Calendars Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              The academic calendar documents will be uploaded soon. Please check back later.
            </p>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-12 flex gap-6 flex-col md:flex-row"
        >
          <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
            <Card className="h-full hover:shadow-xl transition-all duration-300 border-rose-100 overflow-hidden bg-white/80 backdrop-blur-sm">
              <div className="h-1 bg-gradient-to-r from-rose-400 to-rose-600"></div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.7 }}
                    className="bg-gradient-to-br from-rose-100 to-rose-200 p-2 rounded-full mr-3 shadow-sm"
                  >
                    <Info className="h-5 w-5 text-rose-700" />
                  </motion.div>
                  <h3 className="font-semibold text-rose-800">Important Notice</h3>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  The academic calendar is subject to change. Any changes will be communicated through official channels and
                  the updated calendar will be uploaded here.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="flex-1">
            <Card className="h-full hover:shadow-xl transition-all duration-300 border-rose-100 overflow-hidden bg-white/80 backdrop-blur-sm">
              <div className="h-1 bg-gradient-to-r from-rose-600 to-rose-400"></div>
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <motion.div 
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.7 }}
                    className="bg-gradient-to-br from-rose-100 to-rose-200 p-2 rounded-full mr-3 shadow-sm"
                  >
                    <Info className="h-5 w-5 text-rose-700" />
                  </motion.div>
                  <h3 className="font-semibold text-rose-800">Contact Information</h3>
                </div>
                <p className="text-gray-700 mb-4 leading-relaxed">
                  For any queries regarding the academic calendar, please contact the Academic Office:
                </p>
                <p className="text-gray-700">
                  <span className="font-medium">Email:</span> academic@nifd.edu
                  <br />
                  <span className="font-medium">Phone:</span> +91 9975469123
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  )
}
