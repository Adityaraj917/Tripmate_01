import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapPin, Calendar, Users, IndianRupee, Trash2, ArrowLeft } from 'lucide-react'
import Avatar from '../components/ui/Avatar'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'

const DEMO_GROUPS_KEY = 'tripmate_groups'

export default function GroupDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [group, setGroup] = useState(null)

  useEffect(() => {
    const groups = JSON.parse(localStorage.getItem(DEMO_GROUPS_KEY) || '[]')
    const found = groups.find(g => g.id === id)
    setGroup(found)
  }, [id])

  const handleDeleteGroup = () => {
    if (!confirm('Delete this group?')) return
    const groups = JSON.parse(localStorage.getItem(DEMO_GROUPS_KEY) || '[]')
    const updated = groups.filter(g => g.id !== id)
    localStorage.setItem(DEMO_GROUPS_KEY, JSON.stringify(updated))
    navigate('/groups')
  }

  if (!group) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-text mb-4">Group not found</p>
          <Button onClick={() => navigate('/groups')} variant="primary">
            Back to Groups
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="page-fade">
      {/* Header */}
      <div className="gradient-header-tall px-5 pt-12 pb-8 rounded-b-3xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/3" />
        
        <button 
          onClick={() => navigate('/groups')}
          className="touch-target mb-3 -ml-2 text-white/90 hover:text-white"
        >
          <ArrowLeft size={24} />
        </button>

        <h1 className="text-2xl font-poppins font-bold text-white">{group.name}</h1>
        
        {group.destination && (
          <div className="flex items-center gap-1.5 mt-2">
            <MapPin size={14} className="text-white/70" />
            <span className="text-white/70 text-sm">{group.destination}</span>
          </div>
        )}

        <div className="flex items-center gap-4 mt-3 text-white/60 text-xs">
          {group.startDate && (
            <span className="flex items-center gap-1">
              <Calendar size={12} /> {group.startDate} → {group.endDate || '?'}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users size={12} /> {group.members?.length || 0} members
          </span>
        </div>
      </div>

      {/* Members */}
      <div className="px-5 mt-6 mb-6">
        <h2 className="text-lg font-poppins font-semibold text-light-text mb-4">Members</h2>
        <div className="space-y-2">
          {(group.members || []).map((member, idx) => (
            <Card key={member.id || idx} hover={false} className="flex items-center gap-3">
              <Avatar name={member.name} size="md" />
              <div className="flex-1 min-w-0">
                <p className="text-light-text font-medium text-sm">{member.name}</p>
                <p className="text-muted-text text-xs truncate">
                  {member.mobile || member.email || 'No contact info'}
                </p>
              </div>
              {idx === 0 && (
                <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full font-medium">
                  Admin
                </span>
              )}
            </Card>
          ))}
        </div>
      </div>

      {/* Trip Plan Link */}
      <div className="px-5 mb-6">
        <Card onClick={() => navigate('/trip-planner')} className="text-center">
          <p className="text-primary font-semibold text-sm">📋 Create Trip Plan</p>
          <p className="text-muted-text text-xs mt-1">Plan activities for this group</p>
        </Card>
      </div>

      {/* Expense Summary */}
      <div className="px-5 mb-6">
        <Card onClick={() => navigate('/expense-calculator')} className="text-center">
          <p className="text-warning font-semibold text-sm flex items-center justify-center gap-1">
            <IndianRupee size={14} /> Shared Expenses
          </p>
          <p className="text-muted-text text-xs mt-1">Track & split costs with the group</p>
        </Card>
      </div>

      {/* Delete */}
      <div className="px-5 mb-8">
        <Button
          onClick={handleDeleteGroup}
          variant="danger"
          fullWidth
          icon={Trash2}
        >
          Delete Group
        </Button>
      </div>
    </div>
  )
}
