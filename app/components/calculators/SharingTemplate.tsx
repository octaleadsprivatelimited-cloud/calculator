// TEMPLATE: How to Add Sharing Functionality to Any Calculator
// 
// 1. Import the ResultSharing component:
// import ResultSharing from '../ResultSharing'
//
// 2. Add the sharing component after your results section:
//
// {/* Result Sharing Component */}
// <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
//   <ResultSharing
//     title="Calculator Result Title"
//     inputs={[
//       { label: "Input Label 1", value: "Input Value 1" },
//       { label: "Input Label 2", value: "Input Value 2" },
//       { label: "Input Label 3", value: "Input Value 3" }
//     ]}
//     result={{ 
//       label: "Result Label", 
//       value: "Result Value",
//       unit: "Optional Unit" 
//     }}
//     calculatorName="Calculator Name"
//     className="mt-3"
//   />
// </div>
//
// 3. Example for a simple calculator:
//
// {/* Result Sharing Component */}
// <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
//   <ResultSharing
//     title="Simple Calculation Result"
//     inputs={[
//       { label: "First Number", value: number1.toString() },
//       { label: "Second Number", value: number2.toString() },
//       { label: "Operation", value: operation }
//     ]}
//     result={{ 
//       label: "Result", 
//       value: result.toString(),
//       unit: ""
//     }}
//     calculatorName="Simple Calculator"
//     className="mt-3"
//   />
// </div>
//
// 4. Example for a financial calculator:
//
// {/* Result Sharing Component */}
// <div className="p-4 bg-green-50 rounded-lg border border-green-200">
//   <ResultSharing
//     title="Financial Calculation Result"
//     inputs={[
//       { label: "Principal", value: formatCurrency(principal) },
//       { label: "Rate", value: `${rate.toFixed(2)}%` },
//       { label: "Time", value: `${time} years` }
//     ]}
//     result={{ 
//       label: "Final Amount", 
//       value: formatCurrency(finalAmount),
//       unit: ""
//     }}
//     calculatorName="Financial Calculator"
//     className="mt-3"
//   />
// </div>
//
// 5. Example for a health calculator:
//
// {/* Result Sharing Component */}
// <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
//   <ResultSharing
//     title="Health Calculation Result"
//     inputs={[
//       { label: "Weight", value: `${weight} kg` },
//       { label: "Height", value: `${height} cm` },
//       { label: "Age", value: `${age} years` }
//     ]}
//     result={{ 
//       label: "BMI", 
//       value: bmi.toFixed(1),
//       unit: ""
//     }}
//     calculatorName="BMI Calculator"
//     className="mt-3"
//   />
// </div>
//
// KEY POINTS:
// - Always place the sharing component AFTER your results display
// - Use appropriate background colors (bg-blue-50, bg-green-50, etc.)
// - Include ALL relevant inputs that were used in the calculation
// - Make the result label descriptive and clear
// - Use the exact calculator name for branding
// - The website URL (https://www.onlinecalculator.live) is automatically included
//
// SHARING OPTIONS INCLUDED:
// ✅ WhatsApp sharing
// ✅ Image download (PNG)
// ✅ PDF download
// ✅ Copy to clipboard
// ✅ All formats include website URL and branding
