"use client"

import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { useEffect, useState } from "react"

// Animation variants
const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
}

const shimmer = {
  hidden: { backgroundPosition: "200% 0" },
  visible: {
    backgroundPosition: "0% 0",
    transition: { repeat: Infinity, duration: 3, ease: "linear" }
  }
}

const pulseAnimation = {
  scale: [1, 1.02, 1],
  transition: { duration: 1.5, repeat: Infinity }
}

export default function AcademicsPage() {
  const [isLoaded, setIsLoaded] = useState(false)

  // For section animations
  const [programsRef, programsInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [resourcesRef, resourcesInView] = useInView({ threshold: 0.1, triggerOnce: true })
  const [facultyRef, facultyInView] = useInView({ threshold: 0.1, triggerOnce: true })

  useEffect(() => {
    // Simulate loading state
    const timer = setTimeout(() => setIsLoaded(true), 300)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="bg-gradient-to-br from-rose-50 via-slate-50 to-blue-50 min-h-screen relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div
        className="absolute top-20 left-10 w-64 h-64 rounded-full bg-pink-100 opacity-30 blur-3xl"
        animate={{ 
          x: [0, 30, 0], 
          y: [0, -20, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-20 right-10 w-80 h-80 rounded-full bg-blue-100 opacity-30 blur-3xl"
        animate={{ 
          x: [0, -40, 0], 
          y: [0, 30, 0],
        }}
        transition={{ duration: 17, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-700"
        >
          Academics
        </motion.h1>

        <motion.section 
          ref={programsRef}
          initial="hidden"
          animate={programsInView ? "visible" : "hidden"}
          variants={fadeIn}
          className="mb-16 bg-white bg-opacity-60 backdrop-filter backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white border-opacity-30"
        >
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={programsInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-6 text-gray-800 border-b border-rose-200 pb-2"
          >
            Programs Offered
          </motion.h2>

          <motion.div 
            variants={staggerContainer} 
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            <motion.div variants={fadeIn} whileHover={{ y: -10 }} className="transition-all duration-300">
              <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-none group">
                <CardContent className="p-0">
                  <div className="relative h-48 w-full overflow-hidden">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-rose-300/30 to-pink-300/30 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      whileHover={{ opacity: 1 }}
                    />
                    <Image
                      src="/Ba.jpg"
                      alt="B.A. Fashion Design"
                      fill
                      className="object-cover rounded-t-lg group-hover:scale-110 transition-transform duration-700"
                    />
                  </div>
                  <motion.div 
                    className="p-6 bg-gradient-to-br from-white to-rose-50"
                    whileHover={{ backgroundColor: "#fff9fb" }}
                  >
                    <h3 className="text-xl font-bold mb-2 text-gray-800">B.A. Fashion Design</h3>
                    <p className="text-gray-600 mb-4">
                      A comprehensive three-year program that covers all aspects of fashion design, including garment
                      construction, pattern making, textile design, and fashion illustration.
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 border-none shadow-md hover:shadow-lg transition-all">
                        <Link href="/academics/syllabus">
                          Learn More <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section 
          ref={resourcesRef}
          initial="hidden"
          animate={resourcesInView ? "visible" : "hidden"}
          variants={fadeIn}
          className="mb-16 bg-white bg-opacity-60 backdrop-filter backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white border-opacity-30"
        >
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={resourcesInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-6 text-gray-800 border-b border-rose-200 pb-2"
          >
            Academic Resources
          </motion.h2>
          
          <motion.div 
            variants={staggerContainer}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {[
              {
                title: "Admission",
                description: "Information about eligibility, fees, and application process",
                icon: (
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                ),
                link: "/academics/admission"
              },
              {
                title: "Syllabus",
                description: "Detailed course structure and curriculum",
                icon: (
                  <>
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                  </>
                ),
                link: "/academics/syllabus"
              },
              {
                title: "Academic Calendar",
                description: "Important dates, events, and schedules",
                icon: (
                  <>
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                  </>
                ),
                link: "/academics/calendar"
              },
              {
                title: "Exams & Results",
                description: "Examination schedules and result announcements",
                icon: (
                  <>
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                  </>
                ),
                link: "/academics/exams"
              }
            ].map((resource, i) => (
              <motion.div 
                key={i}
                variants={fadeIn}
                whileHover={{ y: -8, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
                className="transition-all duration-300"
              >
                <Card className="overflow-hidden h-full transition-all duration-300 bg-gradient-to-b from-white to-rose-50 border-none hover:border-rose-200">
                  <CardContent className="p-6 flex flex-col items-center text-center h-full">
                    <motion.div 
                      className="bg-gradient-to-br from-rose-100 to-pink-100 p-3 rounded-full mb-4 shadow-sm"
                      whileHover={pulseAnimation}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-rose-600"
                      >
                        {resource.icon}
                      </svg>
                    </motion.div>
                    <h3 className="font-semibold mb-2">{resource.title}</h3>
                    <p className="text-sm text-gray-600 mb-4">{resource.description}</p>
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      className="mt-auto"
                    >
                      <Button asChild variant="outline" size="sm" className="border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700">
                        <Link href={resource.link}>View Details</Link>
                      </Button>
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </motion.section>

        <motion.section 
          ref={facultyRef}
          initial="hidden"
          animate={facultyInView ? "visible" : "hidden"}
          variants={fadeIn}
          className="bg-white bg-opacity-60 backdrop-filter backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-white border-opacity-30"
        >
          <motion.h2 
            initial={{ opacity: 0 }}
            animate={facultyInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.3 }}
            className="text-2xl font-bold mb-6 text-gray-800 border-b border-rose-200 pb-2"
          >
            Faculty
          </motion.h2>
          
          <motion.div variants={fadeIn}>
            <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border-none">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <motion.div 
                    className="relative h-48 w-48 flex-shrink-0 overflow-hidden rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-rose-200/30 to-purple-200/30 z-10"
                      animate={{ opacity: [0.3, 0.5, 0.3] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                    />
                    <Image
                      src="/image3.png"
                      alt="Faculty"
                      fill
                      className="object-contain rounded-lg"
                    />
                  </motion.div>
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={facultyInView ? { opacity: 1, x: 0 } : {}} transition={{ delay: 0.5, duration: 0.6 }}>
                    <motion.h3 
                      className="text-xl font-bold mb-2 text-gray-800"
                      variants={shimmer}
                      style={{ backgroundSize: "200% 100%", backgroundImage: "linear-gradient(90deg, #d53369 0%, #d53369 50%, #daae51 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                    >
                      Our Faculty
                    </motion.h3>
                    <p className="text-gray-600 mb-4">
                      The National Institute of Fashion Designing boasts a team of highly qualified and experienced
                      faculty members who are experts in their respective fields. Our faculty includes industry
                      professionals, designers, and academics who bring a wealth of knowledge and practical experience to
                      the classroom.
                    </p>
                    <p className="text-gray-600 mb-4">
                      Our teaching staff is dedicated to providing students with the best education and mentorship to help
                      them succeed in the competitive fashion industry. They are committed to staying updated with the
                      latest trends, technologies, and teaching methodologies.
                    </p>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Button asChild className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 border-none shadow-md hover:shadow-lg transition-all">
                        <Link href="/academics/faculty">
                          Meet Our Faculty <ChevronRight className="h-4 w-4 ml-1" />
                        </Link>
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.section>
      </div>
    </div>
  )
}
