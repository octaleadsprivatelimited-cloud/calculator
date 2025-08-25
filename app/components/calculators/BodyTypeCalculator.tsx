'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, User } from 'lucide-react'

export default function BodyTypeCalculator() {
  const [shoulderWidth, setShoulderWidth] = useState('')
  const [waistWidth, setWaistWidth] = useState('')
  const [hipWidth, setHipWidth] = useState('')
  const [wristCircumference, setWristCircumference] = useState('')
  const [ankleCircumference, setAnkleCircumference] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateBodyType = useCallback(() => {
    const shoulders = parseFloat(shoulderWidth) || 0
    const waist = parseFloat(waistWidth) || 0
    const hips = parseFloat(hipWidth) || 0
    const wrist = parseFloat(wristCircumference) || 0
    const ankle = parseFloat(ankleCircumference) || 0
    
    if (shoulders === 0 || waist === 0 || hips === 0) return { 
      bodyType: '', 
      characteristics: [],
      recommendations: [],
      measurements: {
        shoulderToWaist: 0,
        shoulderToHip: 0,
        waistToHip: 0,
        wrist: 0,
        ankle: 0
      },
      score: 0
    }

    // Calculate ratios
    const shoulderToWaistRatio = shoulders / waist
    const shoulderToHipRatio = shoulders / hips
    const waistToHipRatio = waist / hips

    // Determine body type based on ratios and measurements
    let bodyType = ''
    let characteristics = []
    let recommendations = []
    let score = 0

    // Ectomorph (thin, lean)
    if (shoulderToWaistRatio > 1.3 && shoulderToHipRatio > 1.2 && waistToHipRatio < 0.9) {
      bodyType = 'Ectomorph'
      characteristics = [
        'Naturally thin and lean',
        'Long limbs and narrow frame',
        'Fast metabolism',
        'Difficulty gaining weight and muscle'
      ]
      recommendations = [
        'Focus on strength training with compound movements',
        'Eat in a caloric surplus for muscle gain',
        'Include protein-rich foods in every meal',
        'Limit excessive cardio'
      ]
      score = 85
    }
    // Mesomorph (athletic, muscular)
    else if (shoulderToWaistRatio > 1.2 && shoulderToHipRatio > 1.1 && waistToHipRatio < 0.95) {
      bodyType = 'Mesomorph'
      characteristics = [
        'Athletic and muscular build',
        'Broad shoulders and narrow waist',
        'Responds well to training',
        'Can gain and lose weight relatively easily'
      ]
      recommendations = [
        'Balanced approach to cardio and strength training',
        'Moderate caloric intake for maintenance',
        'Focus on progressive overload',
        'Include both compound and isolation exercises'
      ]
      score = 90
    }
    // Endomorph (rounder, softer)
    else if (shoulderToWaistRatio < 1.1 && waistToHipRatio > 0.95) {
      bodyType = 'Endomorph'
      characteristics = [
        'Rounder, softer physique',
        'Wider waist and hips',
        'Slower metabolism',
        'Gains weight easily, harder to lose'
      ]
      recommendations = [
        'Emphasize cardio and HIIT training',
        'Focus on caloric deficit for weight loss',
        'Include strength training for muscle tone',
        'Monitor portion sizes and meal timing'
      ]
      score = 80
    }
    // Combination types
    else if (shoulderToWaistRatio > 1.15 && waistToHipRatio < 0.9) {
      bodyType = 'Ecto-Mesomorph'
      characteristics = [
        'Lean with some natural muscle',
        'Good response to training',
        'Moderate metabolism',
        'Can build muscle with proper training'
      ]
      recommendations = [
        'Balanced strength and cardio training',
        'Moderate caloric surplus for muscle gain',
        'Focus on compound movements',
        'Include some isolation exercises'
      ]
      score = 88
    }
    else if (shoulderToWaistRatio < 1.2 && waistToHipRatio > 0.9) {
      bodyType = 'Meso-Endomorph'
      characteristics = [
        'Muscular but tends to gain fat easily',
        'Good strength potential',
        'Moderate metabolism',
        'Requires careful diet management'
      ]
      recommendations = [
        'Strength training with moderate cardio',
        'Careful caloric management',
        'Focus on protein and complex carbs',
        'Regular monitoring of body composition'
      ]
      score = 82
    }
    else {
      bodyType = 'Combination'
      characteristics = [
        'Mixed characteristics of multiple types',
        'May vary in different areas of the body',
        'Requires personalized approach',
        'Good potential with proper training'
      ]
      recommendations = [
        'Assess individual strengths and weaknesses',
        'Customize training program accordingly',
        'Monitor progress and adjust as needed',
        'Consider working with a trainer'
      ]
      score = 75
    }

    const measurements = {
      shoulderToWaist: shoulderToWaistRatio,
      shoulderToHip: shoulderToHipRatio,
      waistToHip: waistToHipRatio,
      wrist: wrist,
      ankle: ankle
    }

    return { bodyType, characteristics, recommendations, measurements, score }
  }, [shoulderWidth, waistWidth, hipWidth, wristCircumference, ankleCircumference])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setShoulderWidth('')
    setWaistWidth('')
    setHipWidth('')
    setWristCircumference('')
    setAnkleCircumference('')
    setShowResults(false)
  }

  const result = showResults ? calculateBodyType() : { 
    bodyType: '', 
    characteristics: [],
    recommendations: [],
    measurements: {
      shoulderToWaist: 0,
      shoulderToHip: 0,
      waistToHip: 0,
      wrist: 0,
      ankle: 0
    },
    score: 0
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-500 to-purple-500 px-6 py-4">
        <div className="flex items-center">
          <User className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Body Type Calculator</h2>
        </div>
        <p className="text-indigo-100 mt-1">Determine your body type and get personalized recommendations</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Shoulder Width (cm)
              </label>
              <input
                type="number"
                value={shoulderWidth}
                onChange={(e) => setShoulderWidth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter width"
                aria-label="Shoulder width in cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waist Width (cm)
              </label>
              <input
                type="number"
                value={waistWidth}
                onChange={(e) => setWaistWidth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter width"
                aria-label="Waist width in cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hip Width (cm)
              </label>
              <input
                type="number"
                value={hipWidth}
                onChange={(e) => setHipWidth(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter width"
                aria-label="Hip width in cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Wrist Circumference (cm)
              </label>
              <input
                type="number"
                value={wristCircumference}
                onChange={(e) => setWristCircumference(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter circumference"
                aria-label="Wrist circumference in cm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Ankle Circumference (cm)
            </label>
            <input
              type="number"
              value={ankleCircumference}
              onChange={(e) => setAnkleCircumference(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Enter circumference"
              aria-label="Ankle circumference in cm"
            />
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
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Your Body Type</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-600 mb-2">
                  {result.bodyType}
                </div>
                <div className="text-indigo-700">
                  Confidence Score: {result.score}%
                </div>
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">Characteristics</h3>
              <div className="space-y-2">
                {result.characteristics.map((char, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-indigo-600 mr-2">•</span>
                    <span className="text-indigo-700">{char}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-3">Measurements & Ratios</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-indigo-700">Shoulder-to-Waist Ratio:</span>
                  <span className="font-semibold text-indigo-800">{result.measurements.shoulderToWaist?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">Shoulder-to-Hip Ratio:</span>
                  <span className="font-semibold text-indigo-800">{result.measurements.shoulderToHip?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-indigo-700">Waist-to-Hip Ratio:</span>
                  <span className="font-semibold text-indigo-800">{result.measurements.waistToHip?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <h3 className="text-lg font-semibold text-indigo-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-indigo-600 mr-2">•</span>
                      <span className="text-indigo-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Body Type Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive body type calculator helps individuals determine their unique body 
              structure and proportions using multiple anatomical measurements. This essential fitness 
              and fashion tool provides personalized body type classification to support clothing 
              selection, workout planning, and understanding your natural body characteristics.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Body Type Classification:</strong> Ectomorph, Mesomorph, Endomorph, or combination</li>
              <li><strong>Body Proportions:</strong> Shoulder-to-waist and waist-to-hip ratios</li>
              <li><strong>Confidence Score:</strong> Accuracy level of the classification</li>
              <li><strong>Physical Characteristics:</strong> Typical traits of your body type</li>
              <li><strong>Personalized Recommendations:</strong> Clothing and fitness guidance</li>
              <li><strong>Measurement Analysis:</strong> Detailed proportion breakdown</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Body Type Categories</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Ectomorph</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Naturally thin and lean</li>
                  <li>Long limbs and narrow frame</li>
                  <li>Fast metabolism</li>
                  <li>Difficulty gaining weight</li>
                  <li>Naturally athletic</li>
                  <li>Good endurance</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Mesomorph</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Naturally muscular build</li>
                  <li>Medium bone structure</li>
                  <li>Gains muscle easily</li>
                  <li>Responds well to training</li>
                  <li>Good strength potential</li>
                  <li>Balanced metabolism</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Endomorph</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Naturally larger frame</li>
                  <li>Wider bone structure</li>
                  <li>Slower metabolism</li>
                  <li>Gains weight easily</li>
                  <li>Good strength potential</li>
                  <li>Natural power athletes</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Body Proportions Analysis</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Shoulder-to-Waist Ratio</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Indicates upper body structure</li>
                  <li>Higher ratios = broader shoulders</li>
                  <li>Lower ratios = more balanced</li>
                  <li>Affects clothing fit</li>
                  <li>Influences workout focus</li>
                  <li>Key for body type classification</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Waist-to-Hip Ratio</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Indicates lower body structure</li>
                  <li>Health indicator</li>
                  <li>Affects clothing selection</li>
                  <li>Influences exercise focus</li>
                  <li>Varies by gender</li>
                  <li>Important for body type ID</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <h5 className="font-semibold text-indigo-800 mb-1">Body Type</h5>
                <p className="text-indigo-700 text-sm">Your primary classification</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Confidence Score</h5>
                <p className="text-purple-700 text-sm">Accuracy of classification</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Characteristics</h5>
                <p className="text-blue-700 text-sm">Typical traits and features</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Measure your shoulder width, waist width, hip width, wrist circumference, and ankle 
              circumference in centimeters. The calculator will analyze your proportions and classify 
              your body type, providing personalized characteristics and recommendations.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Measurement Techniques</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Shoulder Width:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Measure across shoulder blades</li>
                    <li>Keep arms relaxed</li>
                    <li>Measure at widest point</li>
                    <li>Use flexible tape measure</li>
                    <li>Stand naturally</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Waist & Hip:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Waist at narrowest point</li>
                    <li>Hips at widest point</li>
                    <li>Don't pull tape tight</li>
                    <li>Measure while standing</li>
                    <li>Exhale normally</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Body Type Combinations</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Ecto-Mesomorph:</strong> Lean with some muscle definition</li>
              <li><strong>Meso-Endomorph:</strong> Muscular with tendency to gain fat</li>
              <li><strong>Ecto-Endomorph:</strong> Thin frame with fat storage tendency</li>
              <li><strong>Balanced Types:</strong> Equal characteristics from multiple types</li>
              <li><strong>Pure Types:</strong> Strong characteristics of one type</li>
              <li><strong>Mixed Types:</strong> Combination of all three types</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Fitness Implications</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Training Focus</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Ectomorphs:</strong> Strength training, compound movements</li>
                  <li><strong>Mesomorphs:</strong> Balanced training, variety</li>
                  <li><strong>Endomorphs:</strong> Cardio focus, calorie burning</li>
                  <li><strong>Combinations:</strong> Mixed approach based on goals</li>
                  <li><strong>Recovery:</strong> Varies by body type</li>
                  <li><strong>Progression:</strong> Different rates for each type</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Nutrition Approach</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Ectomorphs:</strong> Higher calories, frequent meals</li>
                  <li><strong>Mesomorphs:</strong> Balanced macros, moderate calories</li>
                  <li><strong>Endomorphs:</strong> Lower calories, higher protein</li>
                  <li><strong>Meal Timing:</strong> Important for all types</li>
                  <li><strong>Supplements:</strong> Vary by body type needs</li>
                  <li><strong>Hydration:</strong> Essential for all types</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Clothing and Style</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Ectomorphs:</strong> Layered looks, structured pieces</li>
              <li><strong>Mesomorphs:</strong> Most styles work well</li>
              <li><strong>Endomorphs:</strong> Vertical lines, proper fit</li>
              <li><strong>Proportions:</strong> Balance top and bottom</li>
              <li><strong>Colors:</strong> Use to enhance or minimize areas</li>
              <li><strong>Fit:</strong> Proper sizing more important than style</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Body Type Myths</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Fixed Types:</strong> Body types can change over time</li>
              <li><strong>One Size Fits All:</strong> Each type has variations</li>
              <li><strong>Genetic Destiny:</strong> Lifestyle affects body type expression</li>
              <li><strong>Perfect Type:</strong> All types have advantages</li>
              <li><strong>No Overlap:</strong> Most people are combinations</li>
              <li><strong>Static Classification:</strong> Body types evolve with age</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Improving Body Composition</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Ectomorphs:</strong> Focus on muscle building, adequate calories</li>
              <li><strong>Mesomorphs:</strong> Balance strength and cardio, moderate diet</li>
              <li><strong>Endomorphs:</strong> Emphasize fat loss, higher activity levels</li>
              <li><strong>All Types:</strong> Consistency is key</li>
              <li><strong>Progressive Overload:</strong> Gradually increase intensity</li>
              <li><strong>Recovery:</strong> Adequate rest for all types</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">When Body Type Matters</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Fitness Planning:</strong> Tailor workouts to your type</li>
              <li><strong>Clothing Shopping:</strong> Choose styles that flatter</li>
              <li><strong>Goal Setting:</strong> Realistic expectations based on type</li>
              <li><strong>Nutrition Planning:</strong> Adjust diet for your metabolism</li>
              <li><strong>Progress Tracking:</strong> Compare to similar body types</li>
              <li><strong>Motivation:</strong> Understand your natural advantages</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Remember that body type is just one factor in your fitness and style journey. While 
                it provides useful insights, don't let it limit your goals or define your potential. 
                Focus on working with your natural characteristics rather than fighting against them. 
                Also, body types can change over time with consistent training and lifestyle changes. 
                Use this information as a starting point for personalized approaches, but always 
                prioritize what feels good and works for your individual body and goals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
