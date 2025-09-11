'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  Calculator,
  Menu,
  X,
  Search,
  ChevronDown,
  DollarSign,
  Heart,
  Clock,
  Wrench,
  Globe,
  Plus,
  Percent,
  Triangle,
  GraduationCap,
  BarChart3,
  History,
  FileText
} from 'lucide-react'

interface NavItem {
  name: string
  href: string
  icon: React.ReactNode
  description: string
  subItems?: NavItem[]
}

const navigation: NavItem[] = [
  {
    name: 'Financial',
    href: '/',
    icon: null,
    description: 'Loans, mortgages, investments',
    subItems: [
      { name: 'Mortgage', href: '/mortgage-calculator', icon: null, description: 'Calculate mortgage payments' },
      { name: 'Loan', href: '/loan-calculator', icon: null, description: 'Calculate loan payments' },
      { name: 'Auto Loan', href: '/auto-loan-calculator', icon: null, description: 'Calculate car loan payments' },
      { name: 'Investment', href: '/investment-calculator', icon: null, description: 'Investment returns' },
      { name: 'Compound Interest', href: '/compound-interest-calculator', icon: null, description: 'Compound interest calculator' },
      { name: 'SIP Calculator', href: '/sip-calculator', icon: null, description: 'Calculate SIP returns' },
      { name: 'Invoice Maker', href: '/invoice-maker', icon: null, description: 'Create professional invoices' }
    ]
  },
  {
    name: 'Math & Science',
    href: '/scientific-calculator',
    icon: null,
    description: 'Scientific and mathematical tools',
    subItems: [
      { name: 'Scientific', href: '/scientific-calculator', icon: null, description: 'Advanced scientific functions' },
      { name: 'Fraction', href: '/fraction-calculator', icon: null, description: 'Fraction arithmetic' },
      { name: 'Percentage', href: '/percentage-calculator', icon: null, description: 'Percentage calculations' },
      { name: 'Area', href: '/area-calculator', icon: null, description: 'Area calculations' },
      { name: 'Volume', href: '/volume-calculator', icon: null, description: 'Volume calculations' }
    ]
  },
  {
    name: 'Health & Fitness',
    href: '/bmi-calculator',
    icon: null,
    description: 'BMI, calories, body metrics',
    subItems: [
      { name: 'BMI', href: '/bmi-calculator', icon: null, description: 'Body Mass Index' },
      { name: 'Calorie', href: '/calorie-calculator', icon: null, description: 'Daily calorie needs' },
      { name: 'Body Fat', href: '/body-fat-calculator', icon: null, description: 'Body fat percentage' },
      { name: 'BMR', href: '/bmr-calculator', icon: null, description: 'Basal Metabolic Rate' },
      { name: 'Ideal Weight', href: '/calculators/ideal-weight', icon: null, description: 'Ideal body weight' }
    ]
  },
  {
    name: 'Conversions',
    href: '/calculators/length',
    icon: null,
    description: 'Unit and currency converters',
    subItems: [
      { name: 'Length', href: '/calculators/length', icon: null, description: 'Length unit converter' },
      { name: 'Weight', href: '/calculators/weight', icon: null, description: 'Weight unit converter' },
      { name: 'Temperature', href: '/calculators/temperature', icon: null, description: 'Temperature converter' },
      { name: 'Currency', href: '/calculators/currency', icon: null, description: 'Currency converter' },
      { name: 'Area', href: '/area-calculator', icon: null, description: 'Area unit converter' }
    ]
  },
  {
    name: 'Time & Date',
    href: '/age-calculator',
    icon: null,
    description: 'Time calculations and dates',
    subItems: [
      { name: 'Age', href: '/age-calculator', icon: null, description: 'Age calculator' },
      { name: 'Date', href: '/date-calculator', icon: null, description: 'Date calculations' },
      { name: 'Time', href: '/time-calculator', icon: null, description: 'Time calculations' },
      { name: 'Time Duration', href: '/time-duration-calculator', icon: null, description: 'Duration between dates' },
      { name: 'Day Counter', href: '/day-counter-calculator', icon: null, description: 'Count days between dates' }
    ]
  }
]

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/search-calculator?q=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null)

  const handleMouseEnter = (name: string) => {
    // Clear any existing timeout
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
    setActiveDropdown(name)
  }

  const handleMouseLeave = () => {
    // Set a small delay before closing to allow moving to dropdown content
    const timeout = setTimeout(() => {
      setActiveDropdown(null)
    }, 150) // 150ms delay for smooth transition
    setHoverTimeout(timeout)
  }

  const closeAllDropdowns = () => {
    setActiveDropdown(null)
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
    if (hoverTimeout) {
      clearTimeout(hoverTimeout)
      setHoverTimeout(null)
    }
  }

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout)
      }
    }
  }, [hoverTimeout])

  return (
    <>
      {/* Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-200' 
          : 'bg-white/90 backdrop-blur-sm'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 lg:h-15 xl:h-16">
            
                         {/* Logo */}
             <div className="flex items-center">
               <Link href="/" className="flex items-center space-x-2 group" onClick={closeAllDropdowns}>
                 <div className="relative">
                   <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                     <Calculator className="w-4 h-4 lg:w-5 lg:h-5 text-white" />
                   </div>
                   <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                 </div>
                                 <div className="hidden sm:block">
                  <h1 className="text-base lg:text-lg xl:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent whitespace-nowrap">
                    Online Calculator.live
                  </h1>
                  <p className="text-xs text-gray-500 hidden xl:block">Free Online Calculators</p>
                </div>
               </Link>
             </div>

                                         {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
                  {navigation.map((item) => (
                    <div 
                      key={item.name} 
                      className="relative group"
                      onMouseEnter={() => handleMouseEnter(item.name)}
                      onMouseLeave={handleMouseLeave}
                    >
                      <button
                        className="flex items-center space-x-1.5 px-2.5 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 text-xs font-medium header-nav-item"
                      >
                        <span className="header-nav-text">{item.name}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0 ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      </button>

                                     {/* Dropdown Menu */}
                   {activeDropdown === item.name && (
                     <div 
                       className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-3 z-50"
                       onMouseEnter={() => handleMouseEnter(item.name)}
                       onMouseLeave={handleMouseLeave}
                     >
                       <div className="px-3 pb-2 border-b border-gray-100">
                         <h3 className="text-sm font-semibold text-gray-900">{item.name}</h3>
                         <p className="text-xs text-gray-500">{item.description}</p>
                       </div>
                       <div className="grid grid-cols-1 gap-0.5 p-1">
                         {item.subItems?.map((subItem) => (
                           <Link
                             key={subItem.name}
                             href={subItem.href}
                             className="flex items-center space-x-2.5 p-2.5 rounded-md hover:bg-gray-50 transition-colors duration-150"
                             onClick={closeAllDropdowns}
                           >
                             <div className="flex-1 min-w-0">
                               <div className="text-sm font-medium text-gray-900">{subItem.name}</div>
                               <div className="text-xs text-gray-500 truncate">{subItem.description}</div>
                             </div>
                           </Link>
                         ))}
                       </div>
                     </div>
                   )}
                </div>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center space-x-3">
              
              {/* Invoice Maker Button */}
              <Link
                href="/invoice-maker"
                className="hidden sm:flex items-center space-x-2 px-3 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={closeAllDropdowns}
              >
                <FileText className="w-4 h-4" />
                <span className="text-sm font-medium">Invoice Maker</span>
                <span className="px-1.5 py-0.5 bg-white/20 text-xs rounded-full">NEW</span>
              </Link>

              {/* Search Button */}
              <button
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                aria-label="Search calculators"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>

                       {/* Search Bar */}
           {isSearchOpen && (
             <div className="pb-3">
               <form onSubmit={handleSearch} className="relative">
                 <input
                   type="text"
                   placeholder="Search for calculators..."
                   value={searchQuery}
                   onChange={(e) => setSearchQuery(e.target.value)}
                   className="w-full px-3 py-2.5 pl-10 text-sm text-gray-900 bg-gray-50 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 focus:outline-none transition-all duration-200"
                   autoFocus
                 />
                 <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                 <button
                   type="submit"
                   className="absolute right-1.5 top-1/2 transform -translate-y-1/2 px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200 text-xs font-medium"
                 >
                   Search
                 </button>
               </form>
             </div>
           )}
        </div>

                 {/* Mobile Menu */}
         {isMobileMenuOpen && (
           <div className="lg:hidden bg-white border-t border-gray-200 shadow-lg">
             <div className="px-4 py-4 space-y-2">
               {/* Mobile Invoice Maker Button */}
               <Link
                 href="/invoice-maker"
                 className="flex items-center space-x-2 p-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-md"
                 onClick={closeAllDropdowns}
               >
                 <FileText className="w-5 h-5" />
                 <span className="font-medium">Invoice Maker</span>
                 <span className="px-2 py-0.5 bg-white/20 text-xs rounded-full">NEW</span>
               </Link>
               
               {navigation.map((item) => (
                 <div key={item.name}>
                   <button
                     onClick={() => setActiveDropdown(activeDropdown === item.name ? null : item.name)}
                     className="flex items-center justify-between w-full p-2.5 text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                   >
                     <div className="flex items-center space-x-2.5">
                       <span className="text-sm font-medium">{item.name}</span>
                     </div>
                     <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${
                       activeDropdown === item.name ? 'rotate-180' : ''
                     }`} />
                   </button>
                   
                   {activeDropdown === item.name && (
                     <div className="ml-6 mt-1 space-y-1">
                       {item.subItems?.map((subItem) => (
                         <Link
                           key={subItem.name}
                           href={subItem.href}
                           className="flex items-center space-x-2.5 p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                           onClick={closeAllDropdowns}
                         >
                           <div className="text-sm">{subItem.name}</div>
                         </Link>
                       ))}
                     </div>
                   )}
                 </div>
               ))}
             </div>
           </div>
         )}
      </header>

      {/* Spacer to prevent content from hiding under fixed header */}
      <div className="h-14 lg:h-15 xl:h-16"></div>
    </>
  )
}
