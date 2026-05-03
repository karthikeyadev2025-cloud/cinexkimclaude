/* ─────────────────────────────────────────────
   Onboarding.tsx — Multi-Step Onboarding Wizard
   Cinex Universe — First Login User Flow
   ───────────────────────────────────────────── */

import { useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useOnboardingStore } from '../stores/onboardingStore'
import { useRoleStore } from '../stores/roleStore'
import {
  User, Phone, MapPin, PenTool, Clapperboard, Banknote,
  Camera, Scissors, Drama, Sprout, ArrowRight, ArrowLeft,
  Check, Film, MonitorPlay, BookOpen, Megaphone, Music,
  Sparkles, Globe, CheckCircle2
} from 'lucide-react'

/* ─── Step Configuration ─── */
const TOTAL_STEPS = 4

const ROLE_OPTIONS = [
  { id: 'screenwriter', label: 'Screenwriter', emoji: '✍️', icon: PenTool },
  { id: 'director', label: 'Director', emoji: '🎬', icon: Clapperboard },
  { id: 'producer', label: 'Producer', emoji: '💰', icon: Banknote },
  { id: 'cinematographer', label: 'Cinematographer', emoji: '📷', icon: Camera },
  { id: 'editor', label: 'Editor', emoji: '✂️', icon: Scissors },
  { id: 'actor', label: 'Actor', emoji: '🎭', icon: Drama },
  { id: 'fresher', label: 'Fresher', emoji: '🌱', icon: Sprout },
]

const EXPERIENCE_OPTIONS = [
  { id: 'fresher', label: 'Fresher', desc: 'Just starting out' },
  { id: '1-3-years', label: '1–3 Years', desc: 'Some projects under my belt' },
  { id: '3-5-years', label: '3–5 Years', desc: 'Experienced professional' },
  { id: '5-plus-years', label: '5+ Years', desc: 'Industry veteran' },
]

const PROJECT_TYPE_OPTIONS = [
  { id: 'feature-film', label: 'Feature Film', icon: Film },
  { id: 'short-film', label: 'Short Film', icon: Camera },
  { id: 'web-series', label: 'Web Series', icon: MonitorPlay },
  { id: 'documentary', label: 'Documentary', icon: BookOpen },
  { id: 'commercial', label: 'Commercial', icon: Megaphone },
  { id: 'music-video', label: 'Music Video', icon: Music },
]

const LANGUAGE_OPTIONS = [
  'Hindi', 'Telugu', 'Tamil', 'Malayalam', 'Kannada',
  'English', 'Marathi', 'Bengali', 'Other',
]

/* ─── Progress Bar ─── */
function ProgressBar({ currentStep }: { currentStep: number }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-3">
        {Array.from({ length: TOTAL_STEPS }, (_, i) => (
          <div key={i} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold transition-all duration-500 ${
                  i + 1 < currentStep
                    ? 'bg-[#D4A853] text-[#060606]'
                    : i + 1 === currentStep
                    ? 'bg-[#D4A853] text-[#060606] ring-2 ring-[#D4A853]/30'
                    : 'bg-[#1a1a1a] text-[#6B6B6B] border border-[#242424]'
                }`}
              >
                {i + 1 < currentStep ? (
                  <Check className="w-4 h-4" />
                ) : (
                  i + 1
                )}
              </div>
              <span
                className={`text-[10px] mt-1.5 font-medium uppercase tracking-wider transition-colors duration-300 ${
                  i + 1 <= currentStep ? 'text-[#D4A853]' : 'text-[#444444]'
                }`}
              >
                {i === 0 && 'Profile'}
                {i === 1 && 'Background'}
                {i === 2 && 'Goals'}
                {i === 3 && 'Done'}
              </span>
            </div>
            {i < TOTAL_STEPS - 1 && (
              <div className="flex-1 h-px mx-3 bg-[#242424] relative overflow-hidden">
                <div
                  className="h-full bg-[#D4A853] transition-all duration-700 ease-out"
                  style={{ width: i + 1 < currentStep ? '100%' : '0%' }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── Step 1: Who Are You? ─── */
function StepProfile({
  data,
  onChange,
}: {
  data: { fullName: string; phone: string; location: string }
  onChange: (field: string, value: string) => void
}) {
  const currentUser = useRoleStore((s) => s.user)
  const prefillName = data.fullName || currentUser?.name || ''

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[rgba(212,168,83,0.1)] border border-[#D4A853]/20 flex items-center justify-center mx-auto mb-4">
          <User className="w-7 h-7 text-[#D4A853]" />
        </div>
        <h2 className="font-cinzel text-2xl font-bold text-white mb-2">
          Who Are You?
        </h2>
        <p className="font-inter text-sm text-[#6B6B6B]">
          Let&apos;s start with the basics so we know who you are.
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-xs text-[#6B6B6B] uppercase font-medium tracking-wider block mb-2">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
            <input
              type="text"
              value={prefillName}
              onChange={(e) => onChange('fullName', e.target.value)}
              placeholder="e.g. Rajesh Kumar"
              className="w-full bg-[#131313] border border-[#242424] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#444444] outline-none focus:border-[#D4A853] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-[#6B6B6B] uppercase font-medium tracking-wider block mb-2">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
            <input
              type="tel"
              value={data.phone}
              onChange={(e) => onChange('phone', e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full bg-[#131313] border border-[#242424] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#444444] outline-none focus:border-[#D4A853] transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="text-xs text-[#6B6B6B] uppercase font-medium tracking-wider block mb-2">
            City / Location
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#444444]" />
            <input
              type="text"
              value={data.location}
              onChange={(e) => onChange('location', e.target.value)}
              placeholder="e.g. Mumbai, Hyderabad, Chennai"
              className="w-full bg-[#131313] border border-[#242424] rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder-[#444444] outline-none focus:border-[#D4A853] transition-colors"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── Step 2: Film Background ─── */
function StepBackground({
  data,
  onChange,
}: {
  data: { role: string; experience: string }
  onChange: (field: string, value: string) => void
}) {
  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[rgba(212,168,83,0.1)] border border-[#D4A853]/20 flex items-center justify-center mx-auto mb-4">
          <Clapperboard className="w-7 h-7 text-[#D4A853]" />
        </div>
        <h2 className="font-cinzel text-2xl font-bold text-white mb-2">
          Your Film Background
        </h2>
        <p className="font-inter text-sm text-[#6B6B6B]">
          What role do you play in filmmaking?
        </p>
      </div>

      {/* Role Selection */}
      <div>
        <label className="text-xs text-[#6B6B6B] uppercase font-medium tracking-wider block mb-3">
          Primary Role
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {ROLE_OPTIONS.map((role) => {
            const Icon = role.icon
            const isSelected = data.role === role.id
            return (
              <button
                key={role.id}
                onClick={() => onChange('role', role.id)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-[#D4A853]/50 bg-[rgba(212,168,83,0.08)]'
                    : 'border-[#242424] bg-[#131313] hover:border-[#333333] hover:bg-[#1a1a1a]'
                }`}
              >
                <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected
                      ? 'bg-[#D4A853]/20'
                      : 'bg-[#1a1a1a]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected ? 'text-[#D4A853]' : 'text-[#6B6B6B]'
                    }`}
                  />
                </div>
                <div>
                  <p
                    className={`text-sm font-medium ${
                      isSelected ? 'text-white' : 'text-[#A3A3A3]'
                    }`}
                  >
                    {role.label}
                  </p>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-4 h-4 text-[#D4A853] ml-auto flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Experience Level */}
      <div className="pt-2">
        <label className="text-xs text-[#6B6B6B] uppercase font-medium tracking-wider block mb-3">
          Experience Level
        </label>
        <div className="space-y-2">
          {EXPERIENCE_OPTIONS.map((exp) => {
            const isSelected = data.experience === exp.id
            return (
              <button
                key={exp.id}
                onClick={() => onChange('experience', exp.id)}
                className={`w-full flex items-center gap-3 p-3.5 rounded-xl border text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-[#D4A853]/50 bg-[rgba(212,168,83,0.08)]'
                    : 'border-[#242424] bg-[#131313] hover:border-[#333333] hover:bg-[#1a1a1a]'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    isSelected
                      ? 'border-[#D4A853]'
                      : 'border-[#444444]'
                  }`}
                >
                  {isSelected && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#D4A853]" />
                  )}
                </div>
                <div className="flex-1">
                  <p
                    className={`text-sm font-medium ${
                      isSelected ? 'text-white' : 'text-[#A3A3A3]'
                    }`}
                  >
                    {exp.label}
                  </p>
                  <p className="text-xs text-[#6B6B6B]">{exp.desc}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ─── Step 3: Goals ─── */
function StepGoals({
  data,
  onChange,
}: {
  data: { projectTypes: string[]; languages: string[] }
  onChange: (field: string, value: string[]) => void
}) {
  const toggleProjectType = (id: string) => {
    const next = data.projectTypes.includes(id)
      ? data.projectTypes.filter((t) => t !== id)
      : [...data.projectTypes, id]
    onChange('projectTypes', next)
  }

  const toggleLanguage = (lang: string) => {
    const next = data.languages.includes(lang)
      ? data.languages.filter((l) => l !== lang)
      : [...data.languages, lang]
    onChange('languages', next)
  }

  return (
    <div className="space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="text-center mb-6">
        <div className="w-14 h-14 rounded-2xl bg-[rgba(212,168,83,0.1)] border border-[#D4A853]/20 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-7 h-7 text-[#D4A853]" />
        </div>
        <h2 className="font-cinzel text-2xl font-bold text-white mb-2">
          Your Goals
        </h2>
        <p className="font-inter text-sm text-[#6B6B6B]">
          What do you want to create?
        </p>
      </div>

      {/* Project Types */}
      <div>
        <label className="text-xs text-[#6B6B6B] uppercase font-medium tracking-wider block mb-3">
          Project Types
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          {PROJECT_TYPE_OPTIONS.map((pt) => {
            const Icon = pt.icon
            const isSelected = data.projectTypes.includes(pt.id)
            return (
              <button
                key={pt.id}
                onClick={() => toggleProjectType(pt.id)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all duration-300 ${
                  isSelected
                    ? 'border-[#D4A853]/50 bg-[rgba(212,168,83,0.08)]'
                    : 'border-[#242424] bg-[#131313] hover:border-[#333333] hover:bg-[#1a1a1a]'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    isSelected ? 'bg-[#D4A853]/20' : 'bg-[#1a1a1a]'
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isSelected ? 'text-[#D4A853]' : 'text-[#6B6B6B]'
                    }`}
                  />
                </div>
                <span
                  className={`text-sm font-medium ${
                    isSelected ? 'text-white' : 'text-[#A3A3A3]'
                  }`}
                >
                  {pt.label}
                </span>
                {isSelected && (
                  <Check className="w-3.5 h-3.5 text-[#D4A853] ml-auto flex-shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Languages */}
      <div className="pt-2">
        <label className="text-xs text-[#6B6B6B] uppercase font-medium tracking-wider block mb-3">
          Languages You Work In
        </label>
        <div className="flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => {
            const isSelected = data.languages.includes(lang)
            return (
              <button
                key={lang}
                onClick={() => toggleLanguage(lang)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-lg border text-sm transition-all duration-300 ${
                  isSelected
                    ? 'border-[#D4A853]/50 bg-[rgba(212,168,83,0.1)] text-[#D4A853]'
                    : 'border-[#242424] bg-[#131313] text-[#A3A3A3] hover:border-[#333333] hover:text-white'
                }`}
              >
                {isSelected && <Check className="w-3 h-3" />}
                {lang}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

/* ─── Step 4: Summary ─── */
function StepSummary({
  data,
  onComplete,
}: {
  data: {
    fullName: string
    phone: string
    location: string
    role: string
    experience: string
    projectTypes: string[]
    languages: string[]
  }
  onComplete: () => void
}) {
  const roleLabel =
    ROLE_OPTIONS.find((r) => r.id === data.role)?.label || data.role
  const expLabel =
    EXPERIENCE_OPTIONS.find((e) => e.id === data.experience)?.label ||
    data.experience
  const projectLabels = data.projectTypes
    .map((id) => PROJECT_TYPE_OPTIONS.find((p) => p.id === id)?.label || id)
    .join(', ')
  const languageList = data.languages.join(', ')

  return (
    <div className="space-y-5 animate-in fade-in zoom-in-95 duration-500">
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-[rgba(212,168,83,0.1)] border border-[#D4A853]/20 flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8 text-[#D4A853]" />
        </div>
        <h2 className="font-cinzel text-2xl font-bold text-white mb-2">
          You&apos;re All Set!
        </h2>
        <p className="font-inter text-sm text-[#6B6B6B]">
          Here&apos;s a summary of your profile.
        </p>
      </div>

      <div className="rounded-xl border border-[#242424] bg-[#131313] p-5 space-y-4">
        <SummaryRow icon={User} label="Name" value={data.fullName || '-'} />
        <SummaryRow icon={Phone} label="Phone" value={data.phone || '-'} />
        <SummaryRow
          icon={MapPin}
          label="Location"
          value={data.location || '-'}
        />
        <div className="h-px bg-[#242424]" />
        <SummaryRow
          icon={Clapperboard}
          label="Role"
          value={roleLabel || '-'}
        />
        <SummaryRow
          icon={Sparkles}
          label="Experience"
          value={expLabel || '-'}
        />
        <div className="h-px bg-[#242424]" />
        <SummaryRow
          icon={Film}
          label="Project Types"
          value={projectLabels || '-'}
        />
        <SummaryRow
          icon={Globe}
          label="Languages"
          value={languageList || '-'}
        />
      </div>

      <button
        onClick={onComplete}
        className="w-full flex items-center justify-center gap-2 bg-[#D4A853] text-[#060606] py-3.5 rounded-xl font-inter text-sm font-semibold hover:bg-[#E8BF6A] transition-all shadow-[0_0_24px_rgba(212,168,83,0.2)]"
      >
        Go to Dashboard <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  )
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 rounded-lg bg-[#1a1a1a] flex items-center justify-center flex-shrink-0">
        <Icon className="w-4 h-4 text-[#6B6B6B]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] text-[#6B6B6B] uppercase tracking-wider">
          {label}
        </p>
        <p className="text-sm text-white mt-0.5 truncate">{value}</p>
      </div>
    </div>
  )
}

/* ─── Main Onboarding Component ─── */
export default function Onboarding() {
  const navigate = useNavigate()
  const store = useOnboardingStore()
  const [step, setStep] = useState(1)

  const handleNext = useCallback(() => {
    if (step < TOTAL_STEPS) {
      setStep((s) => s + 1)
    }
  }, [step])

  const handleBack = useCallback(() => {
    if (step > 1) {
      setStep((s) => s - 1)
    }
  }, [step])

  const handleComplete = useCallback(() => {
    store.setCompleted()
    navigate('/dashboard')
  }, [store, navigate])

  /* Validation per step */
  const canProceed = () => {
    switch (step) {
      case 1:
        return !!store.fullName.trim()
      case 2:
        return !!store.role && !!store.experience
      case 3:
        return store.projectTypes.length > 0 && store.languages.length > 0
      case 4:
        return true
      default:
        return false
    }
  }

  return (
    <div className="min-h-[100dvh] bg-[#060606] flex flex-col items-center justify-center px-4 py-8">
      {/* Ambient glow */}
      <div
        className="fixed top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] opacity-20 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse at top center, rgba(212,168,83,0.15), transparent 70%)',
        }}
      />

      <div className="w-full max-w-lg relative z-10">
        {/* Logo / Brand */}
        <div className="text-center mb-8">
          <h1
            className="font-cinzel text-3xl font-bold tracking-wide mb-1"
            style={{
              background: 'linear-gradient(135deg, #D4A853, #E8BF6A)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Cinex Universe
          </h1>
          <p className="font-inter text-xs text-[#444444] uppercase tracking-[0.2em]">
            Complete your profile
          </p>
        </div>

        <ProgressBar currentStep={step} />

        {/* Card */}
        <div className="rounded-2xl border border-[#242424] bg-[#0D0D0D] p-6 lg:p-8 shadow-[0_8px_40px_rgba(0,0,0,0.6)]">
          {step === 1 && (
            <StepProfile
              data={{
                fullName: store.fullName,
                phone: store.phone,
                location: store.location,
              }}
              onChange={(field, value) =>
                store.setField(field as keyof OnboardingData, value)
              }
            />
          )}
          {step === 2 && (
            <StepBackground
              data={{ role: store.role, experience: store.experience }}
              onChange={(field, value) =>
                store.setField(field as keyof OnboardingData, value)
              }
            />
          )}
          {step === 3 && (
            <StepGoals
              data={{
                projectTypes: store.projectTypes,
                languages: store.languages,
              }}
              onChange={(field, value) =>
                store.setField(field as keyof OnboardingData, value)
              }
            />
          )}
          {step === 4 && (
            <StepSummary
              data={{
                fullName: store.fullName,
                phone: store.phone,
                location: store.location,
                role: store.role,
                experience: store.experience,
                projectTypes: store.projectTypes,
                languages: store.languages,
              }}
              onComplete={handleComplete}
            />
          )}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex items-center gap-3 mt-8 pt-6 border-t border-[#181818]">
              {step > 1 ? (
                <button
                  onClick={handleBack}
                  className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#242424] text-[#A3A3A3] hover:text-white hover:border-[#333333] transition-all text-sm font-medium"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              ) : (
                <div className="flex-1" />
              )}
              <button
                onClick={handleNext}
                disabled={!canProceed()}
                className="flex-1 flex items-center justify-center gap-2 bg-[#D4A853] text-[#060606] py-3 rounded-xl font-inter text-sm font-semibold hover:bg-[#E8BF6A] transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_24px_rgba(212,168,83,0.15)]"
              >
                {step === TOTAL_STEPS - 1 ? 'Finish' : 'Next Step'}{' '}
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Skip link */}
        {step < 4 && (
          <div className="text-center mt-5">
            <button
              onClick={() => {
                store.setCompleted()
                navigate('/dashboard')
              }}
              className="text-xs text-[#444444] hover:text-[#6B6B6B] transition-colors font-inter"
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
