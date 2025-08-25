'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Activity } from 'lucide-react'

export default function GFRCalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [creatinine, setCreatinine] = useState('')
  const [race, setRace] = useState('other')
  const [showResults, setShowResults] = useState(false)

  const calculateGFR = useCallback(() => {
    const a = parseFloat(age) || 0
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    const cr = parseFloat(creatinine) || 0
    if (a === 0 || w === 0 || h === 0 || cr === 0) return { 
      gfr: 0, 
      stage: '', 
      interpretation: '',
      recommendations: [],
      details: {
        cockcroftGault: 0,
        mdrd: 0,
        ckdEpi: 0,
        bsa: 0
      }
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    const weightKg = w * 0.453592
    const heightM = heightCm / 100

    // Calculate BSA using DuBois formula
    const bsa = 0.007184 * Math.pow(weightKg, 0.425) * Math.pow(heightCm, 0.725)

    // Cockcroft-Gault formula
    let cgGFR = 0
    if (gender === 'male') {
      cgGFR = ((140 - a) * weightKg) / (72 * cr)
    } else {
      cgGFR = ((140 - a) * weightKg) / (72 * cr) * 0.85
    }

    // MDRD formula
    let mdrdGFR = 175 * Math.pow(cr, -1.154) * Math.pow(a, -0.203)
    if (gender === 'female') mdrdGFR *= 0.742
    if (race === 'black') mdrdGFR *= 1.212

    // CKD-EPI formula
    let ckdEpiGFR = 0
    if (gender === 'male') {
      if (cr <= 0.9) {
        ckdEpiGFR = 141 * Math.pow(cr / 0.9, -0.411) * Math.pow(0.993, a)
      } else {
        ckdEpiGFR = 141 * Math.pow(cr / 0.9, -1.209) * Math.pow(0.993, a)
      }
    } else {
      if (cr <= 0.7) {
        ckdEpiGFR = 141 * Math.pow(cr / 0.7, -0.329) * Math.pow(0.993, a) * 0.993
      } else {
        ckdEpiGFR = 141 * Math.pow(cr / 0.7, -1.209) * Math.pow(0.993, a) * 0.993
      }
    }

    // Use CKD-EPI as primary result
    const gfr = ckdEpiGFR

    // Determine CKD stage
    let stage = ''
    let interpretation = ''
    if (gfr >= 90) {
      stage = 'Stage 1'
      interpretation = 'Normal or increased GFR with kidney damage'
    } else if (gfr >= 60) {
      stage = 'Stage 2'
      interpretation = 'Mildly decreased GFR with kidney damage'
    } else if (gfr >= 45) {
      stage = 'Stage 3a'
      interpretation = 'Moderately decreased GFR'
    } else if (gfr >= 30) {
      stage = 'Stage 3b'
      interpretation = 'Moderately decreased GFR'
    } else if (gfr >= 15) {
      stage = 'Stage 4'
      interpretation = 'Severely decreased GFR'
    } else {
      stage = 'Stage 5'
      interpretation = 'Kidney failure'
    }

    // Generate recommendations
    const recommendations = []
    if (gfr >= 60) {
      recommendations.push('Monitor kidney function regularly')
      recommendations.push('Maintain healthy lifestyle habits')
    } else if (gfr >= 30) {
      recommendations.push('Consult nephrologist for specialized care')
      recommendations.push('Monitor blood pressure and diabetes control')
      recommendations.push('Consider dietary modifications')
    } else {
      recommendations.push('Immediate medical attention required')
      recommendations.push('Prepare for potential dialysis or transplant')
      recommendations.push('Strict dietary and medication management')
    }

    recommendations.push('Avoid NSAIDs and nephrotoxic medications')
    recommendations.push('Control blood pressure and blood sugar')

    const details = {
      cockcroftGault: cgGFR,
      mdrd: mdrdGFR,
      ckdEpi: ckdEpiGFR,
      bsa: bsa
    }

    return { gfr, stage, interpretation, recommendations, details }
  }, [age, gender, weight, height, creatinine, race])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setAge('')
    setGender('male')
    setWeight('')
    setHeight('')
    setCreatinine('')
    setRace('other')
    setShowResults(false)
  }

  const result = showResults ? calculateGFR() : { 
    gfr: 0, 
    stage: '', 
    interpretation: '',
    recommendations: [],
    details: {
      cockcroftGault: 0,
      mdrd: 0,
      ckdEpi: 0,
      bsa: 0
    }
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 px-6 py-4">
        <div className="flex items-center">
          <Activity className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">GFR Calculator</h2>
        </div>
        <p className="text-teal-100 mt-1">Calculate Glomerular Filtration Rate using multiple formulas</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter age"
                aria-label="Age in years"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Select gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (lbs)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter weight"
                aria-label="Weight in pounds"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (ft or cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter height"
                aria-label="Height in feet or cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Creatinine (mg/dL)
              </label>
              <input
                type="number"
                value={creatinine}
                onChange={(e) => setCreatinine(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                placeholder="Enter creatinine"
                step="0.01"
                aria-label="Serum creatinine in mg/dL"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Race
              </label>
              <select
                value={race}
                onChange={(e) => setRace(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                aria-label="Select race"
              >
                <option value="other">Other</option>
                <option value="black">Black/African American</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-teal-500 hover:bg-teal-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <h3 className="text-lg font-semibold text-teal-800 mb-2">GFR Result</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">
                  {result.gfr.toFixed(1)} mL/min/1.73m²
                </div>
                <div className="text-teal-700">
                  {result.stage} - {result.interpretation}
                </div>
              </div>
            </div>

            <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
              <h3 className="text-lg font-semibold text-teal-800 mb-3">All Formulas Comparison</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-teal-700">Cockcroft-Gault:</span>
                  <span className="font-semibold text-teal-800">{result.details.cockcroftGault?.toFixed(1)} mL/min</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700">MDRD:</span>
                  <span className="font-semibold text-teal-800">{result.details.mdrd?.toFixed(1)} mL/min/1.73m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700">CKD-EPI (Primary):</span>
                  <span className="font-semibold text-teal-800">{result.details.ckdEpi?.toFixed(1)} mL/min/1.73m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-teal-700">Body Surface Area:</span>
                  <span className="font-semibold text-teal-800">{result.details.bsa?.toFixed(2)} m²</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-teal-50 rounded-lg border border-teal-200">
                <h3 className="text-lg font-semibold text-teal-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-teal-600 mr-2">•</span>
                      <span className="text-teal-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About GFR Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive GFR calculator helps healthcare professionals and patients understand 
              kidney function using multiple validated formulas. This essential medical tool provides 
              accurate Glomerular Filtration Rate calculations, kidney disease staging, and clinical 
              recommendations for informed healthcare decisions.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>GFR Values:</strong> Glomerular Filtration Rate in mL/min/1.73m²</li>
              <li><strong>Kidney Disease Staging:</strong> CKD classification (1-5)</li>
              <li><strong>Clinical Interpretation:</strong> Kidney function assessment</li>
              <li><strong>Multiple Formulas:</strong> Cockcroft-Gault, MDRD, CKD-EPI</li>
              <li><strong>Body Surface Area:</strong> BSA calculations for dosing</li>
              <li><strong>Clinical Recommendations:</strong> Evidence-based guidance</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">GFR Calculation Methods</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Cockcroft-Gault Formula</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Formula:</strong> [(140 - age) × weight] ÷ (72 × creatinine)</li>
                  <li><strong>Gender Factor:</strong> × 0.85 for females</li>
                  <li><strong>Advantages:</strong> Simple, widely used</li>
                  <li><strong>Limitations:</strong> Less accurate in extremes</li>
                  <li><strong>Best For:</strong> General screening</li>
                  <li><strong>Units:</strong> mL/min (not adjusted for BSA)</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">MDRD Formula</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Formula:</strong> 175 × (creatinine)^-1.154 × (age)^-0.203</li>
                  <li><strong>Gender Factor:</strong> × 0.742 for females</li>
                  <li><strong>Race Factor:</strong> × 1.212 for Black patients</li>
                  <li><strong>Advantages:</strong> More accurate than Cockcroft-Gault</li>
                  <li><strong>Limitations:</strong> Less accurate at GFR &gt; 60</li>
                  <li><strong>Best For:</strong> CKD patients</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-teal-50 p-3 rounded-lg border border-teal-200">
                <h5 className="font-semibold text-teal-800 mb-1">GFR Value</h5>
                <p className="text-teal-700 text-sm">Kidney function rate</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">CKD Stage</h5>
                <p className="text-blue-700 text-sm">Disease classification</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Interpretation</h5>
                <p className="text-green-700 text-sm">Clinical meaning</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Recommendations</h5>
                <p className="text-purple-700 text-sm">Clinical guidance</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your age, gender, weight, height, serum creatinine level, and race. The calculator 
              automatically computes GFR using multiple formulas, provides kidney disease staging, and 
              offers clinical recommendations based on your results.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">GFR Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>What is GFR:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Rate of fluid filtration through kidneys</li>
                    <li>Primary measure of kidney function</li>
                    <li>Normal range: 90-120 mL/min/1.73m²</li>
                    <li>Decreases with age and kidney disease</li>
                    <li>Used for medication dosing</li>
                    <li>Critical for CKD management</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Clinical Importance:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Kidney disease diagnosis</li>
                    <li>Disease progression monitoring</li>
                    <li>Medication dose adjustment</li>
                    <li>Dialysis timing decisions</li>
                    <li>Transplant evaluation</li>
                    <li>Risk stratification</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">CKD Staging System</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Early Stages</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Stage 1:</strong> GFR &ge; 90, kidney damage present</li>
                  <li><strong>Stage 2:</strong> GFR 60-89, mild decrease</li>
                  <li><strong>Stage 3a:</strong> GFR 45-59, moderate decrease</li>
                  <li><strong>Stage 3b:</strong> GFR 30-44, moderate decrease</li>
                  <li><strong>Management:</strong> Monitor, lifestyle changes</li>
                  <li><strong>Prognosis:</strong> Generally good with treatment</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Advanced Stages</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Stage 4:</strong> GFR 15-29, severe decrease</li>
                  <li><strong>Stage 5:</strong> GFR &lt; 15, kidney failure</li>
                  <li><strong>Management:</strong> Nephrology referral</li>
                  <li><strong>Treatment:</strong> Dialysis or transplant</li>
                  <li><strong>Monitoring:</strong> Frequent assessments</li>
                  <li><strong>Prognosis:</strong> Requires intervention</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting GFR</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Age:</strong> Natural decline with aging</li>
              <li><strong>Gender:</strong> Generally lower in females</li>
              <li><strong>Race:</strong> Genetic factors in Black patients</li>
              <li><strong>Body Size:</strong> Weight and height considerations</li>
              <li><strong>Creatinine Level:</strong> Primary indicator of kidney function</li>
              <li><strong>Medical Conditions:</strong> Diabetes, hypertension, heart disease</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Creatinine Considerations</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Normal Ranges</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Adult Males:</strong> 0.7-1.3 mg/dL</li>
                  <li><strong>Adult Females:</strong> 0.6-1.1 mg/dL</li>
                  <li><strong>Elderly:</strong> May be lower due to muscle loss</li>
                  <li><strong>Children:</strong> Varies by age and development</li>
                  <li><strong>Athletes:</strong> May be higher due to muscle mass</li>
                  <li><strong>Units:</strong> mg/dL (US) or μmol/L (international)</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Interpretation</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Elevated:</strong> May indicate kidney dysfunction</li>
                  <li><strong>Normal:</strong> Kidney function likely adequate</li>
                  <li><strong>Low:</strong> May indicate muscle wasting</li>
                  <li><strong>Trends:</strong> Changes over time more important</li>
                  <li><strong>Context:</strong> Consider age, gender, race</li>
                  <li><strong>Limitations:</strong> Not always accurate indicator</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Clinical Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Medication Dosing:</strong> Adjust doses based on kidney function</li>
              <li><strong>Contrast Administration:</strong> Assess risk for imaging studies</li>
              <li><strong>Chemotherapy Planning:</strong> Determine safe drug doses</li>
              <li><strong>Antibiotic Selection:</strong> Choose appropriate medications</li>
              <li><strong>Blood Pressure Management:</strong> Guide antihypertensive therapy</li>
              <li><strong>Diabetes Management:</strong> Monitor kidney complications</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">GFR Calculation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Recent Values:</strong> Creatinine levels change over time</li>
              <li><strong>Consider Context:</strong> Age, gender, race, body size</li>
              <li><strong>Multiple Formulas:</strong> Compare different calculations</li>
              <li><strong>Trend Analysis:</strong> Monitor changes over time</li>
              <li><strong>Clinical Correlation:</strong> Combine with symptoms</li>
              <li><strong>Professional Review:</strong> Discuss with healthcare provider</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common GFR Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Using Outdated Values:</strong> Creatinine changes over time</li>
              <li><strong>Ignoring Race Factor:</strong> Important for accuracy</li>
              <li><strong>Not Considering Age:</strong> Natural decline with aging</li>
              <li><strong>Single Measurement:</strong> Trends more important</li>
              <li><strong>Ignoring Context:</strong> Clinical symptoms matter</li>
              <li><strong>Self-Diagnosis:</strong> Always consult healthcare provider</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced GFR Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Cystatin C:</strong> Alternative to creatinine</li>
              <li><strong>Dynamic GFR:</strong> Real-time measurements</li>
              <li><strong>Nuclear Medicine:</strong> Gold standard measurement</li>
              <li><strong>Clearance Studies:</strong> Direct measurement methods</li>
              <li><strong>Biomarkers:</strong> Emerging kidney function markers</li>
              <li><strong>Machine Learning:</strong> AI-enhanced calculations</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-teal-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                When interpreting GFR results, remember that these are estimates based on mathematical 
                formulas, not direct measurements. Always consider the clinical context, including 
                symptoms, medical history, and other laboratory values. GFR naturally declines with 
                age, so a GFR of 60 in an 80-year-old may be normal, while the same value in a 
                30-year-old requires investigation. Use multiple formulas when possible and track 
                trends over time rather than relying on single measurements. Most importantly, 
                discuss your results with your healthcare provider for proper interpretation and 
                management recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
