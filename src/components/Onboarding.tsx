import { useState } from 'react'
import { equipmentCatalog } from '../data/equipment'
import { APP_SCHEMA_VERSION, type ExperienceLevel, type LocalAppData, type TrainingGoal } from '../domain/types'

type OnboardingProps = { onComplete: (data: LocalAppData) => void }
const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const goals: { id: TrainingGoal; title: string; text: string }[] = [
  { id: 'muscle_gain', title: 'Build muscle', text: 'Gain strength and muscle gradually.' },
  { id: 'strength', title: 'Build strength', text: 'Focus on feeling capable and steady.' },
  { id: 'general_fitness', title: 'Feel fitter', text: 'Build a simple, consistent routine.' },
  { id: 'mobility', title: 'Move better', text: 'Prioritize confidence and everyday movement.' },
]

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState<TrainingGoal>('muscle_gain')
  const [days, setDays] = useState<number[]>([1, 2, 4])
  const [duration, setDuration] = useState<30 | 45 | 60>(45)
  const [time, setTime] = useState('09:00')
  const [experience, setExperience] = useState<ExperienceLevel>('beginner')
  const [equipment, setEquipment] = useState<string[]>(['dumbbells', 'adjustable-bench'])
  const [medical, setMedical] = useState(false)
  const [emergency, setEmergency] = useState(false)
  const toggleDay = (day: number) => setDays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day].sort())
  const toggleEquipment = (id: string) => setEquipment((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id])
  const next = () => setStep((current) => Math.min(current + 1, 7))
  const previous = () => setStep((current) => Math.max(current - 1, 0))
  const finish = () => {
    const now = new Date().toISOString(); const profileId = crypto.randomUUID()
    onComplete({ schemaVersion: APP_SCHEMA_VERSION, profile: { id: profileId, displayName: name.trim() || 'Athlete', goal, experience, availableDays: days, preferredDurationMinutes: duration, preferredTrainingTime: time, createdAt: now, updatedAt: now }, inventory: { profileId, availableEquipmentIds: equipment, updatedAt: now }, safety: { acknowledgedAt: now, version: 1, understandsEmergencyStop: emergency, understandsNotMedicalAdvice: medical }, workoutSettings: { preferredDurationMinutes: duration, voiceEnabled: false, announceRestCountdown: false }, appSettings: { theme: 'dark', reducedMotion: false, schemaVersion: APP_SCHEMA_VERSION }, plans: [] })
  }
  const canContinue = step === 0 ? name.trim().length > 0 : step === 2 ? days.length > 0 : step === 6 ? medical && emergency : true
  return <main className="onboarding"><header className="onboard-top"><div className="wordmark"><span>F</span>FORGE</div><span className="onboard-count">{step + 1} / 8</span></header><div className="onboard-progress"><i style={{ width: `${((step + 1) / 8) * 100}%` }} /></div><section className="onboard-content">
    {step === 0 && <><p className="eyebrow">WELCOME TO FORGE</p><h1>Let’s make the gym feel simpler.</h1><p>First, what should we call you?</p><label className="name-field"><span>Your first name</span><input autoFocus value={name} onChange={(event) => setName(event.target.value)} placeholder="Your name" maxLength={32} /></label></>}
    {step === 1 && <><p className="eyebrow">YOUR DIRECTION</p><h1>What matters most right now?</h1><p>Your plan will be shaped around this—not the other way around.</p><div className="choice-list">{goals.map((item) => <button className={goal === item.id ? 'choice selected' : 'choice'} key={item.id} onClick={() => setGoal(item.id)}><span><strong>{item.title}</strong><small>{item.text}</small></span><b>{goal === item.id ? '✓' : ''}</b></button>)}</div></>}
    {step === 2 && <><p className="eyebrow">YOUR WEEK</p><h1>Which days work for you?</h1><p>Select the days you can usually make time for. You can change them anytime.</p><div className="day-picker">{dayLabels.map((label, index) => <button key={label} className={days.includes(index) ? 'selected' : ''} onClick={() => toggleDay(index)}>{label}</button>)}</div><p className="selection-note">{days.length} {days.length === 1 ? 'day' : 'days'} selected</p></>}
    {step === 3 && <><p className="eyebrow">YOUR PACE</p><h1>How long feels realistic?</h1><p>Forge will eventually adapt a plan without cutting its most important work.</p><div className="duration-picker">{([30, 45, 60] as const).map((minutes) => <button key={minutes} className={duration === minutes ? 'selected' : ''} onClick={() => setDuration(minutes)}><strong>{minutes}</strong><span>minutes</span></button>)}</div></>}
    {step === 4 && <><p className="eyebrow">YOUR WINDOW</p><h1>When do you usually train?</h1><p>This is a preference only. Forge won’t require calendar access.</p><label className="name-field"><span>Preferred start time</span><input type="time" value={time} onChange={(event) => setTime(event.target.value)} /></label></>}
    {step === 5 && <><p className="eyebrow">YOUR GYM</p><h1>What equipment can you use?</h1><p>Not sure? That’s completely fine—pick what you recognize. You can revise this later.</p><div className="equipment-picker">{equipmentCatalog.map((item) => <button className={equipment.includes(item.id) ? 'equipment-choice selected' : 'equipment-choice'} key={item.id} onClick={() => toggleEquipment(item.id)}><span className="equipment-mark">{item.category === 'free_weight' ? '⌁' : '◫'}</span><span><strong>{item.name}</strong><small>{item.plainDescription}</small></span><b>{equipment.includes(item.id) ? '✓' : ''}</b></button>)}</div></>}
    {step === 6 && <><p className="eyebrow">YOUR EXPERIENCE</p><h1>Where are you starting from?</h1><p>We’ll keep guidance clear and avoid assumptions about what you can safely lift.</p><div className="choice-list">{(['beginner', 'intermediate', 'advanced'] as const).map((level) => <button className={experience === level ? 'choice selected' : 'choice'} key={level} onClick={() => setExperience(level)}><span><strong>{level[0].toUpperCase() + level.slice(1)}</strong><small>{level === 'beginner' ? 'I want step-by-step guidance.' : 'I have experience training consistently.'}</small></span><b>{experience === level ? '✓' : ''}</b></button>)}</div></>}
    {step === 7 && <><p className="eyebrow">SAFETY FIRST</p><h1>Your well-being leads.</h1><p>Forge provides general fitness guidance, not medical advice or medical clearance.</p><div className="safety-card"><strong>Stop exercising and seek appropriate medical care if you have chest pain or pressure, fainting or near-fainting, severe or unusual shortness of breath, severe dizziness, concerning palpitations, or sudden neurological symptoms.</strong></div><label className="check-row"><input type="checkbox" checked={medical} onChange={(event) => setMedical(event.target.checked)} /><span>I understand Forge is not a substitute for medical advice or clearance.</span></label><label className="check-row"><input type="checkbox" checked={emergency} onChange={(event) => setEmergency(event.target.checked)} /><span>I understand that serious symptoms mean I should stop exercising and seek care.</span></label></>}
  </section><footer className="onboard-footer">{step > 0 ? <button className="back-button" onClick={previous}>Back</button> : <span />}{step === 7 ? <button className="button primary" disabled={!canContinue} onClick={finish}>Create my profile</button> : <button className="button primary" disabled={!canContinue} onClick={next}>Continue</button>}</footer></main>
}
