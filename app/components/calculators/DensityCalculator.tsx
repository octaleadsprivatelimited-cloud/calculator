'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Scale } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function DensityCalculator() {
  const [calculationType, setCalculationType] = useState<'density' | 'mass' | 'volume'>('density')
  const [density, setDensity] = useState('')
  const [mass, setMass] = useState('')
  const [volume, setVolume] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateDensity = useCallback(() => {
    if (calculationType === 'density') {
      const massValue = parseFloat(mass) || 0
      const volumeValue = parseFloat(volume) || 0
      return massValue > 0 && volumeValue > 0 ? massValue / volumeValue : 0
    } else if (calculationType === 'mass') {
      const densityValue = parseFloat(density) || 0
      const volumeValue = parseFloat(volume) || 0
      return densityValue > 0 && volumeValue > 0 ? densityValue * volumeValue : 0
    } else {
      const densityValue = parseFloat(density) || 0
      const massValue = parseFloat(mass) || 0
      return densityValue > 0 && massValue > 0 ? massValue / densityValue : 0
    }
  }, [calculationType, density, mass, volume])

  const handleCalculate = () => {
    const result = calculateDensity()
    if (result > 0) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setDensity('')
    setMass('')
    setVolume('')
    setShowResults(false)
  }

  const formatNumber = (num: number) => {
    return isNaN(num) || !isFinite(num) ? '0.00' : num.toFixed(4)
  }

  const result = showResults ? calculateDensity() : 0

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Density Calculator</h1>
            <p className="text-indigo-100 text-lg">
              Calculate density, mass, and volume with multiple unit conversions.
            </p>
          </div>
          <div className="hidden md:block">
            <Scale className="w-16 h-16 text-indigo-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Calculation Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['density', 'mass', 'volume'].map((type) => (
              <button
                key={type}
                onClick={() => setCalculationType(type as any)}
                className={`p-4 rounded-lg font-medium transition-colors ${
                  calculationType === type
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Calculate {type.charAt(0).toUpperCase() + type.slice(1)}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          <div className="space-y-6">
            {calculationType !== 'density' && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Density</h3>
                <input
                  type="number"
                  value={density}
                  onChange={(e) => setDensity(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter density"
                  min="0"
                  step="0.001"
                />
              </div>
            )}
            {calculationType !== 'mass' && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Mass</h3>
                <input
                  type="number"
                  value={mass}
                  onChange={(e) => setMass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter mass"
                  min="0"
                  step="0.001"
                />
              </div>
            )}
            {calculationType !== 'volume' && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-4">Volume</h3>
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Enter volume"
                  min="0"
                  step="0.001"
                />
              </div>
            )}
          </div>

          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Densities</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Water:</span>
                <span className="font-semibold">1.00 g/cm³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Aluminum:</span>
                <span className="font-semibold">2.70 g/cm³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Iron:</span>
                <span className="font-semibold">7.87 g/cm³</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Gold:</span>
                <span className="font-semibold">19.32 g/cm³</span>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
          >
            <Calculator className="w-5 h-5" />
            <span>Calculate</span>
          </button>
        </div>

        {showResults && (
          <div className="space-y-6">
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-4 rounded-lg border border-indigo-200">
              <ResultSharing
                title="Density Calculation Result"
                inputs={[
                  { label: "Calculation Type", value: calculationType.charAt(0).toUpperCase() + calculationType.slice(1) },
                  { label: calculationType === 'density' ? "Mass" : "Density", value: calculationType === 'density' ? `${mass} g` : `${density} g/cm³` },
                  { label: calculationType === 'density' ? "Volume" : "Volume", value: `${volume} cm³` }
                ]}
                result={{ 
                  label: "Result", 
                  value: formatNumber(result),
                  unit: calculationType === 'density' ? 'g/cm³' : calculationType === 'mass' ? 'g' : 'cm³'
                }}
                calculatorName="Density Calculator"
                className="mb-0"
              />
            </div>

            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">Result</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-indigo-700">{formatNumber(result)}</div>
                <div className="text-sm text-gray-600">
                  {calculationType === 'density' ? 'g/cm³' : calculationType === 'mass' ? 'g' : 'cm³'}
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center">
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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Density Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive density calculator helps students, scientists, and engineers solve 
              density-related problems quickly and accurately. This essential tool calculates density, 
              mass, or volume when you know two of the three values, making it perfect for laboratory 
              work, material analysis, and educational purposes.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Density:</strong> Mass per unit volume (g/cm³, kg/m³, lb/ft³)</li>
              <li><strong>Mass:</strong> Weight of a substance given density and volume</li>
              <li><strong>Volume:</strong> Space occupied given mass and density</li>
              <li><strong>Material Properties:</strong> Substance identification and comparison</li>
              <li><strong>Unit Conversions:</strong> Different measurement systems</li>
              <li><strong>Scientific Accuracy:</strong> Precise calculations for experiments</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Calculation Types</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Density Calculation</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Formula:</strong> ρ = m/V</li>
                  <li><strong>Inputs:</strong> Mass and volume</li>
                  <li><strong>Output:</strong> Density in g/cm³</li>
                  <li><strong>Use Case:</strong> Material identification</li>
                  <li><strong>Accuracy:</strong> High precision results</li>
                  <li><strong>Applications:</strong> Science and engineering</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Mass Calculation</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Formula:</strong> m = ρ × V</li>
                  <li><strong>Inputs:</strong> Density and volume</li>
                  <li><strong>Output:</strong> Mass in grams</li>
                  <li><strong>Use Case:</strong> Weight determination</li>
                  <li><strong>Accuracy:</strong> Precise mass values</li>
                  <li><strong>Applications:</strong> Manufacturing and shipping</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Volume Calculation</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Formula:</strong> V = m/ρ</li>
                  <li><strong>Inputs:</strong> Mass and density</li>
                  <li><strong>Output:</strong> Volume in cm³</li>
                  <li><strong>Use Case:</strong> Space requirements</li>
                  <li><strong>Accuracy:</strong> Volume determination</li>
                  <li><strong>Applications:</strong> Container sizing</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <h5 className="font-semibold text-indigo-800 mb-1">Density</h5>
                <p className="text-indigo-700 text-sm">Mass per unit volume</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Mass</h5>
                <p className="text-blue-700 text-sm">Weight of substance</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Volume</h5>
                <p className="text-green-700 text-sm">Space occupied</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Select the calculation type (density, mass, or volume), enter the known values, and 
              click "Calculate" to get your result. The calculator automatically handles the math and 
              provides the answer in appropriate units. Use the common densities reference for material 
              identification and comparison.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Density Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Physical Property:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Intensive property</li>
                    <li>Independent of sample size</li>
                    <li>Temperature dependent</li>
                    <li>Pressure dependent</li>
                    <li>Material characteristic</li>
                    <li>Identification tool</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Measurement Units:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>g/cm³ (grams per cubic centimeter)</li>
                    <li>kg/m³ (kilograms per cubic meter)</li>
                    <li>lb/ft³ (pounds per cubic foot)</li>
                    <li>g/mL (grams per milliliter)</li>
                    <li>kg/L (kilograms per liter)</li>
                    <li>lb/gal (pounds per gallon)</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Material Densities</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Low Density Materials</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Air:</strong> 0.001225 g/cm³</li>
                  <li><strong>Styrofoam:</strong> 0.05 g/cm³</li>
                  <li><strong>Wood (Balsa):</strong> 0.12 g/cm³</li>
                  <li><strong>Ice:</strong> 0.92 g/cm³</li>
                  <li><strong>Water:</strong> 1.00 g/cm³</li>
                  <li><strong>Rubber:</strong> 1.20 g/cm³</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">High Density Materials</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Aluminum:</strong> 2.70 g/cm³</li>
                  <li><strong>Iron:</strong> 7.87 g/cm³</li>
                  <li><strong>Copper:</strong> 8.96 g/cm³</li>
                  <li><strong>Lead:</strong> 11.34 g/cm³</li>
                  <li><strong>Mercury:</strong> 13.59 g/cm³</li>
                  <li><strong>Gold:</strong> 19.32 g/cm³</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Practical Applications</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Scientific Research</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Material Science:</strong> Substance identification</li>
                  <li><strong>Chemistry:</strong> Solution concentration</li>
                  <li><strong>Physics:</strong> Buoyancy calculations</li>
                  <li><strong>Geology:</strong> Rock and mineral analysis</li>
                  <li><strong>Biology:</strong> Cell density studies</li>
                  <li><strong>Engineering:</strong> Material selection</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Industrial Uses</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Manufacturing:</strong> Quality control</li>
                  <li><strong>Construction:</strong> Material specifications</li>
                  <li><strong>Shipping:</strong> Weight and volume calculations</li>
                  <li><strong>Mining:</strong> Ore grade determination</li>
                  <li><strong>Food Industry:</strong> Product consistency</li>
                  <li><strong>Pharmaceuticals:</strong> Drug formulation</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Density Calculation Methods</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Direct Measurement:</strong> Mass and volume determination</li>
              <li><strong>Displacement Method:</strong> Volume by water displacement</li>
              <li><strong>Pycnometer Method:</strong> Precise volume measurement</li>
              <li><strong>Buoyancy Method:</strong> Density by floating comparison</li>
              <li><strong>X-ray Densitometry:</strong> Non-destructive measurement</li>
              <li><strong>Ultrasonic Method:</strong> Sound wave analysis</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Density</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Temperature Effects</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Thermal Expansion:</strong> Volume changes with temperature</li>
                  <li><strong>Phase Changes:</strong> Solid, liquid, gas transitions</li>
                  <li><strong>Molecular Motion:</strong> Particle movement effects</li>
                  <li><strong>State Changes:</strong> Melting and boiling points</li>
                  <li><strong>Density Inversion:</strong> Water's unique behavior</li>
                  <li><strong>Standard Conditions:</strong> 20°C reference temperature</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Pressure Effects</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Compression:</strong> Volume reduction under pressure</li>
                  <li><strong>Gas Behavior:</strong> Ideal gas law effects</li>
                  <li><strong>Liquid Incompressibility:</strong> Minimal volume change</li>
                  <li><strong>Solid Stability:</strong> Pressure resistance</li>
                  <li><strong>Atmospheric Pressure:</strong> Standard conditions</li>
                  <li><strong>Deep Earth:</strong> Extreme pressure effects</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Density in Different States</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Solids:</strong> Highest density, fixed volume and shape</li>
              <li><strong>Liquids:</strong> Medium density, fixed volume, variable shape</li>
              <li><strong>Gases:</strong> Lowest density, variable volume and shape</li>
              <li><strong>Plasma:</strong> Very low density, ionized gas state</li>
              <li><strong>Bose-Einstein Condensate:</strong> Ultra-low density quantum state</li>
              <li><strong>Phase Transitions:</strong> Density changes at critical points</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Density Calculation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Consistent Units:</strong> Match mass and volume units</li>
              <li><strong>Account for Temperature:</strong> Consider thermal effects</li>
              <li><strong>Measure Accurately:</strong> Precise instruments improve results</li>
              <li><strong>Consider Phase:</strong> State of matter affects density</li>
              <li><strong>Check Purity:</strong> Impurities alter material density</li>
              <li><strong>Verify Results:</strong> Compare with known values</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Density Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Unit Confusion:</strong> Mixing different measurement systems</li>
              <li><strong>Temperature Ignorance:</strong> Not accounting for thermal effects</li>
              <li><strong>Phase Confusion:</strong> Using wrong state of matter</li>
              <li><strong>Impurity Effects:</strong> Not considering material purity</li>
              <li><strong>Measurement Errors:</strong> Inaccurate mass or volume</li>
              <li><strong>Formula Errors:</strong> Incorrect mathematical operations</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Density Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Relative Density:</strong> Comparison to reference substance</li>
              <li><strong>Bulk Density:</strong> Including void spaces</li>
              <li><strong>Apparent Density:</strong> Measured density with voids</li>
              <li><strong>True Density:</strong> Pure material density</li>
              <li><strong>Particle Density:</strong> Individual particle density</li>
              <li><strong>Tap Density:</strong> Packed material density</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-indigo-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When working with density calculations, always ensure your units are consistent and 
                appropriate for your application. Remember that density varies with temperature and 
                pressure, so specify the conditions when reporting results. For material identification, 
                compare your calculated density with known values from reference tables. Use this 
                calculator to quickly solve density problems and verify your manual calculations. 
                Remember that water has a density of 1.00 g/cm³ at 4°C, making it an excellent 
                reference material for density comparisons.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Density Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                Calculate density (mass/volume), mass (density × volume), or volume (mass/density) 
                when you know two of the three values. Perfect for science experiments and material analysis.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
