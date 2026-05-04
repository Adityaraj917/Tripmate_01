import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { MapPin, Globe, Users, LogOut, Bell, DollarSign, Moon, ChevronRight, Edit3, Shield, Award } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'

export default function ProfilePage() {
  const { user, profile, signOut, updateProfile, isDemo } = useAuth()
  const navigate = useNavigate()
  const [showEditModal, setShowEditModal] = useState(false)
  const [editName, setEditName] = useState(profile?.name || '')
  const [saving, setSaving] = useState(false)
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)

  // Get stats from localStorage in demo mode
  const trips = JSON.parse(localStorage.getItem('tripmate_trips') || '[]')
  const groups = JSON.parse(localStorage.getItem('tripmate_groups') || '[]')
  const favourites = JSON.parse(localStorage.getItem('tripmate_favourites') || '[]')

  const stats = [
    { label: 'Trips Planned', value: trips.length, icon: MapPin, color: 'text-primary' },
    { label: 'Places Saved', value: favourites.length, icon: Globe, color: 'text-accent' },
    { label: 'Groups Joined', value: groups.length, icon: Users, color: 'text-secondary' },
  ]

  const handleSaveProfile = async () => {
    setSaving(true)
    await updateProfile({ name: editName.trim() })
    setSaving(false)
    setShowEditModal(false)
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const settingsItems = [
    {
      icon: Bell,
      label: 'Notifications',
      right: (
        <button
          onClick={() => setNotificationsEnabled(!notificationsEnabled)}
          className={`w-12 h-7 rounded-full transition-all duration-300 flex items-center px-1
            ${notificationsEnabled ? 'bg-primary' : 'bg-card-bg-light'}`}
        >
          <div className={`w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-md
            ${notificationsEnabled ? 'translate-x-5' : 'translate-x-0'}`} />
        </button>
      )
    },
    {
      icon: DollarSign,
      label: 'Currency',
      right: <span className="text-muted-text text-sm">₹ INR</span>
    },
    {
      icon: Moon,
      label: 'Dark Mode',
      right: (
        <div className="w-12 h-7 rounded-full bg-primary flex items-center px-1">
          <div className="w-5 h-5 bg-white rounded-full translate-x-5 shadow-md" />
        </div>
      )
    },
  ]

  return (
    <div className="page-fade">
      {/* Profile Header */}
      <div className="pt-14 desktop:pt-10 pb-8 px-5 desktop:px-0 text-center relative">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/5 rounded-full blur-3xl animate-float-slow" />
        <div className="hidden desktop:block absolute top-10 right-[20%] w-32 h-32 bg-secondary/5 rounded-full blur-3xl animate-float-reverse" />

        <div className="relative z-10 animate-fade-in">
          <div className="relative inline-block mb-4">
            <div className="animate-scale-in">
              <Avatar
                src={profile?.avatar_url}
                name={profile?.name || 'Traveller'}
                size="xl"
              />
            </div>
            <button
              onClick={() => setShowEditModal(true)}
              className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center
                        shadow-lg shadow-primary/30 border-2 border-dark-bg
                        transition-all duration-300 hover:scale-110 hover:shadow-primary/50"
            >
              <Edit3 size={14} className="text-white" />
            </button>
          </div>

          <h1 className="text-xl desktop:text-2xl font-poppins font-bold text-light-text">
            {profile?.name || 'Traveller'}
          </h1>
          <p className="text-muted-text text-sm mt-1">
            {profile?.email || user?.email || 'guest@tripmate.app'}
          </p>

          {isDemo && (
            <span className="inline-block mt-2 px-3 py-1 bg-warning/10 text-warning text-xs rounded-full font-medium animate-breathe">
              🧳 Guest Mode
            </span>
          )}

          {/* Traveler badge */}
          <div className="flex items-center justify-center gap-2 mt-3 animate-slide-up stagger-2">
            <div className="flex items-center gap-1 px-3 py-1 bg-accent/10 rounded-full">
              <Award size={12} className="text-accent" />
              <span className="text-accent text-xs font-medium">Explorer</span>
            </div>
            <div className="flex items-center gap-1 px-3 py-1 bg-secondary/10 rounded-full">
              <Shield size={12} className="text-secondary" />
              <span className="text-secondary text-xs font-medium">Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="px-5 desktop:px-0 mb-8">
        <div className="grid grid-cols-3 gap-3 desktop:gap-4">
          {stats.map((stat, idx) => {
            const Icon = stat.icon
            return (
              <Card key={stat.label} hover={false} className={`text-center py-4 desktop:py-6 animate-stagger-fade`} style={{ animationDelay: `${idx * 0.1}s` }}>
                <Icon size={20} className={`${stat.color} mx-auto mb-2`} />
                <p className="text-2xl desktop:text-3xl font-poppins font-bold text-light-text">{stat.value}</p>
                <p className="text-muted-text text-[10px] desktop:text-xs mt-1">{stat.label}</p>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Settings */}
      <div className="px-5 desktop:px-0 mb-6">
        <h2 className="text-lg desktop:text-xl font-poppins font-semibold text-light-text mb-4 animate-reveal-up">Settings</h2>
        <div className="space-y-2 desktop:max-w-2xl">
          {settingsItems.map((item, idx) => {
            const Icon = item.icon
            return (
              <Card key={item.label} hover={false} className={`flex items-center gap-3 animate-stagger-fade`} style={{ animationDelay: `${idx * 0.08}s` }}>
                <div className="w-10 h-10 rounded-xl bg-card-bg-light flex items-center justify-center transition-colors duration-300 hover:bg-primary/10">
                  <Icon size={18} className="text-muted-text" />
                </div>
                <span className="flex-1 text-light-text text-sm font-medium">{item.label}</span>
                {item.right}
              </Card>
            )
          })}
        </div>
      </div>

      {/* Logout */}
      <div className="px-5 desktop:px-0 mb-8 desktop:max-w-2xl">
        <Button
          onClick={handleLogout}
          variant="danger"
          fullWidth
          icon={LogOut}
          className="animate-reveal-up stagger-6"
        >
          Logout
        </Button>
      </div>

      {/* Edit Profile Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Edit Profile"
      >
        <div className="space-y-4">
          <div className="flex justify-center mb-4">
            <Avatar
              src={profile?.avatar_url}
              name={profile?.name || 'T'}
              size="xl"
            />
          </div>
          <Input
            label="Display Name"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Your name"
            required
          />
          <Button
            onClick={handleSaveProfile}
            variant="primary"
            fullWidth
            loading={saving}
          >
            Save Changes
          </Button>
        </div>
      </Modal>
    </div>
  )
}
