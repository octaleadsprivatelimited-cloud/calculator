'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Calendar } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function PeriodCalculator() {
  const [lastPeriod, setLastPeriod] = useState('')
  const [cycleLength, setCycleLength] = useState('28')
  const [showResults, setShowResults] = useState(false)

  const calculatePeriod = useCallback(() => {
        if (!lastPeriod) return { 
      nextPeriod: '', 
      futurePeriods: [], 
      cycleInfo: {
        daysSinceLast: 0,
        daysUntilNext: 0,
        cycleLength: 28,
        isLate: false,
        isDueSoon: false
      },
      recommendations: []
    }

    const lastPeriodDate = new Date(lastPeriod)
    const cycle = parseInt(cycleLength) || 28

    // Calculate next period
    const nextPeriod = new Date(lastPeriodDate)
    nextPeriod.setDate(lastPeriodDate.getDate() + cycle)

    // Calculate future periods (next 6 months)
    const futurePeriods = []
    for (let i = 1; i <= 6; i++) {
      const futureDate = new Date(lastPeriodDate)
      futureDate.setDate(lastPeriodDate.getDate() + (cycle * i))
      futurePeriods.push(futureDate)
    }

    // Calculate cycle statistics
    const today = new Date()
    const daysSinceLastPeriod = Math.floor((today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24))
    const daysUntilNextPeriod = Math.floor((nextPeriod.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    const cycleInfo = {
      daysSinceLast: daysSinceLastPeriod,
      daysUntilNext: daysUntilNextPeriod,
      cycleLength: cycle,
      isLate: daysSinceLastPeriod > cycle,
      isDueSoon: daysUntilNextPeriod <= 7
    }

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }

    // Generate recommendations
    const recommendations = []
    if (cycleInfo.isLate) {
      recommendations.push('Your period is late - consider taking a pregnancy test')
      recommendations.push('Stress, illness, or medication can affect cycle timing')
    } else if (cycleInfo.isDueSoon) {
      recommendations.push('Your period is due soon - prepare accordingly')
      recommendations.push('Track symptoms and flow for better cycle understanding')
    } else {
      recommendations.push('Your cycle appears to be on track')
      recommendations.push('Continue tracking for pattern recognition')
    }

    recommendations.push('Track symptoms, flow, and cycle length for better health insights')
    recommendations.push('Consult healthcare provider if cycles are consistently irregular')

    return { 
      nextPeriod: formatDate(nextPeriod), 
      futurePeriods: futurePeriods.map(formatDate), 
      cycleInfo,
      recommendations
    }
  }, [lastPeriod, cycleLength])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setLastPeriod('')
    setCycleLength('28')
    setShowResults(false)
  }

  const result = showResults ? calculatePeriod() : { 
    nextPeriod: '', 
    futurePeriods: [], 
    cycleInfo: {
      daysSinceLast: 0,
      daysUntilNext: 0,
      cycleLength: 28,
      isLate: false,
      isDueSoon: false
    },
    recommendations: []
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-rose-500 to-pink-500 px-6 py-4">
        <div className="flex items-center">
          <Calendar className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Period Calculator</h2>
        </div>
        <p className="text-rose-100 mt-1">Calculate your next period and track your cycle</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              First Day of Last Period
            </label>
            <input
              type="date"
              value={lastPeriod}
              onChange={(e) => setLastPeriod(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              aria-label="First day of last period"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Average Cycle Length (days)
            </label>
            <input
              type="number"
              value={cycleLength}
              onChange={(e) => setCycleLength(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-rose-500"
              placeholder="28"
              min="21"
              max="35"
              aria-label="Average cycle length in days"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            {/* Share Options - Moved to Top */}
            <div className="bg-white p-4 rounded-lg border border-rose-200">
              <ResultSharing
                title="Period Calculation Result"
                inputs={[
                  { label: "Last Period", value: lastPeriod },
                  { label: "Cycle Length", value: `${cycleLength} days` },
                  { label: "Calculation Type", value: "Period Tracking" }
                ]}
                result={{ 
                  label: "Next Period", 
                  value: result.nextPeriod,
                  unit: ""
                }}
                calculatorName="Period Calculator"
                className="mb-0"
              />
            </div>

            <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
              <h3 className="text-lg font-semibold text-rose-800 mb-2">Next Period</h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-rose-600 mb-2">
                  {result.nextPeriod}
                </div>
                <div className="text-rose-700">
                  {result.cycleInfo.daysUntilNext > 0 
                    ? `${result.cycleInfo.daysUntilNext} days away`
                    : 'Due today or overdue'}
                </div>
              </div>
            </div>

            <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
              <h3 className="text-lg font-semibold text-rose-800 mb-3">Cycle Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-rose-700">Days since last period:</span>
                  <span className="font-semibold text-rose-800">{result.cycleInfo.daysSinceLast}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-700">Days until next period:</span>
                  <span className="font-semibold text-rose-800">{result.cycleInfo.daysUntilNext}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-700">Cycle length:</span>
                  <span className="font-semibold text-rose-800">{result.cycleInfo.cycleLength} days</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-rose-700">Status:</span>
                  <span className={`font-semibold ${result.cycleInfo.isLate ? 'text-red-600' : result.cycleInfo.isDueSoon ? 'text-orange-600' : 'text-green-600'}`}>
                    {result.cycleInfo.isLate ? 'Late' : result.cycleInfo.isDueSoon ? 'Due Soon' : 'On Track'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
              <h3 className="text-lg font-semibold text-rose-800 mb-3">Future Periods (6 months)</h3>
              <div className="space-y-2">
                {result.futurePeriods.map((date, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-rose-700">Month {index + 1}:</span>
                    <span className="font-semibold text-rose-800">{date}</span>
                  </div>
                ))}
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-rose-50 rounded-lg border border-rose-200">
                <h3 className="text-lg font-semibold text-rose-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-rose-600 mr-2">•</span>
                      <span className="text-rose-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Period Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive Period Calculator helps women track their menstrual cycles and predict future 
              periods with accuracy. This essential tool provides cycle analysis, period predictions, and 
              personalized recommendations for optimal reproductive health management and planning.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Next Period Date:</strong> Predicted start of next menstrual cycle</li>
              <li><strong>Cycle Analysis:</strong> Days since last period and until next</li>
              <li><strong>Cycle Status:</strong> On track, due soon, or late assessment</li>
              <li><strong>Future Predictions:</strong> 6-month period forecast</li>
              <li><strong>Cycle Length:</strong> Average menstrual cycle duration</li>
              <li><strong>Health Recommendations:</strong> Personalized cycle guidance</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-rose-50 p-3 rounded-lg border border-rose-200">
                <h5 className="font-semibold text-rose-800 mb-1">Next Period</h5>
                <p className="text-rose-700 text-sm">Predicted start date</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Days Until</h5>
                <p className="text-blue-700 text-sm">Countdown to next cycle</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Cycle Status</h5>
                <p className="text-green-700 text-sm">On track or late</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Future Dates</h5>
                <p className="text-purple-700 text-sm">6-month forecast</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the date of your last menstrual period and your average cycle length. The calculator will 
              automatically determine your next period date, provide cycle analysis, and forecast future periods 
              for comprehensive menstrual health planning.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Menstrual Cycle Phases</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Menstrual Phase (Days 1-5)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Period Flow:</strong> Shedding of uterine lining</li>
                  <li><strong>Hormone Levels:</strong> Estrogen and progesterone low</li>
                  <li><strong>Common Symptoms:</strong> Cramps, fatigue, mood changes</li>
                  <li><strong>Energy Level:</strong> Generally lower</li>
                  <li><strong>Exercise:</strong> Light to moderate activity recommended</li>
                  <li><strong>Nutrition:</strong> Iron-rich foods important</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Follicular Phase (Days 6-14)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Egg Development:</strong> Follicles mature in ovaries</li>
                  <li><strong>Hormone Levels:</strong> Estrogen rising</li>
                  <li><strong>Common Symptoms:</strong> Increased energy, creativity</li>
                  <li><strong>Energy Level:</strong> Rising and peaking</li>
                  <li><strong>Exercise:</strong> High-intensity workouts optimal</li>
                  <li><strong>Nutrition:</strong> Protein and complex carbs beneficial</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Cycle Length Variations</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Short Cycles (21-24 days):</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>More frequent periods</li>
                    <li>May indicate hormonal changes</li>
                    <li>Common in younger women</li>
                    <li>May need more frequent tracking</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Long Cycles (30-35 days):</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Less frequent periods</li>
                    <li>May indicate PCOS or other conditions</li>
                    <li>Common in older women</li>
                    <li>May have longer fertile windows</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Cycle Tracking Benefits</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Health Monitoring:</strong> Identify irregular patterns early</li>
              <li><strong>Symptom Management:</strong> Prepare for period-related symptoms</li>
              <li><strong>Fertility Planning:</strong> Track ovulation and fertile windows</li>
              <li><strong>Medical Appointments:</strong> Schedule visits at optimal times</li>
              <li><strong>Lifestyle Planning:</strong> Adjust activities based on cycle phase</li>
              <li><strong>Pregnancy Detection:</strong> Identify missed periods quickly</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Cycle Irregularities</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Temporary Irregularities</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Stress:</strong> High stress can delay periods</li>
                  <li><strong>Travel:</strong> Time zone changes affect cycles</li>
                  <li><strong>Illness:</strong> Sickness can impact timing</li>
                  <li><strong>Medication:</strong> Some drugs affect cycles</li>
                  <li><strong>Weight Changes:</strong> Rapid loss or gain</li>
                  <li><strong>Exercise:</strong> Intense training can cause amenorrhea</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Medical Conditions</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Polycystic Ovary Syndrome:</strong> Irregular or absent periods</li>
                  <li><strong>Thyroid Disorders:</strong> Hormone imbalances</li>
                  <li><strong>Endometriosis:</strong> Painful, heavy periods</li>
                  <li><strong>Uterine Fibroids:</strong> Heavy bleeding, long periods</li>
                  <li><strong>Premature Ovarian Failure:</strong> Early menopause</li>
                  <li><strong>Eating Disorders:</strong> Can stop periods entirely</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">When to Seek Medical Help</h4>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
              <h5 className="font-semibold text-yellow-800 mb-2">Consult a Doctor If:</h5>
              <ul className="list-disc list-inside text-yellow-700 space-y-1 text-sm">
                <li><strong>Missed Periods:</strong> No period for 3+ months</li>
                <li><strong>Very Heavy Bleeding:</strong> Soaking through pads hourly</li>
                <li><strong>Severe Pain:</strong> Pain that interferes with daily activities</li>
                <li><strong>Irregular Cycles:</strong> Cycles vary by 7+ days consistently</li>
                <li><strong>Bleeding Between Periods:</strong> Spotting or bleeding mid-cycle</li>
                <li><strong>Periods Lasting 7+ Days:</strong> Unusually long menstrual flow</li>
              </ul>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Lifestyle Factors Affecting Cycles</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Nutrition:</strong> Balanced diet supports regular cycles</li>
              <li><strong>Exercise:</strong> Moderate activity is beneficial</li>
              <li><strong>Sleep:</strong> Quality rest regulates hormones</li>
              <li><strong>Stress Management:</strong> Relaxation techniques help</li>
              <li><strong>Weight Management:</strong> Healthy BMI supports regularity</li>
              <li><strong>Substance Use:</strong> Avoid smoking and excessive alcohol</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Cycle-Synced Living</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">High Energy Phases</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Exercise:</strong> High-intensity workouts</li>
                  <li><strong>Social Activities:</strong> Networking and socializing</li>
                  <li><strong>Creative Work:</strong> Brainstorming and innovation</li>
                  <li><strong>Planning:</strong> Strategic thinking and goal setting</li>
                  <li><strong>Learning:</strong> New skills and knowledge acquisition</li>
                  <li><strong>Decision Making:</strong> Important life choices</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Low Energy Phases</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Exercise:</strong> Gentle yoga and walking</li>
                  <li><strong>Activities:</strong> Self-care and relaxation</li>
                  <li><strong>Work:</strong> Administrative tasks and organization</li>
                  <li><strong>Social:</strong> Quiet time with close friends</li>
                  <li><strong>Creativity:</strong> Refining existing projects</li>
                  <li><strong>Reflection:</strong> Journaling and meditation</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Tracking Methods</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Calendar Method:</strong> Mark period start dates</li>
              <li><strong>Mobile Apps:</strong> Digital period tracking</li>
              <li><strong>Symptom Logging:</strong> Record physical and emotional changes</li>
              <li><strong>Temperature Tracking:</strong> Monitor basal body temperature</li>
              <li><strong>Cervical Mucus:</strong> Track fertility signs</li>
              <li><strong>Professional Monitoring:</strong> Medical cycle analysis</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Period Preparation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Supply Stocking:</strong> Keep period products on hand</li>
              <li><strong>Pain Management:</strong> Have pain relief options ready</li>
              <li><strong>Comfort Items:</strong> Heating pads, comfortable clothes</li>
              <li><strong>Nutrition Planning:</strong> Iron-rich foods and hydration</li>
              <li><strong>Schedule Adjustment:</strong> Plan lighter activities</li>
              <li><strong>Self-Care Planning:</strong> Relaxation and stress reduction</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-rose-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Remember that every woman's cycle is unique, and variations are normal. Use this calculator as 
                a guide, but also pay attention to your body's signals and patterns. Track not just your period 
                dates, but also symptoms, energy levels, and mood changes throughout your cycle. This holistic 
                approach will give you a complete picture of your reproductive health and help you make informed 
                decisions about your health and lifestyle.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
