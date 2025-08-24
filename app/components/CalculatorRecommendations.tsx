'use client'

import React, { useState, useEffect, useMemo } from 'react'
import { Lightbulb, TrendingUp, Clock, Star, Calculator, ArrowRight, Heart, Target, Search, BarChart3 } from 'lucide-react'

interface CalculatorRecommendation {
  id: string
  name: string
  description: string
  category: string
  url: string
  matchScore: number
  reason: string
  tags: string[]
  popularity: number
}

interface UserPreference {
  category: string
  tags: string[]
  complexity: 'simple' | 'intermediate' | 'advanced'
  useCase: string
}

const allCalculators: CalculatorRecommendation[] = [
  // Financial Calculators
  { id: 'mortgage', name: 'Mortgage Calculator', description: 'Calculate monthly mortgage payments and interest', category: 'Financial', url: '/mortgage-calculator', matchScore: 0, reason: '', tags: ['loan', 'home', 'payment', 'interest'], popularity: 95 },
  { id: 'loan', name: 'Loan Calculator', description: 'Calculate loan payments and interest rates', category: 'Financial', url: '/loan-calculator', matchScore: 0, reason: '', tags: ['loan', 'payment', 'interest', 'debt'], popularity: 88 },
  { id: 'investment', name: 'Investment Calculator', description: 'Calculate investment returns and growth', category: 'Financial', url: '/investment-calculator', matchScore: 0, reason: '', tags: ['investment', 'returns', 'growth', 'savings'], popularity: 82 },
  { id: 'retirement', name: 'Retirement Calculator', description: 'Plan your retirement savings', category: 'Financial', url: '/retirement-calculator', matchScore: 0, reason: '', tags: ['retirement', 'savings', 'planning', 'future'], popularity: 78 },
  { id: 'compound-interest', name: 'Compound Interest Calculator', description: 'Calculate compound interest growth', category: 'Financial', url: '/compound-interest-calculator', matchScore: 0, reason: '', tags: ['interest', 'growth', 'compound', 'savings'], popularity: 75 },
  { id: 'auto-loan', name: 'Auto Loan Calculator', description: 'Calculate car loan payments', category: 'Financial', url: '/auto-loan-calculator', matchScore: 0, reason: '', tags: ['car', 'loan', 'auto', 'payment'], popularity: 73 },
  { id: 'income-tax', name: 'Income Tax Calculator', description: 'Calculate tax liability', category: 'Financial', url: '/income-tax-calculator', matchScore: 0, reason: '', tags: ['tax', 'income', 'liability', 'government'], popularity: 85 },
  { id: 'discount', name: 'Discount Calculator', description: 'Calculate discounts and savings', category: 'Financial', url: '/discount-calculator', matchScore: 0, reason: '', tags: ['discount', 'savings', 'price', 'shopping'], popularity: 68 },
  { id: 'tip', name: 'Tip Calculator', description: 'Calculate tips and gratuity', category: 'Financial', url: '/tip-calculator', matchScore: 0, reason: '', tags: ['tip', 'gratuity', 'service', 'restaurant'], popularity: 72 },

  // Math & Science Calculators
  { id: 'scientific', name: 'Scientific Calculator', description: 'Advanced scientific functions', category: 'Math & Science', url: '/scientific-calculator', matchScore: 0, reason: '', tags: ['scientific', 'math', 'functions', 'advanced'], popularity: 90 },
  { id: 'fraction', name: 'Fraction Calculator', description: 'Fraction arithmetic operations', category: 'Math & Science', url: '/fraction-calculator', matchScore: 0, reason: '', tags: ['fraction', 'math', 'arithmetic', 'basic'], popularity: 75 },
  { id: 'percentage', name: 'Percentage Calculator', description: 'Percentage calculations', category: 'Math & Science', url: '/percentage-calculator', matchScore: 0, reason: '', tags: ['percentage', 'math', 'calculation', 'basic'], popularity: 88 },
  { id: 'triangle', name: 'Triangle Calculator', description: 'Triangle properties and calculations', category: 'Math & Science', url: '/triangle-calculator', matchScore: 0, reason: '', tags: ['triangle', 'geometry', 'math', 'intermediate'], popularity: 70 },
  { id: 'area', name: 'Area Calculator', description: 'Calculate area of shapes', category: 'Math & Science', url: '/area-calculator', matchScore: 0, reason: '', tags: ['area', 'geometry', 'shapes', 'basic'], popularity: 78 },
  { id: 'volume', name: 'Volume Calculator', description: 'Calculate volume of objects', category: 'Math & Science', url: '/volume-calculator', matchScore: 0, reason: '', tags: ['volume', 'geometry', '3d', 'intermediate'], popularity: 75 },
  { id: 'standard-deviation', name: 'Standard Deviation Calculator', description: 'Statistical calculations', category: 'Math & Science', url: '/standard-deviation-calculator', matchScore: 0, reason: '', tags: ['statistics', 'deviation', 'math', 'advanced'], popularity: 65 },
  { id: 'random-number', name: 'Random Number Generator', description: 'Generate random numbers', category: 'Math & Science', url: '/random-number-calculator', matchScore: 0, reason: '', tags: ['random', 'generator', 'numbers', 'basic'], popularity: 60 },

  // Health & Fitness Calculators
  { id: 'bmi', name: 'BMI Calculator', description: 'Calculate Body Mass Index', category: 'Health & Fitness', url: '/bmi-calculator', matchScore: 0, reason: '', tags: ['bmi', 'health', 'weight', 'fitness'], popularity: 92 },
  { id: 'calorie', name: 'Calorie Calculator', description: 'Calculate daily calorie needs', category: 'Health & Fitness', url: '/calorie-calculator', matchScore: 0, reason: '', tags: ['calorie', 'nutrition', 'health', 'diet'], popularity: 88 },
  { id: 'body-fat', name: 'Body Fat Calculator', description: 'Calculate body fat percentage', category: 'Health & Fitness', url: '/body-fat-calculator', matchScore: 0, reason: '', tags: ['body fat', 'health', 'fitness', 'measurement'], popularity: 75 },
  { id: 'bmr', name: 'BMR Calculator', description: 'Calculate Basal Metabolic Rate', category: 'Health & Fitness', url: '/bmr-calculator', matchScore: 0, reason: '', tags: ['bmr', 'metabolism', 'health', 'intermediate'], popularity: 70 },

  // Construction Calculators
  { id: 'concrete', name: 'Concrete Calculator', description: 'Calculate concrete volume needed', category: 'Construction', url: '/calculators/concrete', matchScore: 0, reason: '', tags: ['concrete', 'construction', 'volume', 'building'], popularity: 75 },
  { id: 'paint', name: 'Paint Calculator', description: 'Calculate paint coverage', category: 'Construction', url: '/calculators/paint', matchScore: 0, reason: '', tags: ['paint', 'coverage', 'construction', 'renovation'], popularity: 70 },
  { id: 'flooring', name: 'Flooring Calculator', description: 'Calculate flooring materials', category: 'Construction', url: '/calculators/flooring', matchScore: 0, reason: '', tags: ['flooring', 'materials', 'construction', 'renovation'], popularity: 68 },
  { id: 'roofing', name: 'Roofing Calculator', description: 'Calculate roofing materials', category: 'Construction', url: '/calculators/roofing', matchScore: 0, reason: '', tags: ['roofing', 'materials', 'construction', 'building'], popularity: 72 },
  { id: 'tile', name: 'Tile Calculator', description: 'Calculate tile materials and costs', category: 'Construction', url: '/tile-calculator', matchScore: 0, reason: '', tags: ['tile', 'materials', 'construction', 'renovation'], popularity: 65 },
  { id: 'mulch', name: 'Mulch Calculator', description: 'Calculate mulch coverage needed', category: 'Construction', url: '/mulch-calculator', matchScore: 0, reason: '', tags: ['mulch', 'landscaping', 'coverage', 'outdoor'], popularity: 55 },
  { id: 'gravel', name: 'Gravel Calculator', description: 'Calculate gravel materials needed', category: 'Construction', url: '/gravel-calculator', matchScore: 0, reason: '', tags: ['gravel', 'materials', 'construction', 'landscaping'], popularity: 58 },
  { id: 'electrical', name: 'Electrical Calculator', description: 'Calculate electrical requirements', category: 'Construction', url: '/calculators/electrical', matchScore: 0, reason: '', tags: ['electrical', 'construction', 'load', 'safety'], popularity: 62 },

  // Conversion Calculators
  { id: 'length', name: 'Length Converter', description: 'Convert length units', category: 'Conversions', url: '/calculators/length', matchScore: 0, reason: '', tags: ['length', 'conversion', 'units', 'measurement'], popularity: 85 },
  { id: 'weight', name: 'Weight Converter', description: 'Convert weight units', category: 'Conversions', url: '/calculators/weight', matchScore: 0, reason: '', tags: ['weight', 'conversion', 'units', 'measurement'], popularity: 82 },
  { id: 'temperature', name: 'Temperature Converter', description: 'Convert temperature units', category: 'Conversions', url: '/calculators/temperature', matchScore: 0, reason: '', tags: ['temperature', 'conversion', 'units', 'weather'], popularity: 88 },
  { id: 'currency', name: 'Currency Converter', description: 'Convert between currencies', category: 'Conversions', url: '/calculators/currency', matchScore: 0, reason: '', tags: ['currency', 'conversion', 'money', 'travel'], popularity: 90 },
  { id: 'tire-size', name: 'Tire Size Calculator', description: 'Compare tire sizes and specifications', category: 'Conversions', url: '/tire-size-calculator', matchScore: 0, reason: '', tags: ['tire', 'size', 'automotive', 'safety'], popularity: 65 },
  { id: 'wind-chill', name: 'Wind Chill Calculator', description: 'Calculate wind chill factor', category: 'Conversions', url: '/wind-chill-calculator', matchScore: 0, reason: '', tags: ['wind chill', 'weather', 'temperature', 'safety'], popularity: 55 },
  { id: 'heat-index', name: 'Heat Index Calculator', description: 'Calculate heat index and safety levels', category: 'Conversions', url: '/heat-index-calculator', matchScore: 0, reason: '', tags: ['heat index', 'weather', 'safety', 'health'], popularity: 58 },
  { id: 'dew-point', name: 'Dew Point Calculator', description: 'Calculate dew point temperature', category: 'Conversions', url: '/dew-point-calculator', matchScore: 0, reason: '', tags: ['dew point', 'weather', 'humidity', 'forecasting'], popularity: 52 },
  { id: 'bandwidth', name: 'Bandwidth Calculator', description: 'Calculate download/upload times', category: 'Conversions', url: '/bandwidth-calculator', matchScore: 0, reason: '', tags: ['bandwidth', 'internet', 'speed', 'technology'], popularity: 60 },

  // Time & Date Calculators
  { id: 'age', name: 'Age Calculator', description: 'Calculate exact age', category: 'Time & Date', url: '/age-calculator', matchScore: 0, reason: '', tags: ['age', 'time', 'calculation', 'personal'], popularity: 85 },
  { id: 'date', name: 'Date Calculator', description: 'Add or subtract dates', category: 'Time & Date', url: '/date-calculator', matchScore: 0, reason: '', tags: ['date', 'time', 'calculation', 'planning'], popularity: 78 },
  { id: 'time', name: 'Time Calculator', description: 'Calculate time differences', category: 'Time & Date', url: '/time-calculator', matchScore: 0, reason: '', tags: ['time', 'difference', 'calculation', 'scheduling'], popularity: 75 },
  { id: 'time-duration', name: 'Time Duration Calculator', description: 'Calculate duration between dates and times', category: 'Time & Date', url: '/time-duration-calculator', matchScore: 0, reason: '', tags: ['duration', 'time', 'calculation', 'project'], popularity: 68 },
  { id: 'day-counter', name: 'Day Counter', description: 'Count days between two dates', category: 'Time & Date', url: '/day-counter-calculator', matchScore: 0, reason: '', tags: ['days', 'count', 'date', 'planning'], popularity: 62 },
  { id: 'day-of-week', name: 'Day of Week Calculator', description: 'Find what day of the week any date falls on', category: 'Time & Date', url: '/day-of-week-calculator', matchScore: 0, reason: '', tags: ['day', 'week', 'date', 'planning'], popularity: 58 },

  // Education Calculators
  { id: 'gpa', name: 'GPA Calculator', description: 'Calculate Grade Point Average', category: 'Education', url: '/gpa-calculator', matchScore: 0, reason: '', tags: ['gpa', 'grade', 'education', 'academic'], popularity: 82 },
  { id: 'grade', name: 'Grade Calculator', description: 'Calculate final grades', category: 'Education', url: '/grade-calculator', matchScore: 0, reason: '', tags: ['grade', 'education', 'calculation', 'academic'], popularity: 78 },
  { id: 'percentage-grade', name: 'Percentage to Grade', description: 'Convert percentages to letter grades', category: 'Education', url: '/percentage-grade-calculator', matchScore: 0, reason: '', tags: ['percentage', 'grade', 'conversion', 'academic'], popularity: 75 },
  { id: 'scholarship', name: 'Scholarship Calculator', description: 'Calculate scholarship eligibility', category: 'Education', url: '/calculators/scholarship', matchScore: 0, reason: '', tags: ['scholarship', 'education', 'eligibility', 'financial'], popularity: 70 },

  // Other Calculators
  { id: 'salary', name: 'Salary Calculator', description: 'Calculate take-home pay', category: 'Other', url: '/calculators/salary', matchScore: 0, reason: '', tags: ['salary', 'pay', 'income', 'employment'], popularity: 80 },
  { id: 'ideal-weight', name: 'Ideal Weight Calculator', description: 'Calculate ideal body weight', category: 'Other', url: '/calculators/ideal-weight', matchScore: 0, reason: '', tags: ['weight', 'health', 'ideal', 'fitness'], popularity: 72 },
  { id: 'pregnancy', name: 'Pregnancy Calculator', description: 'Calculate due date', category: 'Other', url: '/calculators/pregnancy', matchScore: 0, reason: '', tags: ['pregnancy', 'due date', 'health', 'family'], popularity: 68 },
  { id: 'hours', name: 'Hours Calculator', description: 'Calculate work hours and overtime', category: 'Other', url: '/calculators/hours', matchScore: 0, reason: '', tags: ['hours', 'work', 'overtime', 'employment'], popularity: 75 },
  { id: 'countdown', name: 'Countdown Timer', description: 'Count down to important dates', category: 'Other', url: '/calculators/countdown', matchScore: 0, reason: '', tags: ['countdown', 'timer', 'date', 'planning'], popularity: 65 }
]

const categories = ['Financial', 'Math & Science', 'Health & Fitness', 'Construction', 'Conversions', 'Time & Date', 'Education', 'Other']
const complexityLevels = ['simple', 'intermediate', 'advanced']
const useCases = ['Personal', 'Business', 'Education', 'Construction', 'Health', 'Financial Planning', 'Travel', 'Shopping']

export default function CalculatorRecommendations() {
  const [userPreferences, setUserPreferences] = useState<UserPreference>({
    category: '',
    tags: [],
    complexity: 'simple',
    useCase: ''
  })
  const [recommendations, setRecommendations] = useState<CalculatorRecommendation[]>([])
  const [showPreferences, setShowPreferences] = useState(true)

  // Calculate match scores based on user preferences
  const calculateRecommendations = useMemo(() => {
    if (!userPreferences.category && userPreferences.tags.length === 0 && !userPreferences.useCase) {
      return allCalculators.sort((a, b) => b.popularity - a.popularity).slice(0, 12)
    }

    const scoredCalculators = allCalculators.map(calculator => {
      let score = 0
      let reason = ''

      // Category match
      if (userPreferences.category && calculator.category === userPreferences.category) {
        score += 30
        reason += 'Matches your preferred category. '
      }

      // Tag matches
      const tagMatches = calculator.tags.filter(tag => 
        userPreferences.tags.includes(tag)
      ).length
      score += tagMatches * 15
      if (tagMatches > 0) {
        reason += `Matches ${tagMatches} of your interests. `
      }

      // Use case match
      if (userPreferences.useCase && calculator.tags.some(tag => 
        tag.toLowerCase().includes(userPreferences.useCase.toLowerCase())
      )) {
        score += 20
        reason += 'Perfect for your use case. '
      }

      // Complexity match
      if (userPreferences.complexity === 'simple' && calculator.popularity > 80) {
        score += 10
        reason += 'Simple and easy to use. '
      } else if (userPreferences.complexity === 'advanced' && calculator.popularity < 70) {
        score += 10
        reason += 'Advanced functionality. '
      }

      // Popularity bonus
      score += calculator.popularity * 0.1

      return {
        ...calculator,
        matchScore: Math.round(score),
        reason: reason || 'Based on general popularity and relevance.'
      }
    })

    return scoredCalculators
      .filter(calc => calc.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 12)
  }, [userPreferences])

  // Update recommendations when preferences change
  useEffect(() => {
    setRecommendations(calculateRecommendations)
  }, [calculateRecommendations])

  // Handle preference changes
  const updatePreference = (field: keyof UserPreference, value: any) => {
    setUserPreferences(prev => ({ ...prev, [field]: value }))
  }

  // Toggle tag selection
  const toggleTag = (tag: string) => {
    setUserPreferences(prev => ({
      ...prev,
      tags: prev.tags.includes(tag) 
        ? prev.tags.filter(t => t !== tag)
        : [...prev.tags, tag]
    }))
  }

  // Get all unique tags
  const allTags = useMemo(() => {
    const tags = new Set<string>()
    allCalculators.forEach(calc => {
      calc.tags.forEach(tag => tags.add(tag))
    })
    return Array.from(tags).sort()
  }, [])

  // Get match score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 bg-green-100'
    if (score >= 60) return 'text-blue-600 bg-blue-100'
    if (score >= 40) return 'text-yellow-600 bg-yellow-100'
    return 'text-gray-600 bg-gray-100'
  }

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Calculator Recommendations</h1>
            <p className="text-amber-100 text-lg">
              Get personalized calculator suggestions based on your preferences, interests, and needs.
            </p>
          </div>
          <div className="hidden md:block">
            <Lightbulb className="w-16 h-16 text-amber-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Preferences Panel */}
        {showPreferences && (
          <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-amber-800">Tell Us About Your Needs</h2>
              <button
                onClick={() => setShowPreferences(false)}
                className="text-amber-600 hover:text-amber-700 text-sm font-medium"
              >
                Hide Preferences
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category Preference */}
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">Preferred Category</label>
                                 <select
                   value={userPreferences.category}
                   onChange={(e) => updatePreference('category', e.target.value)}
                   className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                   title="Select preferred calculator category"
                   aria-label="Select preferred calculator category"
                 >
                  <option value="">Any Category</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              {/* Complexity Level */}
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">Complexity Level</label>
                                 <select
                   value={userPreferences.complexity}
                   onChange={(e) => updatePreference('complexity', e.target.value)}
                   className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                   title="Select complexity level"
                   aria-label="Select complexity level"
                 >
                  {complexityLevels.map(level => (
                    <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                  ))}
                </select>
              </div>

              {/* Use Case */}
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">Primary Use Case</label>
                                 <select
                   value={userPreferences.useCase}
                   onChange={(e) => updatePreference('useCase', e.target.value)}
                   className="w-full px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500"
                   title="Select primary use case"
                   aria-label="Select primary use case"
                 >
                  <option value="">Any Use Case</option>
                  {useCases.map(useCase => (
                    <option key={useCase} value={useCase}>{useCase}</option>
                  ))}
                </select>
              </div>

              {/* Show Preferences Button */}
              <div className="flex items-end">
                <button
                  onClick={() => setShowPreferences(false)}
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Get Recommendations
                </button>
              </div>
            </div>

            {/* Tags Selection */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-amber-800 mb-3">Select Your Interests (Optional)</label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                      userPreferences.tags.includes(tag)
                        ? 'bg-amber-600 text-white'
                        : 'bg-white text-amber-700 border border-amber-300 hover:bg-amber-50'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Show Preferences Button */}
        {!showPreferences && (
          <div className="mb-6">
            <button
              onClick={() => setShowPreferences(true)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md transition-colors"
            >
              <Target className="w-4 h-4 inline mr-2" />
              Adjust Preferences
            </button>
          </div>
        )}

        {/* Recommendations */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {userPreferences.category || userPreferences.tags.length > 0 || userPreferences.useCase
                ? 'Personalized Recommendations'
                : 'Popular Calculators'
              }
            </h2>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Clock className="w-4 h-4" />
              <span>Updated in real-time</span>
            </div>
          </div>

          {recommendations.length === 0 ? (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <Lightbulb className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-600 mb-2">No specific recommendations</h3>
              <p className="text-gray-500">Try adjusting your preferences or browse our popular calculators below.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recommendations.map((calculator, index) => (
                <div key={calculator.id} className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow">
                  {/* Header with Match Score */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800">{calculator.name}</h3>
                      <p className="text-sm text-gray-500">{calculator.category}</p>
                    </div>
                    <div className={`px-2 py-1 rounded-full text-xs font-bold ${getScoreColor(calculator.matchScore)}`}>
                      {calculator.matchScore}%
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-gray-600 mb-4">{calculator.description}</p>

                  {/* Match Reason */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
                    <p className="text-sm text-blue-700">
                      <Lightbulb className="w-4 h-4 inline mr-1" />
                      {calculator.reason}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {calculator.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-yellow-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-medium">{calculator.popularity}</span>
                    </div>
                    <a
                      href={calculator.url}
                      className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center"
                    >
                      Try Calculator
                      <ArrowRight className="w-4 h-4 ml-1" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Additional Suggestions */}
        {recommendations.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-3 flex items-center">
              <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
              Discover More Calculators
            </h3>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {['Search Calculators', 'Compare Tools', 'Browse Categories', 'View Analytics'].map((action, index) => (
                <a
                  key={index}
                  href={index === 0 ? '/search-calculator' : index === 1 ? '/compare-calculators' : '#'}
                  className="bg-white p-4 rounded-lg border border-blue-200 hover:border-blue-300 transition-colors text-center"
                >
                  <div className="text-blue-600 mb-2">
                    {index === 0 ? <Search className="w-6 h-6 mx-auto" /> :
                     index === 1 ? <BarChart3 className="w-6 h-6 mx-auto" /> :
                     index === 2 ? <Calculator className="w-6 h-6 mx-auto" /> :
                     <TrendingUp className="w-6 h-6 mx-auto" />}
                  </div>
                  <p className="text-sm font-medium text-gray-800">{action}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
