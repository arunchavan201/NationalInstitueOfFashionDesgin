"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { ChevronDown, Image as ImageIcon, Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { motion, AnimatePresence } from "framer-motion"

// Define interfaces for better type safety
interface Category {
  _id: string;
  name: string;
  description?: string;
}

interface GalleryImage {
  _id: string;
  imageId: string;
  title?: string;
  description?: string;
  categoryId: string;
  createdAt?: string;
}

export function GalleryContent() {
  const [categories, setCategories] = useState<Category[]>([])
  const [activeCategory, setActiveCategory] = useState<string>("")
  const [images, setImages] = useState<GalleryImage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isCategoryChanging, setIsCategoryChanging] = useState(false)
  const { toast } = useToast()

  // Fetch categories on component mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch("/api/gallery/categories")
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data.length > 0) {
            setCategories(data.data)
            setActiveCategory(data.data[0]._id)
          } else {
            setIsLoading(false)
          }
        } else {
          throw new Error("Failed to fetch categories")
        }
      } catch (error) {
        console.error("Error fetching gallery categories:", error)
        toast({
          title: "Error",
          description: "Failed to load gallery categories. Please try again.",
          variant: "destructive",
        })
        setIsLoading(false)
      }
    }

    fetchCategories()
  }, [toast])

  // Fetch images when active category changes
  useEffect(() => {
    if (activeCategory) {
      fetchImages(activeCategory)
    }
  }, [activeCategory])

  async function fetchImages(categoryId: string) {
    setIsCategoryChanging(true)
    try {
      const response = await fetch(`/api/gallery/images?categoryId=${categoryId}`)
      if (response.ok) {
        const data = await response.json()
        if (data.success) {
          setImages(data.data)
        } else {
          setImages([])
        }
      } else {
        throw new Error("Failed to fetch images")
      }
    } catch (error) {
      console.error("Error fetching gallery images:", error)
      toast({
        title: "Error",
        description: "Failed to load gallery images. Please try again.",
        variant: "destructive",
      })
      setImages([])
    } finally {
      setIsLoading(false)
      // Small delay to make the transition look smoother
      setTimeout(() => setIsCategoryChanging(false), 300)
    }
  }

  // Handle category change
  const handleCategoryChange = (categoryId: string) => {
    setActiveCategory(categoryId)
  }

  if (categories.length === 0 && !isLoading) {
    return (
      <motion.div 
        className="text-center py-12 bg-white/40 backdrop-blur-sm rounded-xl shadow-lg p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <ImageIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-700 mb-4">No Gallery Categories Found</h2>
        <p className="text-gray-500">Check back later for updates to our gallery.</p>
      </motion.div>
    )
  }

  const currentCategory = categories.find((cat) => cat._id === activeCategory)

  // Initial loading screen
  if (isLoading && categories.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] py-12">
        <div className="relative w-24 h-24">
          <motion.div 
            className="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-500 rounded-full opacity-70"
            animate={{
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <Loader2 className="h-16 w-16 text-white animate-spin absolute left-4 top-4" />
        </div>
        <motion.p 
          className="text-lg font-medium text-gray-700 mt-6"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Loading gallery...
        </motion.p>
      </div>
    )
  }

  return (
    <motion.div 
      className="space-y-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <motion.div 
        className="flex justify-center"
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="outline" 
              className="border-purple-200 bg-white/80 hover:bg-purple-100 text-purple-800 backdrop-blur-sm shadow-md px-6 py-5"
            >
              {currentCategory?.name || "Select Category"}
              <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="center" className="w-56">
            {categories.map((category) => (
              <DropdownMenuItem 
                key={category._id} 
                onClick={() => handleCategoryChange(category._id)}
                className={activeCategory === category._id ? "bg-purple-50 text-purple-800 font-medium" : ""}
              >
                {category.name}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </motion.div>

      {isLoading || isCategoryChanging ? (
        <motion.div 
          className="flex justify-center items-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="relative">
            <div className="h-16 w-16 rounded-full border-4 border-purple-200 opacity-30"></div>
            <div className="absolute top-0 left-0 h-16 w-16 rounded-full border-t-4 border-l-4 border-purple-600 animate-spin"></div>
          </div>
        </motion.div>
      ) : (
        <>
          {currentCategory && (
            <motion.div 
              className="text-center mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-bold text-purple-800 mb-2">{currentCategory.name}</h2>
              {currentCategory.description && (
                <p className="text-gray-600 max-w-2xl mx-auto">{currentCategory.description}</p>
              )}
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {images.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {images.map((image, index) => (
                    <motion.div
                      key={image._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                    >
                      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-none group">
                        <CardContent className="p-0">
                          <div className="relative h-64 w-full overflow-hidden">
                            <Image
                              src={`/api/files/${image.imageId}`}
                              alt={image.title || "Gallery Image"}
                              fill
                              className="object-contain transition-transform duration-500 group-hover:scale-105"
                              onError={(e) => {
                                e.currentTarget.src = "/placeholder.svg?height=300&width=500&text=Image"
                              }}
                            />
                          </div>
                          {(image.title || image.description) && (
                            <div className="p-4 bg-gradient-to-t from-purple-50 to-transparent">
                              {image.title && <h3 className="font-bold text-purple-800">{image.title}</h3>}
                              {image.description && <p className="text-gray-600 text-sm mt-1">{image.description}</p>}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <motion.div 
                  className="text-center py-12 bg-white/40 backdrop-blur-sm rounded-lg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">No images found in this category.</p>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </motion.div>
  )
}
