'use client'
import React, { useState, useCallback } from 'react'
import { Calculator, RotateCcw, Target } from 'lucide-react'

export default function IdealWeightCalculator() {
  const [height, setHeight] = useState('')
  const [gender, setGender] = useState('male')
  const [age, setAge] = useState('')
  const [bodyFrame, setBodyFrame] = useState('medium')
  const [showResults, setShowResults] = useState(false)

  const calculateIdealWeight = useCallback(() => {
    const h = parseFloat(height) || 0
    const a = parseFloat(age) || 0
    if (h === 0) return { 
      formulas: {
        devine: { male: 0, female: 0 },
        robinson: { male: 0, female: 0 },
        miller: { male: 0, female: 0 },
        hamwi: { male: 0, female: 0 },
        peterson: { male: 0, female: 0 }
      }, 
      bmiRange: { min: 0, max: 0 }, 
      recommendations: [] 
    }

    // Convert height to cm if in feet
    let heightCm = h
    if (h < 10) {
      heightCm = h * 30.48
    }

    const heightInches = heightCm / 2.54

    // Calculate using different formulas
    const formulas = {
      devine: {
        male: 50 + 2.3 * (heightInches - 60),
        female: 45.5 + 2.3 * (heightInches - 60)
      },
      robinson: {
        male: 52 + 1.9 * (heightInches - 60),
        female: 49 + 1.7 * (heightInches - 60)
      },
      miller: {
        male: 56.2 + 1.41 * (heightInches - 60),
        female: 53.1 + 1.36 * (heightInches - 60)
      },
      hamwi: {
        male: 106 + 6 * (heightInches - 60),
        female: 100 + 5 * (heightInches - 60)
      },
      peterson: {
        male: 52 + 1.9 * (heightInches - 60),
        female: 49 + 1.7 * (heightInches - 60)
      }
    }

    // Adjust for body frame
    const frameMultipliers = {
      small: 0.9,
      medium: 1.0,
      large: 1.1
    }

    const multiplier = frameMultipliers[bodyFrame as keyof typeof frameMultipliers]

    // Calculate BMI range (18.5 - 24.9)
    const heightM = heightCm / 100
    const bmiRange = {
      min: 18.5 * heightM * heightM,
      max: 24.9 * heightM * heightM
    }

    // Generate recommendations
    const recommendations = []
    const currentIdeal = formulas.devine[gender as keyof typeof formulas.devine] * multiplier
    
    if (a < 18) {
      recommendations.push('Focus on healthy growth and development')
    } else if (a < 65) {
      recommendations.push('Maintain healthy lifestyle with regular exercise')
      recommendations.push('Aim for balanced nutrition and adequate protein')
    } else {
      recommendations.push('Consider slightly higher weight for better health outcomes')
      recommendations.push('Focus on strength training and mobility')
    }

    // Apply frame adjustment to all formulas
    Object.keys(formulas).forEach(key => {
      formulas[key as keyof typeof formulas] = {
        male: formulas[key as keyof typeof formulas].male * multiplier,
        female: formulas[key as keyof typeof formulas].female * multiplier
      }
    })

    return { formulas, bmiRange, recommendations }
  }, [height, gender, age, bodyFrame])

  const handleCalculate = () => setShowResults(true)
  const handleReset = () => {
    setHeight('')
    setGender('male')
    setAge('')
    setBodyFrame('medium')
    setShowResults(false)
  }

  const result = showResults ? calculateIdealWeight() : { 
    formulas: {
      devine: { male: 0, female: 0 },
      robinson: { male: 0, female: 0 },
      miller: { male: 0, female: 0 },
      hamwi: { male: 0, female: 0 },
      peterson: { male: 0, female: 0 }
    }, 
    bmiRange: { min: 0, max: 0 }, 
    recommendations: [] 
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-4">
        <div className="flex items-center">
          <Target className="h-8 w-8 text-white mr-3" />
          <h2 className="text-2xl font-bold text-white">Ideal Weight Calculator</h2>
        </div>
        <p className="text-emerald-100 mt-1">Calculate your ideal weight using multiple formulas</p>
      </div>

      <div className="p-6">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Height (ft or cm)
              </label>
              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter height"
                aria-label="Height in feet or cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
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
                Age
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                placeholder="Enter age"
                aria-label="Age in years"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Body Frame
              </label>
              <select
                value={bodyFrame}
                onChange={(e) => setBodyFrame(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Select body frame"
              >
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={handleCalculate}
              className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
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
            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">Ideal Weight Results (lbs)</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Devine Formula:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.formulas.devine?.[gender as keyof typeof result.formulas.devine]?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Robinson Formula:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.formulas.robinson?.[gender as keyof typeof result.formulas.robinson]?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Miller Formula:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.formulas.miller?.[gender as keyof typeof result.formulas.miller]?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Hamwi Formula:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.formulas.hamwi?.[gender as keyof typeof result.formulas.hamwi]?.toFixed(1) || '0.0'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Peterson Formula:</span>
                  <span className="font-semibold text-emerald-800">
                    {result.formulas.peterson?.[gender as keyof typeof result.formulas.peterson]?.toFixed(1) || '0.0'}
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">Healthy BMI Range</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-emerald-700">Minimum Weight:</span>
                  <span className="font-semibold text-emerald-800">
                    {(result.bmiRange.min * 2.20462).toFixed(1)} lbs
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-emerald-700">Maximum Weight:</span>
                  <span className="font-semibold text-emerald-800">
                    {(result.bmiRange.max * 2.20462).toFixed(1)} lbs
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <h3 className="text-lg font-semibold text-emerald-800 mb-3">Recommendations</h3>
              <div className="space-y-2">
                {result.recommendations.map((rec, index) => (
                  <div key={index} className="flex items-start">
                    <span className="text-emerald-600 mr-2">•</span>
                    <span className="text-emerald-700">{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        
        {/* Calculator Description Section */}
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">About Ideal Weight Calculator</h3>
          <div className="prose prose-gray max-w-none">
            <p className="text-gray-700 mb-4">
              Our comprehensive ideal weight calculator helps individuals determine healthy weight ranges 
              using multiple validated medical formulas. This essential health assessment tool provides 
              accurate ideal weight calculations, BMI ranges, and personalized recommendations for 
              informed health and fitness planning.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">What It Calculates</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Ideal Weight:</strong> Multiple formula-based calculations</li>
              <li><strong>BMI Range:</strong> Healthy weight boundaries</li>
              <li><strong>Formula Comparison:</strong> Different calculation methods</li>
              <li><strong>Personalized Results:</strong> Age, gender, and frame-specific</li>
              <li><strong>Health Recommendations:</strong> Evidence-based guidance</li>
              <li><strong>Weight Categories:</strong> Underweight to obese classifications</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Ideal Weight Calculation Methods</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Classic Formulas</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Devine Formula:</strong> 1974, pharmaceutical dosing</li>
                  <li><strong>Robinson Formula:</strong> 1983, improved accuracy</li>
                  <li><strong>Miller Formula:</strong> 1983, gender-specific</li>
                  <li><strong>Hamwi Formula:</strong> 1964, clinical practice</li>
                  <li><strong>Peterson Formula:</strong> 2016, modern approach</li>
                  <li><strong>Accuracy:</strong> ±5-10% in most cases</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Formula Characteristics</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Base Height:</strong> 5 feet (60 inches)</li>
                  <li><strong>Gender Factors:</strong> Different for males/females</li>
                  <li><strong>Frame Adjustments:</strong> Small, medium, large</li>
                  <li><strong>Age Considerations:</strong> Some formulas include age</li>
                  <li><strong>Height Scaling:</strong> Linear with height</li>
                  <li><strong>Validation:</strong> Clinical studies support</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Understanding Your Results</h4>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div className="bg-emerald-50 p-3 rounded-lg border border-emerald-200">
                <h5 className="font-semibold text-emerald-800 mb-1">Devine</h5>
                <p className="text-emerald-700 text-sm">Pharmaceutical standard</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                <h5 className="font-semibold text-blue-800 mb-1">Robinson</h5>
                <p className="text-blue-700 text-sm">Improved accuracy</p>
              </div>
              <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                <h5 className="font-semibold text-green-800 mb-1">Miller</h5>
                <p className="text-green-700 text-sm">Gender-specific</p>
              </div>
              <div className="bg-purple-50 p-3 rounded-lg border border-purple-200">
                <h5 className="font-semibold text-purple-800 mb-1">Hamwi</h5>
                <p className="text-purple-700 text-sm">Clinical practice</p>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">How to Use</h4>
            <p className="text-gray-700 mb-4">
              Enter your height, age, gender, and body frame size. The calculator automatically computes 
              ideal weight using multiple formulas, provides healthy BMI ranges, and offers personalized 
              recommendations based on your specific characteristics.
            </p>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Ideal Weight Fundamentals</h4>
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>What is Ideal Weight:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Optimal weight for health</li>
                    <li>Based on height and build</li>
                    <li>Associated with longevity</li>
                    <li>Reduces disease risk</li>
                    <li>Improves quality of life</li>
                    <li>Individual variation exists</li>
                  </ul>
                </div>
                <div>
                  <p><strong>Why It Matters:</strong></p>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Health risk assessment</li>
                    <li>Fitness goal setting</li>
                    <li>Medical treatment planning</li>
                    <li>Lifestyle modification</li>
                    <li>Preventive healthcare</li>
                    <li>Performance optimization</li>
                  </ul>
                </div>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Body Frame Size Assessment</h4>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Small Frame</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Wrist Circumference:</strong> &lt; 6.25" (men), &lt; 5.75" (women)</li>
                  <li><strong>Elbow Breadth:</strong> &lt; 2.5" (men), &lt; 2.25" (women)</li>
                  <li><strong>Body Type:</strong> Ectomorph, lean</li>
                  <li><strong>Weight Range:</strong> Lower end of ideal</li>
                  <li><strong>Characteristics:</strong> Narrow shoulders, thin bones</li>
                  <li><strong>Adjustment:</strong> -10% from medium frame</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Medium Frame</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Wrist Circumference:</strong> 6.25-6.75" (men), 5.75-6.25" (women)</li>
                  <li><strong>Elbow Breadth:</strong> 2.5-2.75" (men), 2.25-2.5" (women)</li>
                  <li><strong>Body Type:</strong> Mesomorph, athletic</li>
                  <li><strong>Weight Range:</strong> Standard ideal weight</li>
                  <li><strong>Characteristics:</strong> Balanced proportions</li>
                  <li><strong>Adjustment:</strong> Base calculation</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Large Frame</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Wrist Circumference:</strong> &gt; 6.75" (men), &gt; 6.25" (women)</li>
                  <li><strong>Elbow Breadth:</strong> &gt; 2.75" (men), &gt; 2.5" (women)</li>
                  <li><strong>Body Type:</strong> Endomorph, robust</li>
                  <li><strong>Weight Range:</strong> Higher end of ideal</li>
                  <li><strong>Characteristics:</strong> Broad shoulders, thick bones</li>
                  <li><strong>Adjustment:</strong> +10% from medium frame</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">BMI and Health Categories</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Underweight:</strong> BMI &lt; 18.5, health risks from low weight</li>
              <li><strong>Normal Weight:</strong> BMI 18.5-24.9, optimal health range</li>
              <li><strong>Overweight:</strong> BMI 25.0-29.9, increased health risks</li>
              <li><strong>Obesity Class I:</strong> BMI 30.0-34.9, significant health risks</li>
              <li><strong>Obesity Class II:</strong> BMI 35.0-39.9, severe health risks</li>
              <li><strong>Obesity Class III:</strong> BMI ≥ 40.0, extreme health risks</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Formula-Specific Details</h4>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Devine Formula (1974)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Origin:</strong> Pharmaceutical dosing</li>
                  <li><strong>Base Weight:</strong> 110 lbs (women), 120 lbs (men)</li>
                  <li><strong>Height Factor:</strong> +5 lbs per inch over 5'</li>
                  <li><strong>Gender Factor:</strong> +10 lbs for men</li>
                  <li><strong>Use Case:</strong> Medication dosing</li>
                  <li><strong>Limitations:</strong> May underestimate for some</li>
                </ul>
              </div>
              <div>
                <h5 className="font-semibold text-gray-800 mb-2">Robinson Formula (1983)</h5>
                <ul className="list-disc list-inside text-gray-700 space-y-1 text-sm">
                  <li><strong>Origin:</strong> Improved Devine formula</li>
                  <li><strong>Base Weight:</strong> 100 lbs (women), 110 lbs (men)</li>
                  <li><strong>Height Factor:</strong> +5 lbs per inch over 5'</li>
                  <li><strong>Gender Factor:</strong> +10 lbs for men</li>
                  <li><strong>Use Case:</strong> Clinical practice</li>
                  <li><strong>Advantages:</strong> More accurate than Devine</li>
                </ul>
              </div>
            </div>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Factors Affecting Ideal Weight</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Height:</strong> Primary determinant of ideal weight</li>
              <li><strong>Gender:</strong> Different standards for males/females</li>
              <li><strong>Age:</strong> Weight needs change with aging</li>
              <li><strong>Body Frame:</strong> Bone structure and build</li>
              <li><strong>Muscle Mass:</strong> Athletic vs. sedentary individuals</li>
              <li><strong>Health Status:</strong> Medical conditions affect weight</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Ideal Weight Calculation Tips</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Use Multiple Formulas:</strong> Compare different calculations</li>
              <li><strong>Consider Body Frame:</strong> Assess your actual frame size</li>
              <li><strong>Account for Age:</strong> Weight needs change over time</li>
              <li><strong>Evaluate Muscle Mass:</strong> Athletes may weigh more</li>
              <li><strong>Consult Healthcare Provider:</strong> Professional assessment</li>
              <li><strong>Focus on Health:</strong> Weight is one health indicator</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Common Ideal Weight Mistakes</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Ignoring Body Frame:</strong> Not adjusting for build</li>
              <li><strong>Single Formula Reliance:</strong> Using only one method</li>
              <li><strong>Ignoring Age Factors:</strong> Not considering life stage</li>
              <li><strong>Muscle Mass Confusion:</strong> Equating weight with fat</li>
              <li><strong>Unrealistic Expectations:</strong> Setting impossible goals</li>
              <li><strong>Ignoring Health Context:</strong> Weight without health focus</li>
            </ul>
            
            <h4 className="text-lg font-semibold text-gray-800 mb-2">Advanced Ideal Weight Concepts</h4>
            <ul className="list-disc list-inside text-gray-700 mb-4 space-y-1">
              <li><strong>Body Composition:</strong> Fat vs. muscle distribution</li>
              <li><strong>Metabolic Health:</strong> Beyond weight numbers</li>
              <li><strong>Waist Circumference:</strong> Abdominal fat assessment</li>
              <li><strong>Waist-to-Height Ratio:</strong> Better than BMI alone</li>
              <li><strong>Body Fat Percentage:</strong> More accurate than weight</li>
              <li><strong>Functional Fitness:</strong> Performance over appearance</li>
            </ul>
            
            <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-emerald-500">
              <h5 className="font-semibold text-gray-800 mb-2">Pro Tip</h5>
              <p className="text-gray-700 text-sm">
                Remember that ideal weight is a range, not a single number. The various formulas provide 
                different perspectives, and your actual ideal weight may fall anywhere within these ranges. 
                Focus on achieving a weight that allows you to feel healthy, energetic, and comfortable in 
                your body. Consider factors beyond the scale, such as body composition, fitness level, 
                and overall health markers. Work with healthcare professionals to set realistic, healthy 
                weight goals that support your long-term well-being rather than just meeting a number on 
                the scale.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
