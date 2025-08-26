'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Heart, Sparkles, Star } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface LoveResult {
  percentage: number
  compatibility: string
  description: string
  advice: string[]
  emoji: string
}

interface CompatibilityFactors {
  nameCompatibility: number
  zodiacCompatibility: number
  birthDateCompatibility: number
  personalityCompatibility: number
}

const ZODIAC_SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
]

const ZODIAC_COMPATIBILITY: { [key: string]: { [key: string]: number } } = {
  'Aries': { 'Aries': 70, 'Taurus': 60, 'Gemini': 80, 'Cancer': 50, 'Leo': 90, 'Virgo': 40, 'Libra': 75, 'Scorpio': 65, 'Sagittarius': 95, 'Capricorn': 45, 'Aquarius': 85, 'Pisces': 55 },
  'Taurus': { 'Aries': 60, 'Taurus': 85, 'Gemini': 50, 'Cancer': 90, 'Leo': 70, 'Virgo': 95, 'Libra': 80, 'Scorpio': 90, 'Sagittarius': 55, 'Capricorn': 95, 'Aquarius': 45, 'Pisces': 85 },
  'Gemini': { 'Aries': 80, 'Taurus': 50, 'Gemini': 75, 'Cancer': 60, 'Leo': 85, 'Virgo': 70, 'Libra': 95, 'Scorpio': 55, 'Sagittarius': 90, 'Capricorn': 65, 'Aquarius': 95, 'Pisces': 70 },
  'Cancer': { 'Aries': 50, 'Taurus': 90, 'Gemini': 60, 'Cancer': 80, 'Leo': 65, 'Virgo': 85, 'Libra': 70, 'Scorpio': 95, 'Sagittarius': 55, 'Capricorn': 85, 'Aquarius': 50, 'Pisces': 90 },
  'Leo': { 'Aries': 90, 'Taurus': 70, 'Gemini': 85, 'Cancer': 65, 'Leo': 80, 'Virgo': 60, 'Libra': 90, 'Scorpio': 75, 'Sagittarius': 95, 'Capricorn': 70, 'Aquarius': 80, 'Pisces': 65 },
  'Virgo': { 'Aries': 40, 'Taurus': 95, 'Gemini': 70, 'Cancer': 85, 'Leo': 60, 'Virgo': 85, 'Libra': 75, 'Scorpio': 90, 'Sagittarius': 65, 'Capricorn': 95, 'Aquarius': 70, 'Pisces': 85 },
  'Libra': { 'Aries': 75, 'Taurus': 80, 'Gemini': 95, 'Cancer': 70, 'Leo': 90, 'Virgo': 75, 'Libra': 80, 'Scorpio': 80, 'Sagittarius': 85, 'Capricorn': 75, 'Aquarius': 90, 'Pisces': 80 },
  'Scorpio': { 'Aries': 65, 'Taurus': 90, 'Gemini': 55, 'Cancer': 95, 'Leo': 75, 'Virgo': 90, 'Libra': 80, 'Scorpio': 85, 'Sagittarius': 70, 'Capricorn': 90, 'Aquarius': 60, 'Pisces': 95 },
  'Sagittarius': { 'Aries': 95, 'Taurus': 55, 'Gemini': 90, 'Cancer': 55, 'Leo': 95, 'Virgo': 65, 'Libra': 85, 'Scorpio': 70, 'Sagittarius': 80, 'Capricorn': 70, 'Aquarius': 90, 'Pisces': 75 },
  'Capricorn': { 'Aries': 45, 'Taurus': 95, 'Gemini': 65, 'Cancer': 85, 'Leo': 70, 'Virgo': 95, 'Libra': 75, 'Scorpio': 90, 'Sagittarius': 70, 'Capricorn': 85, 'Aquarius': 75, 'Pisces': 90 },
  'Aquarius': { 'Aries': 85, 'Taurus': 45, 'Gemini': 95, 'Cancer': 50, 'Leo': 80, 'Virgo': 70, 'Libra': 90, 'Scorpio': 60, 'Sagittarius': 90, 'Capricorn': 75, 'Aquarius': 80, 'Pisces': 70 },
  'Pisces': { 'Aries': 55, 'Taurus': 85, 'Gemini': 70, 'Cancer': 90, 'Leo': 65, 'Virgo': 85, 'Libra': 80, 'Scorpio': 95, 'Sagittarius': 75, 'Capricorn': 90, 'Aquarius': 70, 'Pisces': 85 }
}

const PERSONALITY_TRAITS = [
  'Romantic', 'Adventurous', 'Practical', 'Creative', 'Analytical',
  'Emotional', 'Logical', 'Spontaneous', 'Organized', 'Free-spirited'
]

const LOVE_ADVICE = {
  '90-100': [
    'You two are soulmates! Your connection is incredibly strong.',
    'This is a once-in-a-lifetime love that should be cherished.',
    'Your compatibility is off the charts - consider yourselves lucky!',
    'This relationship has the potential to last a lifetime.'
  ],
  '80-89': [
    'Excellent compatibility! You have a very strong connection.',
    'Your relationship has great potential for long-term success.',
    'You complement each other perfectly in most areas.',
    'This is a relationship worth investing in and nurturing.'
  ],
  '70-79': [
    'Very good compatibility! You have a solid foundation.',
    'Your relationship shows promise with some effort.',
    'You have more in common than not - focus on your strengths.',
    'With communication, this relationship can grow stronger.'
  ],
  '60-69': [
    'Good compatibility! You have potential with some work.',
    'Your differences can complement each other if embraced.',
    'Focus on communication and understanding each other.',
    'This relationship can work with mutual effort and patience.'
  ],
  '50-59': [
    'Moderate compatibility. You have some challenges to overcome.',
    'Your relationship will require more effort and compromise.',
    'Focus on finding common ground and shared interests.',
    'With dedication, you can build a stronger connection.'
  ],
  '40-49': [
    'Lower compatibility. You may face significant challenges.',
    'Your differences might be too great to overcome easily.',
    'Consider if this relationship is worth the effort required.',
    'Focus on friendship first before pursuing romance.'
  ],
  '0-39': [
    'Very low compatibility. This relationship may be challenging.',
    'Your fundamental differences might be too significant.',
    'Consider if you\'re truly compatible as romantic partners.',
    'Sometimes friendship is better than forced romance.'
  ]
}

export default function LoveCalculator() {
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [zodiac1, setZodiac1] = useState('')
  const [zodiac2, setZodiac2] = useState('')
  const [birthDate1, setBirthDate1] = useState('')
  const [birthDate2, setBirthDate2] = useState('')
  const [personality1, setPersonality1] = useState<string[]>([])
  const [personality2, setPersonality2] = useState<string[]>([])
  const [showResults, setShowResults] = useState(false)

  const calculateLove = useCallback((): LoveResult => {
    if (!name1 || !name2) return {
      percentage: 0,
      compatibility: '',
      description: '',
      advice: [],
      emoji: ''
    }

    // Name compatibility (simple letter matching)
    const name1Lower = name1.toLowerCase()
    const name2Lower = name2.toLowerCase()
    const commonLetters = name1Lower.split('').filter(letter => 
      name2Lower.includes(letter)
    ).length
    const nameCompatibility = Math.min(100, (commonLetters / Math.max(name1.length, name2.length)) * 100)

    // Zodiac compatibility
    const zodiacCompatibility = zodiac1 && zodiac2 && ZODIAC_COMPATIBILITY[zodiac1] && ZODIAC_COMPATIBILITY[zodiac1][zodiac2] 
      ? ZODIAC_COMPATIBILITY[zodiac1][zodiac2] 
      : 50

    // Birth date compatibility (simple day difference)
    let birthDateCompatibility = 50
    if (birthDate1 && birthDate2) {
      const date1 = new Date(birthDate1)
      const date2 = new Date(birthDate2)
      const dayDiff = Math.abs(date1.getDate() - date2.getDate())
      birthDateCompatibility = Math.max(30, 100 - (dayDiff * 2))
    }

    // Personality compatibility
    let personalityCompatibility = 50
    if (personality1.length > 0 && personality2.length > 0) {
      const commonTraits = personality1.filter(trait => personality2.includes(trait)).length
      personalityCompatibility = Math.min(100, (commonTraits / Math.max(personality1.length, personality2.length)) * 100)
    }

    // Calculate overall percentage
    const totalCompatibility = (nameCompatibility + zodiacCompatibility + birthDateCompatibility + personalityCompatibility) / 4
    const percentage = Math.round(totalCompatibility)

    // Determine compatibility level and advice
    let compatibility = ''
    let description = ''
    let advice: string[] = []
    let emoji = ''

    if (percentage >= 90) {
      compatibility = 'Soulmate Level'
      description = 'Incredible cosmic connection!'
      emoji = '💕💕💕'
    } else if (percentage >= 80) {
      compatibility = 'Excellent Match'
      description = 'Very strong romantic potential!'
      emoji = '💕💕'
    } else if (percentage >= 70) {
      compatibility = 'Great Match'
      description = 'Strong foundation for love!'
      emoji = '💕'
    } else if (percentage >= 60) {
      compatibility = 'Good Match'
      description = 'Promising relationship ahead!'
      emoji = '❤️'
    } else if (percentage >= 50) {
      compatibility = 'Moderate Match'
      description = 'Potential with some work!'
      emoji = '💙'
    } else if (percentage >= 40) {
      compatibility = 'Challenging Match'
      description = 'Will require significant effort!'
      emoji = '💜'
    } else {
      compatibility = 'Difficult Match'
      description = 'May face major challenges!'
      emoji = '💔'
    }

    // Get advice based on percentage
    for (const [range, adviceList] of Object.entries(LOVE_ADVICE)) {
      const [min, max] = range.split('-').map(Number)
      if (percentage >= min && percentage <= max) {
        advice = adviceList
        break
      }
    }

    return {
      percentage,
      compatibility,
      description,
      advice,
      emoji
    }
  }, [name1, name2, zodiac1, zodiac2, birthDate1, birthDate2, personality1, personality2])

  const handleCalculate = () => {
    if (name1 && name2) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setName1('')
    setName2('')
    setZodiac1('')
    setZodiac2('')
    setBirthDate1('')
    setBirthDate2('')
    setPersonality1([])
    setPersonality2([])
    setShowResults(false)
  }

  const togglePersonality = (person: '1' | '2', trait: string) => {
    if (person === '1') {
      setPersonality1(prev => 
        prev.includes(trait) 
          ? prev.filter(t => t !== trait)
          : [...prev, trait]
      )
    } else {
      setPersonality2(prev => 
        prev.includes(trait) 
          ? prev.filter(t => t !== trait)
          : [...prev, trait]
      )
    }
  }

  const downloadResults = () => {
    const result = calculateLove()
    
    const data = `Love Calculator Results

Names: ${name1} & ${name2}
Love Percentage: ${result.percentage}%
Compatibility: ${result.compatibility}
Description: ${result.description}

Zodiac Signs: ${zodiac1 || 'Not specified'} & ${zodiac2 || 'Not specified'}
Birth Dates: ${birthDate1 || 'Not specified'} & ${birthDate2 || 'Not specified'}
Personality Traits: ${personality1.join(', ') || 'None selected'} & ${personality2.join(', ') || 'None selected'}

Advice:
${result.advice.map(advice => `• ${advice}`).join('\n')}

${result.emoji} Love is in the air! ${result.emoji}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'love-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateLove()
      
      navigator.share({
        title: 'Love Calculator Results',
        text: `${name1} & ${name2}: ${result.percentage}% love compatibility! ${result.emoji}`,
        url: window.location.href
      })
    } else {
      const result = calculateLove()
      const text = `${name1} & ${name2}: ${result.percentage}% love! ${result.emoji}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateLove() : { percentage: 0, compatibility: '', description: '', advice: [], emoji: '' }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-red-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Love Calculator</h1>
            <p className="text-pink-100 text-lg">
              Discover your love compatibility with this fun and romantic calculator. 
              Perfect for couples, friends, and anyone curious about love connections.
            </p>
          </div>
          <div className="hidden md:block">
            <Heart className="w-16 h-16 text-pink-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Person 1 */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">First Person 💕</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name1}
                  onChange={(e) => setName1(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter first name"
                  aria-label="First person's name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zodiac Sign
                </label>
                <select
                  value={zodiac1}
                  onChange={(e) => setZodiac1(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  aria-label="First person's zodiac sign"
                >
                  <option value="">Select zodiac sign</option>
                  {ZODIAC_SIGNS.map(sign => (
                    <option key={sign} value={sign}>{sign}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Date
                </label>
                <input
                  type="date"
                  value={birthDate1}
                  onChange={(e) => setBirthDate1(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  aria-label="First person's birth date"
                />
              </div>
            </div>
          </div>

          {/* Person 2 */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Second Person 💕</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  value={name2}
                  onChange={(e) => setName2(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  placeholder="Enter first name"
                  aria-label="Second person's name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Zodiac Sign
                </label>
                <select
                  value={zodiac2}
                  onChange={(e) => setZodiac2(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  aria-label="Second person's zodiac sign"
                >
                  <option value="">Select zodiac sign</option>
                  {ZODIAC_SIGNS.map(sign => (
                    <option key={sign} value={sign}>{sign}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Birth Date
                </label>
                <input
                  type="date"
                  value={birthDate2}
                  onChange={(e) => setBirthDate2(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                  aria-label="Second person's birth date"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Personality Traits */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Personality Traits (Optional)</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">{name1 || 'Person 1'}</h4>
              <div className="grid grid-cols-2 gap-2">
                {PERSONALITY_TRAITS.map(trait => (
                  <button
                    key={trait}
                    onClick={() => togglePersonality('1', trait)}
                    className={`p-2 text-sm rounded border transition-colors ${
                      personality1.includes(trait)
                        ? 'bg-pink-100 border-pink-300 text-pink-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-pink-50'
                    }`}
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-800 mb-3">{name2 || 'Person 2'}</h4>
              <div className="grid grid-cols-2 gap-2">
                {PERSONALITY_TRAITS.map(trait => (
                  <button
                    key={trait}
                    onClick={() => togglePersonality('2', trait)}
                    className={`p-2 text-sm rounded border transition-colors ${
                      personality2.includes(trait)
                        ? 'bg-pink-100 border-pink-300 text-pink-800'
                        : 'bg-white border-gray-300 text-gray-700 hover:bg-pink-50'
                    }`}
                  >
                    {trait}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        {name1 && name2 && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Love</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-6 rounded-lg border border-pink-200">
              <ResultSharing
                title="Love Compatibility Result"
                inputs={[
                  { label: "First Person", value: name1 },
                  { label: "Second Person", value: name2 },
                  { label: "Zodiac Signs", value: zodiac1 && zodiac2 ? `${zodiac1} & ${zodiac2}` : "Not specified" }
                ]}
                result={{ 
                  label: "Love Compatibility", 
                  value: `${result.percentage}%`,
                  unit: ""
                }}
                calculatorName="Love Calculator"
                className="mb-0"
              />
            </div>

            {/* Love Results */}
            <div className="bg-pink-50 p-6 rounded-lg border border-pink-200 text-center">
              <div className="text-6xl mb-4">{result.emoji}</div>
              <div className="text-6xl font-bold text-pink-700 mb-2">{result.percentage}%</div>
              <div className="text-2xl font-semibold text-pink-800 mb-2">{result.compatibility}</div>
              <div className="text-lg text-pink-600 mb-4">{result.description}</div>
              
              <div className="text-sm text-gray-600">
                <p>Names: <span className="font-semibold">{name1}</span> & <span className="font-semibold">{name2}</span></p>
                {zodiac1 && zodiac2 && (
                  <p>Zodiac: <span className="font-semibold">{zodiac1}</span> & <span className="font-semibold">{zodiac2}</span></p>
                )}
              </div>
            </div>

            {/* Advice Section */}
            {result.advice.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Love Advice 💝</h3>
                <div className="space-y-3">
                  {result.advice.map((advice, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Sparkles className="w-5 h-5 text-pink-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{advice}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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

        {/* Info Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-pink-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Love Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This fun calculator analyzes love compatibility based on names, zodiac signs, birth dates, and personality traits. 
                While this is meant for entertainment, it can provide interesting insights into relationship dynamics. 
                The calculator considers multiple factors to give you a comprehensive compatibility score and personalized advice. 
                Remember, true love goes beyond calculations - it's about connection, communication, and mutual respect!
              </p>
            </div>
          </div>
        </div>
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Love Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive love calculator provides entertaining insights into relationship compatibility 
              through a fun analysis of names, zodiac signs, birth dates, and personality traits. While designed 
              for entertainment purposes, this tool offers interesting perspectives on relationship dynamics and 
              can spark meaningful conversations about love and compatibility.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Analyzes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Name Compatibility:</strong> Letter patterns and numerical values</li>
              <li><strong>Zodiac Signs:</strong> Astrological compatibility and elements</li>
              <li><strong>Birth Dates:</strong> Numerological significance and timing</li>
              <li><strong>Personality Traits:</strong> Character compatibility analysis</li>
              <li><strong>Overall Score:</strong> Comprehensive compatibility percentage</li>
              <li><strong>Personalized Advice:</strong> Relationship guidance and insights</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Compatibility Categories</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">High Compatibility</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>90-100%:</strong> Excellent Match - Very strong romantic potential</li>
                  <li><strong>80-89%:</strong> Great Match - Strong foundation for love</li>
                  <li><strong>70-79%:</strong> Good Match - Promising relationship ahead</li>
                  <li><strong>Advantages:</strong> Natural chemistry and understanding</li>
                  <li><strong>Challenges:</strong> Fewer, easier to overcome</li>
                  <li><strong>Potential:</strong> High for long-term success</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Moderate Compatibility</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>60-69%:</strong> Moderate Match - Potential with some work</li>
                  <li><strong>50-59%:</strong> Challenging Match - Requires significant effort</li>
                  <li><strong>Below 50%:</strong> Difficult Match - May face major challenges</li>
                  <li><strong>Advantages:</strong> Opportunity for growth and learning</li>
                  <li><strong>Challenges:</strong> More communication and compromise needed</li>
                  <li><strong>Potential:</strong> Depends on commitment and effort</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                <h5 className="font-semibold text-pink-800 mb-1">Love Percentage</h5>
                <p className="text-pink-700 text-sm">Overall compatibility score</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <h5 className="font-semibold text-red-800 mb-1">Compatibility</h5>
                <p className="text-red-700 text-sm">Relationship potential rating</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Description</h5>
                <p className="text-purple-700 text-sm">Detailed compatibility explanation</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Advice</h5>
                <p className="text-orange-700 text-sm">Personalized relationship guidance</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter both names, select zodiac signs, input birth dates, and choose personality traits for both people. 
              Click "Calculate Love" to receive a comprehensive compatibility analysis including percentage score, 
              compatibility rating, description, and personalized advice for your relationship journey.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Zodiac Compatibility Factors</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Element Compatibility:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>Fire Signs:</strong> Aries, Leo, Sagittarius - Passionate and dynamic</li>
                    <li><strong>Earth Signs:</strong> Taurus, Virgo, Capricorn - Stable and practical</li>
                    <li><strong>Air Signs:</strong> Gemini, Libra, Aquarius - Intellectual and social</li>
                    <li><strong>Water Signs:</strong> Cancer, Scorpio, Pisces - Emotional and intuitive</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Compatibility Patterns:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>Same Element:</strong> Natural understanding and harmony</li>
                    <li><strong>Complementary Elements:</strong> Fire-Earth, Air-Water balance</li>
                    <li><strong>Opposite Signs:</strong> Attraction and challenge dynamics</li>
                    <li><strong>Trine Signs:</strong> Harmonious and supportive relationships</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Personality Trait Analysis</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Positive Traits</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Communication:</strong> Open, honest, and effective dialogue</li>
                  <li><strong>Empathy:</strong> Understanding and emotional intelligence</li>
                  <li><strong>Patience:</strong> Tolerance and long-term perspective</li>
                  <li><strong>Loyalty:</strong> Commitment and faithfulness</li>
                  <li><strong>Adaptability:</strong> Flexibility and growth mindset</li>
                  <li><strong>Supportiveness:</strong> Encouragement and partnership</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Growth Areas</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Conflict Resolution:</strong> Healthy disagreement handling</li>
                  <li><strong>Emotional Regulation:</strong> Managing feelings constructively</li>
                  <li><strong>Independence:</strong> Maintaining individual identity</li>
                  <li><strong>Trust Building:</strong> Developing mutual confidence</li>
                  <li><strong>Shared Values:</strong> Aligning life goals and priorities</li>
                  <li><strong>Quality Time:</strong> Meaningful connection and presence</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Numerological Influences</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Birth Date Numbers:</strong> Life path and destiny influences</li>
              <li><strong>Name Numerology:</strong> Letter values and personality traits</li>
              <li><strong>Compatibility Numbers:</strong> Relationship harmony indicators</li>
              <li><strong>Timing Factors:</strong> Optimal periods for relationship development</li>
              <li><strong>Life Cycles:</strong> Personal growth and relationship phases</li>
              <li><strong>Karmic Connections:</strong> Past life and soul connection theories</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Relationship Development Stages</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                <h5 className="font-semibold text-pink-800 mb-1">Initial Attraction</h5>
                <p className="text-pink-700 text-sm">Chemistry and first impressions</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <h5 className="font-semibold text-red-800 mb-1">Getting to Know</h5>
                <p className="text-red-700 text-sm">Deepening understanding and connection</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Commitment</h5>
                <p className="text-purple-700 text-sm">Long-term partnership and growth</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Compatibility Enhancement Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Open Communication:</strong> Share thoughts, feelings, and concerns honestly</li>
              <li><strong>Active Listening:</strong> Truly hear and understand your partner</li>
              <li><strong>Quality Time:</strong> Prioritize meaningful connection and shared experiences</li>
              <li><strong>Mutual Respect:</strong> Honor each other's individuality and boundaries</li>
              <li><strong>Shared Goals:</strong> Align on important life decisions and aspirations</li>
              <li><strong>Growth Mindset:</strong> Embrace personal and relationship development</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Low Scores</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Not a Deal-Breaker:</strong> Low scores don't mean impossible relationships</li>
              <li><strong>Growth Opportunity:</strong> Challenges can strengthen bonds</li>
              <li><strong>Communication Key:</strong> Open dialogue can overcome differences</li>
              <li><strong>Professional Help:</strong> Consider relationship counseling if needed</li>
              <li><strong>Personal Development:</strong> Work on individual growth areas</li>
              <li><strong>Realistic Expectations:</strong> Understand relationship dynamics</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Entertainment vs. Reality</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Fun Tool:</strong> Designed for entertainment and conversation</li>
              <li><strong>Not Scientific:</strong> Based on fun algorithms, not research</li>
              <li><strong>Conversation Starter:</strong> Use to discuss relationship topics</li>
              <li><strong>Self-Reflection:</strong> Consider your own relationship goals</li>
              <li><strong>Relationship Building:</strong> Focus on real communication and effort</li>
              <li><strong>Love is Action:</strong> True compatibility comes from daily choices</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-pink-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Use this calculator as a fun conversation starter and relationship reflection tool, not as a definitive 
                guide to your love life. True compatibility comes from mutual respect, open communication, shared values, 
                and daily effort to nurture your relationship. While astrology and numerology can provide interesting 
                insights, the most important factors in any successful relationship are genuine care, understanding, 
                and commitment to each other's happiness and growth.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
