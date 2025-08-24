'use client'

import React, { useState, useMemo } from 'react'
import { BarChart3, Calculator, Star, CheckCircle, X, Plus, ArrowRight } from 'lucide-react'

interface CalculatorInfo {
  id: string
  name: string
  description: string
  category: string
  features: string[]
  pros: string[]
  cons: string[]
  bestFor: string[]
  url: string
  popularity: number
}

const availableCalculators: CalculatorInfo[] = [
  {
    id: 'mortgage',
    name: 'Mortgage Calculator',
    description: 'Calculate monthly mortgage payments, interest, and amortization',
    category: 'Financial',
    features: ['Monthly payment calculation', 'Interest rate analysis', 'Amortization schedule', 'Down payment options', 'Property tax inclusion'],
    pros: ['Comprehensive financial planning', 'Easy to use interface', 'Detailed breakdowns', 'Multiple loan types'],
    cons: ['Requires accurate input data', 'Estimates only'],
    bestFor: ['Home buyers', 'Real estate investors', 'Financial planning', 'Loan comparison'],
    url: '/mortgage-calculator',
    popularity: 95
  },
  {
    id: 'bmi',
    name: 'BMI Calculator',
    description: 'Calculate Body Mass Index and health metrics',
    category: 'Health & Fitness',
    features: ['BMI calculation', 'Weight category classification', 'Health risk assessment', 'Metric/Imperial units', 'Age considerations'],
    pros: ['Quick health assessment', 'Standardized measurement', 'Easy to understand', 'Free and accessible'],
    cons: ['Limited health picture', 'Doesn\'t account for muscle mass', 'Age and gender variations'],
    bestFor: ['Health monitoring', 'Fitness goals', 'Medical consultations', 'Weight management'],
    url: '/bmi-calculator',
    popularity: 92
  },
  {
    id: 'scientific',
    name: 'Scientific Calculator',
    description: 'Advanced mathematical and scientific calculations',
    category: 'Math & Science',
    features: ['Trigonometric functions', 'Logarithmic calculations', 'Statistical functions', 'Memory functions', 'Parentheses support'],
    pros: ['Comprehensive functionality', 'Professional grade', 'Multiple calculation modes', 'High precision'],
    cons: ['Complex interface', 'Learning curve', 'Overkill for simple math'],
    bestFor: ['Students', 'Engineers', 'Scientists', 'Advanced calculations'],
    url: '/scientific-calculator',
    popularity: 90
  },
  {
    id: 'percentage',
    name: 'Percentage Calculator',
    description: 'Calculate percentages, increases, decreases, and ratios',
    category: 'Math & Science',
    features: ['Basic percentage calculation', 'Percentage increase/decrease', 'Ratio calculations', 'Fraction conversion', 'Discount calculations'],
    pros: ['Simple and intuitive', 'Multiple calculation types', 'Quick results', 'Everyday use'],
    cons: ['Basic functionality', 'Limited advanced features'],
    bestFor: ['Shopping discounts', 'Grade calculations', 'Financial percentages', 'General math'],
    url: '/percentage-calculator',
    popularity: 88
  },
  {
    id: 'tire-size',
    name: 'Tire Size Calculator',
    description: 'Compare tire sizes and calculate speedometer differences',
    category: 'Conversions',
    features: ['Tire size comparison', 'Speedometer accuracy', 'Circumference calculation', 'Revolutions per mile', 'Clearance analysis'],
    pros: ['Automotive specific', 'Detailed specifications', 'Safety considerations', 'Professional use'],
    cons: ['Limited to automotive', 'Requires technical knowledge'],
    bestFor: ['Car enthusiasts', 'Mechanics', 'Tire shops', 'Vehicle modifications'],
    url: '/tire-size-calculator',
    popularity: 65
  },
  {
    id: 'tile',
    name: 'Tile Calculator',
    description: 'Calculate tile materials and costs for projects',
    category: 'Construction',
    features: ['Area calculation', 'Material estimation', 'Cost calculation', 'Waste factor', 'Multiple tile sizes'],
    pros: ['Project planning', 'Cost estimation', 'Material optimization', 'Professional use'],
    cons: ['Construction specific', 'Requires measurements'],
    bestFor: ['Contractors', 'DIY projects', 'Home renovations', 'Project planning'],
    url: '/tile-calculator',
    popularity: 65
  },
  {
    id: 'wind-chill',
    name: 'Wind Chill Calculator',
    description: 'Calculate wind chill factor and safety levels',
    category: 'Conversions',
    features: ['Wind chill calculation', 'Temperature conversion', 'Safety warnings', 'Weather planning', 'Outdoor activity guidance'],
    pros: ['Weather safety', 'Outdoor planning', 'Health considerations', 'Seasonal use'],
    cons: ['Weather dependent', 'Limited application'],
    bestFor: ['Outdoor workers', 'Athletes', 'Weather monitoring', 'Safety planning'],
    url: '/wind-chill-calculator',
    popularity: 55
  },
  {
    id: 'time-duration',
    name: 'Time Duration Calculator',
    description: 'Calculate duration between dates and times',
    category: 'Time & Date',
    features: ['Date range calculation', 'Time difference', 'Business days', 'Holiday exclusion', 'Multiple formats'],
    pros: ['Flexible input formats', 'Business day calculation', 'Multiple output formats', 'Project planning'],
    cons: ['Date input required', 'Timezone considerations'],
    bestFor: ['Project management', 'Event planning', 'Business calculations', 'Personal scheduling'],
    url: '/time-duration-calculator',
    popularity: 68
  }
]

export default function CalculatorComparison() {
  const [selectedCalculators, setSelectedCalculators] = useState<string[]>(['mortgage', 'bmi'])
  const [showCalculatorSelector, setShowCalculatorSelector] = useState(false)

  // Get selected calculator details
  const selectedCalculatorDetails = useMemo(() => {
    return selectedCalculators.map(id => 
      availableCalculators.find(calc => calc.id === id)
    ).filter(Boolean) as CalculatorInfo[]
  }, [selectedCalculators])

  // Add calculator to comparison
  const addCalculator = (calculatorId: string) => {
    if (!selectedCalculators.includes(calculatorId) && selectedCalculators.length < 4) {
      setSelectedCalculators(prev => [...prev, calculatorId])
    }
  }

  // Remove calculator from comparison
  const removeCalculator = (calculatorId: string) => {
    if (selectedCalculators.length > 2) {
      setSelectedCalculators(prev => prev.filter(id => id !== calculatorId))
    }
  }

  // Get unique features across all selected calculators
  const allFeatures = useMemo(() => {
    const features = new Set<string>()
    selectedCalculatorDetails.forEach(calc => {
      calc.features.forEach(feature => features.add(feature))
    })
    return Array.from(features).sort()
  }, [selectedCalculatorDetails])

  // Check if calculator has a specific feature
  const hasFeature = (calculator: CalculatorInfo, feature: string) => {
    return calculator.features.includes(feature)
  }

  // Get unique best-for categories
  const allBestFor = useMemo(() => {
    const categories = new Set<string>()
    selectedCalculatorDetails.forEach(calc => {
      calc.bestFor.forEach(category => categories.add(category))
    })
    return Array.from(categories).sort()
  }, [selectedCalculatorDetails])

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Calculator Comparison Tool</h1>
            <p className="text-indigo-100 text-lg">
              Compare up to 4 calculators side by side. Analyze features, pros, cons, and find the perfect tool for your needs.
            </p>
          </div>
                      <div className="hidden md:block">
              <BarChart3 className="w-16 h-16 text-indigo-200" />
            </div>
        </div>
      </div>

      <div className="p-6">
        {/* Calculator Selection */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Selected Calculators ({selectedCalculators.length}/4)</h2>
            <button
              onClick={() => setShowCalculatorSelector(!showCalculatorSelector)}
              disabled={selectedCalculators.length >= 4}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCalculators.length >= 4
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              <Plus className="w-4 h-4 inline mr-2" />
              Add Calculator
            </button>
          </div>

          {/* Calculator Selector */}
          {showCalculatorSelector && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200 mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Choose Calculators to Compare</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCalculators
                  .filter(calc => !selectedCalculators.includes(calc.id))
                  .map(calculator => (
                    <div key={calculator.id} className="bg-white p-4 rounded-lg border border-gray-200 hover:border-indigo-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-medium text-gray-800">{calculator.name}</h4>
                        <div className="flex items-center space-x-1 text-yellow-500">
                          <Star className="w-3 h-3 fill-current" />
                          <span className="text-xs font-medium">{calculator.popularity}</span>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{calculator.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                          {calculator.category}
                        </span>
                        <button
                          onClick={() => addCalculator(calculator.id)}
                          className="text-indigo-600 hover:text-indigo-700 text-sm font-medium flex items-center"
                        >
                          Add
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Selected Calculators Display */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {selectedCalculatorDetails.map(calculator => (
              <div key={calculator.id} className="bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-800 text-sm">{calculator.name}</h3>
                    <p className="text-xs text-gray-500">{calculator.category}</p>
                  </div>
                  <button
                    onClick={() => removeCalculator(calculator.id)}
                    disabled={selectedCalculators.length <= 2}
                    className={`p-1 rounded-full transition-colors ${
                      selectedCalculators.length <= 2
                        ? 'text-gray-300 cursor-not-allowed'
                        : 'text-red-500 hover:bg-red-50'
                    }`}
                    title={selectedCalculators.length <= 2 ? 'Minimum 2 calculators required' : 'Remove calculator'}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center space-x-1 text-yellow-500 mb-2">
                  <Star className="w-3 h-3 fill-current" />
                  <span className="text-xs font-medium">{calculator.popularity}</span>
                </div>
                <a
                  href={calculator.url}
                  className="text-indigo-600 hover:text-indigo-700 text-xs font-medium flex items-center"
                >
                  Use Calculator
                  <Calculator className="w-3 h-3 ml-1" />
                </a>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        {selectedCalculatorDetails.length >= 2 && (
          <div className="space-y-8">
            {/* Features Comparison */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Features Comparison</h2>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-200 p-3 text-left text-sm font-medium text-gray-700">Feature</th>
                      {selectedCalculatorDetails.map(calc => (
                        <th key={calc.id} className="border border-gray-200 p-3 text-center text-sm font-medium text-gray-700">
                          {calc.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {allFeatures.map(feature => (
                      <tr key={feature} className="hover:bg-gray-50">
                        <td className="border border-gray-200 p-3 text-sm text-gray-700 font-medium">{feature}</td>
                        {selectedCalculatorDetails.map(calc => (
                          <td key={calc.id} className="border border-gray-200 p-3 text-center">
                            {hasFeature(calc, feature) ? (
                              <CheckCircle className="w-5 h-5 text-green-500 mx-auto" />
                            ) : (
                              <X className="w-5 h-5 text-red-400 mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pros and Cons */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Pros */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-green-700">Pros & Advantages</h2>
                <div className="space-y-4">
                  {selectedCalculatorDetails.map(calculator => (
                    <div key={calculator.id} className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <h3 className="font-medium text-green-800 mb-2">{calculator.name}</h3>
                      <ul className="space-y-1">
                        {calculator.pros.map((pro, index) => (
                          <li key={index} className="text-sm text-green-700 flex items-start">
                            <CheckCircle className="w-4 h-4 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cons */}
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4 text-red-700">Cons & Limitations</h2>
                <div className="space-y-4">
                  {selectedCalculatorDetails.map(calculator => (
                    <div key={calculator.id} className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <h3 className="font-medium text-red-800 mb-2">{calculator.name}</h3>
                      <ul className="space-y-1">
                        {calculator.cons.map((con, index) => (
                          <li key={index} className="text-sm text-red-700 flex items-start">
                            <X className="w-4 h-4 text-red-600 mr-2 mt-0.5 flex-shrink-0" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Best For */}
            <div>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Best For</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {allBestFor.map(category => (
                  <div key={category} className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <h3 className="font-medium text-blue-800 mb-2">{category}</h3>
                    <div className="space-y-2">
                      {selectedCalculatorDetails.map(calculator => (
                        <div key={calculator.id} className="flex items-center justify-between">
                          <span className="text-sm text-blue-700">{calculator.name}</span>
                          {calculator.bestFor.includes(category) ? (
                            <CheckCircle className="w-4 h-4 text-blue-600" />
                          ) : (
                            <X className="w-4 h-4 text-blue-400" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Summary */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Comparison Summary</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Most Feature-Rich</h3>
                  <p className="text-sm text-gray-600">
                    {selectedCalculatorDetails.reduce((prev, current) => 
                      prev.features.length > current.features.length ? prev : current
                    ).name} with {Math.max(...selectedCalculatorDetails.map(c => c.features.length))} features
                  </p>
                </div>
                <div>
                  <h3 className="font-medium text-gray-800 mb-2">Most Popular</h3>
                  <p className="text-sm text-gray-600">
                    {selectedCalculatorDetails.reduce((prev, current) => 
                      prev.popularity > current.popularity ? prev : current
                    ).name} with a popularity score of {Math.max(...selectedCalculatorDetails.map(c => c.popularity))}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {selectedCalculatorDetails.length < 2 && (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <BarChart3 className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-600 mb-2">Select Calculators to Compare</h3>
            <p className="text-gray-500">Choose at least 2 calculators to start comparing their features and capabilities.</p>
          </div>
        )}
      </div>
    </div>
  )
}
