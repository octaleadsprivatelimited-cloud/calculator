'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Search, Filter, X, Calculator, TrendingUp, Clock, Star } from 'lucide-react'

interface Calculator {
  id: string
  name: string
  description: string
  url: string
  category: string
  tags: string[]
  popularity: number
}

interface SearchFilters {
  category: string
  tags: string[]
  sortBy: 'name' | 'popularity' | 'recent'
}

const allCalculators: Calculator[] = [
  // Financial Calculators
  { id: 'mortgage', name: 'Mortgage Calculator', description: 'Calculate monthly mortgage payments', url: '/mortgage-calculator', category: 'Financial', tags: ['loan', 'home', 'payment'], popularity: 95 },
  { id: 'loan', name: 'Loan Calculator', description: 'Calculate loan payments and interest', url: '/loan-calculator', category: 'Financial', tags: ['loan', 'payment', 'interest'], popularity: 88 },
  { id: 'investment', name: 'Investment Calculator', description: 'Calculate investment returns and growth', url: '/investment-calculator', category: 'Financial', tags: ['investment', 'returns', 'growth'], popularity: 82 },
  { id: 'retirement', name: 'Retirement Calculator', description: 'Plan your retirement savings', url: '/retirement-calculator', category: 'Financial', tags: ['retirement', 'savings', 'planning'], popularity: 78 },
  { id: 'compound-interest', name: 'Compound Interest Calculator', description: 'Calculate compound interest growth', url: '/compound-interest-calculator', category: 'Financial', tags: ['interest', 'growth', 'compound'], popularity: 75 },
  { id: 'simple-interest', name: 'Simple Interest Calculator', description: 'Calculate simple interest', url: '/simple-interest-calculator', category: 'Financial', tags: ['interest', 'simple'], popularity: 70 },
  { id: 'auto-loan', name: 'Auto Loan Calculator', description: 'Calculate car loan payments', url: '/auto-loan-calculator', category: 'Financial', tags: ['car', 'loan', 'auto'], popularity: 73 },
  { id: 'income-tax', name: 'Income Tax Calculator', description: 'Calculate tax liability', url: '/income-tax-calculator', category: 'Financial', tags: ['tax', 'income', 'liability'], popularity: 85 },
  { id: 'discount', name: 'Discount Calculator', description: 'Calculate discounts and savings', url: '/discount-calculator', category: 'Financial', tags: ['discount', 'savings', 'price'], popularity: 68 },
  { id: 'tip', name: 'Tip Calculator', description: 'Calculate tips and gratuity', url: '/tip-calculator', category: 'Financial', tags: ['tip', 'gratuity', 'service'], popularity: 72 },

  // Math & Science Calculators
  { id: 'scientific', name: 'Scientific Calculator', description: 'Advanced scientific functions', url: '/scientific-calculator', category: 'Math & Science', tags: ['scientific', 'math', 'functions'], popularity: 90 },
  { id: 'fraction', name: 'Fraction Calculator', description: 'Fraction arithmetic operations', url: '/fraction-calculator', category: 'Math & Science', tags: ['fraction', 'math', 'arithmetic'], popularity: 75 },
  { id: 'percentage', name: 'Percentage Calculator', description: 'Percentage calculations', url: '/percentage-calculator', category: 'Math & Science', tags: ['percentage', 'math', 'calculation'], popularity: 88 },
  { id: 'triangle', name: 'Triangle Calculator', description: 'Triangle properties and calculations', url: '/triangle-calculator', category: 'Math & Science', tags: ['triangle', 'geometry', 'math'], popularity: 70 },
  { id: 'area', name: 'Area Calculator', description: 'Calculate area of shapes', url: '/area-calculator', category: 'Math & Science', tags: ['area', 'geometry', 'shapes'], popularity: 78 },
  { id: 'volume', name: 'Volume Calculator', description: 'Calculate volume of objects', url: '/volume-calculator', category: 'Math & Science', tags: ['volume', 'geometry', '3d'], popularity: 75 },
  { id: 'standard-deviation', name: 'Standard Deviation Calculator', description: 'Statistical calculations', url: '/standard-deviation-calculator', category: 'Math & Science', tags: ['statistics', 'deviation', 'math'], popularity: 65 },
  { id: 'random-number', name: 'Random Number Generator', description: 'Generate random numbers', url: '/random-number-calculator', category: 'Math & Science', tags: ['random', 'generator', 'numbers'], popularity: 60 },

  // Health & Fitness Calculators
  { id: 'bmi', name: 'BMI Calculator', description: 'Calculate Body Mass Index', url: '/bmi-calculator', category: 'Health & Fitness', tags: ['bmi', 'health', 'weight'], popularity: 92 },
  { id: 'calorie', name: 'Calorie Calculator', description: 'Calculate daily calorie needs', url: '/calorie-calculator', category: 'Health & Fitness', tags: ['calorie', 'nutrition', 'health'], popularity: 88 },
  { id: 'body-fat', name: 'Body Fat Calculator', description: 'Calculate body fat percentage', url: '/body-fat-calculator', category: 'Health & Fitness', tags: ['body fat', 'health', 'fitness'], popularity: 75 },
  { id: 'bmr', name: 'BMR Calculator', description: 'Calculate Basal Metabolic Rate', url: '/bmr-calculator', category: 'Health & Fitness', tags: ['bmr', 'metabolism', 'health'], popularity: 70 },

  // Construction Calculators
  { id: 'concrete', name: 'Concrete Calculator', description: 'Calculate concrete volume needed', url: '/calculators/concrete', category: 'Construction', tags: ['concrete', 'construction', 'volume'], popularity: 75 },
  { id: 'paint', name: 'Paint Calculator', description: 'Calculate paint coverage', url: '/calculators/paint', category: 'Construction', tags: ['paint', 'coverage', 'construction'], popularity: 70 },
  { id: 'flooring', name: 'Flooring Calculator', description: 'Calculate flooring materials', url: '/calculators/flooring', category: 'Construction', tags: ['flooring', 'materials', 'construction'], popularity: 68 },
  { id: 'roofing', name: 'Roofing Calculator', description: 'Calculate roofing materials', url: '/calculators/roofing', category: 'Construction', tags: ['roofing', 'materials', 'construction'], popularity: 72 },
  { id: 'tile', name: 'Tile Calculator', description: 'Calculate tile materials and costs', url: '/tile-calculator', category: 'Construction', tags: ['tile', 'materials', 'construction'], popularity: 65 },
  { id: 'mulch', name: 'Mulch Calculator', description: 'Calculate mulch coverage needed', url: '/mulch-calculator', category: 'Construction', tags: ['mulch', 'landscaping', 'coverage'], popularity: 55 },
  { id: 'gravel', name: 'Gravel Calculator', description: 'Calculate gravel materials needed', url: '/gravel-calculator', category: 'Construction', tags: ['gravel', 'materials', 'construction'], popularity: 58 },
  { id: 'electrical', name: 'Electrical Calculator', description: 'Calculate electrical requirements', url: '/calculators/electrical', category: 'Construction', tags: ['electrical', 'construction', 'load'], popularity: 62 },

  // Conversion Calculators
  { id: 'length', name: 'Length Converter', description: 'Convert length units', url: '/calculators/length', category: 'Conversions', tags: ['length', 'conversion', 'units'], popularity: 85 },
  { id: 'weight', name: 'Weight Converter', description: 'Convert weight units', url: '/calculators/weight', category: 'Conversions', tags: ['weight', 'conversion', 'units'], popularity: 82 },
  { id: 'temperature', name: 'Temperature Converter', description: 'Convert temperature units', url: '/calculators/temperature', category: 'Conversions', tags: ['temperature', 'conversion', 'units'], popularity: 88 },
  { id: 'currency', name: 'Currency Converter', description: 'Convert between currencies', url: '/calculators/currency', category: 'Conversions', tags: ['currency', 'conversion', 'money'], popularity: 90 },
  { id: 'tire-size', name: 'Tire Size Calculator', description: 'Compare tire sizes and specifications', url: '/tire-size-calculator', category: 'Conversions', tags: ['tire', 'size', 'automotive'], popularity: 65 },
  { id: 'wind-chill', name: 'Wind Chill Calculator', description: 'Calculate wind chill factor', url: '/wind-chill-calculator', category: 'Conversions', tags: ['wind chill', 'weather', 'temperature'], popularity: 55 },
  { id: 'heat-index', name: 'Heat Index Calculator', description: 'Calculate heat index and safety levels', url: '/heat-index-calculator', category: 'Conversions', tags: ['heat index', 'weather', 'safety'], popularity: 58 },
  { id: 'dew-point', name: 'Dew Point Calculator', description: 'Calculate dew point temperature', url: '/dew-point-calculator', category: 'Conversions', tags: ['dew point', 'weather', 'humidity'], popularity: 52 },
  { id: 'bandwidth', name: 'Bandwidth Calculator', description: 'Calculate download/upload times', url: '/bandwidth-calculator', category: 'Conversions', tags: ['bandwidth', 'internet', 'speed'], popularity: 60 },

  // Time & Date Calculators
  { id: 'age', name: 'Age Calculator', description: 'Calculate exact age', url: '/age-calculator', category: 'Time & Date', tags: ['age', 'time', 'calculation'], popularity: 85 },
  { id: 'date', name: 'Date Calculator', description: 'Add or subtract dates', url: '/date-calculator', category: 'Time & Date', tags: ['date', 'time', 'calculation'], popularity: 78 },
  { id: 'time', name: 'Time Calculator', description: 'Calculate time differences', url: '/time-calculator', category: 'Time & Date', tags: ['time', 'difference', 'calculation'], popularity: 75 },
  { id: 'time-duration', name: 'Time Duration Calculator', description: 'Calculate duration between dates and times', url: '/time-duration-calculator', category: 'Time & Date', tags: ['duration', 'time', 'calculation'], popularity: 68 },
  { id: 'day-counter', name: 'Day Counter', description: 'Count days between two dates', url: '/day-counter-calculator', category: 'Time & Date', tags: ['days', 'count', 'date'], popularity: 62 },
  { id: 'day-of-week', name: 'Day of Week Calculator', description: 'Find what day of the week any date falls on', url: '/day-of-week-calculator', category: 'Time & Date', tags: ['day', 'week', 'date'], popularity: 58 },

  // Education Calculators
  { id: 'gpa', name: 'GPA Calculator', description: 'Calculate Grade Point Average', url: '/gpa-calculator', category: 'Education', tags: ['gpa', 'grade', 'education'], popularity: 82 },
  { id: 'grade', name: 'Grade Calculator', description: 'Calculate final grades', url: '/grade-calculator', category: 'Education', tags: ['grade', 'education', 'calculation'], popularity: 78 },
  { id: 'percentage-grade', name: 'Percentage to Grade', description: 'Convert percentages to letter grades', url: '/percentage-grade-calculator', category: 'Education', tags: ['percentage', 'grade', 'conversion'], popularity: 75 },
  { id: 'scholarship', name: 'Scholarship Calculator', description: 'Calculate scholarship eligibility', url: '/calculators/scholarship', category: 'Education', tags: ['scholarship', 'education', 'eligibility'], popularity: 70 },

  // Other Calculators
  { id: 'salary', name: 'Salary Calculator', description: 'Calculate take-home pay', url: '/calculators/salary', category: 'Other', tags: ['salary', 'pay', 'income'], popularity: 80 },
  { id: 'ideal-weight', name: 'Ideal Weight Calculator', description: 'Calculate ideal body weight', url: '/calculators/ideal-weight', category: 'Other', tags: ['weight', 'health', 'ideal'], popularity: 72 },
  { id: 'pregnancy', name: 'Pregnancy Calculator', description: 'Calculate due date', url: '/calculators/pregnancy', category: 'Other', tags: ['pregnancy', 'due date', 'health'], popularity: 68 },
  { id: 'hours', name: 'Hours Calculator', description: 'Calculate work hours and overtime', url: '/calculators/hours', category: 'Other', tags: ['hours', 'work', 'overtime'], popularity: 75 },
  { id: 'countdown', name: 'Countdown Timer', description: 'Count down to important dates', url: '/calculators/countdown', category: 'Other', tags: ['countdown', 'timer', 'date'], popularity: 65 }
]

const categories = ['All', 'Financial', 'Math & Science', 'Health & Fitness', 'Construction', 'Conversions', 'Time & Date', 'Education', 'Other']

export default function CalculatorSearch() {
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'All',
    tags: [],
    sortBy: 'popularity'
  })
  const [showFilters, setShowFilters] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    allCalculators.forEach(calc => {
      calc.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [])

  // Filter and search calculators
  const filteredCalculators = useMemo(() => {
    let filtered = allCalculators

    // Category filter
    if (filters.category !== 'All') {
      filtered = filtered.filter(calc => calc.category === filters.category)
    }

    // Tag filter
    if (filters.tags.length > 0) {
      filtered = filtered.filter(calc => 
        calc.tags.some(tag => filters.tags.includes(tag))
      )
    }

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(calc =>
        calc.name.toLowerCase().includes(query) ||
        calc.description.toLowerCase().includes(query) ||
        calc.tags.some(tag => tag.toLowerCase().includes(query))
      )
    }

    // Sort
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name)
        case 'popularity':
          return b.popularity - a.popularity
        case 'recent':
          return 0 // Could implement recent usage tracking
        default:
          return b.popularity - a.popularity
      }
    })

    return filtered
  }, [searchQuery, filters])

  // Handle tag selection
  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  // Apply filters
  const applyFilters = () => {
    setFilters(prev => ({
      ...prev,
      tags: selectedTags
    }))
    setShowFilters(false)
  }

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      category: 'All',
      tags: [],
      sortBy: 'popularity'
    })
    setSelectedTags([])
    setSearchQuery('')
  }

  // Get popular calculators for suggestions
  const popularCalculators = useMemo(() => 
    allCalculators
      .sort((a, b) => b.popularity - a.popularity)
      .slice(0, 6)
  , [])

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Find Your Calculator</h1>
            <p className="text-purple-100 text-lg">
              Search through our collection of 40+ calculators. Filter by category, tags, or search by name.
            </p>
          </div>
          <div className="hidden md:block">
            <Search className="w-16 h-16 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search calculators by name, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
          </div>
          
          {/* Filter Button */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`absolute right-3 top-1/2 transform -translate-y-1/2 px-3 py-1 rounded-md text-sm font-medium transition-colors ${
              showFilters || filters.category !== 'All' || filters.tags.length > 0
                ? 'bg-purple-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Filter className="w-4 h-4 inline mr-1" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        {showFilters && (
          <div className="bg-gray-50 p-6 rounded-lg mb-6 border border-gray-200">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                                 <select
                   value={filters.category}
                   onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                   title="Select calculator category"
                   aria-label="Select calculator category"
                 >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort By</label>
                                 <select
                   value={filters.sortBy}
                   onChange={(e) => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                   title="Select sorting method"
                   aria-label="Select sorting method"
                 >
                  <option value="popularity">Most Popular</option>
                  <option value="name">Alphabetical</option>
                  <option value="recent">Recently Used</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-end space-x-2">
                <button
                  onClick={applyFilters}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={clearFilters}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Clear All
                </button>
              </div>
            </div>

            {/* Tags Filter */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">Tags</label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      selectedTags.includes(tag)
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        {(filters.category !== 'All' || filters.tags.length > 0) && (
          <div className="mb-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>Active filters:</span>
              {filters.category !== 'All' && (
                <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                  {filters.category}
                </span>
              )}
              {filters.tags.map(tag => (
                <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Search Results */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              {searchQuery ? `Search Results for "${searchQuery}"` : 'All Calculators'}
            </h2>
            <span className="text-gray-500">{filteredCalculators.length} calculators found</span>
          </div>

          {filteredCalculators.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No calculators found</h3>
              <p className="text-gray-500">Try adjusting your search terms or filters</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCalculators.map(calculator => (
                <div key={calculator.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-semibold text-gray-800">{calculator.name}</h3>
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{calculator.popularity}</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{calculator.description}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    {calculator.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">{calculator.category}</span>
                    <a
                      href={calculator.url}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                      Use Calculator
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Popular Calculators Suggestions */}
        {!searchQuery && filters.category === 'All' && filters.tags.length === 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <TrendingUp className="w-5 h-5 text-orange-500 mr-2" />
              Popular Calculators
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {popularCalculators.map(calculator => (
                <div key={calculator.id} className="bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-800">{calculator.name}</h3>
                    <div className="flex items-center space-x-1 text-orange-500">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="text-xs font-medium">{calculator.popularity}</span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{calculator.description}</p>
                  <a
                    href={calculator.url}
                    className="text-orange-600 hover:text-orange-700 text-sm font-medium flex items-center"
                  >
                    Try it now
                    <Calculator className="w-4 h-4 ml-1" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
