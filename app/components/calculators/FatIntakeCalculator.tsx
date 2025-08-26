'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Droplets } from 'lucide-react'

export default function FatIntakeCalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [activityLevel, setActivityLevel] = useState('moderate')
  const [goal, setGoal] = useState('maintenance')
  const [showResults, setShowResults] = useState(false)

  const calculateFatIntake = useCallback(() => {
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    const a = parseFloat(age) || 0
    if (w === 0 || h === 0 || a === 0) return { 
      dailyFat: 0, 
      ranges: {
        minimum: 0,
        moderate: 0,
        maximum: 0
      }, 
      recommendations: [],
      breakdown: {
        calories: 0,
        percentage: 0,
        grams: 0
      }
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    // Calculate BMR using Mifflin-St Jeor
    const weightKg = w * 0.453592
    let bmr = 0
    if (gender === 'male') {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * a) + 5
    } else {
      bmr = (10 * weightKg) + (6.25 * heightCm) - (5 * a) - 161
    }

    // Activity multipliers
    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    }

    const tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]

    // Goal adjustments
    let adjustedCalories = tdee
    switch (goal) {
      case 'weight_loss':
        adjustedCalories -= 500
        break
      case 'muscle_gain':
        adjustedCalories += 300
        break
    }

    // Calculate fat needs
    let fatPercentage = 0.25 // Default 25%
    let fatRange = { min: 0, max: 0 }

    switch (goal) {
      case 'keto':
        fatPercentage = 0.7 // 70% for keto
        fatRange = { min: 0.6, max: 0.8 }
        break
      case 'low_fat':
        fatPercentage = 0.15 // 15% for low fat
        fatRange = { min: 0.1, max: 0.2 }
        break
      case 'weight_loss':
        fatPercentage = 0.3 // 30% for weight loss
        fatRange = { min: 0.25, max: 0.35 }
        break
      case 'muscle_gain':
        fatPercentage = 0.25 // 25% for muscle gain
        fatRange = { min: 0.2, max: 0.3 }
        break
      default:
        fatRange = { min: 0.2, max: 0.35 }
    }

    const dailyFat = (adjustedCalories * fatPercentage) / 9 // 9 calories per gram
    const ranges = {
      minimum: (adjustedCalories * fatRange.min) / 9,
      moderate: dailyFat,
      maximum: (adjustedCalories * fatRange.max) / 9
    }

    const breakdown = {
      calories: dailyFat * 9,
      percentage: fatPercentage * 100,
      grams: dailyFat
    }

    // Generate recommendations
    const recommendations = []
    if (goal === 'keto') {
      recommendations.push('High fat intake for ketosis - focus on healthy fats')
      recommendations.push('Include MCT oil, coconut oil, and avocados')
    } else if (goal === 'low_fat') {
      recommendations.push('Low fat diet - choose lean proteins and complex carbs')
      recommendations.push('Limit processed foods and added fats')
    } else if (goal === 'weight_loss') {
      recommendations.push('Moderate fat helps with satiety and hormone production')
      recommendations.push('Focus on omega-3 and monounsaturated fats')
    } else if (goal === 'muscle_gain') {
      recommendations.push('Adequate fat supports hormone production and recovery')
      recommendations.push('Include healthy fats with each meal')
    }

    recommendations.push('Good sources: nuts, seeds, avocados, olive oil, fatty fish')
    recommendations.push('Limit trans fats and excessive saturated fats')

    return { dailyFat, ranges, recommendations, breakdown }
  }, [weight, height, age, gender, activityLevel, goal])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setHeight('')
    setAge('')
    setGender('male')
    setActivityLevel('moderate')
    setGoal('maintenance')
    setShowResults(false)
  }

  const result = showResults ? calculateFatIntake() : { 
    dailyFat: 0, 
    ranges: {
      minimum: 0,
      moderate: 0,
      maximum: 0
    }, 
    recommendations: [],
    breakdown: {
      calories: 0,
      percentage: 0,
      grams: 0
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-yellow-500 to-orange-500 px-6 py-4">
        <div className="flex items-center">
          <Droplets className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Fat Intake Calculator</h2>
        </div>
        <p className="text-yellow-100 mt-1">Calculate your daily fat intake needs</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter height"
                aria-label="Height in feet or cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                aria-label="Select activity level"
              >
                <option value="sedentary">Sedentary</option>
                <option value="light">Light</option>
                <option value="moderate">Moderate</option>
                <option value="active">Active</option>
                <option value="very_active">Very Active</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Goal
              </label>
              <select
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                aria-label="Select goal"
              >
                <option value="maintenance">Maintenance</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="keto">Ketogenic</option>
                <option value="low_fat">Low Fat</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Daily Fat Intake</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-600 mb-2">
                  {result.dailyFat.toFixed(1)}g
                </div>
                <div className="text-yellow-700">
                  {result.breakdown.percentage?.toFixed(0)}% of daily calories
                </div>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="text-lg font-semibold text-yellow-800 mb-3">Fat Intake Ranges</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-yellow-700">Minimum:</span>
                  <span className="font-semibold text-yellow-800">{result.ranges.minimum?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Recommended:</span>
                  <span className="font-semibold text-yellow-800">{result.ranges.moderate?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Maximum:</span>
                  <span className="font-semibold text-yellow-800">{result.ranges.maximum?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-yellow-700">Calories from Fat:</span>
                  <span className="font-semibold text-yellow-800">{result.breakdown.calories?.toFixed(0)} calories</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-semibold text-yellow-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-yellow-600 mr-2">•</span>
                      <span className="text-yellow-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Fat Intake Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive fat intake calculator helps individuals determine their optimal daily fat 
              consumption based on personal health goals, activity levels, and dietary preferences. This 
              essential nutrition tool provides personalized fat intake recommendations to support overall 
              health, hormone production, and specific fitness objectives.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Daily Fat Requirements:</strong> Optimal fat intake in grams</li>
              <li><strong>Fat Percentage:</strong> Percentage of total daily calories from fat</li>
              <li><strong>Calorie Breakdown:</strong> Calories derived from fat intake</li>
              <li><strong>Intake Ranges:</strong> Minimum, recommended, and maximum levels</li>
              <li><strong>Goal-Specific Adjustments:</strong> Customized for different objectives</li>
              <li><strong>Health Recommendations:</strong> Personalized dietary guidance</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Essential Fat Functions</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Hormone Production</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Testosterone and estrogen</li>
                  <li>Thyroid hormones</li>
                  <li>Stress hormones</li>
                  <li>Insulin regulation</li>
                  <li>Growth hormones</li>
                  <li>Reproductive hormones</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Nutrient Absorption</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Fat-soluble vitamins (A, D, E, K)</li>
                  <li>Carotenoids and antioxidants</li>
                  <li>Omega-3 and omega-6 fatty acids</li>
                  <li>Phytonutrients</li>
                  <li>Mineral absorption</li>
                  <li>Bioavailability enhancement</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Body Functions</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Brain health and cognition</li>
                  <li>Cell membrane structure</li>
                  <li>Energy storage and release</li>
                  <li>Temperature regulation</li>
                  <li>Organ protection</li>
                  <li>Nerve signal transmission</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Goal-Specific Fat Intake</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Weight Loss</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Fat: 25-35% of total calories</li>
                  <li>Focus on healthy fats</li>
                  <li>Maintain satiety</li>
                  <li>Preserve muscle mass</li>
                  <li>Support hormone balance</li>
                  <li>Avoid very low-fat diets</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Muscle Gain</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Fat: 20-25% of total calories</li>
                  <li>Support testosterone production</li>
                  <li>Provide energy for workouts</li>
                  <li>Maintain hormone balance</li>
                  <li>Support recovery</li>
                  <li>Balance with protein and carbs</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Specialized Diet Fat Levels</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Ketogenic Diet</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Fat: 70-75% of total calories</li>
                  <li>Induces ketosis</li>
                  <li>Primary energy source</li>
                  <li>High-fat foods essential</li>
                  <li>Monitor ketone levels</li>
                  <li>May aid weight loss</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Low Fat Diet</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Fat: 10-20% of total calories</li>
                  <li>Focus on lean proteins</li>
                  <li>Complex carbohydrates</li>
                  <li>Heart health focus</li>
                  <li>Monitor essential fats</li>
                  <li>Professional guidance recommended</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                <h5 className="font-semibold text-yellow-800 mb-1">Daily Fat Intake</h5>
                <p className="text-yellow-700 text-sm">Recommended grams per day</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Fat Percentage</h5>
                <p className="text-orange-700 text-sm">% of total daily calories</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <h5 className="font-semibold text-red-800 mb-1">Intake Ranges</h5>
                <p className="text-red-700 text-sm">Min, recommended, max levels</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your age, gender, weight, height, activity level, and health goal. The calculator 
              will provide your optimal daily fat intake in grams and as a percentage of total calories, 
              along with personalized recommendations.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Healthy Fat Sources</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Monounsaturated Fats:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Olive oil and avocados</li>
                    <li>Nuts (almonds, cashews)</li>
                    <li>Peanut butter</li>
                    <li>Canola oil</li>
                    <li>Dark chocolate</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Polyunsaturated Fats:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Fatty fish (salmon, tuna)</li>
                    <li>Flaxseeds and chia seeds</li>
                    <li>Walnuts and sunflower seeds</li>
                    <li>Soybean oil</li>
                    <li>Corn oil</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Essential Fatty Acids</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Omega-3 Fatty Acids:</strong> EPA, DHA, ALA for brain and heart health</li>
              <li><strong>Omega-6 Fatty Acids:</strong> LA, GLA for skin and hormone health</li>
              <li><strong>Omega-9 Fatty Acids:</strong> Oleic acid for cardiovascular health</li>
              <li><strong>Conjugated Linoleic Acid:</strong> CLA for body composition</li>
              <li><strong>Medium-Chain Triglycerides:</strong> MCTs for quick energy</li>
              <li><strong>Short-Chain Fatty Acids:</strong> SCFAs for gut health</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Fat Intake Guidelines</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Minimum Fat Intake:</strong> 20% of total calories (essential functions)</li>
              <li><strong>Recommended Range:</strong> 25-35% of total calories (general health)</li>
              <li><strong>Maximum Fat Intake:</strong> 40% of total calories (unless ketogenic)</li>
              <li><strong>Saturated Fat Limit:</strong> Less than 10% of total calories</li>
              <li><strong>Trans Fat Limit:</strong> As close to 0% as possible</li>
              <li><strong>Essential Fat Minimum:</strong> 3-5% of total calories</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Fat Intake Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Too Little Fat:</strong> Hormone imbalances, poor absorption</li>
              <li><strong>Too Much Saturated Fat:</strong> Heart health concerns</li>
              <li><strong>Ignoring Essential Fats:</strong> Omega-3 and omega-6 deficiency</li>
              <li><strong>Processed Fats:</strong> Trans fats and hydrogenated oils</li>
              <li><strong>Unbalanced Ratios:</strong> Too much omega-6 vs. omega-3</li>
              <li><strong>Fat Phobia:</strong> Unnecessary restriction of healthy fats</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">When to Adjust Fat Intake</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Energy Changes:</strong> Fatigue or excessive energy</li>
              <li><strong>Hormone Issues:</strong> Irregular periods, low libido</li>
              <li><strong>Skin Problems:</strong> Dry skin, poor wound healing</li>
              <li><strong>Digestive Issues:</strong> Poor absorption, vitamin deficiencies</li>
              <li><strong>Goal Changes:</strong> Switching between weight loss and maintenance</li>
              <li><strong>Health Conditions:</strong> Heart disease, diabetes management</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Fat Quality vs. Quantity</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>High-Quality Fats:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Cold-pressed oils</li>
                    <li>Wild-caught fish</li>
                    <li>Grass-fed meats</li>
                    <li>Organic nuts and seeds</li>
                    <li>Unrefined coconut oil</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Low-Quality Fats:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Refined vegetable oils</li>
                    <li>Processed meats</li>
                    <li>Hydrogenated oils</li>
                    <li>Deep-fried foods</li>
                    <li>Margarine and spreads</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Fat Intake for Different Life Stages</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Children (2-18 years):</strong> 25-35% of calories for growth and development</li>
              <li><strong>Adults (19-50 years):</strong> 20-35% of calories for maintenance</li>
              <li><strong>Older Adults (51+ years):</strong> 20-35% of calories with focus on omega-3s</li>
              <li><strong>Pregnancy:</strong> 20-35% of calories with increased omega-3s</li>
              <li><strong>Breastfeeding:</strong> 20-35% of calories for milk production</li>
              <li><strong>Athletes:</strong> 20-35% of calories based on training intensity</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-yellow-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Focus on fat quality over quantity. Choose whole food sources of healthy fats rather than 
                processed oils. Aim for a balance of omega-3 and omega-6 fatty acids, with a ratio closer 
                to 1:1 rather than the typical Western diet ratio of 1:15. Remember that fat is essential 
                for health - don't fear it, but choose it wisely. Also, consider that your fat needs may 
                vary seasonally (more in winter for warmth, less in summer) and with your menstrual cycle 
                if you're a woman. Finally, fat intake should work in harmony with your protein and 
                carbohydrate intake for optimal health and performance.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
