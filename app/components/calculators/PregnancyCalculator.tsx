'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Heart } from 'lucide-react'

export default function PregnancyCalculator() {
  const [lastPeriod, setLastPeriod] = useState('')
  const [cycleLength, setCycleLength] = useState('28')
  const [showResults, setShowResults] = useState(false)

  const calculatePregnancy = useCallback(() => {
    if (!lastPeriod) return { dueDate: '', currentWeek: 0, trimester: '', milestones: [] }

    const lastPeriodDate = new Date(lastPeriod)
    const cycle = parseInt(cycleLength) || 28

    // Due date calculation (LMP + 280 days)
    const dueDate = new Date(lastPeriodDate)
    dueDate.setDate(lastPeriodDate.getDate() + 280)

    // Current week calculation
    const today = new Date()
    const daysSinceLMP = Math.floor((today.getTime() - lastPeriodDate.getTime()) / (1000 * 60 * 60 * 24))
    const currentWeek = Math.floor(daysSinceLMP / 7)

    // Trimester calculation
    let trimester = ''
    if (currentWeek < 13) trimester = 'First Trimester'
    else if (currentWeek < 27) trimester = 'Second Trimester'
    else trimester = 'Third Trimester'

    // Key milestones
    const milestones = []
    if (currentWeek >= 4) milestones.push('Missed period, pregnancy test positive')
    if (currentWeek >= 6) milestones.push('Heartbeat begins, major organs form')
    if (currentWeek >= 8) milestones.push('All major organs developed')
    if (currentWeek >= 12) milestones.push('End of first trimester, reduced miscarriage risk')
    if (currentWeek >= 16) milestones.push('Gender can be determined via ultrasound')
    if (currentWeek >= 20) milestones.push('Anatomy scan, halfway point')
    if (currentWeek >= 24) milestones.push('Viability milestone reached')
    if (currentWeek >= 28) milestones.push('Third trimester begins')
    if (currentWeek >= 32) milestones.push('Rapid brain development')
    if (currentWeek >= 36) milestones.push('Baby is considered full-term soon')
    if (currentWeek >= 37) milestones.push('Full-term pregnancy')
    if (currentWeek >= 40) milestones.push('Due date reached')

    const formatDate = (date: Date) => {
      return date.toLocaleDateString('en-US', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    }

    return { 
      dueDate: formatDate(dueDate), 
      currentWeek: Math.max(0, currentWeek), 
      trimester, 
      milestones: milestones.slice(-5) // Show last 5 relevant milestones
    }
  }, [lastPeriod, cycleLength])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setLastPeriod('')
    setCycleLength('28')
    setShowResults(false)
  }

  const result = showResults ? calculatePregnancy() : { dueDate: '', currentWeek: 0, trimester: '', milestones: [] }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 px-6 py-4">
        <div className="flex items-center">
          <Heart className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Pregnancy Calculator</h2>
        </div>
        <p className="text-pink-100 mt-1">Calculate your due date and pregnancy progress</p>
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
              <h3 className="text-lg font-semibold text-pink-800 mb-2">Pregnancy Progress</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-pink-700">Current Week:</span>
                  <span className="font-semibold text-pink-800">Week {result.currentWeek}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-700">Trimester:</span>
                  <span className="font-semibold text-pink-800">{result.trimester}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-pink-700">Due Date:</span>
                  <span className="font-semibold text-pink-800">{result.dueDate}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
              <h3 className="text-lg font-semibold text-pink-800 mb-3">Recent Milestones</h3>
              <div className="space-y-2">
                {result.milestones.length > 0 ? (
                  result.milestones.map((milestone, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-pink-600 mr-2">•</span>
                      <span className="text-pink-700">{milestone}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-pink-600">Enter your last period date to see milestones</p>
                )}
              </div>
            </div>

            {result.currentWeek > 0 && (
              <div className="p-4 bg-pink-50 rounded-lg border border-pink-200">
                <h3 className="text-lg font-semibold text-pink-800 mb-3">Progress Bar</h3>
                <div className="w-full bg-pink-200 rounded-full h-3">
                  <div 
                    className="bg-pink-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (result.currentWeek / 40) * 100)}%` }}
                  ></div>
                </div>
                <div className="text-center mt-2 text-sm text-pink-600">
                  {result.currentWeek} of 40 weeks completed
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Pregnancy Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive Pregnancy Calculator helps expectant mothers track their pregnancy progress, 
              determine due dates, and monitor important developmental milestones. This essential tool provides 
              accurate pregnancy dating, trimester information, and personalized guidance for optimal prenatal 
              care and pregnancy planning.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Due Date:</strong> Estimated delivery date based on last period</li>
              <li><strong>Current Week:</strong> Exact pregnancy week and progress</li>
              <li><strong>Trimester:</strong> Current pregnancy trimester (1st, 2nd, or 3rd)</li>
              <li><strong>Pregnancy Progress:</strong> Visual representation of pregnancy timeline</li>
              <li><strong>Developmental Milestones:</strong> Key fetal development stages</li>
              <li><strong>Prenatal Care Timeline:</strong> Important medical appointment schedule</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-pink-50 p-3 rounded-lg border border-pink-200">
                <h5 className="font-semibold text-pink-800 mb-1">Current Week</h5>
                <p className="text-pink-700 text-sm">Pregnancy progress</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Trimester</h5>
                <p className="text-blue-700 text-sm">Pregnancy stage</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Due Date</h5>
                <p className="text-green-700 text-sm">Expected delivery</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Progress</h5>
                <p className="text-purple-700 text-sm">Visual timeline</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter the first day of your last menstrual period and your average cycle length. The calculator will 
              automatically determine your due date, current pregnancy week, trimester, and provide a visual 
              progress bar showing your pregnancy journey.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Pregnancy Dating Methods</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Last Menstrual Period (LMP)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Most Common Method:</strong> Used by healthcare providers</li>
                  <li><strong>Calculation:</strong> LMP + 280 days (40 weeks)</li>
                  <li><strong>Accuracy:</strong> ±2 weeks for most pregnancies</li>
                  <li><strong>Best For:</strong> Regular 28-day cycles</li>
                  <li><strong>Limitations:</strong> Less accurate for irregular cycles</li>
                  <li><strong>Medical Standard:</strong> Widely accepted in healthcare</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Ultrasound Dating</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Most Accurate:</strong> First trimester ultrasound</li>
                  <li><strong>Measurement:</strong> Crown-rump length (CRL)</li>
                  <li><strong>Timing:</strong> 8-13 weeks gestation</li>
                  <li><strong>Accuracy:</strong> ±3-5 days</li>
                  <li><strong>Medical Use:</strong> Confirms or adjusts LMP dates</li>
                  <li><strong>Standard Practice:</strong> Routine prenatal care</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Pregnancy Trimesters</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-2">First Trimester</h5>
                <p className="text-blue-700 text-sm mb-2"><strong>Weeks 1-13</strong></p>
                <ul className="list-disc list-inside text-blue-700 space-y-1 text-xs">
                  <li>Fertilization and implantation</li>
                  <li>Major organ development</li>
                  <li>Morning sickness common</li>
                  <li>Fatigue and mood changes</li>
                  <li>Critical development period</li>
                  <li>Prenatal vitamins essential</li>
                </ul>
              </div>
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-2">Second Trimester</h5>
                <p className="text-green-700 text-sm mb-2"><strong>Weeks 14-27</strong></p>
                <ul className="list-disc list-inside text-green-700 space-y-1 text-xs">
                  <li>Fetal movement begins</li>
                  <li>Gender determination possible</li>
                  <li>Energy levels improve</li>
                  <li>Baby bump becomes visible</li>
                  <li>Most comfortable trimester</li>
                  <li>Anatomy scan scheduled</li>
                </ul>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-2">Third Trimester</h5>
                <p className="text-purple-700 text-sm mb-2"><strong>Weeks 28-40</strong></p>
                <ul className="list-disc list-inside text-purple-700 space-y-1 text-xs">
                  <li>Rapid fetal growth</li>
                  <li>Braxton Hicks contractions</li>
                  <li>Frequent bathroom visits</li>
                  <li>Difficulty sleeping</li>
                  <li>Preparation for labor</li>
                  <li>Weekly doctor visits</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Key Developmental Milestones</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>First Trimester Milestones:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Week 4: Heart begins beating</li>
                    <li>Week 6: Neural tube closes</li>
                    <li>Week 8: All major organs form</li>
                    <li>Week 10: Fetus becomes "baby"</li>
                    <li>Week 12: Risk of miscarriage decreases</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Second Trimester Milestones:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Week 16: Gender visible on ultrasound</li>
                    <li>Week 20: Anatomy scan</li>
                    <li>Week 24: Viability milestone</li>
                    <li>Week 26: Eyes open</li>
                    <li>Week 27: Brain growth spurt</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Prenatal Care Schedule</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>First Trimester:</strong> Monthly visits, blood tests, ultrasound</li>
              <li><strong>Second Trimester:</strong> Monthly visits, anatomy scan, glucose test</li>
              <li><strong>Third Trimester:</strong> Bi-weekly then weekly visits, group B strep test</li>
              <li><strong>Special Tests:</strong> Genetic screening, gestational diabetes testing</li>
              <li><strong>Immunizations:</strong> Tdap vaccine, flu shot (if in season)</li>
              <li><strong>Education:</strong> Childbirth classes, breastfeeding preparation</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Pregnancy Symptoms by Trimester</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">First Trimester Symptoms</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Morning Sickness:</strong> Nausea and vomiting</li>
                  <li><strong>Fatigue:</strong> Extreme tiredness</li>
                  <li><strong>Breast Changes:</strong> Tenderness and enlargement</li>
                  <li><strong>Frequent Urination:</strong> Increased bathroom visits</li>
                  <li><strong>Food Aversions:</strong> Strong dislikes to certain foods</li>
                  <li><strong>Mood Swings:</strong> Emotional changes</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Second & Third Trimester Symptoms</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Back Pain:</strong> Growing uterus pressure</li>
                  <li><strong>Heartburn:</strong> Hormonal changes</li>
                  <li><strong>Swelling:</strong> Fluid retention</li>
                  <li><strong>Braxton Hicks:</strong> Practice contractions</li>
                  <li><strong>Shortness of Breath:</strong> Uterus pushing on diaphragm</li>
                  <li><strong>Sleep Issues:</strong> Discomfort and frequent urination</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Nutrition During Pregnancy</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Prenatal Vitamins:</strong> Folic acid, iron, calcium, DHA</li>
              <li><strong>Protein:</strong> Essential for fetal growth and development</li>
              <li><strong>Fruits & Vegetables:</strong> Vitamins, minerals, and fiber</li>
              <li><strong>Whole Grains:</strong> Complex carbohydrates and B vitamins</li>
              <li><strong>Healthy Fats:</strong> Omega-3 fatty acids for brain development</li>
              <li><strong>Hydration:</strong> 8-10 glasses of water daily</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Exercise and Pregnancy</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Safe Exercises</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Walking:</strong> Low-impact cardiovascular exercise</li>
                  <li><strong>Swimming:</strong> Full-body workout with support</li>
                  <li><strong>Prenatal Yoga:</strong> Flexibility and relaxation</li>
                  <li><strong>Stationary Cycling:</strong> Low-impact cardio</li>
                  <li><strong>Light Strength Training:</strong> Maintain muscle tone</li>
                  <li><strong>Pelvic Floor Exercises:</strong> Prepare for labor</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Exercises to Avoid</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Contact Sports:</strong> Risk of abdominal trauma</li>
                  <li><strong>High-Impact Activities:</strong> Jumping and bouncing</li>
                  <li><strong>Hot Yoga:</strong> Risk of overheating</li>
                  <li><strong>Scuba Diving:</strong> Pressure changes</li>
                  <li><strong>Downhill Skiing:</strong> Risk of falls</li>
                  <li><strong>Horseback Riding:</strong> Risk of falls</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">When to Call Your Doctor</h4>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
              <h5 className="font-semibold text-yellow-800 mb-2">Emergency Symptoms:</h5>
              <ul className="list-disc list-inside text-yellow-700 space-y-1 text-sm">
                <li><strong>Severe Abdominal Pain:</strong> Sharp or persistent pain</li>
                <li><strong>Heavy Vaginal Bleeding:</strong> Soaking through pads</li>
                <li><strong>Severe Headache:</strong> Especially with vision changes</li>
                <li><strong>Decreased Fetal Movement:</strong> Less than 10 movements in 2 hours</li>
                <li><strong>Water Breaking:</strong> Fluid leakage before 37 weeks</li>
                <li><strong>High Fever:</strong> 100.4°F or higher</li>
              </ul>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Pregnancy Planning Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Financial Planning:</strong> Budget for medical costs and baby expenses</li>
              <li><strong>Work Arrangements:</strong> Plan maternity leave and work accommodations</li>
              <li><strong>Support System:</strong> Build network of family and friends</li>
              <li><strong>Childbirth Education:</strong> Take classes to prepare for labor</li>
              <li><strong>Baby Registry:</strong> Research and register for essential items</li>
              <li><strong>Postpartum Planning:</strong> Arrange help for after baby arrives</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Pregnancy Myths</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Myths Debunked</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Heartburn = Hairy Baby:</strong> No scientific basis</li>
                  <li><strong>Eating for Two:</strong> Only 300 extra calories needed</li>
                  <li><strong>No Exercise:</strong> Exercise is beneficial and safe</li>
                  <li><strong>Hair Dye Harmful:</strong> Limited absorption, generally safe</li>
                  <li><strong>Sex Causes Labor:</strong> No evidence supports this</li>
                  <li><strong>Morning Sickness Only Mornings:</strong> Can occur anytime</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Evidence-Based Facts</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Folic Acid:</strong> Prevents neural tube defects</li>
                  <li><strong>Exercise:</strong> Improves pregnancy outcomes</li>
                  <li><strong>Fish Consumption:</strong> Limit high-mercury fish</li>
                  <li><strong>Caffeine:</strong> Limit to 200mg daily</li>
                  <li><strong>Alcohol:</strong> No safe amount during pregnancy</li>
                  <li><strong>Smoking:</strong> Increases pregnancy complications</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-pink-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Remember that every pregnancy is unique, and your experience may differ from others. Use this 
                calculator as a guide, but always consult with your healthcare provider for personalized medical 
                advice. Track your symptoms, attend all prenatal appointments, and don't hesitate to ask questions. 
                Your healthcare team is there to support you throughout your pregnancy journey and ensure the best 
                possible outcome for both you and your baby.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
