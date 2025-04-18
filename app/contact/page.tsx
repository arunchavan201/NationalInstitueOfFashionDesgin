"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, Phone, Clock, MapPin, Loader2, Send, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    name: "",
    email: "",
    subject: "",
    message: ""
  })
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormState(prev => ({ ...prev, [id]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormError(null)
    
    // Simulate form submission
    try {
      // You can replace this with an actual API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      setIsSubmitted(true)
      setFormState({ name: "", email: "", subject: "", message: "" })
    } catch (error) {
      setFormError("There was an error sending your message. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-16">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Get In Touch
        </motion.h1>
        
        <motion.p 
          className="text-lg text-center text-gray-600 max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We'd love to hear from you. Send us a message or visit our institute.
        </motion.p>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          {[
            {
              icon: <Mail className="h-6 w-6 text-teal-600" />,
              title: "Email",
              content: (
                <a href="mailto:523nationalinstitute@gmail.com" className="text-teal-600 hover:underline">
                  523nationalinstitute@gmail.com
                </a>
              ),
              bgClass: "bg-teal-100",
              delay: 0
            },
            {
              icon: <Phone className="h-6 w-6 text-blue-600" />,
              title: "Phone",
              content: (
                <>
                  <a href="tel:+919974469124" className="text-blue-600 hover:underline">
                    +91 9974469124
                  </a>
                  <a href="tel:+918411888688" className="text-blue-600 hover:underline mt-1">
                    +91 8411888688
                  </a>
                </>
              ),
              bgClass: "bg-blue-100",
              delay: 0.1
            },
            {
              icon: <Clock className="h-6 w-6 text-indigo-600" />,
              title: "Working Hours",
              content: (
                <>
                  <p className="text-gray-700">Monday - Saturday</p>
                  <p className="text-gray-700">9:00 AM - 5:00 PM</p>
                </>
              ),
              bgClass: "bg-indigo-100",
              delay: 0.2
            }
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 + item.delay }}
              whileHover={{ y: -5 }}
            >
              <Card className="shadow-lg hover:shadow-xl transition-all duration-300 border-none bg-white/70 backdrop-blur-sm">
                <CardContent className="p-6 flex flex-col items-center text-center">
                  <div className={`${item.bgClass} p-4 rounded-full mb-5 shadow-md`}>
                    {item.icon}
                  </div>
                  <h3 className="font-semibold text-lg mb-3">{item.title}</h3>
                  <div className="space-y-1">{item.content}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="shadow-xl border-none bg-white/70 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                  <Send className="mr-2 h-5 w-5 text-teal-600" />
                  Send Us a Message
                </h2>

                {isSubmitted ? (
                  <motion.div 
                    className="flex flex-col items-center py-8"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="rounded-full bg-teal-100 p-3 mb-4">
                      <CheckCircle className="h-10 w-10 text-teal-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-800">Thank You!</h3>
                    <p className="text-center text-gray-600">
                      Your message has been sent successfully. We'll get back to you soon.
                    </p>
                    <Button 
                      className="mt-6 bg-teal-600 hover:bg-teal-700"
                      onClick={() => setIsSubmitted(false)}
                    >
                      Send Another Message
                    </Button>
                  </motion.div>
                ) : (
                  <form className="space-y-5" onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-gray-700">Your Name</Label>
                        <Input 
                          id="name" 
                          placeholder="Enter your name" 
                          required 
                          className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          value={formState.name}
                          onChange={handleInputChange}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-gray-700">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="Enter your email" 
                          required 
                          className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                          value={formState.email}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject" className="text-gray-700">Subject</Label>
                      <Input 
                        id="subject" 
                        placeholder="Enter subject" 
                        required 
                        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        value={formState.subject}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-gray-700">Message</Label>
                      <Textarea 
                        id="message" 
                        placeholder="Enter your message" 
                        rows={5} 
                        required 
                        className="border-gray-300 focus:border-teal-500 focus:ring-teal-500"
                        value={formState.message}
                        onChange={handleInputChange}
                      />
                    </div>

                    {formError && (
                      <div className="p-3 rounded bg-red-50 text-red-600 text-sm">
                        {formError}
                      </div>
                    )}

                    <Button 
                      type="submit" 
                      className="bg-gradient-to-r from-teal-500 to-blue-600 hover:from-teal-600 hover:to-blue-700 w-full md:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <div className="flex items-center">
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending...
                        </div>
                      ) : (
                        <div className="flex items-center">
                          <Send className="mr-2 h-4 w-4" />
                          Send Message
                        </div>
                      )}
                    </Button>
                  </form>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="shadow-xl border-none bg-white/70 backdrop-blur-sm overflow-hidden h-full">
              <CardContent className="p-0">
                <div className="h-full min-h-[400px]">
                  <div className="relative w-full h-full">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15186.013811134044!2d76.74156135!3d17.937091199999998!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bcf4166f8287605%3A0xec1001da3d0dfc40!2sDESHMUKH%20COLLEGE%20OF%20PHARMACY%20KASAR%20SIRSI!5e0!3m2!1sen!2sin!4v1701840230740!5m2!1sen!2sin"
                      width="100%"
                      height="100%"
                      style={{ border: 0, minHeight: "400px", position: "absolute", top: 0, left: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="National Institute of Fashion Designing, Kasar Sirsi"
                      className="filter contrast-[1.1] saturate-[1.2]"
                    ></iframe>
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white/80 via-white/50 to-transparent p-4 backdrop-blur-sm">
                      <div className="flex items-start mx-4">
                        <MapPin className="h-5 w-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                        <div>
                          <h3 className="font-semibold mb-1">Our Address</h3>
                          <p className="text-gray-700 text-sm">
                            National Institute of Fashion Designing,
                            <br />
                            Kasar Sirsi,
                            <br />
                            Affiliated to S.N.D.T.W University, Mumbai
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.div
          className="text-center text-gray-600 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        >
          <p>Connect with us on social media</p>
          <div className="flex justify-center space-x-4 mt-4">
            {/* Social Media Icons */}
            {['facebook', 'instagram', 'twitter', 'youtube'].map((platform, i) => (
              <motion.a 
                key={platform} 
                href="#" 
                className="p-2 rounded-full bg-white/80 shadow-md hover:shadow-lg transition-all duration-300"
                whileHover={{ y: -3, scale: 1.1 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 + (i * 0.1) }}
              >
                <img 
                  src={`/placeholder.svg?height=24&width=24&text=${platform}`} 
                  alt={platform} 
                  className="h-6 w-6" 
                />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
