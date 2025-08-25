'use client'

import React from 'react'
import { getCalculatorDescription } from './MetaTags'

interface CalculatorDescriptionProps {
  calculatorType: string
  title?: string
  customDescription?: string
}

export default function CalculatorDescription({ 
  calculatorType, 
  title,
  customDescription 
}: CalculatorDescriptionProps) {
  const description = customDescription || getCalculatorDescription(calculatorType)
  const displayTitle = title || `About ${calculatorType} Calculator`

  return (
    <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
      <h3 className="text-xl font-semibold text-gray-800 mb-4">{displayTitle}</h3>
      <div className="prose prose-gray max-w-none">
        <p className="text-gray-700 mb-4">
          {description}
        </p>
        
        <h4 className="text-lg font-semibold text-gray-800 mb-2">Key Benefits</h4>
        <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
          <li>Free to use with no registration required</li>
          <li>Accurate calculations using industry-standard formulas</li>
          <li>Mobile-friendly design for on-the-go use</li>
          <li>Instant results and comprehensive breakdowns</li>
          <li>Professional-grade accuracy for important decisions</li>
        </ul>
        
        <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
        <p className="text-gray-700 mb-4">
          Simply enter your values in the input fields above, click calculate, and get instant results. 
          Our calculator handles all the complex math for you, providing clear, easy-to-understand outputs.
        </p>
        
        <h4 className="text-lg font-semibold text-gray-800 mb-2">About Online Calculator.live</h4>
        <p className="text-gray-700">
          Online Calculator.live provides free, accurate online calculators for finance, math, health, construction, 
          and more. Our tools are designed to help you make informed decisions with precise calculations. 
          Whether you're a student, professional, or just need quick calculations, we've got you covered.
        </p>
      </div>
    </div>
  )
}
