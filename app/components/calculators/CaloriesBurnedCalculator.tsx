'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Flame } from 'lucide-react'

export default function CaloriesBurnedCalculator() {
  const [weight, setWeight] = useState('')
  const [duration, setDuration] = useState('')
  const [activity, setActivity] = useState('walking')
  const [intensity, setIntensity] = useState('moderate')
  const [showResults, setShowResults] = useState(false)

  const calculateCaloriesBurned = useCallback(() => {
    const w = parseFloat(weight) || 0
    const d = parseFloat(duration) || 0
    if (w === 0 || d === 0) return { 
      calories: 0, 
      activities: {}, 
      recommendations: [],
      totalTime: 0
    }

    const weightKg = w * 0.453592
    const durationHours = d / 60

    // MET values for different activities and intensities
    const metValues = {
      walking: {
        slow: 2.5,
        moderate: 3.5,
        fast: 4.5,
        very_fast: 6.0
      },
      running: {
        slow: 6.0,
        moderate: 8.0,
        fast: 10.0,
        very_fast: 12.0
      },
      cycling: {
        slow: 4.0,
        moderate: 6.0,
        fast: 8.0,
        very_fast: 10.0
      },
      swimming: {
        slow: 4.0,
        moderate: 6.0,
        fast: 8.0,
        very_fast: 10.0
      },
      strength_training: {
        light: 3.0,
        moderate: 5.0,
        heavy: 7.0,
        very_heavy: 9.0
      },
      yoga: {
        gentle: 2.5,
        moderate: 3.5,
        power: 4.5,
        hot: 5.5
      }
    }

    // Calculate calories burned for selected activity
    const selectedActivity = metValues[activity as keyof typeof metValues]
    const selectedIntensity = selectedActivity[intensity as keyof typeof selectedActivity] || selectedActivity.moderate
    
    const calories = selectedIntensity * weightKg * durationHours

    // Calculate calories for all activities at moderate intensity
    const activities: { [key: string]: number } = {}
    Object.keys(metValues).forEach(act => {
      let moderateMet = 3.0 // default
      if (act === 'walking' || act === 'running' || act === 'cycling' || act === 'swimming') {
        moderateMet = metValues[act as keyof typeof metValues].moderate
      } else if (act === 'strength_training') {
        moderateMet = metValues[act as keyof typeof metValues].moderate
      } else if (act === 'yoga') {
        moderateMet = metValues[act as keyof typeof metValues].moderate
      }
      activities[act] = moderateMet * weightKg * durationHours
    })

    // Generate recommendations
    const recommendations = []
    if (calories < 100) {
      recommendations.push('Consider increasing duration or intensity for better results')
      recommendations.push('Aim for at least 150-300 calories per session')
    } else if (calories < 300) {
      recommendations.push('Good calorie burn! Consider adding variety to your routine')
      recommendations.push('Mix cardio and strength training for optimal results')
    } else {
      recommendations.push('Excellent calorie burn! Maintain this intensity')
      recommendations.push('Remember to stay hydrated and fuel properly')
    }

    // Activity-specific tips
    if (activity === 'walking') {
      recommendations.push('Walking is great for daily activity and joint health')
    } else if (activity === 'running') {
      recommendations.push('Running provides excellent cardiovascular benefits')
    } else if (activity === 'cycling') {
      recommendations.push('Cycling is low-impact and great for leg strength')
    } else if (activity === 'swimming') {
      recommendations.push('Swimming is full-body and joint-friendly')
    } else if (activity === 'strength_training') {
      recommendations.push('Strength training builds muscle and boosts metabolism')
    } else if (activity === 'yoga') {
      recommendations.push('Yoga improves flexibility and mental wellness')
    }

    return { calories, activities, recommendations, totalTime: d }
  }, [weight, duration, activity, intensity])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setDuration('')
    setActivity('walking')
    setIntensity('moderate')
    setShowResults(false)
  }

  const result = showResults ? calculateCaloriesBurned() : { 
    calories: 0, 
    activities: {}, 
    recommendations: [],
    totalTime: 0
  }

  const formatActivityName = (name: string) => {
    return name.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
        <div className="flex items-center">
          <Flame className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Calories Burned Calculator</h2>
        </div>
        <p className="text-orange-100 mt-1">Calculate calories burned during various activities</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (lbs)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter weight"
                aria-label="Weight in pounds"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Duration (minutes)
              </label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter duration"
                aria-label="Duration in minutes"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Select activity"
              >
                <option value="walking">Walking</option>
                <option value="running">Running</option>
                <option value="cycling">Cycling</option>
                <option value="swimming">Swimming</option>
                <option value="strength_training">Strength Training</option>
                <option value="yoga">Yoga</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Intensity
              </label>
              <select
                value={intensity}
                onChange={(e) => setIntensity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Select intensity"
              >
                <option value="slow">Slow/Light</option>
                <option value="moderate">Moderate</option>
                <option value="fast">Fast/Heavy</option>
                <option value="very_fast">Very Fast/Intense</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">Calories Burned</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {result.calories.toFixed(0)} calories
                </div>
                <div className="text-orange-700">
                  {formatActivityName(activity)} at {intensity} intensity for {result.totalTime} minutes
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">All Activities Comparison</h3>
              <div className="space-y-2">
                {Object.entries(result.activities).map(([act, cal]) => (
                  <div key={act} className="flex justify-between">
                    <span className="text-orange-700">{formatActivityName(act)}:</span>
                    <span className="font-semibold text-orange-800">{cal.toFixed(0)} calories</span>
                  </div>
                ))}
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-orange-700">{rec}</span>
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
