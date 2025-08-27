import { MetadataRoute } from 'next'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://onlinecalculator.live'
  const currentDate = new Date()
  
  // Core pages with highest priority
  const corePages = [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily' as const,
      priority: 1.0,
    },
    {
      url: `${baseUrl}/search-calculator`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/compare-calculators`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/calculation-history`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // High-priority calculator categories
  const highPriorityCalculators = [
    // Financial Calculators (High Search Volume)
    { url: `${baseUrl}/mortgage-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/loan-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/auto-loan-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/investment-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/retirement-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/compound-interest-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/simple-interest-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/discount-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/tip-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/income-tax-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    
    // Health & Fitness Calculators (High Search Volume)
    { url: `${baseUrl}/bmi-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/calorie-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/body-fat-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/bmr-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/tdee-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/macro-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/target-heart-rate-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    
    // Math & Science Calculators (High Search Volume)
    { url: `${baseUrl}/scientific-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/fraction-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/percentage-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/unit-converter-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/area-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/volume-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    
    // Education Calculators (High Search Volume)
    { url: `${baseUrl}/gpa-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/grade-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
    { url: `${baseUrl}/age-calculator`, lastModified: currentDate, changeFrequency: 'daily' as const, priority: 0.9 },
  ]

  // Medium-priority calculators
  const mediumPriorityCalculators = [
    // Construction & Engineering
    { url: `${baseUrl}/tile-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/concrete-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/roofing-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/paint-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/electrical-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/stair-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/square-footage-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/mulch-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/gravel-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    
    // Conversion Calculators
    { url: `${baseUrl}/calculators/length`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calculators/weight`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calculators/temperature`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calculators/currency`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calculators/time`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    
    // Time & Date Calculators
    { url: `${baseUrl}/date-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/time-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/time-duration-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/time-zone-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/day-counter-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/day-of-week-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    
    // Specialty Calculators
    { url: `${baseUrl}/tire-size-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/wind-chill-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/heat-index-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/dew-point-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/bandwidth-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/ip-subnet-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/resistor-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/ohms-law-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/voltage-drop-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    
    // Health & Fitness (Medium Priority)
    { url: `${baseUrl}/body-type-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/healthy-weight-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/ideal-weight-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/overweight-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/lean-body-mass-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/body-surface-area-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calories-burned-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/protein-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/carbohydrate-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/fat-intake-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/sleep-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    
    // Math & Science (Medium Priority)
    { url: `${baseUrl}/triangle-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/standard-deviation-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/random-number-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/fraction-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/percentage-grade-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/golf-handicap-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/one-rep-max-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/pace-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/speed-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    
    // Financial (Medium Priority)
    { url: `${baseUrl}/discount-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/commission-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/margin-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/roi-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/irr-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/payback-period-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/present-value-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/future-value-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/average-return-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/debt-to-income-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/down-payment-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/refinance-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/fha-loan-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/va-loan-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/usda-loan-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/jumbo-loan-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/conventional-loan-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/boat-loan-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/personal-loan-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/business-loan-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/rental-property-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/real-estate-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/budget-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/lease-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/payment-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/interest-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/percent-off-calculator`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    
    // Other Calculators
    { url: `${baseUrl}/calculators/salary`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calculators/scholarship`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calculators/pregnancy`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calculators/ideal-weight`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calculators/electrical`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calculators/roofing`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calculators/flooring`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calculators/paint`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calculators/concrete`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calculators/countdown`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
    { url: `${baseUrl}/calculators/hours`, lastModified: currentDate, changeFrequency: 'weekly' as const, priority: 0.8 },
  ]

  // Lower-priority calculators
  const lowerPriorityCalculators = [
    { url: `${baseUrl}/dice-roller-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/password-generator-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/love-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/bra-size-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/shoe-size-converter-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/roman-numeral-converter-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/weight-watchers-points-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/gfr-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/anorexic-bmi-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/army-body-fat-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/bac-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/gdp-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/molecular-weight-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/mass-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/mileage-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/horsepower-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/height-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/btu-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/time-card-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/ovulation-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/conception-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/period-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
    { url: `${baseUrl}/pregnancy-weight-gain-calculator`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.6 },
  ]

  // Compliance and legal pages
  const compliancePages = [
    { url: `${baseUrl}/privacy`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/terms`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/gdpr-compliance`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/ccpa-compliance`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${baseUrl}/data-protection`, lastModified: currentDate, changeFrequency: 'monthly' as const, priority: 0.7 },
  ]

  return [
    ...corePages,
    ...highPriorityCalculators,
    ...mediumPriorityCalculators,
    ...lowerPriorityCalculators,
    ...compliancePages,
  ]
}
