'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Dumbbell } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function OneRepMaxCalculator() {
  const [weight, setWeight] = useState('')
  const [reps, setReps] = useState('')
  const [formula, setFormula] = useState('brzycki')
  const [showResults, setShowResults] = useState(false)

  const calculateOneRepMax = useCallback(() => {
    const w = parseFloat(weight) || 0
    const r = parseFloat(reps) || 0
    if (w === 0 || r === 0) return { 
      oneRepMax: 0, 
      percentages: {}, 
      recommendations: [],
      formulaName: ''
    }

    let oneRepMax = 0
    let formulaName = ''

    // Different 1RM formulas
    switch (formula) {
      case 'brzycki':
        oneRepMax = w / (1.0278 - 0.0278 * r)
        formulaName = 'Brzycki Formula'
        break
      case 'epley':
        oneRepMax = w * (1 + r / 30)
        formulaName = 'Epley Formula'
        break
      case 'lombardi':
        oneRepMax = w * Math.pow(r, 0.1)
        formulaName = 'Lombardi Formula'
        break
      case 'mayhew':
        oneRepMax = w / (0.522 + 0.419 * Math.exp(-0.055 * r))
        formulaName = 'Mayhew Formula'
        break
      case 'oconnor':
        oneRepMax = w * (1 + r * 0.025)
        formulaName = 'O\'Connor Formula'
        break
      default:
        oneRepMax = w / (1.0278 - 0.0278 * r)
        formulaName = 'Brzycki Formula'
    }

    // Calculate percentages of 1RM
    const percentages = {
      '100%': oneRepMax,
      '95%': oneRepMax * 0.95,
      '90%': oneRepMax * 0.90,
      '85%': oneRepMax * 0.85,
      '80%': oneRepMax * 0.80,
      '75%': oneRepMax * 0.75,
      '70%': oneRepMax * 0.70,
      '65%': oneRepMax * 0.65,
      '60%': oneRepMax * 0.60
    }

    // Generate recommendations
    const recommendations = []
    if (oneRepMax > 0) {
      recommendations.push(`Your 1RM is approximately ${oneRepMax.toFixed(0)} lbs`)
      
      if (r <= 3) {
        recommendations.push('Low rep ranges are excellent for strength building')
        recommendations.push('Consider working at 85-95% of your 1RM')
      } else if (r <= 8) {
        recommendations.push('Moderate rep ranges are great for hypertrophy')
        recommendations.push('Work at 70-85% of your 1RM for muscle growth')
      } else {
        recommendations.push('Higher rep ranges build muscular endurance')
        recommendations.push('Work at 60-75% of your 1RM for endurance')
      }
      
      recommendations.push('Test your 1RM every 4-6 weeks to track progress')
    }

    return { oneRepMax, percentages, recommendations, formulaName }
  }, [weight, reps, formula])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setReps('')
    setFormula('brzycki')
    setShowResults(false)
  }

  const result = showResults ? calculateOneRepMax() : { 
    oneRepMax: 0, 
    percentages: {}, 
    recommendations: [],
    formulaName: ''
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-4">
        <div className="flex items-center">
          <Dumbbell className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">One Rep Max Calculator</h2>
        </div>
        <p className="text-purple-100 mt-1">Calculate your one rep maximum using multiple formulas</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight Lifted (lbs)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter weight"
                aria-label="Weight lifted in pounds"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Reps Performed
              </label>
              <input
                type="number"
                value={reps}
                onChange={(e) => setReps(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                placeholder="Enter reps"
                min="1"
                max="20"
                aria-label="Number of reps performed"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formula
            </label>
            <select
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
              aria-label="Select calculation formula"
            >
              <option value="brzycki">Brzycki (Most Popular)</option>
              <option value="epley">Epley</option>
              <option value="lombardi">Lombardi</option>
              <option value="mayhew">Mayhew</option>
              <option value="oconnor">O'Connor</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-4 rounded-lg border border-purple-200">
              <ResultSharing
                title="One Rep Max Calculation Result"
                inputs={[
                  { label: "Weight Lifted", value: `${weight} lbs` },
                  { label: "Reps Performed", value: `${reps} reps` },
                  { label: "Formula Used", value: result.formulaName }
                ]}
                result={{ 
                  label: "One Rep Max", 
                  value: `${result.oneRepMax.toFixed(0)}`,
                  unit: "lbs"
                }}
                calculatorName="One Rep Max Calculator"
                className="mb-0"
              />
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-2">Your One Rep Max</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">
                  {result.oneRepMax.toFixed(0)} lbs
                </div>
                <div className="text-purple-700">
                  Using {result.formulaName}
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-3">Training Percentages</h3>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(result.percentages).map(([percentage, weight]) => (
                  <div key={percentage} className="flex justify-between">
                    <span className="text-purple-700">{percentage}:</span>
                    <span className="font-semibold text-purple-800">{weight.toFixed(0)} lbs</span>
                  </div>
                ))}
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h3 className="text-lg font-semibold text-purple-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-purple-600 mr-2">•</span>
                      <span className="text-purple-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About One Rep Max Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive One Rep Max (1RM) calculator helps strength athletes, powerlifters, and fitness 
              enthusiasts determine their maximum lifting capacity. This essential tool provides accurate estimates 
              using multiple validated formulas, enabling precise training program design and progress tracking 
              for optimal strength development.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>One Rep Max:</strong> Maximum weight you can lift for one repetition</li>
              <li><strong>Training Percentages:</strong> Weight loads for different training intensities</li>
              <li><strong>Formula Comparison:</strong> Multiple calculation methods for accuracy</li>
              <li><strong>Training Recommendations:</strong> Personalized workout guidance</li>
              <li><strong>Progress Tracking:</strong> Strength development monitoring</li>
              <li><strong>Program Design:</strong> Optimal training load determination</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">1RM Calculation Formulas</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Brzycki Formula</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Most Popular:</strong> Widely used in strength training</li>
                  <li><strong>Formula:</strong> 1RM = Weight × (36 ÷ (37 - Reps))</li>
                  <li><strong>Accuracy:</strong> Best for 1-10 rep ranges</li>
                  <li><strong>Application:</strong> General strength training</li>
                  <li><strong>Limitations:</strong> Less accurate for very high reps</li>
                  <li><strong>Best For:</strong> Most training scenarios</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Epley Formula</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Simple Formula:</strong> Easy to remember and calculate</li>
                  <li><strong>Formula:</strong> 1RM = Weight × (1 + Reps ÷ 30)</li>
                  <li><strong>Accuracy:</strong> Good for 1-10 rep ranges</li>
                  <li><strong>Application:</strong> Quick estimates</li>
                  <li><strong>Limitations:</strong> May overestimate for high reps</li>
                  <li><strong>Best For:</strong> Beginners and quick calculations</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">1RM Estimate</h5>
                <p className="text-purple-700 text-sm">Maximum strength capacity</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Training %</h5>
                <p className="text-blue-700 text-sm">Optimal workout loads</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Formula Used</h5>
                <p className="text-green-700 text-sm">Calculation method</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Recommendations</h5>
                <p className="text-orange-700 text-sm">Training guidance</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the weight you lifted and the number of reps you completed. Select your preferred 
              calculation formula, and the calculator will estimate your one rep max and provide training 
              percentages for different workout intensities. Use these results to design effective 
              strength training programs.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Training Percentage Guidelines</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Strength Development:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>90-100%:</strong> Maximal strength (1-3 reps)</li>
                    <li><strong>80-89%:</strong> Strength (3-6 reps)</li>
                    <li><strong>70-79%:</strong> Strength-endurance (6-12 reps)</li>
                    <li><strong>60-69%:</strong> Endurance (12-20 reps)</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Training Goals:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li><strong>Power:</strong> 70-85% for explosive movements</li>
                    <li><strong>Hypertrophy:</strong> 70-80% for muscle growth</li>
                    <li><strong>Endurance:</strong> 60-70% for stamina</li>
                    <li><strong>Recovery:</strong> 50-60% for active recovery</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Strength Training Fundamentals</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Training Principles</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Progressive Overload:</strong> Gradually increase training stress</li>
                  <li><strong>Specificity:</strong> Train movements you want to improve</li>
                  <li><strong>Recovery:</strong> Allow adequate rest between sessions</li>
                  <li><strong>Variation:</strong> Change training variables regularly</li>
                  <li><strong>Individualization:</strong> Adapt to personal needs</li>
                  <li><strong>Consistency:</strong> Regular training over time</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Training Variables</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Intensity:</strong> Percentage of 1RM</li>
                  <li><strong>Volume:</strong> Total work performed</li>
                  <li><strong>Frequency:</strong> Training sessions per week</li>
                  <li><strong>Rest Periods:</strong> Recovery between sets</li>
                  <li><strong>Exercise Selection:</strong> Movement patterns</li>
                  <li><strong>Technique:</strong> Movement quality</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Exercise Categories</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Compound Movements</h5>
                <p className="text-blue-700 text-sm">Multi-joint exercises</p>
                <ul className="list-disc list-inside text-blue-700 space-y-1 text-xs mt-2">
                  <li>Squat, Deadlift, Bench Press</li>
                  <li>Overhead Press, Row</li>
                  <li>Pull-ups, Dips</li>
                </ul>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Isolation Movements</h5>
                <p className="text-green-700 text-sm">Single-joint exercises</p>
                <ul className="list-disc list-inside text-green-700 space-y-1 text-xs mt-2">
                  <li>Bicep Curls, Tricep Extensions</li>
                  <li>Leg Extensions, Leg Curls</li>
                  <li>Lateral Raises, Flyes</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Accessory Movements</h5>
                <p className="text-purple-700 text-sm">Supporting exercises</p>
                <ul className="list-disc list-inside text-purple-700 space-y-1 text-xs mt-2">
                  <li>Core work, Mobility</li>
                  <li>Stability, Balance</li>
                  <li>Recovery, Prehab</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Training Program Design</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Beginner Programs:</strong> Focus on technique and consistency</li>
              <li><strong>Intermediate Programs:</strong> Add volume and variation</li>
              <li><strong>Advanced Programs:</strong> Periodization and specialization</li>
              <li><strong>Strength Focus:</strong> Higher intensity, lower volume</li>
              <li><strong>Hypertrophy Focus:</strong> Moderate intensity, higher volume</li>
              <li><strong>Endurance Focus:</strong> Lower intensity, very high volume</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Safety Considerations</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Proper Form:</strong> Always prioritize technique over weight</li>
              <li><strong>Warm-up Sets:</strong> Gradually increase to working weight</li>
              <li><strong>Spotter Required:</strong> Use spotters for heavy lifts</li>
              <li><strong>Equipment Check:</strong> Verify safety equipment</li>
              <li><strong>Progressive Loading:</strong> Don't jump to maximal weights</li>
              <li><strong>Listen to Body:</strong> Stop if you feel pain or discomfort</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Progress Tracking</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Strength Metrics</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>1RM Testing:</strong> Periodic max effort attempts</li>
                  <li><strong>Volume Tracking:</strong> Total weight lifted per session</li>
                  <li><strong>Progressive Overload:</strong> Weight increases over time</li>
                  <li><strong>Rep PRs:</strong> Personal records at different weights</li>
                  <li><strong>Form Improvement:</strong> Technique quality assessment</li>
                  <li><strong>Recovery Metrics:</strong> Rest and adaptation tracking</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Training Log</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Workout Details:</strong> Exercises, sets, reps, weights</li>
                  <li><strong>Performance Notes:</strong> How the workout felt</li>
                  <li><strong>Progress Photos:</strong> Visual progress tracking</li>
                  <li><strong>Body Measurements:</strong> Circumference and body composition</li>
                  <li><strong>Energy Levels:</strong> Daily energy and motivation</li>
                  <li><strong>Recovery Status:</strong> Sleep, soreness, readiness</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Training Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Too Much Too Soon:</strong> Rapidly increasing training load</li>
              <li><strong>Poor Form:</strong> Sacrificing technique for weight</li>
              <li><strong>Insufficient Recovery:</strong> Not allowing adequate rest</li>
              <li><strong>Random Training:</strong> Lack of structured programming</li>
              <li><strong>Ignoring Weaknesses:</strong> Only training favorite exercises</li>
              <li><strong>Poor Nutrition:</strong> Inadequate fueling for training</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Training Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Periodization:</strong> Systematic training variation</li>
              <li><strong>Deloading:</strong> Planned recovery periods</li>
              <li><strong>Peaking:</strong> Optimizing performance for competition</li>
              <li><strong>Conjugate Method:</strong> Rotating exercise variations</li>
              <li><strong>Wave Loading:</strong> Alternating intensity patterns</li>
              <li><strong>Cluster Sets:</strong> Short rest intervals within sets</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Your 1RM is a moving target that changes based on training, recovery, nutrition, and other factors. 
                Test your 1RM every 4-8 weeks to track progress, but don't become obsessed with the number. 
                Focus on consistent training, proper form, and progressive overload. Remember that strength gains 
                come from consistent effort over time, not from occasional maximal attempts. Use your 1RM to guide 
                training percentages, but always prioritize technique and safety over weight on the bar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
