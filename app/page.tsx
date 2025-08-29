
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowRight, TrendingUp, Shield, BarChart3, Target, Star } from 'lucide-react'

function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-white/10 backdrop-blur-sm rounded-lg flex items-center justify-center border border-white/20">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-light text-white tracking-wide">FINANCIX</span>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="#services" className="text-white/80 hover:text-white transition-colors text-sm font-light">
              Services
            </Link>
            <Link href="#about" className="text-white/80 hover:text-white transition-colors text-sm font-light">
              About
            </Link>
            <Link href="#contact" className="text-white/80 hover:text-white transition-colors text-sm font-light">
              Contact
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Button 
              asChild 
              className="bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-xl rounded-xl px-6 py-2 text-sm font-medium transition-all duration-300 hover:scale-105"
            >
              <Link href="/login">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>
    </header>
  )
}

function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0"
      >
        <source src="/bg-hero.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Dark overlay for better text readability */}
      <div className="absolute inset-0 bg-black/60 z-10" />
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/40 z-20" />
      
      <div className="relative max-w-6xl mx-auto text-center z-40">
        <div className="space-y-12">
          {/* Main Heading */}
          <div className="space-y-7">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-medium text-white leading-[0.9] tracking-tight">
              Smart Finance for
              <br />
              <span className="font-light italic text-white/90">
                wealth that grows.
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-white/80 max-w-2xl mx-auto leading-relaxed font-light">
              Expert financial guidance and investment strategies designed to secure your 
              future and maximize your wealth potential.
            </p>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              size="lg" 
              asChild 
              className="bg-white/15 hover:bg-white/25 text-white border border-white/20 backdrop-blur-xl rounded-2xl px-8 py-4 text-base font-medium shadow-2xl hover:shadow-white/10 transition-all duration-500 hover:scale-105"
            >
              <Link href="/login">
                Start Investing
              </Link>
            </Button>
            <Button 
              size="lg" 
              variant="ghost" 
              className="text-white hover:bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl px-8 py-4 text-base font-medium shadow-2xl hover:shadow-white/5 transition-all duration-500 hover:scale-105"
            >
              Learn More
            </Button>
          </div>
          
          {/* Trust Indicators */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 pt-8">
            <div className="flex items-center space-x-2 text-white/70 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span>15% avg returns</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70 text-sm">
              <Shield className="w-4 h-4 text-blue-400" />
              <span>SEC regulated</span>
            </div>
            <div className="flex items-center space-x-2 text-white/70 text-sm">
              <Star className="w-4 h-4 text-yellow-400" />
              <span>No hidden fees</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function FeaturesSection() {
  const features = [
    {
      icon: BarChart3,
      title: "Smart Analytics",
      description: "Get insights into your spending patterns and financial health with advanced analytics and personalized recommendations."
    },
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "Your financial data is protected with enterprise-grade encryption and security measures you can trust."
    },
    {
      icon: Target,
      title: "Goal Tracking",
      description: "Set and track financial goals with intelligent progress monitoring and actionable steps to achieve them."
    },
    {
      icon: TrendingUp,
      title: "Investment Management",
      description: "Monitor your portfolio performance and make informed investment decisions with real-time market data."
    }
  ]

  return (
    <section id="features" className="py-24 bg-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Everything You Need to Succeed
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            Powerful features designed to simplify your financial management and accelerate your wealth building journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="bg-slate-900/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6 hover:border-slate-600 transition-colors">
              <div className="w-12 h-12 bg-blue-600/20 rounded-lg flex items-center justify-center mb-4">
                <feature.icon className="w-6 h-6 text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function TestimonialsSection() {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Small Business Owner",
      content: "Financix helped me understand my cash flow patterns and plan for business growth. The insights are incredibly valuable.",
      rating: 5
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      content: "Finally, a financial planning tool that actually makes sense. The interface is clean and the features are powerful.",
      rating: 5
    },
    {
      name: "Emily Rodriguez",
      role: "Marketing Manager",
      content: "I've tried many financial apps, but Financix is the first one that helped me actually achieve my savings goals.",
      rating: 5
    }
  ]

  return (
    <section className="py-24 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Trusted by Thousands
          </h2>
          <p className="text-xl text-slate-300 max-w-2xl mx-auto">
            See what our users have to say about their financial transformation journey.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-xl p-6">
              <div className="flex items-center space-x-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                ))}
              </div>
              <p className="text-slate-300 mb-4">"{testimonial.content}"</p>
              <div>
                <div className="font-semibold text-white">{testimonial.name}</div>
                <div className="text-sm text-slate-400">{testimonial.role}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function CTASection() {
  return (
    <section className="py-24 bg-gradient-to-r from-blue-600 to-purple-600">
      <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div className="space-y-8">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl text-blue-100">
            Join thousands of users who have already taken control of their finances with Financix.
          </p>
          <Button size="lg" asChild className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 text-lg">
            <Link href="/login" className="flex items-center space-x-2">
              <span>Get Started for Free</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-slate-900 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Financix</span>
            </div>
            <p className="text-slate-400">
              Smart financial planning made simple for everyone.
            </p>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <div className="space-y-2">
              <Link href="#features" className="text-slate-400 hover:text-white block transition-colors">Features</Link>
              <Link href="#pricing" className="text-slate-400 hover:text-white block transition-colors">Pricing</Link>
              <Link href="/login" className="text-slate-400 hover:text-white block transition-colors">Dashboard</Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <div className="space-y-2">
              <Link href="#about" className="text-slate-400 hover:text-white block transition-colors">About</Link>
              <Link href="#" className="text-slate-400 hover:text-white block transition-colors">Contact</Link>
              <Link href="#" className="text-slate-400 hover:text-white block transition-colors">Privacy</Link>
            </div>
          </div>
          
          <div>
            <h3 className="text-white font-semibold mb-4">Support</h3>
            <div className="space-y-2">
              <Link href="#" className="text-slate-400 hover:text-white block transition-colors">Help Center</Link>
              <Link href="#" className="text-slate-400 hover:text-white block transition-colors">Documentation</Link>
              <Link href="#" className="text-slate-400 hover:text-white block transition-colors">Status</Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-400">
          <p>&copy; 2024 Financix. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <TestimonialsSection />
      <CTASection />
      <Footer />
    </div>
  )
}
