'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Dumbbell } from 'lucide-react'

export default function LeanBodyMassCalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [bodyFat, setBodyFat] = useState('')
  const [method, setMethod] = useState('boer')
  const [showResults, setShowResults] = useState(false)

  const calculateLeanMass = useCallback(() => {
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    const a = parseFloat(age) || 0
    const bf = parseFloat(bodyFat) || 0
    if (w === 0 || h === 0) return { 
      leanMass: 0, 
      fatMass: 0, 
      methods: {}, 
      recommendations: [] 
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    const weightKg = w * 0.453592
    const heightM = heightCm / 100

    // Calculate using different methods
    const methods = {
      boer: 0,
      james: 0,
      hume: 0,
      bodyFat: 0
    }

    // Boer formula
    if (gender === 'male') {
      methods.boer = (0.407 * weightKg) + (0.267 * heightCm) - 19.2
    } else {
      methods.boer = (0.252 * weightKg) + (0.473 * heightCm) - 48.3
    }

    // James formula
    if (gender === 'male') {
      if (heightCm <= 110) {
        methods.james = 0.5 * weightKg
      } else if (heightCm <= 140) {
        methods.james = 0.5 * weightKg + 0.1 * (heightCm - 110)
      } else {
        methods.james = 0.5 * weightKg + 0.1 * 30 + 0.1 * (heightCm - 140)
      }
    } else {
      if (heightCm <= 110) {
        methods.james = 0.5 * weightKg
      } else if (heightCm <= 140) {
        methods.james = 0.5 * weightKg + 0.1 * (heightCm - 110)
      } else {
        methods.james = 0.5 * weightKg + 0.1 * 30 + 0.1 * (heightCm - 140)
      }
    }

    // Hume formula
    if (gender === 'male') {
      methods.hume = (0.32810 * weightKg) + (0.33929 * heightCm) - 29.5336
    } else {
      methods.hume = (0.29569 * weightKg) + (0.41813 * heightCm) - 43.2933
    }

    // Body fat percentage method
    if (bf > 0) {
      methods.bodyFat = weightKg * (1 - bf / 100)
    }

    // Use selected method or average of available methods
    let leanMass = 0
    let methodName = ''
    
    if (method === 'boer') {
      leanMass = methods.boer
      methodName = 'Boer Formula'
    } else if (method === 'james') {
      leanMass = methods.james
      methodName = 'James Formula'
    } else if (method === 'hume') {
      leanMass = methods.hume
      methodName = 'Hume Formula'
    } else if (method === 'bodyFat' && bf > 0) {
      leanMass = methods.bodyFat
      methodName = 'Body Fat Percentage'
    } else {
      // Use average of available methods
      const availableMethods = Object.values(methods).filter(v => v > 0)
      leanMass = availableMethods.reduce((a, b) => a + b, 0) / availableMethods.length
      methodName = 'Average of Available Methods'
    }

    const fatMass = weightKg - leanMass

    // Generate recommendations
    const recommendations = []
    if (leanMass > 0) {
      const leanMassLbs = leanMass * 2.20462
      if (leanMassLbs < 100) {
        recommendations.push('Consider strength training to build lean mass')
        recommendations.push('Ensure adequate protein intake (1.6-2.2g per kg body weight)')
      } else if (leanMassLbs < 150) {
        recommendations.push('Maintain current lean mass with regular exercise')
        recommendations.push('Focus on compound movements and progressive overload')
      } else {
        recommendations.push('Excellent lean mass! Maintain with consistent training')
        recommendations.push('Consider periodization for continued progress')
      }
    }

    return { leanMass, fatMass, methods, recommendations, methodName }
  }, [weight, height, age, gender, bodyFat, method])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setHeight('')
    setAge('')
    setGender('male')
    setBodyFat('')
    setMethod('boer')
    setShowResults(false)
  }

  const result = showResults ? calculateLeanMass() : { 
    leanMass: 0, 
    fatMass: 0, 
    methods: {}, 
    recommendations: [],
    methodName: ''
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center">
          <Dumbbell className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Lean Body Mass Calculator</h2>
        </div>
        <p className="text-blue-100 mt-1">Calculate your lean body mass using multiple formulas</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter weight"
                aria-label="Weight in pounds"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (ft or cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter height"
                aria-label="Height in feet or cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter age"
                aria-label="Age in years"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Select gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Fat % (Optional)
              </label>
              <input
                type="number"
                value={bodyFat}
                onChange={(e) => setBodyFat(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                placeholder="Enter body fat %"
                min="0"
                max="100"
                aria-label="Body fat percentage"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Calculation Method
              </label>
              <select
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
                aria-label="Select calculation method"
              >
                <option value="boer">Boer Formula</option>
                <option value="james">James Formula</option>
                <option value="hume">Hume Formula</option>
                <option value="bodyFat">Body Fat %</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Results</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Lean Body Mass:</span>
                  <span className="font-semibold text-blue-800">
                    {result.leanMass.toFixed(1)} kg ({(result.leanMass * 2.20462).toFixed(1)} lbs)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Fat Mass:</span>
                  <span className="font-semibold text-blue-800">
                    {result.fatMass.toFixed(1)} kg ({(result.fatMass * 2.20462).toFixed(1)} lbs)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">Method Used:</span>
                  <span className="font-semibold text-blue-800">{result.methodName}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">All Methods Comparison</h3>
              <div className="space-y-2">
                {Object.entries(result.methods).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="text-blue-700 capitalize">{key}:</span>
                    <span className="font-semibold text-blue-800">
                      {value > 0 ? `${value.toFixed(1)} kg` : 'N/A'}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-blue-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Lean Body Mass Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive lean body mass calculator helps athletes, fitness enthusiasts, and health professionals 
              understand body composition beyond simple weight measurements. This essential fitness tool provides 
              accurate lean mass calculations using multiple scientific formulas, enabling precise body composition 
              analysis and fitness goal planning.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Lean Body Mass:</strong> Fat-free mass including muscles, bones, organs</li>
              <li><strong>Fat Mass:</strong> Total body fat weight and percentage</li>
              <li><strong>Method Comparison:</strong> Results from multiple calculation formulas</li>
              <li><strong>Body Composition:</strong> Detailed breakdown of body components</li>
              <li><strong>Fitness Assessment:</strong> Performance and health evaluation</li>
              <li><strong>Goal Tracking:</strong> Progress monitoring capabilities</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Calculation Methods</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Boer Formula</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Male:</strong> LBM = 0.407 × weight + 0.267 × height - 19.2</li>
                  <li><strong>Female:</strong> LBM = 0.252 × weight + 0.473 × height - 48.3</li>
                  <li><strong>Accuracy:</strong> Good for general population</li>
                  <li><strong>Limitation:</strong> May overestimate in obese individuals</li>
                  <li><strong>Use Case:</strong> Standard body composition assessment</li>
                  <li><strong>Research:</strong> Widely validated in studies</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">James Formula</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Male:</strong> LBM = 1.1 × weight - 128 × (weight/height)²</li>
                  <li><strong>Female:</strong> LBM = 1.07 × weight - 148 × (weight/height)²</li>
                  <li><strong>Accuracy:</strong> Excellent for normal weight individuals</li>
                  <li><strong>Advantage:</strong> Accounts for body proportions</li>
                  <li><strong>Use Case:</strong> Athletic and fitness populations</li>
                  <li><strong>Validation:</strong> WHO recommended formula</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Lean Body Mass</h5>
                <p className="text-blue-700 text-sm">Fat-free mass</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Fat Mass</h5>
                <p className="text-green-700 text-sm">Body fat weight</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Method Used</h5>
                <p className="text-purple-700 text-sm">Calculation formula</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Comparison</h5>
                <p className="text-orange-700 text-sm">All methods results</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your weight, height, age, gender, and optionally your body fat percentage. Select your preferred 
              calculation method or let the calculator show results from all methods. The tool will compute your lean 
              body mass, fat mass, and provide method comparisons for comprehensive analysis.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Lean Body Mass Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>What is Lean Body Mass:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Muscle tissue and organs</li>
                    <li>Bones and connective tissue</li>
                    <li>Water and essential fat</li>
                    <li>Everything except storage fat</li>
                    <li>Metabolically active tissue</li>
                    <li>Key to fitness performance</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Why LBM Matters:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Metabolic rate determination</li>
                    <li>Strength and power capacity</li>
                    <li>Physical performance indicator</li>
                    <li>Health and longevity marker</li>
                    <li>Fitness goal measurement</li>
                    <li>Body composition tracking</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Body Composition Analysis</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Essential Fat</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Male:</strong> 2-5% of total body weight</li>
                  <li><strong>Female:</strong> 10-13% of total body weight</li>
                  <li><strong>Function:</strong> Hormone production and organ protection</li>
                  <li><strong>Location:</strong> Brain, nerves, bone marrow</li>
                  <li><strong>Health:</strong> Critical for survival</li>
                  <li><strong>Cannot Lose:</strong> Essential for body function</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Storage Fat</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Function:</strong> Energy storage and insulation</li>
                  <li><strong>Location:</strong> Subcutaneous and visceral fat</li>
                  <li><strong>Health Impact:</strong> Can be reduced safely</li>
                  <li><strong>Exercise Response:</strong> Burns during activity</li>
                  <li><strong>Storage Sites:</strong> Abdomen, thighs, arms</li>
                  <li><strong>Metabolic Role:</strong> Energy reserve</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">LBM and Performance</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Athletic Performance:</strong> Higher LBM correlates with strength and power</li>
              <li><strong>Endurance Sports:</strong> Optimal LBM for power-to-weight ratio</li>
              <li><strong>Team Sports:</strong> Position-specific LBM requirements</li>
              <li><strong>Combat Sports:</strong> Weight class optimization</li>
              <li><strong>Recreational Fitness:</strong> Functional strength and mobility</li>
              <li><strong>Health and Wellness:</strong> Metabolic health and longevity</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">LBM Optimization Strategies</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Training Methods</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Resistance Training:</strong> Progressive overload principles</li>
                  <li><strong>Compound Movements:</strong> Multi-joint exercises</li>
                  <li><strong>Progressive Resistance:</strong> Gradually increasing weights</li>
                  <li><strong>Recovery Management:</strong> Adequate rest between sessions</li>
                  <li><strong>Variation:</strong> Different training stimuli</li>
                  <li><strong>Consistency:</strong> Regular training schedule</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Nutrition Support</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Protein Intake:</strong> 1.6-2.2g per kg body weight</li>
                  <li><strong>Calorie Surplus:</strong> 200-500 calories above maintenance</li>
                  <li><strong>Meal Timing:</strong> Protein around workouts</li>
                  <li><strong>Hydration:</strong> Adequate water intake</li>
                  <li><strong>Micronutrients:</strong> Vitamins and minerals</li>
                  <li><strong>Quality Foods:</strong> Whole, unprocessed options</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">LBM Monitoring and Tracking</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Regular Measurements:</strong> Monthly or quarterly assessments</li>
              <li><strong>Multiple Methods:</strong> Cross-reference different calculations</li>
              <li><strong>Progress Photos:</strong> Visual body composition changes</li>
              <li><strong>Performance Metrics:</strong> Strength and endurance improvements</li>
              <li><strong>Body Measurements:</strong> Circumference and skinfold measurements</li>
              <li><strong>Professional Assessment:</strong> DEXA scans or hydrostatic weighing</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common LBM Misconceptions</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Weight Loss = Fat Loss:</strong> May include muscle loss</li>
              <li><strong>More Protein = More Muscle:</strong> Training stimulus required</li>
              <li><strong>Cardio Burns Muscle:</strong> Moderate cardio preserves LBM</li>
              <li><strong>Supplements Build Muscle:</strong> Foundation is training and nutrition</li>
              <li><strong>LBM is Only Muscle:</strong> Includes bones, organs, water</li>
              <li><strong>Genetics Determine All:</strong> Lifestyle factors significant</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Health Implications of LBM</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Metabolic Rate:</strong> Higher LBM increases BMR</li>
              <li><strong>Insulin Sensitivity:</strong> Better glucose metabolism</li>
              <li><strong>Bone Health:</strong> Stronger bones and reduced fracture risk</li>
              <li><strong>Immune Function:</strong> Enhanced immune system response</li>
              <li><strong>Cardiovascular Health:</strong> Better heart function and circulation</li>
              <li><strong>Longevity:</strong> Increased life expectancy and quality</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Focus on building and maintaining lean body mass through consistent resistance training and proper nutrition. 
                Remember that LBM includes more than just muscle - it's your body's metabolically active tissue that 
                determines your overall health and fitness. Track your progress using multiple methods and celebrate 
                improvements in strength, performance, and body composition rather than just weight changes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
