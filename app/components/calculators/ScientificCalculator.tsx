'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Calculator as CalculatorIcon, RotateCcw, History, Trash2, Share2, Sun, Moon, Smartphone, Monitor, X } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface Calculation {
  expression: string
  result: string
  timestamp: Date
}

export default function ScientificCalculator() {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)
  const [history, setHistory] = useState<Calculation[]>([])
  const [showHistory, setShowHistory] = useState(false)
  const [memory, setMemory] = useState(0)
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg')
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showScientific, setShowScientific] = useState(false)
  const [isEngineeringMode, setIsEngineeringMode] = useState(false)
  const [isScientificMode, setIsScientificMode] = useState(false)
  const [isPolarMode, setIsPolarMode] = useState(false)
  const [lastResult, setLastResult] = useState<number | null>(null)
  const [variables, setVariables] = useState<{[key: string]: number}>({})
  const [parenthesesCount, setParenthesesCount] = useState(0)

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

  const powerFunction = useCallback((func: string) => {
    if (func === 'x^y' || func === 'y^x') {
      setPreviousValue(parseFloat(display))
      setOperation(func)
      setWaitingForOperand(true)
    }
  }, [display])

  const performOperation = useCallback((nextOperation: string) => {
    const inputValue = parseFloat(display)

    if (nextOperation === 'x^y' || nextOperation === 'y^x') {
      powerFunction(nextOperation)
      return
    }

    if (nextOperation === 'nCr' || nextOperation === 'nPr') {
      combinationFunction(nextOperation)
      return
    }

    if (nextOperation === '(') {
      setParenthesesCount(prev => prev + 1)
      setDisplay(display + '(')
      return
    }

    if (nextOperation === ')') {
      if (parenthesesCount > 0) {
        setParenthesesCount(prev => prev - 1)
        setDisplay(display + ')')
      }
      return
    }

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
        case 'x^y':
          newValue = Math.pow(currentValue, inputValue)
          break
        case 'y^x':
          newValue = Math.pow(inputValue, currentValue)
          break
        default:
          newValue = inputValue
      }

      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }, [display, operation, previousValue, powerFunction])

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
      case 'x^y':
        result = Math.pow(previousValue, inputValue)
        break
      case 'y^x':
        result = Math.pow(inputValue, previousValue)
        break
      case 'nCr':
        result = combination(previousValue, inputValue)
        break
      case 'nPr':
        result = permutation(previousValue, inputValue)
        break
      default:
        result = inputValue
    }

    const calculation: Calculation = {
      expression: `${previousValue} ${operation} ${inputValue}`,
      result: String(result),
      timestamp: new Date()
    }

    setHistory(prev => [calculation, ...prev.slice(0, 19)])
    setDisplay(String(result))
    setLastResult(result)
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
      case 'sin⁻¹':
        result = angleMode === 'deg' ? Math.asin(inputValue) * 180 / Math.PI : Math.asin(inputValue)
        break
      case 'cos⁻¹':
        result = angleMode === 'deg' ? Math.acos(inputValue) * 180 / Math.PI : Math.acos(inputValue)
        break
      case 'tan⁻¹':
        result = angleMode === 'deg' ? Math.atan(inputValue) * 180 / Math.PI : Math.atan(inputValue)
        break
      case 'sinh':
        result = Math.sinh(inputValue)
        break
      case 'cosh':
        result = Math.cosh(inputValue)
        break
      case 'tanh':
        result = Math.tanh(inputValue)
        break
      case '10^x':
        result = Math.pow(10, inputValue)
        break
      case 'e^x':
        result = Math.exp(inputValue)
        break
      case '∛x':
        result = Math.cbrt(inputValue)
        break
      case 'x^y':
        // This will be handled by a special power function
        return
      case 'y^x':
        // This will be handled by a special power function
        return
      case '%':
        result = inputValue / 100
        break
      case 'Ans':
        result = lastResult || 0
        break
      case 'nCr':
        // This will be handled by a special combination function
        return
      case 'nPr':
        // This will be handled by a special permutation function
        return
      case 'S↔D':
        // Toggle between scientific and decimal notation
        if (isScientificMode) {
          result = inputValue
        } else {
          result = inputValue
        }
        setIsScientificMode(!isScientificMode)
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

  const combination = (n: number, r: number): number => {
    if (n < 0 || r < 0 || r > n) return NaN
    if (r === 0 || r === n) return 1
    return factorial(n) / (factorial(r) * factorial(n - r))
  }

  const permutation = (n: number, r: number): number => {
    if (n < 0 || r < 0 || r > n) return NaN
    if (r === 0) return 1
    return factorial(n) / factorial(n - r)
  }

  const combinationFunction = useCallback((func: string) => {
    if (func === 'nCr' || func === 'nPr') {
      setPreviousValue(parseFloat(display))
      setOperation(func)
      setWaitingForOperand(true)
    }
  }, [display])

  const calculateCombination = useCallback(() => {
    if (!previousValue || !operation || (operation !== 'nCr' && operation !== 'nPr')) return

    const inputValue = parseFloat(display)
    let result: number

    if (operation === 'nCr') {
      result = combination(previousValue, inputValue)
    } else { // nPr
      result = permutation(previousValue, inputValue)
    }

    const calculation: Calculation = {
      expression: `${operation}(${previousValue}, ${inputValue})`,
      result: String(result),
      timestamp: new Date()
    }

    setHistory(prev => [calculation, ...prev.slice(0, 19)])
    setDisplay(String(result))
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(true)
  }, [display, operation, previousValue])


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
      case 'STO':
        // Store in variable A (can be extended for B, C, X)
        setVariables(prev => ({ ...prev, A: inputValue }))
        break
      case 'RCL':
        // Recall from variable A
        setDisplay(String(variables.A || 0))
        setWaitingForOperand(true)
        break
    }
  }, [display, memory, variables])

  const toggleAngleMode = useCallback(() => {
    setAngleMode(prev => prev === 'deg' ? 'rad' : 'deg')
  }, [])

  const clearHistory = useCallback(() => {
    setHistory([])
  }, [])

  // Mobile detection and keyboard support
  useEffect(() => {
    const checkMobile = () => {
      const isMobileDevice = window.innerWidth < 768
      setIsMobile(isMobileDevice)
      console.log('Mobile detection:', isMobileDevice, 'Width:', window.innerWidth)
    }
    
    // Initial check
    checkMobile()
    
    // Add resize listener
    window.addEventListener('resize', checkMobile)
    
    // Also check on mount to handle SSR
    const timer = setTimeout(checkMobile, 100)
    
    return () => {
      window.removeEventListener('resize', checkMobile)
      clearTimeout(timer)
    }
  }, [])

  // Keyboard support
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const { key } = event
      
      // Prevent default for calculator keys
      if (/[0-9+\-*/.=]/.test(key) || key === 'Enter' || key === 'Escape' || key === 'Backspace') {
        event.preventDefault()
      }
      
      // Numbers
      if (/[0-9]/.test(key)) {
        inputDigit(key)
      }
      // Decimal point
      else if (key === '.') {
        inputDecimal()
      }
      // Operations
      else if (key === '+') {
        performOperation('+')
      }
      else if (key === '-') {
        performOperation('-')
      }
      else if (key === '*') {
        performOperation('×')
      }
      else if (key === '/') {
        performOperation('÷')
      }
      // Equals
      else if (key === '=' || key === 'Enter') {
        calculateResult()
      }
      // Clear
      else if (key === 'Escape') {
        clearAll()
      }
      // Backspace
      else if (key === 'Backspace') {
        if (display.length > 1) {
          setDisplay(display.slice(0, -1))
        } else {
          setDisplay('0')
        }
      }
      // Parentheses
      else if (key === '(') {
        performOperation('(')
      }
      else if (key === ')') {
        performOperation(')')
      }
      // Answer
      else if (key === 'a' || key === 'A') {
        scientificFunction('Ans')
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [display, inputDigit, inputDecimal, performOperation, calculateResult, clearAll])

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      <div className="max-w-2xl mx-auto px-2 py-2">
        {/* Modern Header */}
        <header className="mb-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="text-center sm:text-left">
            </div>
            
            {/* Control Panel */}
            <div className="flex items-center justify-center gap-1">
              {/* Theme Toggle */}
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                    : 'bg-gray-400 hover:bg-gray-500 text-white shadow-lg'
                }`}
                title="Toggle theme"
              >
                {isDarkMode ? <Sun className="w-3 h-3" /> : <Moon className="w-3 h-3" />}
              </button>
              
              
              {/* History Toggle */}
              <button
                onClick={() => setShowHistory(!showHistory)}
                className={`p-1.5 rounded-md transition-all duration-200 ${
                  showHistory 
                    ? 'bg-gray-600 text-white' 
                    : isDarkMode 
                      ? 'bg-gray-500 text-white' 
                      : 'bg-gray-400 text-white shadow-lg'
                }`}
                title="Toggle history"
              >
                <History className="w-3 h-3" />
              </button>
            </div>
          </div>
          
        </header>

        {/* Share Options - Moved to Top */}
        {history.length > 0 && (
          <div className={`mb-3 rounded-xl shadow-md p-3 transition-colors duration-300 ${
            isDarkMode 
              ? 'bg-gray-800 border-gray-700' 
              : 'bg-white border-gray-200'
          } border-2`}>
            <ResultSharing
              title="Scientific Calculation Result"
              inputs={[
                { label: "Latest Expression", value: history[history.length - 1]?.expression || "" },
                { label: "Angle Mode", value: angleMode },
                { label: "Memory Value", value: memory.toFixed(8) }
              ]}
              result={{ 
                label: "Result", 
                value: history[history.length - 1]?.result || display,
                unit: ""
              }}
              calculatorName="Scientific Calculator"
              className="mb-0"
            />
          </div>
        )}

        {/* Main Calculator Layout */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-2">
          {/* Calculator Display and Basic Functions */}
          <div className="xl:col-span-3">
            <div className={`rounded-xl shadow-lg p-2 sm:p-3 transition-colors duration-300 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            } border-2`}>
              {/* Modern Display */}
              <div className="mb-2">
                <div className={`relative rounded-lg p-2 sm:p-3 transition-colors duration-300 ${
                  isDarkMode 
                    ? 'bg-gray-900 border-gray-700' 
                    : 'bg-gray-900 border-gray-600'
                } border-2`}>
                  <div className="text-right w-full">
                    <div className={`text-xs mb-1 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-300'
                    }`}>
                      {previousValue !== null && operation && (
                        <span>{previousValue} {operation}</span>
                      )}
                    </div>
                    <div className={`text-lg sm:text-xl lg:text-2xl font-bold font-mono break-all ${
                      isDarkMode ? 'text-white' : 'text-white'
                    }`}>
                      {display}
                    </div>
                    <div className={`text-xs mt-1 ${
                      isDarkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      Angle: {angleMode} | Memory: {memory !== 0 ? memory.toFixed(2) : '0'} | 
                      {isEngineeringMode && ' ENG'} {isScientificMode && ' SCI'} {isPolarMode && ' POL'}
                    </div>
                  </div>
                  {history.length > 0 && (
                    <button
                      onClick={() => {/* Share functionality */}}
                      className={`absolute top-3 right-3 p-2 rounded-lg transition-colors ${
                        isDarkMode 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                          : 'text-gray-300 hover:text-white hover:bg-gray-700'
                      }`}
                      title="Share latest result"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* Scientific Functions - Always visible on mobile, organized in 7 rows */}
              <div className="space-y-1 mb-2">
                {/* Row 1: deg, sin, cos, tan, log, ln */}
                <div className="grid grid-cols-6 gap-1">
                <button
                  onClick={toggleAngleMode}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Toggle Angle Mode"
                >
                  {angleMode}
                </button>
                <button
                  onClick={() => scientificFunction('sin')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Sine"
                >
                  sin
                </button>
                <button
                  onClick={() => scientificFunction('cos')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Cosine"
                >
                  cos
                </button>
                <button
                  onClick={() => scientificFunction('tan')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Tangent"
                >
                  tan
                </button>
                <button
                  onClick={() => scientificFunction('log')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Logarithm base 10"
                >
                  log
                </button>
                <button
                  onClick={() => scientificFunction('ln')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Natural logarithm"
                >
                  ln
                </button>
              </div>

                {/* Row 2: √, x², x³, 1/x, π, e */}
                <div className="grid grid-cols-6 gap-1">
                <button
                  onClick={() => scientificFunction('sqrt')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Square root"
                >
                  √
                </button>
                <button
                  onClick={() => scientificFunction('x²')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Square"
                >
                  x²
                </button>
                <button
                  onClick={() => scientificFunction('x³')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Cube"
                >
                  x³
                </button>
                <button
                  onClick={() => scientificFunction('1/x')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Reciprocal"
                >
                  1/x
                </button>
                <button
                  onClick={() => scientificFunction('π')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Pi"
                >
                  π
                </button>
                <button
                  onClick={() => scientificFunction('e')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Euler's number"
                >
                  e
                </button>
                </div>

                {/* Row 3: n!, ±, MC, MR, M+, M- */}
                <div className="grid grid-cols-6 gap-1">
                <button
                  onClick={() => scientificFunction('n!')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Factorial"
                >
                  n!
                </button>
                <button
                  onClick={() => scientificFunction('±')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Plus/Minus"
                >
                  ±
                </button>
                <button
                  onClick={() => memoryFunction('MC')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Memory Clear"
                >
                  MC
                </button>
                <button
                  onClick={() => memoryFunction('MR')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Memory Recall"
                >
                  MR
                </button>
                <button
                  onClick={() => memoryFunction('M+')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Memory Add"
                >
                  M+
                </button>
                <button
                  onClick={() => memoryFunction('M-')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Memory Subtract"
                >
                  M-
                </button>
              </div>

                {/* Row 4: Inverse Trig Functions */}
                <div className="grid grid-cols-6 gap-1">
                  <button
                    onClick={() => scientificFunction('sin⁻¹')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="Inverse sine"
                  >
                    sin⁻¹
                  </button>
                  <button
                    onClick={() => scientificFunction('cos⁻¹')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="Inverse cosine"
                  >
                    cos⁻¹
                  </button>
                  <button
                    onClick={() => scientificFunction('tan⁻¹')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="Inverse tangent"
                  >
                    tan⁻¹
                  </button>
                  <button
                    onClick={() => scientificFunction('sinh')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="Hyperbolic sine"
                  >
                    sinh
                  </button>
                  <button
                    onClick={() => scientificFunction('cosh')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="Hyperbolic cosine"
                  >
                    cosh
                  </button>
                  <button
                    onClick={() => scientificFunction('tanh')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="Hyperbolic tangent"
                  >
                    tanh
                  </button>
                </div>

                {/* Row 5: Power and Other Functions */}
                <div className="grid grid-cols-6 gap-1">
                  <button
                    onClick={() => performOperation('x^y')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="x to the power of y"
                  >
                    x^y
                  </button>
                  <button
                    onClick={() => performOperation('y^x')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="y to the power of x"
                  >
                    y^x
                  </button>
                  <button
                    onClick={() => scientificFunction('10^x')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="10 to the power of x"
                  >
                    10^x
                  </button>
                  <button
                    onClick={() => scientificFunction('e^x')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="e to the power of x"
                  >
                    e^x
                  </button>
                  <button
                    onClick={() => scientificFunction('∛x')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="Cube root"
                  >
                    ∛x
                  </button>
                  <button
                    onClick={() => scientificFunction('%')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    title="Percentage"
                  >
                    %
                  </button>
                </div>

                {/* Row 6: Engineering and Advanced Functions */}
                <div className="grid grid-cols-6 gap-1">
                  <button
                    onClick={() => setIsEngineeringMode(!isEngineeringMode)}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isEngineeringMode
                        ? 'bg-gray-600 text-white'
                        : isDarkMode 
                          ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                          : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="Engineering notation"
                  >
                    ENG
                  </button>
                  <button
                    onClick={() => scientificFunction('S↔D')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isScientificMode
                        ? 'bg-gray-600 text-white'
                        : isDarkMode 
                          ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                          : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="Scientific/Decimal toggle"
                  >
                    S↔D
                  </button>
                  <button
                    onClick={() => setIsPolarMode(!isPolarMode)}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isPolarMode
                        ? 'bg-gray-600 text-white'
                        : isDarkMode 
                          ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                          : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="Polar/Rectangular coordinates"
                  >
                    POL
                  </button>
                  <button
                    onClick={() => performOperation('nCr')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="Combination (nCr)"
                  >
                    nCr
                  </button>
                  <button
                    onClick={() => performOperation('nPr')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="Permutation (nPr)"
                  >
                    nPr
                  </button>
                  <button
                    onClick={() => scientificFunction('Ans')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    title="Previous answer"
                  >
                    Ans
                  </button>
                </div>

                {/* Row 7: Parentheses and Advanced Memory */}
                <div className="grid grid-cols-6 gap-1">
                  <button
                    onClick={() => performOperation('(')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="Open parenthesis"
                  >
                    (
                  </button>
                  <button
                    onClick={() => performOperation(')')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                    title="Close parenthesis"
                  >
                    )
                  </button>
                  <button
                    onClick={() => memoryFunction('STO')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    title="Store in variable A"
                  >
                    STO
                  </button>
                  <button
                    onClick={() => memoryFunction('RCL')}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    title="Recall variable A"
                  >
                    RCL
                  </button>
                  <button
                    onClick={() => {/* STAT mode - placeholder */}}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    title="Statistical mode"
                  >
                    STAT
                  </button>
                  <button
                    onClick={() => {/* Exp/EE - placeholder */}}
                    className={`h-8 rounded-md font-semibold text-xs transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-600 hover:bg-gray-500 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                    }`}
                    title="Scientific notation"
                  >
                    Exp
                  </button>
                </div>
              </div>


              {/* Basic Calculator - Numbers and Operations */}
              <div className="space-y-0.5">
                {/* First Row - Clear and Operations */}
                <div className="grid grid-cols-4 gap-1">
                <button
                  onClick={clearAll}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Clear All"
                >
                  C
                </button>
                <button
                  onClick={clearEntry}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Clear Entry"
                >
                  CE
                </button>
                <button
                  onClick={() => performOperation('÷')}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Divide"
                >
                  ÷
                </button>
                <button
                  onClick={() => performOperation('×')}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Multiply"
                >
                  ×
                </button>
                </div>

                {/* Number Pad */}
                <div className="grid grid-cols-4 gap-1">
                  {/* Row 1: 7, 8, 9, - */}
                <button
                  onClick={() => inputDigit('7')}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                  7
                </button>
                <button
                  onClick={() => inputDigit('8')}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                  8
                </button>
                <button
                  onClick={() => inputDigit('9')}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                  9
                </button>
                <button
                  onClick={() => performOperation('-')}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Subtract"
                >
                  -
                </button>

                  {/* Row 2: 4, 5, 6, + */}
                <button
                  onClick={() => inputDigit('4')}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                  4
                </button>
                <button
                  onClick={() => inputDigit('5')}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                  5
                </button>
                <button
                  onClick={() => inputDigit('6')}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                  6
                </button>
                <button
                  onClick={() => performOperation('+')}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    }`}
                  title="Add"
                >
                  +
                </button>

                  {/* Row 3: 1, 2, 3, = */}
                <button
                  onClick={() => inputDigit('1')}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                  1
                </button>
                <button
                  onClick={() => inputDigit('2')}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                  2
                </button>
                <button
                  onClick={() => inputDigit('3')}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                  3
                </button>
                <button
                  onClick={calculateResult}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-500 hover:bg-gray-400 text-white' 
                        : 'bg-gray-400 hover:bg-gray-500 text-white'
                    } row-span-2`}
                  title="Equals"
                >
                  =
                </button>

                  {/* Row 4: 0, . */}
                <button
                  onClick={() => inputDigit('0')}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    } col-span-2`}
                >
                  0
                </button>
                <button
                  onClick={inputDecimal}
                    className={`h-10 rounded-md font-semibold text-sm transition-all duration-200 active:scale-95 ${
                      isDarkMode 
                        ? 'bg-gray-700 hover:bg-gray-600 text-white' 
                        : 'bg-gray-200 hover:bg-gray-300 text-gray-800'
                    }`}
                >
                  .
                </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - History and Info (Desktop) */}
          {!isMobile && (
            <div className="xl:col-span-1">
              <div className={`rounded-3xl shadow-2xl p-4 sm:p-6 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              } border-2 h-fit`}>
              <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-lg sm:text-xl font-semibold flex items-center ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    <History className="w-5 h-5 mr-2 text-blue-500" />
                    History
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowHistory(!showHistory)}
                      className={`p-2 rounded-lg transition-colors ${
                        showHistory 
                          ? 'bg-gray-600 text-white' 
                          : isDarkMode 
                            ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                            : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                      }`}
                    title="Toggle History"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                  <button
                    onClick={clearHistory}
                      className={`p-2 rounded-lg transition-colors ${
                        isDarkMode 
                          ? 'text-gray-400 hover:text-white hover:bg-gray-600' 
                          : 'text-gray-600 hover:text-white hover:bg-gray-500'
                      }`}
                    title="Clear History"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {showHistory && (
                <div className="space-y-3 max-h-96 overflow-y-auto history-scrollbar">
                  {history.length === 0 ? (
                      <p className={`text-center py-8 ${
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      }`}>
                      No calculations yet. Start calculating to see your history!
                    </p>
                  ) : (
                    history.map((calc, index) => (
                      <div
                        key={index}
                          className={`rounded-lg p-3 border-l-4 border-blue-500 transition-colors duration-300 ${
                            isDarkMode 
                              ? 'bg-gray-700 hover:bg-gray-600' 
                              : 'bg-gray-50 hover:bg-gray-100'
                          }`}
                        >
                          <div className={`text-xs mb-1 ${
                            isDarkMode ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                          {calc.timestamp.toLocaleTimeString()}
                        </div>
                          <div className={`font-mono text-sm mb-1 ${
                            isDarkMode ? 'text-gray-200' : 'text-gray-800'
                          }`}>
                          {calc.expression}
                        </div>
                          <div className="text-lg font-bold text-blue-500">
                          = {calc.result}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* Memory Display */}
                <div className={`mt-6 pt-4 border-t ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <h4 className={`text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Memory</h4>
                  <div className={`rounded-lg p-3 ${
                    isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
                  }`}>
                    <div className={`text-xl font-bold font-mono ${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                    }`}>
                    {memory.toFixed(8)}
                  </div>
                </div>
              </div>

              {/* Quick Info */}
                <div className={`mt-6 pt-4 border-t ${
                  isDarkMode ? 'border-gray-700' : 'border-gray-200'
                }`}>
                  <h4 className={`text-sm font-medium mb-2 ${
                    isDarkMode ? 'text-gray-300' : 'text-gray-600'
                  }`}>Quick Info</h4>
                  <div className={`text-xs space-y-1 ${
                    isDarkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                  <p>• Use scientific functions for advanced math</p>
                  <p>• Toggle between degrees and radians</p>
                  <p>• Memory functions for storing values</p>
                  <p>• Keyboard shortcuts supported</p>
                </div>
              </div>
            </div>
          </div>
          )}

          {/* Mobile History Panel */}
          {isMobile && showHistory && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end">
              <div className={`w-full max-h-[60vh] rounded-t-xl p-3 transition-colors duration-300 ${
                isDarkMode 
                  ? 'bg-gray-800' 
                  : 'bg-white'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className={`text-xl font-semibold flex items-center ${
                    isDarkMode ? 'text-white' : 'text-gray-800'
                  }`}>
                    <History className="w-5 h-5 mr-2 text-blue-500" />
                    Calculation History
                  </h3>
                  <button
                    onClick={() => setShowHistory(false)}
                    className={`p-2 rounded-lg ${
                      isDarkMode 
                        ? 'text-gray-400 hover:text-white hover:bg-gray-700' 
                        : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                    }`}
                    title="Close history"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {history.length === 0 ? (
                    <p className={`text-center py-8 ${
                      isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    }`}>
                      No calculations yet. Start calculating to see your history!
                    </p>
                  ) : (
                    history.map((calc, index) => (
                      <div
                        key={index}
                        className={`rounded-lg p-3 border-l-4 border-blue-500 ${
                          isDarkMode 
                            ? 'bg-gray-700' 
                            : 'bg-gray-50'
                        }`}
                      >
                        <div className={`text-xs mb-1 ${
                          isDarkMode ? 'text-gray-400' : 'text-gray-600'
                        }`}>
                          {calc.timestamp.toLocaleTimeString()}
                        </div>
                        <div className={`font-mono text-sm mb-1 ${
                          isDarkMode ? 'text-gray-200' : 'text-gray-800'
                        }`}>
                          {calc.expression}
                        </div>
                        <div className="text-lg font-bold text-blue-500">
                          = {calc.result}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Calculator Description Section */}
        <div className={`mt-12 p-6 rounded-3xl shadow-2xl transition-colors duration-300 ${
          isDarkMode 
            ? 'bg-gray-800 border-gray-700' 
            : 'bg-white border-gray-200'
        } border-2`}>
          <h3 className={`text-2xl font-semibold mb-6 text-center ${
            isDarkMode ? 'text-white' : 'text-gray-800'
          }`}>About Scientific Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className={`mb-6 text-lg ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Our advanced scientific calculator provides comprehensive mathematical functions for students, engineers, 
              scientists, and professionals. This powerful tool handles complex calculations with precision and ease, 
              making it perfect for academic work, engineering projects, and scientific research.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h4 className={`text-xl font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>Mathematical Functions</h4>
                <ul className={`list-disc list-inside mb-4 space-y-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <li><strong>Trigonometric:</strong> sin, cos, tan, inverse functions</li>
                  <li><strong>Logarithmic:</strong> log (base 10), ln (natural log)</li>
                  <li><strong>Exponential:</strong> e^x, x^y, square root, cube root</li>
                  <li><strong>Statistical:</strong> factorial, percentage calculations</li>
                  <li><strong>Memory Functions:</strong> M+, M-, MR, MC for storing values</li>
                </ul>
              </div>
              
              <div>
                <h4 className={`text-xl font-semibold mb-4 ${
                  isDarkMode ? 'text-white' : 'text-gray-800'
                }`}>Advanced Features</h4>
                <ul className={`list-disc list-inside mb-4 space-y-2 ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>
                  <li><strong>Angle Modes:</strong> Switch between degrees and radians</li>
                  <li><strong>Calculation History:</strong> Track all your calculations</li>
                  <li><strong>Keyboard Support:</strong> Full keyboard input compatibility</li>
                  <li><strong>Precision:</strong> High-accuracy floating-point calculations</li>
                  <li><strong>Responsive Design:</strong> Works on all devices</li>
                </ul>
              </div>
            </div>
            
            <h4 className={`text-xl font-semibold mb-4 mt-8 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>Perfect For</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <h5 className={`font-semibold mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>Students</h5>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Mathematics, physics, engineering courses</p>
              </div>
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <h5 className={`font-semibold mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>Engineers</h5>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Technical calculations and design work</p>
              </div>
              <div className={`p-4 rounded-lg ${
                isDarkMode ? 'bg-gray-800' : 'bg-gray-100'
              }`}>
                <h5 className={`font-semibold mb-2 ${
                  isDarkMode ? 'text-gray-200' : 'text-gray-800'
                }`}>Scientists</h5>
                <p className={`text-sm ${
                  isDarkMode ? 'text-gray-300' : 'text-gray-700'
                }`}>Research and data analysis</p>
              </div>
            </div>
            
            <h4 className={`text-xl font-semibold mb-4 ${
              isDarkMode ? 'text-white' : 'text-gray-800'
            }`}>How to Use</h4>
            <p className={`mb-4 ${
              isDarkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Simply click the buttons or use your keyboard to input calculations. The calculator supports standard 
              mathematical notation and provides instant results. Use the memory functions to store intermediate 
              values and the history feature to review your calculation steps.
            </p>
            
            <div className={`p-4 rounded-lg border-l-4 border-blue-500 ${
              isDarkMode ? 'bg-gray-700' : 'bg-gray-50'
            }`}>
              <h5 className={`font-semibold mb-2 ${
                isDarkMode ? 'text-white' : 'text-gray-800'
              }`}>Pro Tip</h5>
              <p className={`text-sm ${
                isDarkMode ? 'text-gray-300' : 'text-gray-700'
              }`}>
                Use the angle mode toggle to switch between degrees and radians based on your calculation needs. 
                Most scientific applications use radians, while everyday calculations often use degrees.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className={`text-center mt-12 ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
        </footer>
      </div>
    </div>
  )
}
