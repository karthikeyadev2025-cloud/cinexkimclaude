import { Link } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

export default function Terms() {
  return (
    <div className="min-h-[100dvh] bg-[#060606] text-[#F0F0F0]">
      <div className="max-w-3xl mx-auto p-6 md:p-12">
        <Link to="/" className="inline-flex items-center gap-1 text-[11px] text-[#D4A853] hover:underline mb-8">
          <ArrowLeft className="w-3 h-3" /> Back to Home
        </Link>
        <h1 className="text-3xl font-semibold font-cinzel mb-6">Terms of Service</h1>
        <div className="space-y-6 text-sm text-[#888] leading-relaxed">
          <p>Welcome to Cinex Universe. By using our platform, you agree to these terms.</p>
          <h2 className="text-lg text-[#F0F0F0] font-medium">1. Acceptance of Terms</h2>
          <p>By accessing or using Cinex Universe, you agree to be bound by these Terms of Service.</p>
          <h2 className="text-lg text-[#F0F0F0] font-medium">2. User Accounts</h2>
          <p>You are responsible for maintaining the confidentiality of your account credentials.</p>
          <h2 className="text-lg text-[#F0F0F0] font-medium">3. Content</h2>
          <p>You retain ownership of any content you create using our tools.</p>
          <h2 className="text-lg text-[#F0F0F0] font-medium">4. Subscriptions</h2>
          <p>Subscription fees are billed in advance. You can cancel anytime.</p>
        </div>
      </div>
    </div>
  )
}
