'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Scale } from 'lucide-react'

export default function PregnancyWeightGainCalculator() {
  const [prePregnancyWeight, setPrePregnancyWeight] = useState('')
  const [height, setHeight] = useState('')
  const [currentWeek, setCurrentWeek] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateWeightGain = useCallback(() => {
    const preWeight = parseFloat(prePregnancyWeight) || 0
    const h = parseFloat(height) || 0
    const week = parseFloat(currentWeek) || 0
    if (preWeight === 0 || h === 0) return { 
      bmi: 0, 
      category: '', 
      recommendations: {
        first: { total: 0, weekly: 0, notes: '' },
        second: { total: 0, weekly: 0, notes: '' },
        third: { total: 0, weekly: 0, notes: '' }
      }, 
      weeklyGain: 0,
      totalGain: 0,
      currentExpectedGain: 0
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    // Calculate pre-pregnancy BMI
    const heightM = heightCm / 100
    const bmi = preWeight / (heightM * heightM)

    // Determine BMI category and weight gain recommendations
    let category = ''
    let totalGain = 0
    let weeklyGain = 0

    if (bmi < 18.5) {
      category = 'Underweight'
      totalGain = 28 // 28-40 lbs
      weeklyGain = 1.0
    } else if (bmi < 25) {
      category = 'Normal Weight'
      totalGain = 25 // 25-35 lbs
      weeklyGain = 0.8
    } else if (bmi < 30) {
      category = 'Overweight'
      totalGain = 15 // 15-25 lbs
      weeklyGain = 0.6
    } else {
      category = 'Obese'
      totalGain = 11 // 11-20 lbs
      weeklyGain = 0.4
    }

    // Calculate trimester-specific recommendations
    const recommendations = {
      first: {
        total: totalGain * 0.1, // 10% of total in first trimester
        weekly: 0.5,
        notes: 'Minimal weight gain, focus on nutrition'
      },
      second: {
        total: totalGain * 0.4, // 40% of total in second trimester
        weekly: weeklyGain,
        notes: 'Steady weight gain, baby growing rapidly'
      },
      third: {
        total: totalGain * 0.5, // 50% of total in third trimester
        weekly: weeklyGain,
        notes: 'Maximum weight gain, baby gaining weight'
      }
    }

    // Calculate current expected weight gain
    let currentExpectedGain = 0
    if (week <= 13) {
      currentExpectedGain = recommendations.first.weekly * week
    } else if (week <= 27) {
      currentExpectedGain = recommendations.first.total + (recommendations.second.weekly * (week - 13))
    } else {
      currentExpectedGain = recommendations.first.total + recommendations.second.total + (recommendations.third.weekly * (week - 27))
    }

    return { 
      bmi, 
      category, 
      recommendations, 
      weeklyGain,
      totalGain,
      currentExpectedGain
    }
  }, [prePregnancyWeight, height, currentWeek])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setPrePregnancyWeight('')
    setHeight('')
    setCurrentWeek('')
    setShowResults(false)
  }

  const result = showResults ? calculateWeightGain() : { 
    bmi: 0, 
    category: '', 
    recommendations: {
      first: { total: 0, weekly: 0, notes: '' },
      second: { total: 0, weekly: 0, notes: '' },
      third: { total: 0, weekly: 0, notes: '' }
    }, 
    weeklyGain: 0,
    totalGain: 0,
    currentExpectedGain: 0
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-4">
        <div className="flex items-center">
          <Scale className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Pregnancy Weight Gain Calculator</h2>
        </div>
        <p className="text-purple-100 mt-1">Calculate recommended weight gain during pregnancy</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Pre-Pregnancy Weight (lbs)
              </label>
              <input
                type="number"
                value={prePregnancyWeight}
                onChange={(e) => setPrePregnancyWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter weight"
                aria-label="Pre-pregnancy weight in pounds"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Enter height"
                aria-label="Height in feet or cm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Pregnancy Week
            </label>
            <input
              type="number"
              value={currentWeek}
              onChange={(e) => setCurrentWeek(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter week"
              min="1"
              max="42"
              aria-label="Current pregnancy week"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Your Profile</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-purple-700">Pre-Pregnancy BMI:</span>
                  <span className="font-semibold text-purple-800">{result.bmi.toFixed(1)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">BMI Category:</span>
                  <span className="font-semibold text-purple-800">{result.category}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-purple-700">Total Recommended Gain:</span>
                  <span className="font-semibold text-purple-800">{result.totalGain} lbs</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Trimester Breakdown</h3>
              <div className="space-y-3">
                <div className="border-l-4 border-purple-300 pl-3">
                  <h4 className="font-medium text-purple-700">First Trimester (Weeks 1-13)</h4>
                  <div className="text-sm text-purple-600">
                    Total: {result.recommendations.first?.total.toFixed(1)} lbs | Weekly: {result.recommendations.first?.weekly.toFixed(1)} lbs
                  </div>
                  <div className="text-xs text-purple-500 mt-1">{result.recommendations.first?.notes}</div>
                </div>
                <div className="border-l-4 border-purple-400 pl-3">
                  <h4 className="font-medium text-purple-700">Second Trimester (Weeks 14-27)</h4>
                  <div className="text-sm text-purple-600">
                    Total: {result.recommendations.second?.total.toFixed(1)} lbs | Weekly: {result.recommendations.second?.weekly.toFixed(1)} lbs
                  </div>
                  <div className="text-xs text-purple-500 mt-1">{result.recommendations.second?.notes}</div>
                </div>
                <div className="border-l-4 border-purple-500 pl-3">
                  <h4 className="font-medium text-purple-700">Third Trimester (Weeks 28-40)</h4>
                  <div className="text-sm text-purple-600">
                    Total: {result.recommendations.third?.total.toFixed(1)} lbs | Weekly: {result.recommendations.third?.weekly.toFixed(1)} lbs
                  </div>
                  <div className="text-xs text-purple-500 mt-1">{result.recommendations.third?.notes}</div>
                </div>
              </div>
            </div>

            {parseFloat(currentWeek) > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-2">Current Progress</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-purple-700">Expected Weight Gain:</span>
                    <span className="font-semibold text-purple-800">{result.currentExpectedGain.toFixed(1)} lbs</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-purple-700">Remaining to Gain:</span>
                    <span className="font-semibold text-purple-800">
                      {Math.max(0, (result.totalGain - result.currentExpectedGain)).toFixed(1)} lbs
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Pregnancy Weight Gain Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive Pregnancy Weight Gain Calculator helps expectant mothers understand healthy 
              weight gain recommendations based on their pre-pregnancy BMI and current pregnancy week. This 
              essential tool provides trimester-specific guidance, weekly weight gain targets, and personalized 
              recommendations for optimal maternal and fetal health during pregnancy.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Pre-Pregnancy BMI:</strong> Body mass index before conception</li>
              <li><strong>BMI Category:</strong> Underweight, normal, overweight, or obese classification</li>
              <li><strong>Total Weight Gain:</strong> Recommended total pregnancy weight gain</li>
              <li><strong>Trimester Breakdown:</strong> Weekly and total gain by trimester</li>
              <li><strong>Current Progress:</strong> Expected gain at current week</li>
              <li><strong>Personalized Guidance:</strong> BMI-specific recommendations</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">BMI Category</h5>
                <p className="text-purple-700 text-sm">Pre-pregnancy weight status</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Total Gain</h5>
                <p className="text-blue-700 text-sm">Recommended total weight gain</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Trimester Goals</h5>
                <p className="text-green-700 text-sm">Weekly targets by trimester</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Current Progress</h5>
                <p className="text-orange-700 text-sm">Expected gain at current week</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your pre-pregnancy weight, height, and current pregnancy week. The calculator will determine 
              your BMI category and provide personalized weight gain recommendations for each trimester, helping 
              you maintain healthy pregnancy weight gain throughout your journey.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">BMI Categories and Weight Gain Recommendations</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Underweight (BMI &lt; 18.5)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Total Gain:</strong> 28-40 pounds</li>
                  <li><strong>First Trimester:</strong> 2-4 pounds</li>
                  <li><strong>Second Trimester:</strong> 1 pound per week</li>
                  <li><strong>Third Trimester:</strong> 1 pound per week</li>
                  <li><strong>Focus:</strong> Adequate nutrition and weight gain</li>
                  <li><strong>Considerations:</strong> May need extra calories</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Normal Weight (BMI 18.5-24.9)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Total Gain:</strong> 25-35 pounds</li>
                  <li><strong>First Trimester:</strong> 2-4 pounds</li>
                  <li><strong>Second Trimester:</strong> 1 pound per week</li>
                  <li><strong>Third Trimester:</strong> 1 pound per week</li>
                  <li><strong>Focus:</strong> Balanced nutrition and moderate gain</li>
                  <li><strong>Considerations:</strong> Standard pregnancy guidelines</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Weight Gain by Trimester</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-2">First Trimester</h5>
                <p className="text-blue-700 text-sm mb-2"><strong>Weeks 1-13</strong></p>
                <ul className="list-disc list-inside text-blue-700 space-y-1 text-xs">
                  <li>Minimal weight gain (2-4 lbs)</li>
                  <li>Morning sickness may limit gain</li>
                  <li>Focus on nutrition quality</li>
                  <li>Baby development critical</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-2">Second Trimester</h5>
                <p className="text-green-700 text-sm mb-2"><strong>Weeks 14-27</strong></p>
                <ul className="list-disc list-inside text-green-700 space-y-1 text-xs">
                  <li>Steady weight gain (1 lb/week)</li>
                  <li>Energy levels improve</li>
                  <li>Appetite increases</li>
                  <li>Baby growth accelerates</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-2">Third Trimester</h5>
                <p className="text-purple-700 text-sm mb-2"><strong>Weeks 28-40</strong></p>
                <ul className="list-disc list-inside text-purple-700 space-y-1 text-xs">
                  <li>Continued steady gain (1 lb/week)</li>
                  <li>Baby gains most weight</li>
                  <li>Maternal fat stores</li>
                  <li>Preparation for delivery</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Components of Pregnancy Weight Gain</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Baby:</strong> 7-8 pounds (average)</li>
              <li><strong>Placenta:</strong> 1-2 pounds</li>
              <li><strong>Amniotic Fluid:</strong> 2-3 pounds</li>
              <li><strong>Uterus:</strong> 2-3 pounds</li>
              <li><strong>Breast Tissue:</strong> 2-3 pounds</li>
              <li><strong>Blood Volume:</strong> 3-4 pounds</li>
              <li><strong>Maternal Fat Stores:</strong> 6-8 pounds</li>
              <li><strong>Fluid Retention:</strong> 2-3 pounds</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Nutrition During Pregnancy</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Essential Nutrients</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Folic Acid:</strong> Prevents neural tube defects</li>
                  <li><strong>Iron:</strong> Prevents anemia</li>
                  <li><strong>Calcium:</strong> Builds strong bones</li>
                  <li><strong>Protein:</strong> Essential for growth</li>
                  <li><strong>DHA:</strong> Brain development</li>
                  <li><strong>Vitamin D:</strong> Bone health</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Calorie Needs</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>First Trimester:</strong> No extra calories needed</li>
                  <li><strong>Second Trimester:</strong> +340 calories daily</li>
                  <li><strong>Third Trimester:</strong> +450 calories daily</li>
                  <li><strong>Underweight:</strong> May need additional calories</li>
                  <li><strong>Overweight:</strong> May need fewer calories</li>
                  <li><strong>Multiple Pregnancies:</strong> Higher calorie needs</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">When Weight Gain May Be Concerning</h4>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
              <h5 className="font-semibold text-yellow-800 mb-2">Consult Your Doctor If:</h5>
              <ul className="list-disc list-inside text-yellow-700 space-y-1 text-sm">
                <li><strong>Excessive Gain:</strong> More than 2 pounds per week</li>
                <li><strong>Insufficient Gain:</strong> No weight gain for 2+ weeks</li>
                <li><strong>Sudden Changes:</strong> Rapid weight gain or loss</li>
                <li><strong>Swelling:</strong> Sudden face, hand, or foot swelling</li>
                <li><strong>Severe Nausea:</strong> Unable to keep food down</li>
                <li><strong>Unusual Symptoms:</strong> Any concerning changes</li>
              </ul>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Healthy Weight Gain Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Balanced Meals:</strong> Include protein, carbs, and healthy fats</li>
              <li><strong>Regular Eating:</strong> Small, frequent meals throughout the day</li>
              <li><strong>Hydration:</strong> Drink 8-10 glasses of water daily</li>
              <li><strong>Physical Activity:</strong> Moderate exercise as approved by doctor</li>
              <li><strong>Mindful Eating:</strong> Listen to hunger and fullness cues</li>
              <li><strong>Quality Over Quantity:</strong> Focus on nutrient-dense foods</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Postpartum Weight Loss</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Immediate Loss:</strong> 10-12 pounds (baby, placenta, fluid)</li>
              <li><strong>First Week:</strong> Additional fluid loss</li>
              <li><strong>Gradual Loss:</strong> 1-2 pounds per month is healthy</li>
              <li><strong>Breastfeeding:</strong> May help with weight loss</li>
              <li><strong>Exercise:</strong> Resume gradually with doctor approval</li>
              <li><strong>Patience:</strong> It took 9 months to gain, allow time to lose</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Remember that every pregnancy is unique, and weight gain patterns vary. Focus on healthy eating 
                habits rather than the number on the scale. Your healthcare provider will monitor your weight 
                gain and can provide personalized guidance. The goal is a healthy baby and healthy mom, not a 
                specific weight target. Trust your body and work with your healthcare team for the best outcomes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
