"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Loader2 } from "lucide-react"
import { motion } from "framer-motion"

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.3
    }
  }
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

export default function SyllabusPage() {
  const [syllabusFiles, setSyllabusFiles] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError,] = useState<string | null>(null)

  useEffect(() => {
    const fetchSyllabus = async () => {
      try {
        setLoading(true)
        const res = await fetch("/api/academics/syllabus")
        const data = await res.json()
        
        if (data.success) {
          setSyllabusFiles(data.data)
        } else {
          setError("Failed to load syllabus data")
        }
      } catch (err) {
        console.error("Error fetching syllabus:", err)
        setError("An error occurred while fetching the syllabus")
      } finally {
        setLoading(false)
      }
    }

    fetchSyllabus()
  }, [])

  return (
    <div className="min-h-screen bg-[linear-gradient(to_bottom,_var(--tw-gradient-stops))] from-rose-100 via-white to-rose-100 overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute -top-20 -right-20 w-80 h-80 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"
        animate={{ 
          scale: [1, 1.2, 1], 
          rotate: [0, 90, 0],
        }} 
        transition={{ 
          repeat: Infinity, 
          duration: 25,
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute -bottom-32 -left-20 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40"
        animate={{ 
          scale: [1, 1.1, 1], 
          rotate: [0, -45, 0],
        }} 
        transition={{ 
          repeat: Infinity, 
          duration: 20,
          ease: "easeInOut" 
        }}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div 
          className="mb-12 text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1 
            className="text-4xl font-bold mb-4 bg-gradient-to-r from-rose-700 to-rose-500 bg-clip-text text-transparent"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            Syllabus
          </motion.h1>
          <motion.div 
            className="w-20 h-1 bg-gradient-to-r from-rose-600 to-rose-400 mx-auto rounded-full"
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          ></motion.div>
        </motion.div>

        <motion.div 
          className="grid md:grid-cols-2 gap-8 mb-12 bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        >
          <div>
            <motion.h2 
              className="text-2xl font-bold mb-4 bg-gradient-to-r from-rose-700 to-rose-500 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              Program Syllabus
            </motion.h2>
            <motion.p 
              className="text-gray-700 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              Find detailed syllabus for all programs offered at the National Institute of Fashion Designing. These
              documents outline the course structure, subjects, credit distribution, and learning outcomes for each
              program.
            </motion.p>
            <motion.p 
              className="text-gray-700"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              The syllabus is designed in consultation with industry experts and academic professionals to ensure that our
              curriculum remains current and aligned with industry requirements and best practices in fashion education.
            </motion.p>
          </div>

          <motion.div 
            className="relative h-[300px] rounded-2xl overflow-hidden shadow-lg"
            whileHover={{ scale: 1.03 }}
            transition={{ duration: 0.4 }}
          >
            <img
              src="/image2.png"
              alt="Syllabus"
              className="object-cover w-full h-full"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-rose-900/70 to-transparent opacity-60"></div>
          </motion.div>
        </motion.div>

        {loading ? (
          <motion.div 
            className="flex flex-col items-center justify-center py-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Loader2 className="h-12 w-12 text-rose-600 animate-spin mb-4" />
            <p className="text-gray-600 font-medium">Loading syllabus files...</p>
          </motion.div>
        ) : error ? (
          <motion.div 
            className="text-center py-8 bg-red-50 rounded-xl border border-red-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <FileText className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-red-600 mb-2">Error Loading Syllabus</h3>
            <p className="text-gray-500">{error}</p>
          </motion.div>
        ) : syllabusFiles && syllabusFiles.length > 0 ? (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {syllabusFiles.map((file) => (
              <motion.div key={file._id} variants={item}>
                <motion.div whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0,0,0,0.3)" }} transition={{ duration: 0.3 }}>
                  <Card className="overflow-hidden transition-all duration-300 border-none bg-white/80 backdrop-blur-sm">
                    <div className="h-2 bg-gradient-to-r from-rose-600 to-rose-400"></div>
                    <CardContent className="p-6 flex flex-col items-center text-center h-full">
                      <motion.div 
                        className="bg-rose-50 p-3 rounded-full mb-4"
                        whileHover={{ rotate: [0, 15, -15, 0] }}
                        transition={{ duration: 0.5 }}
                      >
                        <FileText className="h-10 w-10 text-rose-600" />
                      </motion.div>
                      <h3 className="font-semibold mb-2 text-gray-800 text-lg">{file.title}</h3>
                      {file.program && <p className="text-sm text-gray-500 mb-4">{file.program}</p>}
                      <p className="text-sm text-gray-500 mb-6">Added on {new Date(file.createdAt).toLocaleDateString()}</p>
                      <motion.div 
                        className="mt-auto w-full"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button asChild className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 border-none shadow-md">
                          <a href={`/api/files/${file.fileId}`} target="_blank" rel="noopener noreferrer">
                            <Download className="h-4 w-4 mr-2" /> Download Syllabus
                          </a>
                        </Button>
                      </motion.div>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div 
            className="text-center py-12 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-100 p-4 rounded-full inline-flex mx-auto mb-4">
              <FileText className="h-12 w-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-600 mb-2">No Syllabus Available</h3>
            <p className="text-gray-500 max-w-md mx-auto">The syllabus documents will be uploaded soon. Please check back later.</p>
          </motion.div>
        )}

        <motion.div 
          className="mt-12 bg-gradient-to-r from-rose-100 to-rose-50 p-8 rounded-2xl shadow-sm"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xl font-bold mb-4 bg-gradient-to-r from-rose-700 to-rose-500 bg-clip-text text-transparent">Need Help?</h2>
          <p className="text-gray-700 mb-4">
            If you have any questions about the syllabus or need additional information about our academic programs,
            please contact the Academic Office.
          </p>
          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <motion.div variants={item}>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
                <span className="font-medium text-rose-600">Email:</span> academic@nifd.edu
              </div>
            </motion.div>
            <motion.div variants={item}>
              <div className="bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all">
                <span className="font-medium text-rose-600">Phone:</span> +91 9975469123
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
