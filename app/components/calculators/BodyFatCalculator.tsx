'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, User } from 'lucide-react'

export default function BodyFatCalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [waist, setWaist] = useState('')
  const [neck, setNeck] = useState('')
  const [hip, setHip] = useState('')
  const [method, setMethod] = useState('navy')
  const [showResults, setShowResults] = useState(false)

  const calculateBodyFat = useCallback(() => {
    const a = parseFloat(age) || 0
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    const waist_cm = parseFloat(waist) || 0
    const neck_cm = parseFloat(neck) || 0
    const hip_cm = parseFloat(hip) || 0

    if (w === 0 || h === 0) return { bodyFat: 0, category: '', leanMass: 0, fatMass: 0, method: '' }

    let bodyFat = 0
    let methodName = ''

    if (method === 'navy' && waist_cm > 0 && neck_cm > 0) {
      // US Navy method
      if (gender === 'male') {
        bodyFat = 495 / (1.0324 - 0.19077 * Math.log10(waist_cm - neck_cm) + 0.15456 * Math.log10(h)) - 450
      } else {
        bodyFat = 495 / (1.29579 - 0.35004 * Math.log10(waist_cm + hip_cm - neck_cm) + 0.22100 * Math.log10(h)) - 450
      }
      methodName = 'US Navy Method'
    } else if (method === 'bmi' && h > 0) {
      // BMI-based estimation
      const heightM = h < 10 ? h * 0.3048 : h / 100
      const weightKg = w * 0.453592
      const bmi = weightKg / (heightM * heightM)
      
      if (gender === 'male') {
        bodyFat = (1.20 * bmi) + (0.23 * a) - 16.2
      } else {
        bodyFat = (1.20 * bmi) + (0.23 * a) - 5.4
      }
      methodName = 'BMI-Based Estimation'
    } else if (method === 'skinfold' && waist_cm > 0) {
      // Simplified skinfold method
      if (gender === 'male') {
        bodyFat = 0.39287 * waist_cm - 0.00105 * waist_cm * waist_cm + 0.15772 * a - 5.18845
      } else {
        bodyFat = 0.29669 * waist_cm - 0.00043 * waist_cm * waist_cm + 0.02963 * a + 1.4072
      }
      methodName = 'Simplified Skinfold Method'
    } else {
      // Default case when no method matches
      return { bodyFat: 0, category: '', leanMass: 0, fatMass: 0, method: 'No valid method' }
    }

    bodyFat = Math.max(0, Math.min(100, bodyFat))

    let category = ''
    if (gender === 'male') {
      if (bodyFat < 6) category = 'Essential Fat'
      else if (bodyFat < 14) category = 'Athletes'
      else if (bodyFat < 18) category = 'Fitness'
      else if (bodyFat < 25) category = 'Average'
      else if (bodyFat < 32) category = 'Above Average'
      else category = 'Obese'
    } else {
      if (bodyFat < 14) category = 'Essential Fat'
      else if (bodyFat < 21) category = 'Athletes'
      else if (bodyFat < 25) category = 'Fitness'
      else if (bodyFat < 32) category = 'Average'
      else if (bodyFat < 38) category = 'Above Average'
      else category = 'Obese'
    }

    const fatMass = (w * bodyFat) / 100
    const leanMass = w - fatMass

    return { bodyFat, category, leanMass, fatMass, method: methodName }
  }, [age, gender, weight, height, waist, neck, hip, method])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setAge('')
    setGender('male')
    setWeight('')
    setHeight('')
    setWaist('')
    setNeck('')
    setHip('')
    setMethod('navy')
    setShowResults(false)
  }

  const result = showResults ? calculateBodyFat() : { bodyFat: 0, category: '', leanMass: 0, fatMass: 0, method: '' }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-500 to-teal-500 px-6 py-4">
        <div className="flex items-center">
          <User className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Body Fat Calculator</h2>
        </div>
        <p className="text-green-100 mt-1">Calculate your body fat percentage using multiple methods</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Age"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
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
                Weight (lbs)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Weight"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Height"
                aria-label="Height in feet or cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waist (cm)
              </label>
              <input
                type="number"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Waist"
                aria-label="Waist circumference in cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Neck (cm)
              </label>
              <input
                type="number"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Neck"
                aria-label="Neck circumference in cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hip (cm)
              </label>
              <input
                type="number"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Hip"
                aria-label="Hip circumference in cm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Calculation Method
            </label>
            <select
              value={method}
              onChange={(e) => setMethod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
              aria-label="Select calculation method"
            >
              <option value="navy">US Navy Method (Most Accurate)</option>
              <option value="bmi">BMI-Based Estimation</option>
              <option value="skinfold">Simplified Skinfold Method</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-3">Results</h3>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-green-700">Body Fat %:</span>
                <span className="font-semibold text-green-800">{result.bodyFat.toFixed(1)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Category:</span>
                <span className="font-semibold text-green-800">{result.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Fat Mass:</span>
                <span className="font-semibold text-green-800">{result.fatMass.toFixed(1)} lbs</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Lean Mass:</span>
                <span className="font-semibold text-green-800">{result.leanMass.toFixed(1)} lbs</span>
              </div>
              <div className="border-t border-green-200 pt-2 mt-2">
                <div className="flex justify-between">
                  <span className="text-green-700">Method Used:</span>
                  <span className="font-semibold text-green-800">{result.method}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Body Fat Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive body fat calculator helps individuals determine their body fat percentage 
              using multiple measurement methods and calculation techniques. This essential health and 
              fitness tool provides accurate body composition analysis to support weight management, 
              fitness goals, and overall health monitoring.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Body Fat Percentage:</strong> Percentage of total body weight that is fat</li>
              <li><strong>Body Fat Category:</strong> Classification based on health standards</li>
              <li><strong>Fat Mass:</strong> Actual weight of body fat in pounds</li>
              <li><strong>Lean Mass:</strong> Weight of everything except fat (muscle, bone, organs)</li>
              <li><strong>Multiple Methods:</strong> Various calculation approaches for accuracy</li>
              <li><strong>Health Assessment:</strong> Body composition health evaluation</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Calculation Methods Explained</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">US Navy Method</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Most accurate for most people</li>
                  <li>Uses circumference measurements</li>
                  <li>Accounts for gender differences</li>
                  <li>Validated by military research</li>
                  <li>Easy to perform at home</li>
                  <li>Good for tracking changes</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">BMI-Based Estimation</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Uses height and weight only</li>
                  <li>Less accurate than other methods</li>
                  <li>Good for general screening</li>
                  <li>Easy to calculate</li>
                  <li>May overestimate in athletes</li>
                  <li>Underestimate in elderly</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Skinfold Method</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Measures subcutaneous fat</li>
                  <li>Requires calipers and training</li>
                  <li>Good for tracking changes</li>
                  <li>Affected by hydration</li>
                  <li>Operator-dependent accuracy</li>
                  <li>Multiple measurement sites</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Body Fat Categories</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Men</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Essential Fat:</strong> 2-5% (minimum for health)</li>
                  <li><strong>Athletes:</strong> 6-13% (optimal performance)</li>
                  <li><strong>Fitness:</strong> 14-17% (good health)</li>
                  <li><strong>Average:</strong> 18-24% (acceptable range)</li>
                  <li><strong>Overweight:</strong> 25-29% (health risk)</li>
                  <li><strong>Obese:</strong> 30%+ (significant health risk)</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Women</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Essential Fat:</strong> 10-13% (minimum for health)</li>
                  <li><strong>Athletes:</strong> 14-20% (optimal performance)</li>
                  <li><strong>Fitness:</strong> 21-24% (good health)</li>
                  <li><strong>Average:</strong> 25-31% (acceptable range)</li>
                  <li><strong>Overweight:</strong> 32-38% (health risk)</li>
                  <li><strong>Obese:</strong> 39%+ (significant health risk)</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Body Fat %</h5>
                <p className="text-green-700 text-sm">Percentage of total weight</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Category</h5>
                <p className="text-blue-700 text-sm">Health classification</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Mass Breakdown</h5>
                <p className="text-purple-700 text-sm">Fat vs. lean mass</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your age, gender, weight, height, and body measurements (waist, neck, hip). 
              Choose your preferred calculation method, and the calculator will provide your body fat 
              percentage, health category, and body composition breakdown.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Measurement Techniques</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Waist Measurement:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Measure at narrowest point</li>
                    <li>Usually at belly button level</li>
                    <li>Don't pull tape too tight</li>
                    <li>Measure while standing</li>
                    <li>Exhale normally</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Neck Measurement:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Measure around neck base</li>
                    <li>Below Adam's apple</li>
                    <li>Keep tape horizontal</li>
                    <li>Don't compress skin</li>
                    <li>Measure while standing</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Body Fat vs. BMI</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Body Fat Percentage:</strong> Measures actual fat tissue</li>
              <li><strong>BMI:</strong> Height-to-weight ratio only</li>
              <li><strong>Accuracy:</strong> Body fat % is more precise</li>
              <li><strong>Athletes:</strong> BMI may overestimate fat</li>
              <li><strong>Elderly:</strong> BMI may underestimate fat</li>
              <li><strong>Health Assessment:</strong> Body fat % better indicator</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Health Implications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Too Low:</strong> Hormone issues, poor performance, health risks</li>
              <li><strong>Optimal Range:</strong> Good health, performance, longevity</li>
              <li><strong>Too High:</strong> Increased disease risk, poor mobility</li>
              <li><strong>Distribution Matters:</strong> Abdominal fat more dangerous</li>
              <li><strong>Age Considerations:</strong> Higher ranges acceptable with age</li>
              <li><strong>Individual Variation:</strong> Genetics and lifestyle factors</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Body Fat</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Lifestyle Factors</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Diet and nutrition</li>
                  <li>Exercise and activity level</li>
                  <li>Sleep quality and duration</li>
                  <li>Stress management</li>
                  <li>Hormone balance</li>
                  <li>Hydration status</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Biological Factors</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Age and metabolism</li>
                  <li>Gender differences</li>
                  <li>Genetic predisposition</li>
                  <li>Hormone levels</li>
                  <li>Medical conditions</li>
                  <li>Medications</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Improving Body Composition</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Strength Training:</strong> Build muscle mass</li>
              <li><strong>Cardiovascular Exercise:</strong> Burn excess fat</li>
              <li><strong>Balanced Nutrition:</strong> Adequate protein and healthy fats</li>
              <li><strong>Calorie Management:</strong> Moderate deficit for fat loss</li>
              <li><strong>Consistency:</strong> Regular exercise and healthy eating</li>
              <li><strong>Patience:</strong> Body composition changes take time</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">When to Measure</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Initial Assessment:</strong> Establish baseline</li>
              <li><strong>Monthly Tracking:</strong> Monitor progress</li>
              <li><strong>After Program Changes:</strong> Assess effectiveness</li>
              <li><strong>Plateau Breaking:</strong> Identify stuck points</li>
              <li><strong>Goal Achievement:</strong> Confirm success</li>
              <li><strong>Health Monitoring:</strong> Prevent health issues</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Measurement Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Inconsistent Timing:</strong> Measure at same time of day</li>
              <li><strong>Poor Tape Placement:</strong> Wrong measurement locations</li>
              <li><strong>Compression:</strong> Pulling tape too tight</li>
              <li><strong>Hydration Changes:</strong> Measuring after drinking lots of water</li>
              <li><strong>Clothing Interference:</strong> Measuring over thick clothes</li>
              <li><strong>Post-Exercise:</strong> Measuring immediately after workout</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Professional vs. Home Measurement</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Professional Methods:</strong> DEXA, BodPod, hydrostatic weighing</li>
              <li><strong>Home Methods:</strong> Calipers, circumference, bioelectrical impedance</li>
              <li><strong>Accuracy:</strong> Professional methods more precise</li>
              <li><strong>Cost:</strong> Home methods more affordable</li>
              <li><strong>Convenience:</strong> Home methods more accessible</li>
              <li><strong>Tracking:</strong> Home methods good for trends</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Focus on trends rather than absolute numbers when tracking body fat percentage at home. 
                Measure at the same time of day, under similar conditions, and track changes over time. 
                Remember that body fat percentage is just one metric - also consider how you feel, 
                how your clothes fit, and your overall health markers. Don't obsess over small daily 
                fluctuations, as hydration, food intake, and other factors can cause temporary changes. 
                Finally, aim for a healthy body fat percentage that you can maintain sustainably rather 
                than pushing for extremely low levels that may be unhealthy or unsustainable.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
