"use client"

import { GraduationCap, Users, Award, BookOpen } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const highlights = [
  {
    icon: GraduationCap,
    title: "Expert Faculty",
    description: "Learn from industry professionals with years of experience in fashion design.",
  },
  {
    icon: Users,
    title: "Industry Connections",
    description: "Build your network with our strong industry partnerships and placement opportunities.",
  },
  {
    icon: Award,
    title: "Recognized Programs",
    description: "Our programs are affiliated with S.N.D.T.W University, Mumbai, ensuring quality education.",
  },
  {
    icon: BookOpen,
    title: "Comprehensive Curriculum",
    description: "Our curriculum combines theoretical knowledge with practical skills for a well-rounded education.",
  },
]

export default function InstituteHighlights() {
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: true, amount: 0.2 })
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  }
  
  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.7, ease: "easeOut" } },
  }

  return (
    <section className="py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6">Institute Highlights</h2>
          <div className="w-20 h-1 bg-rose-600 mx-auto mb-6"></div>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover what makes the National Institute of Fashion Designing a premier choice for aspiring fashion
            designers.
          </p>
        </motion.div>

        <motion.div 
          ref={containerRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2"
              variants={itemVariants}
            >
              <motion.div 
                className="flex justify-center mb-6"
                whileHover={{ rotate: [0, -10, 10, -5, 5, 0], transition: { duration: 0.5 } }}
              >
                <div className="p-4 bg-rose-50 rounded-full border-4 border-rose-100">
                  <highlight.icon className="h-10 w-10 text-rose-600" />
                </div>
              </motion.div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3 text-center">{highlight.title}</h3>
              <div className="w-12 h-0.5 bg-rose-300 mx-auto mb-4"></div>
              <p className="text-gray-600 text-center leading-relaxed">{highlight.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
