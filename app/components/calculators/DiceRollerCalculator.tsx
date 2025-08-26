'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Dice1, BarChart3, RefreshCw } from 'lucide-react'
import ResultSharing from '../ResultSharing'

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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
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
            <Dice1 className="w-16 h-16 text-green-200" />
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
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-6 rounded-lg border border-green-200">
              <ResultSharing
                title="Dice Roll Result"
                inputs={[
                  { label: "Dice Type", value: selectedDice },
                  { label: "Number of Dice", value: numberOfDice.toString() },
                  { label: "Roll Type", value: "Random Roll" }
                ]}
                result={{ 
                  label: "Total Roll", 
                  value: currentRoll.total.toString(),
                  unit: ""
                }}
                calculatorName="Dice Roller Calculator"
                className="mb-0"
              />
            </div>

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

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Dice Roller Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive dice roller calculator provides virtual dice rolling for tabletop games, 
              role-playing games, and educational purposes. This essential tool simulates various polyhedral 
              dice, calculates statistics, and maintains roll history, making it perfect for gaming, 
              probability studies, and decision-making when physical dice aren't available.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Simulates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Polyhedral Dice:</strong> D4, D6, D8, D10, D12, D20, D100</li>
              <li><strong>Multiple Dice:</strong> Roll 1-20 dice simultaneously</li>
              <li><strong>Random Results:</strong> True random number generation</li>
              <li><strong>Roll Statistics:</strong> Totals, averages, ranges, and history</li>
              <li><strong>Game Support:</strong> Tabletop RPGs, board games, and more</li>
              <li><strong>Educational Tool:</strong> Probability and statistics learning</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Supported Dice Types</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Common Dice</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>D4 (Tetrahedron):</strong> 4 triangular faces, 1-4 range</li>
                  <li><strong>D6 (Cube):</strong> 6 square faces, 1-6 range</li>
                  <li><strong>D8 (Octahedron):</strong> 8 triangular faces, 1-8 range</li>
                  <li><strong>D10 (Decahedron):</strong> 10 faces, 0-9 or 1-10 range</li>
                  <li><strong>D12 (Dodecahedron):</strong> 12 pentagonal faces, 1-12 range</li>
                  <li><strong>D20 (Icosahedron):</strong> 20 triangular faces, 1-20 range</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Specialized Dice</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>D100 (Percentile):</strong> 100 faces, 1-100 range</li>
                  <li><strong>Custom Dice:</strong> User-defined number of sides</li>
                  <li><strong>Fudge Dice:</strong> -1, 0, +1 results</li>
                  <li><strong>Exploding Dice:</strong> Re-roll on maximum values</li>
                  <li><strong>Loaded Dice:</strong> Weighted probability options</li>
                  <li><strong>Virtual Dice:</strong> No physical dice needed</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Individual Rolls</h5>
                <p className="text-green-700 text-sm">Each die result</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Total</h5>
                <p className="text-blue-700 text-sm">Sum of all rolls</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Average</h5>
                <p className="text-purple-700 text-sm">Mean roll value</p>
              </div>
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">Range</h5>
                <p className="text-orange-700 text-sm">Min to max values</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Select your dice type, choose the number of dice to roll (1-20), and click "Roll Dice" 
              to generate random results. The calculator displays individual rolls, totals, averages, 
              and maintains a history of recent rolls. Use quick dice buttons for common dice types.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Probability Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Fair Dice:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Equal probability for each face</li>
                    <li>Random number generation</li>
                    <li>No bias or weighting</li>
                    <li>Statistical accuracy</li>
                    <li>True randomness</li>
                    <li>Unpredictable results</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Probability Calculations:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Each face has 1/n probability</li>
                    <li>n = number of sides</li>
                    <li>Expected value calculations</li>
                    <li>Standard deviation analysis</li>
                    <li>Distribution patterns</li>
                    <li>Statistical significance</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Use Cases</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Gaming Applications</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Tabletop RPGs:</strong> Dungeons & Dragons, Pathfinder</li>
                  <li><strong>Board Games:</strong> Strategy and chance games</li>
                  <li><strong>War Games:</strong> Miniature and tactical games</li>
                  <li><strong>Card Games:</strong> Games requiring random elements</li>
                  <li><strong>Party Games:</strong> Social and group activities</li>
                  <li><strong>Educational Games:</strong> Learning through play</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Educational Uses</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Probability Studies:</strong> Random event analysis</li>
                  <li><strong>Statistics Learning:</strong> Data collection and analysis</li>
                  <li><strong>Mathematics Education:</strong> Number theory and counting</li>
                  <li><strong>Computer Science:</strong> Random number generation</li>
                  <li><strong>Physics Experiments:</strong> Random walk simulations</li>
                  <li><strong>Psychology Studies:</strong> Decision-making research</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Dice Rolling Statistics</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Expected Value:</strong> Average result over many rolls</li>
              <li><strong>Variance:</strong> Spread of results around the mean</li>
              <li><strong>Standard Deviation:</strong> Measure of result variability</li>
              <li><strong>Distribution Shape:</strong> Bell curve for multiple dice</li>
              <li><strong>Central Limit Theorem:</strong> Normal distribution with many dice</li>
              <li><strong>Law of Large Numbers:</strong> Convergence to expected value</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Dice Concepts</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Special Rolling Rules</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Advantage/Disadvantage:</strong> Roll twice, take best/worst</li>
                  <li><strong>Exploding Dice:</strong> Re-roll on maximum values</li>
                  <li><strong>Dropping Results:</strong> Remove highest/lowest rolls</li>
                  <li><strong>Critical Hits:</strong> Special results on maximum rolls</li>
                  <li><strong>Fumble Rules:</strong> Special results on minimum rolls</li>
                  <li><strong>Modifier Systems:</strong> Add/subtract from results</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Probability Analysis</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Success Probability:</strong> Chance of meeting targets</li>
                  <li><strong>Damage Calculations:</strong> Expected damage output</li>
                  <li><strong>Risk Assessment:</strong> Probability of failure</li>
                  <li><strong>Optimal Strategies:</strong> Best decision choices</li>
                  <li><strong>Resource Management:</strong> Efficient resource use</li>
                  <li><strong>Game Balance:</strong> Fair and fun gameplay</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Dice Rolling Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Appropriate Dice:</strong> Choose dice that match your needs</li>
              <li><strong>Consider Probabilities:</strong> Understand expected outcomes</li>
              <li><strong>Plan for Variance:</strong> Account for result variability</li>
              <li><strong>Track Results:</strong> Maintain roll history for analysis</li>
              <li><strong>Use Multiple Dice:</strong> Reduce variance with more dice</li>
              <li><strong>Understand Rules:</strong> Know your game's dice mechanics</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Dice Rolling Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Probability Confusion:</strong> Misunderstanding random chance</li>
              <li><strong>Gambler's Fallacy:</strong> Believing in hot/cold streaks</li>
              <li><strong>Dice Selection Errors:</strong> Using wrong dice types</li>
              <li><strong>Rule Misinterpretation:</strong> Incorrect dice mechanics</li>
              <li><strong>Statistical Errors:</strong> Misreading probability data</li>
              <li><strong>Superstition:</strong> Believing in lucky dice</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Virtual vs. Physical Dice</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Virtual Advantages:</strong> Always available, no loss</li>
              <li><strong>Physical Advantages:</strong> Tactile experience, tradition</li>
              <li><strong>Randomness Quality:</strong> Both can be truly random</li>
              <li><strong>Convenience Factor:</strong> Virtual dice are portable</li>
              <li><strong>Social Aspect:</strong> Physical dice enhance group play</li>
              <li><strong>Accessibility:</strong> Virtual dice help disabled players</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When using virtual dice rollers, remember that each roll is truly random and independent 
                of previous results. Don't fall for the gambler's fallacy - past rolls don't influence 
                future ones. Use the roll history feature to track patterns and analyze your results. 
                For gaming, consider using multiple dice to reduce variance and create more predictable 
                outcomes. Remember that virtual dice are just as random as physical dice, and often more 
                convenient for solo play or when physical dice aren't available.
              </p>
            </div>
          </div>
        </div>

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
