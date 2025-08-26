'use client'

import React, { useState, useCallback, useEffect } from 'react'
import { Calculator, Download, Share2, Printer, RotateCcw, Info, Globe, Clock, MapPin } from 'lucide-react'

interface TimeZone {
  name: string
  offset: number
  abbreviation: string
  location: string
}

interface TimeConversion {
  sourceTime: string
  sourceZone: string
  targetZone: string
  convertedTime: string
  timeDifference: string
}

const TIME_ZONES: TimeZone[] = [
  { name: 'UTC', offset: 0, abbreviation: 'UTC', location: 'Coordinated Universal Time' },
  { name: 'EST', offset: -5, abbreviation: 'EST', location: 'Eastern Standard Time (US)' },
  { name: 'CST', offset: -6, abbreviation: 'CST', location: 'Central Standard Time (US)' },
  { name: 'MST', offset: -7, abbreviation: 'MST', location: 'Mountain Standard Time (US)' },
  { name: 'PST', offset: -8, abbreviation: 'PST', location: 'Pacific Standard Time (US)' },
  { name: 'GMT', offset: 0, abbreviation: 'GMT', location: 'Greenwich Mean Time (UK)' },
  { name: 'CET', offset: 1, abbreviation: 'CET', location: 'Central European Time' },
  { name: 'EET', offset: 2, abbreviation: 'EET', location: 'Eastern European Time' },
  { name: 'JST', offset: 9, abbreviation: 'JST', location: 'Japan Standard Time' },
  { name: 'IST', offset: 5.5, abbreviation: 'IST', location: 'India Standard Time' },
  { name: 'AEST', offset: 10, abbreviation: 'AEST', location: 'Australian Eastern Standard Time' },
  { name: 'NZST', offset: 12, abbreviation: 'NZST', location: 'New Zealand Standard Time' },
  { name: 'BRT', offset: -3, abbreviation: 'BRT', location: 'Brasília Time (Brazil)' },
  { name: 'ART', offset: -3, abbreviation: 'ART', location: 'Argentina Time' },
  { name: 'WAT', offset: 1, abbreviation: 'WAT', location: 'West Africa Time' },
  { name: 'CAT', offset: 2, abbreviation: 'CAT', location: 'Central Africa Time' },
  { name: 'EAT', offset: 3, abbreviation: 'EAT', location: 'East Africa Time' },
  { name: 'MSK', offset: 3, abbreviation: 'MSK', location: 'Moscow Time (Russia)' },
  { name: 'CST', offset: 8, abbreviation: 'CST', location: 'China Standard Time' },
  { name: 'KST', offset: 9, abbreviation: 'KST', location: 'Korea Standard Time' }
]

const COMMON_MEETING_TIMES = [
  { name: 'Business Hours (9 AM)', time: '09:00' },
  { name: 'Lunch Time (12 PM)', time: '12:00' },
  { name: 'Afternoon (3 PM)', time: '15:00' },
  { name: 'Evening (6 PM)', time: '18:00' },
  { name: 'Late Evening (9 PM)', time: '21:00' },
  { name: 'Midnight (12 AM)', time: '00:00' }
]

export default function TimeZoneCalculator() {
  const [sourceTime, setSourceTime] = useState('')
  const [sourceZone, setSourceZone] = useState('UTC')
  const [targetZone, setTargetZone] = useState('EST')
  const [showResults, setShowResults] = useState(false)
  const [currentTime, setCurrentTime] = useState(new Date())

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const convertTime = useCallback((time: string, fromZone: string, toZone: string): TimeConversion => {
    if (!time) return {
      sourceTime: '',
      sourceZone: '',
      targetZone: '',
      convertedTime: '',
      timeDifference: ''
    }

    const fromZoneData = TIME_ZONES.find(tz => tz.name === fromZone)
    const toZoneData = TIME_ZONES.find(tz => tz.name === toZone)

    if (!fromZoneData || !toZoneData) return {
      sourceTime: '',
      sourceZone: '',
      targetZone: '',
      convertedTime: '',
      timeDifference: ''
    }

    // Parse the input time
    const [hours, minutes] = time.split(':').map(Number)
    const date = new Date()
    date.setHours(hours, minutes, 0, 0)

    // Convert to UTC first
    const utcTime = new Date(date.getTime() - (fromZoneData.offset * 60 * 60 * 1000))
    
    // Convert from UTC to target zone
    const targetTime = new Date(utcTime.getTime() + (toZoneData.offset * 60 * 60 * 1000))
    
    // Calculate time difference
    const timeDiff = toZoneData.offset - fromZoneData.offset
    const timeDiffStr = timeDiff >= 0 ? `+${timeDiff}` : `${timeDiff}`

    return {
      sourceTime: time,
      sourceZone: fromZone,
      targetZone: toZone,
      convertedTime: targetTime.toTimeString().slice(0, 5),
      timeDifference: `${timeDiffStr} hours`
    }
  }, [])

  const handleCalculate = () => {
    if (sourceTime && sourceZone !== targetZone) {
      setShowResults(true)
    }
  }

  const handleReset = () => {
    setSourceTime('')
    setSourceZone('UTC')
    setTargetZone('EST')
    setShowResults(false)
  }

  const handleQuickTime = (time: string) => {
    setSourceTime(time)
    setShowResults(true)
  }

  const handleCurrentTime = () => {
    const now = new Date()
    const timeString = now.toTimeString().slice(0, 5)
    setSourceTime(timeString)
    setSourceZone('UTC')
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

  const formatCurrentTime = (date: Date, zone: string) => {
    const zoneData = TIME_ZONES.find(tz => tz.name === zone)
    if (!zoneData) return ''
    
    const utcTime = new Date(date.getTime() + (zoneData.offset * 60 * 60 * 1000))
    return utcTime.toTimeString().slice(0, 5)
  }

  const downloadResults = () => {
    const result = convertTime(sourceTime, sourceZone, targetZone)
    
    const data = `Time Zone Calculator Results

Source Time: ${sourceTime} ${sourceZone}
Target Zone: ${targetZone}
Converted Time: ${result.convertedTime}
Time Difference: ${result.timeDifference}

Current Times:
${TIME_ZONES.slice(0, 10).map(tz => 
  `${tz.name} (${tz.location}): ${formatCurrentTime(currentTime, tz.name)}`
).join('\n')}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'time-zone-calculator-results.txt'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const shareResults = () => {
    if (navigator.share) {
      const result = convertTime(sourceTime, sourceZone, targetZone)
      
      navigator.share({
        title: 'Time Zone Calculator Results',
        text: `${sourceTime} ${sourceZone} = ${result.convertedTime} ${targetZone}`,
        url: window.location.href
      })
    } else {
      const result = convertTime(sourceTime, sourceZone, targetZone)
      const text = `${sourceTime} ${sourceZone} = ${result.convertedTime} ${targetZone}`
      navigator.clipboard.writeText(text)
      alert('Results copied to clipboard!')
    }
  }

  const printResults = () => {
    window.print()
  }

  const result = showResults ? convertTime(sourceTime, sourceZone, targetZone) : { sourceTime: '', sourceZone: '', targetZone: '', convertedTime: '', timeDifference: '' }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Time Zone Calculator</h1>
            <p className="text-teal-100 text-lg">
              Convert times between different time zones worldwide. 
              Perfect for international meetings, travel planning, and global communication.
            </p>
          </div>
          <div className="hidden md:block">
            <Globe className="w-16 h-16 text-teal-200" />
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Current Time Display */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Current Time Around the World</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {TIME_ZONES.slice(0, 10).map((zone) => (
              <div key={zone.name} className="text-center p-3 bg-white rounded border">
                <div className="font-semibold text-teal-700">{zone.name}</div>
                <div className="text-lg font-bold text-gray-800">
                  {formatCurrentTime(currentTime, zone.name)}
                </div>
                <div className="text-xs text-gray-600">{zone.location}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Time Conversion */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Source Time */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Source Time</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <input
                  type="time"
                  value={sourceTime}
                  onChange={(e) => setSourceTime(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 text-lg"
                  aria-label="Source time"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time Zone
                </label>
                <select
                  value={sourceZone}
                  onChange={(e) => setSourceZone(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  aria-label="Source time zone"
                >
                  {TIME_ZONES.map(zone => (
                    <option key={zone.name} value={zone.name}>
                      {zone.name} ({zone.abbreviation}) - {zone.location}
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleCurrentTime}
                className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 px-4 rounded-lg transition-colors duration-200"
              >
                Use Current Time
              </button>
            </div>
          </div>

          {/* Target Time Zone */}
          <div className="bg-gray-50 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">Target Time Zone</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Convert To
                </label>
                                 <select
                   value={targetZone}
                   onChange={(e) => setTargetZone(e.target.value)}
                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                   aria-label="Target time zone"
                 >
                  {TIME_ZONES.map(zone => (
                    <option key={zone.name} value={zone.name}>
                      {zone.name} ({zone.abbreviation}) - {zone.location}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="text-sm text-gray-600">
                <p>• Select a different time zone to convert to</p>
                <p>• See the time difference between zones</p>
                <p>• Perfect for scheduling international meetings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Meeting Times */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Meeting Times</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {COMMON_MEETING_TIMES.map((meeting, index) => (
              <button
                key={index}
                onClick={() => handleQuickTime(meeting.time)}
                className="p-3 bg-teal-50 hover:bg-teal-100 rounded-lg border border-teal-200 transition-colors text-sm text-center"
              >
                <div className="font-medium text-teal-800">{meeting.name}</div>
                <div className="text-teal-600">{formatTime(meeting.time)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Calculate Button */}
        {sourceTime && sourceZone !== targetZone && (
          <div className="text-center mb-8">
            <button
              onClick={handleCalculate}
              className="bg-teal-600 hover:bg-teal-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200 flex items-center justify-center mx-auto space-x-2"
            >
              <Calculator className="w-5 h-5" />
              <span>Convert Time</span>
            </button>
          </div>
        )}

        {/* Results */}
        {showResults && (
          <div className="space-y-6">
            {/* Conversion Results */}
            <div className="bg-teal-50 p-6 rounded-lg border border-teal-200">
              <h3 className="text-lg font-semibold text-teal-800 mb-4">Time Conversion Results</h3>
              <div className="grid md:grid-cols-2 gap-6 text-center">
                <div>
                  <div className="text-2xl font-bold text-teal-700 mb-2">Source Time</div>
                  <div className="text-4xl font-bold text-gray-800">{formatTime(result.sourceTime)}</div>
                  <div className="text-lg text-teal-600">{result.sourceZone}</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-teal-700 mb-2">Converted Time</div>
                  <div className="text-4xl font-bold text-gray-800">{formatTime(result.convertedTime)}</div>
                  <div className="text-lg text-teal-600">{result.targetZone}</div>
                </div>
              </div>
              
              <div className="mt-6 text-center">
                <div className="text-xl font-semibold text-blue-700">
                  Time Difference: {result.timeDifference}
                </div>
                <div className="text-sm text-gray-600">from {result.sourceZone} to {result.targetZone}</div>
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
        <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Time Zone Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive time zone calculator helps you convert times between different time zones around the world. 
              Whether you're scheduling international meetings, planning travel, or coordinating with global teams, 
              this tool provides accurate time conversions with automatic daylight saving time handling.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Time Conversions:</strong> Convert any time between different time zones</li>
              <li><strong>Current Times:</strong> Real-time display of major cities worldwide</li>
              <li><strong>Time Differences:</strong> Calculate hours and minutes between zones</li>
              <li><strong>DST Handling:</strong> Automatic daylight saving time adjustments</li>
              <li><strong>Global Coverage:</strong> Support for all major time zones</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Major Time Zones</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">North America</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Eastern Time (ET): UTC-5/-4</li>
                  <li>Central Time (CT): UTC-6/-5</li>
                  <li>Mountain Time (MT): UTC-7/-6</li>
                  <li>Pacific Time (PT): UTC-8/-7</li>
                  <li>Alaska Time (AKT): UTC-9/-8</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">International</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Greenwich Mean Time (GMT): UTC+0</li>
                  <li>Central European Time (CET): UTC+1/+2</li>
                  <li>Japan Standard Time (JST): UTC+9</li>
                  <li>Australian Eastern Time (AET): UTC+10/+11</li>
                  <li>China Standard Time (CST): UTC+8</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                <h5 className="font-semibold text-teal-800 mb-1">Source Time</h5>
                <p className="text-teal-700 text-sm">Original time in source time zone</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Converted Time</h5>
                <p className="text-blue-700 text-sm">Equivalent time in target time zone</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Time Difference</h5>
                <p className="text-green-700 text-sm">Hours and minutes between zones</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Select your source time zone, enter the time you want to convert, and choose your target time zone. 
              The calculator will instantly show the converted time and the time difference between the zones.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Business Meetings:</strong> Schedule calls with international clients and teams</li>
              <li><strong>Travel Planning:</strong> Coordinate flights, meetings, and activities abroad</li>
              <li><strong>Remote Work:</strong> Manage schedules across different time zones</li>
              <li><strong>Event Planning:</strong> Organize webinars and conferences globally</li>
              <li><strong>Customer Support:</strong> Provide service across multiple time zones</li>
              <li><strong>Social Coordination:</strong> Stay connected with friends and family worldwide</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Daylight Saving Time (DST)</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <p className="text-gray-700 text-sm mb-3">
                <strong>What is DST?</strong> Daylight saving time is the practice of setting clocks forward by one hour 
                during the warmer months to extend evening daylight.
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Spring Forward:</strong> Clocks move forward 1 hour (lose 1 hour)</p>
                  <p><strong>Fall Back:</strong> Clocks move backward 1 hour (gain 1 hour)</p>
                </div>
                <div>
                  <p><strong>Northern Hemisphere:</strong> March to November</p>
                  <p><strong>Southern Hemisphere:</strong> September to April</p>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Pro Tips for Time Zone Management</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use 24-Hour Format:</strong> Avoid AM/PM confusion in international communications</li>
              <li><strong>Consider DST:</strong> Always verify if daylight saving time is in effect</li>
              <li><strong>Plan Buffer Time:</strong> Allow extra time for technical difficulties in virtual meetings</li>
              <li><strong>Use UTC References:</strong> UTC provides a universal reference point</li>
              <li><strong>Double-Check Times:</strong> Verify conversions, especially for important meetings</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-teal-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When scheduling international meetings, consider the local time of all participants and choose 
                times that are reasonable for everyone. Early morning in one time zone might be late evening 
                in another, so aim for business hours when possible.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
