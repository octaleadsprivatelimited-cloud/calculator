'use client'

import React, { useState, useCallback } from 'react'
import { BarChart3, Calculator as CalculatorIcon, RotateCcw, TrendingUp } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface StatisticsResult {
  mean: number
  median: number
  mode: number[]
  variance: number
  standardDeviation: number
  range: number
  count: number
  sum: number
  min: number
  max: number
}

export default function StandardDeviationCalculator() {
  const [dataInput, setDataInput] = useState('1, 2, 3, 4, 5')
  const [result, setResult] = useState<StatisticsResult | null>(null)

  const calculateStatistics = useCallback(() => {
    // Parse input data
    const numbers = dataInput
      .split(/[,\s]+/)
      .map(s => s.trim())
      .filter(s => s !== '')
      .map(s => parseFloat(s))
      .filter(n => !isNaN(n))

    if (numbers.length === 0) {
      alert('Please enter valid numbers separated by commas')
      return
    }

    if (numbers.length === 1) {
      alert('Please enter at least 2 numbers for statistical analysis')
      return
    }

    // Sort numbers for median calculation
    const sortedNumbers = [...numbers].sort((a, b) => a - b)
    
    // Calculate basic statistics
    const sum = numbers.reduce((acc, val) => acc + val, 0)
    const count = numbers.length
    const mean = sum / count
    
    // Calculate median
    let median: number
    if (count % 2 === 0) {
      median = (sortedNumbers[count / 2 - 1] + sortedNumbers[count / 2]) / 2
    } else {
      median = sortedNumbers[Math.floor(count / 2)]
    }
    
    // Calculate mode
    const frequency: { [key: number]: number } = {}
    numbers.forEach(num => {
      frequency[num] = (frequency[num] || 0) + 1
    })
    
    const maxFreq = Math.max(...Object.values(frequency))
    const mode = Object.keys(frequency)
      .filter(key => frequency[parseFloat(key)] === maxFreq)
      .map(key => parseFloat(key))
    
    // Calculate variance and standard deviation
    const squaredDifferences = numbers.map(num => Math.pow(num - mean, 2))
    const variance = squaredDifferences.reduce((acc, val) => acc + val, 0) / count
    const standardDeviation = Math.sqrt(variance)
    
    // Calculate range
    const min = Math.min(...numbers)
    const max = Math.max(...numbers)
    const range = max - min

    setResult({
      mean: Math.round(mean * 10000) / 10000,
      median: Math.round(median * 10000) / 10000,
      mode,
      variance: Math.round(variance * 10000) / 10000,
      standardDeviation: Math.round(standardDeviation * 10000) / 10000,
      range: Math.round(range * 10000) / 10000,
      count,
      sum: Math.round(sum * 10000) / 10000,
      min,
      max
    })
  }, [dataInput])

  const formatNumber = (num: number): string => {
    return num.toFixed(4)
  }

  const clearData = () => {
    setDataInput('1, 2, 3, 4, 5')
    setResult(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cyan-50 to-blue-100 p-4">
      <div className="w-full">
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 flex items-center justify-center">
            <BarChart3 className="w-12 h-12 mr-3 text-cyan-600" />
            Standard Deviation Calculator
          </h1>
          <p className="text-xl text-gray-600">
            Calculate standard deviation, variance, mean, median, and mode
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <CalculatorIcon className="w-6 h-6 mr-2 text-cyan-600" />
              Data Input
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Numbers
                </label>
                <textarea
                  value={dataInput}
                  onChange={(e) => setDataInput(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-2 focus:ring-cyan-200 h-32 resize-none"
                  placeholder="Enter numbers separated by commas (e.g., 1, 2, 3, 4, 5)"
                />
                <p className="text-sm text-gray-500 mt-1">
                  Separate numbers with commas, spaces, or both
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  onClick={calculateStatistics}
                  className="flex-1 bg-cyan-600 text-white py-3 px-6 rounded-lg hover:bg-cyan-700 transition-colors font-medium"
                >
                  Calculate Statistics
                </button>
                <button
                  onClick={clearData}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                  title="Reset to defaults"
                >
                  <RotateCcw className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="mt-6 p-4 bg-cyan-50 rounded-lg border border-cyan-200">
              <h3 className="font-semibold text-cyan-800 mb-2">Quick Examples</h3>
              <div className="space-y-2 text-sm text-cyan-600">
                <p>• <strong>Sample Data:</strong> 1, 2, 3, 4, 5</p>
                <p>• <strong>Grades:</strong> 85, 92, 78, 96, 88</p>
                <p>• <strong>Prices:</strong> 10.50, 12.75, 9.99, 15.25</p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {result && (
              <>
                {/* Share Options - Moved to Top */}
                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-200">
                  <ResultSharing
                    title="Standard Deviation Calculation Result"
                    inputs={[
                      { label: "Data Points", value: `${result.count} numbers` },
                      { label: "Data Range", value: `${result.min} to ${result.max}` },
                      { label: "Calculation Type", value: "Statistical Analysis" }
                    ]}
                    result={{ 
                      label: "Standard Deviation", 
                      value: formatNumber(result.standardDeviation),
                      unit: ""
                    }}
                    calculatorName="Standard Deviation Calculator"
                    className="mb-0"
                  />
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                    <TrendingUp className="w-6 h-6 mr-2 text-cyan-600" />
                    Key Statistics
                  </h2>
                  
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-cyan-600 mb-2">
                      {formatNumber(result.standardDeviation)}
                    </div>
                    <p className="text-gray-600">Standard Deviation</p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Variance</span>
                      <span className="font-semibold text-blue-600">{formatNumber(result.variance)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Mean (Average)</span>
                      <span className="font-semibold text-green-600">{formatNumber(result.mean)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Median</span>
                      <span className="font-semibold text-purple-600">{formatNumber(result.median)}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Data Summary</h2>
                  
                  <div className="space-y-3">
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Count</span>
                      <span className="font-semibold">{result.count} numbers</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Sum</span>
                      <span className="font-semibold">{formatNumber(result.sum)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Range</span>
                      <span className="font-semibold text-orange-600">{formatNumber(result.range)}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Minimum</span>
                      <span className="font-semibold text-red-600">{result.min}</span>
                    </div>
                    <div className="flex justify-between py-2 border-b border-gray-100">
                      <span className="text-gray-600">Maximum</span>
                      <span className="font-semibold text-green-600">{result.max}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-200">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Mode</h2>
                  
                  <div className="text-center">
                    {result.mode.length === 1 ? (
                      <div className="text-2xl font-bold text-cyan-600">
                        {result.mode[0]}
                      </div>
                    ) : (
                      <div className="text-lg text-cyan-600">
                        {result.mode.join(', ')}
                      </div>
                    )}
                    <p className="text-gray-600 mt-2">
                      {result.mode.length === 1 ? 'Most frequent value' : 'Most frequent values'}
                    </p>
                  </div>
                </div>
              </>
            )}

            <div className="bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-200">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Statistical Terms</h2>
              <div className="space-y-3 text-sm text-gray-600">
                <p>• <strong>Mean:</strong> Average of all numbers</p>
                <p>• <strong>Median:</strong> Middle value when sorted</p>
                <p>• <strong>Mode:</strong> Most frequent value(s)</p>
                <p>• <strong>Variance:</strong> Average squared deviation from mean</p>
                <p>• <strong>Standard Deviation:</strong> Square root of variance</p>
              </div>
            </div>
          </div>
        </div>

        {/* Comprehensive Description Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-cyan-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About Standard Deviation Calculator</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Purpose & Functionality</h3>
              <p className="text-gray-700 mb-3">
                This comprehensive statistical calculator helps researchers, students, and professionals analyze 
                data distributions and understand variability. It calculates key descriptive statistics including 
                mean, median, mode, variance, and standard deviation to provide insights into data patterns.
              </p>
              <p className="text-gray-700">
                The calculator processes comma-separated numerical data and provides both basic statistics 
                and advanced measures of central tendency and dispersion.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Understanding Standard Deviation</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">What It Measures</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Variability:</strong> How spread out data points are</li>
                    <li><strong>Consistency:</strong> How uniform the data distribution is</li>
                    <li><strong>Precision:</strong> How close values are to the mean</li>
                    <li><strong>Reliability:</strong> How predictable the data is</li>
                    <li><strong>Quality:</strong> How well-controlled the process is</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Interpretation</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Low SD:</strong> Data points close to mean</li>
                    <li><strong>High SD:</strong> Data points spread out</li>
                    <li><strong>Zero SD:</strong> All values identical</li>
                    <li><strong>Relative:</strong> Compare to mean value</li>
                    <li><strong>Context:</strong> Depends on data type</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Statistical Measures Explained</h3>
              <div className="bg-cyan-50 p-4 rounded-lg border border-cyan-200">
                <h4 className="font-semibold text-gray-800 mb-2">Central Tendency Measures</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Mean (Average):</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Sum of all values ÷ count</li>
                      <li>Most commonly used average</li>
                      <li>Sensitive to outliers</li>
                      <li>Good for normal distributions</li>
                    </ul>
                  </div>
                  <div>
                    <p><strong>Median (Middle Value):</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Middle value when sorted</li>
                      <li>Resistant to outliers</li>
                      <li>Good for skewed data</li>
                      <li>50% above, 50% below</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Dispersion Measures</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Variance</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Calculation:</strong> Average squared deviations</li>
                    <li><strong>Units:</strong> Squared original units</li>
                    <li><strong>Purpose:</strong> Measure spread mathematically</li>
                    <li><strong>Use:</strong> Statistical tests and formulas</li>
                    <li><strong>Interpretation:</strong> Higher = more spread</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Standard Deviation</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Calculation:</strong> Square root of variance</li>
                    <li><strong>Units:</strong> Same as original data</li>
                    <li><strong>Purpose:</strong> Measure spread practically</li>
                    <li><strong>Use:</strong> Data interpretation and comparison</li>
                    <li><strong>Interpretation:</strong> Higher = more variability</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Practical Applications</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Quality Control:</strong> Monitor manufacturing processes and product consistency</li>
                <li><strong>Financial Analysis:</strong> Assess investment risk and portfolio volatility</li>
                <li><strong>Scientific Research:</strong> Evaluate experimental results and measurement precision</li>
                <li><strong>Education:</strong> Analyze test scores and student performance variability</li>
                <li><strong>Healthcare:</strong> Monitor patient vital signs and treatment effectiveness</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Data Distribution Types</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Normal Distribution</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Bell-shaped curve</li>
                    <li>68% within 1 SD of mean</li>
                    <li>95% within 2 SD of mean</li>
                    <li>99.7% within 3 SD of mean</li>
                    <li>Mean = median = mode</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Skewed Distributions</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Right-skewed:</strong> Long tail to right</li>
                    <li><strong>Left-skewed:</strong> Long tail to left</li>
                    <li><strong>Mean ≠ median:</strong> Different central values</li>
                    <li><strong>Outliers:</strong> Extreme values affect mean</li>
                    <li><strong>Use median:</strong> Better central measure</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">When to Use Each Measure</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Use Mean When:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Data is normally distributed</li>
                    <li>No significant outliers</li>
                    <li>Need arithmetic average</li>
                    <li>Planning statistical tests</li>
                    <li>Comparing different groups</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Use Median When:</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Data is skewed</li>
                    <li>Outliers are present</li>
                    <li>Need robust measure</li>
                    <li>Reporting typical values</li>
                    <li>Data has extreme values</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-semibold text-gray-800 mb-2">Pro Tips</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Always examine your data visually before calculating statistics</li>
                <li>• Use standard deviation to understand data variability and consistency</li>
                <li>• Compare standard deviation to the mean to assess relative variability</li>
                <li>• Consider using median and interquartile range for skewed data</li>
                <li>• Remember that standard deviation is sensitive to outliers</li>
                <li>• Use this calculator to validate statistical software results</li>
              </ul>
            </div>
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500">
          <p>© 2024 Standard Deviation Calculator. All rights reserved.</p>
        </footer>
      </div>
    </div>
  )
}
