#!/bin/bash

# Script to update all calculator pages with the new 5-ads layout

# Find all calculator page.tsx files
find app -name "page.tsx" -path "*calculator*" > calculator_pages.txt

echo "Found $(wc -l < calculator_pages.txt) calculator pages to update"

# Function to update a page with ads layout
update_page() {
    local page_file="$1"
    local page_dir=$(dirname "$page_file")
    
    echo "Updating $page_file..."
    
    # Create backup
    cp "$page_file" "$page_file.backup"
    
    # Extract the component name from the file
    local component_name=$(grep -o "import.*from.*calculators" "$page_file" | sed 's/.*import \([^[:space:]]*\) from.*/\1/')
    
    # Create new content with ads layout
    cat > "$page_file" << EOF
import { Metadata } from 'next'
import ${component_name} from '../components/calculators/${component_name}'
import CalculatorWithAds from '../components/CalculatorWithAds'

export const metadata: Metadata = {
  title: 'Free Online Calculators - Math, Finance, Health & More | Online Calculator.live',
  description: 'Free online calculators for math, finance, health, construction, education, and more. Over 200+ calculators including mortgage, BMI, scientific, unit conversion, and financial planning tools.',
  keywords: ['free online calculators', 'calculator', 'math calculator', 'finance calculator', 'health calculator'],
  openGraph: {
    title: 'Free Online Calculators - Math, Finance, Health & More | Online Calculator.live',
    description: 'Free online calculators for math, finance, health, construction, education, and more.',
    url: 'https://onlinecalculator.live',
    siteName: 'Online Calculator.live',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Online Calculators - Math, Finance, Health & More | Online Calculator.live',
    description: 'Free online calculators for math, finance, health, construction, education, and more.',
  },
  alternates: {
    canonical: 'https://onlinecalculator.live',
  },
}

export default function CalculatorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <CalculatorWithAds>
        <${component_name} />
      </CalculatorWithAds>
    </div>
  );
}
EOF
}

# Update a few key pages manually first
key_pages=(
    "app/bmi-calculator/page.tsx"
    "app/calorie-calculator/page.tsx"
    "app/compound-interest-calculator/page.tsx"
    "app/fraction-calculator/page.tsx"
    "app/percentage-calculator/page.tsx"
    "app/scientific-calculator/page.tsx"
    "app/age-calculator/page.tsx"
    "app/date-calculator/page.tsx"
)

for page in "${key_pages[@]}"; do
    if [ -f "$page" ]; then
        update_page "$page"
    fi
done

echo "Updated key calculator pages with 5-ads layout"
echo "You can run this script again to update more pages"
