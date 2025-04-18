'use client'

import { usePathname } from 'next/navigation'
import Header from './header'
import { motion } from 'framer-motion'

export default function PageLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.includes('admin')

  return (
    <>
      {!isAdminRoute && <Header />}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {isAdminRoute ? (
          children
        ) : (
          <>
            {/* Add top padding to account for fixed header */}
            <div className="pt-24">
              {children}
            </div>
          </>
        )}
      </motion.div>
    </>
  )
}
