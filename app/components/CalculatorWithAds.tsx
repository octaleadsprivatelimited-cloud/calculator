'use client'

import React from 'react'

interface CalculatorWithAdsProps {
  children: React.ReactNode
  className?: string
}

export default function CalculatorWithAds({ children, className = '' }: CalculatorWithAdsProps) {
  return (
    <div className={`max-w-7xl mx-auto px-4 py-8 ${className}`}>
      <div className="flex gap-6">
        {/* Left Sidebar Ad */}
        <div className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
              {/* Google AdSense Ad Unit - Left Sidebar */}
              <div className="bg-gray-100 rounded-lg flex items-center justify-center h-96">
                <div className="text-center text-gray-400">
                  <div className="text-lg font-semibold mb-2">Google Ad</div>
                  <div className="text-sm">160x600</div>
                  <div className="text-xs mt-1">Left Sidebar</div>
                </div>
              </div>
              {/* AdSense Script - Uncomment when you have your ad unit ID */}
              {/* <ins className="adsbygoogle"
                   style={{display:'block'}}
                   data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
                   data-ad-slot="YOUR_AD_SLOT_ID"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script> */}
            </div>
          </div>
        </div>

        {/* Main Calculator Content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>

        {/* Right Sidebar Ad */}
        <div className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-24">
            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
              {/* Google AdSense Ad Unit - Right Sidebar */}
              <div className="bg-gray-100 rounded-lg flex items-center justify-center h-96">
                <div className="text-center text-gray-400">
                  <div className="text-lg font-semibold mb-2">Google Ad</div>
                  <div className="text-sm">160x600</div>
                  <div className="text-xs mt-1">Right Sidebar</div>
                </div>
              </div>
              {/* AdSense Script - Uncomment when you have your ad unit ID */}
              {/* <ins className="adsbygoogle"
                   style={{display:'block'}}
                   data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
                   data-ad-slot="YOUR_AD_SLOT_ID"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script> */}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Ads */}
      <div className="xl:hidden mt-8">
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
          {/* Google AdSense Ad Unit - Mobile Banner */}
          <div className="bg-gray-100 rounded-lg flex items-center justify-center h-32">
            <div className="text-center text-gray-400">
              <div className="text-lg font-semibold mb-2">Google Ad</div>
              <div className="text-sm">728x90</div>
              <div className="text-xs mt-1">Mobile Banner</div>
            </div>
          </div>
          {/* AdSense Script - Uncomment when you have your ad unit ID */}
          {/* <ins className="adsbygoogle"
               style={{display:'block'}}
               data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
               data-ad-slot="YOUR_AD_SLOT_ID"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
          </script> */}
        </div>
      </div>
    </div>
  )
}
