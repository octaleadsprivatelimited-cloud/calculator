'use client'

import React, { useState, useRef, useCallback } from 'react'
import {
  Upload, Plus, Trash2, Download, Eye, FileText, Building2, User,
  Calculator, RotateCcw, Image as ImageIcon, Palette, Layout, Settings,
  Save, Copy, Share2, Printer, Mail, Calendar, DollarSign, Check, Star
} from 'lucide-react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

interface LineItem {
  id: string
  description: string
  quantity: number
  rate: number
  amount: number
}

interface CompanyInfo {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
  website: string
}

interface ClientInfo {
  name: string
  address: string
  city: string
  state: string
  zipCode: string
  phone: string
  email: string
}

interface InvoiceTemplate {
  id: string
  name: string
  category: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
  }
}

interface InvoiceData {
  template: string
  invoiceNumber: string
  date: string
  dueDate: string
  currency: string
  company: CompanyInfo
  client: ClientInfo
  lineItems: LineItem[]
  subtotal: number
  taxRate: number
  taxAmount: number
  discountRate: number
  discountAmount: number
  total: number
  notes: string
  terms: string
  logo: string | null
  paymentTerms: string
}

// 30 Professional Invoice Templates
const invoiceTemplates: InvoiceTemplate[] = [
  // Modern Templates (6)
  { id: 'modern-1', name: 'Modern Blue', category: 'Modern', colors: { primary: '#3B82F6', secondary: '#1E40AF', accent: '#60A5FA', background: '#FFFFFF' }},
  { id: 'modern-2', name: 'Modern Green', category: 'Modern', colors: { primary: '#10B981', secondary: '#047857', accent: '#34D399', background: '#FFFFFF' }},
  { id: 'modern-3', name: 'Modern Purple', category: 'Modern', colors: { primary: '#8B5CF6', secondary: '#7C3AED', accent: '#A78BFA', background: '#FFFFFF' }},
  { id: 'modern-4', name: 'Modern Orange', category: 'Modern', colors: { primary: '#F59E0B', secondary: '#D97706', accent: '#FBBF24', background: '#FFFFFF' }},
  { id: 'modern-5', name: 'Modern Red', category: 'Modern', colors: { primary: '#EF4444', secondary: '#DC2626', accent: '#F87171', background: '#FFFFFF' }},
  { id: 'modern-6', name: 'Modern Teal', category: 'Modern', colors: { primary: '#14B8A6', secondary: '#0D9488', accent: '#5EEAD4', background: '#FFFFFF' }},

  // Classic Templates (6)
  { id: 'classic-1', name: 'Classic Black', category: 'Classic', colors: { primary: '#000000', secondary: '#374151', accent: '#6B7280', background: '#FFFFFF' }},
  { id: 'classic-2', name: 'Classic Navy', category: 'Classic', colors: { primary: '#1E3A8A', secondary: '#1E40AF', accent: '#3B82F6', background: '#FFFFFF' }},
  { id: 'classic-3', name: 'Classic Gray', category: 'Classic', colors: { primary: '#4B5563', secondary: '#374151', accent: '#9CA3AF', background: '#FFFFFF' }},
  { id: 'classic-4', name: 'Classic Brown', category: 'Classic', colors: { primary: '#92400E', secondary: '#78350F', accent: '#D97706', background: '#FFFFFF' }},
  { id: 'classic-5', name: 'Classic Maroon', category: 'Classic', colors: { primary: '#7F1D1D', secondary: '#991B1B', accent: '#DC2626', background: '#FFFFFF' }},
  { id: 'classic-6', name: 'Classic Forest', category: 'Classic', colors: { primary: '#14532D', secondary: '#166534', accent: '#22C55E', background: '#FFFFFF' }},

  // Minimal Templates (6)
  { id: 'minimal-1', name: 'Minimal White', category: 'Minimal', colors: { primary: '#000000', secondary: '#6B7280', accent: '#9CA3AF', background: '#FFFFFF' }},
  { id: 'minimal-2', name: 'Minimal Gray', category: 'Minimal', colors: { primary: '#374151', secondary: '#6B7280', accent: '#D1D5DB', background: '#F9FAFB' }},
  { id: 'minimal-3', name: 'Minimal Blue', category: 'Minimal', colors: { primary: '#3B82F6', secondary: '#6B7280', accent: '#DBEAFE', background: '#FFFFFF' }},
  { id: 'minimal-4', name: 'Minimal Green', category: 'Minimal', colors: { primary: '#10B981', secondary: '#6B7280', accent: '#D1FAE5', background: '#FFFFFF' }},
  { id: 'minimal-5', name: 'Minimal Purple', category: 'Minimal', colors: { primary: '#8B5CF6', secondary: '#6B7280', accent: '#EDE9FE', background: '#FFFFFF' }},
  { id: 'minimal-6', name: 'Minimal Rose', category: 'Minimal', colors: { primary: '#F43F5E', secondary: '#6B7280', accent: '#FCE7F3', background: '#FFFFFF' }},

  // Corporate Templates (6)
  { id: 'corporate-1', name: 'Corporate Blue', category: 'Corporate', colors: { primary: '#1E40AF', secondary: '#1E3A8A', accent: '#3B82F6', background: '#FFFFFF' }},
  { id: 'corporate-2', name: 'Corporate Dark', category: 'Corporate', colors: { primary: '#111827', secondary: '#374151', accent: '#6B7280', background: '#FFFFFF' }},
  { id: 'corporate-3', name: 'Corporate Green', category: 'Corporate', colors: { primary: '#047857', secondary: '#065F46', accent: '#10B981', background: '#FFFFFF' }},
  { id: 'corporate-4', name: 'Corporate Red', category: 'Corporate', colors: { primary: '#DC2626', secondary: '#B91C1C', accent: '#EF4444', background: '#FFFFFF' }},
  { id: 'corporate-5', name: 'Corporate Gold', category: 'Corporate', colors: { primary: '#D97706', secondary: '#B45309', accent: '#F59E0B', background: '#FFFFFF' }},
  { id: 'corporate-6', name: 'Corporate Silver', category: 'Corporate', colors: { primary: '#6B7280', secondary: '#4B5563', accent: '#9CA3AF', background: '#FFFFFF' }},

  // Creative Templates (6)
  { id: 'creative-1', name: 'Creative Gradient', category: 'Creative', colors: { primary: '#8B5CF6', secondary: '#3B82F6', accent: '#06B6D4', background: '#FFFFFF' }},
  { id: 'creative-2', name: 'Creative Sunset', category: 'Creative', colors: { primary: '#F59E0B', secondary: '#EF4444', accent: '#8B5CF6', background: '#FFFFFF' }},
  { id: 'creative-3', name: 'Creative Ocean', category: 'Creative', colors: { primary: '#06B6D4', secondary: '#0891B2', accent: '#0EA5E9', background: '#FFFFFF' }},
  { id: 'creative-4', name: 'Creative Forest', category: 'Creative', colors: { primary: '#059669', secondary: '#047857', accent: '#10B981', background: '#FFFFFF' }},
  { id: 'creative-5', name: 'Creative Fire', category: 'Creative', colors: { primary: '#DC2626', secondary: '#B91C1C', accent: '#F59E0B', background: '#FFFFFF' }},
  { id: 'creative-6', name: 'Creative Galaxy', category: 'Creative', colors: { primary: '#7C3AED', secondary: '#6D28D9', accent: '#8B5CF6', background: '#FFFFFF' }}
]

export default function InvoiceMaker() {
  const [activeTab, setActiveTab] = useState<'templates' | 'details' | 'preview'>('templates')
  const [selectedTemplate, setSelectedTemplate] = useState('modern-1')
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    template: 'modern-1',
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    date: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    currency: 'USD',
    company: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: '',
      website: ''
    },
    client: {
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: '',
      email: ''
    },
    lineItems: [
      { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    subtotal: 0,
    taxRate: 0,
    taxAmount: 0,
    discountRate: 0,
    discountAmount: 0,
    total: 0,
    notes: '',
    terms: 'Payment is due within 30 days of invoice date.',
    logo: null,
    paymentTerms: 'Net 30'
  })

  const invoiceRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currencies = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'CNY', symbol: '¥', name: 'Chinese Yuan' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
  ]

  const getCurrencySymbol = (code: string) => {
    return currencies.find(c => c.code === code)?.symbol || '$'
  }

  const calculateTotals = useCallback(() => {
    const subtotal = invoiceData.lineItems.reduce((sum, item) => sum + item.amount, 0)
    const discountAmount = (subtotal * invoiceData.discountRate) / 100
    const taxableAmount = subtotal - discountAmount
    const taxAmount = (taxableAmount * invoiceData.taxRate) / 100
    const total = taxableAmount + taxAmount

    setInvoiceData(prev => ({
      ...prev,
      subtotal,
      discountAmount,
      taxAmount,
      total
    }))
  }, [invoiceData.lineItems, invoiceData.taxRate, invoiceData.discountRate])

  const addLineItem = () => {
    const newItem: LineItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0
    }
    setInvoiceData(prev => ({
      ...prev,
      lineItems: [...prev.lineItems, newItem]
    }))
  }

  const removeLineItem = (id: string) => {
    setInvoiceData(prev => ({
      ...prev,
      lineItems: prev.lineItems.filter(item => item.id !== id)
    }))
  }

  const updateLineItem = (id: string, field: keyof LineItem, value: string | number) => {
    setInvoiceData(prev => ({
      ...prev,
      lineItems: prev.lineItems.map(item => {
        if (item.id === id) {
          const updatedItem = { ...item, [field]: value }
          if (field === 'quantity' || field === 'rate') {
            updatedItem.amount = updatedItem.quantity * updatedItem.rate
          }
          return updatedItem
        }
        return item
      })
    }))
  }

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setInvoiceData(prev => ({
          ...prev,
          logo: e.target?.result as string
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const downloadPDF = async () => {
    if (invoiceRef.current) {
      try {
        const canvas = await html2canvas(invoiceRef.current, {
          scale: 2,
          useCORS: true,
          allowTaint: true
        })

        const imgData = canvas.toDataURL('image/png')
        const pdf = new jsPDF()
        const imgWidth = 210
        const pageHeight = 295
        const imgHeight = (canvas.height * imgWidth) / canvas.width
        let heightLeft = imgHeight

        let position = 0

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight
          pdf.addPage()
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
          heightLeft -= pageHeight
        }

        pdf.save(`invoice-${invoiceData.invoiceNumber}.pdf`)
      } catch (error) {
        console.error('Error generating PDF:', error)
      }
    }
  }

  const currentTemplate = invoiceTemplates.find(t => t.id === selectedTemplate) || invoiceTemplates[0]

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-600 rounded-lg">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Invoice Maker</h1>
                <p className="text-sm text-gray-500">Create professional invoices in minutes</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button title="Save" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Save className="w-5 h-5" />
              </button>
              <button title="Share" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Share2 className="w-5 h-5" />
              </button>
              <button title="Settings" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            {[
              { id: 'templates', name: 'Templates', icon: Layout },
              { id: 'details', name: 'Invoice Details', icon: FileText },
              { id: 'preview', name: 'Preview', icon: Eye }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'templates' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Choose Your Template</h2>
              <p className="text-lg text-gray-600">Select from 30+ professional invoice templates</p>
            </div>

            {/* Template Categories */}
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {['All', 'Modern', 'Classic', 'Minimal', 'Corporate', 'Creative'].map((category) => (
                <button
                  key={category}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Template Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {invoiceTemplates.map((template) => (
                <div
                  key={template.id}
                  onClick={() => {
                    setSelectedTemplate(template.id)
                    setInvoiceData(prev => ({ ...prev, template: template.id }))
                  }}
                  className={`relative cursor-pointer group rounded-xl border-2 transition-all duration-200 ${
                    selectedTemplate === template.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="p-4">
                    {/* Template Preview */}
                    <div
                      className="w-full h-32 rounded-lg mb-3 relative overflow-hidden"
                      style={{ backgroundColor: template.colors.background }}
                    >
                      <div className="absolute inset-0 p-3">
                        <div className="h-full border rounded" style={{ borderColor: template.colors.primary }}>
                          <div className="p-2">
                            <div className="h-2 rounded mb-1" style={{ backgroundColor: template.colors.primary }}></div>
                            <div className="h-1 rounded mb-1" style={{ backgroundColor: template.colors.accent }}></div>
                            <div className="h-1 rounded mb-1" style={{ backgroundColor: template.colors.accent }}></div>
                            <div className="h-1 rounded" style={{ backgroundColor: template.colors.accent }}></div>
                          </div>
                        </div>
                      </div>
                      {selectedTemplate === template.id && (
                        <div className="absolute top-2 right-2">
                          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Template Info */}
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">{template.category}</p>
                    </div>

                    {/* Color Palette */}
                    <div className="flex space-x-1 mt-3">
                      <div
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: template.colors.primary }}
                      ></div>
                      <div
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: template.colors.secondary }}
                      ></div>
                      <div
                        className="w-4 h-4 rounded-full border border-gray-200"
                        style={{ backgroundColor: template.colors.accent }}
                      ></div>
                    </div>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-blue-500 bg-opacity-0 group-hover:bg-opacity-10 rounded-xl transition-all duration-200"></div>
                </div>
              ))}
            </div>

            {/* Continue Button */}
            <div className="text-center pt-8">
              <button
                onClick={() => setActiveTab('details')}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                <span>Continue to Details</span>
                <Star className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'details' && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Invoice Form */}
            <div className="xl:col-span-2 space-y-6">
              {/* Quick Actions */}
              <div className="bg-white rounded-xl shadow-sm border p-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">Invoice Details</h2>
                  <div className="flex items-center space-x-2">
                    <button title="Copy" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button title="Print" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Printer className="w-4 h-4" />
                    </button>
                    <button title="Email" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                      <Mail className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Invoice Header */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                  Invoice Information
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Invoice Number</label>
                    <input
                      type="text"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                    <input
                      type="date"
                      value={invoiceData.date}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, date: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                    <input
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
                    <select
                      value={invoiceData.currency}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, currency: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      {currencies.map(currency => (
                        <option key={currency.code} value={currency.code}>
                          {currency.symbol} {currency.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Company & Client Info */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Company Info */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <Building2 className="w-5 h-5 mr-2 text-blue-600" />
                    Your Company
                  </h3>

                  {/* Logo Upload */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Logo</label>
                    <div className="flex items-center space-x-4">
                      {invoiceData.logo ? (
                        <img src={invoiceData.logo} alt="Logo" className="w-16 h-16 object-contain rounded border" />
                      ) : (
                        <div className="w-16 h-16 border-2 border-dashed border-gray-300 rounded flex items-center justify-center">
                          <ImageIcon className="w-6 h-6 text-gray-400" />
                        </div>
                      )}
                      <button
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium"
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Logo
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleLogoUpload}
                        className="hidden"
                        title="Upload company logo"
                        aria-label="Upload company logo"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Company Name"
                      value={invoiceData.company.name}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, company: { ...prev.company, name: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={invoiceData.company.address}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, company: { ...prev.company, address: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="City"
                        value={invoiceData.company.city}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, company: { ...prev.company, city: e.target.value } }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={invoiceData.company.state}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, company: { ...prev.company, state: e.target.value } }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Phone"
                      value={invoiceData.company.phone}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, company: { ...prev.company, phone: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={invoiceData.company.email}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, company: { ...prev.company, email: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Client Info */}
                <div className="bg-white rounded-xl shadow-sm border p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                    <User className="w-5 h-5 mr-2 text-blue-600" />
                    Bill To
                  </h3>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Client Name"
                      value={invoiceData.client.name}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, client: { ...prev.client, name: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="text"
                      placeholder="Address"
                      value={invoiceData.client.address}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, client: { ...prev.client, address: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <div className="grid grid-cols-2 gap-3">
                      <input
                        type="text"
                        placeholder="City"
                        value={invoiceData.client.city}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, client: { ...prev.client, city: e.target.value } }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <input
                        type="text"
                        placeholder="State"
                        value={invoiceData.client.state}
                        onChange={(e) => setInvoiceData(prev => ({ ...prev, client: { ...prev.client, state: e.target.value } }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <input
                      type="text"
                      placeholder="Phone"
                      value={invoiceData.client.phone}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, client: { ...prev.client, phone: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <input
                      type="email"
                      placeholder="Email"
                      value={invoiceData.client.email}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, client: { ...prev.client, email: e.target.value } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Calculator className="w-5 h-5 mr-2 text-blue-600" />
                    Line Items
                  </h3>
                  <button
                    onClick={addLineItem}
                    className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 text-sm font-medium"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </button>
                </div>

                <div className="space-y-3">
                  {invoiceData.lineItems.map((item, index) => (
                    <div key={item.id} className="grid grid-cols-12 gap-3 items-center p-3 bg-gray-50 rounded-lg">
                      <div className="col-span-5">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateLineItem(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateLineItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) => updateLineItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="col-span-2">
                        <div className="px-3 py-2 bg-white border rounded-lg text-sm font-medium">
                          {getCurrencySymbol(invoiceData.currency)}{item.amount.toFixed(2)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        <button
                          onClick={() => removeLineItem(item.id)}
                          title="Remove item"
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2 text-blue-600" />
                  Calculations
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tax Rate (%)</label>
                    <input
                      type="number"
                      value={invoiceData.taxRate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Discount (%)</label>
                    <input
                      type="number"
                      value={invoiceData.discountRate}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, discountRate: parseFloat(e.target.value) || 0 }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <button
                  onClick={calculateTotals}
                  className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 font-medium"
                >
                  Calculate Totals
                </button>
              </div>

              {/* Notes */}
              <div className="bg-white rounded-xl shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notes & Terms</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                    <textarea
                      value={invoiceData.notes}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      rows={3}
                      placeholder="Additional notes..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Payment Terms</label>
                    <input
                      type="text"
                      value={invoiceData.paymentTerms}
                      onChange={(e) => setInvoiceData(prev => ({ ...prev, paymentTerms: e.target.value }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Net 30"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4">
                <button
                  onClick={() => setActiveTab('preview')}
                  className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 font-medium flex items-center justify-center"
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview Invoice
                </button>
                <button
                  onClick={downloadPDF}
                  className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 font-medium flex items-center justify-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Live Preview Sidebar */}
            <div className="xl:col-span-1">
              <div className="bg-white rounded-xl shadow-sm border p-6 sticky top-8">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Live Preview</h3>
                <div className="text-center text-gray-500 py-8">
                  <Eye className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>Click "Preview Invoice" to see your invoice</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'preview' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Invoice Preview</h2>
              <div className="flex space-x-3">
                <button
                  onClick={() => setActiveTab('details')}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
                >
                  Edit Details
                </button>
                <button
                  onClick={downloadPDF}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download PDF
                </button>
              </div>
            </div>

            {/* Invoice Preview */}
            <div className="bg-white rounded-xl shadow-lg border">
              <div
                ref={invoiceRef}
                className="p-8"
                style={{
                  backgroundColor: currentTemplate.colors.background,
                  color: currentTemplate.colors.primary
                }}
              >
                {/* Invoice Header */}
                <div className="flex justify-between items-start mb-8">
                  <div className="flex items-center space-x-4">
                    {invoiceData.logo && (
                      <img src={invoiceData.logo} alt="Logo" className="w-16 h-16 object-contain" />
                    )}
                    <div>
                      <h1
                        className="text-3xl font-bold"
                        style={{ color: currentTemplate.colors.primary }}
                      >
                        INVOICE
                      </h1>
                      <p className="text-gray-600">#{invoiceData.invoiceNumber}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">Date: {invoiceData.date}</p>
                    <p className="text-sm text-gray-600">Due: {invoiceData.dueDate}</p>
                  </div>
                </div>

                {/* Company & Client Info */}
                <div className="grid grid-cols-2 gap-8 mb-8">
                  <div>
                    <h3
                      className="font-semibold mb-2"
                      style={{ color: currentTemplate.colors.secondary }}
                    >
                      From:
                    </h3>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{invoiceData.company.name}</p>
                      <p>{invoiceData.company.address}</p>
                      <p>{invoiceData.company.city}, {invoiceData.company.state}</p>
                      <p>{invoiceData.company.phone}</p>
                      <p>{invoiceData.company.email}</p>
                    </div>
                  </div>
                  <div>
                    <h3
                      className="font-semibold mb-2"
                      style={{ color: currentTemplate.colors.secondary }}
                    >
                      Bill To:
                    </h3>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{invoiceData.client.name}</p>
                      <p>{invoiceData.client.address}</p>
                      <p>{invoiceData.client.city}, {invoiceData.client.state}</p>
                      <p>{invoiceData.client.phone}</p>
                      <p>{invoiceData.client.email}</p>
                    </div>
                  </div>
                </div>

                {/* Line Items */}
                <div className="mb-8">
                  <table className="w-full">
                    <thead>
                      <tr
                        className="border-b-2"
                        style={{ borderColor: currentTemplate.colors.primary }}
                      >
                        <th className="text-left py-2 font-semibold">Description</th>
                        <th className="text-center py-2 font-semibold">Qty</th>
                        <th className="text-center py-2 font-semibold">Rate</th>
                        <th className="text-right py-2 font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.lineItems.map((item) => (
                        <tr key={item.id} className="border-b border-gray-200">
                          <td className="py-3">{item.description}</td>
                          <td className="py-3 text-center">{item.quantity}</td>
                          <td className="py-3 text-center">{getCurrencySymbol(invoiceData.currency)}{item.rate.toFixed(2)}</td>
                          <td className="py-3 text-right">{getCurrencySymbol(invoiceData.currency)}{item.amount.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end mb-8">
                  <div className="w-64">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>{getCurrencySymbol(invoiceData.currency)}{invoiceData.subtotal.toFixed(2)}</span>
                      </div>
                      {invoiceData.discountRate > 0 && (
                        <div className="flex justify-between">
                          <span>Discount ({invoiceData.discountRate}%):</span>
                          <span>-{getCurrencySymbol(invoiceData.currency)}{invoiceData.discountAmount.toFixed(2)}</span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span>Tax ({invoiceData.taxRate}%):</span>
                        <span>{getCurrencySymbol(invoiceData.currency)}{invoiceData.taxAmount.toFixed(2)}</span>
                      </div>
                      <div
                        className="flex justify-between border-t-2 pt-2 font-bold text-lg"
                        style={{ borderColor: currentTemplate.colors.primary }}
                      >
                        <span>Total:</span>
                        <span>{getCurrencySymbol(invoiceData.currency)}{invoiceData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Notes & Terms */}
                {(invoiceData.notes || invoiceData.terms || invoiceData.paymentTerms) && (
                  <div className="border-t pt-6 space-y-4">
                    {invoiceData.notes && (
                      <div>
                        <h4 className="font-semibold mb-2">Notes:</h4>
                        <p className="text-sm text-gray-600">{invoiceData.notes}</p>
                      </div>
                    )}
                    {invoiceData.paymentTerms && (
                      <div>
                        <h4 className="font-semibold mb-2">Payment Terms:</h4>
                        <p className="text-sm text-gray-600">{invoiceData.paymentTerms}</p>
                      </div>
                    )}
                    {invoiceData.terms && (
                      <div>
                        <h4 className="font-semibold mb-2">Terms & Conditions:</h4>
                        <p className="text-sm text-gray-600">{invoiceData.terms}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
