'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Dice, BarChart3, RefreshCw } from 'lucide-react'

interface DiceResult {
  rolls: number[]
  total: number
  average: number
  min: number
  max: number
  distribution: Record<number, number>
}

interface DiceType {
  name: string
  sides: number
  description: string
  common: boolean
}

const DICE_TYPES: DiceType[] = [
  { name: 'd4', sides: 4, description: 'Tetrahedron', common: true },
  { name: 'd6', sides: 6, description: 'Cube', common: true },
  { name: 'd8', sides: 8, description: 'Octahedron', common: true },
  { name: 'd10', sides: 10, description: 'Decahedron', common: true },
  { name: 'd12', sides: 12, description: 'Dodecahedron', common: true },
  { name: 'd20', sides: 20, description: 'Icosahedron', common: true },
  { name: 'd100', sides: 100, description: 'Percentile', common: false },
  { name: 'd2', sides: 2, description: 'Coin flip', common: false }
]

export default function DiceRollerCalculator() {
  const [selectedDice, setSelectedDice] = useState('d6')
  const [numberOfDice, setNumberOfDice] = useState(1)
  const [rollHistory, setRollHistory] = useState<DiceResult[]>([])
  const [currentRoll, setCurrentRoll] = useState<DiceResult | null>(null)

  const rollDice = useCallback((): DiceResult => {
    const dice = DICE_TYPES.find(d => d.name === selectedDice)
    if (!dice) return { rolls: [], total: 0, average: 0, min: 0, max: 0, distribution: {} }
    
    const rolls: number[] = []
    for (let i = 0; i < numberOfDice; i++) {
      rolls.push(Math.floor(Math.random() * dice.sides) + 1)
    }
    
    const total = rolls.reduce((sum, roll) => sum + roll, 0)
    const average = total / numberOfDice
    const min = Math.min(...rolls)
    const max = Math.max(...rolls)
    
    const distribution: Record<number, number> = {}
    for (let i = 1; i <= dice.sides; i++) {
      distribution[i] = rolls.filter(roll => roll === i).length
    }
    
    return { rolls, total, average, min, max, distribution }
  }, [selectedDice, numberOfDice])

  const handleRoll = () => {
    const result = rollDice()
    setCurrentRoll(result)
    setRollHistory(prev => [result, ...prev.slice(0, 9)]) // Keep last 10 rolls
  }

  const handleReset = () => {
    setSelectedDice('d6')
    setNumberOfDice(1)
    setRollHistory([])
    setCurrentRoll(null)
  }

  const handleQuickDice = (dice: DiceType) => {
    setSelectedDice(dice.name)
    setNumberOfDice(1)
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    if (!currentRoll) return
    
    const data = `Dice Roller Results

Dice: ${selectedDice} (${numberOfDice} dice)
Rolls: ${currentRoll.rolls.join(', ')}
Total: ${currentRoll.total}
Average: ${formatNumber(currentRoll.average)}
Min: ${currentRoll.min}
Max: ${currentRoll.max}

Roll History (Last 10):
${rollHistory.map((roll, index) => 
  `${index + 1}. ${roll.rolls.join(', ')} = ${roll.total}`
).join('\n')}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'dice-roller-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (!currentRoll) return
    
    if (navigator.share) {
      navigator.share({
        title: 'Dice Roller Results',
        text: `${selectedDice}: ${currentRoll.rolls.join(', ')} = ${currentRoll.total}`,
        url: window.location.href
      })
    } else {
      const text = `${selectedDice}: ${currentRoll.rolls.join(', ')} = ${currentRoll.total}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-emerald-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Dice Roller Calculator</h1>
            <p className="text-green-100 text-lg">
              Roll virtual dice with customizable options. Supports various dice types, 
              multiple dice, and provides roll statistics and history.
            </p>
          </div>
          <div className="hidden md:block">
            <Dice className="w-16 h-16 text-green-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Dice Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Dice Selection</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {DICE_TYPES.map((dice, index) => (
              <button
                key={index}
                onClick={() => handleQuickDice(dice)}
                className={`p-4 rounded-lg border transition-colors text-left ${
                  selectedDice === dice.name
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-green-50 hover:bg-green-100 border-green-200 text-gray-700'
                }`}
              >
                <div className="font-semibold">{dice.name}</div>
                <div className="text-sm opacity-80">{dice.sides} sides</div>
                <div className="text-xs opacity-60">{dice.description}</div>
                {dice.common && <div className="text-xs opacity-60 mt-1">Common</div>}
              </button>
            ))}
          </div>
        </div>

        {/* Dice Settings */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Dice Configuration */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Dice Configuration</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Dice Type
              </label>
              <select
                value={selectedDice}
                onChange={(e) => setSelectedDice(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Select dice type"
              >
                {DICE_TYPES.map(dice => (
                  <option key={dice.name} value={dice.name}>
                    {dice.name} - {dice.sides} sides
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Dice: {numberOfDice}
              </label>
              <input
                type="range"
                min="1"
                max="20"
                value={numberOfDice}
                onChange={(e) => setNumberOfDice(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                aria-label="Number of dice slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>1</span>
                <span>5</span>
                <span>10</span>
                <span>20</span>
              </div>
            </div>
          </div>

          {/* Dice Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800">Dice Information</h3>
            <div className="bg-green-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Selected Dice</h4>
              <div className="text-sm text-green-700 space-y-1">
                <div>Type: {selectedDice}</div>
                <div>Sides: {DICE_TYPES.find(d => d.name === selectedDice)?.sides}</div>
                <div>Description: {DICE_TYPES.find(d => d.name === selectedDice)?.description}</div>
                <div>Range: 1 - {DICE_TYPES.find(d => d.name === selectedDice)?.sides}</div>
                <div>Dice Count: {numberOfDice}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Roll Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleRoll}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Roll Dice</span>
          </button>
        </div>

        {/* Current Roll Results */}
        {currentRoll && (
          <div className="space-y-6">
            {/* Roll Results */}
            <div className="bg-green-50 p-6 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-4">Roll Results</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-green-700">{currentRoll.rolls.join(', ')}</div>
                  <div className="text-sm text-gray-600">Individual Rolls</div>
                  <div className="text-xs text-green-600">Each die result</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-700">{currentRoll.total}</div>
                  <div className="text-sm text-gray-600">Total</div>
                  <div className="text-xs text-blue-600">Sum of all rolls</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-purple-700">{formatNumber(currentRoll.average)}</div>
                  <div className="text-sm text-gray-600">Average</div>
                  <div className="text-xs text-purple-600">Mean roll value</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-orange-700">{currentRoll.min} - {currentRoll.max}</div>
                  <div className="text-sm text-gray-600">Range</div>
                  <div className="text-xs text-orange-600">Min to max</div>
                </div>
              </div>
            </div>

            {/* Roll History */}
            {rollHistory.length > 1 && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Roll History</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {rollHistory.slice(1).map((roll, index) => (
                    <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                      <div className="text-sm text-gray-600">Roll {index + 2}</div>
                      <div className="font-semibold text-gray-800">{roll.rolls.join(', ')} = {roll.total}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
              <h4 className="font-semibold text-gray-800 mb-2">About Dice Roller</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This virtual dice roller supports various polyhedral dice commonly used in tabletop games, 
                role-playing games, and educational activities. It provides individual roll results, totals, 
                averages, and maintains a history of recent rolls. Perfect for gaming, probability studies, 
                or when you need to roll dice without physical dice available.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
