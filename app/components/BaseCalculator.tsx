'use client'
import React from 'react'
import { Calculator, RotateCcw, Info, LucideIcon } from 'lucide-react'

interface BaseCalculatorProps {
  title: string
  description: string
  icon: LucideIcon
  children: React.ReactNode
  results?: React.ReactNode
  onCalculate?: () => void
  onReset?: () => void
  showResults?: boolean
  calculateButtonText?: string
}

export default function BaseCalculator({
  title,
  description,
  icon: Icon,
  children,
  results,
  onCalculate,
  onReset,
  showResults = false,
  calculateButtonText = 'Calculate'
}: BaseCalculatorProps) {
  return (
    <div className="w-full bg-white rounded-3xl shadow-google border border-google-border overflow-hidden">
      {/* Title Bar */}
      <div className="px-6 py-5 border-b border-google-border flex items-center justify-between bg-white">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-google-blueLight rounded-xl">
            <Icon className="w-5 h-5 text-google-blue" />
          </div>
          <div>
            <h1 className="text-xl font-medium text-google-text">{title}</h1>
            <p className="text-google-gray text-xs">{description}</p>
          </div>
        </div>
        <Info className="w-5 h-5 text-google-gray opacity-50 cursor-help" />
      </div>

      <div className="p-6 lg:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Inputs Column */}
          <div className="space-y-6">
            {children}

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              {onCalculate && (
                <button 
                  onClick={onCalculate} 
                  className="flex-1 bg-google-blue hover:bg-google-blueHover text-white font-medium py-3.5 px-6 rounded-full transition-all flex items-center justify-center shadow-sm"
                >
                  <Calculator className="h-5 w-5 mr-2" />
                  {calculateButtonText}
                </button>
              )}
              {onReset && (
                <button 
                  onClick={onReset} 
                  className="bg-google-lightGray hover:bg-google-border text-google-text font-medium py-3.5 px-6 rounded-full transition-all flex items-center justify-center"
                >
                  <RotateCcw className="h-5 w-5 mr-2" />
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Results Column */}
          <div className="flex flex-col">
            {!showResults ? (
              <div className="flex-1 flex flex-col items-center justify-center p-8 bg-google-bg rounded-3xl border border-dashed border-google-border">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mb-4">
                  <Calculator className="w-8 h-8 text-google-gray opacity-20" />
                </div>
                <h3 className="text-google-text font-medium mb-1">Ready to calculate</h3>
                <p className="text-google-gray text-sm text-center">Fill in the details to see your results.</p>
              </div>
            ) : (
              <div className="flex-1 space-y-4">
                {results}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
