"use client"

import React, { useEffect, useState, useRef } from "react"
import { motion } from "motion/react"
import { LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface NavItem {
  name: string
  url: string
  icon: LucideIcon
}

interface NavBarProps {
  items: NavItem[]
  className?: string
}

export function NavBar({ items, className }: NavBarProps) {
  const [activeTab, setActiveTab] = useState(items[0].name)
  const [isMobile, setIsMobile] = useState(false)
  const isScrollingRef = useRef(false)
  const scrollTimeoutRef = useRef<number | null>(null)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Sync active tab with scroll
  useEffect(() => {
    let ticking = false

    const handleScroll = () => {
      if (isScrollingRef.current) return

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollPos = window.scrollY + 150 // Slightly larger offset for better sync

          for (const item of items) {
            const sectionId = item.url.replace('#', '')
            const element = document.getElementById(sectionId)
            if (element) {
              const top = element.offsetTop
              const height = element.offsetHeight
              if (scrollPos >= top && scrollPos < top + height) {
                setActiveTab(item.name)
              }
            }
          }
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [items])

  const handleNavClick = (item: NavItem) => {
    isScrollingRef.current = true
    setActiveTab(item.name)

    const sectionId = item.url.replace('#', '')
    const element = document.getElementById(sectionId)
    
    if (element) {
      const rect = element.getBoundingClientRect()
      const absoluteTop = rect.top + window.pageYOffset
      
      if (sectionId === 'contact') {
        const elementHeight = rect.height
        const windowHeight = window.innerHeight
        const topOffset = absoluteTop - (windowHeight / 2) + (elementHeight / 2)
        
        window.scrollTo({
          top: topOffset,
          behavior: 'smooth'
        })
      } else {
        window.scrollTo({
          top: absoluteTop - 80,
          behavior: 'smooth'
        })
      }
    }

    // Reset the manual scroll flag after the animation is likely finished
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current)
    scrollTimeoutRef.current = window.setTimeout(() => {
      isScrollingRef.current = false
    }, 1000) // 1s is usually enough for smooth scroll to finish
  }

  return (
    <nav
      className={cn(
        "fixed top-6 right-6 z-[60]",
        className,
      )}
      aria-label="Secondary Navigation"
    >
      <div className="flex items-center gap-3 bg-brand-card/20 border border-white/10 backdrop-blur-lg py-1 px-1 rounded-full shadow-lg">
        {items.map((item) => {
          const Icon = item.icon
          const isActive = activeTab === item.name

          return (
            <motion.a
              key={item.name}
              href={item.url}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.preventDefault()
                handleNavClick(item)
              }}
              className={cn(
                "relative cursor-pointer text-[10px] uppercase tracking-widest font-semibold px-4 py-2 rounded-full transition-colors",
                "text-white/60 hover:text-white",
                isActive && "text-white",
              )}
              aria-label={`Navigate to ${item.name}`}
            >
              <span className="hidden md:inline">{item.name}</span>
              <span className="md:hidden">
                <Icon size={16} strokeWidth={2.5} aria-hidden="true" />
              </span>
              {isActive && (
                <motion.div
                  layoutId="lamp"
                  className="absolute inset-0 w-full bg-white/5 rounded-full -z-10"
                  initial={false}
                  transition={{
                    type: "spring",
                    stiffness: 300,
                    damping: 30,
                  }}
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-8 h-1 bg-white rounded-t-full">
                    <div className="absolute w-12 h-6 bg-white/20 rounded-full blur-md -top-2 -left-2" />
                    <div className="absolute w-8 h-6 bg-white/20 rounded-full blur-md -top-1" />
                    <div className="absolute w-4 h-4 bg-white/20 rounded-full blur-sm top-0 left-2" />
                  </div>
                </motion.div>
              )}
            </motion.a>
          )
        })}
      </div>
    </nav>
  )
}
