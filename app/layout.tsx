import "../lib/react-polyfill" // Import the polyfill first
import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { Providers } from "./providers"
import Footer from "@/components/layout/footer"
import PageLayout from "@/components/layout/page-layout"

// Using a more modern font combination
const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "National Institute of Fashion Designing, Kasar Sirsi",
  description: "Affiliated to S.N.D.T.W University, Mumbai - Premier fashion design education",
  keywords: "fashion design, institute, education, design courses, SNDTW University, fashion career, design school",
  generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* Additional modern fonts can be added here */}
      </head>
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="flex min-h-screen flex-col">
            <PageLayout>
              <main className="flex-1">{children}</main>
            </PageLayout>
            <Footer />
          </div>
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}