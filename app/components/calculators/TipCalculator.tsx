'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, DollarSign, Users } from 'lucide-react'

interface TipResult {
  tipAmount: number
  totalAmount: number
  perPerson: number
  tipPerPerson: number
}

const TIP_PRESETS = [10, 15, 18, 20, 22, 25]

export default function TipCalculator() {
  const [billAmount, setBillAmount] = useState('')
  const [tipPercentage, setTipPercentage] = useState(20)
  const [customTipPercentage, setCustomTipPercentage] = useState('')
  const [numberOfPeople, setNumberOfPeople] = useState('1')
  const [roundUp, setRoundUp] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const calculateTip = useCallback((): TipResult => {
    const bill = parseFloat(billAmount) || 0
    const tip = bill * (tipPercentage / 100)
    const total = bill + tip
    const people = parseInt(numberOfPeople) || 1
    
    let tipPerPerson = tip / people
    let totalPerPerson = total / people

    if (roundUp) {
      tipPerPerson = Math.ceil(tipPerPerson)
      totalPerPerson = Math.ceil(totalPerPerson)
    }

    return {
      tipAmount: tip,
      totalAmount: total,
      perPerson: totalPerPerson,
      tipPerPerson: tipPerPerson
    }
  }, [billAmount, tipPercentage, numberOfPeople, roundUp])

  const handleTipPreset = (percentage: number) => {
    setTipPercentage(percentage)
    setCustomTipPercentage('')
  }

  const handleCustomTip = (value: string) => {
    setCustomTipPercentage(value)
    const numValue = parseFloat(value)
    if (!isNaN(numValue) && numValue >= 0) {
      setTipPercentage(numValue)
    }
  }

  const handleCalculate = () => {
    if (billAmount && parseFloat(billAmount) > 0) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setBillAmount('')
    setTipPercentage(20)
    setCustomTipPercentage('')
    setNumberOfPeople('1')
    setRoundUp(false)
    setShowResults(false)
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount)
  }

  const downloadResults = () => {
    const result = calculateTip()
    
    const data = `Tip Calculator Results

Bill Amount: ${formatCurrency(parseFloat(billAmount))}
Tip Percentage: ${tipPercentage}%
Number of People: ${numberOfPeople}

Results:
- Tip Amount: ${formatCurrency(result.tipAmount)}
- Total Amount: ${formatCurrency(result.totalAmount)}
- Per Person: ${formatCurrency(result.perPerson)}
- Tip Per Person: ${formatCurrency(result.tipPerPerson)}
- Round Up: ${roundUp ? 'Yes' : 'No'}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'tip-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateTip()
      
      navigator.share({
        title: 'Tip Calculator Results',
        text: `Bill: ${formatCurrency(parseFloat(billAmount))}, Tip: ${tipPercentage}%, Total: ${formatCurrency(result.totalAmount)}, Per Person: ${formatCurrency(result.perPerson)}`,
        url: window.location.href
      })
    } else {
      const text = `Tip: ${formatCurrency(parseFloat(billAmount))} with ${tipPercentage}% tip`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateTip() : { tipAmount: 0, totalAmount: 0, perPerson: 0, tipPerPerson: 0 }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Tip Calculator</h1>
            <p className="text-green-100 text-lg">
              Calculate tips, split bills, and determine per-person amounts. 
              Perfect for restaurants, services, and group dining.
            </p>
          </div>
          <div className="hidden md:block">
            <DollarSign className="w-16 h-16 text-green-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Bill and Tip */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Bill Amount</h3>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                <input
                  type="number"
                  value={billAmount}
                  onChange={(e) => setBillAmount(e.target.value)}
                  className="w-full pl-8 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-lg"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Tip Percentage</h3>
              <div className="grid grid-cols-3 gap-2 mb-4">
                {TIP_PRESETS.map((percentage) => (
                  <button
                    key={percentage}
                    onClick={() => handleTipPreset(percentage)}
                    className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                      tipPercentage === percentage && customTipPercentage === ''
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {percentage}%
                  </button>
                ))}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Custom Percentage
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={customTipPercentage}
                    onChange={(e) => handleCustomTip(e.target.value)}
                    className="w-full pr-8 pl-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="Enter custom %"
                    min="0"
                    max="100"
                    step="0.1"
                  />
                  <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* People and Options */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Split Bill
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Number of People
                </label>
                <input
                  type="number"
                  value={numberOfPeople}
                  onChange={(e) => setNumberOfPeople(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="1"
                  min="1"
                  max="20"
                />
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Options</h3>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="roundUp"
                  checked={roundUp}
                  onChange={(e) => setRoundUp(e.target.checked)}
                  className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                />
                <label htmlFor="roundUp" className="text-sm text-gray-700">
                  Round up to nearest dollar
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            disabled={!billAmount || parseFloat(billAmount) <= 0}
            className={`font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2 ${
              !billAmount || parseFloat(billAmount) <= 0
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-green-600 hover:bg-green-700 text-white'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>Calculate Tip</span>
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Summary */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Tip Summary</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Bill Amount:</span>
                    <span className="font-semibold">{formatCurrency(parseFloat(billAmount))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tip ({tipPercentage}%):</span>
                    <span className="font-semibold text-green-600">{formatCurrency(result.tipAmount)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-gray-800">Total:</span>
                    <span className="text-green-700">{formatCurrency(result.totalAmount)}</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tip per person:</span>
                    <span className="font-semibold text-green-600">{formatCurrency(result.tipPerPerson)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total per person:</span>
                    <span className="font-semibold text-green-700">{formatCurrency(result.perPerson)}</span>
                  </div>
                  {roundUp && (
                    <div className="text-sm text-gray-500 italic">
                      * Amounts rounded up to nearest dollar
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <button
                onClick={downloadResults}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Download className="w-4 h-4" />
                <span>Download</span>
              </button>
              <button
                onClick={shareResults}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={printResults}
                className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <Printer className="w-4 h-4" />
                <span>Print</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center space-x-2 bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}

        {/* Info Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-green-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Tip Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This calculator helps you determine appropriate tips for various services. 
                Standard tipping rates are 15-20% for restaurants, 15-18% for delivery, 
                and 15-20% for personal services. Adjust based on service quality and local customs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
