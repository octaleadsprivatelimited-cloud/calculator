'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Heart, Ruler, User } from 'lucide-react'

interface BraSizeResult {
  bandSize: number
  cupSize: string
  usSize: string
  ukSize: string
  euSize: string
  auSize: string
  sisterSizes: string[]
  fitNotes: string
  recommendations: string[]
}

interface MeasurementMethod {
  name: string
  description: string
  instructions: string[]
}

const MEASUREMENT_METHODS: MeasurementMethod[] = [
  {
    name: 'Standard Method',
    description: 'Traditional bra fitting method',
    instructions: [
      'Measure around your ribcage, just under your breasts',
      'Add 4-5 inches for even numbers, 5-6 inches for odd numbers',
      'Measure around the fullest part of your bust',
      'Subtract band size from bust measurement to find cup size'
    ]
  },
  {
    name: 'Alternative Method',
    description: 'Modern fitting approach',
    instructions: [
      'Measure snugly around your ribcage under breasts',
      'If even, add 2-4 inches; if odd, add 1-3 inches',
      'Measure around fullest part of bust',
      'Calculate cup size from the difference'
    ]
  }
]

const CUP_SIZES = [
  'AA', 'A', 'B', 'C', 'D', 'DD', 'E', 'F', 'FF', 'G', 'GG', 'H', 'HH', 'I', 'J', 'JJ', 'K', 'KK', 'L', 'LL'
]

const FIT_NOTES = {
  'Band Too Tight': 'Band feels constricting, leaves marks, difficult to breathe',
  'Band Too Loose': 'Band rides up, doesn\'t provide support, slides around',
  'Cup Too Small': 'Breast tissue spills over, quad-boob effect, uncomfortable',
  'Cup Too Large': 'Gaps in cups, wrinkling, doesn\'t provide support',
  'Perfect Fit': 'Comfortable, supportive, no spillage or gaps'
}

export default function BraSizeCalculator() {
  const [underBust, setUnderBust] = useState('')
  const [bust, setBust] = useState('')
  const [measurementMethod, setMeasurementMethod] = useState('Standard Method')
  const [showResults, setShowResults] = useState(false)

  const calculateBraSize = useCallback((): BraSizeResult => {
    const underBustInches = parseFloat(underBust) || 0
    const bustInches = parseFloat(bust) || 0
    
    if (underBustInches === 0 || bustInches === 0) return {
      bandSize: 0,
      cupSize: '',
      usSize: '',
      ukSize: '',
      euSize: '',
      auSize: '',
      sisterSizes: [],
      fitNotes: '',
      recommendations: []
    }

    let bandSize: number
    let cupSize: string
    let usSize: string
    let ukSize: string
    let euSize: string
    let auSize: string

    // Calculate band size based on method
    if (measurementMethod === 'Standard Method') {
      if (underBustInches % 2 === 0) {
        bandSize = underBustInches + 4
      } else {
        bandSize = underBustInches + 5
      }
    } else {
      if (underBustInches % 2 === 0) {
        bandSize = underBustInches + 2
      } else {
        bandSize = underBustInches + 1
      }
    }

    // Calculate cup size
    const difference = bustInches - bandSize
    let cupIndex = 0

    if (difference <= 0) cupIndex = 0 // AA
    else if (difference <= 0.5) cupIndex = 0 // AA
    else if (difference <= 1) cupIndex = 1 // A
    else if (difference <= 1.5) cupIndex = 1 // A
    else if (difference <= 2) cupIndex = 2 // B
    else if (difference <= 2.5) cupIndex = 2 // B
    else if (difference <= 3) cupIndex = 3 // C
    else if (difference <= 3.5) cupIndex = 3 // C
    else if (difference <= 4) cupIndex = 4 // D
    else if (difference <= 4.5) cupIndex = 4 // D
    else if (difference <= 5) cupIndex = 5 // DD
    else if (difference <= 5.5) cupIndex = 5 // DD
    else if (difference <= 6) cupIndex = 6 // E
    else if (difference <= 6.5) cupIndex = 6 // E
    else if (difference <= 7) cupIndex = 7 // F
    else if (difference <= 7.5) cupIndex = 7 // F
    else if (difference <= 8) cupIndex = 8 // FF
    else if (difference <= 8.5) cupIndex = 8 // FF
    else if (difference <= 9) cupIndex = 9 // G
    else if (difference <= 9.5) cupIndex = 9 // G
    else if (difference <= 10) cupIndex = 10 // GG
    else if (difference <= 10.5) cupIndex = 10 // GG
    else if (difference <= 11) cupIndex = 11 // H
    else if (difference <= 11.5) cupIndex = 11 // H
    else if (difference <= 12) cupIndex = 12 // HH
    else if (difference <= 12.5) cupIndex = 12 // HH
    else if (difference <= 13) cupIndex = 13 // I
    else if (difference <= 13.5) cupIndex = 13 // I
    else if (difference <= 14) cupIndex = 14 // J
    else if (difference <= 14.5) cupIndex = 14 // J
    else if (difference <= 15) cupIndex = 15 // JJ
    else if (difference <= 15.5) cupIndex = 15 // JJ
    else if (difference <= 16) cupIndex = 16 // K
    else if (difference <= 16.5) cupIndex = 16 // K
    else if (difference <= 17) cupIndex = 17 // KK
    else if (difference <= 17.5) cupIndex = 17 // KK
    else if (difference <= 18) cupIndex = 18 // L
    else if (difference <= 18.5) cupIndex = 18 // L
    else cupIndex = 19 // LL

    cupSize = CUP_SIZES[Math.min(cupIndex, CUP_SIZES.length - 1)]

    // Create size strings
    usSize = `${bandSize}${cupSize}`
    ukSize = `${bandSize}${cupSize}`
    euSize = `${Math.round(bandSize * 2.54)}${cupSize}`
    auSize = `${bandSize}${cupSize}`

    // Calculate sister sizes
    const sisterSizes: string[] = []
    if (bandSize > 30) {
      sisterSizes.push(`${bandSize - 2}${CUP_SIZES[Math.min(cupIndex + 1, CUP_SIZES.length - 1)]}`)
    }
    if (bandSize < 44) {
      sisterSizes.push(`${bandSize + 2}${CUP_SIZES[Math.min(cupIndex - 1, CUP_SIZES.length - 1)]}`)
    }

    // Determine fit notes
    let fitNotes = ''
    if (difference < 0) fitNotes = 'Band may be too tight, consider going up a band size'
    else if (difference > 18) fitNotes = 'Large cup size, may need specialty bras'
    else fitNotes = 'Standard sizing range'

    // Generate recommendations
    const recommendations: string[] = []
    if (bandSize < 32) recommendations.push('Consider junior sizes or petite bras')
    if (bandSize > 40) recommendations.push('Look for plus-size or full-bust brands')
    if (cupSize === 'AA' || cupSize === 'A') recommendations.push('Try bralettes or wireless options')
    if (cupSize === 'DD' || cupSize === 'E' || cupSize === 'F') recommendations.push('Look for full-bust brands')
    if (cupSize === 'G' || cupSize === 'GG' || cupSize === 'H') recommendations.push('Consider UK or European brands')
    if (cupSize === 'I' || cupSize === 'J' || cupSize === 'JJ') recommendations.push('Specialty full-bust brands recommended')
    if (cupSize === 'K' || cupSize === 'KK' || cupSize === 'L' || cupSize === 'LL') recommendations.push('Professional fitting recommended')

    return {
      bandSize,
      cupSize,
      usSize,
      ukSize,
      euSize,
      auSize,
      sisterSizes,
      fitNotes,
      recommendations
    }
  }, [underBust, bust, measurementMethod])

  const handleCalculate = () => {
    if (underBust && bust) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setUnderBust('')
    setBust('')
    setMeasurementMethod('Standard Method')
    setShowResults(false)
  }

  const handleQuickMethod = (method: MeasurementMethod) => {
    setMeasurementMethod(method.name)
  }

  const formatNumber = (num: number) => {
    if (isNaN(num) || !isFinite(num)) return '0'
    return num.toString()
  }

  const downloadResults = () => {
    const result = calculateBraSize()
    
    const data = `Bra Size Calculator Results

Measurements:
- Under Bust: ${underBust} inches
- Bust: ${bust} inches
- Method: ${measurementMethod}

Results:
- Band Size: ${result.bandSize}
- Cup Size: ${result.cupSize}
- US Size: ${result.usSize}
- UK Size: ${result.ukSize}
- EU Size: ${result.euSize}
- AU Size: ${result.auSize}

Sister Sizes: ${result.sisterSizes.join(', ')}

Fit Notes: ${result.fitNotes}

Recommendations:
${result.recommendations.map(rec => `- ${rec}`).join('\n')}

Measurement Tips:
- Measure without a bra on
- Keep tape measure level and snug
- Take measurements in the morning
- Consider professional fitting for larger cup sizes`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'bra-size-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateBraSize()
      
      navigator.share({
        title: 'Bra Size Calculator Results',
        text: `Bra Size: ${result.usSize}, Band: ${result.bandSize}, Cup: ${result.cupSize}`,
        url: window.location.href
      })
    } else {
      const result = calculateBraSize()
      const text = `Bra Size: ${result.usSize}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateBraSize() : { bandSize: 0, cupSize: '', usSize: '', ukSize: '', euSize: '', auSize: '', sisterSizes: [], fitNotes: '', recommendations: [] }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Bra Size Calculator</h1>
            <p className="text-pink-100 text-lg">
              Calculate your bra size using accurate measurements. Includes international sizing 
              and sister size recommendations for the perfect fit.
            </p>
          </div>
          <div className="hidden md:block">
            <Heart className="w-16 h-16 text-pink-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Measurement Methods */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Measurement Methods</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {MEASUREMENT_METHODS.map((method, index) => (
              <button
                key={index}
                onClick={() => handleQuickMethod(method)}
                className={`p-4 rounded-lg border transition-colors text-left ${
                  measurementMethod === method.name
                    ? 'bg-pink-500 text-white border-pink-500'
                    : 'bg-pink-50 hover:bg-pink-100 border-pink-200 text-gray-700'
                }`}
              >
                <div className="font-semibold">{method.name}</div>
                <div className="text-sm opacity-80">{method.description}</div>
                <div className="text-xs opacity-60 mt-2">
                  {method.instructions.map((instruction, i) => (
                    <div key={i}>• {instruction}</div>
                  ))}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Input Fields */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Measurements */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Your Measurements</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Under Bust (inches)
              </label>
              <input
                type="number"
                value={underBust}
                onChange={(e) => setUnderBust(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="32"
                min="20"
                max="60"
                step="0.5"
                aria-label="Under bust measurement in inches"
              />
              <p className="text-xs text-gray-500 mt-1">Measure around ribcage, just under breasts</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Bust (inches)
              </label>
              <input
                type="number"
                value={bust}
                onChange={(e) => setBust(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                placeholder="36"
                min="24"
                max="80"
                step="0.5"
                aria-label="Bust measurement in inches"
              />
              <p className="text-xs text-gray-500 mt-1">Measure around fullest part of bust</p>
            </div>
          </div>

          {/* Measurement Tips */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Measurement Tips</h3>
            <div className="bg-pink-50 p-4 rounded-lg border border-pink-200">
              <h4 className="font-semibold text-pink-800 mb-2">How to Measure</h4>
              <div className="text-sm text-pink-700 space-y-2">
                <div>• Measure without a bra on</div>
                <div>• Keep tape measure level and snug</div>
                <div>• Take measurements in the morning</div>
                <div>• Stand naturally, don't hold breath</div>
                <div>• Measure in inches for best accuracy</div>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2">Current Method</h4>
              <div className="text-sm text-gray-600">
                <div className="font-medium">{measurementMethod}</div>
                <div className="text-xs text-gray-500 mt-1">
                  {MEASUREMENT_METHODS.find(m => m.name === measurementMethod)?.description}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        {underBust && bust && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-pink-500 hover:bg-pink-600 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Bra Size</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Bra Size Results */}
            <div className="bg-pink-50 p-6 rounded-lg border border-pink-200">
              <h3 className="text-lg font-semibold text-pink-800 mb-4">Your Bra Size Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-pink-700">{result.bandSize}</div>
                  <div className="text-sm text-gray-600">Band Size</div>
                  <div className="text-xs text-pink-600">Ribcage measurement</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{result.cupSize}</div>
                  <div className="text-sm text-gray-600">Cup Size</div>
                  <div className="text-xs text-blue-600">Bust volume</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{result.usSize}</div>
                  <div className="text-sm text-gray-600">US Size</div>
                  <div className="text-xs text-green-600">Primary size</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">{result.ukSize}</div>
                  <div className="text-sm text-gray-600">UK Size</div>
                  <div className="text-xs text-purple-600">International</div>
                </div>
              </div>
            </div>

            {/* International Sizes */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">International Sizing</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Size Conversions</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">US Size:</span>
                      <span className="font-semibold text-pink-700">{result.usSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">UK Size:</span>
                      <span className="font-semibold text-blue-700">{result.ukSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">EU Size:</span>
                      <span className="font-semibold text-green-700">{result.euSize}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">AU Size:</span>
                      <span className="font-semibold text-purple-700">{result.auSize}</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Sister Sizes</h4>
                  <div className="space-y-2 text-sm">
                    {result.sisterSizes.length > 0 ? (
                      result.sisterSizes.map((size, index) => (
                        <div key={index} className="flex justify-between">
                          <span className="text-gray-600">Alternative {index + 1}:</span>
                          <span className="font-semibold text-orange-700">{size}</span>
                        </div>
                      ))
                    ) : (
                      <div className="text-gray-500">No sister sizes available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Fit Information */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Fit Information</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Fit Notes</h4>
                  <div className="text-sm text-gray-700">{result.fitNotes}</div>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Recommendations</h4>
                  <div className="space-y-1 text-sm">
                    {result.recommendations.map((rec, index) => (
                      <div key={index} className="text-gray-700">• {rec}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={downloadResults}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={shareResults}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={printResults}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Bra Size Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive bra size calculator helps individuals determine their accurate bra size 
              using multiple measurement methods and international sizing standards. This essential 
              fitting tool provides precise size calculations, sister size recommendations, and 
              personalized fit guidance to ensure comfort and support for all body types.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Band Size:</strong> Numerical band measurement (30-44+)</li>
              <li><strong>Cup Size:</strong> Letter cup measurement (AA-LL+)</li>
              <li><strong>International Sizing:</strong> US, UK, EU, and AU conversions</li>
              <li><strong>Sister Sizes:</strong> Alternative size options for better fit</li>
              <li><strong>Fit Analysis:</strong> Personalized fit notes and recommendations</li>
              <li><strong>Brand Guidance:</strong> Recommendations based on size range</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Measurement Methods</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Standard Method</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Under bust measurement</li>
                  <li>Bust measurement at fullest point</li>
                  <li>Most accurate for most people</li>
                  <li>Industry standard approach</li>
                  <li>Good for all body types</li>
                  <li>Widely supported by brands</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Alternative Methods</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Modern fitting approaches</li>
                  <li>Body shape considerations</li>
                  <li>Comfort-focused sizing</li>
                  <li>Specialty brand methods</li>
                  <li>Professional fitting techniques</li>
                  <li>Custom sizing approaches</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">International Sizing Systems</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">US Sizing</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Band sizes: 30-44+</li>
                  <li>Cup sizes: AA, A, B, C, D, DD, DDD, G, H, I, J</li>
                  <li>Most common in North America</li>
                  <li>Standard retail sizing</li>
                  <li>Easy to find in stores</li>
                  <li>Good starting point</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">UK Sizing</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Band sizes: 28-46+</li>
                  <li>Cup sizes: AA, A, B, C, D, DD, E, F, FF, G, GG, H, HH</li>
                  <li>More cup size options</li>
                  <li>Better for larger cup sizes</li>
                  <li>Professional fitting standard</li>
                  <li>Full-bust brand sizing</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                <h5 className="font-semibold text-pink-800 mb-1">Band Size</h5>
                <p className="text-pink-700 text-sm">Numerical measurement</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Cup Size</h5>
                <p className="text-purple-700 text-sm">Letter measurement</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Sister Sizes</h5>
                <p className="text-orange-700 text-sm">Alternative options</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Measure your under bust (ribcage) and bust (fullest point) in inches. Choose your 
              preferred measurement method, and the calculator will provide your bra size in multiple 
              international standards along with sister sizes and personalized recommendations.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Measurement Techniques</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Under Bust Measurement:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Measure around ribcage</li>
                    <li>Below breast tissue</li>
                    <li>Keep tape level and snug</li>
                    <li>Don't compress skin</li>
                    <li>Measure while standing</li>
                    <li>Exhale normally</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Bust Measurement:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Measure at fullest point</li>
                    <li>Keep tape level</li>
                    <li>Don't compress breasts</li>
                    <li>Measure without a bra</li>
                    <li>Stand naturally</li>
                    <li>Consider natural movement</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Sister Size System</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Band Size Changes:</strong> Go up band, down cup (32D → 34C)</li>
              <li><strong>Cup Volume:</strong> Same cup volume, different band</li>
              <li><strong>Fit Adjustments:</strong> When standard size doesn't fit</li>
              <li><strong>Brand Variations:</strong> Different brands may fit differently</li>
              <li><strong>Comfort Options:</strong> Alternative sizes for comfort</li>
              <li><strong>Availability:</strong> More size options in stores</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Size Range Considerations</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Smaller Sizes</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Band sizes 28-32</li>
                  <li>Cup sizes AA-B</li>
                  <li>Junior sizes available</li>
                  <li>Petite options</li>
                  <li>Bralettes work well</li>
                  <li>Wireless options</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Larger Sizes</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Band sizes 40+</li>
                  <li>Cup sizes F+</li>
                  <li>Plus-size brands</li>
                  <li>Full-bust specialists</li>
                  <li>Professional fitting</li>
                  <li>Custom options</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Fitting Issues</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Band Too Tight:</strong> Red marks, difficulty breathing</li>
              <li><strong>Band Too Loose:</strong> Riding up, no support</li>
              <li><strong>Cup Too Small:</strong> Spillage, quad boob</li>
              <li><strong>Cup Too Large:</strong> Gaping, wrinkling</li>
              <li><strong>Straps Falling:</strong> Band too loose, wrong size</li>
              <li><strong>Wire Issues:</strong> Wrong cup size or shape</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Brand and Style Considerations</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Brand Variations:</strong> Sizing can differ between brands</li>
              <li><strong>Style Differences:</strong> Balcony, plunge, full-cup fit differently</li>
              <li><strong>Material Impact:</strong> Stretch vs. non-stretch fabrics</li>
              <li><strong>Seasonal Changes:</strong> Body changes throughout the year</li>
              <li><strong>Age Considerations:</strong> Sizing needs change with age</li>
              <li><strong>Body Changes:</strong> Weight, pregnancy, hormones affect size</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Professional Fitting</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>When to Get Fitted:</strong> Large cup sizes, unusual proportions</li>
              <li><strong>Professional Benefits:</strong> Expert measurement, multiple brands</li>
              <li><strong>Specialty Stores:</strong> Full-bust boutiques, lingerie specialists</li>
              <li><strong>Department Stores:</strong> Trained fitters, multiple options</li>
              <li><strong>Online Fitting:</strong> Virtual consultations, video calls</li>
              <li><strong>Regular Check-ups:</strong> Re-measure every 6-12 months</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Shopping Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Try Multiple Sizes:</strong> Start with calculated size, adjust as needed</li>
              <li><strong>Brand Research:</strong> Read reviews, check size charts</li>
              <li><strong>Style Selection:</strong> Choose styles that work with your shape</li>
              <li><strong>Comfort Priority:</strong> Support should feel comfortable</li>
              <li><strong>Return Policies:</strong> Check return options before buying</li>
              <li><strong>Professional Help:</strong> Don't hesitate to ask for assistance</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Body Shape Considerations</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Full on Top:</strong> Balcony, demi-cup styles work well</li>
              <li><strong>Full on Bottom:</strong> Full-cup, plunge styles recommended</li>
              <li><strong>Even Distribution:</strong> Most styles work well</li>
              <li><strong>Wide Set:</strong> Side support, wider gore helpful</li>
              <li><strong>Close Set:</strong> Narrow gore, plunge styles better</li>
              <li><strong>Asymmetric:</strong> Adjustable straps, removable padding</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-pink-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Remember that bra sizing is both a science and an art. While this calculator provides 
                an excellent starting point, the perfect fit may require trying a few sizes and styles. 
                Don't be discouraged if the calculated size doesn't feel right - bra fitting varies 
                significantly between brands and styles. Also, consider that your bra size may change 
                throughout your life due to weight fluctuations, pregnancy, aging, and other factors. 
                Regular re-measuring ensures you always have the best fit for comfort and support.
              </p>
            </div>
          </div>
        </div>

        {/* Info Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Bra Size Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This comprehensive bra size calculator uses accurate measurement methods to determine your perfect bra size. 
                It provides international sizing conversions, sister size recommendations, and fit guidance. The calculator 
                supports both traditional and modern fitting approaches, making it suitable for various body types and 
                preferences. Remember that bra fitting can vary between brands, so this serves as a starting point.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
