'use client'

import Script from 'next/script'

export default function GoogleAnalytics() {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true
            });
            
            // Enhanced E-commerce tracking for calculator usage
            gtag('config', '${process.env.NEXT_PUBLIC_GA_ID}', {
              custom_map: {
                'custom_dimension1': 'calculator_name',
                'custom_dimension2': 'calculation_type',
                'custom_dimension3': 'user_action'
              }
            });
            
            // Track calculator interactions
            function trackCalculatorUsage(calculatorName, action) {
              gtag('event', 'calculator_interaction', {
                'calculator_name': calculatorName,
                'action': action,
                'event_category': 'Calculator Usage',
                'event_label': calculatorName + ' - ' + action
              });
            }
            
            // Track sharing actions
            function trackSharingAction(calculatorName, shareMethod) {
              gtag('event', 'share_calculation', {
                'calculator_name': calculatorName,
                'share_method': shareMethod,
                'event_category': 'Sharing',
                'event_label': calculatorName + ' - ' + shareMethod
              });
            }
            
            // Make functions globally available
            window.trackCalculatorUsage = trackCalculatorUsage;
            window.trackSharingAction = trackSharingAction;
          `,
        }}
      />
    </>
  )
}
