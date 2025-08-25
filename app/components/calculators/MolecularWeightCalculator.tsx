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
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Molecular Weight Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive molecular weight calculator helps chemistry students, researchers, and 
              laboratory professionals determine the molecular weights of chemical compounds with precision. 
              This essential tool provides accurate calculations for stoichiometry, solution preparation, 
              and chemical analysis, supporting both educational and professional chemistry applications.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Molecular Weight:</strong> Total mass of one mole of compound</li>
              <li><strong>Element Composition:</strong> Individual element weights and percentages</li>
              <li><strong>Atomic Counts:</strong> Number of each element in the formula</li>
              <li><strong>Weight Distribution:</strong> How mass is distributed among elements</li>
              <li><strong>Formula Validation:</strong> Checks for valid chemical formulas</li>
              <li><strong>Precise Calculations:</strong> Accurate to multiple decimal places</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Molecular Weight Fundamentals</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Definition</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Molecular Weight:</strong> Sum of atomic weights in molecule</li>
                  <li><strong>Units:</strong> Grams per mole (g/mol)</li>
                  <li><strong>Calculation:</strong> Σ(atomic weight × number of atoms)</li>
                  <li><strong>Significance:</strong> Mass of one mole of substance</li>
                  <li><strong>Precision:</strong> Based on atomic mass units</li>
                  <li><strong>Standardization:</strong> IUPAC recommended values</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Applications</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Stoichiometry:</strong> Chemical reaction calculations</li>
                  <li><strong>Solution Preparation:</strong> Molarity and molality</li>
                  <li><strong>Chemical Analysis:</strong> Quantitative measurements</li>
                  <li><strong>Research:</strong> Laboratory calculations</li>
                  <li><strong>Education:</strong> Chemistry learning and teaching</li>
                  <li><strong>Industry:</strong> Chemical manufacturing</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                <h5 className="font-semibold text-teal-800 mb-1">Molecular Weight</h5>
                <p className="text-teal-700 text-sm">Total compound mass</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Element Symbol</h5>
                <p className="text-blue-700 text-sm">Chemical element</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Atomic Count</h5>
                <p className="text-purple-700 text-sm">Number of atoms</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Weight %</h5>
                <p className="text-green-700 text-sm">Mass percentage</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the chemical formula using standard element symbols (e.g., H2O, CO2, C6H12O6). 
              The calculator automatically parses the formula, calculates molecular weight, and provides 
              detailed element composition breakdown. Use common molecule buttons for quick examples, 
              or enter custom formulas for specific compounds.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Chemical Formula Rules</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Element Symbols:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Use standard periodic table symbols</li>
                    <li>First letter capitalized, second lowercase</li>
                    <li>Examples: H, He, Fe, Cu, Au</li>
                    <li>No spaces between elements</li>
                    <li>Subscripts for atom counts</li>
                    <li>Parentheses for complex groups</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Formula Examples:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>H2O (water): 2 hydrogen, 1 oxygen</li>
                    <li>CO2 (carbon dioxide): 1 carbon, 2 oxygen</li>
                    <li>C6H12O6 (glucose): 6 carbon, 12 hydrogen, 6 oxygen</li>
                    <li>Ca(OH)2 (calcium hydroxide)</li>
                    <li>Fe2O3 (iron oxide): 2 iron, 3 oxygen</li>
                    <li>H2SO4 (sulfuric acid)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Chemical Compounds</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Inorganic Compounds</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Water (H2O):</strong> 18.015 g/mol</li>
                  <li><strong>Carbon Dioxide (CO2):</strong> 44.009 g/mol</li>
                  <li><strong>Sodium Chloride (NaCl):</strong> 58.443 g/mol</li>
                  <li><strong>Calcium Carbonate (CaCO3):</strong> 100.086 g/mol</li>
                  <li><strong>Sulfuric Acid (H2SO4):</strong> 98.078 g/mol</li>
                  <li><strong>Ammonia (NH3):</strong> 17.031 g/mol</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Organic Compounds</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Glucose (C6H12O6):</strong> 180.156 g/mol</li>
                  <li><strong>Ethanol (C2H5OH):</strong> 46.068 g/mol</li>
                  <li><strong>Methane (CH4):</strong> 16.043 g/mol</li>
                  <li><strong>Benzene (C6H6):</strong> 78.114 g/mol</li>
                  <li><strong>Acetic Acid (CH3COOH):</strong> 60.052 g/mol</li>
                  <li><strong>Urea (CO(NH2)2):</strong> 60.056 g/mol</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Stoichiometry Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Balancing Equations:</strong> Determine reactant/product ratios</li>
              <li><strong>Limiting Reagents:</strong> Calculate theoretical yields</li>
              <li><strong>Solution Preparation:</strong> Make solutions of known concentration</li>
              <li><strong>Gas Laws:</strong> Relate moles to volume and pressure</li>
              <li><strong>Thermochemistry:</strong> Calculate heat of reactions</li>
              <li><strong>Electrochemistry:</strong> Determine electron transfer</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Laboratory Calculations</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Solution Preparation</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Molarity (M):</strong> Moles per liter of solution</li>
                  <li><strong>Molality (m):</strong> Moles per kilogram of solvent</li>
                  <li><strong>Normality (N):</strong> Equivalents per liter</li>
                  <li><strong>Weight Percent:</strong> Mass of solute per 100g solution</li>
                  <li><strong>Parts Per Million:</strong> Mass ratio calculations</li>
                  <li><strong>Dilution Series:</strong> Concentration adjustments</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Analytical Chemistry</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Titration Calculations:</strong> Determine concentrations</li>
                  <li><strong>Gravimetric Analysis:</strong> Mass-based measurements</li>
                  <li><strong>Spectrophotometry:</strong> Concentration from absorbance</li>
                  <li><strong>Chromatography:</strong> Peak area to concentration</li>
                  <li><strong>Electrochemistry:</strong> Current to concentration</li>
                  <li><strong>Quality Control:</strong> Standard preparation</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Precision and Accuracy</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Atomic Mass Units:</strong> Based on carbon-12 standard</li>
              <li><strong>Isotopic Composition:</strong> Natural abundance considered</li>
              <li><strong>Significant Figures:</strong> Appropriate precision maintained</li>
              <li><strong>Rounding Rules:</strong> Follow standard conventions</li>
              <li><strong>Uncertainty:</strong> Consider measurement precision</li>
              <li><strong>Validation:</strong> Cross-check with literature values</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Calculation Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Formula Errors:</strong> Incorrect element symbols or counts</li>
              <li><strong>Atomic Weight Errors:</strong> Using wrong periodic table values</li>
              <li><strong>Subscript Confusion:</strong> Misreading atom counts</li>
              <li><strong>Parentheses Errors:</strong> Incorrect group multiplication</li>
              <li><strong>Unit Confusion:</strong> Mixing grams and atomic mass units</li>
              <li><strong>Rounding Errors:</strong> Over-precision or under-precision</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Polymer Chemistry:</strong> Calculate average molecular weights</li>
              <li><strong>Biochemistry:</strong> Protein and nucleic acid analysis</li>
              <li><strong>Pharmaceuticals:</strong> Drug formulation calculations</li>
              <li><strong>Environmental Chemistry:</strong> Pollutant concentration analysis</li>
              <li><strong>Materials Science:</strong> Compound stoichiometry</li>
              <li><strong>Forensic Chemistry:</strong> Evidence analysis and identification</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-teal-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Always verify your chemical formulas before calculating molecular weights. Double-check 
                element symbols, subscripts, and parentheses placement. For complex compounds, break down 
                the formula into smaller parts and calculate step by step. Keep a reference of common 
                molecular weights for quick verification, and remember that molecular weight is essential 
                for accurate stoichiometric calculations in chemistry.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
