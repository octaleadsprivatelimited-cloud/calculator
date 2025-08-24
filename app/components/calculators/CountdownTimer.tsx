'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Clock, Calculator, TrendingUp, Share2, Download, Printer, Calendar, Play, Pause, RotateCcw } from 'lucide-react'
import ShareModal from '../ShareModal'

interface CountdownEvent {
  id: string
  name: string
  targetDate: string
  targetTime: string
  isActive: boolean
  timeRemaining: {
    days: number
    hours: number
    minutes: number
    seconds: number
  }
}

export default function CountdownTimer() {
  const [events, setEvents] = useState<CountdownEvent[]>([
    {
      id: '1',
      name: 'New Year 2025',
      targetDate: '2025-01-01',
      targetTime: '00:00',
      isActive: true,
      timeRemaining: { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }
  ])
  const [newEventName, setNewEventName] = useState('')
  const [newEventDate, setNewEventDate] = useState('')
  const [newEventTime, setNewEventTime] = useState('00:00')
  const [showShareModal, setShowShareModal] = useState(false)

  const calculateTimeRemaining = useCallback((targetDate: string, targetTime: string) => {
    const now = new Date()
    const target = new Date(`${targetDate}T${targetTime}`)
    
    if (target <= now) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0 }
    }

    const diff = target.getTime() - now.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    const seconds = Math.floor((diff % (1000 * 60)) / 1000)

    return { days, hours, minutes, seconds }
  }, [])

  const updateAllEvents = useCallback(() => {
    setEvents(prevEvents => 
      prevEvents.map(event => ({
        ...event,
        timeRemaining: calculateTimeRemaining(event.targetDate, event.targetTime)
      }))
    )
  }, [calculateTimeRemaining])

  useEffect(() => {
    updateAllEvents()
    const interval = setInterval(updateAllEvents, 1000)
    return () => clearInterval(interval)
  }, [updateAllEvents])

  const addEvent = () => {
    if (!newEventName || !newEventDate) return

    const newEvent: CountdownEvent = {
      id: Date.now().toString(),
      name: newEventName,
      targetDate: newEventDate,
      targetTime: newEventTime,
      isActive: true,
      timeRemaining: calculateTimeRemaining(newEventDate, newEventTime)
    }

    setEvents([...events, newEvent])
    setNewEventName('')
    setNewEventDate('')
    setNewEventTime('00:00')
  }

  const removeEvent = (id: string) => {
    setEvents(events.filter(event => event.id !== id))
  }

  const toggleEvent = (id: string) => {
    setEvents(events.map(event =>
      event.id === id ? { ...event, isActive: !event.isActive } : event
    ))
  }

  const resetEvent = (id: string) => {
    setEvents(events.map(event =>
      event.id === id ? { ...event, timeRemaining: calculateTimeRemaining(event.targetDate, event.targetTime) } : event
    ))
  }

  const handleShare = () => {
    setShowShareModal(true)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    const data = `Countdown Timer Results\n\nActive Events:\n${events.filter(e => e.isActive).map(event => {
      const { days, hours, minutes, seconds } = event.timeRemaining
      return `${event.name}: ${days}d ${hours}h ${minutes}m ${seconds}s remaining (${event.targetDate} ${event.targetTime})`
    }).join('\n')}\n\nTotal Events: ${events.length}\nActive Events: ${events.filter(e => e.isActive).length}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'countdown-timer-results.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const formatTime = (value: number) => {
    return value.toString().padStart(2, '0')
  }

  const getProgressPercentage = (event: CountdownEvent) => {
    const now = new Date()
    const target = new Date(`${event.targetDate}T${event.targetTime}`)
    const start = new Date('2024-01-01T00:00')
    
    if (target <= now) return 100
    if (target <= start) return 0
    
    const total = target.getTime() - start.getTime()
    const elapsed = now.getTime() - start.getTime()
    return Math.min(100, Math.max(0, (elapsed / total) * 100))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-50 to-purple-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <Clock className="w-16 h-16 mr-4 text-violet-600" />
            Countdown Timer
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Count down to important dates and events. Track multiple countdowns simultaneously and never miss a deadline or celebration.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Add Event Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-violet-600" />
                Add New Event
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Event Name
                  </label>
                  <input
                    type="text"
                    value={newEventName}
                    onChange={(e) => setNewEventName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    placeholder="New Year 2025"
                    title="Enter the name of your event"
                    aria-label="Event name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Date
                  </label>
                  <input
                    type="date"
                    value={newEventDate}
                    onChange={(e) => setNewEventDate(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    title="Select the target date for your event"
                    aria-label="Target date"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Time
                  </label>
                  <input
                    type="time"
                    value={newEventTime}
                    onChange={(e) => setNewEventTime(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-violet-500 focus:ring-2 focus:ring-violet-200"
                    title="Select the target time for your event"
                    aria-label="Target time"
                  />
                </div>

                <button
                  onClick={addEvent}
                  disabled={!newEventName || !newEventDate}
                  className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                  title="Add new countdown event"
                  aria-label="Add new countdown event"
                >
                  <Calendar className="w-5 h-5" />
                  Add Event
                </button>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Presets</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setNewEventName('Birthday')
                    setNewEventDate(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
                    setNewEventTime('09:00')
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: Birthday in 30 days"
                  aria-label="Set example: Birthday in 30 days"
                >
                  🎂 Birthday (30 days)
                </button>
                <button
                  onClick={() => {
                    setNewEventName('Vacation')
                    setNewEventDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
                    setNewEventTime('08:00')
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: Vacation in 7 days"
                  aria-label="Set example: Vacation in 7 days"
                >
                  🏖️ Vacation (7 days)
                </button>
                <button
                  onClick={() => {
                    setNewEventName('Project Deadline')
                    setNewEventDate(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])
                    setNewEventTime('17:00')
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: Project deadline in 14 days"
                  aria-label="Set example: Project deadline in 14 days"
                >
                  📅 Project Deadline (14 days)
                </button>
              </div>
            </div>
          </div>

          {/* Countdown Events */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <TrendingUp className="w-6 h-6 mr-2 text-violet-600" />
                Active Countdowns
              </h2>
              
              {events.length === 0 ? (
                <div className="text-center py-12">
                  <Clock className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">
                    No countdown events yet. Add your first event above!
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {events.map(event => {
                    const progress = getProgressPercentage(event)
                    const isExpired = event.timeRemaining.days === 0 && 
                                    event.timeRemaining.hours === 0 && 
                                    event.timeRemaining.minutes === 0 && 
                                    event.timeRemaining.seconds === 0
                    
                    return (
                      <div key={event.id} className={`border rounded-lg p-4 ${
                        isExpired ? 'border-green-200 bg-green-50' : 'border-gray-200'
                      }`}>
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="font-semibold text-gray-800">{event.name}</h3>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleEvent(event.id)}
                              className={`p-2 rounded ${event.isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}
                              title={event.isActive ? 'Pause countdown' : 'Resume countdown'}
                              aria-label={event.isActive ? 'Pause countdown' : 'Resume countdown'}
                            >
                              {event.isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => resetEvent(event.id)}
                              className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                              title="Reset countdown"
                              aria-label="Reset countdown"
                            >
                              <RotateCcw className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => removeEvent(event.id)}
                              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200"
                              title="Remove event"
                              aria-label="Remove event"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        
                        <div className="text-center mb-3">
                          <div className="text-sm text-gray-600 mb-2">
                            {event.targetDate} at {event.targetTime}
                          </div>
                          
                          {isExpired ? (
                            <div className="text-2xl font-bold text-green-600">
                              🎉 Event has arrived!
                            </div>
                          ) : (
                            <div className="grid grid-cols-4 gap-2">
                              <div className="bg-violet-100 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-violet-600">
                                  {formatTime(event.timeRemaining.days)}
                                </div>
                                <div className="text-xs text-violet-600">Days</div>
                              </div>
                              <div className="bg-blue-100 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-blue-600">
                                  {formatTime(event.timeRemaining.hours)}
                                </div>
                                <div className="text-xs text-blue-600">Hours</div>
                              </div>
                              <div className="bg-green-100 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-green-600">
                                  {formatTime(event.timeRemaining.minutes)}
                                </div>
                                <div className="text-xs text-green-600">Minutes</div>
                              </div>
                              <div className="bg-orange-100 p-3 rounded-lg">
                                <div className="text-2xl font-bold text-orange-600">
                                  {formatTime(event.timeRemaining.seconds)}
                                </div>
                                <div className="text-xs text-orange-600">Seconds</div>
                              </div>
                            </div>
                          )}
                        </div>
                        
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className={`h-2 rounded-full transition-all duration-1000 ${
                              isExpired ? 'bg-green-500' : 'bg-violet-500'
                            }`}
                            style={{ width: `${progress}%` }}
                          ></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            {events.length > 0 && (
              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Share countdown timer results"
                  aria-label="Share countdown timer results"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Download results as text file"
                  aria-label="Download countdown timer results"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  title="Print countdown timer results"
                  aria-label="Print countdown timer results"
                >
                  <Printer className="w-5 h-5" />
                  Print
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Back to Calculators */}
        <div className="text-center mt-12">
          <a
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            title="Back to all calculators"
            aria-label="Back to all calculators"
          >
            <Calculator className="w-5 h-5" />
            Back to All Calculators
          </a>
        </div>
      </div>

      {/* Share Modal */}
              {showShareModal && (
          <ShareModal
            isOpen={showShareModal}
            onClose={() => setShowShareModal(false)}
            calculation={{
              expression: `${events.length} countdown events`,
              result: `${events.filter(e => e.isActive).length} active events`,
              timestamp: new Date()
            }}
          />
        )}
    </div>
  )
}
