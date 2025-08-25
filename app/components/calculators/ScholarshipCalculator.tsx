'use client'

import React, { useState, useCallback } from 'react'
import { GraduationCap, Calculator, TrendingUp, Share2, Download, Printer, BookOpen } from 'lucide-react'
import ShareModal from '../ShareModal'

interface Scholarship {
  name: string
  minGPA: number
  maxIncome: number
  amount: number
  requirements: string[]
  category: string
}

const scholarships: Scholarship[] = [
  { name: 'Academic Excellence', minGPA: 3.8, maxIncome: 100000, amount: 5000, requirements: ['High GPA', 'Strong academics'], category: 'Academic' },
  { name: 'Need-Based Grant', minGPA: 3.0, maxIncome: 50000, amount: 8000, requirements: ['Financial need', 'Good standing'], category: 'Need-Based' },
  { name: 'Merit Scholarship', minGPA: 3.5, maxIncome: 150000, amount: 3000, requirements: ['Merit-based', 'Leadership'], category: 'Merit' },
  { name: 'First Generation', minGPA: 3.2, maxIncome: 75000, amount: 6000, requirements: ['First in family', 'College student'], category: 'Special' },
  { name: 'Minority Student', minGPA: 3.0, maxIncome: 80000, amount: 4000, requirements: ['Underrepresented group', 'Good standing'], category: 'Special' },
  { name: 'Community Service', minGPA: 3.3, maxIncome: 120000, amount: 2500, requirements: ['Volunteer hours', 'Service record'], category: 'Service' },
  { name: 'STEM Scholarship', minGPA: 3.6, maxIncome: 100000, amount: 7000, requirements: ['STEM major', 'High GPA'], category: 'Academic' },
  { name: 'Athletic Scholarship', minGPA: 2.8, maxIncome: 200000, amount: 10000, requirements: ['Athletic ability', 'Team member'], category: 'Athletic' }
]

export default function ScholarshipCalculator() {
  const [studentInfo, setStudentInfo] = useState({
    gpa: '',
    familyIncome: '',
    isFirstGeneration: false,
    isMinority: false,
    hasCommunityService: false,
    isStemMajor: false,
    isAthlete: false,
    volunteerHours: ''
  })
  const [showShareModal, setShowShareModal] = useState(false)

  const updateStudentInfo = (field: string, value: string | boolean) => {
    setStudentInfo(prev => ({ ...prev, [field]: value }))
  }

  const calculateEligibility = useCallback(() => {
    const gpa = parseFloat(studentInfo.gpa) || 0
    const familyIncome = parseFloat(studentInfo.familyIncome) || 0
    const volunteerHours = parseFloat(studentInfo.volunteerHours) || 0

    const eligibleScholarships = scholarships.map(scholarship => {
      let isEligible = true
      let reasons: string[] = []
      let score = 0

      // GPA check
      if (gpa < scholarship.minGPA) {
        isEligible = false
        reasons.push(`GPA below ${scholarship.minGPA}`)
      } else {
        score += (gpa - scholarship.minGPA) * 10
      }

      // Income check
      if (familyIncome > scholarship.maxIncome) {
        isEligible = false
        reasons.push(`Income above $${scholarship.maxIncome.toLocaleString()}`)
      } else {
        score += Math.max(0, (scholarship.maxIncome - familyIncome) / 1000)
      }

      // Special requirements
      if (scholarship.category === 'Special' && scholarship.name.includes('First Generation')) {
        if (!studentInfo.isFirstGeneration) {
          isEligible = false
          reasons.push('Not first generation student')
        } else {
          score += 20
        }
      }

      if (scholarship.category === 'Special' && scholarship.name.includes('Minority')) {
        if (!studentInfo.isMinority) {
          isEligible = false
          reasons.push('Not from underrepresented group')
        } else {
          score += 20
        }
      }

      if (scholarship.category === 'Service' && !studentInfo.hasCommunityService) {
        isEligible = false
        reasons.push('No community service record')
      } else if (scholarship.category === 'Service') {
        score += Math.min(volunteerHours, 100) / 10
      }

      if (scholarship.category === 'Academic' && scholarship.name.includes('STEM')) {
        if (!studentInfo.isStemMajor) {
          isEligible = false
          reasons.push('Not STEM major')
        } else {
          score += 15
        }
      }

      if (scholarship.category === 'Athletic' && !studentInfo.isAthlete) {
        isEligible = false
        reasons.push('Not an athlete')
      } else if (scholarship.category === 'Athletic') {
        score += 25
      }

      return {
        ...scholarship,
        isEligible,
        reasons,
        score: Math.round(score * 100) / 100
      }
    })

    const eligible = eligibleScholarships.filter(s => s.isEligible)
    const totalAmount = eligible.reduce((sum, s) => sum + s.amount, 0)
    const sortedEligible = eligible.sort((a, b) => b.score - a.score)

    return {
      eligibleScholarships,
      eligible,
      totalAmount,
      sortedEligible
    }
  }, [studentInfo])

  const handleShare = () => setShowShareModal(true)
  const handlePrint = () => window.print()
  const handleDownload = () => {
    const eligibility = calculateEligibility()
    
    const data = `Scholarship Calculator Results\n\nStudent Profile:\nGPA: ${studentInfo.gpa}\nFamily Income: $${parseFloat(studentInfo.familyIncome || '0').toLocaleString()}\nFirst Generation: ${studentInfo.isFirstGeneration ? 'Yes' : 'No'}\nMinority Student: ${studentInfo.isMinority ? 'Yes' : 'No'}\nCommunity Service: ${studentInfo.hasCommunityService ? 'Yes' : 'No'}\nSTEM Major: ${studentInfo.isStemMajor ? 'Yes' : 'No'}\nAthlete: ${studentInfo.isAthlete ? 'Yes' : 'No'}\n\nEligible Scholarships: ${eligibility.eligible.length}\nTotal Potential Amount: $${eligibility.totalAmount.toLocaleString()}\n\nScholarships:\n${eligibility.sortedEligible.map(s => `${s.name}: $${s.amount.toLocaleString()} (Score: ${s.score})`).join('\n')}`
    
    const blob = new Blob([data], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'scholarship-calculator-results.txt'
    a.click()
    URL.revokeObjectURL(url)
  }

  const eligibility = calculateEligibility()

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <GraduationCap className="w-16 h-16 mr-4 text-purple-600" />
            Scholarship Calculator
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Calculate your eligibility for various scholarships and grants. Find opportunities based on your GPA, income, background, and achievements.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                <Calculator className="w-6 h-6 mr-2 text-purple-600" />
                Student Profile
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">GPA (4.0 scale)</label>
                  <input
                    type="number"
                    value={studentInfo.gpa}
                    onChange={(e) => updateStudentInfo('gpa', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    placeholder="3.5"
                    step="0.01"
                    min="0"
                    max="4"
                    title="Enter your GPA on a 4.0 scale"
                    aria-label="GPA on 4.0 scale"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Family Annual Income ($)</label>
                  <input
                    type="number"
                    value={studentInfo.familyIncome}
                    onChange={(e) => updateStudentInfo('familyIncome', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    placeholder="50000"
                    min="0"
                    title="Enter your family's annual income"
                    aria-label="Family annual income"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Volunteer Hours</label>
                  <input
                    type="number"
                    value={studentInfo.volunteerHours}
                    onChange={(e) => updateStudentInfo('volunteerHours', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:border-purple-500 focus:ring-2 focus:ring-purple-200"
                    placeholder="50"
                    min="0"
                    title="Enter your volunteer hours"
                    aria-label="Volunteer hours"
                  />
                </div>

                <div className="space-y-3">
                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={studentInfo.isFirstGeneration}
                      onChange={(e) => updateStudentInfo('isFirstGeneration', e.target.checked)}
                      className="text-purple-600 focus:ring-purple-500"
                      title="Check if you are a first generation college student"
                      aria-label="First generation college student"
                    />
                    <span className="text-sm text-gray-700">First Generation College Student</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={studentInfo.isMinority}
                      onChange={(e) => updateStudentInfo('isMinority', e.target.checked)}
                      className="text-purple-600 focus:ring-purple-500"
                      title="Check if you are from an underrepresented group"
                      aria-label="Minority student"
                    />
                    <span className="text-sm text-gray-700">Minority/Underrepresented Group</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={studentInfo.hasCommunityService}
                      onChange={(e) => updateStudentInfo('hasCommunityService', e.target.checked)}
                      className="text-purple-600 focus:ring-purple-500"
                      title="Check if you have community service experience"
                      aria-label="Community service experience"
                    />
                    <span className="text-sm text-gray-700">Community Service Experience</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={studentInfo.isStemMajor}
                      onChange={(e) => updateStudentInfo('isStemMajor', e.target.checked)}
                      className="text-purple-600 focus:ring-purple-500"
                      title="Check if you are a STEM major"
                      aria-label="STEM major"
                    />
                    <span className="text-sm text-gray-700">STEM Major</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={studentInfo.isAthlete}
                      onChange={(e) => updateStudentInfo('isAthlete', e.target.checked)}
                      className="text-purple-600 focus:ring-purple-500"
                      title="Check if you are an athlete"
                      aria-label="Athlete"
                    />
                    <span className="text-sm text-gray-700">Athlete</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Examples</h3>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setStudentInfo({
                      gpa: '3.8',
                      familyIncome: '45000',
                      isFirstGeneration: true,
                      isMinority: false,
                      hasCommunityService: true,
                      isStemMajor: true,
                      isAthlete: false,
                      volunteerHours: '75'
                    })
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: high-achieving first generation student"
                  aria-label="Set example: high-achieving first generation student"
                >
                  🎓 High-Achieving First Gen (3.8 GPA, STEM, Service)
                </button>
                <button
                  onClick={() => {
                    setStudentInfo({
                      gpa: '3.2',
                      familyIncome: '35000',
                      isFirstGeneration: false,
                      isMinority: true,
                      hasCommunityService: false,
                      isStemMajor: false,
                      isAthlete: true,
                      volunteerHours: '20'
                    })
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: minority athlete student"
                  aria-label="Set example: minority athlete student"
                >
                  🏃 Minority Athlete (3.2 GPA, Low Income, Athletic)
                </button>
                <button
                  onClick={() => {
                    setStudentInfo({
                      gpa: '3.9',
                      familyIncome: '80000',
                      isFirstGeneration: false,
                      isMinority: false,
                      hasCommunityService: true,
                      isStemMajor: true,
                      isAthlete: false,
                      volunteerHours: '100'
                    })
                  }}
                  className="w-full text-left p-2 bg-gray-50 rounded-lg hover:bg-gray-100 text-sm"
                  title="Set example: high GPA STEM student"
                  aria-label="Set example: high GPA STEM student"
                >
                  🔬 High GPA STEM (3.9 GPA, Service, STEM Major)
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
                  <TrendingUp className="w-6 h-6 mr-2 text-purple-600" />
                  Scholarship Results
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="bg-purple-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-800 mb-4">Summary</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-purple-600">Eligible Scholarships:</span>
                        <span className="font-semibold text-purple-800">{eligibility.eligible.length}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-600">Total Potential:</span>
                        <span className="font-semibold text-purple-800">${eligibility.totalAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-600">Your GPA:</span>
                        <span className="font-semibold text-purple-800">{studentInfo.gpa || 'Not entered'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-600">Family Income:</span>
                        <span className="font-semibold text-purple-800">
                          {studentInfo.familyIncome ? `$${parseFloat(studentInfo.familyIncome).toLocaleString()}` : 'Not entered'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-indigo-50 p-6 rounded-lg">
                    <h3 className="text-lg font-semibold text-indigo-800 mb-4">Profile Highlights</h3>
                    <div className="space-y-2">
                      {studentInfo.isFirstGeneration && <div className="text-sm text-indigo-700">✅ First Generation Student</div>}
                      {studentInfo.isMinority && <div className="text-sm text-indigo-700">✅ Minority/Underrepresented</div>}
                      {studentInfo.hasCommunityService && <div className="text-sm text-indigo-700">✅ Community Service Experience</div>}
                      {studentInfo.isStemMajor && <div className="text-sm text-indigo-700">✅ STEM Major</div>}
                      {studentInfo.isAthlete && <div className="text-sm text-indigo-700">✅ Athlete</div>}
                      {parseFloat(studentInfo.volunteerHours || '0') > 0 && (
                        <div className="text-sm text-indigo-700">✅ {studentInfo.volunteerHours} Volunteer Hours</div>
                      )}
                      {!studentInfo.isFirstGeneration && !studentInfo.isMinority && !studentInfo.hasCommunityService && !studentInfo.isStemMajor && !studentInfo.isAthlete && parseFloat(studentInfo.volunteerHours || '0') === 0 && (
                        <div className="text-sm text-gray-500">No special qualifications selected</div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Eligible Scholarships (Ranked by Score)</h3>
                  
                  {eligibility.sortedEligible.length > 0 ? (
                    <div className="space-y-4">
                      {eligibility.sortedEligible.map((scholarship, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-800">{scholarship.name}</h4>
                              <p className="text-sm text-gray-600">{scholarship.category} • Score: {scholarship.score}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-2xl font-bold text-green-600">${scholarship.amount.toLocaleString()}</div>
                              <div className="text-sm text-gray-500">Amount</div>
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span className="text-gray-600">Min GPA:</span>
                              <span className="ml-2 font-medium">{scholarship.minGPA}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Max Income:</span>
                              <span className="ml-2 font-medium">${scholarship.maxIncome.toLocaleString()}</span>
                            </div>
                          </div>
                          
                          <div className="mt-3">
                            <div className="text-sm text-gray-600 mb-1">Requirements:</div>
                            <div className="flex flex-wrap gap-2">
                              {scholarship.requirements.map((req, reqIndex) => (
                                <span key={reqIndex} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600">No eligible scholarships found. Try adjusting your profile or check the requirements.</p>
                    </div>
                  )}
                </div>

                <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">💡 Tips</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Apply to multiple scholarships to increase your chances</li>
                    <li>• Focus on scholarships where you meet all requirements</li>
                    <li>• Keep your GPA high and maintain good standing</li>
                    <li>• Document all community service and extracurricular activities</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap gap-4 justify-center">
                <button
                  onClick={handleShare}
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  title="Share scholarship calculator results"
                  aria-label="Share scholarship calculator results"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  title="Download results as text file"
                  aria-label="Download scholarship calculator results"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button
                  onClick={handlePrint}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  title="Print scholarship calculator results"
                  aria-label="Print scholarship calculator results"
                >
                  <Printer className="w-5 h-5" />
                  Print
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Comprehensive Description Section */}
        <div className="mt-8 bg-white rounded-2xl shadow-lg p-6 border-2 border-blue-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">About Scholarship Calculator</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Purpose & Functionality</h3>
              <p className="text-gray-700 mb-3">
                This comprehensive scholarship calculator helps students identify and evaluate scholarship opportunities 
                based on their academic profile, financial situation, and personal characteristics. It analyzes eligibility 
                across multiple scholarship categories and provides personalized recommendations to maximize funding potential.
              </p>
              <p className="text-gray-700">
                The calculator evaluates academic merit, financial need, special circumstances, and extracurricular 
                activities to match students with the most suitable scholarship opportunities for their situation.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Scholarship Categories Explained</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Academic Scholarships</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Merit-Based:</strong> High GPA and academic achievement</li>
                    <li><strong>Subject-Specific:</strong> STEM, humanities, arts focus</li>
                    <li><strong>Test Scores:</strong> SAT, ACT, AP exam performance</li>
                    <li><strong>Class Rank:</strong> Top percentile in graduating class</li>
                    <li><strong>Research Projects:</strong> Academic research experience</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Need-Based Scholarships</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Income Requirements:</strong> Family financial situation</li>
                    <li><strong>FAFSA Completion:</strong> Federal aid application</li>
                    <li><strong>Financial Hardship:</strong> Special circumstances</li>
                    <li><strong>Dependency Status:</strong> Independent vs. dependent student</li>
                    <li><strong>Asset Considerations:</strong> Family assets and savings</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Special Category Scholarships</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Demographic & Background</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>First Generation:</strong> First in family to attend college</li>
                    <li><strong>Minority Students:</strong> Underrepresented groups</li>
                    <li><strong>Women in STEM:</strong> Gender-specific opportunities</li>
                    <li><strong>Veterans:</strong> Military service recognition</li>
                    <li><strong>International Students:</strong> Global diversity focus</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Activities & Interests</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Community Service:</strong> Volunteer work and leadership</li>
                    <li><strong>Athletics:</strong> Sports participation and achievement</li>
                    <li><strong>Arts & Music:</strong> Creative talent and performance</li>
                    <li><strong>Leadership:</strong> Student government and clubs</li>
                    <li><strong>Work Experience:</strong> Professional development</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Eligibility Scoring System</h3>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h4 className="font-semibold text-gray-800 mb-2">How Scores Are Calculated</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>GPA Scoring:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Base requirement must be met</li>
                      <li>Bonus points for exceeding minimum</li>
                      <li>Higher GPA = higher scholarship potential</li>
                    </ul>
                  </div>
                  <div>
                    <p><strong>Income Scoring:</strong></p>
                    <ul className="list-disc list-inside text-gray-700 space-y-1">
                      <li>Lower income = higher score</li>
                      <li>Meets financial need criteria</li>
                      <li>Demonstrates financial hardship</li>
                    </ul>
                  </div>
                </div>
                <p className="text-gray-700 mt-3 text-sm">
                  <strong>Note:</strong> Each scholarship has specific requirements that must be met before scoring begins. 
                  Meeting all requirements is essential for eligibility consideration.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Scholarship Application Strategy</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Application Timeline</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Early Bird:</strong> Apply 6-12 months in advance</li>
                    <li><strong>Regular Deadlines:</strong> 3-6 months before school year</li>
                    <li><strong>Rolling Applications:</strong> Apply anytime during cycle</li>
                    <li><strong>Multiple Cycles:</strong> Some offer fall/spring terms</li>
                    <li><strong>Renewal Deadlines:</strong> Maintain eligibility annually</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Application Components</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li><strong>Personal Statement:</strong> Compelling narrative</li>
                    <li><strong>Letters of Recommendation:</strong> Strong references</li>
                    <li><strong>Transcripts:</strong> Academic record</li>
                    <li><strong>Resume/CV:</strong> Activities and achievements</li>
                    <li><strong>Financial Documents:</strong> Income verification</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Maximizing Scholarship Success</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>Academic Excellence:</strong> Maintain high GPA and strong academic record</li>
                <li><strong>Extracurricular Involvement:</strong> Participate in meaningful activities and leadership roles</li>
                <li><strong>Community Service:</strong> Document volunteer hours and community impact</li>
                <li><strong>Professional Development:</strong> Seek internships, research opportunities, and work experience</li>
                <li><strong>Strong Applications:</strong> Write compelling essays and secure excellent recommendations</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Common Scholarship Sources</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">Institutional Sources</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>University merit scholarships</li>
                    <li>Department-specific awards</li>
                    <li>Alumni association grants</li>
                    <li>Honors program funding</li>
                    <li>Transfer student scholarships</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">External Sources</h4>
                  <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                    <li>Private foundations</li>
                    <li>Professional associations</li>
                    <li>Community organizations</li>
                    <li>Corporate sponsorships</li>
                    <li>Government programs</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">Financial Aid Integration</h3>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li><strong>FAFSA Priority:</strong> Complete FAFSA early for maximum aid consideration</li>
                <li><strong>Scholarship Coordination:</strong> Understand how scholarships affect other aid</li>
                <li><strong>Package Optimization:</strong> Balance grants, loans, and scholarships</li>
                <li><strong>Renewal Planning:</strong> Plan for multi-year funding sustainability</li>
                <li><strong>Tax Implications:</strong> Understand scholarship taxability rules</li>
              </ul>
            </div>

            <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-500">
              <h4 className="font-semibold text-gray-800 mb-2">Pro Tips</h4>
              <ul className="text-gray-700 space-y-1 text-sm">
                <li>• Apply to 10-15 scholarships to maximize your chances of success</li>
                <li>• Customize each application to match the specific scholarship requirements</li>
                <li>• Keep detailed records of all activities, awards, and community service</li>
                <li>• Start your scholarship search early - many deadlines are months before school starts</li>
                <li>• Don't overlook smaller scholarships - they add up and have less competition</li>
                <li>• Network with professors, advisors, and professionals for recommendation letters</li>
              </ul>
            </div>
          </div>
        </div>

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

      {showShareModal && (
        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          calculation={{
            expression: `${eligibility.eligible.length} eligible scholarships`,
            result: `$${eligibility.totalAmount.toLocaleString()} total potential`,
            timestamp: new Date()
          }}
        />
      )}
    </div>
  )
}
