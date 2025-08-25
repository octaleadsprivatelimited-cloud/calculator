'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Beef } from 'lucide-react'

export default function ProteinCalculator() {
  const [weight, setWeight] = useState('')
  const [activityLevel, setActivityLevel] = useState('moderate')
  const [goal, setGoal] = useState('maintenance')
  const [showResults, setShowResults] = useState(false)

  const calculateProtein = useCallback(() => {
    const w = parseFloat(weight) || 0
    if (w === 0) return { 
      dailyProtein: 0, 
      ranges: {
        minimum: 0,
        moderate: 0,
        high: 0,
        very_high: 0
      }, 
      recommendations: [],
      mealBreakdown: {
        breakfast: 0,
        lunch: 0,
        dinner: 0,
        snacks: 0
      }
    }

    const weightKg = w * 0.453592

    // Protein needs based on activity level and goal
    let proteinPerKg = 1.6 // Default moderate activity

    switch (activityLevel) {
      case 'sedentary':
        proteinPerKg = 1.2
        break
      case 'light':
        proteinPerKg = 1.4
        break
      case 'moderate':
        proteinPerKg = 1.6
        break
      case 'active':
        proteinPerKg = 1.8
        break
      case 'very_active':
        proteinPerKg = 2.0
        break
    }

    // Adjust for goals
    switch (goal) {
      case 'weight_loss':
        proteinPerKg += 0.2
        break
      case 'muscle_gain':
        proteinPerKg += 0.4
        break
      case 'endurance':
        proteinPerKg += 0.1
        break
    }

    const dailyProtein = weightKg * proteinPerKg

    // Calculate ranges for different goals
    const ranges = {
      minimum: weightKg * 1.2,
      moderate: weightKg * 1.6,
      high: weightKg * 2.0,
      very_high: weightKg * 2.4
    }

    // Meal breakdown
    const mealBreakdown = {
      breakfast: dailyProtein * 0.25,
      lunch: dailyProtein * 0.3,
      dinner: dailyProtein * 0.3,
      snacks: dailyProtein * 0.15
    }

    // Generate recommendations
    const recommendations = []
    recommendations.push(`Your daily protein need: ${dailyProtein.toFixed(1)}g`)
    
    if (goal === 'weight_loss') {
      recommendations.push('Higher protein helps preserve muscle during weight loss')
      recommendations.push('Aim for protein with every meal')
    } else if (goal === 'muscle_gain') {
      recommendations.push('Distribute protein evenly throughout the day')
      recommendations.push('Include protein within 2 hours after workouts')
    } else if (goal === 'endurance') {
      recommendations.push('Moderate protein supports endurance training')
      recommendations.push('Focus on quality protein sources')
    }

    recommendations.push('Good sources: lean meats, fish, eggs, dairy, legumes')
    recommendations.push('Consider protein timing around workouts')

    return { dailyProtein, ranges, recommendations, mealBreakdown }
  }, [weight, activityLevel, goal])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setActivityLevel('moderate')
    setGoal('maintenance')
    setShowResults(false)
  }

  const result = showResults ? calculateProtein() : { 
    dailyProtein: 0, 
    ranges: {
      minimum: 0,
      moderate: 0,
      high: 0,
      very_high: 0
    }, 
    recommendations: [],
    mealBreakdown: {
      breakfast: 0,
      lunch: 0,
      dinner: 0,
      snacks: 0
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
        <div className="flex items-center">
          <Beef className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Protein Calculator</h2>
        </div>
        <p className="text-amber-100 mt-1">Calculate your daily protein needs</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Weight (lbs)
            </label>
            <input
              type="number"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
              placeholder="Enter weight"
              aria-label="Weight in pounds"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Activity Level
              </label>
              <select
                value={activityLevel}
                onChange={(e) => setActivityLevel(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                aria-label="Select goal"
              >
                <option value="maintenance">Maintenance</option>
                <option value="weight_loss">Weight Loss</option>
                <option value="muscle_gain">Muscle Gain</option>
                <option value="endurance">Endurance</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-2">Daily Protein Need</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-600 mb-2">
                  {result.dailyProtein.toFixed(1)}g
                </div>
                <div className="text-amber-700">
                  Based on {activityLevel} activity and {goal} goal
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Protein Ranges (g/day)</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-amber-700">Minimum:</span>
                  <span className="font-semibold text-amber-800">{result.ranges.minimum?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Moderate:</span>
                  <span className="font-semibold text-amber-800">{result.ranges.moderate?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">High:</span>
                  <span className="font-semibold text-amber-800">{result.ranges.high?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Very High:</span>
                  <span className="font-semibold text-amber-800">{result.ranges.very_high?.toFixed(1)}g</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-3">Meal Breakdown</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-amber-700">Breakfast:</span>
                  <span className="font-semibold text-amber-800">{result.mealBreakdown.breakfast?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Lunch:</span>
                  <span className="font-semibold text-amber-800">{result.mealBreakdown.lunch?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Dinner:</span>
                  <span className="font-semibold text-amber-800">{result.mealBreakdown.dinner?.toFixed(1)}g</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-700">Snacks:</span>
                  <span className="font-semibold text-amber-800">{result.mealBreakdown.snacks?.toFixed(1)}g</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                <h3 className="text-lg font-semibold text-amber-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-amber-600 mr-2">•</span>
                      <span className="text-amber-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Protein Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive protein calculator helps fitness enthusiasts, athletes, and health-conscious 
              individuals determine their optimal daily protein intake based on body weight, activity level, 
              and specific fitness goals. This essential nutrition tool provides personalized protein 
              recommendations to support muscle building, recovery, weight management, and overall health.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Daily Protein Requirements:</strong> Optimal protein intake in grams</li>
              <li><strong>Protein Ranges:</strong> Minimum, moderate, high, and very high levels</li>
              <li><strong>Meal Distribution:</strong> Protein breakdown across daily meals</li>
              <li><strong>Goal-Specific Adjustments:</strong> Customized for different objectives</li>
              <li><strong>Activity Level Considerations:</strong> Protein needs based on exercise intensity</li>
              <li><strong>Personalized Recommendations:</strong> Tailored dietary guidance</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Protein's Essential Functions</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Muscle Building</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Muscle protein synthesis</li>
                  <li>Hypertrophy support</li>
                  <li>Strength development</li>
                  <li>Recovery enhancement</li>
                  <li>Muscle repair</li>
                  <li>Performance improvement</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Body Functions</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Enzyme production</li>
                  <li>Hormone synthesis</li>
                  <li>Immune system support</li>
                  <li>Cell structure</li>
                  <li>Transport molecules</li>
                  <li>Energy production</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Health Benefits</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Satiety and appetite control</li>
                  <li>Blood sugar regulation</li>
                  <li>Bone health support</li>
                  <li>Skin and hair health</li>
                  <li>Wound healing</li>
                  <li>Anti-aging effects</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Goal-Specific Protein Intake</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Weight Loss</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Protein: 1.6-2.2g per kg body weight</li>
                  <li>Preserves lean muscle mass</li>
                  <li>Increases satiety</li>
                  <li>Boosts metabolism</li>
                  <li>Supports fat loss</li>
                  <li>Prevents muscle wasting</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Muscle Gain</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Protein: 1.6-2.4g per kg body weight</li>
                  <li>Maximizes muscle synthesis</li>
                  <li>Supports recovery</li>
                  <li>Enhances performance</li>
                  <li>Optimizes training adaptations</li>
                  <li>Prevents overtraining</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Activity Level Impact</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Endurance Training</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Protein: 1.2-1.6g per kg body weight</li>
                  <li>Muscle preservation</li>
                  <li>Recovery support</li>
                  <li>Immune function</li>
                  <li>Energy production</li>
                  <li>Performance maintenance</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Strength Training</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Protein: 1.6-2.4g per kg body weight</li>
                  <li>Muscle hypertrophy</li>
                  <li>Strength development</li>
                  <li>Recovery optimization</li>
                  <li>Performance enhancement</li>
                  <li>Injury prevention</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
                <h5 className="font-semibold text-amber-800 mb-1">Daily Protein Need</h5>
                <p className="text-amber-700 text-sm">Recommended grams per day</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Protein Ranges</h5>
                <p className="text-orange-700 text-sm">Min, moderate, high, very high</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <h5 className="font-semibold text-red-800 mb-1">Meal Breakdown</h5>
                <p className="text-red-700 text-sm">Protein per meal distribution</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your weight, activity level, and fitness goal. The calculator will provide your 
              optimal daily protein intake in grams, protein ranges for different activity levels, and 
              a meal-by-meal breakdown to help you distribute protein throughout the day.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Protein Timing Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Breakfast:</strong> 20-25% of daily protein (muscle preservation)</li>
              <li><strong>Lunch:</strong> 25-30% of daily protein (sustained energy)</li>
              <li><strong>Dinner:</strong> 25-30% of daily protein (recovery support)</li>
              <li><strong>Snacks:</strong> 15-20% of daily protein (muscle maintenance)</li>
              <li><strong>Pre-Workout:</strong> 15-20g protein 1-2 hours before exercise</li>
              <li><strong>Post-Workout:</strong> 20-30g protein within 30 minutes</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Quality Protein Sources</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Animal Proteins:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Chicken breast (31g per 100g)</li>
                    <li>Salmon (25g per 100g)</li>
                    <li>Eggs (6g per large egg)</li>
                    <li>Greek yogurt (17g per 170g)</li>
                    <li>Lean beef (26g per 100g)</li>
                    <li>Tuna (30g per 100g)</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Plant Proteins:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Lentils (9g per 100g cooked)</li>
                    <li>Chickpeas (9g per 100g cooked)</li>
                    <li>Quinoa (4g per 100g cooked)</li>
                    <li>Tofu (8g per 100g)</li>
                    <li>Edamame (11g per 100g)</li>
                    <li>Hemp seeds (9g per 30g)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Protein Quality Factors</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Biological Value:</strong> How efficiently protein is used by the body</li>
              <li><strong>Amino Acid Profile:</strong> Complete vs. incomplete proteins</li>
              <li><strong>Digestibility:</strong> How easily protein is broken down and absorbed</li>
              <li><strong>Leucine Content:</strong> Key amino acid for muscle protein synthesis</li>
              <li><strong>Processing Method:</strong> Minimally processed vs. highly processed</li>
              <li><strong>Source Quality:</strong> Grass-fed, wild-caught, organic options</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Protein Intake Guidelines</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Minimum Intake:</strong> 0.8g per kg body weight (basic health)</li>
              <li><strong>General Health:</strong> 1.0-1.2g per kg body weight</li>
              <li><strong>Active Adults:</strong> 1.2-1.6g per kg body weight</li>
              <li><strong>Athletes:</strong> 1.6-2.4g per kg body weight</li>
              <li><strong>Elderly:</strong> 1.0-1.2g per kg body weight (muscle preservation)</li>
              <li><strong>Pregnancy:</strong> 1.1-1.3g per kg body weight (increased needs)</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Protein Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Too Much Protein:</strong> Can strain kidneys, displace other nutrients</li>
              <li><strong>Too Little Protein:</strong> Muscle loss, poor recovery, weak immune system</li>
              <li><strong>Poor Timing:</strong> Not consuming protein around workouts</li>
              <li><strong>Low Quality Sources:</strong> Processed meats, fried foods</li>
              <li><strong>Ignoring Distribution:</strong> All protein in one meal</li>
              <li><strong>Not Adjusting for Goals:</strong> Same intake regardless of objectives</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">When to Adjust Protein Intake</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Training Intensity Changes:</strong> Increased or decreased exercise</li>
              <li><strong>Goal Changes:</strong> Switching from weight loss to muscle gain</li>
              <li><strong>Recovery Issues:</strong> Poor muscle recovery, persistent soreness</li>
              <li><strong>Performance Plateaus:</strong> Stalled progress in strength or endurance</li>
              <li><strong>Body Composition Changes:</strong> Unwanted muscle loss or fat gain</li>
              <li><strong>Health Conditions:</strong> Kidney issues, digestive problems</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Protein Supplementation</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Whey Protein:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Fast absorption</li>
                    <li>High leucine content</li>
                    <li>Post-workout ideal</li>
                    <li>Complete amino acid profile</li>
                    <li>Lactose sensitivity possible</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Casein Protein:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Slow absorption</li>
                    <li>Nighttime use</li>
                    <li>Muscle preservation</li>
                    <li>Long-lasting amino acids</li>
                    <li>Better for some digestive systems</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Protein for Different Populations</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Vegetarians/Vegans:</strong> Combine complementary proteins, consider supplements</li>
              <li><strong>Older Adults:</strong> Higher protein needs to prevent sarcopenia</li>
              <li><strong>Pregnant Women:</strong> Increased protein for fetal development</li>
              <li><strong>Children/Teens:</strong> Adequate protein for growth and development</li>
              <li><strong>Injured Athletes:</strong> Higher protein for tissue repair</li>
              <li><strong>Illness Recovery:</strong> Increased protein for immune function</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-amber-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Spread your protein intake evenly throughout the day rather than consuming most of it in 
                one meal. Aim for 20-30g of protein per meal to maximize muscle protein synthesis. 
                Remember that protein quality matters as much as quantity - choose lean, minimally 
                processed sources. Also, consider your individual response to different protein levels; 
                some people thrive on higher protein intakes while others may experience digestive 
                issues. Finally, don't forget that adequate protein intake works best when combined with 
                proper training, sufficient sleep, and overall good nutrition habits.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
