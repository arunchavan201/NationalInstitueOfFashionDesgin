'use client'

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, FileText, Loader2, Sparkles } from "lucide-react"
import Image from "next/image"
import { motion } from "framer-motion"

interface FileMetadata {
  type: string;
  section?: string;
}

interface FileDocument {
  _id: string;
  filename?: string;
  metadata: FileMetadata;
  uploadDate?: Date;
}

interface GovtResolution {
  id: string;
  name: string;
}

interface AdmissionContent {
  section?: string;
  process?: string;
  importantDates?: string;
  eligibility?: string;
  feeStructure?: string;
  scholarship?: string;
  cancellation?: string;
  brochureId?: string;
  admissionFormId?: string;
  scholarshipFileId?: string;
  admissionInfoId?: string;
  govtResolutions?: GovtResolution[];
}

interface AdmissionData {
  content: AdmissionContent;
  files: FileDocument[];
}

export default function AdmissionPage() {
  const [admissionData, setAdmissionData] = useState<AdmissionData>({
    content: {},
    files: [],
  })
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchAdmissionContent = async () => {
      try {
        setLoading(true)
        const response = await fetch(`/api/content/admission`, {
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
          },
        })

        const { success, data, error } = await response.json()
        
        if (!success) throw new Error(error || 'Failed to fetch admission content')
        
        const admissionContent = data || {}
        const specificFiles: FileDocument[] = []
        
        if (admissionContent?.brochureId) {
          specificFiles.push({
            _id: admissionContent.brochureId,
            metadata: { type: "brochure" }
          });
        }
        
        if (admissionContent?.admissionFormId) {
          specificFiles.push({
            _id: admissionContent.admissionFormId,
            metadata: { type: "admission-form" }
          });
        }
        
        if (admissionContent?.scholarshipFileId) {
          specificFiles.push({
            _id: admissionContent.scholarshipFileId,
            metadata: { type: "scholarship" }
          });
        }
        
        if (admissionContent?.admissionInfoId) {
          specificFiles.push({
            _id: admissionContent.admissionInfoId,
            metadata: { type: "admission-info" }
          });
        }
        
        const governmentResolutions = admissionContent.govtResolutions ?? [];
        for (const resolution of governmentResolutions) {
          specificFiles.push({
            _id: resolution.id,
            filename: resolution.name,
            metadata: { type: "government-resolution" },
            uploadDate: new Date()
          });
        }

        setAdmissionData({
          content: admissionContent,
          files: specificFiles,
        })
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred')
        console.error("Error fetching admission content:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAdmissionContent()
  }, [])

  const { content, files } = admissionData

  const brochureFile = files.find((f: FileDocument) => f.metadata.type === "brochure")
  const admissionFormFile = files.find((f: FileDocument) => f.metadata.type === "admission-form")
  const scholarshipFile = files.find((f: FileDocument) => f.metadata.type === "scholarship")
  const admissionInfoFile = files.find((f: FileDocument) => f.metadata.type === "admission-info")

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-rose-50 via-slate-50 to-blue-50 min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center p-8 rounded-lg"
        >
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-rose-600 mb-4" />
          <h2 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-700">Loading admission information...</h2>
        </motion.div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-gradient-to-br from-rose-50 via-slate-50 to-blue-50 min-h-screen flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full"
        >
          <div className="text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-rose-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-600 mb-2">Error Loading Data</h2>
            <p className="text-gray-600 mb-4">{error}</p>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                onClick={() => window.location.reload()} 
                className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 border-none shadow-md hover:shadow-lg transition-all"
              >
                Try Again
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="bg-gradient-to-br from-rose-50 via-slate-50 to-blue-50 min-h-screen">
      <div className="container mx-auto px-4 py-12">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-purple-700 drop-shadow-sm"
        >
          Admission Information
        </motion.h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <Card className="md:col-span-2 overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-none bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800 border-b border-rose-200 pb-2">Admission Process 2024-25</h2>
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{ __html: content.process || "Admission process information coming soon..." }}
              />

              <div className="flex flex-wrap gap-4 mt-6">
                {brochureFile && (
                  <Button asChild variant="outline" className="flex items-center border-rose-300 text-rose-600 hover:bg-rose-50 hover:text-rose-700 shadow-sm">
                    <a href={`/api/files/${brochureFile._id}`} target="_blank" rel="noopener noreferrer">
                      <FileText className="h-4 w-4 mr-2" />
                      Download Brochure
                    </a>
                  </Button>
                )}

                {admissionFormFile && (
                  <Button asChild className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 border-none shadow-md hover:shadow-lg transition-all flex items-center">
                    <a href={`/api/files/${admissionFormFile._id}`} target="_blank" rel="noopener noreferrer">
                      <Download className="h-4 w-4 mr-2" />
                      Download Application Form
                    </a>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-none bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm">
            <CardContent className="p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800 border-b border-rose-200 pb-2">Important Dates</h2>
              <ul className="space-y-3">
                {content.importantDates ? (
                  <div dangerouslySetInnerHTML={{ __html: content.importantDates }} />
                ) : (
                  <>
                    <li className="flex justify-between items-center py-2 px-3 rounded-md bg-gradient-to-r from-white to-rose-50">
                      <span className="text-gray-700">Application Start</span>
                      <span className="font-medium bg-rose-100 text-rose-800 py-1 px-3 rounded-full text-sm">June 1, 2024</span>
                    </li>
                    <li className="flex justify-between items-center py-2 px-3 rounded-md bg-gradient-to-r from-white to-rose-50">
                      <span className="text-gray-700">Application Deadline</span>
                      <span className="font-medium bg-rose-100 text-rose-800 py-1 px-3 rounded-full text-sm">July 15, 2024</span>
                    </li>
                    <li className="flex justify-between items-center py-2 px-3 rounded-md bg-gradient-to-r from-white to-rose-50">
                      <span className="text-gray-700">Entrance Exam</span>
                      <span className="font-medium bg-rose-100 text-rose-800 py-1 px-3 rounded-full text-sm">July 25, 2024</span>
                    </li>
                    <li className="flex justify-between items-center py-2 px-3 rounded-md bg-gradient-to-r from-white to-rose-50">
                      <span className="text-gray-700">Result Declaration</span>
                      <span className="font-medium bg-rose-100 text-rose-800 py-1 px-3 rounded-full text-sm">August 5, 2024</span>
                    </li>
                    <li className="flex justify-between items-center py-2 px-3 rounded-md bg-gradient-to-r from-white to-rose-50">
                      <span className="text-gray-700">Counseling Begins</span>
                      <span className="font-medium bg-rose-100 text-rose-800 py-1 px-3 rounded-full text-sm">August 10, 2024</span>
                    </li>
                    <li className="flex justify-between items-center py-2 px-3 rounded-md bg-gradient-to-r from-white to-rose-50">
                      <span className="text-gray-700">Classes Begin</span>
                      <span className="font-medium bg-rose-100 text-rose-800 py-1 px-3 rounded-full text-sm">August 25, 2024</span>
                    </li>
                  </>
                )}
              </ul>

              <div className="mt-6 pt-4 border-t border-rose-100">
                <h3 className="font-semibold mb-2 text-gray-800">Contact for Admission</h3>
                <p className="text-gray-700 mb-1 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  +91 9974469124, +91 8411888688
                </p>
                <p className="text-gray-700 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-rose-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  523nationalinstitute@gmail.com
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="eligibility" className="w-full mb-12">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <TabsList className="grid w-full grid-cols-1 md:grid-cols-4 bg-gradient-to-r from-rose-100 to-pink-50 rounded-lg overflow-hidden shadow-md">
              <TabsTrigger value="eligibility" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300">Eligibility Criteria</TabsTrigger>
              <TabsTrigger value="fee-structure" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300">Fee Structure</TabsTrigger>
              <TabsTrigger value="scholarship" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300">Scholarship</TabsTrigger>
              <TabsTrigger value="cancellation" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-rose-500 data-[state=active]:to-pink-500 data-[state=active]:text-white transition-all duration-300">Cancellation Rules</TabsTrigger>
            </TabsList>
          </motion.div>

          <TabsContent value="eligibility" className="mt-6">
            <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-none bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b border-rose-200 pb-2">Eligibility Criteria</h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gradient-to-b from-white to-rose-50 border border-rose-100 rounded-lg shadow-sm">
                 
                    <tbody className="divide-y divide-rose-100">
                      {content.eligibility ? (
                        <tr>
                          <td colSpan={3} className="py-4 px-6">
                            <div dangerouslySetInnerHTML={{ __html: content.eligibility }} />
                          </td>
                        </tr>
                      ) : (
                        <>
                          <tr className="hover:bg-rose-50 transition-colors">
                            <td className="py-3 px-4 whitespace-nowrap font-medium">B.A. Fashion Design</td>
                            <td className="py-3 px-4">10+2 or equivalent from any recognized board</td>
                            <td className="py-3 px-4">Entrance exam and portfolio review</td>
                          </tr>
                          <tr className="hover:bg-rose-50 transition-colors">
                            <td className="py-3 px-4 whitespace-nowrap font-medium">B.Design</td>
                            <td className="py-3 px-4">
                              10+2 or equivalent from any recognized board with minimum 50% marks
                            </td>
                            <td className="py-3 px-4">Entrance exam, portfolio review, and personal interview</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="fee-structure" className="mt-6">
            <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-none bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b border-rose-200 pb-2">Fee Structure</h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full bg-gradient-to-b from-white to-rose-50 border border-rose-100 rounded-lg shadow-sm">
                    <thead>
                  
                    </thead>
                    <tbody className="divide-y divide-rose-100">
                      {content.feeStructure ? (
                        <tr>
                          <td colSpan={5} className="py-4 px-6">
                            <div dangerouslySetInnerHTML={{ __html: content.feeStructure }} />
                          </td>
                        </tr>
                      ) : (
                        <>
                          <tr className="hover:bg-rose-50 transition-colors">
                            <td className="py-3 px-4" rowSpan={3}>
                              B.A. Fashion Design
                            </td>
                            <td className="py-3 px-4">General</td>
                            <td className="py-3 px-4">₹50,000</td>
                            <td className="py-3 px-4">₹10,000</td>
                            <td className="py-3 px-4 font-medium">₹60,000</td>
                          </tr>
                          <tr className="hover:bg-rose-50 transition-colors">
                            <td className="py-3 px-4">OBC</td>
                            <td className="py-3 px-4">₹45,000</td>
                            <td className="py-3 px-4">₹10,000</td>
                            <td className="py-3 px-4 font-medium">₹55,000</td>
                          </tr>
                          <tr className="hover:bg-rose-50 transition-colors">
                            <td className="py-3 px-4">SC/ST</td>
                            <td className="py-3 px-4">₹40,000</td>
                            <td className="py-3 px-4">₹10,000</td>
                            <td className="py-3 px-4 font-medium">₹50,000</td>
                          </tr>
                          <tr className="hover:bg-rose-50 transition-colors">
                            <td className="py-3 px-4" rowSpan={3}>
                              B.Design
                            </td>
                            <td className="py-3 px-4">General</td>
                            <td className="py-3 px-4">₹60,000</td>
                            <td className="py-3 px-4">₹12,000</td>
                            <td className="py-3 px-4 font-medium">₹72,000</td>
                          </tr>
                          <tr className="hover:bg-rose-50 transition-colors">
                            <td className="py-3 px-4">OBC</td>
                            <td className="py-3 px-4">₹55,000</td>
                            <td className="py-3 px-4">₹12,000</td>
                            <td className="py-3 px-4 font-medium">₹67,000</td>
                          </tr>
                          <tr className="hover:bg-rose-50 transition-colors">
                            <td className="py-3 px-4">SC/ST</td>
                            <td className="py-3 px-4">₹50,000</td>
                            <td className="py-3 px-4">₹12,000</td>
                            <td className="py-3 px-4 font-medium">₹62,000</td>
                          </tr>
                        </>
                      )}
                    </tbody>
                  </table>
                </div>

                <p className="text-sm text-gray-500 mt-4 italic">
                  * Other charges include examination fee, library fee, development fee, etc.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="scholarship" className="mt-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-none bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-rose-100/30 via-transparent to-pink-100/30 rounded-lg" />
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center mb-4 border-b border-rose-200 pb-2">
                    <Sparkles className="h-5 w-5 text-rose-500 mr-2" />
                    <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-600 to-pink-700">Scholarship Details</h2>
                  </div>

                  <motion.div 
                    className="prose max-w-none mb-6"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    dangerouslySetInnerHTML={{
                      __html:
                        content.scholarship ||
                        "The National Institute of Fashion Designing offers various scholarships to meritorious students and those from economically weaker sections. These scholarships are designed to support talented students in pursuing their education without financial constraints.",
                    }}
                  />

                  {scholarshipFile && (
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button asChild className="bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-700 hover:to-pink-700 border-none shadow-md hover:shadow-lg transition-all">
                        <a href={`/api/files/${scholarshipFile._id}`} target="_blank" rel="noopener noreferrer">
                          <FileText className="h-4 w-4 mr-2" />
                          Download Scholarship Details
                        </a>
                      </Button>
                    </motion.div>
                  )}

                  <motion.div 
                    className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.5 }}
                  >
                    <div className="p-4 rounded-lg bg-gradient-to-br from-rose-50 to-white border border-rose-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <h3 className="text-lg font-semibold text-rose-700 mb-2">Merit Scholarships</h3>
                      <p className="text-gray-700">Awarded to students with exceptional academic performance and creative portfolio.</p>
                    </div>
                    <div className="p-4 rounded-lg bg-gradient-to-br from-pink-50 to-white border border-pink-100 shadow-sm hover:shadow-md transition-all duration-300">
                      <h3 className="text-lg font-semibold text-pink-700 mb-2">Financial Need Scholarships</h3>
                      <p className="text-gray-700">Available for students from economically weaker sections to support their education.</p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="cancellation" className="mt-6">
            <Card className="overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border-none bg-white bg-opacity-90 backdrop-filter backdrop-blur-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold mb-4 text-gray-800 border-b border-rose-200 pb-2">Rules for Cancellation</h2>

                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html:
                      content.cancellation ||
                      `
                  <p>The following rules apply for cancellation of admission and refund of fees:</p>
                  <ol>
                    <li>Cancellation before the commencement of classes: 90% of the tuition fee will be refunded.</li>
                    <li>Cancellation within 15 days of the commencement of classes: 80% of the tuition fee will be refunded.</li>
                    <li>Cancellation after 15 days but within 30 days of the commencement of classes: 50% of the tuition fee will be refunded.</li>
                    <li>Cancellation after 30 days of the commencement of classes: No refund will be provided.</li>
                  </ol>
                  <p>Note: Registration fee and other charges are non-refundable under any circumstances.</p>
                  <p>For cancellation, students must submit a written application to the admission office along with the original fee receipt.</p>
                `,
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
