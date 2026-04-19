'use client'

import React, { useState, useEffect, useCallback, memo } from 'react'
import { Calculator, TrendingUp, Heart, Clock, GraduationCap, Wrench, Globe, X, Search } from 'lucide-react'

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
    icon: <TrendingUp className="w-6 h-6 text-green-600" />,
    description: 'Calculate loans, mortgages, investments, and more',
    calculators: [
      { id: 'mortgage', name: 'Mortgage Calculator', description: 'Monthly mortgage payments', url: '/mortgage-calculator' },
      { id: 'loan', name: 'Loan Calculator', description: 'Loan payments and interest', url: '/loan-calculator' },
      { id: 'auto-loan', name: 'Auto Loan Calculator', description: 'Car loan payments', url: '/auto-loan-calculator' },
      { id: 'investment', name: 'Investment Calculator', description: 'Investment returns', url: '/investment-calculator' },
      { id: 'retirement', name: 'Retirement Calculator', description: 'Retirement savings plan', url: '/retirement-calculator' },
      { id: 'compound-interest', name: 'Compound Interest', description: 'Compound interest growth', url: '/compound-interest-calculator' },
      { id: 'simple-interest', name: 'Simple Interest', description: 'Simple interest calculation', url: '/simple-interest-calculator' },
      { id: 'discount', name: 'Discount Calculator', description: 'Discounts and savings', url: '/discount-calculator' },
      { id: 'tip', name: 'Tip Calculator', description: 'Tips and split bills', url: '/tip-calculator' },
      { id: 'income-tax', name: 'Income Tax Calculator', description: 'Income tax liability', url: '/income-tax-calculator' },
      { id: 'salary', name: 'Salary Calculator', description: 'Take-home pay', url: '/calculators/salary' }
    ]
  },
  {
    id: 'math',
    name: 'Math Calculators',
    icon: <Calculator className="w-8 h-8 text-blue-600" />,
    description: 'Advanced mathematical calculations and functions',
    calculators: [
      { id: 'scientific', name: 'Scientific Calculator', description: 'Advanced scientific functions', url: '/scientific-calculator' },
      { id: 'binary', name: 'Binary Calculator', description: 'Binary arithmetic and bitwise operations', url: '/binary-calculator' },
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
      { id: 'bandwidth', name: 'Bandwidth Calculator', description: 'Download/upload times', url: '/bandwidth-calculator' },
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
  },
  {
    id: 'lifestyle',
    name: 'Lifestyle & Social',
    icon: <Heart className="w-8 h-8 text-pink-600" />,
    description: 'Generators and calculators for social and lifestyle needs',
    calculators: [
      { id: 'marriage-biodata', name: 'Marriage Biodata Generator', description: 'Create professional matrimony resumes', url: '/marriage-biodata-generator' },
      { id: 'love', name: 'Love Calculator', description: 'Calculate compatibility between two people', url: '/love-calculator' },
      { id: 'quotation', name: 'Quotation Generator', description: 'Generate professional business quotes', url: '/quotation-generator' }
    ]
  }
]

export default function PageCalculator() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  
  // Calculator state
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  // Calculator functions
  const performCalculation = useCallback((firstValue: number, secondValue: number, op: string): number => {
    switch (op) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0
      default:
        return secondValue
    }
  }, [])

  const handleCalculatorInput = useCallback((input: string) => {
    switch (input) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        if (waitingForOperand) {
          setDisplay(input)
          setWaitingForOperand(false)
        } else {
          setDisplay(display === '0' ? input : display + input)
        }
        break
      
      case '.':
        if (waitingForOperand) {
          setDisplay('0.')
          setWaitingForOperand(false)
        } else if (display.indexOf('.') === -1) {
          setDisplay(display + '.')
        }
        break
      
      case 'C':
        setDisplay('0')
        setPreviousValue(null)
        setOperation(null)
        setWaitingForOperand(false)
        break
      
      case '⌫':
        if (display.length === 1) {
          setDisplay('0')
        } else {
          setDisplay(display.slice(0, -1))
        }
        break
      
      case '+/-':
        setDisplay(String(parseFloat(display) * -1))
        break
      
      case '%':
        setDisplay(String(parseFloat(display) / 100))
        break
      
      case '+':
      case '-':
      case '×':
      case '÷':
        const inputValue = parseFloat(display)
        
        if (previousValue === null) {
          setPreviousValue(inputValue)
        } else if (operation) {
          const result = performCalculation(previousValue, inputValue, operation)
          setDisplay(String(result))
          setPreviousValue(result)
        }
        
        setWaitingForOperand(true)
        setOperation(input)
        break
      
      case '=':
        if (previousValue !== null && operation) {
          const inputValue = parseFloat(display)
          const result = performCalculation(previousValue, inputValue, operation)
          setDisplay(String(result))
          setPreviousValue(null)
          setOperation(null)
          setWaitingForOperand(false)
        }
        break
    }
  }, [display, previousValue, operation, waitingForOperand, performCalculation])


  // Keyboard input support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key
      
      if (key >= '0' && key <= '9') {
        handleCalculatorInput(key)
      } else if (key === '.') {
        handleCalculatorInput('.')
      } else if (key === '+') {
        handleCalculatorInput('+')
      } else if (key === '-') {
        handleCalculatorInput('-')
      } else if (key === '*') {
        handleCalculatorInput('×')
      } else if (key === '/') {
        handleCalculatorInput('÷')
      } else if (key === 'Enter' || key === '=') {
        handleCalculatorInput('=')
      } else if (key === 'Escape') {
        handleCalculatorInput('C')
      } else if (key === 'Backspace') {
        handleCalculatorInput('⌫')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [handleCalculatorInput])

  // Clear search and URL parameter
  const clearSearch = () => {
    setSearchTerm('')
    // Clear URL search parameter
    const url = new URL(window.location.href)
    url.searchParams.delete('q')
    url.searchParams.delete('search')
    window.history.replaceState({}, '', url.toString())
  }

  // Get search query from URL if present — sanitize before setting state
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const raw = urlParams.get('q') || urlParams.get('search')
    if (raw) {
      // Strip dangerous characters, limit length
      const safe = raw.replace(/[<>"'`]/g, '').slice(0, 200)
      if (safe) setSearchTerm(safe)
    }
  }, [])

  // Update URL when search term changes — use URLSearchParams to safely encode
  useEffect(() => {
    if (searchTerm) {
      const url = new URL(window.location.href)
      // URLSearchParams.set automatically encodes the value safely
      url.searchParams.set('q', searchTerm.slice(0, 200))
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
    <div className="min-h-screen bg-google-bg text-google-text">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 py-4 sm:py-6 lg:py-8">
        {/* Welcome Section */}
        <div className="text-center mb-6 sm:mb-10">
          <p className="text-sm sm:text-base lg:text-lg text-google-gray max-w-3xl mx-auto mb-4 sm:mb-6 font-medium">
            200+ free calculators
          </p>
          
          {/* Calculator Widget — Clean Google-style */}
          <div className="w-full max-w-[300px] sm:max-w-[340px] mx-auto bg-white rounded-2xl overflow-hidden" style={{boxShadow: '0 2px 10px rgba(60,64,67,0.15), 0 1px 3px rgba(60,64,67,0.1)'}}>
            {/* Display */}
            <div className="bg-white px-5 pt-5 pb-3">
              <div className="text-right">
                <div className="text-google-gray text-xs h-4 mb-1 truncate">
                  {operation ? `${previousValue} ${operation}` : ''}
                </div>
                <div className="text-google-text font-light tracking-tight break-all" style={{fontSize: display.length > 10 ? '1.75rem' : '2.5rem', lineHeight: 1.1}}>
                  {display.includes('.') && display.endsWith('0') ? display : 
                   display.endsWith('.') ? display :
                   Number(display).toLocaleString('en-US', { maximumFractionDigits: 10 })}
                </div>
              </div>
            </div>
            {/* Divider */}
            <div className="h-px bg-google-border mx-4" />
            {/* Buttons */}
            <div className="p-3 grid grid-cols-4 gap-1.5">
              {[
                { label: 'AC',  action: 'C',  cls: 'text-google-red   bg-transparent hover:bg-red-50',   span: 1 },
                { label: '+/-', action: '+/-', cls: 'text-google-blue  bg-transparent hover:bg-blue-50', span: 1 },
                { label: '%',   action: '%',  cls: 'text-google-blue  bg-transparent hover:bg-blue-50', span: 1 },
                { label: '÷',   action: '÷',  cls: 'text-google-blue  bg-transparent hover:bg-blue-50 font-semibold', span: 1 },
                { label: '7',   action: '7',  cls: 'text-google-text  bg-transparent hover:bg-google-lightGray', span: 1 },
                { label: '8',   action: '8',  cls: 'text-google-text  bg-transparent hover:bg-google-lightGray', span: 1 },
                { label: '9',   action: '9',  cls: 'text-google-text  bg-transparent hover:bg-google-lightGray', span: 1 },
                { label: '×',   action: '×',  cls: 'text-google-blue  bg-transparent hover:bg-blue-50 font-semibold', span: 1 },
                { label: '4',   action: '4',  cls: 'text-google-text  bg-transparent hover:bg-google-lightGray', span: 1 },
                { label: '5',   action: '5',  cls: 'text-google-text  bg-transparent hover:bg-google-lightGray', span: 1 },
                { label: '6',   action: '6',  cls: 'text-google-text  bg-transparent hover:bg-google-lightGray', span: 1 },
                { label: '-',   action: '-',  cls: 'text-google-blue  bg-transparent hover:bg-blue-50 font-semibold', span: 1 },
                { label: '1',   action: '1',  cls: 'text-google-text  bg-transparent hover:bg-google-lightGray', span: 1 },
                { label: '2',   action: '2',  cls: 'text-google-text  bg-transparent hover:bg-google-lightGray', span: 1 },
                { label: '3',   action: '3',  cls: 'text-google-text  bg-transparent hover:bg-google-lightGray', span: 1 },
                { label: '+',   action: '+',  cls: 'text-google-blue  bg-transparent hover:bg-blue-50 font-semibold', span: 1 },
                { label: '⌫',  action: '⌫', cls: 'text-google-gray  bg-transparent hover:bg-google-lightGray', span: 1 },
                { label: '0',   action: '0',  cls: 'text-google-text  bg-transparent hover:bg-google-lightGray', span: 1 },
                { label: '.',   action: '.',  cls: 'text-google-text  bg-transparent hover:bg-google-lightGray', span: 1 },
                { label: '=',   action: '=',  cls: 'text-white        bg-google-blue hover:bg-google-blueHover shadow-sm', span: 1 },
              ].map(({ label, action, cls, span }) => (
                <button
                  key={label}
                  onClick={() => handleCalculatorInput(action)}
                  className={`${cls} ${span === 2 ? 'col-span-2' : ''} h-12 sm:h-13 rounded-xl text-base sm:text-lg transition-colors touch-manipulation select-none font-normal`}
                  aria-label={label}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-google-gray mt-2 text-center hidden sm:block">
            Keyboard supported · Numbers · + − × ÷ · Enter · Esc
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search calculators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 sm:py-4 text-sm sm:text-base bg-white border border-google-border rounded-full shadow-google hover:shadow-google-hover focus:shadow-google-hover focus:outline-none transition-shadow pl-10 sm:pl-12 pr-10 sm:pr-12 text-google-text placeholder-google-gray"
              />
              <Search className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 w-4 h-4 sm:w-5 sm:h-5 text-google-gray" />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-1 text-google-gray hover:text-google-text transition-colors touch-manipulation"
                  aria-label="Clear search"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Category Filter — horizontal scroll on mobile */}
        <div className="mb-6 sm:mb-8">
          <div className="flex gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center scrollbar-hide">
            {[{ id: null, label: 'All' }, ...calculatorCategories.map(c => ({ id: c.id, label: c.name.replace(' Calculators', '') }))].map(({ id, label }) => (
              <button
                key={String(id)}
                onClick={() => setSelectedCategory(id as string | null)}
                className={`flex-shrink-0 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg font-medium text-xs sm:text-sm transition-colors border touch-manipulation ${
                  selectedCategory === id
                    ? 'bg-google-blueLight text-google-blue border-google-blueLight'
                    : 'bg-white text-google-gray border-google-border active:bg-google-lightGray'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchTerm && (
          <div className="mb-6 sm:mb-8">
            <h2 className="text-lg sm:text-xl font-medium text-google-text mb-4">
              Results for &ldquo;{searchTerm}&rdquo;
            </h2>
            {filteredCalculators.length === 0 ? (
              <div className="text-center py-10 bg-white rounded-2xl border border-google-border">
                <Calculator className="w-12 h-12 text-google-gray mx-auto mb-3 opacity-40" />
                <h3 className="text-base font-medium text-google-gray mb-1">No calculators found</h3>
                <p className="text-sm text-google-gray">Try different keywords or browse categories</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {filteredCalculators.map(calculator => (
                  <a
                    key={calculator.id}
                    href={calculator.url}
                    className="bg-white rounded-xl p-4 border border-google-border hover:bg-google-lightGray active:bg-google-lightGray transition-colors block group touch-manipulation"
                  >
                    <h3 className="text-sm font-medium text-google-blue group-hover:underline mb-1">
                      {calculator.name}
                    </h3>
                    <p className="text-xs text-google-gray leading-relaxed">
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
          <div className="space-y-4 sm:space-y-6">
            {filteredCategories.map(category => (
              <div key={category.id} className="bg-white rounded-2xl sm:rounded-3xl border border-google-border p-4 sm:p-6 lg:p-8">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <span className="flex-shrink-0">{category.icon}</span>
                  <div>
                    <h2 className="text-lg sm:text-xl font-normal text-google-text">{category.name}</h2>
                    <p className="text-google-gray text-xs sm:text-sm">{category.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-3">
                  {category.calculators.map(calculator => (
                    <a
                      key={calculator.id}
                      href={calculator.url}
                      className="bg-google-bg rounded-xl p-3 sm:p-4 hover:bg-google-lightGray active:bg-google-lightGray transition-colors border border-google-border block group touch-manipulation"
                    >
                      <h3 className="font-medium text-google-blue group-hover:underline text-xs sm:text-sm mb-0.5 sm:mb-1 line-clamp-2">
                        {calculator.name}
                      </h3>
                      <p className="text-[11px] sm:text-xs text-google-gray leading-relaxed line-clamp-2 hidden sm:block">
                        {calculator.description}
                      </p>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer note */}
        <div className="text-center py-6 sm:py-8 border-t border-google-border mt-6">
          <p className="text-google-gray text-xs sm:text-sm mb-1">
            Online Calculator.live — fast, free, and accurate calculators for every need.
          </p>
          <p className="text-google-gray text-[11px] sm:text-xs">
            © {new Date().getFullYear()} Online Calculator.live · No registration required
          </p>
        </div>
      </div>
    </div>
  )
}

