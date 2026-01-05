'use client'
import React, { useState } from 'react'
import { Mail, Phone, MapPin, Clock, Send, MessageSquare, CheckCircle, Loader2 } from 'lucide-react'

const ContactPage = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    })
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [isSubmitted, setIsSubmitted] = useState(false)

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsSubmitting(true)

        // Simulate form submission
        await new Promise(resolve => setTimeout(resolve, 1500))

        setIsSubmitting(false)
        setIsSubmitted(true)
        setFormData({ name: '', email: '', subject: '', message: '' })

        // Reset success message after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000)
    }

    const contactInfo = [
        {
            icon: <Mail className="w-6 h-6" />,
            title: "Email Us",
            details: "tareq.sujat@g.bracu.ac.bd",
            subtext: "We'll respond within 24 hours"
        },
        {
            icon: <Phone className="w-6 h-6" />,
            title: "Call Us",
            details: "+880 01998576655",
            subtext: "Mon-Fri, 9am-6pm BST"
        },
        {
            icon: <MapPin className="w-6 h-6" />,
            title: "Visit Us",
            details: "Old Dhaka, Bangladesh",
            subtext: "Our flagship store"
        },
        {
            icon: <Clock className="w-6 h-6" />,
            title: "Working Hours",
            details: "Sat-Thu: 10am - 8pm",
            subtext: "Friday: Closed"
        }
    ]

    const faqs = [
        {
            question: "What are your shipping options?",
            answer: "We offer standard shipping (5-7 days) and express shipping (2-3 days) across Bangladesh. International shipping is also available."
        },
        {
            question: "What is your return policy?",
            answer: "We accept returns within 7 days of delivery for unused items in original packaging. Contact us to initiate a return."
        },
        {
            question: "How can I track my order?",
            answer: "Once your order ships, you'll receive a tracking number via email. You can also track orders in your account dashboard."
        },
        {
            question: "Do you offer wholesale pricing?",
            answer: "Yes! Contact us directly for wholesale inquiries and we'll provide you with our B2B pricing structure."
        }
    ]

    return (
        <div className="min-h-screen">

            {/* Hero Section */}
            <div className="relative overflow-hidden bg-gradient-to-br from-violet-50 via-blue-50 to-cyan-50 py-16">
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
                    <div className="inline-flex items-center gap-2 bg-white/70 border border-violet-200 text-violet-700 px-4 py-2 rounded-full text-sm mb-6">
                        <MessageSquare size={16} />
                        <span>We&apos;d love to hear from you</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-violet-600 via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-4">
                        Get In Touch
                    </h1>
                    <p className="text-slate-600 max-w-2xl mx-auto text-lg">
                        Have questions about our products or need assistance? Our team is here to help you with anything you need.
                    </p>
                </div>
            </div>

            {/* Contact Info Cards */}
            <div className="max-w-7xl mx-auto px-6 -mt-8 relative z-20">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {contactInfo.map((info, index) => (
                        <div
                            key={index}
                            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300 group"
                        >
                            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-blue-500 rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                {info.icon}
                            </div>
                            <h3 className="font-semibold text-slate-800 mb-1">{info.title}</h3>
                            <p className="text-violet-600 font-medium">{info.details}</p>
                            <p className="text-sm text-slate-500 mt-1">{info.subtext}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-6 py-16">
                <div className="grid lg:grid-cols-2 gap-12">

                    {/* Contact Form */}
                    <div className="bg-white rounded-3xl p-8 shadow-xl border border-slate-100">
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Send us a Message</h2>
                        <p className="text-slate-500 mb-8">Fill out the form below and we&apos;ll get back to you as soon as possible.</p>

                        {isSubmitted ? (
                            <div className="flex flex-col items-center justify-center py-12 text-center">
                                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                    <CheckCircle className="w-8 h-8 text-green-500" />
                                </div>
                                <h3 className="text-xl font-semibold text-slate-800 mb-2">Message Sent!</h3>
                                <p className="text-slate-500">Thank you for contacting us. We&apos;ll respond within 24 hours.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5">
                                <div className="grid sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            required
                                            placeholder="John Doe"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="john@example.com"
                                            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Subject</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all bg-white"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="general">General Inquiry</option>
                                        <option value="order">Order Support</option>
                                        <option value="product">Product Question</option>
                                        <option value="return">Returns & Refunds</option>
                                        <option value="wholesale">Wholesale Inquiry</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        required
                                        rows={5}
                                        placeholder="Tell us how we can help you..."
                                        className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-400 focus:ring-2 focus:ring-violet-100 outline-none transition-all resize-none"
                                    ></textarea>
                                </div>

                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-violet-600 to-blue-500 hover:from-violet-500 hover:to-blue-400 text-white font-semibold py-4 rounded-xl flex items-center justify-center gap-2 transition-all hover:shadow-lg hover:shadow-violet-200 disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                            Sending...
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-5 h-5" />
                                            Send Message
                                        </>
                                    )}
                                </button>
                            </form>
                        )}
                    </div>

                    {/* FAQ Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-2">Frequently Asked Questions</h2>
                        <p className="text-slate-500 mb-8">Find quick answers to common questions below.</p>

                        <div className="space-y-4">
                            {faqs.map((faq, index) => (
                                <div
                                    key={index}
                                    className="bg-gradient-to-br from-slate-50 to-violet-50/30 rounded-2xl p-6 border border-slate-100 hover:border-violet-200 transition-all"
                                >
                                    <h3 className="font-semibold text-slate-800 mb-2 flex items-start gap-3">
                                        <span className="w-6 h-6 bg-violet-100 text-violet-600 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-bold">
                                            {index + 1}
                                        </span>
                                        {faq.question}
                                    </h3>
                                    <p className="text-slate-600 ml-9">{faq.answer}</p>
                                </div>
                            ))}
                        </div>

                        {/* Social Links */}
                        <div className="mt-10 p-6 bg-gradient-to-br from-violet-100 to-blue-100 rounded-2xl border border-violet-200">
                            <h3 className="font-semibold text-slate-800 mb-4">Connect With Us</h3>
                            <p className="text-slate-600 text-sm mb-4">Follow us on social media for updates, new arrivals, and exclusive offers.</p>
                            <div className="flex gap-3">
                                <a href="#" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-violet-600 hover:bg-violet-600 hover:text-white transition-all shadow-sm">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                                </a>
                                <a href="#" className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-cyan-600 hover:bg-cyan-600 hover:text-white transition-all shadow-sm">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Map Section */}
            <div className="max-w-7xl mx-auto px-6 pb-16">
                <div className="bg-gradient-to-br from-slate-100 to-violet-50 rounded-3xl p-2 border border-slate-200">
                    <div className="bg-slate-200 rounded-2xl h-80 flex items-center justify-center overflow-hidden">
                        {/*
                          To change location:
                          1. Go to Google Maps (google.com/maps)
                          2. Search your location
                          3. Click Share → Embed a map
                          4. Copy ONLY the src URL from the iframe code
                          5. Replace the src URL below
                        */}
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d228.29894490019424!2d90.3841504835717!3d23.71943783537106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3755b8d7610b0f25%3A0x8d0bdb3a084a4c16!2sP99M%2BPMR%2C%20Jagannath%20Shaha%20Rd%2C%20Dhaka!5e0!3m2!1sen!2sbd!4v1767622029888!5m2!1sen!2sbd"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="rounded-2xl"
                        ></iframe>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-600 py-16">
                <div className="max-w-4xl mx-auto px-6 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Need Immediate Assistance?</h2>
                    <p className="text-white/80 mb-8">Our customer support team is available to help you with urgent matters.</p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <a
                            href="tel:+8801234567890"
                            className="inline-flex items-center justify-center gap-2 bg-white text-violet-600 font-semibold px-8 py-4 rounded-xl hover:bg-violet-50 transition-all"
                        >
                            <Phone size={20} />
                            Call Now
                        </a>
                        <a
                            href="mailto:support@tareqsdrip.com"
                            className="inline-flex items-center justify-center gap-2 bg-white/10 text-white font-semibold px-8 py-4 rounded-xl border border-white/30 hover:bg-white/20 transition-all"
                        >
                            <Mail size={20} />
                            Email Support
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ContactPage

