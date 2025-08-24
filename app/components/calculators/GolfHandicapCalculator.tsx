'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Target } from 'lucide-react'

interface Score {
  id: string
  score: number
  courseRating: number
  slopeRating: number
  par: number
}

interface HandicapResult {
  handicapIndex: number
  courseHandicap: number
  adjustedGrossScore: number
  differentials: number[]
  averageDifferential: number
}

const COURSE_DIFFICULTY_LEVELS = [
  { name: 'Easy', rating: 68, slope: 113 },
  { name: 'Moderate', rating: 72, slope: 125 },
  { name: 'Difficult', rating: 76, slope: 140 },
  { name: 'Championship', rating: 78, slope: 150 }
]

export default function GolfHandicapCalculator() {
  const [scores, setScores] = useState<Score[]>([])
  const [courseRating, setCourseRating] = useState('72.0')
  const [slopeRating, setSlopeRating] = useState('125')
  const [par, setPar] = useState('72')
  const [showResults, setShowResults] = useState(false)

  const addScore = () => {
    const newScore: Score = {
      id: Date.now().toString(),
      score: 0,
      courseRating: parseFloat(courseRating) || 72.0,
      slopeRating: parseInt(slopeRating) || 125,
      par: parseInt(par) || 72
    }
    setScores([...scores, newScore])
  }

  const removeScore = (id: string) => {
    setScores(scores.filter(score => score.id !== id))
  }

  const updateScore = (id: string, field: keyof Score, value: string | number) => {
    setScores(scores.map(score => 
      score.id === id ? { ...score, [field]: value } : score
    ))
  }

  const calculateHandicap = useCallback((): HandicapResult => {
    if (scores.length === 0) {
      return {
        handicapIndex: 0,
        courseHandicap: 0,
        adjustedGrossScore: 0,
        differentials: [],
        averageDifferential: 0
      }
    }

    // Calculate differentials for each score
    const differentials = scores.map(score => {
      const differential = ((score.score - score.courseRating) * 113) / score.slopeRating
      return Math.round(differential * 10) / 10 // Round to 1 decimal place
    }).filter(diff => !isNaN(diff))

    // Sort differentials and take the lowest ones based on number of scores
    const sortedDifferentials = differentials.sort((a, b) => a - b)
    let scoresToCount = 0

    if (scores.length >= 20) scoresToCount = 10
    else if (scores.length >= 19) scoresToCount = 9
    else if (scores.length >= 17) scoresToCount = 8
    else if (scores.length >= 15) scoresToCount = 7
    else if (scores.length >= 13) scoresToCount = 6
    else if (scores.length >= 11) scoresToCount = 5
    else if (scores.length >= 9) scoresToCount = 4
    else if (scores.length >= 7) scoresToCount = 3
    else if (scores.length >= 5) scoresToCount = 2
    else if (scores.length >= 3) scoresToCount = 1
    else scoresToCount = 0

    const lowestDifferentials = sortedDifferentials.slice(0, scoresToCount)
    const averageDifferential = lowestDifferentials.length > 0 
      ? lowestDifferentials.reduce((sum, diff) => sum + diff, 0) / lowestDifferentials.length
      : 0

    // Calculate handicap index (96% of average differential)
    const handicapIndex = Math.round(averageDifferential * 0.96 * 10) / 10

    // Calculate course handicap
    const courseHandicap = Math.round((handicapIndex * (parseInt(slopeRating) || 125)) / 113)

    // Calculate adjusted gross score
    const adjustedGrossScore = scores.reduce((sum, score) => sum + score.score, 0)

    return {
      handicapIndex,
      courseHandicap,
      adjustedGrossScore,
      differentials,
      averageDifferential
    }
  }, [scores, slopeRating])

  const handleCalculate = () => {
    if (scores.length >= 3) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setScores([])
    setCourseRating('72.0')
    setSlopeRating('125')
    setPar('72')
    setShowResults(false)
  }

  const handleCourseDifficulty = (level: { name: string, rating: number, slope: number }) => {
    setCourseRating(level.rating.toString())
    setSlopeRating(level.slope.toString())
  }

  const formatNumber = (num: number, decimals: number = 1) => {
    if (isNaN(num) || !isFinite(num)) return '0.0'
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const result = calculateHandicap()
    
    const data = `Golf Handicap Calculator Results

Course Settings:
- Course Rating: ${courseRating}
- Slope Rating: ${slopeRating}
- Par: ${par}

Scores:
${scores.map((score, index) => 
  `Round ${index + 1}: ${score.score} (Rating: ${score.courseRating}, Slope: ${score.slopeRating})`
).join('\n')}

Results:
- Handicap Index: ${formatNumber(result.handicapIndex)}
- Course Handicap: ${result.courseHandicap}
- Adjusted Gross Score: ${result.adjustedGrossScore}
- Average Differential: ${formatNumber(result.averageDifferential)}

Differentials: ${result.differentials.map(d => formatNumber(d)).join(', ')}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'golf-handicap-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateHandicap()
      
      navigator.share({
        title: 'Golf Handicap Calculator Results',
        text: `Handicap Index: ${formatNumber(result.handicapIndex)}, Course Handicap: ${result.courseHandicap}`,
        url: window.location.href
      })
    } else {
      const result = calculateHandicap()
      const text = `Golf Handicap: ${formatNumber(result.handicapIndex)}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateHandicap() : { handicapIndex: 0, courseHandicap: 0, adjustedGrossScore: 0, differentials: [], averageDifferential: 0 }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Golf Handicap Calculator</h1>
            <p className="text-green-100 text-lg">
              Calculate your golf handicap index and course handicap. 
              Perfect for competitive golfers and handicap tracking.
            </p>
          </div>
          <div className="hidden md:block">
            <Target className="w-16 h-16 text-green-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Course Settings */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Course Settings */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Course Settings</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Course Rating
                  </label>
                  <input
                    type="number"
                    value={courseRating}
                    onChange={(e) => setCourseRating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="72.0"
                    step="0.1"
                    min="60"
                    max="85"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Slope Rating
                  </label>
                  <input
                    type="number"
                    value={slopeRating}
                    onChange={(e) => setSlopeRating(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="125"
                    min="55"
                    max="155"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Par
                  </label>
                  <input
                    type="number"
                    value={par}
                    onChange={(e) => setPar(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="72"
                    min="54"
                    max="80"
                  />
                </div>
              </div>
            </div>

            {/* Quick Course Difficulty */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Course Difficulty</h3>
              <div className="grid grid-cols-2 gap-2">
                {COURSE_DIFFICULTY_LEVELS.map((level, index) => (
                  <button
                    key={index}
                    onClick={() => handleCourseDifficulty(level)}
                    className="text-left p-2 bg-white rounded border hover:bg-green-50 transition-colors text-sm"
                  >
                    <div className="font-medium text-gray-800">{level.name}</div>
                    <div className="text-gray-600">Rating: {level.rating}, Slope: {level.slope}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Score Entry */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Score Entry</h3>
            <div className="space-y-4">
              <button
                onClick={addScore}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Add New Score
              </button>
              
              <div className="text-sm text-gray-600">
                <p>• Add at least 3 scores for a valid handicap</p>
                <p>• 20 scores recommended for most accurate calculation</p>
                <p>• Scores are automatically sorted by best differentials</p>
              </div>
            </div>
          </div>
        </div>

        {/* Score List */}
        {scores.length > 0 && (
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Scores ({scores.length})</h3>
            <div className="space-y-3">
              {scores.map((score, index) => (
                <div key={score.id} className="bg-white p-4 rounded-lg border flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <span className="font-semibold text-gray-800">Round {index + 1}</span>
                    <input
                      type="number"
                      value={score.score}
                      onChange={(e) => updateScore(score.id, 'score', parseInt(e.target.value) || 0)}
                      className="w-20 px-2 py-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Score"
                      min="50"
                      max="150"
                    />
                  </div>
                  <button
                    onClick={() => removeScore(score.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Calculate Button */}
        {scores.length >= 3 && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Calculate Handicap</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Handicap Results */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Handicap Results</h3>
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-700">{formatNumber(result.handicapIndex)}</div>
                  <div className="text-sm text-gray-600">Handicap Index</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{result.courseHandicap}</div>
                  <div className="text-sm text-gray-600">Course Handicap</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-700">{result.adjustedGrossScore}</div>
                  <div className="text-sm text-gray-600">Total Score</div>
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

        {/* Info Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Golf Handicap Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This calculator computes your golf handicap index using the USGA formula. The handicap index 
                represents your potential ability and is used to calculate course handicaps for different courses. 
                You need at least 3 scores for a valid handicap, with 20 scores recommended for the most accurate 
                calculation. The system automatically selects your best differentials based on the number of scores entered.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
