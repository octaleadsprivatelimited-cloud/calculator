import MarriageBiodataGenerator from '../components/calculators/MarriageBiodataGenerator'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marriage Biodata Generator | Professional Matrimony Resume Maker',
  description: 'Create an elegant and professional marriage biodata for Indians. Free matrimonial resume generator with PDF export, including horoscope and family details.',
  keywords: 'marriage biodata, matrimonial resume, indian biodata maker, marriage resume generator, biodata for marriage, wedding biodata, indian matrimony',
  openGraph: {
    title: 'Marriage Biodata Generator | Professional Matrimony Resume Maker',
    description: 'Create an elegant and professional marriage biodata for Indians. Free matrimonial resume generator with PDF export.',
    type: 'website',
  }
}

export default function MarriageBiodataPage() {
  return (
    <div className="py-8">
      <MarriageBiodataGenerator />
    </div>
  )
}
