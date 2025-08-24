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
  History
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
    icon: <DollarSign className="w-5 h-5" />,
    description: 'Loans, mortgages, investments',
    subItems: [
      { name: 'Mortgage', href: '/mortgage-calculator', icon: <DollarSign className="w-4 h-4" />, description: 'Calculate mortgage payments' },
      { name: 'Loan', href: '/loan-calculator', icon: <DollarSign className="w-4 h-4" />, description: 'Calculate loan payments' },
      { name: 'Auto Loan', href: '/auto-loan-calculator', icon: <DollarSign className="w-4 h-4" />, description: 'Calculate car loan payments' },
      { name: 'Investment', href: '/investment-calculator', icon: <DollarSign className="w-4 h-4" />, description: 'Investment returns' },
      { name: 'Compound Interest', href: '/compound-interest-calculator', icon: <DollarSign className="w-4 h-4" />, description: 'Compound interest calculator' },
      { name: 'Simple Interest', href: '/simple-interest-calculator', icon: <DollarSign className="w-4 h-4" />, description: 'Simple interest calculator' },
      { name: 'Retirement', href: '/retirement-calculator', icon: <DollarSign className="w-4 h-4" />, description: 'Retirement planning' },
      { name: 'Salary', href: '/calculators/salary', icon: <DollarSign className="w-4 h-4" />, description: 'Take-home pay calculator' },
      { name: 'Income Tax', href: '/income-tax-calculator', icon: <DollarSign className="w-4 h-4" />, description: 'Tax liability calculator' },
      { name: 'Discount', href: '/discount-calculator', icon: <DollarSign className="w-4 h-4" />, description: 'Discount calculator' },
      { name: 'Tip', href: '/tip-calculator', icon: <DollarSign className="w-4 h-4" />, description: 'Tip calculator' }
    ]
  },
  {
    name: 'Math & Science',
    href: '/scientific-calculator',
    icon: <Calculator className="w-5 h-5" />,
    description: 'Scientific and mathematical tools',
    subItems: [
      { name: 'Scientific', href: '/scientific-calculator', icon: <Calculator className="w-4 h-4" />, description: 'Advanced scientific functions' },
      { name: 'Fraction', href: '/fraction-calculator', icon: <Plus className="w-4 h-4" />, description: 'Fraction arithmetic' },
      { name: 'Percentage', href: '/percentage-calculator', icon: <Percent className="w-4 h-4" />, description: 'Percentage calculations' },
      { name: 'Percentage Grade', href: '/percentage-grade-calculator', icon: <Percent className="w-4 h-4" />, description: 'Convert percentages to grades' },
      { name: 'Triangle', href: '/triangle-calculator', icon: <Triangle className="w-4 h-4" />, description: 'Triangle properties' },
      { name: 'Area', href: '/area-calculator', icon: <Calculator className="w-4 h-4" />, description: 'Area calculations' },
      { name: 'Volume', href: '/volume-calculator', icon: <Calculator className="w-4 h-4" />, description: 'Volume calculations' },
      { name: 'Standard Deviation', href: '/standard-deviation-calculator', icon: <Calculator className="w-4 h-4" />, description: 'Statistical calculations' },
      { name: 'Random Number', href: '/random-number-calculator', icon: <Calculator className="w-4 h-4" />, description: 'Random number generator' }
    ]
  },
  {
    name: 'Health & Fitness',
    href: '/bmi-calculator',
    icon: <Heart className="w-5 h-5" />,
    description: 'BMI, calories, body metrics',
    subItems: [
      { name: 'BMI', href: '/bmi-calculator', icon: <Heart className="w-4 h-4" />, description: 'Body Mass Index' },
      { name: 'Calorie', href: '/calorie-calculator', icon: <Heart className="w-4 h-4" />, description: 'Daily calorie needs' },
      { name: 'Body Fat', href: '/body-fat-calculator', icon: <Heart className="w-4 h-4" />, description: 'Body fat percentage' },
      { name: 'BMR', href: '/bmr-calculator', icon: <Heart className="w-4 h-4" />, description: 'Basal Metabolic Rate' },
      { name: 'Ideal Weight', href: '/calculators/ideal-weight', icon: <Heart className="w-4 h-4" />, description: 'Ideal body weight' },
      { name: 'Pregnancy', href: '/calculators/pregnancy', icon: <Heart className="w-4 h-4" />, description: 'Due date calculator' }
    ]
  },
  {
    name: 'Construction',
    href: '/calculators/concrete',
    icon: <Wrench className="w-5 h-5" />,
    description: 'Building materials and costs',
    subItems: [
      { name: 'Concrete', href: '/calculators/concrete', icon: <Wrench className="w-4 h-4" />, description: 'Concrete volume calculator' },
      { name: 'Paint', href: '/calculators/paint', icon: <Wrench className="w-4 h-4" />, description: 'Paint coverage calculator' },
      { name: 'Flooring', href: '/calculators/flooring', icon: <Wrench className="w-4 h-4" />, description: 'Flooring materials' },
      { name: 'Roofing', href: '/calculators/roofing', icon: <Wrench className="w-4 h-4" />, description: 'Roofing calculator' },
      { name: 'Tile', href: '/tile-calculator', icon: <Wrench className="w-4 h-4" />, description: 'Tile materials calculator' },
      { name: 'Mulch', href: '/mulch-calculator', icon: <Wrench className="w-4 h-4" />, description: 'Mulch coverage calculator' },
      { name: 'Gravel', href: '/gravel-calculator', icon: <Wrench className="w-4 h-4" />, description: 'Gravel materials calculator' },
      { name: 'Electrical', href: '/calculators/electrical', icon: <Wrench className="w-4 h-4" />, description: 'Electrical load calculator' }
    ]
  },
  {
    name: 'Conversions',
    href: '/calculators/length',
    icon: <Globe className="w-5 h-5" />,
    description: 'Unit and currency converters',
    subItems: [
      { name: 'Length', href: '/calculators/length', icon: <Globe className="w-4 h-4" />, description: 'Length unit converter' },
      { name: 'Weight', href: '/calculators/weight', icon: <Globe className="w-4 h-4" />, description: 'Weight unit converter' },
      { name: 'Temperature', href: '/calculators/temperature', icon: <Globe className="w-4 h-4" />, description: 'Temperature converter' },
      { name: 'Currency', href: '/calculators/currency', icon: <Globe className="w-4 h-4" />, description: 'Currency converter' },
      { name: 'Area', href: '/area-calculator', icon: <Globe className="w-4 h-4" />, description: 'Area unit converter' },
      { name: 'Volume', href: '/volume-calculator', icon: <Globe className="w-4 h-4" />, description: 'Volume unit converter' },
      { name: 'Tire Size', href: '/tire-size-calculator', icon: <Globe className="w-4 h-4" />, description: 'Tire size converter' },
      { name: 'Wind Chill', href: '/wind-chill-calculator', icon: <Globe className="w-4 h-4" />, description: 'Wind chill calculator' },
      { name: 'Heat Index', href: '/heat-index-calculator', icon: <Globe className="w-4 h-4" />, description: 'Heat index calculator' },
      { name: 'Dew Point', href: '/dew-point-calculator', icon: <Globe className="w-4 h-4" />, description: 'Dew point calculator' },
      { name: 'Bandwidth', href: '/bandwidth-calculator', icon: <Globe className="w-4 h-4" />, description: 'Bandwidth calculator' }
    ]
  },
  {
    name: 'Time & Date',
    href: '/age-calculator',
    icon: <Clock className="w-5 h-5" />,
    description: 'Time calculations and dates',
    subItems: [
      { name: 'Age', href: '/age-calculator', icon: <Clock className="w-4 h-4" />, description: 'Age calculator' },
      { name: 'Date', href: '/date-calculator', icon: <Clock className="w-4 h-4" />, description: 'Date calculations' },
      { name: 'Time', href: '/time-calculator', icon: <Clock className="w-4 h-4" />, description: 'Time calculations' },
      { name: 'Time Duration', href: '/time-duration-calculator', icon: <Clock className="w-4 h-4" />, description: 'Duration between dates' },
      { name: 'Day Counter', href: '/day-counter-calculator', icon: <Clock className="w-4 h-4" />, description: 'Count days between dates' },
      { name: 'Day of Week', href: '/day-of-week-calculator', icon: <Clock className="w-4 h-4" />, description: 'Find day of week' },
      { name: 'Hours', href: '/calculators/hours', icon: <Clock className="w-4 h-4" />, description: 'Work hours calculator' },
      { name: 'Countdown', href: '/calculators/countdown', icon: <Clock className="w-4 h-4" />, description: 'Countdown timer' }
    ]
  },
  {
    name: 'Education',
    href: '/gpa-calculator',
    icon: <GraduationCap className="w-5 h-5" />,
    description: 'Academic calculations and grades',
    subItems: [
      { name: 'GPA', href: '/gpa-calculator', icon: <GraduationCap className="w-4 h-4" />, description: 'Grade Point Average' },
      { name: 'Grade', href: '/grade-calculator', icon: <GraduationCap className="w-4 h-4" />, description: 'Grade calculator' },
      { name: 'Percentage Grade', href: '/percentage-grade-calculator', icon: <GraduationCap className="w-4 h-4" />, description: 'Convert percentages to grades' },
      { name: 'Scholarship', href: '/calculators/scholarship', icon: <GraduationCap className="w-4 h-4" />, description: 'Scholarship eligibility' }
    ]
  },
  {
    name: 'Search',
    href: '/search-calculator',
    icon: <Search className="w-5 h-5" />,
    description: 'Find the perfect calculator',
    subItems: []
  },
  {
    name: 'Compare',
    href: '/compare-calculators',
    icon: <BarChart3 className="w-5 h-5" />,
    description: 'Compare calculators side by side',
    subItems: []
  },
  {
    name: 'History',
    href: '/calculation-history',
    icon: <History className="w-5 h-5" />,
    description: 'View calculation history and usage',
    subItems: []
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
      window.location.href = `/?search=${encodeURIComponent(searchQuery.trim())}`
    }
  }

  const toggleDropdown = (name: string) => {
    setActiveDropdown(activeDropdown === name ? null : name)
  }

  const closeAllDropdowns = () => {
    setActiveDropdown(null)
    setIsMobileMenuOpen(false)
    setIsSearchOpen(false)
  }

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
                    Calculator.net
                  </h1>
                  <p className="text-xs text-gray-500 hidden xl:block">Free Online Calculators</p>
                </div>
               </Link>
             </div>

                                         {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center space-x-0.5 xl:space-x-1">
                  {navigation.map((item) => (
                    <div key={item.name} className="relative group">
                      <button
                        onClick={() => toggleDropdown(item.name)}
                        className="flex items-center space-x-1.5 px-2.5 py-2 rounded-lg text-gray-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 text-xs font-medium header-nav-item"
                      >
                        <span className="scale-90 flex-shrink-0">{item.icon}</span>
                        <span className="header-nav-text">{item.name}</span>
                        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 flex-shrink-0 ${
                          activeDropdown === item.name ? 'rotate-180' : ''
                        }`} />
                      </button>

                                     {/* Dropdown Menu */}
                   {activeDropdown === item.name && (
                     <div className="absolute top-full left-0 mt-1 w-72 bg-white rounded-lg shadow-xl border border-gray-200 py-3 z-50">
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
                             <div className="text-blue-600 scale-90">{subItem.icon}</div>
                             <div className="flex-1 min-w-0">
                               <p className="text-sm font-medium text-gray-900">{subItem.name}</p>
                               <p className="text-xs text-gray-500 truncate">{subItem.description}</p>
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
                   placeholder="Search calculators..."
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
               {navigation.map((item) => (
                 <div key={item.name}>
                   <button
                     onClick={() => toggleDropdown(item.name)}
                     className="flex items-center justify-between w-full p-2.5 text-left text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200"
                   >
                     <div className="flex items-center space-x-2.5">
                       <span className="scale-90">{item.icon}</span>
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
                           <span className="scale-75">{subItem.icon}</span>
                           <span className="text-sm">{subItem.name}</span>
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
