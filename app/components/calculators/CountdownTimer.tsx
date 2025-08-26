'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { Clock, Calculator, TrendingUp, Share2, Download, Printer, Calendar, Play, Pause, RotateCcw } from 'lucide-react'
import ShareModal from '../ShareModal'
import ResultSharing from '../ResultSharing'

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
      <div className="w-full px-4 py-8">
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
                        
                        {/* Share Options - Moved to Top */}
                        <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
                          <ResultSharing
                            title="Countdown Timer Result"
                            inputs={[
                              { label: "Event Name", value: event.name },
                              { label: "Target Date", value: event.targetDate },
                              { label: "Target Time", value: event.targetTime }
                            ]}
                            result={{ 
                              label: "Time Remaining", 
                              value: isExpired ? "Event has arrived!" : `${formatTime(event.timeRemaining.days)}d ${formatTime(event.timeRemaining.hours)}h ${formatTime(event.timeRemaining.minutes)}m ${formatTime(event.timeRemaining.seconds)}s`,
                              unit: ""
                            }}
                            calculatorName="Countdown Timer"
                            className="mb-0"
                          />
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

      {/* Calculator Description Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">About Countdown Timer</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 mb-4">
            Our comprehensive countdown timer helps you track time until important events, deadlines, 
            and milestones. This essential time management tool provides accurate countdowns, progress 
            tracking, and event organization to help you stay motivated and prepared for upcoming 
            occasions and deadlines.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Tracks</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Time Remaining:</strong> Days, hours, minutes, and seconds until events</li>
            <li><strong>Event Management:</strong> Multiple countdown events with custom names</li>
            <li><strong>Progress Visualization:</strong> Visual progress bars and time breakdowns</li>
            <li><strong>Date & Time Support:</strong> Precise target dates and times</li>
            <li><strong>Event Categories:</strong> Personal, professional, and special occasions</li>
            <li><strong>Reminder System:</strong> Visual countdown for motivation</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Countdown Features</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Time Display</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Days:</strong> Complete days remaining</li>
                <li><strong>Hours:</strong> Hours within current day</li>
                <li><strong>Minutes:</strong> Minutes within current hour</li>
                <li><strong>Seconds:</strong> Real-time countdown</li>
                <li><strong>Progress Bars:</strong> Visual time representation</li>
                <li><strong>Color Coding:</strong> Different colors for time units</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Event Management</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Custom Names:</strong> Personal event titles</li>
                <li><strong>Date Selection:</strong> Target date picker</li>
                <li><strong>Time Selection:</strong> Specific time targets</li>
                <li><strong>Quick Presets:</strong> Common event templates</li>
                <li><strong>Event Editing:</strong> Modify existing countdowns</li>
                <li><strong>Event Deletion:</strong> Remove completed events</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
          <div className="grid md:grid-cols-4 gap-4 mb-4">
            <div className="bg-violet-50 p-3 rounded-lg border border-violet-200">
              <h5 className="font-semibold text-violet-800 mb-1">Days</h5>
              <p className="text-violet-700 text-sm">Complete days remaining</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-1">Hours</h5>
              <p className="text-blue-700 text-sm">Hours within day</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <h5 className="font-semibold text-green-800 mb-1">Minutes</h5>
              <p className="text-green-700 text-sm">Minutes within hour</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
              <h5 className="font-semibold text-orange-800 mb-1">Seconds</h5>
              <p className="text-orange-700 text-sm">Real-time countdown</p>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
          <p className="text-gray-700 mb-4">
            Enter your event name, select the target date and time, then click "Add Event" to create 
            a countdown. Use quick presets for common events, or create custom countdowns for any 
            occasion. The timer will automatically update in real-time, showing days, hours, minutes, 
            and seconds remaining.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Use Cases</h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Personal Events:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Birthdays and anniversaries</li>
                  <li>Vacations and trips</li>
                  <li>Holiday celebrations</li>
                  <li>Special occasions</li>
                  <li>Personal milestones</li>
                  <li>Countdown to goals</li>
                </ul>
              </div>
              <div>
                <p><strong>Professional Deadlines:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Project deadlines</li>
                  <li>Meeting preparations</li>
                  <li>Report submissions</li>
                  <li>Conference dates</li>
                  <li>Training sessions</li>
                  <li>Performance reviews</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Time Management Benefits</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Motivation:</strong> Visual countdown increases excitement and anticipation</li>
            <li><strong>Planning:</strong> Better preparation for upcoming events</li>
            <li><strong>Focus:</strong> Clear timeline helps prioritize tasks</li>
            <li><strong>Stress Reduction:</strong> Organized approach to deadlines</li>
            <li><strong>Goal Setting:</strong> Concrete timelines for achievement</li>
            <li><strong>Productivity:</strong> Time awareness improves efficiency</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Progress Tracking Features</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Visual Elements</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Progress Bars:</strong> Visual representation of time remaining</li>
                <li><strong>Color Coding:</strong> Different colors for different time units</li>
                <li><strong>Time Breakdown:</strong> Clear separation of days, hours, minutes</li>
                <li><strong>Event Status:</strong> Active vs. completed countdowns</li>
                <li><strong>Real-time Updates:</strong> Live countdown with second precision</li>
                <li><strong>Responsive Design:</strong> Works on all device sizes</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Data Management</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Event Storage:</strong> Save multiple countdown events</li>
                <li><strong>Export Options:</strong> Download results as text files</li>
                <li><strong>Sharing Features:</strong> Share countdowns with others</li>
                <li><strong>Print Support:</strong> Print countdown information</li>
                <li><strong>Event Editing:</strong> Modify existing countdowns</li>
                <li><strong>Event Deletion:</strong> Remove completed events</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Countdown Psychology</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Anticipation Building:</strong> Countdowns increase excitement</li>
            <li><strong>Motivation Boost:</strong> Visual progress encourages action</li>
            <li><strong>Time Awareness:</strong> Better understanding of time passing</li>
            <li><strong>Goal Visualization:</strong> Concrete representation of objectives</li>
            <li><strong>Stress Management:</strong> Organized approach reduces anxiety</li>
            <li><strong>Celebration Planning:</strong> Time to prepare for special events</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Event Planning Integration</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Preparation Timeline:</strong> Plan tasks leading up to events</li>
            <li><strong>Milestone Tracking:</strong> Break large goals into smaller countdowns</li>
            <li><strong>Team Coordination:</strong> Share countdowns for group projects</li>
            <li><strong>Resource Planning:</strong> Allocate time and resources effectively</li>
            <li><strong>Risk Management:</strong> Identify potential delays early</li>
            <li><strong>Success Metrics:</strong> Track progress toward objectives</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Countdown Best Practices</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Set Realistic Deadlines:</strong> Allow adequate time for preparation</li>
            <li><strong>Break Down Large Goals:</strong> Create multiple countdowns for milestones</li>
            <li><strong>Regular Review:</strong> Check progress and adjust plans as needed</li>
            <li><strong>Celebrate Progress:</strong> Acknowledge achievements along the way</li>
            <li><strong>Stay Flexible:</strong> Adjust timelines when circumstances change</li>
            <li><strong>Use for Motivation:</strong> Let countdowns inspire action, not stress</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Technical Features</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Real-time Updates:</strong> Live countdown with second precision</li>
            <li><strong>Cross-platform:</strong> Works on desktop, tablet, and mobile</li>
            <li><strong>Offline Functionality:</strong> Countdowns work without internet</li>
            <li><strong>Data Persistence:</strong> Events saved between sessions</li>
            <li><strong>Export Options:</strong> Download and share countdown data</li>
            <li><strong>Responsive Design:</strong> Optimized for all screen sizes</li>
          </ul>
          
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-violet-500">
            <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
            <p className="text-gray-700 text-sm">
              Use countdown timers strategically to boost motivation and productivity. Create countdowns 
              for both short-term deadlines and long-term goals, breaking large projects into smaller 
              milestones. Remember that countdowns are tools for planning and motivation - use them to 
              stay organized and excited about upcoming events, not to create unnecessary stress. 
              Consider creating countdowns for preparation tasks as well as final deadlines to ensure 
              you have adequate time to complete everything successfully.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
