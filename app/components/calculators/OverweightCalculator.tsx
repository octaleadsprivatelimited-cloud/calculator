'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Scale } from 'lucide-react'
import ResultSharing from '../ResultSharing'

export default function OverweightCalculator() {
  const [weight, setWeight] = useState('')
  const [height, setHeight] = useState('')
  const [age, setAge] = useState('')
  const [gender, setGender] = useState('male')
  const [showResults, setShowResults] = useState(false)

  const calculateOverweight = useCallback(() => {
    const w = parseFloat(weight) || 0
    const h = parseFloat(height) || 0
    const a = parseFloat(age) || 0
    if (w === 0 || h === 0) return { 
      bmi: 0, 
      category: '', 
      riskLevel: '',
      recommendations: [],
      details: {
        heightCm: 0,
        heightM: 0,
        weightKg: 0,
        minIdealWeight: 0,
        maxIdealWeight: 0,
        weightExcess: 0,
        weightDeficit: 0,
        bodyFatEstimate: 0
      }
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    const weightKg = w * 0.453592
    const heightM = heightCm / 100

    // Calculate BMI
    const bmi = weightKg / (heightM * heightM)

    // Determine category and risk level
    let category = ''
    let riskLevel = ''
    let recommendations = []

    if (bmi < 18.5) {
      category = 'Underweight'
      riskLevel = 'Low Risk'
      recommendations = [
        'Consider healthy weight gain',
        'Focus on nutrient-dense foods',
        'Consult healthcare provider if unintentional'
      ]
    } else if (bmi < 25.0) {
      category = 'Normal Weight'
      riskLevel = 'Low Risk'
      recommendations = [
        'Maintain current weight',
        'Continue healthy lifestyle',
        'Regular exercise and balanced diet'
      ]
    } else if (bmi < 30.0) {
      category = 'Overweight'
      riskLevel = 'Moderate Risk'
      recommendations = [
        'Weight loss recommended',
        'Increase physical activity',
        'Reduce caloric intake',
        'Focus on whole foods'
      ]
    } else if (bmi < 35.0) {
      category = 'Class I Obesity'
      riskLevel = 'High Risk'
      recommendations = [
        'Medical weight loss program recommended',
        'Lifestyle modification essential',
        'Regular health monitoring',
        'Consider specialist consultation'
      ]
    } else if (bmi < 40.0) {
      category = 'Class II Obesity'
      riskLevel = 'Very High Risk'
      recommendations = [
        'Immediate medical intervention needed',
        'Comprehensive weight loss program',
        'Monitor for complications',
        'Specialist care required'
      ]
    } else {
      category = 'Class III Obesity (Morbid)'
      riskLevel = 'Extreme Risk'
      recommendations = [
        'Urgent medical attention required',
        'Consider bariatric surgery evaluation',
        'Intensive medical management',
        'Monitor for life-threatening complications'
      ]
    }

    // Calculate ideal weight range
    const minIdealWeight = 18.5 * heightM * heightM
    const maxIdealWeight = 24.9 * heightM * heightM
    const weightExcess = weightKg > maxIdealWeight ? weightKg - maxIdealWeight : 0
    const weightDeficit = weightKg < minIdealWeight ? minIdealWeight - weightKg : 0

    // Calculate body fat percentage estimate
    let bodyFatEstimate = 0
    if (gender === 'male') {
      bodyFatEstimate = (1.20 * bmi) + (0.23 * a) - 16.2
    } else {
      bodyFatEstimate = (1.20 * bmi) + (0.23 * a) - 5.4
    }
    bodyFatEstimate = Math.max(0, Math.min(100, bodyFatEstimate))

    const details = {
      heightCm,
      heightM,
      weightKg,
      minIdealWeight,
      maxIdealWeight,
      weightExcess,
      weightDeficit,
      bodyFatEstimate
    }

    return { bmi, category, riskLevel, recommendations, details }
  }, [weight, height, age, gender])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setWeight('')
    setHeight('')
    setAge('')
    setGender('male')
    setShowResults(false)
  }

  const result = showResults ? calculateOverweight() : { 
    bmi: 0, 
    category: '', 
    riskLevel: '',
    recommendations: [],
    details: {
      heightCm: 0,
      heightM: 0,
      weightKg: 0,
      minIdealWeight: 0,
      maxIdealWeight: 0,
      weightExcess: 0,
      weightDeficit: 0,
      bodyFatEstimate: 0
    }
  }

  return (
    <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-orange-500 to-red-500 px-6 py-4">
        <div className="flex items-center">
          <Scale className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Overweight Calculator</h2>
        </div>
        <p className="text-orange-100 mt-1">Calculate BMI and assess weight-related health risks</p>
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
                aria-label="Select gender"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="bg-white p-4 rounded-lg border border-orange-200">
              <ResultSharing
                title="Overweight Assessment Result"
                inputs={[
                  { label: "Weight", value: `${weight} lbs` },
                  { label: "Height", value: `${height} ${parseFloat(height) < 10 ? 'feet' : 'cm'}` },
                  { label: "Age", value: `${age} years` }
                ]}
                result={{ 
                  label: "BMI", 
                  value: `${result.bmi.toFixed(1)}`,
                  unit: ""
                }}
                calculatorName="Overweight Calculator"
                className="mb-0"
              />
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-2">BMI Results</h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {result.bmi.toFixed(1)}
                </div>
                <div className="text-orange-700">
                  {result.category}
                </div>
                <div className="text-orange-600 font-medium">
                  Risk Level: {result.riskLevel}
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="text-lg font-semibold text-orange-800 mb-3">Weight Analysis</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-orange-700">Current Weight:</span>
                  <span className="font-semibold text-orange-800">{result.details.weightKg?.toFixed(1)} kg</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Ideal Weight Range:</span>
                  <span className="font-semibold text-orange-800">
                    {result.details.minIdealWeight?.toFixed(1)} - {result.details.maxIdealWeight?.toFixed(1)} kg
                  </span>
                </div>
                {result.details.weightExcess > 0 && (
                  <div className="flex justify-between">
                    <span className="text-orange-700">Weight Excess:</span>
                    <span className="font-semibold text-orange-800">
                      {result.details.weightExcess?.toFixed(1)} kg
                    </span>
                  </div>
                )}
                {result.details.weightDeficit > 0 && (
                  <div className="flex justify-between">
                    <span className="text-orange-700">Weight Deficit:</span>
                    <span className="font-semibold text-orange-800">
                      {result.details.weightDeficit?.toFixed(1)} kg
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-orange-700">Height:</span>
                  <span className="font-semibold text-orange-800">
                    {result.details.heightCm?.toFixed(1)} cm
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-orange-700">Estimated Body Fat:</span>
                  <span className="font-semibold text-orange-800">
                    {result.details.bodyFatEstimate?.toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {result.recommendations.length > 0 && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <h3 className="text-lg font-semibold text-orange-800 mb-3">Recommendations</h3>
                <div className="space-y-2">
                  {result.recommendations.map((rec, index) => (
                    <div key={index} className="flex items-start">
                      <span className="text-orange-600 mr-2">•</span>
                      <span className="text-orange-700">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">💡 Health Tips</h3>
              <div className="text-sm text-blue-700">
                • BMI is a screening tool, not a diagnostic measure<br/>
                • Consult healthcare provider for personalized advice<br/>
                • Focus on sustainable lifestyle changes<br/>
                • Regular physical activity and balanced nutrition are key
              </div>
            </div>
          </div>
        )}
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Overweight Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive Overweight Calculator helps individuals assess their weight status and 
              understand potential health risks associated with body weight. This essential tool provides 
              accurate BMI calculations, weight analysis, and personalized recommendations for achieving 
              and maintaining a healthy weight through sustainable lifestyle changes.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Body Mass Index (BMI):</strong> Weight-to-height ratio assessment</li>
              <li><strong>Weight Categories:</strong> Underweight, normal, overweight, obese classifications</li>
              <li><strong>Health Risk Assessment:</strong> Risk level based on BMI and age</li>
              <li><strong>Ideal Weight Range:</strong> Healthy weight targets for your height</li>
              <li><strong>Weight Excess/Deficit:</strong> Amount above or below ideal range</li>
              <li><strong>Body Fat Estimation:</strong> Approximate body fat percentage</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">BMI Categories and Health Implications</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Normal Weight Range</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>BMI 18.5-24.9:</strong> Healthy weight range</li>
                  <li><strong>Health Benefits:</strong> Lower risk of chronic diseases</li>
                  <li><strong>Energy Levels:</strong> Optimal physical performance</li>
                  <li><strong>Longevity:</strong> Associated with longer lifespan</li>
                  <li><strong>Mental Health:</strong> Better self-esteem and confidence</li>
                  <li><strong>Maintenance:</strong> Focus on healthy habits</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Overweight Categories</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>BMI 25-29.9:</strong> Overweight (Class I)</li>
                  <li><strong>BMI 30-34.9:</strong> Obese (Class I)</li>
                  <li><strong>BMI 35-39.9:</strong> Obese (Class II)</li>
                  <li><strong>BMI 40+:</strong> Obese (Class III)</li>
                  <li><strong>Health Risks:</strong> Increased disease risk</li>
                  <li><strong>Action Needed:</strong> Lifestyle modification</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                <h5 className="font-semibold text-orange-800 mb-1">BMI Score</h5>
                <p className="text-orange-700 text-sm">Weight-to-height ratio</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Category</h5>
                <p className="text-blue-700 text-sm">Weight classification</p>
              </div>
              <div className="bg-red-50 p-3 rounded-lg border border-red-200">
                <h5 className="font-semibold text-red-800 mb-1">Risk Level</h5>
                <p className="text-red-700 text-sm">Health risk assessment</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Ideal Range</h5>
                <p className="text-green-700 text-sm">Healthy weight targets</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your weight in pounds, height in feet or centimeters, age, and gender. The calculator 
              will automatically compute your BMI, classify your weight status, assess health risks, and 
              provide personalized recommendations for achieving a healthy weight through sustainable 
              lifestyle changes.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Health Risk Factors</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Cardiovascular Risks:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>High blood pressure</li>
                    <li>Heart disease</li>
                    <li>Stroke</li>
                    <li>High cholesterol</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Metabolic Risks:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Type 2 diabetes</li>
                    <li>Insulin resistance</li>
                    <li>Metabolic syndrome</li>
                    <li>Fatty liver disease</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Weight Management Strategies</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Nutrition Guidelines</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Calorie Balance:</strong> Create moderate calorie deficit</li>
                  <li><strong>Macronutrients:</strong> Balanced protein, carbs, and fats</li>
                  <li><strong>Portion Control:</strong> Mindful eating practices</li>
                  <li><strong>Meal Timing:</strong> Regular meal schedule</li>
                  <li><strong>Hydration:</strong> Adequate water intake</li>
                  <li><strong>Food Quality:</strong> Whole, unprocessed foods</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Physical Activity</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Cardiovascular:</strong> 150+ minutes moderate activity weekly</li>
                  <li><strong>Strength Training:</strong> 2-3 sessions per week</li>
                  <li><strong>Flexibility:</strong> Stretching and mobility work</li>
                  <li><strong>Daily Movement:</strong> Increase non-exercise activity</li>
                  <li><strong>Progressive Overload:</strong> Gradually increase intensity</li>
                  <li><strong>Consistency:</strong> Regular exercise routine</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Behavioral Changes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Goal Setting:</strong> Realistic, achievable targets</li>
              <li><strong>Self-Monitoring:</strong> Track food intake and activity</li>
              <li><strong>Stress Management:</strong> Address emotional eating triggers</li>
              <li><strong>Sleep Hygiene:</strong> Prioritize quality sleep</li>
              <li><strong>Social Support:</strong> Engage family and friends</li>
              <li><strong>Professional Help:</strong> Consider counseling if needed</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">BMI Limitations</h4>
            <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-4">
              <h5 className="font-semibold text-yellow-800 mb-2">Important Considerations</h5>
              <ul className="list-disc list-inside text-yellow-700 space-y-1 text-sm">
                <li><strong>Muscle Mass:</strong> Athletes may have high BMI due to muscle</li>
                <li><strong>Age Differences:</strong> BMI ranges vary by age group</li>
                <li><strong>Ethnic Variations:</strong> Different populations have different ranges</li>
                <li><strong>Body Composition:</strong> Doesn't distinguish fat from muscle</li>
                <li><strong>Distribution:</strong> Doesn't account for fat location</li>
                <li><strong>Individual Factors:</strong> Genetics and health conditions matter</li>
              </ul>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Alternative Health Metrics</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Waist Circumference</h5>
                <p className="text-blue-700 text-sm">Abdominal fat indicator</p>
                <p className="text-blue-600 text-xs mt-1">Men: &lt;40", Women: &lt;35"</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Waist-to-Hip Ratio</h5>
                <p className="text-green-700 text-sm">Body fat distribution</p>
                <p className="text-green-600 text-xs mt-1">Men: &lt;0.9, Women: &lt;0.85</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Body Fat Percentage</h5>
                <p className="text-purple-700 text-sm">Direct fat measurement</p>
                <p className="text-purple-600 text-xs mt-1">Men: 10-20%, Women: 18-28%</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">When to Seek Professional Help</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Medical Conditions:</strong> Underlying health issues</li>
              <li><strong>Rapid Weight Changes:</strong> Unexplained weight gain/loss</li>
              <li><strong>Eating Disorders:</strong> Unhealthy relationship with food</li>
              <li><strong>Mental Health:</strong> Depression or anxiety</li>
              <li><strong>Medication Effects:</strong> Weight changes from drugs</li>
              <li><strong>Age Considerations:</strong> Special needs for elderly</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Sustainable Weight Loss</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Realistic Expectations</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Rate:</strong> 1-2 pounds per week</li>
                  <li><strong>Timeline:</strong> Long-term commitment needed</li>
                  <li><strong>Plateaus:</strong> Normal part of process</li>
                  <li><strong>Setbacks:</strong> Learn from challenges</li>
                  <li><strong>Maintenance:</strong> Focus on lifestyle changes</li>
                  <li><strong>Support:</strong> Professional guidance helps</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Success Factors</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Consistency:</strong> Daily healthy habits</li>
                  <li><strong>Patience:</strong> Results take time</li>
                  <li><strong>Flexibility:</strong> Adapt to changing circumstances</li>
                  <li><strong>Self-Compassion:</strong> Be kind to yourself</li>
                  <li><strong>Celebration:</strong> Acknowledge progress</li>
                  <li><strong>Long-term View:</strong> Focus on health, not just weight</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Prevention Strategies</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Regular Monitoring:</strong> Check weight and measurements</li>
              <li><strong>Early Intervention:</strong> Address weight gain promptly</li>
              <li><strong>Lifestyle Balance:</strong> Maintain healthy habits</li>
              <li><strong>Stress Management:</strong> Develop coping strategies</li>
              <li><strong>Social Connections:</strong> Build supportive relationships</li>
              <li><strong>Health Education:</strong> Stay informed about nutrition</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Remember that BMI is just one tool for health assessment. Focus on overall health rather 
                than just the number on the scale. Sustainable weight management comes from creating healthy 
                habits that you can maintain for life. Start with small, achievable changes and build upon 
                them gradually. Celebrate non-scale victories like increased energy, better sleep, and 
                improved mood. Consult with healthcare professionals for personalized guidance, especially 
                if you have underlying health conditions or need help with emotional eating patterns.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
