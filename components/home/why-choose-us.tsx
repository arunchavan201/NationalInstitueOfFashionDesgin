"use client"

import Image from "next/image"
import { CheckCircle } from "lucide-react"
import { motion } from "framer-motion"
import { useInView } from "framer-motion"
import { useRef } from "react"

const reasons = [
  "Industry-relevant curriculum updated regularly",
  "Hands-on practical training in state-of-the-art facilities",
  "Experienced faculty with industry background",
  "Strong industry connections for internships and placements",
  "Regular workshops and masterclasses by industry experts",
  "Opportunities to showcase work at fashion shows and exhibitions",
  "Comprehensive library with latest fashion resources",
  "Supportive learning environment fostering creativity",
]

export default function WhyChooseUs() {
  const sectionRef = useRef(null)
  const isInView = useInView(sectionRef, { once: true, amount: 0.2 })
  
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }
  
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  }

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    show: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 1, ease: "easeOut" }
    }
  }

  return (
    <section className="py-24" ref={sectionRef}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl"
            variants={imageVariants}
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
          >
            <Image
              src="/image1.png"
              alt="Fashion design students working"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
            <motion.div 
              className="absolute bottom-0 left-0 w-full p-6 text-white"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.6, duration: 0.8 }}
            >
              <div className="bg-rose-600/90 backdrop-blur-sm p-6 rounded-lg inline-block">
                <h3 className="text-xl font-bold">Where Creativity Meets Opportunity</h3>
                <p className="text-white/90">Begin your journey to fashion excellence</p>
              </div>
            </motion.div>
          </motion.div>

          <div>
            <motion.h2 
              className="text-3xl md:text-4xl font-bold text-gray-900 mb-2"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.6 }}
            >
              Why Choose Us?
            </motion.h2>
            
            <motion.div 
              className="w-16 h-1 bg-rose-600 mb-6"
              initial={{ width: 0 }}
              animate={isInView ? { width: 64 } : { width: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            ></motion.div>
            
            <motion.p 
              className="text-lg text-gray-600 mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              At the National Institute of Fashion Designing, we are committed to providing a comprehensive education
              that prepares students for successful careers in the fashion industry.
            </motion.p>

            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 gap-5"
              variants={containerVariants}
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
            >
              {reasons.map((reason, index) => (
                <motion.div key={index} className="flex items-start" variants={itemVariants}>
                  <CheckCircle className="h-6 w-6 text-rose-600 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{reason}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  )
}
