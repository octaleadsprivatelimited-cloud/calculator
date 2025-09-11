import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg
            className="w-8 h-8 text-blue-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.29-1.009-5.824-2.57M15 6.334A7.962 7.962 0 0112 4c-2.34 0-4.29 1.009-5.824 2.57"
            />
          </svg>
        </div>
        
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Page Not Found
        </h2>
        
        <p className="text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <div className="space-y-3">
          <Link
            href="/"
            className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Go Home
          </Link>
          
          <Link
            href="/search-calculator"
            className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-6 rounded-lg transition-colors"
          >
            Search Calculators
          </Link>
        </div>
        
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">Popular Calculators:</p>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link href="/bmi-calculator" className="text-blue-600 hover:text-blue-800">
              BMI Calculator
            </Link>
            <Link href="/mortgage-calculator" className="text-blue-600 hover:text-blue-800">
              Mortgage Calculator
            </Link>
            <Link href="/percentage-calculator" className="text-blue-600 hover:text-blue-800">
              Percentage Calculator
            </Link>
            <Link href="/scientific-calculator" className="text-blue-600 hover:text-blue-800">
              Scientific Calculator
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
