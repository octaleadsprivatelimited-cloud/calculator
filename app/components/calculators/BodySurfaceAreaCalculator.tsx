'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Ruler } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function BodySurfaceAreaCalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [formula, setFormula] = useState('dubois')
  const [showResults, setShowResults] = useState(false)

  const calculateBSA = useCallback(() => {
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    const a = parseFloat(age) || 0
    if (w === 0 || h === 0) return { 
      bsa: 0, 
      formulas: {
        dubois: 0,
        mosteller: 0,
        haycock: 0,
        gehan: 0,
        boyd: 0
      }, 
      recommendations: [],
      formulaName: ''
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    const weightKg = w * 0.453592
    const heightM = heightCm / 100

    // Calculate BSA using different formulas
    const formulas = {
      dubois: 0,
      mosteller: 0,
      haycock: 0,
      gehan: 0,
      boyd: 0
    }

    // DuBois & DuBois formula (most common)
    formulas.dubois = 0.007184 * Math.pow(weightKg, 0.425) * Math.pow(heightCm, 0.725)

    // Mosteller formula
    formulas.mosteller = Math.sqrt((weightKg * heightCm) / 3600)

    // Haycock formula
    formulas.haycock = 0.024265 * Math.pow(weightKg, 0.5378) * Math.pow(heightCm, 0.3964)

    // Gehan & George formula
    formulas.gehan = 0.0235 * Math.pow(weightKg, 0.51456) * Math.pow(heightCm, 0.42246)

    // Boyd formula
    formulas.boyd = 0.0003207 * Math.pow(weightKg, 0.7285 - 0.0188 * Math.log10(weightKg)) * Math.pow(heightCm, 0.3)

    // Use selected formula or average
    let bsa = 0
    let formulaName = ''

    switch (formula) {
      case 'dubois':
        bsa = formulas.dubois
        formulaName = 'DuBois & DuBois (Most Common)'
        break
      case 'mosteller':
        bsa = formulas.mosteller
        formulaName = 'Mosteller'
        break
      case 'haycock':
        bsa = formulas.haycock
        formulaName = 'Haycock'
        break
      case 'gehan':
        bsa = formulas.gehan
        formulaName = 'Gehan & George'
        break
      case 'boyd':
        bsa = formulas.boyd
        formulaName = 'Boyd'
        break
      default:
        bsa = formulas.dubois
        formulaName = 'DuBois & DuBois (Most Common)'
    }

    // Generate recommendations
    const recommendations = []
    if (bsa > 0) {
      recommendations.push(`Your body surface area is approximately ${bsa.toFixed(2)} m²`)
      
      if (bsa < 1.5) {
        recommendations.push('Small body surface area - consider lower medication dosages')
        recommendations.push('May require adjusted nutritional needs')
      } else if (bsa < 2.0) {
        recommendations.push('Average body surface area - standard calculations apply')
        recommendations.push('Normal medication dosing typically appropriate')
      } else {
        recommendations.push('Large body surface area - may require higher medication dosages')
        recommendations.push('Consider increased nutritional requirements')
      }
      
      recommendations.push('BSA is used for medication dosing, chemotherapy, and burn assessment')
      recommendations.push('Consult healthcare provider for medical applications')
    }

    return { bsa, formulas, recommendations, formulaName }
  }, [weight, height, age, gender, formula])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setHeight('')
    setAge('')
    setGender('male')
    setFormula('dubois')
    setShowResults(false)
  }

  const result = showResults ? calculateBSA() : { 
    bsa: 0, 
    formulas: {
      dubois: 0,
      mosteller: 0,
      haycock: 0,
      gehan: 0,
      boyd: 0
    }, 
    recommendations: [],
    formulaName: ''
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-violet-500 to-purple-500 px-6 py-4">
        <div className="flex items-center">
          <Ruler className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Body Surface Area Calculator</h2>
        </div>
        <p className="text-violet-100 mt-1">Calculate body surface area using multiple formulas</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Weight (lbs)
              </label>
              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                placeholder="Enter height"
                aria-label="Height in feet or cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
                aria-label="Select gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formula
            </label>
            <select
              value={formula}
              onChange={(e) => setFormula(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
              aria-label="Select calculation formula"
            >
              <option value="dubois">DuBois & DuBois (Most Common)</option>
              <option value="mosteller">Mosteller</option>
              <option value="haycock">Haycock</option>
              <option value="gehan">Gehan & George</option>
              <option value="boyd">Boyd</option>
            </select>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-violet-500 hover:bg-violet-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="bg-white p-4 rounded-lg border border-violet-200">
              <ResultSharing
                title="Body Surface Area Calculation Result"
                inputs={[
                  { label: "Weight", value: `${weight} lbs` },
                  { label: "Height", value: `${height} ${parseFloat(height) < 10 ? 'feet' : 'cm'}` },
                  { label: "Age", value: `${age} years` },
                  { label: "Gender", value: gender.charAt(0).toUpperCase() + gender.slice(1) },
                  { label: "Formula Used", value: result.formulaName }
                ]}
                result={{ 
                  label: "Body Surface Area", 
                  value: result.bsa.toFixed(2),
                  unit: "m²"
                }}
                calculatorName="Body Surface Area Calculator"
                className="mb-0"
              />
            </div>

            <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
              <h3 className="text-lg font-semibold text-violet-800 mb-2">Body Surface Area</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-violet-600 mb-2">
                  {result.bsa.toFixed(2)} m²
                </div>
                <div className="text-violet-700">
                  Using {result.formulaName}
                </div>
              </div>
            </div>

            <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
              <h3 className="text-lg font-semibold text-violet-800 mb-3">All Formulas Comparison</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-violet-700">DuBois & DuBois:</span>
                  <span className="font-semibold text-violet-800">{result.formulas.dubois?.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-violet-700">Mosteller:</span>
                  <span className="font-semibold text-violet-800">{result.formulas.mosteller?.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-violet-700">Haycock:</span>
                  <span className="font-semibold text-violet-800">{result.formulas.haycock?.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-violet-700">Gehan & George:</span>
                  <span className="font-semibold text-violet-800">{result.formulas.gehan?.toFixed(2)} m²</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-violet-700">Boyd:</span>
                  <span className="font-semibold text-violet-800">{result.formulas.boyd?.toFixed(2)} m²</span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
                <h3 className="text-lg font-semibold text-violet-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-violet-600 mr-2">•</span>
                      <span className="text-violet-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Body Surface Area Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive body surface area calculator helps healthcare professionals, researchers, 
              and individuals determine the total surface area of the human body using multiple validated 
              formulas. This essential medical tool provides accurate BSA calculations to support drug 
              dosing, medical procedures, burn assessment, and various clinical applications.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Body Surface Area:</strong> Total external surface area in square meters</li>
              <li><strong>Multiple Formulas:</strong> Various calculation methods for accuracy</li>
              <li><strong>Formula Comparison:</strong> Side-by-side analysis of different approaches</li>
              <li><strong>Personalized Results:</strong> Based on age, gender, height, and weight</li>
              <li><strong>Clinical Applications:</strong> Medical dosing and procedure planning</li>
              <li><strong>Research Support:</strong> Scientific and medical research applications</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Calculation Formulas Explained</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">DuBois & DuBois (1916)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Most widely used formula</li>
                  <li>BSA = 0.007184 × W^0.425 × H^0.725</li>
                  <li>Validated in multiple studies</li>
                  <li>Good for most populations</li>
                  <li>Standard in clinical practice</li>
                  <li>Weight in kg, height in cm</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Mosteller (1987)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Simplified calculation</li>
                  <li>BSA = √(W × H) / 60</li>
                  <li>Easy to remember</li>
                  <li>Good accuracy</li>
                  <li>Weight in kg, height in cm</li>
                  <li>Widely used in pediatrics</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Specialized Formulas</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Haycock (1978)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Developed for children</li>
                  <li>More accurate for pediatric use</li>
                  <li>Accounts for growth patterns</li>
                  <li>Used in pediatric oncology</li>
                  <li>Validated in young populations</li>
                  <li>BSA = 0.024265 × W^0.5378 × H^0.3964</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Gehan & George (1970)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Based on body density</li>
                  <li>Accounts for body composition</li>
                  <li>Good for varied populations</li>
                  <li>Used in research settings</li>
                  <li>More complex calculation</li>
                  <li>Includes age and gender</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Boyd (1935)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Early comprehensive formula</li>
                  <li>Includes age and gender</li>
                  <li>Good for adults</li>
                  <li>Used in some clinical settings</li>
                  <li>More complex than DuBois</li>
                  <li>Historical significance</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-4">
              <div className="bg-violet-50 p-3 rounded-lg border border-violet-200">
                <h5 className="font-semibold text-violet-800 mb-1">Body Surface Area</h5>
                <p className="text-violet-700 text-sm">Total surface area in m²</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Formula Comparison</h5>
                <p className="text-purple-700 text-sm">All methods side-by-side</p>
              </div>
              <div className="bg-indigo-50 p-3 rounded-lg border border-indigo-200">
                <h5 className="font-semibold text-indigo-800 mb-1">Recommendations</h5>
                <p className="text-indigo-700 text-sm">Personalized guidance</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your age, gender, weight, and height. Choose your preferred calculation formula, 
              and the calculator will provide your body surface area along with comparisons of all 
              available formulas to help you understand the range of possible values.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Clinical Applications</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Drug Dosing:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Chemotherapy medications</li>
                    <li>Antibiotics and antivirals</li>
                    <li>Cardiovascular drugs</li>
                    <li>Pediatric medications</li>
                    <li>Oncology treatments</li>
                    <li>Critical care medications</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Medical Procedures:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Burn assessment and treatment</li>
                    <li>Fluid resuscitation</li>
                    <li>Dialysis prescriptions</li>
                    <li>Ventilator settings</li>
                    <li>Nutritional requirements</li>
                    <li>Radiation therapy planning</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">BSA vs. Body Weight Dosing</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>BSA Dosing:</strong> More accurate for many medications</li>
              <li><strong>Weight Dosing:</strong> Simpler but less precise</li>
              <li><strong>Metabolic Rate:</strong> BSA better correlates with metabolism</li>
              <li><strong>Drug Distribution:</strong> BSA reflects tissue distribution</li>
              <li><strong>Pediatric Use:</strong> BSA essential for children</li>
              <li><strong>Oncology Standard:</strong> BSA required for chemotherapy</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting BSA</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Body Size:</strong> Larger individuals have greater BSA</li>
              <li><strong>Body Shape:</strong> Taller people have more surface area</li>
              <li><strong>Age:</strong> BSA changes with growth and aging</li>
              <li><strong>Gender:</strong> Different body compositions affect BSA</li>
              <li><strong>Body Composition:</strong> Muscle vs. fat distribution</li>
              <li><strong>Pregnancy:</strong> Increases BSA during gestation</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">BSA in Different Populations</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Adults</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Typical range: 1.4-2.2 m²</li>
                  <li>DuBois formula most accurate</li>
                  <li>Used for most medications</li>
                  <li>Standard clinical practice</li>
                  <li>Good formula agreement</li>
                  <li>Stable over time</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Children</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li>Range: 0.2-1.8 m²</li>
                  <li>Haycock formula recommended</li>
                  <li>Rapid changes with growth</li>
                  <li>Critical for drug dosing</li>
                  <li>Age-specific considerations</li>
                  <li>Pediatric oncology standard</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Burn Assessment</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Rule of Nines:</strong> Body part percentages for burns</li>
              <li><strong>Lund-Browder Chart:</strong> Age-adjusted burn assessment</li>
              <li><strong>BSA Calculation:</strong> Essential for burn severity</li>
              <li><strong>Fluid Resuscitation:</strong> Based on BSA and burn percentage</li>
              <li><strong>Prognosis:</strong> BSA affects survival rates</li>
              <li><strong>Treatment Planning:</strong> BSA guides therapy decisions</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Research Applications</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Clinical Trials:</strong> Standardized dosing protocols</li>
              <li><strong>Epidemiology:</strong> Population health studies</li>
              <li><strong>Physiology Research:</strong> Metabolic rate studies</li>
              <li><strong>Drug Development:</strong> Pharmacokinetic modeling</li>
              <li><strong>Medical Device Design:</strong> Equipment sizing</li>
              <li><strong>Public Health:</strong> Population assessments</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Limitations and Considerations</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Formula Variation:</strong> Different methods give different results</li>
              <li><strong>Population Specificity:</strong> Some formulas better for certain groups</li>
              <li><strong>Body Shape Assumptions:</strong> Formulas assume standard proportions</li>
              <li><strong>Extreme Cases:</strong> Very tall/short or obese individuals</li>
              <li><strong>Amputations:</strong> BSA calculations may need adjustment</li>
              <li><strong>Clinical Judgment:</strong> Always consider individual factors</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">When to Use Each Formula</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>DuBois & DuBois:</strong> General adult population, clinical practice</li>
              <li><strong>Mosteller:</strong> Quick estimates, pediatrics, research</li>
              <li><strong>Haycock:</strong> Children, pediatric oncology, growth studies</li>
              <li><strong>Gehan & George:</strong> Research, varied populations</li>
              <li><strong>Boyd:</strong> Historical reference, some clinical settings</li>
              <li><strong>Multiple Formulas:</strong> Compare results for accuracy</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-violet-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                For most clinical applications, the DuBois & DuBois formula provides the most reliable 
                results. However, always consider your specific use case - use Haycock for children, 
                Mosteller for quick estimates, and compare multiple formulas when accuracy is critical. 
                Remember that BSA is just one factor in medical decision-making; always consult with 
                healthcare professionals for clinical applications. Also, be aware that BSA calculations 
                are estimates and may need adjustment for individuals with unusual body proportions or 
                specific medical conditions.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
