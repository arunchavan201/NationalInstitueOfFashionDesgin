"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { AboutTabs } from "@/components/about/about-tabs"
import { Card, CardContent } from "@/components/ui/card"
import { motion } from "framer-motion"

interface AboutContent {
  _id?: string
  institute: string
  society: string
  vision?: string
  mission?: string
}

interface Leader {
  _id: string
  name: string
  role: string
  position: string
  message?: string
  imageId?: string
  createdAt: Date
  updatedAt: Date
}

const LeadershipMessage = ({ leader, title }: { leader: Leader | undefined, title: string }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
    >
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-rose-100">
        <CardContent className="p-0">
          <div className="flex flex-col items-center p-6 bg-gradient-to-b from-rose-100 to-white">
            <motion.div
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="relative w-24 h-24 rounded-full overflow-hidden mb-4 border-4 border-rose-200 shadow-md"
            >
              <Image
                src={leader?.imageId ? `/api/files/${leader.imageId}` : "/placeholder-user.jpg"}
                alt={title}
                fill
                className="object-cover"
              />
            </motion.div>
            <h3 className="text-lg font-bold text-rose-800">{`${title}'s Message`}</h3>
            <p className="text-sm text-gray-500">{leader?.name || title}</p>
          </div>
          <div
            className="prose max-w-none text-sm p-6"
            dangerouslySetInnerHTML={{ __html: leader?.message || "Message coming soon..." }}
          />
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default function AboutPage() {
  const [aboutData, setAboutData] = useState<{
    about: AboutContent,
    directors: any[],
    leadership: Leader[]
  }>({
    about: { institute: "", society: "" },
    directors: [],
    leadership: [],
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        // Create an array of promises for all API calls
        const [aboutRes, directorsRes, leadershipRes] = await Promise.allSettled([
          fetch('/api/content/about'),
          fetch('/api/directors'),
          fetch('/api/leadership')
        ]);

        // Process about data
        let aboutData = { institute: "", society: "" };
        if (aboutRes.status === 'fulfilled' && aboutRes.value.ok) {
          const aboutJson = await aboutRes.value.json();
          aboutData = aboutJson.data || aboutData;
        }

        // Process directors data
        let directorsData = [];
        if (directorsRes.status === 'fulfilled' && directorsRes.value.ok) {
          const directorsJson = await directorsRes.value.json();
          directorsData = directorsJson.data || [];
        } else {
          console.error('Failed to fetch directors data');
        }

        // Process leadership data
        let leadershipData = [];
        if (leadershipRes.status === 'fulfilled' && leadershipRes.value.ok) {
          const leadershipJson = await leadershipRes.value.json();
          leadershipData = leadershipJson.data || [];
        } else {
          console.error('Failed to fetch leadership data');
        }

        // Set the combined data
        setAboutData({
          about: aboutData,
          directors: directorsData,
          leadership: leadershipData
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load about page data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAboutData();
  }, []);

  // Find leaders by their roles, case-insensitive
  const getLeaderByRole = (role: string) => 
    aboutData.leadership.find(l => l.role.toLowerCase() === role.toLowerCase())

  const chairmanMessage = getLeaderByRole("Chairman")
  const secretaryMessage = getLeaderByRole("Secretary")
  const principalMessage = getLeaderByRole("Principal")

  if (loading) {
    return (
      <div className="container mx-auto flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-rose-500"></div>
          <p className="mt-4 text-rose-600 font-medium">Loading amazing content...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <div className="bg-red-50 p-6 rounded-lg border border-red-100 shadow-md">
          <p className="text-red-800 text-lg mb-3">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-2 px-4 py-2 bg-rose-500 text-white rounded-md hover:bg-rose-600 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-rose-50 via-white to-rose-100">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,228,230,0.5)_0%,rgba(255,255,255,0)_70%),radial-gradient(ellipse_at_bottom_left,rgba(254,205,211,0.5)_0%,rgba(255,255,255,0)_70%)] pointer-events-none"></div>
      
      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          <h1 className="text-4xl font-bold text-center mb-2 text-rose-800 bg-clip-text text-transparent bg-gradient-to-r from-rose-700 to-rose-500">About Us</h1>
          <div className="w-24 h-1 bg-gradient-to-r from-rose-400 to-rose-600 mx-auto mb-12 rounded-full"></div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="backdrop-blur-sm bg-white/70 rounded-2xl shadow-xl p-6 border border-rose-100"
        >
          <AboutTabs about={aboutData.about} directors={aboutData.directors} leadership={aboutData.leadership} />
        </motion.div>

        <section className="mb-12 mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <h2 className="text-3xl font-bold text-center mb-2 text-rose-800 bg-clip-text text-transparent bg-gradient-to-r from-rose-700 to-rose-500">Messages from Leadership</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-rose-400 to-rose-600 mx-auto mb-10 rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <LeadershipMessage leader={chairmanMessage} title="Chairman" />
            <LeadershipMessage leader={secretaryMessage} title="Secretary" />
            <LeadershipMessage leader={principalMessage} title="Principal" />
          </div>
        </section>
      </div>
    </div>
  )
}
