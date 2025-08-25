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

      {/* Calculator Description Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">About Conception Calculator</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 mb-4">
            Our comprehensive conception calculator helps expectant parents and healthcare professionals 
            determine the likely conception date based on the expected due date. This essential pregnancy 
            planning tool provides accurate conception timing, fertile window calculations, and pregnancy 
            milestones to help with prenatal care planning and pregnancy tracking.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Conception Date:</strong> Most likely date of fertilization</li>
            <li><strong>Fertile Window:</strong> Optimal time period for conception</li>
            <li><strong>Last Period:</strong> First day of last menstrual period</li>
            <li><strong>Pregnancy Progress:</strong> Key developmental milestones</li>
            <li><strong>Timeline Analysis:</strong> Complete pregnancy timeline</li>
            <li><strong>Healthcare Guidance:</strong> Prenatal care recommendations</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Pregnancy Timeline Basics</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Gestational Age</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Measured from last menstrual period</li>
                <li>40 weeks total pregnancy duration</li>
                <li>First trimester: weeks 1-12</li>
                <li>Second trimester: weeks 13-26</li>
                <li>Third trimester: weeks 27-40</li>
                <li>Standard medical calculation</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Fetal Development</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Conception occurs around week 2</li>
                <li>Implantation around week 3-4</li>
                <li>Heartbeat detectable by week 6</li>
                <li>Major organs form first trimester</li>
                <li>Rapid growth second trimester</li>
                <li>Final development third trimester</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-1">Conception Date</h5>
              <p className="text-blue-700 text-sm">Fertilization timing</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <h5 className="font-semibold text-green-800 mb-1">Fertile Window</h5>
              <p className="text-green-700 text-sm">Optimal conception period</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-purple-800 mb-1">Last Period</h5>
              <p className="text-purple-700 text-sm">LMP calculation basis</p>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
          <p className="text-gray-700 mb-4">
            Enter your expected due date, and the calculator will compute the likely conception date, 
            fertile window, and last menstrual period. This information helps with pregnancy planning, 
            prenatal care scheduling, and understanding your pregnancy timeline.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Conception Calculation Method</h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Standard Method:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Due date - 266 days = conception date</li>
                  <li>266 days = 38 weeks gestation</li>
                  <li>Based on average pregnancy length</li>
                  <li>Accounts for ovulation timing</li>
                  <li>Medical standard calculation</li>
                  <li>Used by healthcare providers</li>
                </ul>
              </div>
              <div>
                <p><strong>Fertile Window:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>5 days before ovulation</li>
                  <li>Day of ovulation</li>
                  <li>1 day after ovulation</li>
                  <li>Sperm can live 3-5 days</li>
                  <li>Egg viable 12-24 hours</li>
                  <li>Peak fertility window</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Pregnancy Milestones</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Week 4:</strong> Missed period, positive pregnancy test</li>
            <li><strong>Week 6:</strong> Heartbeat detectable via ultrasound</li>
            <li><strong>Week 8:</strong> Major organs begin forming</li>
            <li><strong>Week 12:</strong> End of first trimester, reduced miscarriage risk</li>
            <li><strong>Week 20:</strong> Anatomy scan, gender determination possible</li>
            <li><strong>Week 28:</strong> Viability milestone, premature birth survival</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Prenatal Care Timeline</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">First Trimester</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Initial Visit:</strong> Confirm pregnancy, establish care</li>
                <li><strong>Blood Tests:</strong> Blood type, Rh factor, infections</li>
                <li><strong>Ultrasound:</strong> Confirm viability, estimate due date</li>
                <li><strong>Genetic Screening:</strong> First trimester screening</li>
                <li><strong>Nutrition Counseling:</strong> Prenatal vitamins, diet</li>
                <li><strong>Lifestyle Guidance:</strong> Exercise, medications, safety</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Second & Third Trimesters</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Regular Check-ups:</strong> Monthly then bi-weekly visits</li>
                <li><strong>Anatomy Scan:</strong> Detailed fetal development check</li>
                <li><strong>Glucose Testing:</strong> Gestational diabetes screening</li>
                <li><strong>Group B Strep:</strong> Bacterial infection screening</li>
                <li><strong>Birth Planning:</strong> Delivery preferences, classes</li>
                <li><strong>Final Preparations:</strong> Hospital bag, car seat</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Conception Timing</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Ovulation Timing:</strong> Can vary by several days</li>
            <li><strong>Cycle Length:</strong> Not all women have 28-day cycles</li>
            <li><strong>Sperm Viability:</strong> Can live 3-5 days in reproductive tract</li>
            <li><strong>Egg Lifespan:</strong> Viable for 12-24 hours after ovulation</li>
            <li><strong>Fertilization Window:</strong> Optimal time is 5 days around ovulation</li>
            <li><strong>Individual Variation:</strong> Each woman's cycle is unique</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Pregnancy Planning Considerations</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Preconception Health:</strong> Optimize health before pregnancy</li>
            <li><strong>Folic Acid:</strong> Start 3 months before conception</li>
            <li><strong>Medical Conditions:</strong> Manage chronic health issues</li>
            <li><strong>Medications:</strong> Review safety during pregnancy</li>
            <li><strong>Lifestyle Factors:</strong> Quit smoking, limit alcohol</li>
            <li><strong>Genetic Counseling:</strong> Family history considerations</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Pregnancy Questions</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Due Date Accuracy:</strong> Only 5% of babies born on exact due date</li>
            <li><strong>Conception Timing:</strong> Can occur up to 5 days after intercourse</li>
            <li><strong>Pregnancy Tests:</strong> Most accurate after missed period</li>
            <li><strong>Ultrasound Dating:</strong> Most accurate in first trimester</li>
            <li><strong>Cycle Variations:</strong> Normal to have irregular cycles</li>
            <li><strong>Multiple Births:</strong> Can affect due date calculations</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Healthcare Provider Communication</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Share Results:</strong> Provide calculated dates to your doctor</li>
            <li><strong>Confirm Due Date:</strong> Ultrasound may adjust estimated date</li>
            <li><strong>Ask Questions:</strong> Clarify any concerns about timing</li>
            <li><strong>Follow Recommendations:</strong> Adhere to prenatal care schedule</li>
            <li><strong>Report Changes:</strong> Notify provider of any complications</li>
            <li><strong>Birth Plan Discussion:</strong> Discuss delivery preferences early</li>
          </ul>
          
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
            <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
            <p className="text-gray-700 text-sm">
              While this calculator provides a good estimate of conception timing, remember that every 
              pregnancy is unique. The calculated dates are estimates based on averages, and your actual 
              pregnancy timeline may vary. Always confirm important dates with your healthcare provider 
              and use this information as a starting point for pregnancy planning. Early prenatal care 
              is crucial for a healthy pregnancy, so schedule your first appointment as soon as you 
              confirm your pregnancy.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
