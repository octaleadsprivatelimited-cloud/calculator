'use client'

import React, { useState, useCallback } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Moon, Clock, Bed } from 'lucide-react'
import ResultSharing from '../ResultSharing'

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
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
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
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-6 rounded-lg border border-indigo-200">
              <ResultSharing
                title="Sleep Schedule Calculation Result"
                inputs={[
                  { label: "Calculation Type", value: calculationType === 'wakeup' ? 'Wake-up Time' : 'Bedtime' },
                  { label: "Target Time", value: targetTime },
                  { label: "Sleep Hours", value: `${sleepHours} hours` }
                ]}
                result={{ 
                  label: "Sleep Quality", 
                  value: result.sleepQuality,
                  unit: ""
                }}
                calculatorName="Sleep Calculator"
                className="mb-0"
              />
            </div>

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

        {/* Comprehensive Description Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-indigo-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About Sleep Calculator</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Purpose & Functionality</h3>
              <p className="text-gray-700 mb-3">
                This comprehensive sleep calculator helps you optimize your sleep schedule by aligning your 
                bedtime and wake-up times with natural sleep cycles. Understanding sleep cycles is crucial 
                for achieving restorative sleep and waking up feeling refreshed and alert.
              </p>
              <p className="text-gray-700">
                The calculator provides multiple timing options based on your target time and desired sleep 
                duration, ensuring you wake up at the optimal point in your sleep cycle for maximum energy 
                and mental clarity.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Understanding Sleep Cycles</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Sleep Cycle Structure</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Duration:</strong> Approximately 90 minutes per cycle</li>
                    <li><strong>Stages:</strong> 4-5 stages including REM and non-REM</li>
                    <li><strong>Pattern:</strong> Cycles repeat throughout the night</li>
                    <li><strong>Variation:</strong> Individual differences in cycle length</li>
                    <li><strong>Quality:</strong> Later cycles have more REM sleep</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Sleep Stages</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Stage 1:</strong> Light sleep, easy to wake</li>
                    <li><strong>Stage 2:</strong> Deeper sleep, body temperature drops</li>
                    <li><strong>Stage 3:</strong> Deep sleep, restoration occurs</li>
                    <li><strong>REM:</strong> Dreaming, brain activity, memory consolidation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Optimal Sleep Duration</h3>
              <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-200">
                <h4 className="font-semibold text-gray-800 mb-2">Age-Based Sleep Recommendations</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Adults (18-64):</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Recommended: 7-9 hours</li>
                      <li>Minimum: 6 hours</li>
                      <li>Optimal: 7.5-8.5 hours</li>
                      <li>Cycles: 5-6 complete cycles</li>
                    </ul>
                  </div>
                  <div>
                    <p><strong>Other Age Groups:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Teens: 8-10 hours</li>
                      <li>Seniors: 7-8 hours</li>
                      <li>Children: 9-11 hours</li>
                      <li>Infants: 12-15 hours</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-700 mt-3 text-sm">
                  <strong>Note:</strong> Individual sleep needs vary based on genetics, lifestyle, health, 
                  and recent sleep debt. Listen to your body's signals for optimal sleep duration.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Sleep Cycle Timing</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Why Timing Matters</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Complete Cycles:</strong> Waking mid-cycle causes grogginess</li>
                    <li><strong>REM Sleep:</strong> Essential for memory and learning</li>
                    <li><strong>Deep Sleep:</strong> Critical for physical restoration</li>
                    <li><strong>Circadian Rhythm:</strong> Natural sleep-wake patterns</li>
                    <li><strong>Sleep Inertia:</strong> Reduced when waking at cycle end</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Optimal Wake Times</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Cycle End:</strong> Natural awakening point</li>
                    <li><strong>Light Sleep:</strong> Easier to wake from</li>
                    <li><strong>Energy Levels:</strong> Higher when cycle complete</li>
                    <li><strong>Mental Clarity:</strong> Improved cognitive function</li>
                    <li><strong>Mood:</strong> Better emotional regulation</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Sleep Optimization Strategies</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Consistent Schedule:</strong> Go to bed and wake up at the same time daily</li>
                <li><strong>Sleep Environment:</strong> Cool, dark, quiet bedroom with comfortable bedding</li>
                <li><strong>Pre-Sleep Routine:</strong> Relaxing activities 1-2 hours before bed</li>
                <li><strong>Technology Limits:</strong> Avoid screens 1 hour before bedtime</li>
                <li><strong>Physical Activity:</strong> Regular exercise, but not close to bedtime</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Common Sleep Problems</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Sleep Disorders</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Insomnia:</strong> Difficulty falling or staying asleep</li>
                    <li><strong>Sleep Apnea:</strong> Breathing interruptions during sleep</li>
                    <li><strong>Restless Legs:</strong> Uncomfortable sensations in legs</li>
                    <li><strong>Narcolepsy:</strong> Excessive daytime sleepiness</li>
                    <li><strong>Circadian Disorders:</strong> Misaligned sleep-wake cycle</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Lifestyle Factors</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Caffeine:</strong> Stimulant effects lasting 6+ hours</li>
                    <li><strong>Alcohol:</strong> Disrupts sleep architecture</li>
                    <li><strong>Stress:</strong> Activates fight-or-flight response</li>
                    <li><strong>Irregular Schedule:</strong> Confuses circadian rhythm</li>
                    <li><strong>Poor Sleep Hygiene:</strong> Inconsistent bedtime routines</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Sleep Quality Indicators</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Morning Energy:</strong> Feeling refreshed upon waking</li>
                <li><strong>Daytime Alertness:</strong> Sustained focus and concentration</li>
                <li><strong>Mood Stability:</strong> Consistent emotional well-being</li>
                <li><strong>Physical Recovery:</strong> Reduced muscle soreness and fatigue</li>
                <li><strong>Memory Function:</strong> Improved learning and recall</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">When to Seek Professional Help</h3>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold text-red-800 mb-2">Warning Signs</h4>
                <ul className="list-disc list-inside text-red-700 space-y-2 text-sm">
                  <li><strong>Chronic Insomnia:</strong> Difficulty sleeping for 3+ months</li>
                  <li><strong>Excessive Daytime Sleepiness:</strong> Falling asleep during activities</li>
                  <li><strong>Loud Snoring:</strong> Especially with breathing pauses</li>
                  <li><strong>Unrefreshing Sleep:</strong> Feeling tired despite adequate sleep</li>
                  <li><strong>Sleep-Related Injuries:</strong> Accidents due to sleepiness</li>
                </ul>
                <p className="text-red-700 mt-3 text-sm">
                  <strong>Consult a healthcare provider</strong> if you experience persistent sleep problems 
                  that affect your daily life, health, or safety.
                </p>
              </div>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-semibold text-gray-800 mb-2">Pro Tips</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Use this calculator to plan your sleep schedule around your natural wake-up time</li>
                <li>• Aim for 5-6 complete sleep cycles (7.5-9 hours) for optimal rest</li>
                <li>• Create a consistent bedtime routine to signal your body it's time to sleep</li>
                <li>• Keep your bedroom temperature between 65-68°F (18-20°C) for optimal sleep</li>
                <li>• Avoid large meals, caffeine, and alcohol within 3 hours of bedtime</li>
                <li>• Consider using a sleep tracking app to monitor your sleep patterns and quality</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
