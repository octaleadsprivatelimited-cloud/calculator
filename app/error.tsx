'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Only log in development — never expose stack traces in production
    if (process.env.NODE_ENV === 'development') {
      console.error('[Error Boundary]', error)
    }
    // In production, you would send to an error reporting service here
    // e.g. Sentry.captureException(error)
  }, [error])

  return (
    <div className="min-h-screen bg-google-bg flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-google border border-google-border p-8 text-center">
        <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
        </div>
        
        <h1 className="text-xl font-medium text-google-text mb-3">
          Something went wrong
        </h1>
        
        <p className="text-google-gray text-sm mb-6">
          We encountered an unexpected error. Please try again or go back to the homepage.
        </p>
        
        <div className="space-y-3">
          <button
            onClick={reset}
            className="w-full bg-google-blue hover:bg-google-blueHover text-white font-medium py-3 px-6 rounded-full transition-colors"
          >
            Try Again
          </button>
          
          <a
            href="/"
            className="block w-full bg-google-lightGray hover:bg-google-border text-google-gray font-medium py-3 px-6 rounded-full transition-colors"
          >
            Go Home
          </a>
        </div>
        
        {/* Only show error digest (opaque ID) in development — never expose message/stack */}
        {process.env.NODE_ENV === 'development' && error.digest && (
          <details className="mt-5 text-left">
            <summary className="cursor-pointer text-xs text-google-gray hover:text-google-text">
              Error Digest (Dev Only)
            </summary>
            <pre className="mt-2 text-xs text-google-gray bg-google-lightGray p-3 rounded-xl overflow-auto">
              {error.digest}
            </pre>
          </details>
        )}
      </div>
    </div>
  )
}
