'use client'

import Script from 'next/script'

// Sanitize GA ID: must match G-XXXXXXXXXX or UA-XXXXXX-X format
function sanitizeGAId(id: string | undefined): string | null {
  if (!id) return null
  const cleaned = id.trim()
  // Only allow valid GA4 or Universal Analytics ID formats
  if (/^(G-[A-Z0-9]{4,20}|UA-\d{4,12}-\d{1,4})/.test(cleaned)) {
    return cleaned
  }
  return null
}

export default function GoogleAnalytics() {
  const gaId = sanitizeGAId(process.env.NEXT_PUBLIC_GA_ID)

  // Don't render anything if GA ID is missing or malformed
  if (!gaId) return null

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          // GA ID is validated above — safe to interpolate
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${gaId}', {
              page_title: document.title,
              page_location: window.location.href,
              send_page_view: true,
              anonymize_ip: true
            });

            function trackCalculatorUsage(calculatorName, action) {
              if (typeof calculatorName !== 'string' || typeof action !== 'string') return;
              gtag('event', 'calculator_interaction', {
                'calculator_name': calculatorName.slice(0, 100),
                'action': action.slice(0, 100),
                'event_category': 'Calculator Usage'
              });
            }

            function trackSharingAction(calculatorName, shareMethod) {
              if (typeof calculatorName !== 'string' || typeof shareMethod !== 'string') return;
              gtag('event', 'share_calculation', {
                'calculator_name': calculatorName.slice(0, 100),
                'share_method': shareMethod.slice(0, 50),
                'event_category': 'Sharing'
              });
            }

            window.trackCalculatorUsage = trackCalculatorUsage;
            window.trackSharingAction = trackSharingAction;
          `,
        }}
      />
    </>
  )
}

