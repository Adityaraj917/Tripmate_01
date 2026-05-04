import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Users, MapPin, Calendar, Search, MessageCircle, ExternalLink, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import GradientHeader from '../components/layout/GradientHeader'
import SearchBar from '../components/ui/SearchBar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Modal from '../components/ui/Modal'
import Input from '../components/ui/Input'
import Avatar from '../components/ui/Avatar'
import EmptyState from '../components/ui/EmptyState'

const DEMO_GROUPS_KEY = 'tripmate_groups'

function getStoredGroups() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_GROUPS_KEY) || '[]')
  } catch { return [] }
}

// Build WhatsApp invitation message
function buildWhatsAppMessage(groupName, destination, startDate, endDate) {
  let msg = `🧳 *TripMate Group Invitation*\n\n`
  msg += `Hey! You've been invited to join the trip group *"${groupName}"* on TripMate!\n\n`
  if (destination) msg += `📍 *Destination:* ${destination}\n`
  if (startDate) msg += `📅 *Start:* ${startDate}\n`
  if (endDate) msg += `📅 *End:* ${endDate}\n`
  msg += `\n🌍 Let's plan this trip together! Download TripMate and join the group.\n`
  msg += `\n_Sent via TripMate - Your Journey Starts Here_`
  return encodeURIComponent(msg)
}

// Send WhatsApp invitation to a single number
function sendWhatsAppInvite(mobile, message) {
  // Clean the number: remove spaces, dashes, and add country code if missing
  let cleanNumber = mobile.replace(/[\s\-\(\)]/g, '')
  // If no country code, assume India (+91)
  if (!cleanNumber.startsWith('+') && !cleanNumber.startsWith('91') && cleanNumber.length === 10) {
    cleanNumber = '91' + cleanNumber
  }
  if (cleanNumber.startsWith('+')) {
    cleanNumber = cleanNumber.slice(1)
  }
  const url = `https://wa.me/${cleanNumber}?text=${message}`
  window.open(url, '_blank')
}

export default function GroupsPage() {
  const { user, profile } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('my')
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [groups, setGroups] = useState(getStoredGroups())
  const [searchQuery, setSearchQuery] = useState('')
  const [showInviteSent, setShowInviteSent] = useState(false)
  const [inviteCount, setInviteCount] = useState(0)

  // Create group form state
  const [groupName, setGroupName] = useState('')
  const [destination, setDestination] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [groupType, setGroupType] = useState('on-app')
  const [members, setMembers] = useState([])
  const [newMemberName, setNewMemberName] = useState('')
  const [newMemberMobile, setNewMemberMobile] = useState('')
  const [newMemberEmail, setNewMemberEmail] = useState('')

  const tabs = [
    { id: 'my', label: 'My Groups' },
    { id: 'joined', label: 'Joined Groups' },
    { id: 'archived', label: 'Archived' },
  ]

  const addMember = () => {
    if (!newMemberName.trim()) return
    setMembers(prev => [...prev, {
      id: `member-${Date.now()}`,
      name: newMemberName.trim(),
      mobile: newMemberMobile.trim(),
      email: newMemberEmail.trim(),
    }])
    setNewMemberName('')
    setNewMemberMobile('')
    setNewMemberEmail('')
  }

  const removeMember = (id) => {
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  const handleCreateGroup = () => {
    if (!groupName.trim()) return

    const newGroup = {
      id: `group-${Date.now()}`,
      name: groupName.trim(),
      destination: destination.trim(),
      startDate,
      endDate,
      groupType,
      members: [
        { id: user?.id, name: profile?.name || 'You', email: profile?.email || '', mobile: '' },
        ...members
      ],
      createdBy: user?.id,
      createdAt: new Date().toISOString(),
    }

    const updated = [newGroup, ...groups]
    setGroups(updated)
    localStorage.setItem(DEMO_GROUPS_KEY, JSON.stringify(updated))

    // Send WhatsApp invitations if group type is WhatsApp
    if (groupType === 'whatsapp') {
      const whatsappMessage = buildWhatsAppMessage(groupName.trim(), destination.trim(), startDate, endDate)
      const membersWithMobile = members.filter(m => m.mobile)

      if (membersWithMobile.length > 0) {
        // Send invitations to all members with mobile numbers
        let sentCount = 0
        membersWithMobile.forEach((member, idx) => {
          // Stagger opening tabs slightly to avoid browser blocking
          setTimeout(() => {
            sendWhatsAppInvite(member.mobile, whatsappMessage)
            sentCount++
          }, idx * 800)
        })

        setInviteCount(membersWithMobile.length)
        setShowInviteSent(true)
        setTimeout(() => setShowInviteSent(false), 4000)
      }
    }

    // Reset form
    setGroupName('')
    setDestination('')
    setStartDate('')
    setEndDate('')
    setGroupType('on-app')
    setMembers([])
    setShowCreateModal(false)
  }

  const filteredGroups = groups.filter(g =>
    g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    g.destination.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="page-fade">
      {/* Header */}
      <GradientHeader
        subtitle="Ek Se Bhale Do...."
        title="Stay United at One Place!"
      />

      {/* WhatsApp invite sent toast */}
      {showInviteSent && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[99999] animate-slide-up">
          <div className="flex items-center gap-3 bg-green-600 text-white px-5 py-3 rounded-2xl shadow-xl shadow-green-600/30">
            <MessageCircle size={20} />
            <span className="text-sm font-medium">
              WhatsApp invitations sent to {inviteCount} member{inviteCount > 1 ? 's' : ''}! 🎉
            </span>
          </div>
        </div>
      )}

      {/* Search */}
      <div className="px-5 desktop:px-0 -mt-5 relative z-20 mb-4 animate-slide-up">
        <SearchBar
          placeholder="Search for previous groups....."
          showAutocomplete={false}
          onSearch={setSearchQuery}
        />
      </div>

      {/* Tabs */}
      <div className="px-5 desktop:px-0 mb-6 animate-slide-up stagger-2">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                ${activeTab === tab.id
                  ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-105'
                  : 'bg-card-bg text-muted-text border border-white/10 hover:text-light-text hover:border-primary/30'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Groups List */}
      <div className="px-5 desktop:px-0 mb-24 desktop:mb-8">
        {filteredGroups.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No groups yet"
            description="Create a trip group and invite your friends to plan together"
            actionLabel="Create Group"
            onAction={() => setShowCreateModal(true)}
          />
        ) : (
          <div className="space-y-3 desktop:grid desktop:grid-cols-2 xl:grid-cols-3 desktop:space-y-0 desktop:gap-4">
            {filteredGroups.map((group, idx) => (
              <Card
                key={group.id}
                onClick={() => navigate(`/groups/${group.id}`)}
                className="animate-stagger-fade"
                style={{ animationDelay: `${idx * 0.06}s` }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-light-text font-poppins font-semibold text-sm desktop:text-base truncate flex items-center gap-2">
                      {group.name}
                      {group.groupType === 'whatsapp' && (
                        <span className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded-full font-medium">WhatsApp</span>
                      )}
                    </h3>
                    {group.destination && (
                      <div className="flex items-center gap-1 mt-1">
                        <MapPin size={12} className="text-primary flex-shrink-0" />
                        <span className="text-muted-text text-xs truncate">{group.destination}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-muted-text text-xs flex items-center gap-1">
                        <Users size={12} /> {group.members?.length || 1} members
                      </span>
                      {group.startDate && (
                        <span className="text-muted-text text-xs flex items-center gap-1">
                          <Calendar size={12} /> {group.startDate}
                        </span>
                      )}
                    </div>
                  </div>
                  {/* Member avatars */}
                  <div className="flex -space-x-2 flex-shrink-0">
                    {(group.members || []).slice(0, 3).map((m, i) => (
                      <Avatar key={m.id || i} name={m.name} size="sm" className="ring-2 ring-dark-bg" />
                    ))}
                    {(group.members?.length || 0) > 3 && (
                      <div className="w-8 h-8 rounded-full bg-card-bg-light flex items-center justify-center text-xs text-muted-text ring-2 ring-dark-bg">
                        +{group.members.length - 3}
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Floating Create Button */}
      <button
        onClick={() => setShowCreateModal(true)}
        className="fixed bottom-24 desktop:bottom-8 right-6 desktop:right-10 z-50 w-14 h-14 gradient-header rounded-full 
                   flex items-center justify-center shadow-xl shadow-primary/40
                   active:scale-90 transition-all duration-300 hover:scale-110
                   cta-breathe"
        id="create-group-fab"
      >
        <Plus size={28} className="text-white" />
      </button>

      {/* Create Group Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Create Trip Group"
      >
        <div className="space-y-4">
          <Input
            label="Group Name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            placeholder="e.g., Goa Gang 2026"
            required
          />

          <Input
            label="Trip Destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            placeholder="Search destination..."
            icon={MapPin}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <Input
              label="End Date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          {/* Group Type */}
          <div>
            <label className="text-sm font-medium text-muted-text font-inter block mb-2">
              Group Type
            </label>
            <div className="flex gap-2">
              {[
                { id: 'on-app', label: '📱 On-App' },
                { id: 'whatsapp', label: '💬 WhatsApp' },
                { id: 'telegram', label: '✈️ Telegram' },
              ].map(type => (
                <button
                  key={type.id}
                  onClick={() => setGroupType(type.id)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium transition-all duration-300
                    ${groupType === type.id
                      ? 'bg-primary text-white scale-105'
                      : 'bg-card-bg border border-white/10 text-muted-text hover:border-primary/30'
                    }`}
                >
                  {type.label}
                </button>
              ))}
            </div>

            {/* WhatsApp hint */}
            {groupType === 'whatsapp' && (
              <div className="mt-2 p-2.5 bg-green-500/10 border border-green-500/20 rounded-xl animate-scale-in">
                <p className="text-green-400 text-xs flex items-center gap-1.5">
                  <MessageCircle size={12} />
                  WhatsApp invitations will be sent to members with phone numbers when you create the group
                </p>
              </div>
            )}
          </div>

          {/* Members */}
          <div>
            <label className="text-sm font-medium text-muted-text font-inter block mb-2">
              Add Members
            </label>

            {/* Existing members */}
            {members.length > 0 && (
              <div className="space-y-2 mb-3">
                {members.map(m => (
                  <div key={m.id} className="flex items-center gap-2 bg-card-bg rounded-xl px-3 py-2 animate-scale-in">
                    <Avatar name={m.name} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-light-text text-sm truncate">{m.name}</p>
                      <p className="text-muted-text text-xs truncate flex items-center gap-1">
                        {m.mobile && (
                          <>
                            <span>📱 {m.mobile}</span>
                            {groupType === 'whatsapp' && (
                              <span className="text-green-400 text-[10px]">• invite ready</span>
                            )}
                          </>
                        )}
                        {!m.mobile && m.email && <span>✉️ {m.email}</span>}
                        {!m.mobile && !m.email && <span className="text-muted-text/50">No contact</span>}
                      </p>
                    </div>
                    <button
                      onClick={() => removeMember(m.id)}
                      className="text-danger text-xs hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add member form */}
            <div className="space-y-2 bg-card-bg/50 rounded-xl p-3">
              <Input
                placeholder="Name *"
                value={newMemberName}
                onChange={(e) => setNewMemberName(e.target.value)}
              />
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder={groupType === 'whatsapp' ? 'Mobile * (for invite)' : 'Mobile'}
                  value={newMemberMobile}
                  onChange={(e) => setNewMemberMobile(e.target.value)}
                />
                <Input
                  placeholder="Email"
                  type="email"
                  value={newMemberEmail}
                  onChange={(e) => setNewMemberEmail(e.target.value)}
                />
              </div>

              {/* WhatsApp number hint */}
              {groupType === 'whatsapp' && (
                <p className="text-muted-text text-[10px] px-1">
                  💡 Add mobile with country code (e.g., +91 9876543210) for WhatsApp invitation
                </p>
              )}

              <Button onClick={addMember} variant="ghost" size="sm" fullWidth>
                + Add Member
              </Button>
            </div>
          </div>

          <Button
            onClick={handleCreateGroup}
            variant="primary"
            fullWidth
            size="lg"
            className="mt-4"
            disabled={!groupName.trim()}
          >
            {groupType === 'whatsapp' ? (
              <span className="flex items-center gap-2">
                <MessageCircle size={18} />
                Create & Send WhatsApp Invites
              </span>
            ) : (
              'Create Group'
            )}
          </Button>
        </div>
      </Modal>
    </div>
  )
}
