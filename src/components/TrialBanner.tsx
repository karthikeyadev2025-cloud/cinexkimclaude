import { useNavigate } from 'react-router-dom'
import { Sparkles, X, Crown } from 'lucide-react'
import { useSubscriptionStore } from '../stores/subscriptionStore'
import { useState } from 'react'

export default function TrialBanner() {
  const navigate = useNavigate()
  const sub = useSubscriptionStore()
  const [dismissed, setDismissed] = useState(false)

  const isTrial = sub.isTrial()
  const trialDaysLeft = sub.plan.trialDaysLeft
  const isPro = sub.isPro()

  // Don't show for active Pro users or if dismissed
  if (!isTrial && isPro) return null
  if (dismissed) return null

  const creditsRemaining = sub.getCreditsRemaining()
  const creditsLimit = sub.plan.aiCreditsLimit
  const creditPercent = Math.round((creditsRemaining / creditsLimit) * 100)

  return (
    <div className={`relative overflow-hidden rounded-xl border mb-6 ${
      isTrial
        ? 'border-[#D4A853]/30 bg-gradient-to-r from-[rgba(212,168,83,0.08)] to-transparent'
        : 'border-[#E74C3C]/30 bg-gradient-to-r from-[rgba(231,76,60,0.08)] to-transparent'
    }`}>
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {isTrial ? (
            <div className="w-8 h-8 rounded-lg bg-[#D4A853]/10 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-[#D4A853]" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-[#E74C3C]/10 flex items-center justify-center flex-shrink-0">
              <Crown className="w-4 h-4 text-[#E74C3C]" />
            </div>
          )}
          <div className="flex items-center gap-4 flex-wrap">
            <div>
              <p className={`text-xs font-medium ${isTrial ? 'text-[#D4A853]' : 'text-[#E74C3C]'}`}>
                {isTrial
                  ? `Pro Trial — ${trialDaysLeft} day${trialDaysLeft !== 1 ? 's' : ''} left`
                  : 'Free Plan — AI features limited'}
              </p>
              <p className="text-[11px] text-[#888888]">
                {isTrial
                  ? 'Enjoy all Pro features. Upgrade anytime to keep access.'
                  : 'Upgrade to Pro for unlimited AI generations and all features.'}
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2">
              <div className="w-24 h-1.5 bg-[#181818] rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${creditPercent > 30 ? 'bg-[#27AE60]' : creditPercent > 10 ? 'bg-[#E67E22]' : 'bg-[#E74C3C]'}`}
                  style={{ width: `${creditPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-[#888888]">{creditsRemaining} credits</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/pricing')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#D4A853] text-[#060606] text-xs font-semibold hover:bg-[#E8BF6A] transition-all flex-shrink-0"
          >
            <Crown className="w-3 h-3" /> Upgrade
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="p-1 rounded hover:bg-[#242424] text-[#6B6B6B] transition-colors flex-shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  )
}
