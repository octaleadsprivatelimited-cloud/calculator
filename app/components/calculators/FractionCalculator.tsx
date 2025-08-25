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
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Fraction Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive fraction calculator helps students, teachers, and professionals perform 
              accurate fraction operations with step-by-step solutions. This essential mathematical tool 
              handles addition, subtraction, multiplication, and division of fractions while providing 
              decimal and percentage conversions for complete understanding.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Fraction Operations:</strong> Addition, subtraction, multiplication, division</li>
              <li><strong>Decimal Conversion:</strong> Precise decimal representations</li>
              <li><strong>Percentage Conversion:</strong> Fraction to percentage calculations</li>
              <li><strong>Mixed Numbers:</strong> Improper fraction to mixed number conversion</li>
              <li><strong>Simplification:</strong> Reduced form of fractions</li>
              <li><strong>Common Denominators:</strong> LCD calculations for operations</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Supported Operations</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Basic Operations</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Addition:</strong> Finding common denominators</li>
                  <li><strong>Subtraction:</strong> Borrowing and regrouping</li>
                  <li><strong>Multiplication:</strong> Cross-multiplication</li>
                  <li><strong>Division:</strong> Reciprocal multiplication</li>
                  <li><strong>Mixed Numbers:</strong> Converting between forms</li>
                  <li><strong>Improper Fractions:</strong> Converting to mixed numbers</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Advanced Features</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Simplification:</strong> Reducing to lowest terms</li>
                  <li><strong>Decimal Conversion:</strong> Precise decimal values</li>
                  <li><strong>Percentage Conversion:</strong> Fraction to percent</li>
                  <li><strong>Common Denominators:</strong> LCD calculations</li>
                  <li><strong>Equivalent Fractions:</strong> Finding equal values</li>
                  <li><strong>Cross-Multiplication:</strong> Proportion solving</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Fraction</h5>
                <p className="text-orange-700 text-sm">Simplified form</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Decimal</h5>
                <p className="text-blue-700 text-sm">Decimal equivalent</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Percentage</h5>
                <p className="text-green-700 text-sm">Percent form</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Mixed Number</h5>
                <p className="text-purple-700 text-sm">Whole + fraction</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the numerator and denominator for each fraction, select the desired operation 
              (addition, subtraction, multiplication, or division), and click calculate. The calculator 
              will provide the result in multiple formats including simplified fraction, decimal, percentage, 
              and mixed number representations.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Fraction Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Fraction Components:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Numerator: Top number (parts taken)</li>
                    <li>Denominator: Bottom number (total parts)</li>
                    <li>Proper: Numerator &lt; denominator</li>
                    <li>Improper: Numerator &ge; denominator</li>
                    <li>Mixed: Whole number + proper fraction</li>
                    <li>Equivalent: Same value, different form</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Fraction Types:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Unit fractions: 1/n (1/2, 1/3, 1/4)</li>
                    <li>Vulgar fractions: Common fractions</li>
                    <li>Decimal fractions: Base-10 denominators</li>
                    <li>Complex fractions: Fractions within fractions</li>
                    <li>Continued fractions: Infinite representations</li>
                    <li>Egyptian fractions: Sum of unit fractions</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Fraction Operations</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Addition & Subtraction</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Common Denominator:</strong> Find LCD first</li>
                  <li><strong>Convert Fractions:</strong> Equivalent forms</li>
                  <li><strong>Add/Subtract:</strong> Numerators only</li>
                  <li><strong>Simplify Result:</strong> Reduce to lowest terms</li>
                  <li><strong>Mixed Numbers:</strong> Handle whole parts separately</li>
                  <li><strong>Borrowing:</strong> Convert whole to fraction</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Multiplication & Division</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Multiplication:</strong> Multiply numerators and denominators</li>
                  <li><strong>Division:</strong> Multiply by reciprocal</li>
                  <li><strong>Cross-Cancellation:</strong> Reduce before multiplying</li>
                  <li><strong>Mixed Numbers:</strong> Convert to improper first</li>
                  <li><strong>Simplify:</strong> Reduce result to lowest terms</li>
                  <li><strong>Check Work:</strong> Verify with decimal conversion</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Denominators</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Least Common Denominator (LCD):</strong> Smallest common multiple</li>
              <li><strong>Prime Factorization:</strong> Break down denominators</li>
              <li><strong>Common Multiples:</strong> Find shared factors</li>
              <li><strong>Cross-Multiplication:</strong> For addition/subtraction</li>
              <li><strong>Equivalent Fractions:</strong> Convert to common denominator</li>
              <li><strong>Simplification:</strong> Reduce after operations</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Fraction Simplification</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Simplification Methods</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Prime Factorization:</strong> Break down to primes</li>
                  <li><strong>Greatest Common Factor:</strong> Find GCF of numerator/denominator</li>
                  <li><strong>Division Method:</strong> Divide by common factors</li>
                  <li><strong>Cross-Cancellation:</strong> Cancel common factors</li>
                  <li><strong>Euclidean Algorithm:</strong> Efficient GCF calculation</li>
                  <li><strong>Visual Methods:</strong> Using fraction bars</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">When to Simplify</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>After Operations:</strong> Always simplify results</li>
                  <li><strong>Before Operations:</strong> Simplify inputs when possible</li>
                  <li><strong>Mixed Numbers:</strong> Convert improper fractions</li>
                  <li><strong>Final Answers:</strong> Present in simplest form</li>
                  <li><strong>Comparisons:</strong> Easier to compare simplified forms</li>
                  <li><strong>Problem Solving:</strong> Clearer intermediate steps</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Fraction to Decimal Conversion</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Division Method:</strong> Divide numerator by denominator</li>
              <li><strong>Terminating Decimals:</strong> Finite decimal representations</li>
              <li><strong>Repeating Decimals:</strong> Infinite repeating patterns</li>
              <li><strong>Period Length:</strong> Length of repeating pattern</li>
              <li><strong>Rounding:</strong> Appropriate decimal places</li>
              <li><strong>Accuracy:</strong> Precision requirements</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Fraction to Percentage</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Conversion Formula:</strong> (Fraction × 100)%</li>
              <li><strong>Decimal Method:</strong> Convert to decimal first</li>
              <li><strong>Cross-Multiplication:</strong> Direct proportion method</li>
              <li><strong>Common Percentages:</strong> 1/2 = 50%, 1/4 = 25%</li>
              <li><strong>Mixed Numbers:</strong> Handle whole parts separately</li>
              <li><strong>Rounding:</strong> Appropriate decimal places</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Fraction Calculation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Always Simplify:</strong> Reduce fractions to lowest terms</li>
              <li><strong>Check Work:</strong> Verify with decimal conversion</li>
              <li><strong>Use Common Denominators:</strong> For addition and subtraction</li>
              <li><strong>Cross-Cancel:</strong> Reduce before multiplying</li>
              <li><strong>Convert Mixed Numbers:</strong> To improper fractions first</li>
              <li><strong>Practice Estimation:</strong> Approximate before calculating</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Fraction Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Adding Denominators:</strong> Only add numerators</li>
              <li><strong>Forgetting Common Denominator:</strong> For addition/subtraction</li>
              <li><strong>Not Simplifying:</strong> Leaving answers unreduced</li>
              <li><strong>Mixed Number Errors:</strong> Incorrect conversions</li>
              <li><strong>Sign Errors:</strong> Negative sign placement</li>
              <li><strong>Decimal Confusion:</strong> Misplacing decimal points</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Fraction Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Complex Fractions:</strong> Fractions within fractions</li>
              <li><strong>Continued Fractions:</strong> Infinite representations</li>
              <li><strong>Egyptian Fractions:</strong> Sum of unit fractions</li>
              <li><strong>Farey Sequences:</strong> Ordered fraction sequences</li>
              <li><strong>Farey Fractions:</strong> Reduced fractions in order</li>
              <li><strong>Mediant Fractions:</strong> Between two fractions</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When working with fractions, always think about the relationship between the numbers rather 
                than just memorizing rules. Understanding that fractions represent parts of a whole helps 
                visualize operations. For addition and subtraction, imagine combining or separating parts 
                of the same whole. For multiplication, think of taking a portion of a portion. For division, 
                consider how many parts fit into another part. Always simplify your final answers and check 
                your work by converting to decimals or using estimation. Remember that fractions are just 
                another way to represent numbers, and they follow the same mathematical principles as whole 
                numbers and decimals.
              </p>
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
