'use client'

import React, { useState, useEffect } from 'react'
import { Calculator as CalculatorIcon, DollarSign, Heart, Clock, Car, Home, GraduationCap, Wrench, Globe, Plus, Minus, X, Divide } from 'lucide-react'

interface CalculatorCategory {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  calculators: CalculatorItem[]
}

interface CalculatorItem {
  id: string
  name: string
  description: string
  url: string
}

const calculatorCategories: CalculatorCategory[] = [
  {
    id: 'financial',
    name: 'Financial Calculators',
    icon: <DollarSign className="w-8 h-8 text-green-600" />,
    description: 'Calculate loans, mortgages, investments, and more',
    calculators: [
      { id: 'mortgage', name: 'Mortgage Calculator', description: 'Calculate monthly mortgage payments', url: '/mortgage-calculator' },
      { id: 'loan', name: 'Loan Calculator', description: 'Calculate loan payments and interest', url: '/loan-calculator' },
      { id: 'auto-loan', name: 'Auto Loan Calculator', description: 'Calculate car loan payments', url: '/auto-loan-calculator' },
      { id: 'investment', name: 'Investment Calculator', description: 'Calculate investment returns', url: '/investment-calculator' },
      { id: 'retirement', name: 'Retirement Calculator', description: 'Plan your retirement savings', url: '/retirement-calculator' },
      { id: 'compound-interest', name: 'Compound Interest Calculator', description: 'Calculate compound interest growth', url: '/compound-interest-calculator' },
      { id: 'simple-interest', name: 'Simple Interest Calculator', description: 'Calculate simple interest', url: '/simple-interest-calculator' },
      { id: 'discount', name: 'Discount Calculator', description: 'Calculate discounts and savings', url: '/discount-calculator' },
      { id: 'tip', name: 'Tip Calculator', description: 'Calculate tips and split bills', url: '/tip-calculator' },
      { id: 'income-tax', name: 'Income Tax Calculator', description: 'Calculate income tax liability', url: '/income-tax-calculator' },
      { id: 'salary', name: 'Salary Calculator', description: 'Calculate take-home pay', url: '/calculators/salary' }
    ]
  },
  {
    id: 'math',
    name: 'Math Calculators',
    icon: <CalculatorIcon className="w-8 h-8 text-blue-600" />,
    description: 'Advanced mathematical calculations and functions',
    calculators: [
      { id: 'scientific', name: 'Scientific Calculator', description: 'Advanced scientific functions', url: '/scientific-calculator' },
      { id: 'fraction', name: 'Fraction Calculator', description: 'Fraction arithmetic and conversion', url: '/fraction-calculator' },
      { id: 'percentage', name: 'Percentage Calculator', description: 'Calculate percentages and changes', url: '/percentage-calculator' },
      { id: 'triangle', name: 'Triangle Calculator', description: 'Calculate triangle properties', url: '/triangle-calculator' },
      { id: 'standard-deviation', name: 'Standard Deviation Calculator', description: 'Statistical calculations', url: '/standard-deviation-calculator' },
      { id: 'random-number', name: 'Random Number Generator', description: 'Generate random numbers', url: '/random-number-calculator' },
      { id: 'unit-converter', name: 'Unit Converter', description: 'Convert between units', url: '/unit-converter-calculator' },
      { id: 'area', name: 'Area Calculator', description: 'Calculate areas of shapes', url: '/area-calculator' },
      { id: 'volume', name: 'Volume Calculator', description: 'Calculate volumes of 3D shapes', url: '/volume-calculator' }
    ]
  },
  {
    id: 'fitness-health',
    name: 'Fitness & Health Calculators',
    icon: <Heart className="w-8 h-8 text-red-600" />,
    description: 'Calculate BMI, calories, body metrics, and more',
    calculators: [
      { id: 'bmi', name: 'BMI Calculator', description: 'Calculate Body Mass Index', url: '/bmi-calculator' },
      { id: 'calorie', name: 'Calorie Calculator', description: 'Calculate daily calorie needs', url: '/calorie-calculator' },
      { id: 'body-fat', name: 'Body Fat Calculator', description: 'Estimate body fat percentage', url: '/body-fat-calculator' },
      { id: 'bmr', name: 'BMR Calculator', description: 'Calculate Basal Metabolic Rate', url: '/bmr-calculator' },
      { id: 'ideal-weight', name: 'Ideal Weight Calculator', description: 'Calculate ideal body weight', url: '/calculators/ideal-weight' },
      { id: 'pregnancy', name: 'Pregnancy Calculator', description: 'Calculate due dates and milestones', url: '/calculators/pregnancy' }
    ]
  },
  {
    id: 'conversion',
    name: 'Conversion Calculators',
    icon: <Globe className="w-8 h-8 text-purple-600" />,
    description: 'Convert between different units and measurements',
    calculators: [
      { id: 'length', name: 'Length Converter', description: 'Convert length units', url: '/calculators/length' },
      { id: 'weight', name: 'Weight Converter', description: 'Convert weight units', url: '/calculators/weight' },
      { id: 'temperature', name: 'Temperature Converter', description: 'Convert temperature units', url: '/calculators/temperature' },
      { id: 'area', name: 'Area Converter', description: 'Convert area units', url: '/calculators/area' },
      { id: 'volume', name: 'Volume Converter', description: 'Convert volume units', url: '/calculators/volume' },
      { id: 'tire-size', name: 'Tire Size Calculator', description: 'Compare tire sizes and specifications', url: '/tire-size-calculator' },
      { id: 'wind-chill', name: 'Wind Chill Calculator', description: 'Calculate wind chill factor', url: '/wind-chill-calculator' },
      { id: 'heat-index', name: 'Heat Index Calculator', description: 'Calculate heat index and safety levels', url: '/heat-index-calculator' },
      { id: 'dew-point', name: 'Dew Point Calculator', description: 'Calculate dew point temperature', url: '/dew-point-calculator' },
      { id: 'bandwidth', name: 'Bandwidth Calculator', description: 'Calculate download/upload times', url: '/bandwidth-calculator' },
      { id: 'currency', name: 'Currency Converter', description: 'Convert between currencies', url: '/calculators/currency' }
    ]
  },
  {
    id: 'time-date',
    name: 'Time & Date Calculators',
    icon: <Clock className="w-8 h-8 text-orange-600" />,
    description: 'Calculate time differences, dates, and durations',
    calculators: [
      { id: 'age', name: 'Age Calculator', description: 'Calculate exact age', url: '/age-calculator' },
      { id: 'date', name: 'Date Calculator', description: 'Add or subtract dates', url: '/date-calculator' },
      { id: 'time', name: 'Time Calculator', description: 'Calculate time differences', url: '/time-calculator' },
      { id: 'time-duration', name: 'Time Duration Calculator', description: 'Calculate duration between dates and times', url: '/time-duration-calculator' },
      { id: 'day-counter', name: 'Day Counter', description: 'Count days between two dates', url: '/day-counter-calculator' },
      { id: 'day-of-week', name: 'Day of Week Calculator', description: 'Find what day of the week any date falls on', url: '/day-of-week-calculator' },
      { id: 'hours', name: 'Hours Calculator', description: 'Calculate work hours and overtime', url: '/calculators/hours' },
      { id: 'countdown', name: 'Countdown Timer', description: 'Count down to important dates', url: '/calculators/countdown' }
    ]
  },
  {
    id: 'construction',
    name: 'Construction Calculators',
    icon: <Wrench className="w-8 h-8 text-gray-600" />,
    description: 'Calculate construction materials and costs',
    calculators: [
      { id: 'concrete', name: 'Concrete Calculator', description: 'Calculate concrete volume needed', url: '/calculators/concrete' },
      { id: 'paint', name: 'Paint Calculator', description: 'Calculate paint coverage', url: '/calculators/paint' },
      { id: 'flooring', name: 'Flooring Calculator', description: 'Calculate flooring materials', url: '/calculators/flooring' },
      { id: 'roofing', name: 'Roofing Calculator', description: 'Calculate roofing materials', url: '/calculators/roofing' },
      { id: 'tile', name: 'Tile Calculator', description: 'Calculate tile materials and costs', url: '/tile-calculator' },
      { id: 'mulch', name: 'Mulch Calculator', description: 'Calculate mulch coverage needed', url: '/mulch-calculator' },
      { id: 'gravel', name: 'Gravel Calculator', description: 'Calculate gravel materials needed', url: '/gravel-calculator' },
      { id: 'electrical', name: 'Electrical Calculator', description: 'Calculate electrical requirements', url: '/calculators/electrical' }
    ]
  },
  {
    id: 'education',
    name: 'Education Calculators',
    icon: <GraduationCap className="w-8 h-8 text-indigo-600" />,
    description: 'Calculate grades, GPA, and academic metrics',
    calculators: [
      { id: 'gpa', name: 'GPA Calculator', description: 'Calculate Grade Point Average', url: '/gpa-calculator' },
      { id: 'grade', name: 'Grade Calculator', description: 'Calculate final grades', url: '/grade-calculator' },
      { id: 'percentage-grade', name: 'Percentage to Grade', description: 'Convert percentages to letter grades', url: '/percentage-grade-calculator' },
      { id: 'scholarship', name: 'Scholarship Calculator', description: 'Calculate scholarship eligibility', url: '/calculators/scholarship' }
    ]
  }
]

export default function PageCalculator() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  // Clear search and URL parameter
  const clearSearch = () => {
    setSearchTerm('')
    // Clear URL search parameter
    const url = new URL(window.location.href)
    url.searchParams.delete('q')
    url.searchParams.delete('search')
    window.history.replaceState({}, '', url.toString())
  }

  // Get search query from URL if present
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const searchParam = urlParams.get('q') || urlParams.get('search') // Support both 'q' and 'search' for backward compatibility
    if (searchParam) {
      setSearchTerm(searchParam)
    }
  }, [])

  // Update URL when search term changes
  useEffect(() => {
    if (searchTerm) {
      const url = new URL(window.location.href)
      url.searchParams.set('q', searchTerm)
      window.history.replaceState({}, '', url.toString())
    }
  }, [searchTerm])

  const filteredCategories = calculatorCategories.filter(category => {
    if (selectedCategory && category.id !== selectedCategory) return false
    if (!searchTerm) return true
    
    const categoryMatch = category.name.toLowerCase().includes(searchTerm.toLowerCase())
    const calculatorMatch = category.calculators.some(calc => 
      calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      calc.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    return categoryMatch || calculatorMatch
  })

  const allCalculators = calculatorCategories.flatMap(cat => cat.calculators)
  const filteredCalculators = allCalculators.filter(calc => 
    calc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    calc.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-800 mb-4">
            Welcome to Calculator.net
          </h1>
          <p className="text-lg lg:text-xl text-gray-600 max-w-3xl mx-auto">
            Free online calculators for finance, math, health, and more. Currently featuring over 50+ calculators to help you "do the math" quickly in various areas.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search calculators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-6 py-4 text-lg border-2 border-gray-300 rounded-2xl focus:border-blue-500 focus:outline-none shadow-lg pr-12"
              />
              <div className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center space-x-2">
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
                <CalculatorIcon className="w-6 h-6 text-gray-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
              }`}
            >
              All Categories
            </button>
            {calculatorCategories.map(category => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-6 py-3 rounded-full font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-700 hover:bg-gray-50 shadow-md'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Search Results for "{searchTerm}"
            </h2>
            {filteredCalculators.length === 0 ? (
              <div className="text-center py-12 bg-gray-50 rounded-2xl">
                <CalculatorIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-600 mb-2">No calculators found</h3>
                <p className="text-gray-500">Try adjusting your search terms or browse categories below</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredCalculators.map(calculator => (
                  <a
                    key={calculator.id}
                    href={calculator.url}
                    className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border-l-4 border-blue-500 block"
                  >
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                      {calculator.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {calculator.description}
                    </p>
                  </a>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Calculator Categories */}
        {!searchTerm && (
          <div className="space-y-12">
            {filteredCategories.map(category => (
              <div key={category.id} className="bg-white rounded-2xl shadow-lg p-8">
                <div className="flex items-center gap-4 mb-6">
                  {category.icon}
                  <div>
                    <h2 className="text-3xl font-bold text-gray-800">{category.name}</h2>
                    <p className="text-gray-600">{category.description}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.calculators.map(calculator => (
                    <a
                      key={calculator.id}
                      href={calculator.url}
                      className="bg-gray-50 rounded-lg p-4 hover:bg-blue-50 transition-colors cursor-pointer border border-gray-200 hover:border-blue-300 block"
                    >
                      <h3 className="font-semibold text-gray-800 mb-2">
                        {calculator.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {calculator.description}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-16 pt-8 border-t border-gray-200">
          <p className="text-gray-500 mb-2">
            Calculator.net's sole focus is to provide fast, comprehensive, convenient, free online calculators.
          </p>
          <p className="text-sm text-gray-400">
            © 2024 Calculator.net - All calculators are completely free with no registration required.
          </p>
        </footer>
      </div>
    </div>
  )
}
