'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Moon, Clock, Bed } from 'lucide-react'

interface SleepResult {
  wakeUpTime: string
  bedtimes: string[]
  sleepCycles: number
  totalSleepHours: number
  sleepQuality: string
}

interface SleepCycle {
  time: string
  quality: string
  description: string
}

const SLEEP_CYCLES = [
  { time: '6:00 AM', quality: 'Excellent', description: 'Complete sleep cycles, well-rested' },
  { time: '5:30 AM', quality: 'Very Good', description: 'Mostly complete cycles' },
  { time: '5:00 AM', quality: 'Good', description: 'Good amount of sleep' },
  { time: '4:30 AM', quality: 'Fair', description: 'Somewhat rested' },
  { time: '4:00 AM', quality: 'Poor', description: 'Incomplete cycles, tired' },
  { time: '3:30 AM', quality: 'Very Poor', description: 'Very tired, groggy' }
]

const SLEEP_TIPS = [
  'Avoid caffeine 6 hours before bedtime',
  'Keep your bedroom cool and dark',
  'Establish a consistent sleep schedule',
  'Avoid screens 1 hour before bed',
  'Exercise regularly, but not close to bedtime',
  'Create a relaxing bedtime routine',
  'Avoid large meals before sleep',
  'Consider using white noise or earplugs'
]

export default function SleepCalculator() {
  const [calculationType, setCalculationType] = useState<'wakeup' | 'bedtime'>('wakeup')
  const [targetTime, setTargetTime] = useState('')
  const [sleepHours, setSleepHours] = useState('7.5')
  const [showResults, setShowResults] = useState(false)

  const calculateSleep = useCallback((): SleepResult => {
    if (!targetTime) return {
      wakeUpTime: '',
      bedtimes: [],
      sleepCycles: 0,
      totalSleepHours: 0,
      sleepQuality: ''
    }

    const targetDate = new Date(`2000-01-01T${targetTime}`)
    const sleepHoursNum = parseFloat(sleepHours) || 7.5
    
    let wakeUpTime = ''
    let bedtimes: string[] = []
    
    if (calculationType === 'wakeup') {
      // Calculate bedtimes based on wake-up time
      wakeUpTime = targetTime
      const wakeUpDate = new Date(`2000-01-01T${targetTime}`)
      
      // Calculate multiple bedtime options (15-30 min intervals)
      for (let i = 0; i < 6; i++) {
        const bedtime = new Date(wakeUpDate.getTime() - (sleepHoursNum * 60 * 60 * 1000) - (i * 15 * 60 * 1000))
        bedtimes.push(bedtime.toTimeString().slice(0, 5))
      }
    } else {
      // Calculate wake-up times based on bedtime
      const bedtimeDate = new Date(`2000-01-01T${targetTime}`)
      wakeUpTime = new Date(bedtimeDate.getTime() + (sleepHoursNum * 60 * 60 * 1000)).toTimeString().slice(0, 5)
      
      // Calculate multiple wake-up time options
      for (let i = 0; i < 6; i++) {
        const wakeUp = new Date(bedtimeDate.getTime() + (sleepHoursNum * 60 * 60 * 1000) + (i * 15 * 60 * 1000))
        bedtimes.push(wakeUp.toTimeString().slice(0, 5))
      }
    }

    const sleepCycles = Math.round(sleepHoursNum * 2) // Approximate 90-minute cycles
    const totalSleepHours = sleepHoursNum
    
    let sleepQuality = 'Good'
    if (sleepHoursNum >= 8) sleepQuality = 'Excellent'
    else if (sleepHoursNum >= 7) sleepQuality = 'Good'
    else if (sleepHoursNum >= 6) sleepQuality = 'Fair'
    else sleepQuality = 'Poor'

    return {
      wakeUpTime,
      bedtimes,
      sleepCycles,
      totalSleepHours,
      sleepQuality
    }
  }, [calculationType, targetTime, sleepHours])

  const handleCalculate = () => {
    if (targetTime) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setTargetTime('')
    setSleepHours('7.5')
    setShowResults(false)
  }

  const handleQuickSleep = (hours: string) => {
    setSleepHours(hours)
    setShowResults(true)
  }

  const formatTime = (time: string) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour
    return `${displayHour}:${minutes} ${ampm}`
  }

  const downloadResults = () => {
    const result = calculateSleep()
    
    const data = `Sleep Calculator Results

Calculation Type: ${calculationType === 'wakeup' ? 'Wake-up Time to Bedtime' : 'Bedtime to Wake-up Time'}
${calculationType === 'wakeup' ? 'Wake-up Time' : 'Bedtime'}: ${targetTime}
Sleep Duration: ${sleepHours} hours

Results:
- ${calculationType === 'wakeup' ? 'Bedtime Options' : 'Wake-up Time Options'}: ${result.bedtimes.join(', ')}
- Sleep Cycles: ${result.sleepCycles}
- Total Sleep: ${result.totalSleepHours} hours
- Sleep Quality: ${result.sleepQuality}

Sleep Tips:
${SLEEP_TIPS.join('\n')}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'sleep-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = calculateSleep()
      
      navigator.share({
        title: 'Sleep Calculator Results',
        text: `Sleep duration: ${sleepHours} hours, Quality: ${result.sleepQuality}`,
        url: window.location.href
      })
    } else {
      const text = `Sleep Calculator: ${sleepHours} hours of sleep`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? calculateSleep() : { wakeUpTime: '', bedtimes: [], sleepCycles: 0, totalSleepHours: 0, sleepQuality: '' }

  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Sleep Calculator</h1>
            <p className="text-indigo-100 text-lg">
              Calculate optimal sleep times and wake-up times based on sleep cycles. 
              Perfect for better sleep quality and morning energy.
            </p>
          </div>
          <div className="hidden md:block">
            <Moon className="w-16 h-16 text-indigo-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Calculation Type Selection */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">What would you like to calculate?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'wakeup', label: 'Wake-up Time to Bedtime', icon: Clock },
              { key: 'bedtime', label: 'Bedtime to Wake-up Time', icon: Bed }
            ].map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setCalculationType(key as any)}
                className={`p-4 rounded-lg font-medium transition-colors text-center ${
                  calculationType === key
                    ? 'bg-indigo-600 text-white'
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
          {/* Time Input */}
          <div className="space-y-6">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {calculationType === 'wakeup' ? 'Wake-up Time' : 'Bedtime'}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {calculationType === 'wakeup' ? 'When do you want to wake up?' : 'When do you want to go to bed?'}
                  </label>
                  <input
                    type="time"
                    value={targetTime}
                    onChange={(e) => setTargetTime(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 text-lg"
                    aria-label={`Select ${calculationType === 'wakeup' ? 'wake-up' : 'bed'} time`}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    How many hours do you want to sleep?
                  </label>
                  <input
                    type="number"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    placeholder="7.5"
                    step="0.5"
                    min="4"
                    max="12"
                  />
                  <p className="text-xs text-gray-500 mt-1">Recommended: 7-9 hours for adults</p>
                </div>
              </div>
            </div>

            {/* Quick Sleep Options */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Sleep Options</h3>
              <div className="grid grid-cols-2 gap-2">
                {['6', '6.5', '7', '7.5', '8', '8.5', '9'].map((hours) => (
                  <button
                    key={hours}
                    onClick={() => handleQuickSleep(hours)}
                    className="p-2 bg-white rounded border hover:bg-indigo-50 transition-colors text-sm"
                  >
                    {hours} hours
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Sleep Information */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Sleep Cycle Information</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Sleep Cycle Duration:</span>
                <span className="font-semibold">90 minutes</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">REM Sleep:</span>
                <span className="font-semibold">20-25% of total</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Deep Sleep:</span>
                <span className="font-semibold">15-20% of total</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Light Sleep:</span>
                <span className="font-semibold">50-60% of total</span>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200">
              <h4 className="font-semibold text-blue-800 mb-2">Why Sleep Cycles Matter</h4>
              <p className="text-blue-700 text-xs">
                Waking up in the middle of a sleep cycle can leave you feeling groggy. 
                The calculator helps you time your sleep to wake up at the end of a complete cycle.
              </p>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            disabled={!targetTime}
            className={`font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2 ${
              !targetTime
                ? 'bg-gray-400 cursor-not-allowed text-gray-600'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Calculator className="w-5 h-5" />
            <span>Calculate Sleep Times</span>
          </button>
        </div>

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Sleep Results */}
            <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
              <h3 className="text-lg font-semibold text-indigo-800 mb-4">Sleep Schedule</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-indigo-700 mb-2">
                    {calculationType === 'wakeup' ? 'Bedtime Options' : 'Wake-up Time Options'}
                  </div>
                  <div className="space-y-2">
                    {result.bedtimes.slice(0, 3).map((time, index) => (
                      <div key={index} className={`p-2 rounded ${
                        index === 0 ? 'bg-indigo-100 text-indigo-800 font-semibold' : 'bg-white'
                      }`}>
                        {formatTime(time)} {index === 0 ? '(Recommended)' : ''}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="text-center space-y-4">
                  <div>
                    <div className="text-2xl font-bold text-indigo-700">{result.sleepCycles}</div>
                    <div className="text-sm text-gray-600">Sleep Cycles</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-indigo-700">{result.totalSleepHours}</div>
                    <div className="text-sm text-gray-600">Total Hours</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold text-indigo-700">{result.sleepQuality}</div>
                    <div className="text-sm text-gray-600">Sleep Quality</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sleep Tips */}
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Sleep Tips for Better Rest</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {SLEEP_TIPS.map((tip, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-sm text-gray-700">{tip}</span>
                  </div>
                ))}
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

        {/* Info Section */}
        <div className="mt-8 bg-gray-50 p-6 rounded-lg">
          <div className="flex items-start space-x-3">
            <Info className="w-6 h-6 text-indigo-600 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">About Sleep Calculator</h4>
              <p className="text-gray-600 text-sm leading-relaxed">
                This calculator helps you optimize your sleep schedule by considering sleep cycles. 
                Each sleep cycle lasts approximately 90 minutes and includes different stages of sleep. 
                Waking up at the end of a complete cycle helps you feel more refreshed and alert. 
                The calculator provides multiple timing options to help you find the best sleep schedule for your needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
