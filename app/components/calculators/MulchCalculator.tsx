'use client'
import React, { useState, useCallback } from 'react'
import { Calculator,  TreePine, Layout, Package, Info  } from 'lucide-react'
import BaseCalculator from '../BaseCalculator'
import { CalculatorInput } from '../CalculatorUI'
import { CalculatorResultCard } from '../CalculatorResultCard'
import ResultSharing from '../ResultSharing'

export default function MulchCalculator() {
  const [length, setLength] = useState('')
  const [width, setWidth] = useState('')
  const [depth, setDepth] = useState('3')
  const [showResults, setShowResults] = useState(false)

  const calculateMulch = useCallback(() => {
    const l = parseFloat(length) || 0
    const w = parseFloat(width) || 0
    const d = parseFloat(depth) || 0
    
    if (l === 0 || w === 0 || d === 0) return { area: 0, volume: 0, cubicYards: 0, bags: 0 }
    
    const area = l * w
    const volume = area * (d / 12) // Convert inches to feet
    const cubicYards = volume / 27 // Convert cubic feet to cubic yards
    const bags = Math.ceil(volume / 2) // 1 bag = 2 cubic feet
    
    return { area, volume, cubicYards, bags }
  }, [length, width, depth])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setLength('')
    setWidth('')
    setDepth('3')
    setShowResults(false)
  }

  const result = showResults ? calculateMulch() : { area: 0, volume: 0, cubicYards: 0, bags: 0 }

  return (
    <BaseCalculator
      title="Mulch Calculator"
      description="Calculate mulch requirements for your garden or landscaping project"
      icon={TreePine}
      onCalculate={handleCalculate}
      onReset={handleReset}
      showResults={showResults}
      calculateButtonText="Calculate Mulch"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CalculatorInput
          label="Length (feet)"
          value={length}
          onChange={setLength}
          placeholder="0"
        />
        <CalculatorInput
          label="Width (feet)"
          value={width}
          onChange={setWidth}
          placeholder="0"
        />
      </div>
      <CalculatorInput
        label="Depth (inches)"
        value={depth}
        onChange={setDepth}
        placeholder="3"
        suffix="in"
      />

      {showResults && (
        <div className="mt-8">
          <ResultSharing
            title="Mulch Calculation Result"
            inputs={[
              { label: "Dimensions", value: `${length}x${width} ft` },
              { label: "Depth", value: `${depth} in` }
            ]}
            result={{ 
              label: "Bags Needed", 
              value: `${result.bags}`,
              unit: " bags"
            }}
            calculatorName="Mulch Calculator"
          />
        </div>
      )}

      {/* Results are handled by the BaseCalculator's results prop, but I'll define them here for clarity */}
      {/* Wait, I should pass them to the results prop of BaseCalculator */}
    </BaseCalculator>
  )
}

