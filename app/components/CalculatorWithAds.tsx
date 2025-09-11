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
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center h-24 text-white">
            <div className="text-center">
              <div className="text-lg font-bold mb-1">🚀 Premium Calculator Tools</div>
              <div className="text-sm opacity-90">Get Advanced Features - Try Now!</div>
              <div className="text-xs opacity-75 mt-1">728x90 Banner Ad</div>
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
              <div className="bg-gradient-to-b from-green-400 to-blue-500 rounded-lg flex flex-col items-center justify-center h-80 text-white p-4">
                <div className="text-center">
                  <div className="text-2xl mb-3">💰</div>
                  <div className="text-lg font-bold mb-2">Earn Money Online</div>
                  <div className="text-sm mb-3 opacity-90">Start Your Side Hustle Today</div>
                  <div className="bg-white text-green-600 px-4 py-2 rounded-full text-sm font-semibold">
                    Learn More
                  </div>
                  <div className="text-xs opacity-75 mt-3">160x600 Ad</div>
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
              <div className="bg-gradient-to-b from-orange-400 to-red-500 rounded-lg flex flex-col items-center justify-center h-80 text-white p-4">
                <div className="text-center">
                  <div className="text-2xl mb-3">🏠</div>
                  <div className="text-lg font-bold mb-2">Buy Your Dream Home</div>
                  <div className="text-sm mb-3 opacity-90">Lowest Interest Rates</div>
                  <div className="bg-white text-orange-600 px-4 py-2 rounded-full text-sm font-semibold">
                    Get Quote
                  </div>
                  <div className="text-xs opacity-75 mt-3">160x600 Ad</div>
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
              <div className="bg-gradient-to-b from-purple-500 to-pink-500 rounded-lg flex flex-col items-center justify-center h-80 text-white p-4">
                <div className="text-center">
                  <div className="text-2xl mb-3">💳</div>
                  <div className="text-lg font-bold mb-2">Credit Card Offers</div>
                  <div className="text-sm mb-3 opacity-90">0% APR for 18 Months</div>
                  <div className="bg-white text-purple-600 px-4 py-2 rounded-full text-sm font-semibold">
                    Apply Now
                  </div>
                  <div className="text-xs opacity-75 mt-3">160x600 Ad</div>
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
              <div className="bg-gradient-to-b from-teal-400 to-blue-500 rounded-lg flex flex-col items-center justify-center h-80 text-white p-4">
                <div className="text-center">
                  <div className="text-2xl mb-3">📱</div>
                  <div className="text-lg font-bold mb-2">New Smartphone</div>
                  <div className="text-sm mb-3 opacity-90">50% Off Today Only</div>
                  <div className="bg-white text-teal-600 px-4 py-2 rounded-full text-sm font-semibold">
                    Shop Now
                  </div>
                  <div className="text-xs opacity-75 mt-3">160x600 Ad</div>
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
          <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center h-24 text-white">
            <div className="text-center">
              <div className="text-lg font-bold mb-1">💎 Premium Tools</div>
              <div className="text-sm opacity-90">Unlock Advanced Features</div>
            </div>
          </div>
        </div>

        {/* Mobile Ad 2 */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
          <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center h-24 text-white">
            <div className="text-center">
              <div className="text-lg font-bold mb-1">💰 Earn Money</div>
              <div className="text-sm opacity-90">Start Your Business Today</div>
            </div>
          </div>
        </div>

        {/* Mobile Ad 3 */}
        <div className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
          <div className="text-center text-sm text-gray-500 mb-3">Advertisement</div>
          <div className="bg-gradient-to-r from-rose-500 to-pink-600 rounded-lg flex items-center justify-center h-24 text-white">
            <div className="text-center">
              <div className="text-lg font-bold mb-1">🏠 Home Loans</div>
              <div className="text-sm opacity-90">Best Rates Available</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
