import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Privacy() {
  return (
    <div className="min-h-[100dvh] bg-[#060606] text-[#F0F0F0]">
      <div className="max-w-3xl mx-auto p-6 md:p-12">
        <Link to="/" className="inline-flex items-center gap-1 text-[11px] text-[#D4A853] hover:underline mb-8">
          <ArrowLeft className="w-3 h-3" /> Back to Home
        </Link>
        <h1 className="text-3xl font-semibold font-cinzel mb-6">Privacy Policy</h1>
        <div className="space-y-6 text-sm text-[#888] leading-relaxed">
          <p>Your privacy is important to us. This policy explains how we handle your data.</p>
          <h2 className="text-lg text-[#F0F0F0] font-medium">1. Information We Collect</h2>
          <p>We collect information you provide directly (name, email) and usage data.</p>
          <h2 className="text-lg text-[#F0F0F0] font-medium">2. How We Use Information</h2>
          <p>We use your data to provide and improve our services.</p>
          <h2 className="text-lg text-[#F0F0F0] font-medium">3. Data Security</h2>
          <p>We implement industry-standard security measures to protect your data.</p>
          <h2 className="text-lg text-[#F0F0F0] font-medium">4. Third Parties</h2>
          <p>We use Razorpay for payments and Google for authentication.</p>
        </div>
      </div>
    </div>
  )
}
