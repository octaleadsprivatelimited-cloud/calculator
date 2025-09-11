'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Binary, Calculator, Info, Copy, Check, RotateCcw } from 'lucide-react'
import ResultSharing from '../ResultSharing'

interface BinaryOperation {
  operation: string
  operand1: string
  operand2: string
  result: string
  decimal1: number
  decimal2: number
  decimalResult: number
}

export default function BinaryCalculator() {
  const [input1, setInput1] = useState('1010')
  const [input2, setInput2] = useState('1100')
  const [operation, setOperation] = useState('add')
  const [result, setResult] = useState<BinaryOperation | null>(null)
  const [copied, setCopied] = useState(false)
  const [history, setHistory] = useState<BinaryOperation[]>([])

  // Validate binary input
  const isValidBinary = (value: string): boolean => {
    return /^[01]+$/.test(value) && value.length <= 32
  }

  // Convert binary to decimal
  const binaryToDecimal = (binary: string): number => {
    return parseInt(binary, 2)
  }

  // Convert decimal to binary
  const decimalToBinary = (decimal: number): string => {
    if (decimal === 0) return '0'
    return Math.abs(decimal).toString(2)
  }

  // Perform binary operations
  const performOperation = useCallback((): BinaryOperation | null => {
    if (!isValidBinary(input1)) {
      return null
    }
    
    if (operation !== 'not' && !isValidBinary(input2)) {
      return null
    }

    const decimal1 = binaryToDecimal(input1)
    const decimal2 = operation !== 'not' ? binaryToDecimal(input2) : 0
    let decimalResult: number
    let binaryResult: string

    switch (operation) {
      case 'add':
        decimalResult = decimal1 + decimal2
        binaryResult = decimalToBinary(decimalResult)
        break
      case 'subtract':
        decimalResult = decimal1 - decimal2
        binaryResult = decimalToBinary(decimalResult)
        break
      case 'multiply':
        decimalResult = decimal1 * decimal2
        binaryResult = decimalToBinary(decimalResult)
        break
      case 'divide':
        if (decimal2 === 0) return null
        decimalResult = Math.floor(decimal1 / decimal2)
        binaryResult = decimalToBinary(decimalResult)
        break
      case 'and':
        decimalResult = decimal1 & decimal2
        binaryResult = decimalToBinary(decimalResult)
        break
      case 'or':
        decimalResult = decimal1 | decimal2
        binaryResult = decimalToBinary(decimalResult)
        break
      case 'xor':
        decimalResult = decimal1 ^ decimal2
        binaryResult = decimalToBinary(decimalResult)
        break
      case 'not':
        decimalResult = ~decimal1
        binaryResult = decimalToBinary(decimalResult)
        break
      case 'leftShift':
        decimalResult = decimal1 << decimal2
        binaryResult = decimalToBinary(decimalResult)
        break
      case 'rightShift':
        decimalResult = decimal1 >> decimal2
        binaryResult = decimalToBinary(decimalResult)
        break
      case 'nand':
        decimalResult = ~(decimal1 & decimal2)
        binaryResult = decimalToBinary(decimalResult)
        break
      case 'nor':
        decimalResult = ~(decimal1 | decimal2)
        binaryResult = decimalToBinary(decimalResult)
        break
      case 'xnor':
        decimalResult = ~(decimal1 ^ decimal2)
        binaryResult = decimalToBinary(decimalResult)
        break
      default:
        return null
    }

    return {
      operation,
      operand1: input1,
      operand2: input2,
      result: binaryResult,
      decimal1,
      decimal2,
      decimalResult
    }
  }, [input1, input2, operation])

  // Calculate result when inputs change
  useEffect(() => {
    const newResult = performOperation()
    setResult(newResult)
  }, [performOperation])

  // Add to history when result changes
  useEffect(() => {
    if (result) {
      setHistory(prev => [result, ...prev.slice(0, 9)])
    }
  }, [result])

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const clearAll = () => {
    setInput1('')
    setInput2('')
    setResult(null)
    setHistory([])
  }

  const clearInputs = () => {
    setInput1('')
    setInput2('')
  }

  const getOperationSymbol = (op: string): string => {
    const symbols: { [key: string]: string } = {
      add: '+',
      subtract: '-',
      multiply: '×',
      divide: '÷',
      and: 'AND',
      or: 'OR',
      xor: 'XOR',
      not: 'NOT',
      nand: 'NAND',
      nor: 'NOR',
      xnor: 'XNOR',
      leftShift: '<<',
      rightShift: '>>'
    }
    return symbols[op] || op
  }

  const getOperationName = (op: string): string => {
    const names: { [key: string]: string } = {
      add: 'Addition',
      subtract: 'Subtraction',
      multiply: 'Multiplication',
      divide: 'Division',
      and: 'Bitwise AND',
      or: 'Bitwise OR',
      xor: 'Bitwise XOR',
      not: 'Bitwise NOT',
      nand: 'Bitwise NAND',
      nor: 'Bitwise NOR',
      xnor: 'Bitwise XNOR',
      leftShift: 'Left Shift',
      rightShift: 'Right Shift'
    }
    return names[op] || op
  }

  const loadFromHistory = (historyItem: BinaryOperation) => {
    setInput1(historyItem.operand1)
    setInput2(historyItem.operand2)
    setOperation(historyItem.operation)
  }

  return (
    <div className="w-full">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl shadow-lg mb-6 p-4 sm:p-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
            <Binary className="w-7 h-7 text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">Binary Calculator</h1>
            <p className="text-purple-100 text-sm sm:text-base">Perform binary arithmetic and bitwise operations</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-2 border-purple-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Input</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                First Binary Number
              </label>
              <input
                type="text"
                value={input1}
                onChange={(e) => setInput1(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="1010"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Operation
              </label>
              <select
                value={operation}
                onChange={(e) => setOperation(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              >
                <option value="add">Addition (+)</option>
                <option value="subtract">Subtraction (-)</option>
                <option value="multiply">Multiplication (×)</option>
                <option value="divide">Division (÷)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Second Binary Number
              </label>
              <input
                type="text"
                value={input2}
                onChange={(e) => setInput2(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                placeholder="1100"
              />
            </div>

            <button
              onClick={calculate}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500"
            >
              Calculate
            </button>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border-2 border-purple-200">
          <h2 className="text-lg font-bold text-gray-800 mb-4">Result</h2>
          
          {result && (
            <div className="space-y-4">
              <div className="bg-purple-50 rounded-lg p-4">
                <span className="text-sm font-medium text-purple-700">Binary Result:</span>
                <div className="font-mono text-lg font-bold text-purple-900">
                  {result}
                </div>
              </div>
              
              <div className="bg-gray-50 rounded-lg p-4">
                <span className="text-sm font-medium text-gray-700">Decimal Result:</span>
                <div className="font-mono text-lg font-bold text-gray-900">
                  {parseInt(result, 2)}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}