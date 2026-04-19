'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Plus, Minus, X, Divide } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface Fraction {
  numerator: number
  denominator: number
}

interface FractionResult {
  result: Fraction
  decimal: number
  percentage: string
  mixedNumber: string
}

export default function FractionCalculator() {
  const [fraction1, setFraction1] = useState<Fraction>({ numerator: 1, denominator: 2 })
  const [fraction2, setFraction2] = useState<Fraction>({ numerator: 1, denominator: 4 })
  const [operation, setOperation] = useState<'add' | 'subtract' | 'multiply' | 'divide'>('add')
  const [result, setResult] = useState<FractionResult | null>(null)

  const gcd = (a: number, b: number): number => {
    return b === 0 ? a : gcd(b, a % b)
  }

  const simplifyFraction = (fraction: Fraction): Fraction => {
    const divisor = gcd(Math.abs(fraction.numerator), Math.abs(fraction.denominator))
    return {
      numerator: fraction.numerator / divisor,
      denominator: fraction.denominator / divisor
    }
  }

  const calculateFractions = useCallback(() => {
    const f1 = fraction1
    const f2 = fraction2
    let resultFraction: Fraction

    switch (operation) {
      case 'add':
        resultFraction = {
          numerator: f1.numerator * f2.denominator + f2.numerator * f1.denominator,
          denominator: f1.denominator * f2.denominator
        }
        break
      case 'subtract':
        resultFraction = {
          numerator: f1.numerator * f2.denominator - f2.numerator * f1.denominator,
          denominator: f1.denominator * f2.denominator
        }
        break
      case 'multiply':
        resultFraction = {
          numerator: f1.numerator * f2.numerator,
          denominator: f1.denominator * f2.denominator
        }
        break
      case 'divide':
        resultFraction = {
          numerator: f1.numerator * f2.denominator,
          denominator: f1.denominator * f2.numerator
        }
        break
      default:
        return
    }

    const simplified = simplifyFraction(resultFraction)
    const decimal = simplified.numerator / simplified.denominator
    const percentage = (decimal * 100).toFixed(2)
    
    let mixedNumber = ''
    if (Math.abs(simplified.numerator) >= Math.abs(simplified.denominator)) {
      const whole = Math.floor(simplified.numerator / simplified.denominator)
      const remainder = simplified.numerator % simplified.denominator
      if (remainder === 0) {
        mixedNumber = whole.toString()
      } else {
        mixedNumber = `${whole} ${Math.abs(remainder)}/${Math.abs(simplified.denominator)}`
      }
    } else {
      mixedNumber = `${simplified.numerator}/${simplified.denominator}`
    }

    setResult({
      result: simplified,
      decimal,
      percentage,
      mixedNumber
    })
  }, [fraction1, fraction2, operation])

  const getOperationSymbol = (op: string): string => {
    switch (op) {
      case 'add': return '+'
      case 'subtract': return '-'
      case 'multiply': return '×'
      case 'divide': return '÷'
      default: return '+'
    }
  }

  const formatFraction = (fraction: Fraction): string => {
    return `${fraction.numerator}/${fraction.denominator}`
  }

  return (
    <div className="w-full">
      {/* Header */}
      <div className="px-6 py-5 border-b border-google-border flex items-center justify-between bg-white"><div className="flex items-center space-x-3"><div className="p-2 bg-google-blueLight rounded-3xl"><Calculator className="w-5 h-5 text-google-blue" /></div><div><h1 className="text-xl font-medium text-google-text">Calculator</h1><p className="text-google-gray text-xs">Professional calculation tool</p></div></div>
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
            <Calculator className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Fraction Calculator</h1>
            <p className="text-orange-100 text-sm sm:text-base">Add, subtract, multiply, and divide fractions with ease</p>
          </div>
        </div>
      </div>

      {/* Main Calculator Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6 border border-google-border">
          <h2 className="text-lg font-bold text-google-text mb-4 text-center">Fraction Input</h2>

          <div className="space-y-4">
            {/* First Fraction */}
            <div className="bg-orange-50 rounded-2xl p-3 sm:p-4 border border-orange-200">
              <label className="block text-xs font-semibold text-gray-700 mb-2 text-center">First Fraction</label>
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <input
                  type="number"
                  value={fraction1.numerator}
                  onChange={(e) => setFraction1(prev => ({ ...prev, numerator: parseInt(e.target.value) || 0 }))}
                  className="w-16 h-12 sm:w-20 sm:h-16 px-2 sm:px-4 py-2 sm:py-3 border border-google-border rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-center text-lg sm:text-xl font-bold bg-white"
                  placeholder="1"
                />
                <div className="flex items-center text-2xl sm:text-3xl font-bold text-orange-600">/</div>
                <input
                  type="number"
                  value={fraction1.denominator}
                  onChange={(e) => setFraction1(prev => ({ ...prev, denominator: parseInt(e.target.value) || 1 }))}
                  className="w-16 h-12 sm:w-20 sm:h-16 px-2 sm:px-4 py-2 sm:py-3 border border-google-border rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-center text-lg sm:text-xl font-bold bg-white"
                  placeholder="2"
                />
              </div>
              <p className="text-xs sm:text-sm text-google-gray mt-2 text-center">
                {formatFraction(fraction1)} = {(fraction1.numerator / fraction1.denominator).toFixed(4)}
              </p>
            </div>

            {/* Operation Selection */}
            <div className="text-center">
              <label className="block text-xs font-semibold text-gray-700 mb-2">Select Operation</label>
              <div className="flex justify-center gap-2">
                {(['add', 'subtract', 'multiply', 'divide'] as const).map((op) => (
                  <button
                    key={op}
                    onClick={() => setOperation(op)}
                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-2xl transition-all duration-200 text-lg sm:text-2xl font-bold ${
                      operation === op
                        ? 'bg-orange-600 text-white shadow-google transform scale-110'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105'
                    }`}
                    title={`${op.charAt(0).toUpperCase() + op.slice(1)} fractions`}
                  >
                    {getOperationSymbol(op)}
                  </button>
                ))}
              </div>
            </div>

            {/* Second Fraction */}
            <div className="bg-orange-50 rounded-2xl p-3 sm:p-4 border border-orange-200">
              <label className="block text-xs font-semibold text-gray-700 mb-2 text-center">Second Fraction</label>
              <div className="flex items-center justify-center gap-2 sm:gap-4">
                <input
                  type="number"
                  value={fraction2.numerator}
                  onChange={(e) => setFraction2(prev => ({ ...prev, numerator: parseInt(e.target.value) || 0 }))}
                  className="w-16 h-12 sm:w-20 sm:h-16 px-2 sm:px-4 py-2 sm:py-3 border border-google-border rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-center text-lg sm:text-xl font-bold bg-white"
                  placeholder="1"
                />
                <div className="flex items-center text-2xl sm:text-3xl font-bold text-orange-600">/</div>
                <input
                  type="number"
                  value={fraction2.denominator}
                  onChange={(e) => setFraction2(prev => ({ ...prev, denominator: parseInt(e.target.value) || 1 }))}
                  className="w-16 h-12 sm:w-20 sm:h-16 px-2 sm:px-4 py-2 sm:py-3 border border-google-border rounded-2xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-center text-lg sm:text-xl font-bold bg-white"
                  placeholder="4"
                />
              </div>
              <p className="text-xs sm:text-sm text-google-gray mt-2 text-center">
                {formatFraction(fraction2)} = {(fraction2.numerator / fraction2.denominator).toFixed(4)}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-4 pt-2">
              <button
                onClick={calculateFractions}
                className="flex-1 bg-orange-600 text-white py-3 sm:py-4 px-4 sm:px-6 rounded-2xl hover:bg-orange-700 transition-all duration-200 font-semibold text-sm sm:text-lg shadow-google hover:shadow-google"
              >
                Calculate Result
              </button>
              <button
                onClick={() => {
                  setFraction1({ numerator: 1, denominator: 2 })
                  setFraction2({ numerator: 1, denominator: 4 })
                  setOperation('add')
                  setResult(null)
                }}
                className="px-4 sm:px-6 py-3 sm:py-4 border border-google-border text-gray-700 rounded-2xl hover:bg-gray-50 transition-all duration-200 font-semibold shadow-google hover:shadow-google"
                title="Reset to defaults"
              >
                <RotateCcw className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>
          </div>
        </div>

        {/* Results and Information Section */}
        <div className="space-y-3">
          {/* Share Options - Moved to Top */}
          {result && (
            <div className="bg-white rounded-3xl shadow-md p-3 sm:p-4 border border-google-border">
              <ResultSharing
                title="Fraction Calculation Result"
                inputs={[
                  { label: "First Fraction", value: formatFraction(fraction1) },
                  { label: "Operation", value: getOperationSymbol(operation) },
                  { label: "Second Fraction", value: formatFraction(fraction2) }
                ]}
                result={{ 
                  label: "Result", 
                  value: result.mixedNumber,
                  unit: ""
                }}
                calculatorName="Fraction Calculator"
                className="mb-0"
              />
            </div>
          )}

          {/* Results */}
          {result && (
            <div className="bg-white rounded-3xl shadow-md p-4 sm:p-6 border border-google-border">
              <h2 className="text-lg font-bold text-google-text mb-4 text-center">Calculation Result</h2>
              
              <div className="text-center mb-4">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-2">
                  {formatFraction(fraction1)} {getOperationSymbol(operation)} {formatFraction(fraction2)} = {result.mixedNumber}
                </div>
                <p className="text-google-gray text-lg">Simplified: {formatFraction(result.result)}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-green-50 p-4 rounded-2xl border border-green-200">
                  <div className="text-center">
                    <div className="text-sm text-green-600 font-medium">Decimal Value</div>
                    <div className="text-2xl font-bold text-green-800">{result.decimal.toFixed(6)}</div>
                  </div>
                </div>
                <div className="bg-google-blueLight p-4 rounded-2xl border border-blue-200">
                  <div className="text-center">
                    <div className="text-sm text-google-blue font-medium">Percentage</div>
                    <div className="text-2xl font-bold text-blue-800">{result.percentage}%</div>
                  </div>
                </div>
                <div className="bg-purple-50 p-4 rounded-2xl border border-purple-200">
                  <div className="text-center">
                    <div className="text-sm text-purple-600 font-medium">Mixed Number</div>
                    <div className="text-2xl font-bold text-purple-800">{result.mixedNumber}</div>
                  </div>
                </div>
                <div className="bg-orange-50 p-4 rounded-2xl border border-orange-200">
                  <div className="text-center">
                    <div className="text-sm text-orange-600 font-medium">Simplified</div>
                    <div className="text-2xl font-bold text-orange-800">{formatFraction(result.result)}</div>
                  </div>
                </div>
              </div>
            </div>
          )}


          {/* Fraction Tips */}
          <div className="google-card overflow-hidden p-6 border border-google-border">
            <h2 className="text-xl font-bold text-google-text mb-4 text-center">Fraction Tips</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-google-gray">
              <div>
                <p className="mb-2">• <strong>To add/subtract:</strong> Find common denominator first</p>
                <p className="mb-2">• <strong>To multiply:</strong> Multiply numerators and denominators</p>
              </div>
              <div>
                <p className="mb-2">• <strong>To divide:</strong> Multiply by the reciprocal</p>
                <p className="mb-2">• <strong>Always simplify</strong> your final answer</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calculator Description Section */}
      <div className="google-card overflow-hidden p-8 border border-google-border">
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 mb-6 text-center text-lg">
            Our comprehensive fraction calculator helps students, teachers, and professionals perform 
            accurate fraction operations with step-by-step solutions. This essential mathematical tool 
            handles addition, subtraction, multiplication, and division of fractions while providing 
            decimal and percentage conversions for complete understanding.
          </p>
          
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div>
              <h4 className="text-xl font-semibold text-google-text mb-4">What It Calculates</h4>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Fraction Operations:</strong> Addition, subtraction, multiplication, division</li>
                <li><strong>Decimal Conversion:</strong> Precise decimal representations</li>
                <li><strong>Percentage Conversion:</strong> Fraction to percentage calculations</li>
                <li><strong>Mixed Numbers:</strong> Improper fraction to mixed number conversion</li>
                <li><strong>Simplification:</strong> Reduced form of fractions</li>
                <li><strong>Common Denominators:</strong> LCD calculations for operations</li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-xl font-semibold text-google-text mb-4">Supported Operations</h4>
              <div className="space-y-4">
                <div>
                  <h5 className="font-semibold text-google-text mb-2">Basic Operations</h5>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Addition:</strong> Finding common denominators</li>
                    <li><strong>Subtraction:</strong> Borrowing and regrouping</li>
                    <li><strong>Multiplication:</strong> Cross-multiplication</li>
                    <li><strong>Division:</strong> Reciprocal multiplication</li>
                  </ul>
                </div>
                <div>
                  <h5 className="font-semibold text-google-text mb-2">Advanced Features</h5>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Simplification:</strong> Reducing to lowest terms</li>
                    <li><strong>Decimal Conversion:</strong> Precise decimal values</li>
                    <li><strong>Percentage Conversion:</strong> Fraction to percent</li>
                    <li><strong>Common Denominators:</strong> LCD calculations</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}





