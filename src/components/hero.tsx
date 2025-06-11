"use client"

import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import {  Rocket,  Sparkles } from "lucide-react"
import { FloatingPaper } from "@/components/floating-paper"
import { RoboAnimation } from "./robo-animation"
import { signIn } from "next-auth/react"

export default function Hero() {

    const handleSignClick = () => {
        signIn("google");
    };

  return (
    <div className="relative min-h-[calc(100vh-76px)] flex items-center">
      {/* Floating papers background */}
      <div className="absolute inset-0 overflow-hidden">
        <FloatingPaper count={6} />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-6">
            Unlock the Power of Your 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Bookmarks with
                AI 
              </span>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-gray-400 text-xl mb-8 max-w-2xl mx-auto"
          >
           Save your bookmarks with AI-powered organization and search. Ask anything, and instantly find the most relevant insights from your saved content.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
           
            <Button onClick={handleSignClick} size="lg" className="bg-blue-600 hover:bg-blue-700 text-white px-8">
            <Rocket className="mr-2 h-5 w-5" />
            Get Started 
            </Button>
           
            <Button onClick={handleSignClick} size="lg" variant="outline" className="text-white border-blue-500 hover:bg-blue-500/20">
            <Sparkles className="mr-2 h-5 w-5" />
            Try AI Search
            </Button>

          </motion.div>
        </div>
      </div>

      {/* Animated robot */}
      <div className="absolute bottom-0 right-0 w-96 h-96">
        <RoboAnimation />
      </div>
    </div>
  )
}

