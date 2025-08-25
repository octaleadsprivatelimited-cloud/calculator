'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Timer } from 'lucide-react'

export default function PaceCalculator() {
  const [distance, setDistance] = useState('')
  const [time, setTime] = useState('')
  const [distanceUnit, setDistanceUnit] = useState('miles')
  const [timeUnit, setTimeUnit] = useState('hours')
  const [showResults, setShowResults] = useState(false)

  const calculatePace = useCallback(() => {
    const d = parseFloat(distance) || 0
    const t = parseFloat(time) || 0
    if (d === 0 || t === 0) return { 
      pace: '', 
      splits: [], 
      conversions: {
        mph: 0,
        kmh: 0,
        minPerKm: 0,
        minPerMile: 0
      }
    }

    let totalMinutes = 0
    let totalSeconds = 0

    // Convert time to total minutes
    if (timeUnit === 'hours') {
      totalMinutes = t * 60
    } else if (timeUnit === 'minutes') {
      totalMinutes = t
    } else if (timeUnit === 'seconds') {
      totalMinutes = t / 60
    }

    // Calculate pace per unit distance
    const pacePerUnit = totalMinutes / d
    const paceMinutes = Math.floor(pacePerUnit)
    const paceSeconds = Math.round((pacePerUnit - paceMinutes) * 60)

    let pace = ''
    if (paceSeconds === 60) {
      pace = `${paceMinutes + 1}:00`
    } else {
      pace = `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')}`
    }

    // Calculate splits for common distances
    const splits: Array<{distance: number, time: string, pace: string}> = []
    const commonDistances = distanceUnit === 'miles' ? [0.25, 0.5, 1, 2, 3, 6.2, 13.1, 26.2] : [0.4, 0.8, 1, 2, 5, 10, 21.1, 42.2]
    
    commonDistances.forEach(dist => {
      if (dist <= d) {
        const splitTime = (pacePerUnit * dist)
        const splitMinutes = Math.floor(splitTime)
        const splitSeconds = Math.round((splitTime - splitMinutes) * 60)
        splits.push({
          distance: dist,
          time: `${splitMinutes}:${splitSeconds.toString().padStart(2, '0')}`,
          pace: pace
        })
      }
    })

    // Calculate conversions
    const conversions = {
      mph: 60 / pacePerUnit,
      kmh: (60 / pacePerUnit) * 1.60934,
      minPerKm: distanceUnit === 'miles' ? pacePerUnit * 1.60934 : pacePerUnit,
      minPerMile: distanceUnit === 'km' ? pacePerUnit / 1.60934 : pacePerUnit
    }

    return { pace, splits, conversions }
  }, [distance, time, distanceUnit, timeUnit])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setDistance('')
    setTime('')
    setDistanceUnit('miles')
    setTimeUnit('hours')
    setShowResults(false)
  }

  const result = showResults ? calculatePace() : { 
    pace: '', 
    splits: [], 
    conversions: {
      mph: 0,
      kmh: 0,
      minPerKm: 0,
      minPerMile: 0
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-4">
        <div className="flex items-center">
          <Timer className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Pace Calculator</h2>
        </div>
        <p className="text-blue-100 mt-1">Calculate your running pace and splits</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Distance
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={distance}
                  onChange={(e) => setDistance(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter distance"
                  aria-label="Distance value"
                />
                <select
                  value={distanceUnit}
                  onChange={(e) => setDistanceUnit(e.target.value)}
                  className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Distance unit"
                >
                  <option value="miles">Miles</option>
                  <option value="km">Kilometers</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Time
              </label>
              <div className="flex">
                <input
                  type="number"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter time"
                  aria-label="Time value"
                />
                <select
                  value={timeUnit}
                  onChange={(e) => setTimeUnit(e.target.value)}
                  className="px-3 py-2 border border-l-0 border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label="Time unit"
                >
                  <option value="hours">Hours</option>
                  <option value="minutes">Minutes</option>
                  <option value="seconds">Seconds</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Calculator className="h-5 w-5 inline mr-2" />
              Calculate
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <RotateCcw className="h-5 w-5 inline mr-2" />
              Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Your Pace</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">
                  {result.pace}
                </div>
                <div className="text-blue-700">
                  per {distanceUnit === 'miles' ? 'mile' : 'kilometer'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Pace Conversions</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-blue-700">Speed (mph):</span>
                  <span className="font-semibold text-blue-800">{result.conversions.mph?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Speed (km/h):</span>
                  <span className="font-semibold text-blue-800">{result.conversions.kmh?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Pace (min/km):</span>
                  <span className="font-semibold text-blue-800">{result.conversions.minPerKm?.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Pace (min/mile):</span>
                  <span className="font-semibold text-blue-800">{result.conversions.minPerMile?.toFixed(1)}</span>
                </div>
              </div>
            </div>

            {result.splits.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Split Times</h3>
                <div className="space-y-2">
                  {result.splits.map((split, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <span className="text-blue-700">
                        {split.distance} {distanceUnit === 'miles' ? 'mile' : 'km'}
                      </span>
                      <span className="font-semibold text-blue-800">{split.time}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Pace Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive pace calculator helps runners, cyclists, and athletes determine their pace, speed, 
              and split times for various distances. Whether you're training for a race, tracking your fitness progress, 
              or planning your workout strategy, this tool provides accurate pace calculations and conversions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Pace:</strong> Time per unit distance (e.g., minutes per mile)</li>
              <li><strong>Speed:</strong> Distance per unit time (e.g., miles per hour)</li>
              <li><strong>Split Times:</strong> Time for each segment of your distance</li>
              <li><strong>Unit Conversions:</strong> Switch between miles and kilometers</li>
              <li><strong>Training Paces:</strong> Different paces for various workout types</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Use Cases</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Running</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Marathon and half-marathon pacing</li>
                  <li>5K and 10K race strategies</li>
                  <li>Training run pace planning</li>
                  <li>Interval workout timing</li>
                  <li>Recovery run pacing</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Cycling</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Century ride planning</li>
                  <li>Time trial pacing</li>
                  <li>Group ride coordination</li>
                  <li>Training zone calculations</li>
                  <li>Race strategy development</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Pace</h5>
                <p className="text-blue-700 text-sm">Time per mile or kilometer</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Speed</h5>
                <p className="text-green-700 text-sm">Miles or kilometers per hour</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Splits</h5>
                <p className="text-purple-700 text-sm">Time for each distance segment</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your distance, time, and select your preferred units. The calculator will compute your pace, 
              provide speed conversions, and generate split times for training and race planning.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Pace Training Zones</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Easy Pace:</strong> 60-70% of race pace</p>
                  <p><strong>Marathon Pace:</strong> 80-85% of race pace</p>
                  <p><strong>Tempo Pace:</strong> 85-90% of race pace</p>
                </div>
                <div>
                  <p><strong>Threshold Pace:</strong> 90-95% of race pace</p>
                  <p><strong>Interval Pace:</strong> 95-100% of race pace</p>
                  <p><strong>Race Pace:</strong> 100% of target race pace</p>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Training Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Race Pacing:</strong> Plan your race strategy with even splits</li>
              <li><strong>Workout Planning:</strong> Calculate target paces for different training intensities</li>
              <li><strong>Progress Tracking:</strong> Monitor improvements in your pace over time</li>
              <li><strong>Group Training:</strong> Coordinate paces with training partners</li>
              <li><strong>Recovery Management:</strong> Ensure easy days are truly easy</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Use negative splits (starting slower and finishing faster) for optimal race performance. Your pace 
                calculator can help you plan these splits to ensure you don't start too fast and have energy left 
                for the finish.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
