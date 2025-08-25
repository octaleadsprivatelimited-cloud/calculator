'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Hash, Clock } from 'lucide-react'

interface ConversionResult {
  arabic: number
  roman: string
  isValid: boolean
}

const ROMAN_VALUES = [
  { value: 1000, numeral: 'M' },
  { value: 900, numeral: 'CM' },
  { value: 500, numeral: 'D' },
  { value: 400, numeral: 'CD' },
  { value: 100, numeral: 'C' },
  { value: 90, numeral: 'XC' },
  { value: 50, numeral: 'L' },
  { value: 40, numeral: 'XL' },
  { value: 10, numeral: 'X' },
  { value: 9, numeral: 'IX' },
  { value: 5, numeral: 'V' },
  { value: 4, numeral: 'IV' },
  { value: 1, numeral: 'I' }
]

const COMMON_ROMAN_NUMERALS = [
  { arabic: 1, roman: 'I' },
  { arabic: 5, roman: 'V' },
  { arabic: 10, roman: 'X' },
  { arabic: 50, roman: 'L' },
  { arabic: 100, roman: 'C' },
  { arabic: 500, roman: 'D' },
  { arabic: 1000, roman: 'M' },
  { arabic: 2024, roman: 'MMXXIV' },
  { arabic: 1999, roman: 'MCMXCIX' },
  { arabic: 1984, roman: 'MCMLXXXIV' },
  { arabic: 1776, roman: 'MDCCLXXVI' },
  { arabic: 1492, roman: 'MCDXCII' }
]

export default function RomanNumeralConverter() {
  const [conversionType, setConversionType] = useState<'arabic' | 'roman'>('arabic')
  const [inputValue, setInputValue] = useState('')
  const [showResults, setShowResults] = useState(false)

  const arabicToRoman = useCallback((num: number): string => {
    if (num <= 0 || num > 3999) return 'Invalid'
    
    let result = ''
    let remaining = num
    
    for (const { value, numeral } of ROMAN_VALUES) {
      while (remaining >= value) {
        result += numeral
        remaining -= value
      }
    }
    
    return result
  }, [])

  const romanToArabic = useCallback((roman: string): number => {
    const romanUpper = roman.toUpperCase()
    let result = 0
    let i = 0
    
    while (i < romanUpper.length) {
      const current = romanUpper[i]
      const next = romanUpper[i + 1]
      
      let value = 0
      let skipNext = false
      
      if (current === 'I' && next === 'V') {
        value = 4
        skipNext = true
      } else if (current === 'I' && next === 'X') {
        value = 9
        skipNext = true
      } else if (current === 'X' && next === 'L') {
        value = 40
        skipNext = true
      } else if (current === 'X' && next === 'C') {
        value = 90
        skipNext = true
      } else if (current === 'C' && next === 'D') {
        value = 400
        skipNext = true
      } else if (current === 'C' && next === 'M') {
        value = 900
        skipNext = true
      } else {
        switch (current) {
          case 'I': value = 1; break
          case 'V': value = 5; break
          case 'X': value = 10; break
          case 'L': value = 50; break
          case 'C': value = 100; break
          case 'D': value = 500; break
          case 'M': value = 1000; break
          default: return -1
        }
      }
      
      result += value
      i += skipNext ? 2 : 1
    }
    
    return result
  }, [])

  const validateRoman = useCallback((roman: string): boolean => {
    const romanUpper = roman.toUpperCase()
    
    // Check for invalid characters
    if (!/^[IVXLCDM]+$/i.test(romanUpper)) return false
    
    // Check for invalid sequences
    const invalidSequences = ['IIII', 'VVVV', 'XXXX', 'LLLL', 'CCCC', 'DDDD', 'MMMM']
    for (const seq of invalidSequences) {
      if (romanUpper.includes(seq)) return false
    }
    
    // Check for invalid combinations
    const invalidCombos = ['VX', 'LC', 'DM']
    for (const combo of invalidCombos) {
      if (romanUpper.includes(combo)) return false
    }
    
    return true
  }, [])

  const handleCalculate = () => {
    if (!inputValue.trim()) return
    
    if (conversionType === 'arabic') {
      const num = parseInt(inputValue)
      if (isNaN(num) || num <= 0 || num > 3999) return
      setShowResults(true)
    } else {
      if (!validateRoman(inputValue)) return
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setInputValue('')
    setShowResults(false)
  }

  const handleCommonNumeral = (item: { arabic: number, roman: string }) => {
    if (conversionType === 'arabic') {
      setInputValue(item.arabic.toString())
    } else {
      setInputValue(item.roman)
    }
    setShowResults(true)
  }

  const getResult = (): ConversionResult => {
    if (conversionType === 'arabic') {
      const num = parseInt(inputValue)
      return {
        arabic: num,
        roman: arabicToRoman(num),
        isValid: true
      }
    } else {
      const arabic = romanToArabic(inputValue)
      return {
        arabic,
        roman: inputValue.toUpperCase(),
        isValid: arabic > 0
      }
    }
  }

  const downloadResults = () => {
    const result = getResult()
    
    const data = `Roman Numeral Converter Results

${conversionType === 'arabic' ? 'Arabic to Roman' : 'Roman to Arabic'}
Input: ${inputValue}
${conversionType === 'arabic' ? `Roman: ${result.roman}` : `Arabic: ${result.arabic}`}

Conversion Details:
- Input Value: ${inputValue}
- ${conversionType === 'arabic' ? 'Roman Numeral' : 'Arabic Number'}: ${conversionType === 'arabic' ? result.roman : result.arabic}
- Valid: ${result.isValid ? 'Yes' : 'No'}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'roman-numeral-converter-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = getResult()
      
      navigator.share({
        title: 'Roman Numeral Converter Results',
        text: `${inputValue} = ${conversionType === 'arabic' ? result.roman : result.arabic}`,
        url: window.location.href
      })
    } else {
      const result = getResult()
      const text = `${inputValue} = ${conversionType === 'arabic' ? result.roman : result.arabic}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? getResult() : { arabic: 0, roman: '', isValid: false }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Roman Numeral Converter</h1>
            <p className="text-amber-100 text-lg">
              Convert between Arabic numbers and Roman numerals. 
              Perfect for historical research, clock faces, and educational purposes.
            </p>
          </div>
          <div className="hidden md:block">
            <Hash className="w-16 h-16 text-amber-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Conversion Type Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Conversion Type</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'arabic', label: 'Arabic to Roman', icon: Hash },
              { key: 'roman', label: 'Roman to Arabic', icon: Clock }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setConversionType(key as any)}
                className={`p-4 rounded-lg font-medium transition-colors text-center ${
                  conversionType === key
                    ? 'bg-amber-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                <Icon className="w-8 h-8 mx-auto mb-2" />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Input */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {conversionType === 'arabic' ? 'Arabic Number' : 'Roman Numeral'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {conversionType === 'arabic' ? 'Enter Number (1-3999)' : 'Enter Roman Numeral'}
                  </label>
                  <input
                    type={conversionType === 'arabic' ? 'number' : 'text'}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 text-lg"
                    placeholder={conversionType === 'arabic' ? '2024' : 'MMXXIV'}
                    min={conversionType === 'arabic' ? '1' : undefined}
                    max={conversionType === 'arabic' ? '3999' : undefined}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {conversionType === 'arabic' 
                      ? 'Enter a number between 1 and 3999'
                      : 'Use letters: I, V, X, L, C, D, M'
                    }
                  </p>
                </div>
                
                {/* Calculate Button */}
                <div className="text-center">
                  <button
                    onClick={handleCalculate}
                    disabled={!inputValue.trim()}
                    className={`font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2 ${
                      !inputValue.trim()
                        ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                        : 'bg-amber-600 hover:bg-amber-700 text-white'
                    }`}
                  >
                    <Calculator className="w-5 h-5" />
                    <span>Convert</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Common Numerals */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Common Numerals</h3>
            <div className="grid grid-cols-2 gap-2">
              {COMMON_ROMAN_NUMERALS.map((item, index) => (
                <button
                  key={index}
                  onClick={() => handleCommonNumeral(item)}
                  className="text-left p-2 bg-white rounded border hover:bg-amber-50 transition-colors text-sm"
                >
                  <div className="font-medium text-gray-800">{item.arabic}</div>
                  <div className="text-gray-600 font-mono">{item.roman}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Conversion Result */}
            <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
              <h3 className="text-lg font-semibold text-amber-800 mb-4">Conversion Result</h3>
              <div className="text-center">
                <div className="text-4xl font-bold text-amber-700 mb-2">
                  {inputValue} = {conversionType === 'arabic' ? result.roman : result.arabic}
                </div>
                <div className="text-lg text-gray-600">
                  {conversionType === 'arabic' ? 'Roman Numeral' : 'Arabic Number'}
                </div>
                {!result.isValid && (
                  <div className="text-red-600 text-sm mt-2">Invalid input</div>
                )}
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

        {/* Comprehensive Description Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-amber-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About Roman Numerals</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Historical Background</h3>
              <p className="text-gray-700 mb-3">
                Roman numerals originated in ancient Rome around 1000 BCE and were the primary number system 
                used throughout the Roman Empire. This system uses letters from the Latin alphabet to represent 
                numerical values, creating a unique and elegant way to express numbers that has endured for millennia.
              </p>
              <p className="text-gray-700">
                Despite the widespread adoption of Arabic numerals (0-9) in modern mathematics, Roman numerals 
                continue to be used in specific contexts where tradition, aesthetics, or specific formatting requirements prevail.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Basic Roman Numeral Symbols</h3>
              <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p><strong>I = 1</strong></p>
                    <p><strong>V = 5</strong></p>
                    <p><strong>X = 10</strong></p>
                  </div>
                  <div>
                    <p><strong>L = 50</strong></p>
                    <p><strong>C = 100</strong></p>
                    <p><strong>D = 500</strong></p>
                  </div>
                  <div>
                    <p><strong>M = 1,000</strong></p>
                    <p><strong>ↁ = 5,000</strong></p>
                    <p><strong>ↂ = 10,000</strong></p>
                  </div>
                  <div>
                    <p><strong>ↇ = 50,000</strong></p>
                    <p><strong>ↈ = 100,000</strong></p>
                    <p><strong>∞ = 1,000,000</strong></p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Roman Numeral Rules</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Addition Rule</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>When a smaller numeral follows a larger one, add them</li>
                    <li>VI = 5 + 1 = 6</li>
                    <li>XV = 10 + 5 = 15</li>
                    <li>LXX = 50 + 10 + 10 = 70</li>
                    <li>CC = 100 + 100 = 200</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Subtraction Rule</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>When a smaller numeral precedes a larger one, subtract</li>
                    <li>IV = 5 - 1 = 4</li>
                    <li>IX = 10 - 1 = 9</li>
                    <li>XL = 50 - 10 = 40</li>
                    <li>CM = 1000 - 100 = 900</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Modern Usage & Applications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Traditional Uses</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Clock faces and watch dials</li>
                    <li>Book chapters and sections</li>
                    <li>Movie and TV show credits</li>
                    <li>Monument inscriptions</li>
                    <li>Academic paper numbering</li>
                    <li>Legal document sections</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Contemporary Applications</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Software version numbering</li>
                    <li>Sporting event numbering</li>
                    <li>Monarch and pope numbering</li>
                    <li>Chemical element groups</li>
                    <li>Musical chord notation</li>
                    <li>Design and typography</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Conversion Process</h3>
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-800 mb-2">Arabic to Roman Conversion</h4>
                <ol className="list-decimal list-inside text-gray-700 space-y-2 text-sm">
                  <li>Start with the largest Roman numeral value</li>
                  <li>Divide the Arabic number by the Roman value</li>
                  <li>Write the Roman numeral that many times</li>
                  <li>Subtract the value from the Arabic number</li>
                  <li>Repeat with the next largest Roman numeral</li>
                  <li>Continue until the Arabic number is zero</li>
                </ol>
                <div className="mt-3 p-3 bg-amber-100 rounded border border-amber-300">
                  <p className="text-sm"><strong>Example:</strong> 1984 = 1000 + 900 + 80 + 4 = M + CM + LXXX + IV = MCMLXXXIV</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Special Cases & Exceptions</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Zero:</strong> Roman numerals have no symbol for zero - it was represented by the absence of symbols</li>
                <li><strong>Large Numbers:</strong> Very large numbers used special symbols and overlines for multiplication by 1000</li>
                <li><strong>Fractions:</strong> Roman numerals could represent fractions using specific symbols</li>
                <li><strong>Clock Faces:</strong> Traditional clocks often use IIII instead of IV for aesthetic balance</li>
                <li><strong>Year Limitations:</strong> Standard Roman numerals are limited to 1-3,999, though extensions exist</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Educational Value</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Mathematical Skills</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Understanding place value</li>
                    <li>Addition and subtraction logic</li>
                    <li>Pattern recognition</li>
                    <li>Historical number systems</li>
                    <li>Cultural mathematics</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Cultural Knowledge</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Ancient Roman history</li>
                    <li>Classical civilization</li>
                    <li>Historical mathematics</li>
                    <li>Cultural traditions</li>
                    <li>Artistic applications</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Common Mistakes to Avoid</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Invalid Combinations:</strong> Using more than three of the same numeral in sequence</li>
                <li><strong>Incorrect Subtraction:</strong> Only I, X, and C can be used for subtraction</li>
                <li><strong>Order Errors:</strong> Placing larger numerals before smaller ones incorrectly</li>
                <li><strong>Missing Symbols:</strong> Forgetting to include all necessary numerals</li>
                <li><strong>Case Sensitivity:</strong> Roman numerals are traditionally uppercase</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-semibold text-gray-800 mb-2">Pro Tips</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Remember the key rule: I can only subtract from V and X, X can only subtract from L and C</li>
                <li>• For years, break them down into thousands, hundreds, tens, and ones</li>
                <li>• Use the converter to verify your manual conversions</li>
                <li>• Practice with common years and dates to build familiarity</li>
                <li>• Roman numerals are read from left to right, largest to smallest</li>
                <li>• When in doubt, use the addition rule rather than subtraction</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
