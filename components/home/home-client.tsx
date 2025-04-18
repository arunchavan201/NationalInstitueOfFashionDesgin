"use client"

import { motion } from "framer-motion"
import HeroBanner from "@/components/home/hero-banner"
import Announcements from "@/components/home/announcements"
import InstituteHighlights from "@/components/home/institute-highlights"
import WhyChooseUs from "@/components/home/why-choose-us"
import CallToAction from "@/components/home/call-to-action"

interface HomeClientProps {
  announcements: any[]
}

export default function HomeClient({ announcements }: HomeClientProps) {
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

  return (
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
  )
}
