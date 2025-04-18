"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Download, Calendar, Bell, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { motion } from "framer-motion"

// Define interfaces for our data types
interface Schedule {
  _id: string
  title: string
  fileId: string
  createdAt: string
}

interface Result {
  _id: string
  title: string
  fileId: string
  createdAt: string
}

interface ExamData {
  examInfo: string
  schedules: Schedule[]
  results: Result[]
}

export default function ExamsPage() {
  const [examData, setExamData] = useState<ExamData>({
    examInfo: "",
    schedules: [],
    results: []
  })
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<string>("info")

  useEffect(() => {
    const fetchExamData = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/academics/exams')
        const result = await response.json()
        
        if (result.success) {
          setExamData(result.data)
        } else {
          setError("Failed to load exam data")
        }
      } catch (err) {
        console.error("Error fetching exam data:", err)
        setError("An error occurred while fetching exam data")
      } finally {
        setIsLoading(false)
      }
    }

    fetchExamData()
  }, [])

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12 flex flex-col items-center justify-center min-h-[70vh]">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white/80 backdrop-blur-sm p-10 rounded-lg shadow-xl flex flex-col items-center"
        >
          <Loader2 className="h-12 w-12 text-rose-600 animate-spin mb-4" />
          <h2 className="text-2xl font-bold text-rose-800">Loading exam information...</h2>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Alert variant="destructive" className="bg-rose-50 border-rose-200">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-rose-50 to-pink-50 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-64 h-64 bg-rose-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-40 right-10 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-1/3 w-72 h-72 bg-yellow-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

      <div className="container mx-auto px-4 py-12 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12 relative">
            <div className="absolute inset-0 flex items-center justify-center -z-10">
              <div className="w-32 h-32 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full opacity-70 blur-3xl"></div>
            </div>
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-800 to-rose-600 mb-4"
            >
              Examinations
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-rose-700 max-w-2xl mx-auto"
            >
              Access all examination related information, schedules, and results from this central hub.
            </motion.p>
          </div>

          <Tabs 
            defaultValue="info" 
            className="w-full" 
            value={activeTab}
            onValueChange={(value: string) => setActiveTab(value)}
          >
            <TabsList className="grid w-full grid-cols-3 mb-8 bg-white/50 backdrop-blur-sm rounded-lg border border-rose-100/50 shadow-sm">
              <TabsTrigger 
                value="info" 
                className={`${activeTab === "info" ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md" : "hover:bg-rose-100/50"} transition-all duration-300 rounded-md`}
              >
                Exam Information
              </TabsTrigger>
              <TabsTrigger 
                value="schedules" 
                className={`${activeTab === "schedules" ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md" : "hover:bg-rose-100/50"} transition-all duration-300 rounded-md`}
              >
                Exam Schedules
              </TabsTrigger>
              <TabsTrigger 
                value="results" 
                className={`${activeTab === "results" ? "bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-md" : "hover:bg-rose-100/50"} transition-all duration-300 rounded-md`}
              >
                Results
              </TabsTrigger>
            </TabsList>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-rose-100"
            >
              <TabsContent value="info" className="mt-0">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-6 lg:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-800 to-rose-600 border-b pb-2 border-rose-100">Examination Guidelines</h2>

                    {examData.examInfo ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="prose max-w-none" 
                        dangerouslySetInnerHTML={{ __html: examData.examInfo }} 
                      />
                    ) : (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <p className="text-gray-700 mb-4">
                          The National Institute of Fashion Designing conducts examinations to evaluate students'
                          understanding and application of concepts taught during the academic term. These examinations are
                          designed to assess theoretical knowledge as well as practical skills.
                        </p>

                        <h3 className="text-xl font-bold mb-3 mt-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-rose-500">Examination Pattern</h3>
                        <p className="text-gray-700 mb-4">
                          Each course has both internal and external assessments. Internal assessments include class
                          assignments, projects, presentations, and mid-term tests. External assessments are conducted at the
                          end of each semester.
                        </p>

                        <h3 className="text-xl font-bold mb-3 mt-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-rose-500">Evaluation Criteria</h3>
                        <p className="text-gray-700 mb-4">Students are evaluated based on the following criteria:</p>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700 mb-6">
                          <li>Theory examinations - 40%</li>
                          <li>Practical assessments - 40%</li>
                          <li>Assignments and projects - 10%</li>
                          <li>Attendance and participation - 10%</li>
                        </ul>

                        <h3 className="text-xl font-bold mb-3 mt-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-700 to-rose-500">Passing Criteria</h3>
                        <p className="text-gray-700 mb-4">
                          Students must score a minimum of 40% marks in each subject and 50% marks in aggregate to pass the
                          semester examination.
                        </p>
                      </motion.div>
                    )}

                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-lg mt-8 border border-rose-100 shadow-sm"
                    >
                      <div className="flex items-center mb-3">
                        <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, repeatDelay: 5, duration: 0.5 }}>
                          <Bell className="h-5 w-5 text-rose-600 mr-2" />
                        </motion.div>
                        <h4 className="font-semibold text-rose-800">Important Notes</h4>
                      </div>
                      <ul className="list-disc pl-5 space-y-2 text-gray-700">
                        <li>Students must carry their ID cards to the examination hall.</li>
                        <li>Use of mobile phones or any electronic devices is strictly prohibited during examinations.</li>
                        <li>Students found using unfair means will be subject to disciplinary action.</li>
                      </ul>
                    </motion.div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="schedules" className="mt-0">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-6 lg:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-800 to-rose-600 border-b pb-2 border-rose-100">Examination Schedules</h2>

                    {examData.schedules && examData.schedules.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {examData.schedules.map((schedule: Schedule, index: number) => (
                          <motion.div
                            key={schedule._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                          >
                            <Card className="hover:shadow-xl transition-all duration-500 border-rose-100 group overflow-hidden bg-gradient-to-br from-white to-rose-50 hover:from-white hover:to-pink-50">
                              <CardContent className="p-6 flex flex-col items-center text-center h-full relative">
                                <motion.div 
                                  className="absolute -right-6 -top-6 w-16 h-16 bg-gradient-to-r from-rose-200 to-pink-200 rounded-full opacity-70"
                                  whileHover={{ scale: 2, opacity: 0.5 }}
                                  transition={{ duration: 0.7 }}
                                />
                                <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
                                  <Calendar className="h-10 w-10 text-rose-600 mb-3 relative z-10" />
                                </motion.div>
                                <h3 className="font-semibold mb-2 text-rose-800">{schedule.title}</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                  Added on {new Date(schedule.createdAt).toLocaleDateString()}
                                </p>
                                <motion.div whileHover={{ scale: 1.05 }} className="mt-auto w-full">
                                  <Button asChild className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 border-none shadow-md hover:shadow-xl transition-all">
                                    <a href={`/api/files/${schedule.fileId}`} target="_blank" rel="noopener noreferrer">
                                      <Download className="h-4 w-4 mr-2" /> Download Schedule
                                    </a>
                                  </Button>
                                </motion.div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center py-12 bg-gradient-to-r from-gray-50 to-rose-50 rounded-lg border border-gray-100"
                      >
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        </motion.div>
                        <h3 className="text-xl font-medium text-gray-600 mb-2">No Examination Schedules Available</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          Examination schedules will be uploaded here when available. Please check back later.
                        </p>
                      </motion.div>
                    )}

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="mt-8 p-6 border border-rose-100 rounded-lg bg-gradient-to-r from-rose-50 via-pink-50 to-white shadow-sm"
                    >
                      <h3 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-800 to-rose-600 mb-2">Contact Information</h3>
                      <p className="text-gray-700">
                        For any queries regarding examination schedules, please contact the Examination Cell:
                      </p>
                      <p className="text-gray-700 mt-2">
                        <span className="font-medium">Email:</span> exam@nifd.edu
                        <br />
                        <span className="font-medium">Phone:</span> +91 9974469124
                      </p>
                    </motion.div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="results" className="mt-0">
                <Card className="border-0 shadow-none">
                  <CardContent className="p-6 lg:p-8">
                    <h2 className="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-rose-800 to-rose-600 border-b pb-2 border-rose-100">Examination Results</h2>

                    {examData.results && examData.results.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {examData.results.map((result: Result, index: number) => (
                          <motion.div
                            key={result._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1, duration: 0.5 }}
                          >
                            <Card className="hover:shadow-xl transition-all duration-300 border-rose-100 group">
                              <CardContent className="p-6 flex flex-col items-center text-center h-full bg-gradient-to-br from-white to-rose-50 hover:from-white hover:to-pink-50 transition-all duration-300">
                                <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 300 }}>
                                  <FileText className="h-10 w-10 text-rose-600 mb-3" />
                                </motion.div>
                                <h3 className="font-semibold mb-2 text-rose-800">{result.title}</h3>
                                <p className="text-sm text-gray-500 mb-6">
                                  Published on {new Date(result.createdAt).toLocaleDateString()}
                                </p>
                                <motion.div whileHover={{ scale: 1.05 }} className="mt-auto w-full">
                                  <Button asChild className="w-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-700 hover:to-rose-600 shadow-md hover:shadow-xl transition-all">
                                    <a href={`/api/files/${result.fileId}`} target="_blank" rel="noopener noreferrer">
                                      <Download className="h-4 w-4 mr-2" /> Download Result
                                    </a>
                                  </Button>
                                </motion.div>
                              </CardContent>
                            </Card>
                          </motion.div>
                        ))}
                      </div>
                    ) : (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-center py-12 bg-gradient-to-r from-gray-50 to-rose-50 rounded-lg border border-gray-100"
                      >
                        <motion.div animate={{ y: [0, -5, 0] }} transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}>
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        </motion.div>
                        <h3 className="text-xl font-medium text-gray-600 mb-2">No Results Available</h3>
                        <p className="text-gray-500 max-w-md mx-auto">
                          Examination results will be uploaded here when available. Please check back later.
                        </p>
                      </motion.div>
                    )}

                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                      className="mt-8 bg-gradient-to-r from-rose-50 to-pink-50 p-6 rounded-lg border border-rose-100 shadow-sm"
                    >
                      <h3 className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-800 to-rose-600 mb-3">Result Verification</h3>
                      <p className="text-gray-700 mb-3">
                        If you need to verify your results or have any discrepancies, please visit the Examination Cell with
                        your ID card and examination hall ticket within 7 days of result declaration.
                      </p>
                      <p className="text-gray-700">
                        <span className="font-medium">Re-evaluation Request:</span> Applications for re-evaluation must be
                        submitted within 10 days of result declaration along with the prescribed fee.
                      </p>
                    </motion.div>
                  </CardContent>
                </Card>
              </TabsContent>
            </motion.div>
          </Tabs>
        </motion.div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  )
}
