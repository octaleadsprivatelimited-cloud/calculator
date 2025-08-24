'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Baby } from 'lucide-react'

export default function ConceptionCalculator() {
  const [dueDate, setDueDate] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateConception = useCallback(() => {
    if (!dueDate) return { 
      conceptionDate: '', 
      fertileWindow: { start: '', end: '' }, 
      milestones: [],
      recommendations: []
    }

    const dueDateObj = new Date(dueDate)
    
    // Conception typically occurs 2 weeks after last period
    // So conception date is 38 weeks before due date
    const conceptionDate = new Date(dueDateObj)
    conceptionDate.setDate(dueDateObj.getDate() - 266) // 38 weeks = 266 days

    // Fertile window is 5 days before conception + day of conception
    const fertileStart = new Date(conceptionDate)
    fertileStart.setDate(conceptionDate.getDate() - 5)

    const fertileEnd = new Date(conceptionDate)
    fertileEnd.setDate(conceptionDate.getDate() + 1)

    // Last period date (14 days before conception)
    const lastPeriod = new Date(conceptionDate)
    lastPeriod.setDate(conceptionDate.getDate() - 14)

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Calculate milestones
    const milestones = []
    const today = new Date()
    const weeksPregnant = Math.floor((today.getTime() - conceptionDate.getTime()) / (1000 * 60 * 60 * 24 * 7))

    if (weeksPregnant >= 0) {
      milestones.push(`You are approximately ${weeksPregnant} weeks pregnant`)
      
      if (weeksPregnant < 4) {
        milestones.push('Early pregnancy - implantation occurs')
        milestones.push('Missed period and positive pregnancy test')
      } else if (weeksPregnant < 8) {
        milestones.push('Major organs begin developing')
        milestones.push('Heartbeat starts around week 6')
      } else if (weeksPregnant < 12) {
        milestones.push('End of first trimester')
        milestones.push('Reduced risk of miscarriage')
      } else if (weeksPregnant < 20) {
        milestones.push('Second trimester - often easiest period')
        milestones.push('Gender can be determined via ultrasound')
      } else if (weeksPregnant < 28) {
        milestones.push('Third trimester begins')
        milestones.push('Baby gains weight rapidly')
      } else if (weeksPregnant < 37) {
        milestones.push('Baby is considered full-term soon')
        milestones.push('Prepare for labor and delivery')
      } else {
        milestones.push('Full-term pregnancy')
        milestones.push('Baby can arrive any day now')
      }
    }

    // Generate recommendations
    const recommendations = []
    recommendations.push('Schedule prenatal care appointments')
    recommendations.push('Take prenatal vitamins with folic acid')
    recommendations.push('Avoid alcohol, smoking, and certain medications')
    recommendations.push('Eat a balanced diet rich in nutrients')
    recommendations.push('Stay hydrated and get adequate rest')

    return { 
      conceptionDate: formatDate(conceptionDate), 
      fertileWindow: { 
        start: formatDate(fertileStart), 
        end: formatDate(fertileEnd) 
      }, 
      lastPeriod: formatDate(lastPeriod),
      milestones,
      recommendations
    }
  }, [dueDate])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setDueDate('')
    setShowResults(false)
  }

  const result = showResults ? calculateConception() : { 
    conceptionDate: '', 
    fertileWindow: { start: '', end: '' }, 
    lastPeriod: '',
    milestones: [],
    recommendations: []
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 px-6 py-4">
        <div className="flex items-center">
          <Baby className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Conception Calculator</h2>
        </div>
        <p className="text-blue-100 mt-1">Calculate conception date from due date</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Expected Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-label="Expected due date"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <Calculator className="h-5 w-5 inline mr-2" />
              Calculate
            </button>
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <RotateCcw className="h-5 w-5 inline mr-2" />
              Reset
            </button>
          </div>
        </div>

        {showResults && (
          <div className="mt-6 space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Conception Date</h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600 mb-2">
                  {result.conceptionDate}
                </div>
                <div className="text-blue-700">
                  When fertilization likely occurred
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">Fertile Window</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-blue-700">Start:</span>
                  <span className="font-semibold text-blue-800">{result.fertileWindow.start}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-700">End:</span>
                  <span className="font-semibold text-blue-800">{result.fertileWindow.end}</span>
                </div>
                <div className="text-center mt-3 text-sm text-blue-600">
                  Most likely time of conception
                </div>
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Last Period</h3>
              <div className="text-center">
                <div className="text-xl font-semibold text-blue-600">
                  {result.lastPeriod}
                </div>
                <div className="text-blue-700 text-sm">
                  First day of last menstrual period
                </div>
              </div>
            </div>

            {result.milestones.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Pregnancy Progress</h3>
                <div className="space-y-2">
                  {result.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-blue-700">{milestone}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h3 className="text-lg font-semibold text-blue-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-blue-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
