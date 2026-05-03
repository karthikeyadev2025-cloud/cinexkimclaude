import { useNavigate } from 'react-router-dom'
import { Lock, Crown, ArrowRight } from 'lucide-react'

interface FeatureLockProps {
  featureName: string
  description?: string
}

export default function FeatureLock({ featureName, description }: FeatureLockProps) {
  const navigate = useNavigate()

  return (
    <div className="rounded-xl border border-[#242424] bg-[#0D0D0D] p-6 text-center" style={{ boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}>
      <div className="w-12 h-12 rounded-xl bg-[#D4A853]/10 border border-[#D4A853]/20 flex items-center justify-center mx-auto mb-4">
        <Lock className="w-6 h-6 text-[#D4A853]" />
      </div>
      <h3 className="font-space-grotesk text-sm font-semibold text-white mb-1">
        {featureName} is a Pro Feature
      </h3>
      {description && (
        <p className="text-xs text-[#888888] mb-4 max-w-sm mx-auto">{description}</p>
      )}
      <button
        onClick={() => navigate('/pricing')}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#D4A853] text-[#060606] text-xs font-semibold hover:bg-[#E8BF6A] transition-all"
      >
        <Crown className="w-3.5 h-3.5" /> Upgrade to Pro <ArrowRight className="w-3 h-3" />
      </button>
    </div>
  )
}
