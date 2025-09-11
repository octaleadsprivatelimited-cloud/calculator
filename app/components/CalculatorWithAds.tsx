'use client'

import React from 'react'

interface CalculatorWithAdsProps {
  children: React.ReactNode
  className?: string
}

export default function CalculatorWithAds({ children, className = '' }: CalculatorWithAdsProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${className}`}>
      {/* Top Banner Ad - Ad 1 */}
      <div className="mb-6">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
          {/* Google AdSense Ad Unit - Top Banner */}
          <ins className="adsbygoogle"
               style={{display:'block'}}
               data-ad-client="ca-pub-1234567890123456"
               data-ad-slot="1234567890"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar Ads - Ads 2 & 3 */}
        <div className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Left Ad 1 */}
            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
              {/* Google AdSense Ad Unit - Left Sidebar */}
              <ins className="adsbygoogle"
                   style={{display:'block'}}
                   data-ad-client="ca-pub-1234567890123456"
                   data-ad-slot="2345678901"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
            </div>

            {/* Left Ad 2 */}
            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
              {/* Google AdSense Ad Unit - Left Sidebar 2 */}
              <ins className="adsbygoogle"
                   style={{display:'block'}}
                   data-ad-client="ca-pub-1234567890123456"
                   data-ad-slot="3456789012"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
            </div>
          </div>
        </div>

        {/* Main Calculator Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* Right Sidebar Ads - Ads 4 & 5 */}
        <div className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Right Ad 1 */}
            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
              {/* Google AdSense Ad Unit - Right Sidebar */}
              <ins className="adsbygoogle"
                   style={{display:'block'}}
                   data-ad-client="ca-pub-1234567890123456"
                   data-ad-slot="4567890123"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
            </div>

            {/* Right Ad 2 */}
            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
              {/* Google AdSense Ad Unit - Right Sidebar 2 */}
              <ins className="adsbygoogle"
                   style={{display:'block'}}
                   data-ad-client="ca-pub-1234567890123456"
                   data-ad-slot="5678901234"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Ads - Show 3 ads for mobile */}
      <div className="xl:hidden mt-8 space-y-6">
        {/* Mobile Ad 1 */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
          {/* Google AdSense Ad Unit - Mobile Banner 1 */}
          <ins className="adsbygoogle"
               style={{display:'block'}}
               data-ad-client="ca-pub-1234567890123456"
               data-ad-slot="6789012345"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>

        {/* Mobile Ad 2 */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
          {/* Google AdSense Ad Unit - Mobile Banner 2 */}
          <ins className="adsbygoogle"
               style={{display:'block'}}
               data-ad-client="ca-pub-1234567890123456"
               data-ad-slot="7890123456"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>

        {/* Mobile Ad 3 */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
          {/* Google AdSense Ad Unit - Mobile Banner 3 */}
          <ins className="adsbygoogle"
               style={{display:'block'}}
               data-ad-client="ca-pub-1234567890123456"
               data-ad-slot="8901234567"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
          </script>
        </div>
      </div>
    </div>
  )
}
