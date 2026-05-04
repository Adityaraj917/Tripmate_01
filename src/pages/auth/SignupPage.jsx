import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Mail, Lock, User, Compass, Eye, EyeOff, Plane, MapPin, Globe } from 'lucide-react'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

export default function SignupPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      return
    }

    setLoading(true)

    try {
      const { error: authError } = await signUp(email, password, name)
      if (authError) {
        setError(authError.message || 'Signup failed. Please try again.')
      } else {
        navigate('/')
      }
    } catch (err) {
      setError('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-split">
      {/* Left side - Travel visual (desktop only) */}
      <div className="auth-visual hidden">
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-12 z-10">
          {/* Floating travel icons */}
          <div className="absolute top-[15%] left-[10%] text-5xl animate-float-slow opacity-30">🌍</div>
          <div className="absolute top-[25%] right-[15%] text-4xl animate-float-reverse opacity-25">✈️</div>
          <div className="absolute bottom-[30%] left-[15%] text-4xl animate-float opacity-25">🏝️</div>
          <div className="absolute bottom-[15%] right-[10%] text-5xl animate-float-slow opacity-30">🧭</div>
          <div className="absolute top-[50%] left-[5%] text-3xl animate-float-reverse opacity-20">🎈</div>
          <div className="absolute top-[60%] right-[5%] text-3xl animate-float opacity-20">⛵</div>

          {/* Particles */}
          {Array.from({ length: 6 }, (_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${15 + i * 15}%`,
                bottom: '0',
                '--duration': `${8 + i * 2}s`,
                '--delay': `${i * 1.5}s`,
                width: `${3 + (i % 3)}px`,
                height: `${3 + (i % 3)}px`,
                background: 'rgba(255,255,255,0.3)',
              }}
            />
          ))}

          <div className="animate-bounce-in">
            <div className="w-20 h-20 mx-auto mb-6 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center
                          shadow-2xl border border-white/20 animate-float">
              <Plane size={40} className="text-white -rotate-45" />
            </div>

            <h2 className="text-4xl font-poppins font-extrabold text-white mb-4 leading-tight">
              Join the<br/>
              <span className="text-yellow-200">Adventure</span>
            </h2>
            <p className="text-white/70 text-base font-inter max-w-sm">
              Create your account and start exploring the world with TripMate — your ultimate travel companion.
            </p>

            {/* Feature pills */}
            <div className="flex flex-wrap justify-center gap-3 mt-8">
              {[
                { icon: MapPin, label: 'Discover' },
                { icon: Globe, label: 'Connect' },
                { icon: Compass, label: 'Adventure' },
              ].map((item, i) => (
                <div key={item.label} className="flex items-center gap-2 bg-white/15 backdrop-blur-sm rounded-full px-4 py-2 animate-stagger-fade" style={{ animationDelay: `${0.8 + i * 0.15}s` }}>
                  <item.icon size={14} className="text-white" />
                  <span className="text-white text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mountain silhouette */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-20" fill="rgba(13,27,42,0.3)">
            <polygon points="0,120 0,80 150,40 300,70 450,20 600,50 750,10 900,40 1050,25 1200,60 1200,120" />
          </svg>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="auth-form min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-full h-1/2 gradient-header-tall opacity-20 blur-3xl desktop:opacity-10" />
        <div className="absolute -top-20 -left-20 w-60 h-60 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -right-20 w-60 h-60 bg-primary/10 rounded-full blur-3xl" />

        {/* Floating travel elements (mobile only) */}
        <div className="desktop:hidden absolute top-[10%] left-[8%] text-2xl animate-float-slow opacity-15">🌍</div>
        <div className="desktop:hidden absolute bottom-[20%] right-[8%] text-2xl animate-float-reverse opacity-15">✈️</div>

        <div className="w-full max-w-sm relative z-10 animate-fade-in">
          {/* Logo */}
          <div className="text-center mb-10 animate-bounce-in">
            <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-accent to-secondary rounded-2xl flex items-center justify-center shadow-lg shadow-accent/30 animate-float">
              <Compass size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-poppins font-bold text-light-text">
              Join TripMate
            </h1>
            <p className="text-muted-text text-sm mt-2">
              Create your account & start exploring
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 bg-danger/10 border border-danger/20 rounded-xl text-danger text-sm text-center animate-scale-in">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="animate-slide-up stagger-1">
              <Input
                label="Full Name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                icon={User}
                required
              />
            </div>

            <div className="animate-slide-up stagger-2">
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                icon={Mail}
                required
              />
            </div>

            <div className="relative animate-slide-up stagger-3">
              <Input
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 characters"
                icon={Lock}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-[38px] text-muted-text hover:text-light-text transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <div className="animate-slide-up stagger-4">
              <Button type="submit" variant="primary" fullWidth loading={loading} className="mt-6 cta-breathe">
                Create Account
              </Button>
            </div>
          </form>

          {/* Login Link */}
          <p className="text-center text-muted-text text-sm mt-8 animate-fade-in stagger-5">
            Already have an account?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-primary font-semibold hover:underline transition-all duration-300 hover:text-primary-light"
            >
              Login
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
