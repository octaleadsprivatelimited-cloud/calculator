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
      </div>
    </div>
  )
}
