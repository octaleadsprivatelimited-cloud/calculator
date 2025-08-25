'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, PieChart } from 'lucide-react'

export default function MacroCalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [activityLevel, setActivityLevel] = useState('moderate')
  const [goal, setGoal] = useState('maintenance')
  const [showResults, setShowResults] = useState(false)

  const calculateMacros = useCallback(() => {
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    const a = parseFloat(age) || 0
    if (w === 0 || h === 0 || a === 0) return { 
      calories: 0, 
      protein: 0, 
      carbs: 0, 
      fat: 0, 
      breakdown: {
        proteinPercent: 0,
        carbsPercent: 0,
        fatPercent: 0
      } 
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    // Convert weight to kg
    const weightKg = w * 0.453592

    // Calculate BMR using Mifflin-St Jeor
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

    let tdee = bmr * activityMultipliers[activityLevel as keyof typeof activityMultipliers]

    // Adjust calories based on goal
    switch (goal) {
      case 'weight_loss':
        tdee -= 500 // 500 calorie deficit
        break
      case 'muscle_gain':
        tdee += 300 // 300 calorie surplus
        break
    }

    // Calculate macros
    let protein = 0
    let carbs = 0
    let fat = 0

    if (goal === 'keto') {
      // Ketogenic diet: 70% fat, 25% protein, 5% carbs
      fat = (tdee * 0.7) / 9
      protein = (tdee * 0.25) / 4
      carbs = (tdee * 0.05) / 4
    } else if (goal === 'low_carb') {
      // Low carb: 40% fat, 35% protein, 25% carbs
      fat = (tdee * 0.4) / 9
      protein = (tdee * 0.35) / 4
      carbs = (tdee * 0.25) / 4
    } else {
      // Standard: 25% protein, 45% carbs, 30% fat
      protein = (tdee * 0.25) / 4
      carbs = (tdee * 0.45) / 4
      fat = (tdee * 0.3) / 9
    }

    const breakdown = {
      proteinPercent: ((protein * 4) / tdee) * 100,
      carbsPercent: ((carbs * 4) / tdee) * 100,
      fatPercent: ((fat * 9) / tdee) * 100
    }

    return { calories: tdee, protein, carbs, fat, breakdown }
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

  const result = showResults ? calculateMacros() : { 
    calories: 0, 
    protein: 0, 
    carbs: 0, 
    fat: 0, 
    breakdown: {
      proteinPercent: 0,
      carbsPercent: 0,
      fatPercent: 0
    } 
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
        <div className="flex items-center">
          <PieChart className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Macro Calculator</h2>
        </div>
        <p className="text-indigo-100 mt-1">Calculate your macronutrient needs</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Height"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                aria-label="Select goal"
              >
                <option value="maintenance">Maintenance</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="keto">Ketogenic</option>
                <option value="low_carb">Low Carb</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Daily Calories</h3>
              <div className="text-2xl font-bold text-indigo-600">{result.calories.toFixed(0)} calories</div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">Macronutrients</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-indigo-700">Protein:</span>
                  <div className="text-right">
                    <div className="font-semibold text-indigo-800">{result.protein.toFixed(1)}g</div>
                    <div className="text-sm text-indigo-600">{result.breakdown.proteinPercent.toFixed(0)}%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-700">Carbohydrates:</span>
                  <div className="text-right">
                    <div className="font-semibold text-indigo-800">{result.carbs.toFixed(1)}g</div>
                    <div className="text-sm text-indigo-600">{result.breakdown.carbsPercent.toFixed(0)}%</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-indigo-700">Fat:</span>
                  <div className="text-right">
                    <div className="font-semibold text-indigo-800">{result.fat.toFixed(1)}g</div>
                    <div className="text-sm text-indigo-600">{result.breakdown.fatPercent.toFixed(0)}%</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Macro Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive macro calculator helps fitness enthusiasts, athletes, and health-conscious 
              individuals determine their optimal daily macronutrient intake based on personal goals and 
              lifestyle factors. This essential nutrition tool provides personalized macronutrient ratios 
              to support weight management, muscle building, athletic performance, and overall health.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Daily Calorie Needs:</strong> Total energy requirements based on activity</li>
              <li><strong>Protein Requirements:</strong> Essential for muscle building and repair</li>
              <li><strong>Carbohydrate Needs:</strong> Primary energy source for daily activities</li>
              <li><strong>Fat Intake:</strong> Essential for hormone production and absorption</li>
              <li><strong>Macro Ratios:</strong> Optimal percentages for your specific goals</li>
              <li><strong>Goal-Specific Adjustments:</strong> Customized for weight loss, muscle gain, etc.</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Macronutrient Functions</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Protein (4 cal/g)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Muscle building and repair</li>
                  <li>Enzyme and hormone production</li>
                  <li>Immune system support</li>
                  <li>Appetite control</li>
                  <li>Thermic effect of food</li>
                  <li>Essential amino acids</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Carbohydrates (4 cal/g)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Primary energy source</li>
                  <li>Brain and nervous system fuel</li>
                  <li>Muscle glycogen storage</li>
                  <li>Workout performance</li>
                  <li>Fiber for digestion</li>
                  <li>Quick energy availability</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Fat (9 cal/g)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Hormone production</li>
                  <li>Vitamin absorption</li>
                  <li>Brain health</li>
                  <li>Long-term energy storage</li>
                  <li>Cell membrane structure</li>
                  <li>Essential fatty acids</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Goal-Specific Macro Ratios</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Weight Loss</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Protein: 30-35% (preserves muscle)</li>
                  <li>Carbs: 30-40% (maintains energy)</li>
                  <li>Fat: 25-35% (satiety and hormones)</li>
                  <li>Calorie deficit: 300-500 calories</li>
                  <li>Focus on whole foods</li>
                  <li>Regular exercise recommended</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Muscle Gain</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Protein: 25-30% (muscle synthesis)</li>
                  <li>Carbs: 45-55% (workout fuel)</li>
                  <li>Fat: 20-25% (hormone support)</li>
                  <li>Calorie surplus: 200-300 calories</li>
                  <li>Strength training essential</li>
                  <li>Post-workout nutrition key</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Specialized Diets</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Ketogenic Diet</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Protein: 20-25% (moderate)</li>
                  <li>Carbs: 5-10% (very low)</li>
                  <li>Fat: 70-75% (very high)</li>
                  <li>Induces ketosis</li>
                  <li>May aid weight loss</li>
                  <li>Monitor ketone levels</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Low Carb Diet</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Protein: 25-30% (increased)</li>
                  <li>Carbs: 20-30% (reduced)</li>
                  <li>Fat: 40-55% (increased)</li>
                  <li>Moderate carb restriction</li>
                  <li>Focus on complex carbs</li>
                  <li>Good for blood sugar control</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Activity Level Impact</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Sedentary:</strong> Office work, minimal exercise (1.2x BMR)</li>
              <li><strong>Light:</strong> Light exercise 1-3 days/week (1.375x BMR)</li>
              <li><strong>Moderate:</strong> Moderate exercise 3-5 days/week (1.55x BMR)</li>
              <li><strong>Active:</strong> Hard exercise 6-7 days/week (1.725x BMR)</li>
              <li><strong>Very Active:</strong> Very hard exercise, physical job (1.9x BMR)</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <h5 className="font-semibold text-indigo-800 mb-1">Daily Calories</h5>
                <p className="text-indigo-700 text-sm">Total energy needs</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Macro Grams</h5>
                <p className="text-green-700 text-sm">Daily intake amounts</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Macro Percentages</h5>
                <p className="text-purple-700 text-sm">Ratio distribution</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your age, gender, weight, height, activity level, and fitness goal. The calculator 
              will provide your daily calorie needs and optimal macronutrient breakdown to support your 
              specific objectives.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Macro Tracking Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Food Scales:</strong> Accurate portion measurement</li>
              <li><strong>Track Consistently:</strong> Daily logging for best results</li>
              <li><strong>Focus on Protein First:</strong> Meet protein goals daily</li>
              <li><strong>Adjust Gradually:</strong> Make small changes over time</li>
              <li><strong>Consider Meal Timing:</strong> Pre/post workout nutrition</li>
              <li><strong>Monitor Progress:</strong> Track weight, energy, and performance</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Quality Food Sources</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p><strong>Protein Sources:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Lean meats (chicken, turkey)</li>
                    <li>Fish and seafood</li>
                    <li>Eggs and dairy</li>
                    <li>Legumes and beans</li>
                    <li>Plant-based proteins</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Carb Sources:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Whole grains</li>
                    <li>Fruits and vegetables</li>
                    <li>Sweet potatoes</li>
                    <li>Quinoa and oats</li>
                    <li>Brown rice</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Healthy Fats:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Avocados and nuts</li>
                    <li>Olive oil</li>
                    <li>Fatty fish</li>
                    <li>Seeds and nut butters</li>
                    <li>Coconut products</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Macro Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Too Much Protein:</strong> Can strain kidneys, displace other nutrients</li>
              <li><strong>Too Little Fat:</strong> Hormone imbalances, poor absorption</li>
              <li><strong>Carbophobia:</strong> Fear of carbs can hurt performance</li>
              <li><strong>Ignoring Fiber:</strong> Important for digestion and satiety</li>
              <li><strong>Not Adjusting:</strong> Macros should change with goals and activity</li>
              <li><strong>Focusing Only on Macros:</strong> Food quality matters too</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">When to Adjust Macros</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Plateau in Progress:</strong> Weight loss or muscle gain stalls</li>
              <li><strong>Energy Changes:</strong> Fatigue or excessive energy</li>
              <li><strong>Performance Issues:</strong> Workout quality declines</li>
              <li><strong>Goal Changes:</strong> Switching from weight loss to maintenance</li>
              <li><strong>Activity Changes:</strong> Increasing or decreasing exercise</li>
              <li><strong>Health Issues:</strong> Digestive problems or allergies</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Macro Calculation Methods</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>BMR Calculation:</strong> Basal metabolic rate using Mifflin-St Jeor</li>
              <li><strong>Activity Multiplier:</strong> TDEE calculation based on lifestyle</li>
              <li><strong>Goal Adjustment:</strong> Calorie surplus/deficit for specific goals</li>
              <li><strong>Macro Distribution:</strong> Percentage-based nutrient allocation</li>
              <li><strong>Protein Priority:</strong> Set protein first, then distribute remaining</li>
              <li><strong>Flexibility Range:</strong> ±5% tolerance for daily adherence</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Start with the calculated macros for 2-3 weeks to establish a baseline, then adjust based 
                on your progress and how you feel. Remember that consistency is more important than 
                perfection - aim to hit your targets 80-90% of the time. Also, consider your individual 
                response to different macro ratios; some people feel better with higher carbs, while 
                others thrive on higher fat. Listen to your body and adjust accordingly. Finally, don't 
                forget that hydration, sleep, and stress management are just as important as macronutrient 
                balance for overall health and fitness success.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
