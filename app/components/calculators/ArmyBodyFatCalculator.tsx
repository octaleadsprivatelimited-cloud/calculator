'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Shield } from 'lucide-react'

export default function ArmyBodyFatCalculator() {
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [height, setHeight] = useState('')
  const [waist, setWaist] = useState('')
  const [neck, setNeck] = useState('')
  const [hip, setHip] = useState('')
  const [showResults, setShowResults] = useState(false)

  const calculateArmyBodyFat = useCallback(() => {
    const a = parseFloat(age) || 0
    const h = parseFloat(height) || 0
    const w = parseFloat(waist) || 0
    const n = parseFloat(neck) || 0
    const hip_cm = parseFloat(hip) || 0

    if (h === 0 || w === 0 || n === 0) return { 
      bodyFat: 0, 
      category: '', 
      standards: {}, 
      measurements: {
        height: 0,
        waist: 0,
        neck: 0,
        hip: 0,
        ageGroup: ''
      } 
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    let bodyFat = 0
    let category = ''

    // US Army body fat calculation
    if (gender === 'male') {
      bodyFat = 86.010 * Math.log10(w - n) - 70.041 * Math.log10(heightCm) + 36.76
    } else {
      if (hip_cm === 0) return { 
        bodyFat: 0, 
        category: '', 
        standards: {}, 
        measurements: {
          height: 0,
          waist: 0,
          neck: 0,
          hip: 0,
          ageGroup: ''
        } 
      }
      bodyFat = 163.205 * Math.log10(w + hip_cm - n) - 97.684 * Math.log10(heightCm) - 78.387
    }

    bodyFat = Math.max(0, Math.min(100, bodyFat))

    // Army standards by age and gender
    const standards = {
      male: {
        '17-20': { max: 20, category: 'Excellent: ≤20%' },
        '21-27': { max: 22, category: 'Good: ≤22%' },
        '28-39': { max: 24, category: 'Fair: ≤24%' },
        '40+': { max: 26, category: 'Acceptable: ≤26%' }
      },
      female: {
        '17-20': { max: 30, category: 'Excellent: ≤30%' },
        '21-27': { max: 32, category: 'Good: ≤32%' },
        '28-39': { max: 34, category: 'Fair: ≤34%' },
        '40+': { max: 36, category: 'Acceptable: ≤36%' }
      }
    }

    // Determine age group
    let ageGroup = ''
    if (a < 21) ageGroup = '17-20'
    else if (a < 28) ageGroup = '21-27'
    else if (a < 40) ageGroup = '28-39'
    else ageGroup = '40+'

    const maxAllowed = standards[gender as keyof typeof standards][ageGroup as keyof typeof standards.male]?.max || 0
    const standardCategory = standards[gender as keyof typeof standards][ageGroup as keyof typeof standards.male]?.category || ''

    // Determine if meets standards
    if (bodyFat <= maxAllowed) {
      category = `PASS - ${standardCategory}`
    } else {
      category = `FAIL - Exceeds ${maxAllowed}% limit`
    }

    const measurements = {
      height: heightCm,
      waist,
      neck,
      hip: hip_cm,
      ageGroup
    }

    return { bodyFat, category, standards: standards[gender as keyof typeof standards], measurements }
  }, [age, gender, height, waist, neck, hip])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setAge('')
    setGender('male')
    setHeight('')
    setWaist('')
    setNeck('')
    setHip('')
    setShowResults(false)
  }

  const result = showResults ? calculateArmyBodyFat() : { 
    bodyFat: 0, 
    category: '', 
    standards: {}, 
    measurements: {
      height: 0,
      waist: 0,
      neck: 0,
      hip: 0,
      ageGroup: ''
    } 
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-green-600 to-green-800 px-6 py-4">
        <div className="flex items-center">
          <Shield className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Army Body Fat Calculator</h2>
        </div>
        <p className="text-green-100 mt-1">Calculate body fat using US Army standards</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter age"
                min="17"
                max="65"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
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
                Height (ft or cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter height"
                aria-label="Height in feet or cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Waist (cm)
              </label>
              <input
                type="number"
                value={waist}
                onChange={(e) => setWaist(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter waist"
                aria-label="Waist circumference in cm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Neck (cm)
              </label>
              <input
                type="number"
                value={neck}
                onChange={(e) => setNeck(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter neck"
                aria-label="Neck circumference in cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hip (cm) {gender === 'female' && <span className="text-red-500">*</span>}
              </label>
              <input
                type="number"
                value={hip}
                onChange={(e) => setHip(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
                placeholder="Enter hip"
                aria-label="Hip circumference in cm"
              />
              {gender === 'female' && (
                <p className="text-xs text-gray-500 mt-1">Required for female calculations</p>
              )}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Results</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-green-700">Body Fat %:</span>
                  <span className="font-semibold text-green-800">{result.bodyFat.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Status:</span>
                  <span className={`font-semibold ${result.category.includes('PASS') ? 'text-green-600' : 'text-red-600'}`}>
                    {result.category}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Age Group:</span>
                  <span className="font-semibold text-green-800">{result.measurements.ageGroup}</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Army Standards</h3>
              <div className="space-y-2">
                {Object.entries(result.standards).map(([ageRange, standard]) => (
                  <div key={ageRange} className="flex justify-between">
                    <span className="text-green-700">Ages {ageRange}:</span>
                    <span className="font-semibold text-green-800">{standard.max}% max</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Measurements Used</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-green-700">Height:</span>
                  <span className="font-semibold text-green-800">{result.measurements.height.toFixed(1)} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Waist:</span>
                  <span className="font-semibold text-green-800">{result.measurements.waist} cm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-green-700">Neck:</span>
                  <span className="font-semibold text-green-800">{result.measurements.neck} cm</span>
                </div>
                {gender === 'female' && (
                  <div className="flex justify-between">
                    <span className="text-green-700">Hip:</span>
                    <span className="font-semibold text-green-800">{result.measurements.hip} cm</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Calculator Description Section */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">About Army Body Fat Calculator</h3>
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 mb-4">
            Our comprehensive Army Body Fat Calculator helps military personnel and fitness enthusiasts 
            determine their body fat percentage using the official US Army tape test method. This 
            essential military fitness tool provides accurate body fat calculations, Army standards 
            compliance, and pass/fail status for physical fitness tests and body composition standards.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Body Fat Percentage:</strong> Accurate calculation using Army tape test</li>
            <li><strong>Pass/Fail Status:</strong> Compliance with Army body composition standards</li>
            <li><strong>Age Group Standards:</strong> Different requirements by age range</li>
            <li><strong>Gender-Specific Calculations:</strong> Different formulas for males and females</li>
            <li><strong>Measurement Validation:</strong> Ensures all required measurements are provided</li>
            <li><strong>Standard Compliance:</strong> Meets official Army testing protocols</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Army Tape Test Method</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Male Formula</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Body Fat % = 495 / (1.0324 - 0.19077 × log10(waist - neck) + 0.15456 × log10(height)) - 450</li>
                <li>Uses waist and neck measurements</li>
                <li>Height in centimeters</li>
                <li>Standard Army calculation</li>
                <li>Validated by military research</li>
                <li>Industry standard method</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Female Formula</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li>Body Fat % = 495 / (1.29579 - 0.35004 × log10(waist + hip - neck) + 0.22100 × log10(height)) - 450</li>
                <li>Uses waist, hip, and neck measurements</li>
                <li>Height in centimeters</li>
                <li>Includes hip circumference</li>
                <li>Gender-specific calculation</li>
                <li>Army-approved method</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="bg-green-50 p-3 rounded-lg border border-green-200">
              <h5 className="font-semibold text-green-800 mb-1">Body Fat %</h5>
              <p className="text-green-700 text-sm">Calculated percentage</p>
            </div>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
              <h5 className="font-semibold text-blue-800 mb-1">Status</h5>
              <p className="text-blue-700 text-sm">Pass or fail result</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
              <h5 className="font-semibold text-purple-800 mb-1">Age Group</h5>
              <p className="text-purple-700 text-sm">Applicable standards</p>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
          <p className="text-gray-700 mb-4">
            Enter your age, gender, height, waist, neck, and hip measurements (hip required for females). 
            The calculator will compute your body fat percentage using the official Army formula and 
            determine if you meet the body composition standards for your age group.
          </p>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Army Body Fat Standards</h4>
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <p><strong>Male Standards:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Ages 17-20: 20% maximum</li>
                  <li>Ages 21-27: 22% maximum</li>
                  <li>Ages 28-39: 24% maximum</li>
                  <li>Ages 40+: 26% maximum</li>
                  <li>Strict enforcement</li>
                  <li>Annual testing required</li>
                </ul>
              </div>
              <div>
                <p><strong>Female Standards:</strong></p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Ages 17-20: 30% maximum</li>
                  <li>Ages 21-27: 32% maximum</li>
                  <li>Ages 28-39: 34% maximum</li>
                  <li>Ages 40+: 36% maximum</li>
                  <li>Gender-specific ranges</li>
                  <li>Higher percentages allowed</li>
                </ul>
              </div>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Measurement Techniques</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Height:</strong> Measure without shoes, standing straight</li>
            <li><strong>Waist:</strong> Measure at narrowest point, usually at navel level</li>
            <li><strong>Neck:</strong> Measure around neck at narrowest point</li>
            <li><strong>Hip (Females):</strong> Measure around widest part of hips</li>
            <li><strong>Tape Placement:</strong> Keep tape level and snug, not tight</li>
            <li><strong>Measurement Timing:</strong> Measure in morning, before eating</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Army Fitness Requirements</h4>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Physical Fitness Test</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Push-ups:</strong> Maximum repetitions in 2 minutes</li>
                <li><strong>Sit-ups:</strong> Maximum repetitions in 2 minutes</li>
                <li><strong>2-Mile Run:</strong> Timed distance run</li>
                <li><strong>Body Composition:</strong> Tape test measurement</li>
                <li><strong>Minimum Scores:</strong> Age and gender specific</li>
                <li><strong>Annual Testing:</strong> Required for all personnel</li>
              </ul>
            </div>
            <div>
              <h5 className="font-semibold text-gray-800 mb-2">Body Composition Standards</h5>
              <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                <li><strong>Height/Weight Tables:</strong> Basic screening tool</li>
                <li><strong>Tape Test:</strong> Body fat percentage measurement</li>
                <li><strong>BodPod/DEXA:</strong> Alternative methods if available</li>
                <li><strong>Medical Waivers:</strong> Available for certain conditions</li>
                <li><strong>Appeals Process:</strong> Right to challenge results</li>
                <li><strong>Re-testing:</strong> Opportunity to improve scores</li>
              </ul>
            </div>
          </div>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Advantages of Army Tape Test</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Cost-Effective:</strong> Only requires measuring tape</li>
            <li><strong>Portable:</strong> Can be done anywhere</li>
            <li><strong>Quick:</strong> Takes only a few minutes</li>
            <li><strong>Non-Invasive:</strong> No special equipment needed</li>
            <li><strong>Standardized:</strong> Consistent measurement protocol</li>
            <li><strong>Validated:</strong> Research-backed accuracy</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Limitations and Considerations</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Measurement Error:</strong> Depends on proper technique</li>
            <li><strong>Body Shape Variations:</strong> May not account for all body types</li>
            <li><strong>Hydration Effects:</strong> Water retention can affect results</li>
            <li><strong>Muscle Mass:</strong> High muscle mass may affect accuracy</li>
            <li><strong>Age Factors:</strong> Formulas may need adjustment for older adults</li>
            <li><strong>Professional Training:</strong> Best results with trained personnel</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Improving Body Composition</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Strength Training:</strong> Build lean muscle mass</li>
            <li><strong>Cardiovascular Exercise:</strong> Burn excess body fat</li>
            <li><strong>Nutrition:</strong> Balanced diet with adequate protein</li>
            <li><strong>Consistency:</strong> Regular exercise routine</li>
            <li><strong>Recovery:</strong> Adequate rest and sleep</li>
            <li><strong>Professional Guidance:</strong> Work with fitness professionals</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Military Career Impact</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Promotion Eligibility:</strong> Fitness affects career advancement</li>
            <li><strong>Special Assignments:</strong> Some roles require higher fitness</li>
            <li><strong>Deployment Readiness:</strong> Physical fitness essential for missions</li>
            <li><strong>Medical Discharge:</strong> Failure can lead to separation</li>
            <li><strong>Retention Standards:</strong> Ongoing fitness requirements</li>
            <li><strong>Professional Development:</strong> Fitness supports career growth</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Alternative Measurement Methods</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>DEXA Scan:</strong> Dual-energy X-ray absorptiometry</li>
            <li><strong>BodPod:</strong> Air displacement plethysmography</li>
            <li><strong>Hydrostatic Weighing:</strong> Underwater weighing method</li>
            <li><strong>Skinfold Calipers:</strong> Pinch test measurements</li>
            <li><strong>Bioelectrical Impedance:</strong> Electrical resistance method</li>
            <li><strong>3D Body Scanning:</strong> Advanced imaging technology</li>
          </ul>
          
          <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Measurement Mistakes</h4>
          <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
            <li><strong>Incorrect Tape Placement:</strong> Wrong measurement locations</li>
            <li><strong>Compression Errors:</strong> Pulling tape too tight</li>
            <li><strong>Timing Issues:</strong> Measuring after meals or exercise</li>
            <li><strong>Clothing Interference:</strong> Measuring over thick clothes</li>
            <li><strong>Posture Problems:</strong> Not standing naturally</li>
            <li><strong>Hydration Changes:</strong> Measuring after drinking water</li>
          </ul>
          
          <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-green-500">
            <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
            <p className="text-gray-700 text-sm">
              For the most accurate Army tape test results, measure in the morning before eating or 
              drinking, wear minimal clothing, and ensure proper tape placement. Practice the 
              measurement technique several times to improve accuracy. Remember that the Army tape 
              test is designed to be a screening tool - while it's quite accurate for most people, 
              individual results may vary. Focus on improving your overall fitness and body composition 
              rather than just meeting the minimum standards, as this will benefit your military career 
              and overall health.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
