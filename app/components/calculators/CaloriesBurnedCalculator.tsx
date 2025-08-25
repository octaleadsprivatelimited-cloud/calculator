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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Calories Burned Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive calories burned calculator helps fitness enthusiasts, athletes, and 
              health-conscious individuals estimate the energy expenditure of various physical activities. 
              This essential fitness tool provides personalized calorie burn estimates based on body 
              weight, activity type, intensity level, and duration to support workout planning and 
              weight management goals.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Activity-Specific Calories:</strong> Energy burned for selected exercise</li>
              <li><strong>Intensity Impact:</strong> How effort level affects calorie burn</li>
              <li><strong>Duration Calculations:</strong> Calorie burn per minute and total</li>
              <li><strong>Activity Comparison:</strong> Side-by-side calorie burn analysis</li>
              <li><strong>Personalized Estimates:</strong> Based on your body weight</li>
              <li><strong>Workout Planning:</strong> Calorie burn targets and recommendations</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Calorie Burn</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Body Composition</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Body weight (heavier = more calories)</li>
                  <li>Muscle mass percentage</li>
                  <li>Body fat percentage</li>
                  <li>Metabolic rate</li>
                  <li>Age and gender</li>
                  <li>Fitness level</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Exercise Intensity</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Heart rate during activity</li>
                  <li>Perceived exertion level</li>
                  <li>Speed and resistance</li>
                  <li>Movement complexity</li>
                  <li>Rest periods</li>
                  <li>Exercise form</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Activity Duration</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Total exercise time</li>
                  <li>Continuous vs. interval</li>
                  <li>Warm-up and cool-down</li>
                  <li>Recovery periods</li>
                  <li>Exercise frequency</li>
                  <li>Daily activity patterns</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Activity-Specific Calorie Burn</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Cardiovascular Activities</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Walking:</strong> 3-6 calories per minute</li>
                  <li><strong>Running:</strong> 8-15 calories per minute</li>
                  <li><strong>Cycling:</strong> 5-12 calories per minute</li>
                  <li><strong>Swimming:</strong> 6-14 calories per minute</li>
                  <li><strong>Rowing:</strong> 7-13 calories per minute</li>
                  <li><strong>Elliptical:</strong> 6-12 calories per minute</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Strength & Flexibility</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Strength Training:</strong> 4-8 calories per minute</li>
                  <li><strong>Yoga:</strong> 2-6 calories per minute</li>
                  <li><strong>Pilates:</strong> 3-7 calories per minute</li>
                  <li><strong>Stretching:</strong> 2-4 calories per minute</li>
                  <li><strong>Core Work:</strong> 4-8 calories per minute</li>
                  <li><strong>Circuit Training:</strong> 6-12 calories per minute</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Intensity Level Impact</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Light/Slow Intensity</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Easy conversation possible</li>
                  <li>Breathing remains normal</li>
                  <li>Minimal sweating</li>
                  <li>Recovery is quick</li>
                  <li>Good for beginners</li>
                  <li>Active recovery days</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Moderate Intensity</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Conversation possible but challenging</li>
                  <li>Increased breathing rate</li>
                  <li>Noticeable sweating</li>
                  <li>Moderate effort required</li>
                  <li>Most sustainable intensity</li>
                  <li>Daily exercise target</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Calories Burned</h5>
                <p className="text-orange-700 text-sm">Total energy expenditure</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <h5 className="font-semibold text-red-800 mb-1">Activity Comparison</h5>
                <p className="text-red-700 text-sm">All exercises side-by-side</p>
              </div>
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <h5 className="font-semibold text-yellow-800 mb-1">Recommendations</h5>
                <p className="text-yellow-700 text-sm">Personalized guidance</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your weight, select your activity type, choose the intensity level, and specify 
              the duration. The calculator will show your estimated calorie burn and compare it with 
              other activities to help you make informed fitness decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Calorie Burn Calculation Methods</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>MET Values:</strong> Metabolic equivalent of task measurements</li>
              <li><strong>Heart Rate Zones:</strong> Based on percentage of max heart rate</li>
              <li><strong>Perceived Exertion:</strong> Subjective effort level assessment</li>
              <li><strong>Activity Multipliers:</strong> Standardized exercise intensity factors</li>
              <li><strong>Body Weight Factors:</strong> Heavier individuals burn more calories</li>
              <li><strong>Duration Calculations:</strong> Linear relationship with time</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Maximizing Calorie Burn</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>High-Intensity Training:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>HIIT workouts</li>
                    <li>Tabata intervals</li>
                    <li>Circuit training</li>
                    <li>Sprint intervals</li>
                    <li>Plyometric exercises</li>
                    <li>Burpee variations</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Compound Movements:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Squats and deadlifts</li>
                    <li>Push-ups and pull-ups</li>
                    <li>Lunges and step-ups</li>
                    <li>Mountain climbers</li>
                    <li>Burpees and jumping jacks</li>
                    <li>Plank variations</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Activity-Specific Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Walking:</strong> Increase speed, add hills, use weights</li>
              <li><strong>Running:</strong> Include intervals, vary terrain, increase distance</li>
              <li><strong>Cycling:</strong> Add resistance, stand on pedals, increase cadence</li>
              <li><strong>Swimming:</strong> Use different strokes, increase intensity, add equipment</li>
              <li><strong>Strength Training:</strong> Reduce rest periods, use supersets, increase weight</li>
              <li><strong>Yoga:</strong> Try power yoga, hold poses longer, add flow sequences</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Calorie Burn Myths</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Spot Reduction:</strong> Can't target fat loss in specific areas</li>
              <li><strong>More Sweat = More Calories:</strong> Sweat is about temperature regulation</li>
              <li><strong>Cardio Only:</strong> Strength training burns calories too</li>
              <li><strong>Exercise Alone:</strong> Diet is crucial for weight loss</li>
              <li><strong>Longer Always Better:</strong> Intensity matters more than duration</li>
              <li><strong>Morning Exercise Burns More:</strong> Total daily burn matters most</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Post-Exercise Calorie Burn</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>EPOC Effect:</strong> Excess post-exercise oxygen consumption</li>
              <li><strong>Metabolic Boost:</strong> Increased calorie burn after workout</li>
              <li><strong>Muscle Recovery:</strong> Energy needed for tissue repair</li>
              <li><strong>Duration:</strong> Can last 2-48 hours depending on intensity</li>
              <li><strong>Factors:</strong> Exercise type, intensity, duration, fitness level</li>
              <li><strong>Maximization:</strong> High-intensity and strength training</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Calorie Burn for Weight Management</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Weight Loss:</strong> Create 500-1000 calorie daily deficit</li>
              <li><strong>Weight Maintenance:</strong> Balance calories in vs. calories out</li>
              <li><strong>Weight Gain:</strong> Surplus of 300-500 calories daily</li>
              <li><strong>Body Recomposition:</strong> Maintain calories while building muscle</li>
              <li><strong>Plateau Breaking:</strong> Increase intensity or duration</li>
              <li><strong>Long-term Success:</strong> Sustainable exercise habits</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Tracking and Monitoring</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Fitness Apps:</strong> Track workouts and calorie burn</li>
              <li><strong>Wearable Devices:</strong> Heart rate and activity monitoring</li>
              <li><strong>Workout Logs:</strong> Record exercises and progress</li>
              <li><strong>Progress Photos:</strong> Visual tracking of changes</li>
              <li><strong>Body Measurements:</strong> Track inches and body composition</li>
              <li><strong>Performance Metrics:</strong> Speed, distance, weight lifted</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Remember that calorie burn estimates are just that - estimates. Individual factors like 
                fitness level, muscle mass, and exercise efficiency can significantly impact actual 
                calorie expenditure. Focus on consistency and progressive overload rather than just 
                calorie numbers. Also, consider that the best exercise for calorie burn is the one you'll 
                actually do consistently. Finally, don't forget that building muscle through strength 
                training increases your resting metabolic rate, meaning you'll burn more calories even 
                when not exercising.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
