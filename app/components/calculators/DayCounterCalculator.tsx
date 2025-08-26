'use client'
import React, { useState } from 'react'
import { Calculator, Calendar, Target } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function DayCounterCalculator() {
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateDays = () => {
    if (!startDate || !endDate) return null
    
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    return diffDays
  }

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setStartDate('')
    setEndDate('')
    setShowResults(false)
  }

  const days = showResults ? calculateDays() : null

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-teal-600 px-6 py-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Day Counter Calculator</h1>
            <p className="text-green-100 text-lg">Count the number of days between two dates</p>
          </div>
          <Calendar className="w-16 h-16 text-green-200" />
        </div>
      </div>

      <div className="p-6">
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Select start date"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              title="Select end date"
            />
          </div>
        </div>

        <div className="text-center mb-8">
          <button
            onClick={handleCalculate}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors duration-200"
          >
            Count Days
          </button>
        </div>

        {showResults && days !== null && (
          <>
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-6 rounded-lg border border-green-200 mb-4">
              <ResultSharing
                title="Day Count Calculation Result"
                inputs={[
                  { label: "Start Date", value: startDate },
                  { label: "End Date", value: endDate },
                  { label: "Calculation Type", value: "Day Count" }
                ]}
                result={{ 
                  label: "Total Days", 
                  value: `${days} ${days === 1 ? 'day' : 'days'}`,
                  unit: ""
                }}
                calculatorName="Day Counter Calculator"
                className="mb-0"
              />
            </div>

            <div className="bg-green-50 p-6 rounded-lg border border-green-200 text-center">
              <h3 className="text-xl font-semibold text-green-800 mb-4">Day Count Results</h3>
            <div className="text-3xl font-bold text-green-600 mb-2">
              {days} {days === 1 ? 'day' : 'days'}
            </div>
            <div className="mt-4">
              <button onClick={handleReset} className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg">
                Reset
              </button>
            </div>
          </div>
          </>
        )}
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Day Counter Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our simple and efficient day counter calculator helps you quickly determine the number of 
              days between two dates. This essential tool provides accurate day counting for planning, 
              scheduling, and tracking time periods, making it perfect for personal and professional use.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Day Count:</strong> Total days between two selected dates</li>
              <li><strong>Date Range:</strong> From start date to end date</li>
              <li><strong>Inclusive Counting:</strong> Includes both start and end dates</li>
              <li><strong>Accurate Results:</strong> Handles leap years and month variations</li>
              <li><strong>Simple Interface:</strong> Easy-to-use date selection</li>
              <li><strong>Instant Results:</strong> Immediate calculation display</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Day Count</h5>
                <p className="text-green-700 text-sm">Total days between dates</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Date Range</h5>
                <p className="text-blue-700 text-sm">Start to end date span</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Select your start date and end date using the date pickers, then click "Count Days" to 
              see the total number of days between them. The calculator automatically handles leap years, 
              month variations, and provides accurate results instantly.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Use Cases</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Personal Planning</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Vacation Planning:</strong> Days until your next trip</li>
                  <li><strong>Event Countdown:</strong> Days until special occasions</li>
                  <li><strong>Goal Tracking:</strong> Days since starting a goal</li>
                  <li><strong>Anniversary Counting:</strong> Days since important dates</li>
                  <li><strong>Birthday Planning:</strong> Days until next birthday</li>
                  <li><strong>Holiday Preparation:</strong> Days until celebrations</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Professional Applications</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Project Deadlines:</strong> Days remaining for completion</li>
                  <li><strong>Contract Terms:</strong> Duration of agreements</li>
                  <li><strong>Billing Periods:</strong> Service duration tracking</li>
                  <li><strong>Warranty Coverage:</strong> Days of protection remaining</li>
                  <li><strong>Subscription Renewals:</strong> Days until next billing</li>
                  <li><strong>Meeting Planning:</strong> Days until scheduled events</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Day Counting Methods</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Inclusive Counting:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Includes both start and end dates</li>
                    <li>Most common counting method</li>
                    <li>Standard for most applications</li>
                    <li>Intuitive for users</li>
                    <li>Matches calendar expectations</li>
                    <li>Widely accepted standard</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Calendar Accuracy:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Accounts for leap years</li>
                    <li>Handles month length variations</li>
                    <li>Proper year boundary logic</li>
                    <li>Gregorian calendar compliance</li>
                    <li>Precise day calculations</li>
                    <li>Professional grade accuracy</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Day Counting Benefits</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Simple Planning:</strong> Easy to understand time periods</li>
              <li><strong>Quick Calculations:</strong> Instant results for decision making</li>
              <li><strong>Accurate Tracking:</strong> Precise day counting for projects</li>
              <li><strong>Visual Understanding:</strong> Clear representation of time spans</li>
              <li><strong>Goal Setting:</strong> Concrete timelines for objectives</li>
              <li><strong>Progress Monitoring:</strong> Track time-based achievements</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Day Counting vs. Other Time Units</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Days</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Most intuitive unit</li>
                  <li>Easy to visualize</li>
                  <li>Calendar-based counting</li>
                  <li>Standard for planning</li>
                  <li>Universal understanding</li>
                  <li>No conversion needed</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Weeks</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>7-day groupings</li>
                  <li>Work week planning</li>
                  <li>Bi-weekly schedules</li>
                  <li>Monthly planning</li>
                  <li>Project milestones</li>
                  <li>Recurring events</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Months</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Variable lengths</li>
                  <li>Billing cycles</li>
                  <li>Seasonal planning</li>
                  <li>Quarterly goals</li>
                  <li>Annual planning</li>
                  <li>Business cycles</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Day Counting Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Specific Dates:</strong> Avoid ambiguous date ranges</li>
              <li><strong>Consider Context:</strong> Business days vs. calendar days</li>
              <li><strong>Account for Time Zones:</strong> Date changes across locations</li>
              <li><strong>Verify Results:</strong> Check a few known dates for accuracy</li>
              <li><strong>Plan Buffer Time:</strong> Add extra days for unexpected delays</li>
              <li><strong>Use for Motivation:</strong> Visual countdowns increase urgency</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Day Counting Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Off-by-One Errors:</strong> Forgetting to include start or end date</li>
              <li><strong>Leap Year Ignorance:</strong> February calculations can be off</li>
              <li><strong>Month Length Assumptions:</strong> Not all months have 30 days</li>
              <li><strong>Business Day Confusion:</strong> Including weekends in business calculations</li>
              <li><strong>Time Zone Issues:</strong> Date changes across time zones</li>
              <li><strong>Format Inconsistencies:</strong> Different date format interpretations</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Day Counting Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Julian Day Numbers:</strong> Continuous day counting system</li>
              <li><strong>ISO Week Dates:</strong> International week numbering</li>
              <li><strong>Business Day Calculations:</strong> Excluding weekends and holidays</li>
              <li><strong>Working Day Adjustments:</strong> Account for company holidays</li>
              <li><strong>Seasonal Day Counting:</strong> Equinox and solstice tracking</li>
              <li><strong>Historical Date Systems:</strong> Different calendar conversions</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When counting days for important projects or deadlines, always add a few buffer days to 
                account for unexpected delays or complications. For business applications, consider 
                whether you need calendar days or business days (excluding weekends and holidays). 
                Remember that day counting is inclusive, so if you start on Monday and end on Friday, 
                that's 5 days, not 4. Use this calculator to create realistic timelines and avoid 
                last-minute rushes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
