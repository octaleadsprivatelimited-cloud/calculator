'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Key, Copy, RefreshCw } from 'lucide-react'

interface PasswordResult {
  password: string
  strength: string
  strengthScore: number
  entropy: number
  timeToCrack: string
  recommendations: string[]
}

interface PasswordPreset {
  name: string
  length: number
  useUppercase: boolean
  useLowercase: boolean
  useNumbers: boolean
  useSymbols: boolean
  description: string
}

const PASSWORD_PRESETS: PasswordPreset[] = [
  { name: 'Basic', length: 8, useUppercase: true, useLowercase: true, useNumbers: true, useSymbols: false, description: 'Simple passwords' },
  { name: 'Strong', length: 12, useUppercase: true, useLowercase: true, useNumbers: true, useSymbols: true, description: 'Secure passwords' },
  { name: 'Very Strong', length: 16, useUppercase: true, useLowercase: true, useNumbers: true, useSymbols: true, description: 'Highly secure' },
  { name: 'PIN', length: 6, useUppercase: false, useLowercase: false, useNumbers: true, useSymbols: false, description: 'Numeric only' },
  { name: 'Passphrase', length: 20, useUppercase: true, useLowercase: true, useNumbers: false, useSymbols: false, description: 'Word-based' }
]

const STRENGTH_LEVELS = [
  { name: 'Very Weak', color: 'text-red-600', bgColor: 'bg-red-100', score: 1, description: 'Easily cracked' },
  { name: 'Weak', color: 'text-orange-600', bgColor: 'bg-orange-100', score: 2, description: 'Vulnerable' },
  { name: 'Fair', color: 'text-yellow-600', bgColor: 'bg-yellow-100', score: 3, description: 'Moderate security' },
  { name: 'Good', color: 'text-blue-600', bgColor: 'bg-blue-100', score: 4, description: 'Secure' },
  { name: 'Strong', color: 'text-green-600', bgColor: 'bg-green-100', score: 5, description: 'Very secure' },
  { name: 'Very Strong', color: 'text-emerald-600', bgColor: 'bg-emerald-100', score: 6, description: 'Excellent security' }
]

export default function PasswordGeneratorCalculator() {
  const [passwordLength, setPasswordLength] = useState(12)
  const [useUppercase, setUseUppercase] = useState(true)
  const [useLowercase, setUseLowercase] = useState(true)
  const [useNumbers, setUseNumbers] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [excludeSimilar, setExcludeSimilar] = useState(false)
  const [excludeAmbiguous, setExcludeAmbiguous] = useState(false)
  const [generatedPassword, setGeneratedPassword] = useState('')
  const [showResults, setShowResults] = useState(false)

  const generatePassword = useCallback((): string => {
    let charset = ''
    if (useUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    if (useLowercase) charset += 'abcdefghijklmnopqrstuvwxyz'
    if (useNumbers) charset += '0123456789'
    if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?'
    
    if (excludeSimilar) {
      charset = charset.replace(/[0O1lI]/g, '')
    }
    if (excludeAmbiguous) {
      charset = charset.replace(/[{}[\]()/\\\'"`~,;:.<>]/g, '')
    }
    
    if (charset.length === 0) return ''
    
    let password = ''
    for (let i = 0; i < passwordLength; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length))
    }
    
    return password
  }, [passwordLength, useUppercase, useLowercase, useNumbers, useSymbols, excludeSimilar, excludeAmbiguous])

  const calculatePasswordStrength = useCallback((password: string): PasswordResult => {
    let score = 0
    let entropy = 0
    
    // Length score
    if (password.length >= 8) score += 1
    if (password.length >= 12) score += 1
    if (password.length >= 16) score += 1
    
    // Character variety score
    if (/[a-z]/.test(password)) score += 1
    if (/[A-Z]/.test(password)) score += 1
    if (/[0-9]/.test(password)) score += 1
    if (/[^A-Za-z0-9]/.test(password)) score += 1
    
    // Entropy calculation
    let charsetSize = 0
    if (/[a-z]/.test(password)) charsetSize += 26
    if (/[A-Z]/.test(password)) charsetSize += 26
    if (/[0-9]/.test(password)) charsetSize += 10
    if (/[^A-Za-z0-9]/.test(password)) charsetSize += 32
    
    entropy = password.length * Math.log2(charsetSize)
    
    // Strength assessment
    let strength = ''
    let strengthScore = 0
    let timeToCrack = ''
    
    if (score <= 2) {
      strength = 'Very Weak'
      strengthScore = 1
      timeToCrack = 'Instantly'
    } else if (score <= 3) {
      strength = 'Weak'
      strengthScore = 2
      timeToCrack = 'Minutes'
    } else if (score <= 4) {
      strength = 'Fair'
      strengthScore = 3
      timeToCrack = 'Hours'
    } else if (score <= 5) {
      strength = 'Good'
      strengthScore = 4
      timeToCrack = 'Days'
    } else if (score <= 6) {
      strength = 'Strong'
      strengthScore = 5
      timeToCrack = 'Years'
    } else {
      strength = 'Very Strong'
      strengthScore = 6
      timeToCrack = 'Centuries'
    }
    
    // Recommendations
    const recommendations: string[] = []
    if (password.length < 12) recommendations.push('Increase password length to at least 12 characters')
    if (!useUppercase) recommendations.push('Include uppercase letters')
    if (!useLowercase) recommendations.push('Include lowercase letters')
    if (!useNumbers) recommendations.push('Include numbers')
    if (!useSymbols) recommendations.push('Include special characters')
    if (score <= 3) recommendations.push('Consider using a passphrase instead')
    
    return {
      password,
      strength,
      strengthScore,
      entropy,
      timeToCrack,
      recommendations
    }
  }, [useUppercase, useLowercase, useNumbers, useSymbols])

  const handleGenerate = () => {
    const password = generatePassword()
    if (password) {
      setGeneratedPassword(password)
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setPasswordLength(12)
    setUseUppercase(true)
    setUseLowercase(true)
    setUseNumbers(true)
    setUseSymbols(true)
    setExcludeSimilar(false)
    setExcludeAmbiguous(false)
    setGeneratedPassword('')
    setShowResults(false)
  }

  const handleQuickPreset = (preset: PasswordPreset) => {
    setPasswordLength(preset.length)
    setUseUppercase(preset.useUppercase)
    setUseLowercase(preset.useLowercase)
    setUseNumbers(preset.useNumbers)
    setUseSymbols(preset.useSymbols)
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPassword)
    alert('Password copied to clipboard!')
  }

  const formatNumber = (num: number, decimals: number = 2) => {
    if (isNaN(num) || !isFinite(num)) return '0.00'
    return num.toFixed(decimals)
  }

  const downloadResults = () => {
    const result = calculatePasswordStrength(generatedPassword)
    
    const data = `Password Generator Results

Generated Password: ${result.password}

Password Settings:
- Length: ${passwordLength} characters
- Uppercase: ${useUppercase ? 'Yes' : 'No'}
- Lowercase: ${useLowercase ? 'Yes' : 'No'}
- Numbers: ${useNumbers ? 'Yes' : 'No'}
- Symbols: ${useSymbols ? 'Yes' : 'No'}
- Exclude Similar: ${excludeSimilar ? 'Yes' : 'No'}
- Exclude Ambiguous: ${excludeAmbiguous ? 'Yes' : 'No'}

Strength Analysis:
- Strength: ${result.strength}
- Score: ${result.strengthScore}/6
- Entropy: ${result.entropy.toFixed(2)} bits
- Time to Crack: ${result.timeToCrack}

Recommendations:
${result.recommendations.map(rec => `- ${rec}`).join('\n')}

Security Tips:
- Use unique passwords for each account
- Consider a password manager
- Enable two-factor authentication
- Regularly update passwords`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'password-generator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculatePasswordStrength(generatedPassword)
      
      navigator.share({
        title: 'Password Generator Results',
        text: `Password: ${result.password}, Strength: ${result.strength}`,
        url: window.location.href
      })
    } else {
      copyToClipboard()
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculatePasswordStrength(generatedPassword) : { password: '', strength: '', strengthScore: 0, entropy: 0, timeToCrack: '', recommendations: [] }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Password Generator Calculator</h1>
            <p className="text-purple-100 text-lg">
              Generate secure, random passwords with customizable options. Includes strength 
              analysis and security recommendations for better password management.
            </p>
          </div>
          <div className="hidden md:block">
            <Key className="w-16 h-16 text-purple-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Quick Presets */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Password Presets</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {PASSWORD_PRESETS.map((preset, index) => (
              <button
                key={index}
                onClick={() => handleQuickPreset(preset)}
                className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg border border-purple-200 transition-colors text-left"
              >
                <div className="font-semibold text-purple-800">{preset.name}</div>
                <div className="text-sm text-purple-600">{preset.length} characters</div>
                <div className="text-xs text-purple-500">{preset.description}</div>
                <div className="text-xs text-purple-400 mt-1">
                  {preset.useUppercase ? 'ABC ' : ''}
                  {preset.useLowercase ? 'abc ' : ''}
                  {preset.useNumbers ? '123 ' : ''}
                  {preset.useSymbols ? '!@#' : ''}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Password Settings */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Basic Settings */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Password Settings</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password Length: {passwordLength} characters
              </label>
              <input
                type="range"
                min="4"
                max="64"
                value={passwordLength}
                onChange={(e) => setPasswordLength(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                aria-label="Password length slider"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>4</span>
                <span>16</span>
                <span>32</span>
                <span>64</span>
              </div>
            </div>
            
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={useUppercase}
                  onChange={(e) => setUseUppercase(e.target.checked)}
                  className="mr-2"
                  aria-label="Include uppercase letters"
                />
                <span className="text-sm text-gray-700">Include Uppercase Letters (A-Z)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={useLowercase}
                  onChange={(e) => setUseLowercase(e.target.checked)}
                  className="mr-2"
                  aria-label="Include lowercase letters"
                />
                <span className="text-sm text-gray-700">Include Lowercase Letters (a-z)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={useNumbers}
                  onChange={(e) => setUseNumbers(e.target.checked)}
                  className="mr-2"
                  aria-label="Include numbers"
                />
                <span className="text-sm text-gray-700">Include Numbers (0-9)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={useSymbols}
                  onChange={(e) => setUseSymbols(e.target.checked)}
                  className="mr-2"
                  aria-label="Include special symbols"
                />
                <span className="text-sm text-gray-700">Include Symbols (!@#$%^&*)</span>
              </label>
            </div>
          </div>

          {/* Advanced Options */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">Advanced Options</h3>
            <div className="space-y-3">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={excludeSimilar}
                  onChange={(e) => setExcludeSimilar(e.target.checked)}
                  className="mr-2"
                  aria-label="Exclude similar characters"
                />
                <span className="text-sm text-gray-700">Exclude Similar Characters (0, O, 1, l, I)</span>
              </label>
              
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={excludeAmbiguous}
                  onChange={(e) => setExcludeAmbiguous(e.target.checked)}
                  className="mr-2"
                  aria-label="Exclude ambiguous characters"
                />
                <span className="text-sm text-gray-700">Exclude Ambiguous Characters (&#123; &#125; &#91; &#93; &#40; &#41; / \ &apos; &quot; ` ~ , ; : . &lt; &gt;)</span>
              </label>
            </div>
            
            <div className="bg-purple-50 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-800 mb-2">Current Settings</h4>
              <div className="text-sm text-purple-700 space-y-1">
                <div>Length: {passwordLength} characters</div>
                <div>Character set size: {
                  (useUppercase ? 26 : 0) + 
                  (useLowercase ? 26 : 0) + 
                  (useNumbers ? 10 : 0) + 
                  (useSymbols ? 32 : 0)
                } characters</div>
                <div>Possible combinations: {
                  Math.pow(
                    (useUppercase ? 26 : 0) + 
                    (useLowercase ? 26 : 0) + 
                    (useNumbers ? 10 : 0) + 
                    (useSymbols ? 32 : 0),
                    passwordLength
                  ).toExponential(2)
                }</div>
              </div>
            </div>
          </div>
        </div>

        {/* Generate Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleGenerate}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Generate Password</span>
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Generated Password */}
            <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
              <h3 className="text-lg font-semibold text-purple-800 mb-4">Generated Password</h3>
              <div className="bg-white p-4 rounded-lg border border-purple-300 mb-4">
                <div className="text-2xl font-mono text-center break-all">{result.password}</div>
              </div>
              <div className="flex justify-center space-x-4">
                <button
                  onClick={copyToClipboard}
                  className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Password</span>
                </button>
                <button
                  onClick={handleGenerate}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Generate New</span>
                </button>
              </div>
            </div>

            {/* Strength Analysis */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Password Strength Analysis</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Strength Rating</h4>
                  <div className={`text-lg font-semibold p-3 rounded-lg ${STRENGTH_LEVELS.find(s => s.name === result.strength)?.bgColor}`}>
                    <span className={STRENGTH_LEVELS.find(s => s.name === result.strength)?.color}>
                      {result.strength}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {STRENGTH_LEVELS.find(s => s.name === result.strength)?.description}
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-gray-800 mb-3">Security Metrics</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Strength Score:</span>
                      <span className="font-semibold text-purple-700">{result.strengthScore}/6</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Entropy:</span>
                      <span className="font-semibold text-blue-700">{result.entropy.toFixed(2)} bits</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Time to Crack:</span>
                      <span className="font-semibold text-green-700">{result.timeToCrack}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Security Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-2 h-2 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span className="text-sm text-gray-700">{rec}</span>
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
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Password Generator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our advanced password generator creates cryptographically secure, random passwords tailored to your 
              specific security requirements. Whether you need passwords for online accounts, applications, or 
              system access, this tool provides strong, unique passwords with comprehensive security analysis.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Generates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Random Passwords:</strong> Cryptographically secure random generation</li>
              <li><strong>Customizable Length:</strong> Adjustable password length (8-128 characters)</li>
              <li><strong>Character Sets:</strong> Uppercase, lowercase, numbers, and symbols</li>
              <li><strong>Strength Analysis:</strong> Comprehensive security assessment</li>
              <li><strong>Entropy Calculation:</strong> Mathematical measure of randomness</li>
              <li><strong>Security Recommendations:</strong> Expert advice for improvement</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Password Strength Levels</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Strong Passwords</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Very Weak: Easily guessable</li>
                  <li>Weak: Basic dictionary attacks</li>
                  <li>Fair: Some resistance to attacks</li>
                  <li>Good: Strong against common attacks</li>
                  <li>Strong: Excellent security</li>
                  <li>Very Strong: Maximum security</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Security Features</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Cryptographic randomness</li>
                  <li>Character variety</li>
                  <li>Length optimization</li>
                  <li>Pattern avoidance</li>
                  <li>Entropy maximization</li>
                  <li>Strength validation</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Strength Score</h5>
                <p className="text-purple-700 text-sm">1-6 rating system</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Entropy</h5>
                <p className="text-blue-700 text-sm">Randomness measure in bits</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Time to Crack</h5>
                <p className="text-green-700 text-sm">Estimated cracking time</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Select your desired password length, choose which character types to include, and click generate. 
              The tool will create a secure password and provide detailed analysis of its strength and security 
              characteristics.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Password Security Best Practices</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Unique Passwords:</strong> Never reuse passwords across accounts</li>
              <li><strong>Minimum Length:</strong> Aim for at least 12 characters</li>
              <li><strong>Character Variety:</strong> Include uppercase, lowercase, numbers, and symbols</li>
              <li><strong>Avoid Patterns:</strong> Don't use sequential characters or common words</li>
              <li><strong>Regular Updates:</strong> Change passwords periodically</li>
              <li><strong>Password Manager:</strong> Use a secure password manager for storage</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Entropy and Security</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <p className="text-gray-700 text-sm mb-3">
                <strong>What is Entropy?</strong> Entropy measures the randomness and unpredictability of a password. 
                Higher entropy means the password is harder to guess or crack.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Low Entropy (0-32 bits):</strong> Easily crackable</p>
                  <p><strong>Medium Entropy (32-64 bits):</strong> Moderate security</p>
                  <p><strong>High Entropy (64+ bits):</strong> Very secure</p>
                </div>
                <div>
                  <p><strong>Calculation Factors:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Character set size</li>
                    <li>Password length</li>
                    <li>Randomness quality</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Password Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Personal Information:</strong> Names, birthdays, addresses</li>
              <li><strong>Common Words:</strong> Dictionary words or phrases</li>
              <li><strong>Sequential Characters:</strong> 12345, qwerty, abcdef</li>
              <li><strong>Short Lengths:</strong> Passwords under 8 characters</li>
              <li><strong>Pattern Repetition:</strong> Repeated character sequences</li>
              <li><strong>Predictable Substitutions:</strong> Using @ for 'a', 3 for 'e'</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-purple-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Consider using passphrases instead of passwords for better memorability and security. A passphrase 
                like "correct horse battery staple" is much stronger than a complex but short password. Combine 
                this with a password manager for the best of both worlds: strong security and easy access.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
