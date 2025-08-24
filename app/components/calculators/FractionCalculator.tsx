'use client'

import React, { useState, useCallback } from 'react'
import { Calculator as CalculatorIcon, RotateCcw, Plus, Minus, X, Divide } from 'lucide-react'

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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-amber-100 p-4">
      <div className="max-w-6xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <CalculatorIcon className="w-12 h-12 mr-3 text-orange-600" />
            Fraction Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Perform fraction arithmetic and conversions with ease
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Fraction Input</h2>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Fraction</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={fraction1.numerator}
                    onChange={(e) => setFraction1(prev => ({ ...prev, numerator: parseInt(e.target.value) || 0 }))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-center"
                    placeholder="1"
                  />
                  <div className="flex items-center text-2xl font-bold text-gray-400">/</div>
                  <input
                    type="number"
                    value={fraction1.denominator}
                    onChange={(e) => setFraction1(prev => ({ ...prev, denominator: parseInt(e.target.value) || 1 }))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-center"
                    placeholder="2"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1 text-center">
                  {formatFraction(fraction1)} = {(fraction1.numerator / fraction1.denominator).toFixed(4)}
                </p>
              </div>

              <div className="text-center">
                <div className="flex justify-center gap-2 mb-4">
                  {(['add', 'subtract', 'multiply', 'divide'] as const).map((op) => (
                    <button
                      key={op}
                      onClick={() => setOperation(op)}
                      className={`p-3 rounded-lg transition-colors ${
                        operation === op
                          ? 'bg-orange-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      title={`${op.charAt(0).toUpperCase() + op.slice(1)} fractions`}
                    >
                      {getOperationSymbol(op)}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Second Fraction</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    value={fraction2.numerator}
                    onChange={(e) => setFraction2(prev => ({ ...prev, numerator: parseInt(e.target.value) || 0 }))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-center"
                    placeholder="1"
                  />
                  <div className="flex items-center text-2xl font-bold text-gray-400">/</div>
                  <input
                    type="number"
                    value={fraction2.denominator}
                    onChange={(e) => setFraction2(prev => ({ ...prev, denominator: parseInt(e.target.value) || 1 }))}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:border-orange-500 focus:ring-2 focus:ring-orange-200 text-center"
                    placeholder="4"
                  />
                </div>
                <p className="text-sm text-gray-500 mt-1 text-center">
                  {formatFraction(fraction2)} = {(fraction2.numerator / fraction2.denominator).toFixed(4)}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={calculateFractions}
                  className="flex-1 bg-orange-600 text-white py-3 px-6 rounded-lg hover:bg-orange-700 transition-colors font-medium"
                >
                  Calculate
                </button>
                <button
                  onClick={() => {
                    setFraction1({ numerator: 1, denominator: 2 })
                    setFraction2({ numerator: 1, denominator: 4 })
                    setOperation('add')
                    setResult(null)
                  }}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {result && (
              <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Result</h2>
                
                <div className="text-center mb-6">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    {formatFraction(fraction1)} {getOperationSymbol(operation)} {formatFraction(fraction2)} = {result.mixedNumber}
                  </div>
                  <p className="text-gray-600">Simplified: {formatFraction(result.result)}</p>
                </div>

                <div className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Decimal Value</span>
                    <span className="font-semibold">{result.decimal.toFixed(6)}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Percentage</span>
                    <span className="font-semibold">{result.percentage}%</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Mixed Number</span>
                    <span className="font-semibold">{result.mixedNumber}</span>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Examples</h2>
              <div className="space-y-3">
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800">Addition</h3>
                  <p className="text-orange-600 text-sm">1/2 + 1/4 = 3/4 = 0.75</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800">Multiplication</h3>
                  <p className="text-orange-600 text-sm">1/2 × 1/3 = 1/6 ≈ 0.167</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <h3 className="font-semibold text-orange-800">Division</h3>
                  <p className="text-orange-600 text-sm">1/2 ÷ 1/4 = 2</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-orange-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Fraction Tips</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>To add/subtract:</strong> Find common denominator first</p>
                <p>• <strong>To multiply:</strong> Multiply numerators and denominators</p>
                <p>• <strong>To divide:</strong> Multiply by the reciprocal</p>
                <p>• <strong>Always simplify</strong> your final answer</p>
              </div>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>© 2024 Fraction Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
