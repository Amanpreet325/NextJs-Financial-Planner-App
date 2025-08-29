"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <motion.header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        "backdrop-blur-md border-b border-white/[0.08]",
        isScrolled ? "bg-slate-900/20" : "bg-slate-900/10",
      )}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.21, 0.47, 0.32, 0.98] }}
    >
      <div className="container-custom">
        <div className="flex items-center justify-between h-12 lg:h-16 relative">
          {/* Logo */}
          <motion.div className="flex-shrink-0" whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
            <a
              href="#"
              className={cn(
                "text-xl lg:text-2xl font-bold tracking-tight transition-colors",
                "text-white hover:text-slate-200",
              )}
              aria-label="KATACHI Finance Home"
            >
              KATACHI
            </a>
          </motion.div>

          <nav className="hidden md:flex items-center space-x-8">
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="flex items-center gap-1 text-white/90 hover:text-white transition-colors text-sm font-medium"
              >
                Services
                <ChevronDown className="w-4 h-4" />
              </button>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full left-0 mt-2 w-48 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-lg p-2"
                >
                  <a
                    href="#"
                    className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded"
                  >
                    Investment Planning
                  </a>
                  <a
                    href="#"
                    className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded"
                  >
                    Wealth Management
                  </a>
                  <a
                    href="#"
                    className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded"
                  >
                    Portfolio Analysis
                  </a>
                  <a
                    href="#"
                    className="block px-3 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 rounded"
                  >
                    Risk Assessment
                  </a>
                </motion.div>
              )}
            </div>
            <a href="#" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
              About
            </a>
            <a href="#" className="text-white/90 hover:text-white transition-colors text-sm font-medium">
              Contact
            </a>
          </nav>

          <motion.button
            className="hidden md:block px-4 py-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-lg text-white text-sm font-medium hover:bg-white/20 transition-all"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </div>
      </div>
    </motion.header>
  )
}
