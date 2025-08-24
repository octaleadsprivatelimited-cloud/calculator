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
      </div>
    </div>
  )
}
