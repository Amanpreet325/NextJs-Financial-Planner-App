'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingUp, Shield, BarChart3, Target, Star, Globe, Users, CreditCard, PieChart, Wallet, Building2, CheckCircle, Sparkles, DollarSign, PoundSterling, IndianRupee, ChevronDown, Play, Quote, Award, Clock, Calculator, LineChart, Brain, Zap, Eye, Phone, Mail, MessageCircle } from 'lucide-react'
import { motion } from "motion/react"
import { cn } from "@/lib/utils"
import { LampContainer } from "@/components/ui/lamp"
import { AnimatedText } from '@/components/animated-text'

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-xl border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-2xl flex items-center justify-center border border-white/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-2xl font-bold text-white tracking-tight">
              FINAN<span className="italic">CIX</span>
            </span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#services" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium">
              Services
            </Link>
            <Link href="#about" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium">
              About
            </Link>
            <Link href="#testimonials" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium">
              Reviews
            </Link>
            <Link href="#contact" className="text-gray-300 hover:text-white transition-all duration-300 text-sm font-medium">
              Contact
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link href="/login">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-white hover:text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              Log in
            </Button>
            </Link>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-white/20 to-white/10 text-white hover:from-white/30 hover:to-white/20 rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              Get Started
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}

function HeroSection() {
  return (
    <div className="relative min-h-[80vh] bg-black overflow-hidden">
      {/* Custom Lamp Effect positioned right after header */}
      <div className="absolute top-16 left-0 right-0 h-48 flex items-start justify-center pt-4">
        <div className="relative flex w-full items-center justify-center" style={{ marginTop: '23px' }}>
          {/* Left lamp beam */}
          <motion.div
            initial={{ opacity: 0.5, width: "15rem" }}
            whileInView={{ opacity: 1, width: "30rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute right-1/2 h-40 w-[30rem] bg-gradient-conic from-white via-transparent to-transparent [--conic-position:from_70deg_at_center_top]"
          >
            <div className="absolute w-full left-0 bg-black h-24 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
            <div className="absolute w-24 h-full left-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_right,white,transparent)]" />
          </motion.div>
          
          {/* Right lamp beam */}
          <motion.div
            initial={{ opacity: 0.5, width: "15rem" }}
            whileInView={{ opacity: 1, width: "30rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            style={{
              backgroundImage: `conic-gradient(var(--conic-position), var(--tw-gradient-stops))`,
            }}
            className="absolute left-1/2 h-40 w-[30rem] bg-gradient-conic from-transparent via-transparent to-white [--conic-position:from_290deg_at_center_top]"
          >
            <div className="absolute w-24 h-full right-0 bg-black bottom-0 z-20 [mask-image:linear-gradient(to_left,white,transparent)]" />
            <div className="absolute w-full right-0 bg-black h-24 bottom-0 z-20 [mask-image:linear-gradient(to_top,white,transparent)]" />
          </motion.div>
          
          {/* Central glow effects */}
          <div className="absolute h-32 w-full scale-x-150 bg-black blur-2xl"></div>
          <div className="absolute z-50 h-32 w-full bg-transparent opacity-10 backdrop-blur-md"></div>
          <div className="absolute z-50 h-24 w-[20rem] rounded-full bg-white opacity-30 blur-3xl"></div>
          
          {/* Animated central glow */}
          <motion.div
            initial={{ width: "6rem" }}
            whileInView={{ width: "12rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="absolute z-30 h-24 w-48 rounded-full bg-gray-300 opacity-40 blur-2xl"
          ></motion.div>
          
          {/* Lamp line */}
          <motion.div
            initial={{ width: "15rem" }}
            whileInView={{ width: "30rem" }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="absolute z-50 h-0.5 w-[30rem] bg-gray-300"
          ></motion.div>
          
          <div className="absolute z-40 h-32 w-full -translate-y-16 bg-black"></div>
        </div>
      </div>

      {/* Content positioned to start after the lamp */}
      <div className="relative z-50 flex flex-col items-center justify-start min-h-[60vh] px-5 pt-36">
        <motion.div
          initial={{ opacity: 0.5, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.3,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="text-center px-4 max-w-3xl mx-auto"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold leading-none tracking-tight mb-4">
              <AnimatedText text="Smart Finance for" delay={0.5} />
              <br />
              <span className="italic font-light">
                <AnimatedText text="wealth that grows." delay={1.1} />
              </span>
            </h1>
          
          <div className="mb-6 max-w-xl mx-auto">
            <p className="text-gray-300 text-base font-medium leading-relaxed">
              Track expenses, grow net worth, and invest with confidence—simple tools, premium guidance, elite results.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
            <Button 
              size="default" 
              className="bg-white/20 backdrop-blur-xl text-white hover:bg-white/30 rounded-lg px-6 py-2 text-sm font-medium transition-all duration-300 border border-gray-400/30 shadow-xl hover:shadow-gray-400/20"
            >
              Get Started
            </Button>
            
           

            <Button 
              variant="ghost" 
              size="default"
              className="bg-transparent text-gray-400 hover:bg-gray-800/30 hover:text-gray-300 rounded-lg px-6 py-2 text-sm transition-all duration-300"
            >
              Contact Us
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center space-x-4 text-gray-400 text-xs opacity-70">
            <span className="flex items-center gap-1">
              <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
              Fiduciary-first
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
              Transparent fees
            </span>
            <span className="text-slate-600">•</span>
            <span className="flex items-center gap-1">
              <div className="w-1 h-1 bg-cyan-400 rounded-full"></div>
              Secure by default
            </span>
          </div>
        </motion.div>
         

          </div>

        {/* Dashboard Preview */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{
            delay: 0.6,
            duration: 0.8,
            ease: "easeInOut",
          }}
          className="relative max-w-6xl mx-auto px-4 mt-8"
        >
          {/* Glass gradient border container */}
          <div className="relative p-[3px] rounded-2xl bg-gradient-to-r from-gray-400/30 via-white/40 to-gray-400/30">
            <div className=" backdrop-blur-xl rounded-2xl p-2">
              <img 
                src="/dash.png" 
                alt="Financial Dashboard"
                className="w-full h-auto rounded-xl shadow-2xl"
              />
            </div>
          </div>
          
          {/* Multiple glass glow effects */}
          <div className="absolute -inset-6 bg-gradient-to-r from-gray-400/20 via-white/30 to-gray-400/20 rounded-3xl blur-xl opacity-60 -z-10"></div>
          <div className="absolute -inset-3 bg-gradient-to-r from-gray-300/15 via-white/25 to-gray-300/15 rounded-2xl blur-lg opacity-80 -z-10"></div>
        </motion.div>
      </div>
    
  )
}

// Clients Section - Right below Hero
// function ClientsSection() {
//   const clients = [
//     { name: "Goldman Sachs", logo: "🏦" },
//     { name: "JPMorgan", logo: "💼" },
//     { name: "BlackRock", logo: "🏛️" },
//     { name: "Vanguard", logo: "📈" },
//     { name: "Morgan Stanley", logo: "🔷" },
//     { name: "UBS", logo: "🏢" }
//   ]

//   return (
//     <section className="py-16 bg-gradient-to-r from-gray-900 via-black to-gray-900 relative overflow-hidden">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]"></div>
      
//       <div className="max-w-7xl mx-auto px-6 relative z-10">
//         <div className="text-center mb-12">
//           <h3 className="text-2xl font-bold text-white mb-4">Trusted by Industry Leaders</h3>
//           <div className="w-16 h-0.5 bg-gradient-to-r from-white/40 via-white/80 to-white/40 mx-auto"></div>
//         </div>
        
//         <div className="grid grid-cols-2 md:grid-cols-6 gap-8 items-center">
//           {clients.map((client, index) => (
//             <div 
//               key={index}
//               className="text-center group animate-fade-in-up"
//               style={{ animationDelay: `${index * 100}ms` }}
//             >
//               <div className="bg-white/5 backdrop-blur-xl rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300 group-hover:scale-105">
//                 <div className="text-3xl mb-2">{client.logo}</div>
//                 <div className="text-white/80 text-sm font-medium">{client.name}</div>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   )
// }

// About Section with Text Revealing Animations
function AboutSection() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 }
    )
    
    const section = document.getElementById('about')
    if (section) observer.observe(section)
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <section id="about" className="py-24 relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-gray-100" style={{ marginTop: '-71px' }}>
      {/* Gradient Separator */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 mb-6 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            About Our <span className="italic font-light text-gray-600">Vision</span>
          </h2>
          <div className={`w-24 h-1 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 mx-auto mb-8 rounded-full transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-50'}`}></div>
        </div>
        
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className={`bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-xl transition-all duration-1000 delay-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                We democratize premium financial advisory services through cutting-edge 
                technology and personalized strategies for exceptional wealth growth.
              </p>
            </div>
            
            <div className={`bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-xl transition-all duration-1000 delay-700 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Future Vision</h3>
              <p className="text-gray-700 leading-relaxed">
                Building next-generation financial tools that adapt to your life and 
                grow with your ambitions through intelligent automation.
              </p>
            </div>
          </div>
          
          <div className="space-y-6">
            {/* Enhanced Counter Design */}
            <div className={`bg-gradient-to-br from-black/5 to-gray-900/5 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-2xl transition-all duration-1000 delay-900 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="grid grid-cols-2 gap-8">
                <div className="text-center group">
                  <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">₹12Cr+</div>
                    <div className="text-gray-600 text-sm font-medium">Wealth Managed</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">98%</div>
                    <div className="text-gray-600 text-sm font-medium">Client Satisfaction</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">24/7</div>
                    <div className="text-gray-600 text-sm font-medium">Support Available</div>
                  </div>
                </div>
                <div className="text-center group">
                  <div className="bg-white/40 backdrop-blur-sm rounded-2xl p-6 border border-white/30 hover:scale-105 transition-transform duration-300">
                    <div className="text-4xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-2">500+</div>
                    <div className="text-gray-600 text-sm font-medium">Happy Clients</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`text-center transition-all duration-1000 delay-1100 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black rounded-2xl px-8 py-4 text-lg font-medium transition-all duration-300 shadow-xl"
              >
                Learn More About Us
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Bottom Gradient Separator */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </section>
  )
}

// Services Section with Branded Gradient Design
function ServicesSection() {
  const services = [
    {
      icon: <Calculator className="w-8 h-8" />,
      title: "Expense Tracker",
      description: "Advanced expense tracking with intelligent categorization and real-time insights."
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Net Worth Analysis",
      description: "Comprehensive wealth tracking with asset allocation and growth projections."
    },
    {
      icon: <PieChart className="w-8 h-8" />,
      title: "Financial Goals",
      description: "Strategic goal planning with personalized roadmaps and milestone tracking."
    },
    {
      icon: <LineChart className="w-8 h-8" />,
      title: "Investment Planning",
      description: "Professional investment strategies with risk assessment and optimization."
    },
    {
      icon: <Brain className="w-8 h-8" />,
      title: "AI-Powered Insights",
      description: "Machine learning algorithms for personalized financial recommendations."
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Risk Management",
      description: "Comprehensive risk analysis and protection strategies for your wealth."
    }
  ]
  
  return (
    <section id="services" className="py-24 bg-gradient-to-br from-gray-900 via-black to-gray-800 relative overflow-hidden">
      {/* Branded Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.02),transparent_50%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.01),transparent_50%)]"></div>
      
      {/* Gradient Footer-like Design */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our <span className="italic font-light text-gray-300">Services</span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Professional financial solutions designed for the modern investor
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-white/20 via-white/40 to-white/20 mx-auto mt-8 rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div 
              key={index}
              className="group relative animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-3xl p-8 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-white/20">
                <div className="text-white mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>
                <Button 
                  variant="ghost" 
                  size="sm"
                  className="text-white border-white/20 hover:bg-white/10 rounded-xl transition-all duration-300"
                >
                  Learn More
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
              
              {/* Subtle shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/2 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// Roadmap Section - Client Journey
function RoadmapSection() {
  const steps = [
    {
      number: "01",
      title: "Client Registration",
      description: "Quick and secure onboarding process with KYC verification",
      icon: <Users className="w-8 h-8" />
    },
    {
      number: "02", 
      title: "Financial Assessment",
      description: "Detailed analysis of your current financial situation and goals",
      icon: <BarChart3 className="w-8 h-8" />
    },
    {
      number: "03",
      title: "Strategy Development",
      description: "Personalized financial strategy creation based on your profile",
      icon: <Target className="w-8 h-8" />
    },
    {
      number: "04",
      title: "Dashboard Access",
      description: "Get your ready-made dashboard with real-time insights and tracking",
      icon: <PieChart className="w-8 h-8" />
    }
  ]

  return (
    <section className="py-24 bg-gradient-to-br from-white via-gray-50 to-white relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Your Journey to <span className="italic font-light text-gray-600">Financial Success</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            From registration to dashboard - a seamless experience designed for your success
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 mx-auto mt-8 rounded-full"></div>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-300 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid lg:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, index) => (
              <div 
                key={index}
                className="group text-center animate-fade-in-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105 relative">
                  {/* Step Number */}
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-lg">
                    {step.number}
                  </div>
                  
                  {/* Icon */}
                  <div className="text-gray-700 mb-6 mt-4 group-hover:scale-110 transition-transform duration-300">
                    {step.icon}
                  </div>
                  
                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="text-center mt-16">
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-gray-800 to-gray-900 text-white hover:from-gray-900 hover:to-black rounded-2xl px-12 py-4 text-lg font-medium transition-all duration-300 shadow-xl"
          >
            Start Your Journey Today
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </section>
  )
}
function TestimonialsSection() {
  const testimonials = [
    {
      name: "Rajesh Kumar",
      role: "Tech Entrepreneur",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "The financial planning strategies have helped me grow my portfolio by 300% in just 2 years. Exceptional service and expertise!"
    },
    {
      name: "Priya Sharma",
      role: "Investment Banker",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612c9e2?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Professional, insightful, and results-driven. The AI-powered insights have revolutionized how I approach my investments."
    },
    {
      name: "Michael Chen",
      role: "Fortune 500 Executive",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      rating: 5,
      text: "Outstanding financial advisory services. The premium platform and personalized approach exceeded all my expectations."
    }
  ]
  
  return (
    <section id="testimonials" className="py-24 bg-gradient-to-br from-gray-100 via-white to-gray-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Client <span className="italic font-light text-gray-600">Success Stories</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Hear from our satisfied clients who have achieved their financial goals
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-gray-400 via-gray-600 to-gray-400 mx-auto mt-8 rounded-full"></div>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group animate-fade-in-up"
              style={{ animationDelay: `${index * 200}ms` }}
            >
              <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/40 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="flex items-center mb-6">
                  <img 
                    src={testimonial.image} 
                    alt={testimonial.name}
                    className="w-16 h-16 rounded-full object-cover mr-4 border-2 border-white shadow-lg"
                  />
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                
                <Quote className="w-8 h-8 text-gray-300 mb-4" />
                <p className="text-gray-700 leading-relaxed italic">
                  "{testimonial.text}"
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </section>
  )
}

// Premium CTA Banner Section
function CTABannerSection() {
  return (
    <section className="py-24 bg-gradient-to-r from-black via-gray-900 to-black relative overflow-hidden">
      {/* Shiny Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-white/5"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.1),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05),transparent_70%)]"></div>
      
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        <div className="bg-white/10 backdrop-blur-3xl rounded-3xl p-16 border border-white/20 shadow-2xl">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
            Let's Plan Your
            <br />
            <span className="italic font-light bg-gradient-to-r from-white via-gray-200 to-white bg-clip-text text-transparent">
              Future Together
            </span>
          </h2>
          
          <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed">
            Ready to transform your financial future? Join hundreds of successful investors 
            who trust us with their wealth management and financial planning.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-white/20 to-white/10 text-white hover:from-white/30 hover:to-white/20 rounded-2xl px-12 py-6 text-xl font-medium transition-all duration-300 backdrop-blur-xl border border-white/20 shadow-2xl hover:shadow-white/10"
            >
              Start Your Journey
              <Sparkles className="w-6 h-6 ml-2" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="bg-black/30 backdrop-blur-xl border-white/30 text-white hover:bg-black/50 rounded-2xl px-12 py-6 text-xl transition-all duration-300"
            >
              Contact Me
              <MessageCircle className="w-6 h-6 ml-2" />
            </Button>
          </div>
          
          <div className="mt-12 flex items-center justify-center space-x-8 text-gray-400">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Free Consultation</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>No Hidden Fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span>Guaranteed Results</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-black border-t border-white/10 py-20 relative overflow-hidden">
      {/* Premium Glass Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.05),transparent_50%)]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="mb-8 md:mb-0">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-white/20 to-white/5 backdrop-blur-xl rounded-3xl flex items-center justify-center border border-white/20">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-3xl font-bold text-white tracking-tight">
                FINAN<span className="italic">CIX</span>
              </span>
            </div>
            <p className="text-gray-400 max-w-md leading-relaxed">
              Transforming financial futures through premium advisory services, 
              cutting-edge technology, and personalized investment strategies.
            </p>
            <div className="flex items-center space-x-4 mt-6">
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4" />
                <span className="text-sm">contact@financix.com</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Phone className="w-4 h-4" />
                <span className="text-sm">+91-98765-43210</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-300 hover:text-white bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl hover:bg-white/20 transition-all duration-300"
            >
              Personal
            </Button>
            <Button 
              size="sm" 
              className="bg-gradient-to-r from-white/20 to-white/10 hover:from-white/30 hover:to-white/20 text-white rounded-xl px-6 shadow-lg hover:shadow-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
            >
              Business
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
          <div>
            <h4 className="font-semibold text-white mb-6">Services</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors text-sm">Expense Tracking</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-sm">Net Worth Analysis</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-sm">Investment Planning</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-sm">Financial Goals</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6">Company</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors text-sm">About Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-sm">Our Team</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-sm">Careers</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-sm">Press</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6">Support</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors text-sm">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-sm">Security</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-sm">Contact</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-sm">Privacy Policy</a></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-white mb-6">Connect</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors text-sm">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-sm">Twitter</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-sm">Instagram</a></li>
              <li><a href="#" className="hover:text-white transition-colors text-sm">YouTube</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-gray-400 text-sm">
            &copy; 2025 Financix. All rights reserved. | Premium financial planning and wealth management services.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSection />
      {/* <ClientsSection /> */}
      <AboutSection />
      <ServicesSection />
      <RoadmapSection />
      <TestimonialsSection />
      <CTABannerSection />
      <Footer />
    </main>
  )
}
