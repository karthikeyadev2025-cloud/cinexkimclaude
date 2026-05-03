import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Implement password reset flow
    setSent(true)
  }

  return (
    <div className="min-h-[100dvh] bg-[#060606] flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="mb-8">
          <Link to="/login" className="inline-flex items-center gap-1 text-[11px] text-[#D4A853] hover:underline mb-4">
            <ArrowLeft className="w-3 h-3" /> Back to Sign In
          </Link>
          <h1 className="text-2xl font-semibold text-[#F0F0F0] font-cinzel">Reset Password</h1>
          <p className="text-sm text-[#888] mt-1">Enter your email and we'll send you a reset link.</p>
        </div>

        {sent ? (
          <div className="p-4 rounded-xl bg-[#27AE60]/10 border border-[#27AE60]/20 text-center">
            <Mail className="w-6 h-6 text-[#27AE60] mx-auto mb-2" />
            <p className="text-sm text-[#27AE60] font-medium">Reset link sent!</p>
            <p className="text-[11px] text-[#888] mt-1">Check your inbox for instructions.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#131313] border border-[#242424] rounded-xl px-4 py-3 text-sm text-white placeholder-[#444] focus:outline-none focus:border-[#D4A853]"
              required
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#D4A853] text-[#060606] text-sm font-semibold hover:bg-[#E8BF6A] transition-all"
            >
              Send Reset Link
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
