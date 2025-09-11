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
          <div className="bg-gray-100 rounded-lg flex items-center justify-center h-24">
            <div className="text-center text-gray-400">
              <div className="text-lg font-semibold mb-1">Google Ad 1</div>
              <div className="text-sm">728x90</div>
              <div className="text-xs">Top Banner</div>
            </div>
          </div>
          {/* AdSense Script - Uncomment when you have your ad unit ID */}
          {/* <ins className="adsbygoogle"
               style={{display:'block'}}
               data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
               data-ad-slot="YOUR_TOP_BANNER_AD_SLOT_ID"
               data-ad-format="auto"
               data-full-width-responsive="true"></ins>
          <script>
            (adsbygoogle = window.adsbygoogle || []).push({});
          </script> */}
        </div>
      </div>

      <div className="flex gap-6">
        {/* Left Sidebar Ads - Ads 2 & 3 */}
        <div className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Left Ad 1 */}
            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
              <div className="bg-gray-100 rounded-lg flex items-center justify-center h-80">
                <div className="text-center text-gray-400">
                  <div className="text-lg font-semibold mb-2">Google Ad 2</div>
                  <div className="text-sm">160x600</div>
                  <div className="text-xs mt-1">Left Sidebar</div>
                </div>
              </div>
              {/* AdSense Script */}
              {/* <ins className="adsbygoogle"
                   style={{display:'block'}}
                   data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
                   data-ad-slot="YOUR_LEFT_AD_SLOT_ID"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script> */}
            </div>

            {/* Left Ad 2 */}
            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
              <div className="bg-gray-100 rounded-lg flex items-center justify-center h-80">
                <div className="text-center text-gray-400">
                  <div className="text-lg font-semibold mb-2">Google Ad 3</div>
                  <div className="text-sm">160x600</div>
                  <div className="text-xs mt-1">Left Sidebar 2</div>
                </div>
              </div>
              {/* AdSense Script */}
              {/* <ins className="adsbygoogle"
                   style={{display:'block'}}
                   data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
                   data-ad-slot="YOUR_LEFT_AD2_SLOT_ID"
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

        {/* Right Sidebar Ads - Ads 4 & 5 */}
        <div className="hidden xl:block w-64 flex-shrink-0">
          <div className="sticky top-24 space-y-6">
            {/* Right Ad 1 */}
            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
              <div className="bg-gray-100 rounded-lg flex items-center justify-center h-80">
                <div className="text-center text-gray-400">
                  <div className="text-lg font-semibold mb-2">Google Ad 4</div>
                  <div className="text-sm">160x600</div>
                  <div className="text-xs mt-1">Right Sidebar</div>
                </div>
              </div>
              {/* AdSense Script */}
              {/* <ins className="adsbygoogle"
                   style={{display:'block'}}
                   data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
                   data-ad-slot="YOUR_RIGHT_AD_SLOT_ID"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script> */}
            </div>

            {/* Right Ad 2 */}
            <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
              <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
              <div className="bg-gray-100 rounded-lg flex items-center justify-center h-80">
                <div className="text-center text-gray-400">
                  <div className="text-lg font-semibold mb-2">Google Ad 5</div>
                  <div className="text-sm">160x600</div>
                  <div className="text-xs mt-1">Right Sidebar 2</div>
                </div>
              </div>
              {/* AdSense Script */}
              {/* <ins className="adsbygoogle"
                   style={{display:'block'}}
                   data-ad-client="ca-pub-YOUR_PUBLISHER_ID"
                   data-ad-slot="YOUR_RIGHT_AD2_SLOT_ID"
                   data-ad-format="auto"
                   data-full-width-responsive="true"></ins>
              <script>
                (adsbygoogle = window.adsbygoogle || []).push({});
              </script> */}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Ads - Show 3 ads for mobile */}
      <div className="xl:hidden mt-8 space-y-6">
        {/* Mobile Ad 1 */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
          <div className="bg-gray-100 rounded-lg flex items-center justify-center h-24">
            <div className="text-center text-gray-400">
              <div className="text-lg font-semibold mb-1">Google Ad 1</div>
              <div className="text-sm">728x90</div>
              <div className="text-xs">Mobile Banner</div>
            </div>
          </div>
        </div>

        {/* Mobile Ad 2 */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
          <div className="bg-gray-100 rounded-lg flex items-center justify-center h-24">
            <div className="text-center text-gray-400">
              <div className="text-lg font-semibold mb-1">Google Ad 2</div>
              <div className="text-sm">728x90</div>
              <div className="text-xs">Mobile Banner 2</div>
            </div>
          </div>
        </div>

        {/* Mobile Ad 3 */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
          <div className="bg-gray-100 rounded-lg flex items-center justify-center h-24">
            <div className="text-center text-gray-400">
              <div className="text-lg font-semibold mb-1">Google Ad 3</div>
              <div className="text-sm">728x90</div>
              <div className="text-xs">Mobile Banner 3</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
