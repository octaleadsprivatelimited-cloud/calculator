'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Calendar } from 'lucide-react'

export default function OvulationCalculator() {
  const [lastPeriod, setLastPeriod] = useState('')
  const [cycleLength, setCycleLength] = useState('28')
  const [showResults, setShowResults] = useState(false)

  const calculateOvulation = useCallback(() => {
    if (!lastPeriod) return { 
      ovulationDate: '', 
      fertileWindow: { start: '', end: '' }, 
      nextPeriod: '',
      recommendations: []
    }

    const lastPeriodDate = new Date(lastPeriod)
    const cycle = parseInt(cycleLength) || 28

    // Calculate ovulation date (typically 14 days before next period)
    const ovulationDate = new Date(lastPeriodDate)
    ovulationDate.setDate(lastPeriodDate.getDate() + cycle - 14)

    // Calculate fertile window (5 days before ovulation + day of ovulation)
    const fertileStart = new Date(ovulationDate)
    fertileStart.setDate(ovulationDate.getDate() - 5)

    const fertileEnd = new Date(ovulationDate)
    fertileEnd.setDate(ovulationDate.getDate() + 1)

    // Calculate next period
    const nextPeriod = new Date(lastPeriodDate)
    nextPeriod.setDate(lastPeriodDate.getDate() + cycle)

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
    recommendations.push('Track your basal body temperature for more accuracy')
    recommendations.push('Monitor cervical mucus changes')
    recommendations.push('Use ovulation predictor kits for confirmation')
    recommendations.push('Have intercourse every 1-2 days during fertile window')

    return { 
      ovulationDate: formatDate(ovulationDate), 
      fertileWindow: { 
        start: formatDate(fertileStart), 
        end: formatDate(fertileEnd) 
      }, 
      nextPeriod: formatDate(nextPeriod),
      recommendations
    }
  }, [lastPeriod, cycleLength])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setLastPeriod('')
    setCycleLength('28')
    setShowResults(false)
  }

  const result = showResults ? calculateOvulation() : { 
    ovulationDate: '', 
    fertileWindow: { start: '', end: '' }, 
    nextPeriod: '',
    recommendations: []
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
        <div className="flex items-center">
          <Calendar className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Ovulation Calculator</h2>
        </div>
        <p className="text-pink-100 mt-1">Calculate your ovulation date and fertile window</p>
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
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
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
              placeholder="28"
              min="21"
              max="35"
              aria-label="Average cycle length in days"
            />
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-pink-500 hover:bg-pink-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <h3 className="text-lg font-semibold text-pink-800 mb-2">Ovulation Date</h3>
              <div className="text-center">
                <div className="text-2xl font-bold text-pink-600 mb-2">
                  {result.ovulationDate}
                </div>
                <div className="text-pink-700">
                  Most fertile day of your cycle
                </div>
              </div>
            </div>

            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <h3 className="text-lg font-semibold text-pink-800 mb-3">Fertile Window</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-pink-700">Start:</span>
                  <span className="font-semibold text-pink-800">{result.fertileWindow.start}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-700">End:</span>
                  <span className="font-semibold text-pink-800">{result.fertileWindow.end}</span>
                </div>
                <div className="text-center mt-3 text-sm text-pink-600">
                  Best time for conception
                </div>
              </div>
            </div>

            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <h3 className="text-lg font-semibold text-pink-800 mb-2">Next Period</h3>
              <div className="text-center">
                <div className="text-xl font-semibold text-pink-600">
                  {result.nextPeriod}
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <h3 className="text-lg font-semibold text-pink-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-pink-600 mr-2">•</span>
                      <span className="text-pink-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Ovulation Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive Ovulation Calculator helps women track their menstrual cycles and identify 
              their most fertile days for conception planning. This essential tool provides accurate ovulation 
              predictions, fertile window calculations, and personalized recommendations for optimal family 
              planning and reproductive health management.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Ovulation Date:</strong> Most fertile day of your cycle</li>
              <li><strong>Fertile Window:</strong> Optimal time period for conception</li>
              <li><strong>Next Period:</strong> Predicted start of next menstrual cycle</li>
              <li><strong>Cycle Analysis:</strong> Menstrual cycle pattern assessment</li>
              <li><strong>Conception Planning:</strong> Optimal timing for pregnancy</li>
              <li><strong>Health Monitoring:</strong> Cycle regularity tracking</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Menstrual Cycle</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Cycle Phases</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Menstrual Phase:</strong> Days 1-5 (period)</li>
                  <li><strong>Follicular Phase:</strong> Days 6-14 (egg development)</li>
                  <li><strong>Ovulation:</strong> Day 14 (egg release)</li>
                  <li><strong>Luteal Phase:</strong> Days 15-28 (preparation)</li>
                  <li><strong>Cycle Length:</strong> Typically 21-35 days</li>
                  <li><strong>Variability:</strong> Normal to vary by 1-3 days</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Fertility Factors</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Egg Lifespan:</strong> 12-24 hours after ovulation</li>
                  <li><strong>Sperm Survival:</strong> 3-5 days in reproductive tract</li>
                  <li><strong>Fertile Window:</strong> 5-6 days around ovulation</li>
                  <li><strong>Peak Fertility:</strong> Day of ovulation and day before</li>
                  <li><strong>Conception Probability:</strong> 20-30% per cycle</li>
                  <li><strong>Age Impact:</strong> Fertility declines with age</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                <h5 className="font-semibold text-pink-800 mb-1">Ovulation Date</h5>
                <p className="text-pink-700 text-sm">Most fertile day</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Fertile Window</h5>
                <p className="text-purple-700 text-sm">Best conception time</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Next Period</h5>
                <p className="text-blue-700 text-sm">Cycle prediction</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the first day of your last menstrual period and your average cycle length. The calculator 
              will automatically determine your ovulation date, fertile window, and next period prediction. 
              Use these results to plan conception attempts or to track your reproductive health.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Cycle Length Variations</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Short Cycles (21-24 days):</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Ovulation around day 10-12</li>
                    <li>Shorter fertile window</li>
                    <li>May need earlier testing</li>
                    <li>Common in younger women</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Long Cycles (30-35 days):</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Ovulation around day 16-18</li>
                    <li>Longer follicular phase</li>
                    <li>More time for planning</li>
                    <li>Common in older women</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Fertility Tracking Methods</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Calendar Method</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Basal Body Temperature:</strong> Track daily temperature</li>
                  <li><strong>Cervical Mucus:</strong> Monitor consistency changes</li>
                  <li><strong>Ovulation Predictor Kits:</strong> LH surge detection</li>
                  <li><strong>Calendar Tracking:</strong> Period and cycle logging</li>
                  <li><strong>Fertility Apps:</strong> Digital cycle tracking</li>
                  <li><strong>Charting:</strong> Visual fertility signs</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Physical Signs</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Temperature Rise:</strong> 0.5-1°F after ovulation</li>
                  <li><strong>Mucus Changes:</strong> Clear, stretchy consistency</li>
                  <li><strong>Ovulation Pain:</strong> Mild abdominal discomfort</li>
                  <li><strong>Breast Tenderness:</strong> Hormonal changes</li>
                  <li><strong>Libido Increase:</strong> Natural fertility boost</li>
                  <li><strong>Spotting:</strong> Light bleeding mid-cycle</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Conception Planning</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Timing:</strong> Intercourse 2-3 days before ovulation</li>
              <li><strong>Frequency:</strong> Every 1-2 days during fertile window</li>
              <li><strong>Position:</strong> Deep penetration may help</li>
              <li><strong>Lubrication:</strong> Use fertility-friendly options</li>
              <li><strong>Relaxation:</strong> Reduce stress and pressure</li>
              <li><strong>Health Optimization:</strong> Preconception care</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Fertility</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Age Considerations</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>20s:</strong> Peak fertility years</li>
                  <li><strong>30s:</strong> Gradual fertility decline</li>
                  <li><strong>35+:</strong> More significant decline</li>
                  <li><strong>40+:</strong> Advanced maternal age</li>
                  <li><strong>Egg Quality:</strong> Declines with age</li>
                  <li><strong>Pregnancy Risks:</strong> Increase with age</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Lifestyle Factors</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Weight Management:</strong> BMI affects hormones</li>
                  <li><strong>Exercise:</strong> Moderate activity is best</li>
                  <li><strong>Nutrition:</strong> Balanced, nutrient-rich diet</li>
                  <li><strong>Stress Management:</strong> High stress affects cycles</li>
                  <li><strong>Sleep Quality:</strong> Hormone regulation</li>
                  <li><strong>Substance Use:</strong> Avoid smoking/alcohol</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Health Conditions</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Polycystic Ovary Syndrome (PCOS):</strong> Irregular cycles</li>
              <li><strong>Endometriosis:</strong> Painful periods, fertility issues</li>
              <li><strong>Thyroid Disorders:</strong> Hormone imbalances</li>
              <li><strong>Diabetes:</strong> Blood sugar affects fertility</li>
              <li><strong>Autoimmune Conditions:</strong> May impact reproduction</li>
              <li><strong>Previous Surgeries:</strong> Scarring concerns</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">When to Seek Help</h4>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
              <h5 className="font-semibold text-yellow-800 mb-2">Consult a Doctor If:</h5>
              <ul className="list-disc list-inside text-yellow-700 space-y-1 text-sm">
                <li><strong>Under 35:</strong> Trying for 12+ months</li>
                <li><strong>35+:</strong> Trying for 6+ months</li>
                <li><strong>Irregular Cycles:</strong> Cycles vary by 7+ days</li>
                <li><strong>Painful Periods:</strong> Severe menstrual pain</li>
                <li><strong>Previous Issues:</strong> History of fertility problems</li>
                <li><strong>Health Concerns:</strong> Underlying medical conditions</li>
              </ul>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Preconception Health</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Medical Preparation</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Preconception Visit:</strong> Health assessment</li>
                  <li><strong>Vaccinations:</strong> Update immunizations</li>
                  <li><strong>Medication Review:</strong> Safe for pregnancy</li>
                  <li><strong>Genetic Testing:</strong> Family history review</li>
                  <li><strong>Dental Health:</strong> Address oral health</li>
                  <li><strong>Chronic Conditions:</strong> Optimize management</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Lifestyle Optimization</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Folic Acid:</strong> 400-800 mcg daily</li>
                  <li><strong>Healthy Weight:</strong> Achieve optimal BMI</li>
                  <li><strong>Exercise Routine:</strong> Regular physical activity</li>
                  <li><strong>Stress Reduction:</strong> Relaxation techniques</li>
                  <li><strong>Sleep Hygiene:</strong> Quality rest habits</li>
                  <li><strong>Social Support:</strong> Build strong relationships</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Myths and Facts</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Fertility Myths</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Daily Intercourse:</strong> Not necessary</li>
                  <li><strong>Position Matters:</strong> Minimal impact</li>
                  <li><strong>Orgasm Required:</strong> Not for conception</li>
                  <li><strong>Lying Down:</strong> No proven benefit</li>
                  <li><strong>Timing Precision:</strong> Fertile window is flexible</li>
                  <li><strong>Stress Impact:</strong> Moderate stress is normal</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Fertility Facts</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Age Matters:</strong> Significant impact on fertility</li>
                  <li><strong>Cycle Regularity:</strong> Important indicator</li>
                  <li><strong>Health Status:</strong> Affects conception success</li>
                  <li><strong>Lifestyle Choices:</strong> Impact fertility</li>
                  <li><strong>Medical Conditions:</strong> Can affect reproduction</li>
                  <li><strong>Professional Help:</strong> Available when needed</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Tracking and Monitoring</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Period Logging:</strong> Record start dates consistently</li>
              <li><strong>Symptom Tracking:</strong> Note physical changes</li>
              <li><strong>Temperature Charting:</strong> Daily BBT monitoring</li>
              <li><strong>Mucus Observations:</strong> Cervical mucus changes</li>
              <li><strong>Ovulation Testing:</strong> LH surge detection</li>
              <li><strong>Professional Monitoring:</strong> Ultrasound tracking</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-pink-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Remember that every woman's cycle is unique, and variations are normal. The ovulation calculator 
                provides estimates based on averages, but your actual ovulation may vary. Combine calendar 
                tracking with physical signs like temperature changes and cervical mucus for the most accurate 
                fertility prediction. Don't become overly stressed about perfect timing - the fertile window 
                gives you several days for conception attempts. Focus on maintaining good overall health and 
                reducing stress, as these factors significantly impact fertility. If you're having trouble 
                conceiving, don't hesitate to seek professional help early.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

