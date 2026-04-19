'use client'

import React, { useState, useRef } from 'react'
import { 
  Calculator, 
  User, 
  GraduationCap, 
  Users, 
  Heart, 
  Phone, 
  Calendar, 
  MapPin, 
  Download, 
  Printer, 
  FileText,
  Star
} from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export default function MarriageBiodataGenerator() {
  const [formData, setFormData] = useState({
    name: '',
    dob: '',
    tob: '',
    pob: '',
    height: '',
    weight: '',
    bloodGroup: '',
    complexion: '',
    education: '',
    college: '',
    profession: '',
    company: '',
    income: '',
    fatherName: '',
    fatherProfession: '',
    motherName: '',
    motherProfession: '',
    siblings: '',
    familyType: 'Nuclear',
    familyValues: 'Moderate',
    caste: '',
    subCaste: '',
    gotra: '',
    raashi: '',
    nakshatra: '',
    manglik: 'No',
    aboutMe: '',
    hobbies: '',
    contactAddress: '',
    contactPhone: '',
    contactEmail: ''
  })

  const biodataRef = useRef<HTMLDivElement>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const downloadPDF = async () => {
    if (!biodataRef.current) return
    
    const canvas = await html2canvas(biodataRef.current, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    })
    
    const imgData = canvas.toDataURL('image/png')
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgProps = pdf.getImageProperties(imgData)
    const pdfWidth = pdf.internal.pageSize.getWidth()
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width
    
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight)
    pdf.save(`${formData.name || 'Biodata'}_Marriage_Resume.pdf`)
  }

  const printBiodata = () => {
    window.print()
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
      <div className="google-card overflow-hidden bg-white mb-8">
        <div className="px-6 py-5 border-b border-google-border flex items-center justify-between bg-white">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-pink-50 rounded-3xl">
              <Heart className="w-5 h-5 text-pink-600" />
            </div>
            <div>
              <h1 className="text-xl font-medium text-google-text">Marriage Biodata Generator</h1>
              <p className="text-google-gray text-xs">Create professional matrimony resumes for Indians</p>
            </div>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={downloadPDF}
              className="p-2 text-google-gray hover:bg-google-lightGray rounded-full transition-colors"
              title="Download PDF"
            >
              <Download className="w-5 h-5" />
            </button>
            <button
              onClick={printBiodata}
              className="p-2 text-google-gray hover:bg-google-lightGray rounded-full transition-colors"
              title="Print Biodata"
            >
              <Printer className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-google-border">
          {/* Left Column: Form Input */}
          <div className="p-6 overflow-y-auto max-h-[800px] scrollbar-hide">
            <div className="space-y-8">
              {/* Personal Section */}
              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <User className="w-4 h-4 text-google-blue" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-google-gray">Personal Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="col-span-full">
                    <label className="block text-xs font-medium text-google-gray mb-1">Full Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} className="google-input" placeholder="e.g. Rahul Sharma" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Date of Birth</label>
                    <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} className="google-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Time of Birth</label>
                    <input type="time" name="tob" value={formData.tob} onChange={handleInputChange} className="google-input" />
                  </div>
                  <div className="col-span-full">
                    <label className="block text-xs font-medium text-google-gray mb-1">Place of Birth</label>
                    <input type="text" name="pob" value={formData.pob} onChange={handleInputChange} className="google-input" placeholder="e.g. Mumbai, Maharashtra" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Height</label>
                    <input type="text" name="height" value={formData.height} onChange={handleInputChange} className="google-input" placeholder="e.g. 5'10&quot;" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Weight</label>
                    <input type="text" name="weight" value={formData.weight} onChange={handleInputChange} className="google-input" placeholder="e.g. 70 kg" />
                  </div>
                </div>
              </section>

              {/* Education Section */}
              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <GraduationCap className="w-4 h-4 text-google-blue" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-google-gray">Education & Career</h3>
                </div>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="col-span-full">
                      <label className="block text-xs font-medium text-google-gray mb-1">Highest Education</label>
                      <input type="text" name="education" value={formData.education} onChange={handleInputChange} className="google-input" placeholder="e.g. MBA in Finance" />
                    </div>
                    <div className="col-span-full">
                      <label className="block text-xs font-medium text-google-gray mb-1">College/University</label>
                      <input type="text" name="college" value={formData.college} onChange={handleInputChange} className="google-input" placeholder="e.g. IIT Bombay" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-google-gray mb-1">Profession</label>
                      <input type="text" name="profession" value={formData.profession} onChange={handleInputChange} className="google-input" placeholder="e.g. Software Engineer" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-google-gray mb-1">Current Company</label>
                      <input type="text" name="company" value={formData.company} onChange={handleInputChange} className="google-input" placeholder="e.g. Google India" />
                    </div>
                    <div className="col-span-full">
                      <label className="block text-xs font-medium text-google-gray mb-1">Annual Income</label>
                      <input type="text" name="income" value={formData.income} onChange={handleInputChange} className="google-input" placeholder="e.g. 15-20 LPA" />
                    </div>
                  </div>
                </div>
              </section>

              {/* Family Section */}
              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <Users className="w-4 h-4 text-google-blue" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-google-gray">Family Background</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Father's Name</label>
                    <input type="text" name="fatherName" value={formData.fatherName} onChange={handleInputChange} className="google-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Father's Profession</label>
                    <input type="text" name="fatherProfession" value={formData.fatherProfession} onChange={handleInputChange} className="google-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Mother's Name</label>
                    <input type="text" name="motherName" value={formData.motherName} onChange={handleInputChange} className="google-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Mother's Profession</label>
                    <input type="text" name="motherProfession" value={formData.motherProfession} onChange={handleInputChange} className="google-input" />
                  </div>
                  <div className="col-span-full">
                    <label className="block text-xs font-medium text-google-gray mb-1">Siblings Details</label>
                    <input type="text" name="siblings" value={formData.siblings} onChange={handleInputChange} className="google-input" placeholder="e.g. 1 Elder Brother (Married)" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Family Type</label>
                    <select name="familyType" value={formData.familyType} onChange={handleInputChange} className="google-input">
                      <option value="Nuclear">Nuclear</option>
                      <option value="Joint">Joint</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Family Values</label>
                    <select name="familyValues" value={formData.familyValues} onChange={handleInputChange} className="google-input">
                      <option value="Moderate">Moderate</option>
                      <option value="Traditional">Traditional</option>
                      <option value="Liberal">Liberal</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Astro Section */}
              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <Star className="w-4 h-4 text-google-blue" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-google-gray">Social & Astro Details</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Caste</label>
                    <input type="text" name="caste" value={formData.caste} onChange={handleInputChange} className="google-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Gotra</label>
                    <input type="text" name="gotra" value={formData.gotra} onChange={handleInputChange} className="google-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Raashi</label>
                    <input type="text" name="raashi" value={formData.raashi} onChange={handleInputChange} className="google-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Manglik Status</label>
                    <select name="manglik" value={formData.manglik} onChange={handleInputChange} className="google-input">
                      <option value="No">No</option>
                      <option value="Yes">Yes</option>
                      <option value="Anshik">Anshik (Partial)</option>
                      <option value="Don't Know">Don't Know</option>
                    </select>
                  </div>
                </div>
              </section>

              {/* Contact Section */}
              <section>
                <div className="flex items-center space-x-2 mb-4">
                  <Phone className="w-4 h-4 text-google-blue" />
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-google-gray">Contact Information</h3>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Contact Number</label>
                    <input type="text" name="contactPhone" value={formData.contactPhone} onChange={handleInputChange} className="google-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Email Address</label>
                    <input type="email" name="contactEmail" value={formData.contactEmail} onChange={handleInputChange} className="google-input" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-google-gray mb-1">Residential Address</label>
                    <textarea name="contactAddress" value={formData.contactAddress} onChange={handleInputChange} className="google-input h-20 resize-none" />
                  </div>
                </div>
              </section>
            </div>
          </div>

          {/* Right Column: Preview */}
          <div className="bg-google-bg p-6 lg:p-10 flex flex-col items-center overflow-y-auto max-h-[800px]">
            <div className="sticky top-0 mb-4 w-full text-center">
              <span className="text-xs font-medium text-google-gray uppercase tracking-widest">Live Preview</span>
            </div>
            
            {/* Biodata Canvas */}
            <div 
              ref={biodataRef}
              className="w-full max-w-[500px] bg-white shadow-2xl rounded-sm border-[12px] border-double border-pink-100 p-8 sm:p-12 min-h-[700px]"
              style={{ fontFamily: "'Times New Roman', serif" }}
            >
              {/* Decorative Header */}
              <div className="text-center mb-8 border-b-2 border-pink-200 pb-6">
                <div className="flex justify-center mb-2">
                  <Heart className="w-6 h-6 text-pink-600 fill-pink-600" />
                </div>
                <h2 className="text-3xl font-bold text-pink-900 mb-1 uppercase tracking-widest">Biodata</h2>
                <div className="flex justify-center items-center space-x-2">
                  <div className="h-px w-8 bg-pink-300"></div>
                  <span className="text-pink-400 text-xs italic">For Marriage Purpose</span>
                  <div className="h-px w-8 bg-pink-300"></div>
                </div>
              </div>

              {/* Biodata Sections */}
              <div className="space-y-8 text-gray-800">
                {/* Personal Info */}
                <div>
                  <h4 className="text-pink-800 font-bold border-b border-pink-100 mb-3 uppercase text-sm tracking-widest">Personal Details</h4>
                  <table className="w-full border-collapse">
                    <tbody className="divide-y divide-pink-50/30">
                      {[
                        ['Full Name', formData.name],
                        ['Date of Birth', formData.dob],
                        ['Time of Birth', formData.tob],
                        ['Place of Birth', formData.pob],
                        ['Height', formData.height],
                        ['Weight', formData.weight]
                      ].map(([label, value]) => (
                        <tr key={label as string}>
                          <td className="py-1.5 font-bold w-1/3 text-sm">{label}:</td>
                          <td className="py-1.5 text-sm">{value || '---'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Education & Career */}
                <div>
                  <h4 className="text-pink-800 font-bold border-b border-pink-100 mb-3 uppercase text-sm tracking-widest">Education & Career</h4>
                  <table className="w-full">
                    <tbody className="divide-y divide-pink-50/30">
                      {[
                        ['Education', formData.education],
                        ['College', formData.college],
                        ['Profession', formData.profession],
                        ['Company', formData.company],
                        ['Income', formData.income]
                      ].map(([label, value]) => (
                        <tr key={label as string}>
                          <td className="py-1.5 font-bold w-1/3 text-sm">{label}:</td>
                          <td className="py-1.5 text-sm">{value || '---'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Family Info */}
                <div>
                  <h4 className="text-pink-800 font-bold border-b border-pink-100 mb-3 uppercase text-sm tracking-widest">Family Background</h4>
                  <table className="w-full">
                    <tbody className="divide-y divide-pink-50/30">
                      {[
                        ['Father', `${formData.fatherName} (${formData.fatherProfession || 'N/A'})`],
                        ['Mother', `${formData.motherName} (${formData.motherProfession || 'N/A'})`],
                        ['Siblings', formData.siblings],
                        ['Family Type', formData.familyType],
                        ['Values', formData.familyValues]
                      ].map(([label, value]) => (
                        <tr key={label as string}>
                          <td className="py-1.5 font-bold w-1/3 text-sm">{label}:</td>
                          <td className="py-1.5 text-sm">{value || '---'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Astro Info */}
                <div>
                  <h4 className="text-pink-800 font-bold border-b border-pink-100 mb-3 uppercase text-sm tracking-widest">Horoscope Details</h4>
                  <table className="w-full">
                    <tbody className="divide-y divide-pink-50/30">
                      {[
                        ['Caste', formData.caste],
                        ['Gotra', formData.gotra],
                        ['Raashi', formData.raashi],
                        ['Manglik', formData.manglik]
                      ].map(([label, value]) => (
                        <tr key={label as string}>
                          <td className="py-1.5 font-bold w-1/3 text-sm">{label}:</td>
                          <td className="py-1.5 text-sm">{value || '---'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Contact Info */}
                <div className="pt-4 border-t-2 border-pink-200 mt-10">
                  <div className="text-center">
                    <h4 className="text-pink-900 font-bold uppercase text-xs tracking-widest mb-4">Contact Details</h4>
                    <div className="space-y-1 text-sm italic text-gray-700">
                      <p>{formData.contactAddress || 'Residential Address'}</p>
                      <p>Phone: {formData.contactPhone || 'Phone Number'}</p>
                      <p>Email: {formData.contactEmail || 'Email Address'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center text-google-gray text-xs max-w-sm">
              <p>Tips: Fill all fields carefully. You can download the result as a PDF or print it directly.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="google-card p-8 bg-white">
        <h2 className="text-2xl font-bold text-google-text mb-4">About Marriage Biodata</h2>
        <div className="prose prose-gray max-w-none text-google-gray">
          <p className="mb-4">
            A Marriage Biodata is a crucial document in the Indian matrimonial process. It serves as a comprehensive profile 
            that helps families understand the personal, educational, and family background of a potential match. 
            Our generator helps you create an elegant, professional-looking biodata that adheres to traditional Indian 
            matrimony standards while maintaining a clean, modern aesthetic.
          </p>
          
          <h3 className="text-lg font-semibold text-google-text mt-6 mb-3">Key Features:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>Professional Layout:</strong> Designed with elegant typography and traditional accents.</li>
            <li><strong>Astro Details:</strong> Includes sections for Raashi, Gotra, and Manglik status.</li>
            <li><strong>Family Focus:</strong> Detailed sections for parents and siblings, essential for Indian families.</li>
            <li><strong>Instant Export:</strong> Download as a high-quality PDF or print directly from your browser.</li>
            <li><strong>Mobile Friendly:</strong> Create your biodata on the go with our responsive design.</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
