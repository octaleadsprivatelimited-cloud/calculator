'use client'

import React, { useState } from 'react'
import { Binary } from 'lucide-react'

export default function BinaryCalculatorSimple() {
  const [input1, setInput1] = useState('1010')
  const [input2, setInput2] = useState('1100')
  const [operation, setOperation] = useState('add')
  const [result, setResult] = useState('')

  const calculate = () => {
    const num1 = parseInt(input1, 2)
    const num2 = parseInt(input2, 2)
    let res = 0
    
    switch (operation) {
      case 'add':
        res = num1 + num2
        break
      case 'subtract':
        res = num1 - num2
        break
      case 'multiply':
        res = num1 * num2
        break
      case 'divide':
        res = Math.floor(num1 / num2)
        break
      case 'and':
        res = num1 & num2
        break
      case 'or':
        res = num1 | num2
        break
      case 'xor':
        res = num1 ^ num2
        break
      default:
        res = 0
    }
    
    setResult(res.toString(2))
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
                <option value="and">AND (&)</option>
                <option value="or">OR (|)</option>
                <option value="xor">XOR (^)</option>
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

      <div className="mt-8 bg-white rounded-xl shadow-md p-4 sm:p-6 border-2 border-purple-200">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Binary Number System</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-3">Basic Concepts</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div>
                <strong>Binary System:</strong> Base-2 number system using only 0s and 1s
              </div>
              <div>
                <strong>Bit:</strong> Single binary digit (0 or 1)
              </div>
              <div>
                <strong>Byte:</strong> 8 bits (e.g., 10101010)
              </div>
              <div>
                <strong>Conversion:</strong> Each position represents a power of 2
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-3">Arithmetic Operations</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div><strong>Addition:</strong> 0+0=0, 0+1=1, 1+0=1, 1+1=10</div>
              <div><strong>Subtraction:</strong> 0-0=0, 1-0=1, 1-1=0, 10-1=1</div>
              <div><strong>Multiplication:</strong> 0×0=0, 0×1=0, 1×0=0, 1×1=1</div>
              <div><strong>Division:</strong> Similar to decimal division</div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-3">Bitwise Operations</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div><strong>AND (&):</strong> 1 if both bits are 1, else 0</div>
              <div><strong>OR (|):</strong> 1 if either bit is 1, else 0</div>
              <div><strong>XOR (^):</strong> 1 if bits differ, else 0</div>
              <div><strong>NOT (~):</strong> Inverts all bits</div>
            </div>
          </div>

          <div>
            <h3 className="text-md font-semibold text-gray-700 mb-3">Examples</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div><strong>1010 + 1100 = 10110</strong> (10 + 12 = 22)</div>
              <div><strong>1010 & 1100 = 1000</strong> (10 AND 12 = 8)</div>
              <div><strong>1010 | 1100 = 1110</strong> (10 OR 12 = 14)</div>
              <div><strong>1010 ^ 1100 = 0110</strong> (10 XOR 12 = 6)</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
