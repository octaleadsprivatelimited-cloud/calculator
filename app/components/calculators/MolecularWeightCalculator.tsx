'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Atom } from 'lucide-react'

interface Element {
  symbol: string
  name: string
  atomicWeight: number
}

interface MoleculeResult {
  molecularWeight: number
  elements: Array<{
    symbol: string
    count: number
    weight: number
    percentage: number
  }>
  totalWeight: number
}

const PERIODIC_TABLE: Element[] = [
  { symbol: 'H', name: 'Hydrogen', atomicWeight: 1.008 },
  { symbol: 'He', name: 'Helium', atomicWeight: 4.003 },
  { symbol: 'Li', name: 'Lithium', atomicWeight: 6.941 },
  { symbol: 'Be', name: 'Beryllium', atomicWeight: 9.012 },
  { symbol: 'B', name: 'Boron', atomicWeight: 10.811 },
  { symbol: 'C', name: 'Carbon', atomicWeight: 12.011 },
  { symbol: 'N', name: 'Nitrogen', atomicWeight: 14.007 },
  { symbol: 'O', name: 'Oxygen', atomicWeight: 15.999 },
  { symbol: 'F', name: 'Fluorine', atomicWeight: 18.998 },
  { symbol: 'Ne', name: 'Neon', atomicWeight: 20.180 },
  { symbol: 'Na', name: 'Sodium', atomicWeight: 22.990 },
  { symbol: 'Mg', name: 'Magnesium', atomicWeight: 24.305 },
  { symbol: 'Al', name: 'Aluminum', atomicWeight: 26.982 },
  { symbol: 'Si', name: 'Silicon', atomicWeight: 28.086 },
  { symbol: 'P', name: 'Phosphorus', atomicWeight: 30.974 },
  { symbol: 'S', name: 'Sulfur', atomicWeight: 32.065 },
  { symbol: 'Cl', name: 'Chlorine', atomicWeight: 35.453 },
  { symbol: 'Ar', name: 'Argon', atomicWeight: 39.948 },
  { symbol: 'K', name: 'Potassium', atomicWeight: 39.098 },
  { symbol: 'Ca', name: 'Calcium', atomicWeight: 40.078 },
  { symbol: 'Fe', name: 'Iron', atomicWeight: 55.845 },
  { symbol: 'Cu', name: 'Copper', atomicWeight: 63.546 },
  { symbol: 'Zn', name: 'Zinc', atomicWeight: 65.38 },
  { symbol: 'Ag', name: 'Silver', atomicWeight: 107.868 },
  { symbol: 'Au', name: 'Gold', atomicWeight: 196.967 },
  { symbol: 'Hg', name: 'Mercury', atomicWeight: 200.59 },
  { symbol: 'Pb', name: 'Lead', atomicWeight: 207.2 }
]

const COMMON_MOLECULES = [
  { name: 'Water', formula: 'H2O' },
  { name: 'Carbon Dioxide', formula: 'CO2' },
  { name: 'Glucose', formula: 'C6H12O6' },
  { name: 'Sulfuric Acid', formula: 'H2SO4' },
  { name: 'Ammonia', formula: 'NH3' },
  { name: 'Methane', formula: 'CH4' },
  { name: 'Ethanol', formula: 'C2H5OH' },
  { name: 'Sodium Chloride', formula: 'NaCl' }
]

export default function MolecularWeightCalculator() {
  const [formula, setFormula] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [error, setError] = useState('')

  const parseFormula = useCallback((formulaStr: string): MoleculeResult => {
    const elements: { [key: string]: number } = {}
    let currentElement = ''
    let currentCount = ''
    
    for (let i = 0; i < formulaStr.length; i++) {
      const char = formulaStr[i]
      
      if (char >= 'A' && char <= 'Z') {
        // Save previous element
        if (currentElement) {
          const count = currentCount ? parseInt(currentCount) : 1
          elements[currentElement] = (elements[currentElement] || 0) + count
        }
        
        // Start new element
        currentElement = char
        currentCount = ''
      } else if (char >= 'a' && char <= 'z') {
        // Second letter of element
        currentElement += char
      } else if (char >= '0' && char <= '9') {
        // Number
        currentCount += char
      }
    }
    
    // Don't forget the last element
    if (currentElement) {
      const count = currentCount ? parseInt(currentCount) : 1
      elements[currentElement] = (elements[currentElement] || 0) + count
    }

    let totalWeight = 0
    const elementResults: Array<{
      symbol: string
      count: number
      weight: number
      percentage: number
    }> = []

    for (const [symbol, count] of Object.entries(elements)) {
      const element = PERIODIC_TABLE.find(e => e.symbol === symbol)
      if (element) {
        const weight = element.atomicWeight * count
        totalWeight += weight
        elementResults.push({
          symbol,
          count,
          weight,
          percentage: 0
        })
      }
    }

    // Calculate percentages
    elementResults.forEach(element => {
      element.percentage = (element.weight / totalWeight) * 100
    })

    return {
      molecularWeight: totalWeight,
      elements: elementResults,
      totalWeight
    }
  }, [])

  const handleCalculate = () => {
    if (!formula.trim()) {
      setError('Please enter a chemical formula')
      return
    }

    try {
      const result = parseFormula(formula)
      if (result.elements.length === 0) {
        setError('Invalid chemical formula. Please check the element symbols.')
        return
      }
      setError('')
      setShowResults(true)
    } catch (err) {
      setError('Error parsing formula. Please check the format.')
    }
  }

  const handleReset = () => {
    setFormula('')
    setShowResults(false)
    setError('')
  }

  const handleCommonMolecule = (molecule: { name: string, formula: string }) => {
    setFormula(molecule.formula)
    setError('')
    setShowResults(true)
  }

  const formatNumber = (num: number, decimals: number = 3) => {
    if (isNaN(num) || !isFinite(num)) return '0.000'
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const result = parseFormula(formula)
    
    const data = `Molecular Weight Calculator Results

Formula: ${formula}
Molecular Weight: ${formatNumber(result.molecularWeight)} g/mol

Element Breakdown:
${result.elements.map(element => 
  `- ${element.symbol}${element.count > 1 ? element.count : ''}: ${formatNumber(element.weight)} g/mol (${formatNumber(element.percentage)}%)`
).join('\n')}

Total Weight: ${formatNumber(result.totalWeight)} g/mol`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'molecular-weight-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = parseFormula(formula)
      
      navigator.share({
        title: 'Molecular Weight Calculator Results',
        text: `${formula}: ${formatNumber(result.molecularWeight)} g/mol`,
        url: window.location.href
      })
    } else {
      const text = `Molecular Weight: ${formula}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? parseFormula(formula) : { molecularWeight: 0, elements: [], totalWeight: 0 }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Molecular Weight Calculator</h1>
            <p className="text-teal-100 text-lg">
              Calculate molecular weights and element composition of chemical compounds. 
              Perfect for chemistry students, researchers, and laboratory work.
            </p>
          </div>
          <div className="hidden md:block">
            <Atom className="w-16 h-16 text-teal-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Formula Input */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Chemical Formula</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Enter Formula (e.g., H2O, CO2)
                  </label>
                  <input
                    type="text"
                    value={formula}
                    onChange={(e) => setFormula(e.target.value.toUpperCase())}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-mono text-lg"
                    placeholder="H2O"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Use element symbols (H, O, C, N, etc.) and numbers for subscripts
                  </p>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Calculate Button */}
            <div className="text-center">
              <button
                onClick={handleCalculate}
                disabled={!formula.trim()}
                className={`font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2 ${
                  !formula.trim()
                    ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                    : 'bg-teal-600 hover:bg-teal-700 text-white'
                }`}
              >
                <Calculator className="w-5 h-5" />
                <span>Calculate Molecular Weight</span>
              </button>
            </div>
          </div>

          {/* Common Molecules */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Molecules</h3>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_MOLECULES.map((molecule, index) => (
                <button
                  key={index}
                  onClick={() => handleCommonMolecule(molecule)}
                  className="text-left p-2 bg-white rounded border hover:bg-teal-50 transition-colors text-sm"
                >
                  <div className="font-medium text-gray-800">{molecule.name}</div>
                  <div className="text-gray-600 font-mono">{molecule.formula}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Molecular Weight */}
            <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
              <h3 className="text-lg font-semibold text-teal-800 mb-4">Molecular Weight</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-teal-700">{formatNumber(result.molecularWeight)}</div>
                <div className="text-lg text-gray-600">grams per mole (g/mol)</div>
                <div className="text-sm text-gray-500 mt-2">Formula: {formula}</div>
              </div>
            </div>

            {/* Element Breakdown */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Element Composition</h3>
              <div className="space-y-3">
                {result.elements.map((element, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-white rounded border">
                    <div className="flex items-center space-x-3">
                      <span className="font-mono font-semibold text-lg">{element.symbol}</span>
                      {element.count > 1 && (
                        <span className="text-sm text-gray-500">× {element.count}</span>
                      )}
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatNumber(element.weight)} g/mol</div>
                      <div className="text-sm text-gray-600">{formatNumber(element.percentage)}%</div>
                    </div>
                  </div>
                ))}
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
            <Info className="w-6 h-6 text-teal-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Molecular Weight Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This calculator determines the molecular weight of chemical compounds by summing the atomic weights 
                of all atoms in the formula. Molecular weight is essential for stoichiometry, solution preparation, 
                and chemical analysis. Enter formulas using standard element symbols (H2O, CO2, C6H12O6).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
