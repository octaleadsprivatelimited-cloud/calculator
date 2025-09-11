'use client'

import React, { useState, useCallback } from 'react'
import { Calculator as CalculatorIcon, RotateCcw, History, Trash2, Share2 } from 'lucide-react'
import ShareModal from './ShareModal'

interface Calculation {
  expression: string
  result: string
  timestamp: Date
}

export default function Calculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState<Calculation[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [memory, setMemory] = useState(0)
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg')
  const [showShareModal, setShowShareModal] = useState(false)
  const [selectedCalculation, setSelectedCalculation] = useState<Calculation | null>(null)

  const clearAll = useCallback(() => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }, [])

  const clearEntry = useCallback(() => {
    setDisplay('0')
    setWaitingForOperand(false)
  }, [])

  const inputDigit = useCallback((digit: string) => {
    if (waitingForOperand) {
      setDisplay(digit)
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? digit : display + digit)
    }
  }, [display, waitingForOperand])

  const inputDecimal = useCallback(() => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }, [display, waitingForOperand])

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      let newValue: number

      switch (operation) {
        case '+':
          newValue = currentValue + inputValue
          break
        case '-':
          newValue = currentValue - inputValue
          break
        case '×':
          newValue = currentValue * inputValue
          break
        case '÷':
          newValue = currentValue / inputValue
          break
        default:
          newValue = inputValue
      }

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }, [display, operation, previousValue])

  const calculateResult = useCallback(() => {
    if (!previousValue || !operation) return

    const inputValue = parseFloat(display)
    let result: number

    switch (operation) {
      case '+':
        result = previousValue + inputValue
        break
      case '-':
        result = previousValue - inputValue
        break
      case '×':
        result = previousValue * inputValue
        break
      case '÷':
        result = previousValue / inputValue
        break
      default:
        result = inputValue
    }

    const calculation: Calculation = {
      expression: `${previousValue} ${operation} ${inputValue}`,
      result: String(result),
      timestamp: new Date()
    }

    setHistory(prev => [calculation, ...prev.slice(0, 19)]) // Keep last 20 calculations
    setDisplay(String(result))
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }, [display, operation, previousValue])

  const scientificFunction = useCallback((func: string) => {
    const inputValue = parseFloat(display)
    let result: number

    switch (func) {
      case 'sin':
        result = Math.sin(angleMode === 'deg' ? (inputValue * Math.PI) / 180 : inputValue)
        break
      case 'cos':
        result = Math.cos(angleMode === 'deg' ? (inputValue * Math.PI) / 180 : inputValue)
        break
      case 'tan':
        result = Math.tan(angleMode === 'deg' ? (inputValue * Math.PI) / 180 : inputValue)
        break
      case 'log':
        result = Math.log10(inputValue)
        break
      case 'ln':
        result = Math.log(inputValue)
        break
      case 'sqrt':
        result = Math.sqrt(inputValue)
        break
      case 'x²':
        result = inputValue * inputValue
        break
      case 'x³':
        result = inputValue * inputValue * inputValue
        break
      case '1/x':
        result = 1 / inputValue
        break
      case '±':
        result = -inputValue
        break
      case 'π':
        result = Math.PI
        break
      case 'e':
        result = Math.E
        break
      case 'n!':
        result = factorial(inputValue)
        break
      default:
        return
    }

    const calculation: Calculation = {
      expression: `${func}(${inputValue})`,
      result: String(result),
      timestamp: new Date()
    }

    setHistory(prev => [calculation, ...prev.slice(0, 19)])
    setDisplay(String(result))
    setWaitingForOperand(true)
  }, [display, angleMode])

  const factorial = (n: number): number => {
    if (n < 0) return NaN
    if (n === 0 || n === 1) return 1
    let result = 1
    for (let i = 2; i <= n; i++) {
      result *= i
    }
    return result
  }

  const memoryFunction = useCallback((func: string) => {
    const inputValue = parseFloat(display)
    
    switch (func) {
      case 'MC':
        setMemory(0)
        break
      case 'MR':
        setDisplay(String(memory))
        setWaitingForOperand(true)
        break
      case 'M+':
        setMemory(memory + inputValue)
        break
      case 'M-':
        setMemory(memory - inputValue)
        break
    }
  }, [display, memory])

  const toggleAngleMode = useCallback(() => {
    setAngleMode(prev => prev === 'deg' ? 'rad' : 'deg')
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  const openShareModal = useCallback((calculation: Calculation) => {
    setSelectedCalculation(calculation)
    setShowShareModal(true)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            <CalculatorIcon className="inline-block w-10 h-10 mr-3 text-blue-600" />
            Scientific Calculator
          </h1>
          <p className="text-lg text-gray-600">
            Advanced mathematical functions for students, engineers, and professionals
          </p>
        </header>

        {/* Main Calculator Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Side - Scientific Functions */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-calculator p-6 border-2 border-gray-200">
              {/* Display */}
              <div className="mb-6">
                <div className="calculator-display">
                  <div className="text-right w-full">
                    <div className="text-sm text-gray-400 mb-1">
                      {previousValue !== null && operation && (
                        <span>{previousValue} {operation}</span>
                      )}
                    </div>
                    <div className="text-3xl font-bold">{display}</div>
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={() => openShareModal(history[0])}
                      className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                      title="Share latest result"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Scientific Functions Row */}
              <div className="calculator-grid calculator-grid-8 mb-6">
                <button
                  onClick={toggleAngleMode}
                  className="calculator-button scientific-function col-span-2"
                  title="Toggle Angle Mode"
                >
                  {angleMode}
                </button>
                <button
                  onClick={() => scientificFunction('sin')}
                  className="calculator-button scientific-function"
                  title="Sine"
                >
                  sin
                </button>
                <button
                  onClick={() => scientificFunction('cos')}
                  className="calculator-button scientific-function"
                  title="Cosine"
                >
                  cos
                </button>
                <button
                  onClick={() => scientificFunction('tan')}
                  className="calculator-button scientific-function"
                  title="Tangent"
                >
                  tan
                </button>
                <button
                  onClick={() => scientificFunction('log')}
                  className="calculator-button scientific-function"
                  title="Logarithm base 10"
                >
                  log
                </button>
                <button
                  onClick={() => scientificFunction('ln')}
                  className="calculator-button scientific-function"
                  title="Natural logarithm"
                >
                  ln
                </button>
              </div>

              {/* Second Row of Scientific Functions */}
              <div className="calculator-grid calculator-grid-8 mb-6">
                <button
                  onClick={() => scientificFunction('sqrt')}
                  className="calculator-button scientific-function"
                  title="Square root"
                >
                  √
                </button>
                <button
                  onClick={() => scientificFunction('x²')}
                  className="calculator-button scientific-function"
                  title="Square"
                >
                  x²
                </button>
                <button
                  onClick={() => scientificFunction('x³')}
                  className="calculator-button scientific-function"
                  title="Cube"
                >
                  x³
                </button>
                <button
                  onClick={() => scientificFunction('1/x')}
                  className="calculator-button scientific-function"
                  title="Reciprocal"
                >
                  1/x
                </button>
                <button
                  onClick={() => scientificFunction('π')}
                  className="calculator-button scientific-function"
                  title="Pi"
                >
                  π
                </button>
                <button
                  onClick={() => scientificFunction('e')}
                  className="calculator-button scientific-function"
                  title="Euler's number"
                >
                  e
                </button>
                <button
                  onClick={() => scientificFunction('n!')}
                  className="calculator-button scientific-function"
                  title="Factorial"
                >
                  n!
                </button>
                <button
                  onClick={() => scientificFunction('±')}
                  className="calculator-button scientific-function"
                  title="Plus/Minus"
                >
                  ±
                </button>
              </div>

              {/* Memory Functions */}
              <div className="calculator-grid calculator-grid-4 mb-6">
                <button
                  onClick={() => memoryFunction('MC')}
                  className="calculator-button function-button"
                  title="Memory Clear"
                >
                  MC
                </button>
                <button
                  onClick={() => memoryFunction('MR')}
                  className="calculator-button function-button"
                  title="Memory Recall"
                >
                  MR
                </button>
                <button
                  onClick={() => memoryFunction('M+')}
                  className="calculator-button function-button"
                  title="Memory Add"
                >
                  M+
                </button>
                <button
                  onClick={() => memoryFunction('M-')}
                  className="calculator-button function-button"
                  title="Memory Subtract"
                >
                  M-
                </button>
              </div>

              {/* Numbers and Basic Operations */}
              <div className="calculator-grid calculator-grid-4">
                {/* First Row */}
                <button
                  onClick={clearAll}
                  className="calculator-button function-button"
                  title="Clear All"
                >
                  C
                </button>
                <button
                  onClick={clearEntry}
                  className="calculator-button function-button"
                  title="Clear Entry"
                >
                  CE
                </button>
                <button
                  onClick={() => performOperation('÷')}
                  className="calculator-button operator-button"
                  title="Divide"
                >
                  ÷
                </button>
                <button
                  onClick={() => performOperation('×')}
                  className="calculator-button operator-button"
                  title="Multiply"
                >
                  ×
                </button>

                {/* Second Row */}
                <button
                  onClick={() => inputDigit('7')}
                  className="calculator-button number-button"
                >
                  7
                </button>
                <button
                  onClick={() => inputDigit('8')}
                  className="calculator-button number-button"
                >
                  8
                </button>
                <button
                  onClick={() => inputDigit('9')}
                  className="calculator-button number-button"
                >
                  9
                </button>
                <button
                  onClick={() => performOperation('-')}
                  className="calculator-button operator-button"
                  title="Subtract"
                >
                  -
                </button>

                {/* Third Row */}
                <button
                  onClick={() => inputDigit('4')}
                  className="calculator-button number-button"
                >
                  4
                </button>
                <button
                  onClick={() => inputDigit('5')}
                  className="calculator-button number-button"
                >
                  5
                </button>
                <button
                  onClick={() => inputDigit('6')}
                  className="calculator-button number-button"
                >
                  6
                </button>
                <button
                  onClick={() => performOperation('+')}
                  className="calculator-button operator-button"
                  title="Add"
                >
                  +
                </button>

                {/* Fourth Row */}
                <button
                  onClick={() => inputDigit('1')}
                  className="calculator-button number-button"
                >
                  1
                </button>
                <button
                  onClick={() => inputDigit('2')}
                  className="calculator-button number-button"
                >
                  2
                </button>
                <button
                  onClick={() => inputDigit('3')}
                  className="calculator-button number-button"
                >
                  3
                </button>
                <button
                  onClick={calculateResult}
                  className="calculator-button operator-button row-span-2 h-32"
                  title="Equals"
                >
                  =
                </button>

                {/* Fifth Row */}
                <button
                  onClick={() => inputDigit('0')}
                  className="calculator-button number-button col-span-2"
                >
                  0
                </button>
                <button
                  onClick={inputDecimal}
                  className="calculator-button number-button"
                >
                  .
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Results and History */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-calculator p-6 h-fit">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                  <History className="w-5 h-5 mr-2 text-blue-600" />
                  Calculation History
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                    className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                    title="Toggle History"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearHistory}
                    className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                    title="Clear History"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showHistory && (
                <div className="space-y-3 max-h-96 overflow-y-auto history-scrollbar">
                  {history.length === 0 ? (
                    <p className="text-gray-500 text-center py-8">
                      No calculations yet. Start calculating to see your history!
                    </p>
                  ) : (
                    history.map((calc, index) => (
                      <div
                        key={index}
                        className="bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="text-sm text-gray-600 mb-1">
                              {calc.timestamp.toLocaleTimeString()}
                            </div>
                            <div className="font-mono text-gray-800 mb-1">
                              {calc.expression}
                            </div>
                            <div className="text-lg font-bold text-blue-600">
                              = {calc.result}
                            </div>
                          </div>
                          <button
                            onClick={() => openShareModal(calc)}
                            className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            title="Share this calculation"
                          >
                            <Share2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}



              {/* Memory Display */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Memory</h4>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-gray-800 font-mono">
                    {memory.toFixed(8)}
                  </div>
                </div>
              </div>

              {/* Quick Info */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h4 className="text-sm font-medium text-gray-600 mb-2">Quick Info</h4>
                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Use scientific functions for advanced math</p>
                  <p>• Toggle between degrees and radians</p>
                  <p>• Memory functions for storing values</p>
                  <p>• Keyboard shortcuts supported</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="text-center mt-12 text-gray-500">
        </footer>
      </div>

      {/* Modals */}
      {selectedCalculation && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          calculation={selectedCalculation}
        />
      )}
    </div>
  )
}
