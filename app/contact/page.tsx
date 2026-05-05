import type { Metadata } from 'next'
import { Mail, MessageSquare, MapPin, Send, Calculator } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contact Us - Online Calculator.live',
  description: 'Get in touch with the Online Calculator.live team. We welcome your feedback, suggestions, and inquiries.',
  keywords: ['contact online calculator', 'support', 'feedback', 'calculator suggestions'],
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-google-bg py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-google-text mb-4">Contact Us</h1>
          <p className="text-xl text-google-gray max-w-2xl mx-auto">
            Have a question or a suggestion for a new calculator? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Info Cards */}
          <div className="space-y-6">
            <div className="bg-white p-8 rounded-3xl shadow-google border border-google-border">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                <Mail className="w-6 h-6 text-google-blue" />
              </div>
              <h3 className="text-xl font-bold text-google-text mb-2">Email Us</h3>
              <p className="text-google-gray mb-4">Our support team usually responds within 24 hours.</p>
              <a href="mailto:support@onlinecalculator.live" className="text-google-blue font-semibold hover:underline">
                support@onlinecalculator.live
              </a>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-google border border-google-border">
              <div className="w-12 h-12 bg-green-50 rounded-2xl flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-google-text mb-2">Suggestions</h3>
              <p className="text-google-gray mb-4">Want a specific calculator? Let us know your requirements.</p>
              <span className="text-google-text font-medium">Available 24/7</span>
            </div>

            <div className="bg-white p-8 rounded-3xl shadow-google border border-google-border">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-google-text mb-2">Location</h3>
              <p className="text-google-gray">
                Operating Globally<br />
                Managed by Octaleads Team
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-google p-8 lg:p-12 border border-google-border">
              <h2 className="text-2xl font-bold text-google-text mb-8">Send us a Message</h2>
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-google-gray px-1">Full Name</label>
                    <input
                      type="text"
                      id="name"
                      className="w-full px-4 py-3 bg-google-lightGray border border-google-border rounded-xl focus:ring-2 focus:ring-google-blue focus:outline-none transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-google-gray px-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      className="w-full px-4 py-3 bg-google-lightGray border border-google-border rounded-xl focus:ring-2 focus:ring-google-blue focus:outline-none transition-all"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-google-gray px-1">Subject</label>
                  <select
                    id="subject"
                    className="w-full px-4 py-3 bg-google-lightGray border border-google-border rounded-xl focus:ring-2 focus:ring-google-blue focus:outline-none transition-all"
                  >
                    <option>General Inquiry</option>
                    <option>Calculator Suggestion</option>
                    <option>Bug Report</option>
                    <option>Partnership</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-google-gray px-1">Message</label>
                  <textarea
                    id="message"
                    rows={6}
                    className="w-full px-4 py-3 bg-google-lightGray border border-google-border rounded-xl focus:ring-2 focus:ring-google-blue focus:outline-none transition-all resize-none"
                    placeholder="Tell us how we can help..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full md:w-auto px-8 py-4 bg-google-blue text-white font-bold rounded-full hover:bg-google-blueHover transition-all shadow-lg flex items-center justify-center space-x-2"
                >
                  <Send className="w-5 h-5" />
                  <span>Send Message</span>
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-google-text mb-12">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              {
                q: "Are the calculators really free?",
                a: "Yes, every single tool on Online Calculator.live is 100% free to use. We are supported by minimal advertisements to keep the platform running."
              },
              {
                q: "How can I suggest a new calculator?",
                a: "You can use the contact form above and select 'Calculator Suggestion' as the subject. Our team regularly reviews requests and adds the most requested tools."
              },
              {
                q: "Is my data safe when using these calculators?",
                a: "Absolutely. Most of our calculators process data locally in your browser and do not send your sensitive inputs to our servers. Read our Privacy Policy for more details."
              }
            ].map((faq, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-google-border shadow-sm">
                <h3 className="font-bold text-google-text mb-2">{faq.q}</h3>
                <p className="text-google-gray">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
