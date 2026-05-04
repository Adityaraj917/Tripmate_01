import { useState } from 'react'
import { Plus, IndianRupee, MapPin, Calendar, Trash2, PieChart } from 'lucide-react'
import { expenseCategories } from '../data/destinations'
import { getDestinationImage } from '../lib/unsplash'
import GradientHeader from '../components/layout/GradientHeader'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import Modal from '../components/ui/Modal'
import ExpensePieChart from '../components/charts/ExpensePieChart'

const DEMO_EXPENSES_KEY = 'tripmate_expenses'

function getStoredExpenses() {
  try {
    return JSON.parse(localStorage.getItem(DEMO_EXPENSES_KEY) || '[]')
  } catch { return [] }
}

export default function ExpenseCalcPage() {
  const [showForm, setShowForm] = useState(false)
  const [expenses, setExpenses] = useState(getStoredExpenses())
  const [selectedExpense, setSelectedExpense] = useState(null)

  // Form state
  const [tripName, setTripName] = useState('')
  const [totalBudget, setTotalBudget] = useState('')
  const [numPeople, setNumPeople] = useState(1)
  const [items, setItems] = useState([])
  const [newItemName, setNewItemName] = useState('')
  const [newItemAmount, setNewItemAmount] = useState('')
  const [newItemCategory, setNewItemCategory] = useState('food')

  const addItem = () => {
    if (!newItemName.trim() || !newItemAmount) return
    setItems(prev => [...prev, {
      id: `item-${Date.now()}`,
      name: newItemName.trim(),
      amount: Number(newItemAmount),
      category: newItemCategory,
    }])
    setNewItemName('')
    setNewItemAmount('')
  }

  const removeItem = (id) => {
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const totalSpent = items.reduce((sum, item) => sum + item.amount, 0)
  const remaining = (Number(totalBudget) || 0) - totalSpent
  const perPerson = numPeople > 0 ? Math.round(totalSpent / numPeople) : 0

  const handleSaveExpense = () => {
    const expense = {
      id: `exp-${Date.now()}`,
      tripName: tripName.trim() || 'Unnamed Trip',
      totalBudget: Number(totalBudget) || 0,
      totalSpent,
      numPeople,
      perPerson,
      items,
      createdAt: new Date().toISOString(),
    }

    const updated = [expense, ...expenses]
    setExpenses(updated)
    localStorage.setItem(DEMO_EXPENSES_KEY, JSON.stringify(updated))

    // Reset
    setTripName('')
    setTotalBudget('')
    setNumPeople(1)
    setItems([])
    setShowForm(false)
  }

  return (
    <div className="page-fade">
      {/* Header */}
      <GradientHeader
        subtitle="Track Expense"
        title="Calculate Expenses Easily!"
        showBack
      />

      {/* Action Cards */}
      <div className="px-5 desktop:px-0 -mt-5 relative z-20 mb-6 desktop:grid desktop:grid-cols-2 desktop:gap-4 space-y-3 desktop:space-y-0">
        <Card onClick={() => setShowForm(true)} className="flex items-center gap-3 animate-slide-up group">
          <div className="w-12 h-12 desktop:w-14 desktop:h-14 rounded-xl bg-gradient-to-br from-primary to-primary-light flex items-center justify-center
                          transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            <Plus size={24} className="text-white" />
          </div>
          <div>
            <h3 className="text-light-text font-poppins font-semibold text-sm desktop:text-base">New Trip Expense</h3>
            <p className="text-muted-text text-xs">Add expenses and split costs</p>
          </div>
        </Card>

        <Card className="flex items-center gap-3 animate-slide-up stagger-2 group">
          <div className="w-12 h-12 desktop:w-14 desktop:h-14 rounded-xl bg-gradient-to-br from-warning to-yellow-400 flex items-center justify-center
                          transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
            <IndianRupee size={24} className="text-dark-bg" />
          </div>
          <div>
            <h3 className="text-light-text font-poppins font-semibold text-sm desktop:text-base">Bookmarked Trips</h3>
            <p className="text-muted-text text-xs">{expenses.length} saved expense records</p>
          </div>
        </Card>
      </div>

      {/* Expense History */}
      <div className="px-5 desktop:px-0 mb-8">
        <h2 className="text-lg desktop:text-xl font-poppins font-semibold text-light-text mb-4 flex items-center gap-2 animate-reveal-up">
          <PieChart size={18} className="text-secondary" />
          Expense History
        </h2>

        {expenses.length === 0 ? (
          <Card hover={false} className="text-center py-8">
            <IndianRupee size={32} className="text-muted-text mx-auto mb-3 animate-float" />
            <p className="text-muted-text text-sm">No expenses recorded yet</p>
            <p className="text-muted-text text-xs mt-1">Create your first expense tracker above</p>
          </Card>
        ) : (
          <div className="space-y-3 desktop:grid desktop:grid-cols-2 desktop:space-y-0 desktop:gap-4">
            {expenses.map((exp, idx) => (
              <Card key={exp.id} onClick={() => setSelectedExpense(exp)} className="animate-stagger-fade group" style={{ animationDelay: `${idx * 0.06}s` }}>
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 desktop:w-16 desktop:h-16 rounded-xl overflow-hidden flex-shrink-0">
                    <img
                      src={getDestinationImage(exp.tripName)}
                      alt={exp.tripName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-light-text font-poppins font-semibold text-sm desktop:text-base truncate">
                      {exp.tripName}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Calendar size={10} className="text-muted-text" />
                      <span className="text-muted-text text-xs">
                        {new Date(exp.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-warning text-sm font-semibold">
                      ₹{exp.totalSpent.toLocaleString()}
                    </p>
                    <p className="text-muted-text text-[10px]">
                      ₹{exp.perPerson}/person
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* New Expense Form Modal */}
      <Modal
        isOpen={showForm}
        onClose={() => setShowForm(false)}
        title="New Trip Expense"
      >
        <div className="space-y-4">
          <Input
            label="Trip Name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            placeholder="e.g., Goa Trip 2026"
            required
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Total Budget (₹)"
              type="number"
              value={totalBudget}
              onChange={(e) => setTotalBudget(e.target.value)}
              placeholder="25000"
            />
            <Input
              label="People"
              type="number"
              value={numPeople}
              onChange={(e) => setNumPeople(parseInt(e.target.value) || 1)}
              min="1"
            />
          </div>

          {/* Expense Items */}
          <div>
            <label className="text-sm font-medium text-muted-text font-inter block mb-2">
              Expense Items
            </label>

            {items.length > 0 && (
              <div className="space-y-2 mb-3">
                {items.map(item => {
                  const cat = expenseCategories.find(c => c.id === item.category)
                  return (
                    <div key={item.id} className="flex items-center gap-2 bg-card-bg rounded-xl px-3 py-2 animate-scale-in">
                      <span className="text-base">{cat?.icon || '📦'}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-light-text text-sm truncate">{item.name}</p>
                        <p className="text-xs text-muted-text">{cat?.name || item.category}</p>
                      </div>
                      <p className="text-warning text-sm font-medium">₹{item.amount.toLocaleString()}</p>
                      <button onClick={() => removeItem(item.id)} className="text-danger/60 hover:text-danger transition-colors">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  )
                })}
              </div>
            )}

            {/* Add item form */}
            <div className="bg-card-bg/50 rounded-xl p-3 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                <Input
                  placeholder="Item name"
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                />
                <Input
                  placeholder="Amount ₹"
                  type="number"
                  value={newItemAmount}
                  onChange={(e) => setNewItemAmount(e.target.value)}
                />
              </div>

              {/* Category selector */}
              <div className="flex gap-1.5 overflow-x-auto scrollbar-hide py-1">
                {expenseCategories.map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setNewItemCategory(cat.id)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[10px] font-medium whitespace-nowrap transition-all duration-300 flex-shrink-0
                      ${newItemCategory === cat.id
                        ? 'text-white shadow-md scale-105'
                        : 'bg-card-bg border border-white/10 text-muted-text'
                      }`}
                    style={newItemCategory === cat.id ? { backgroundColor: cat.color } : {}}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.name}</span>
                  </button>
                ))}
              </div>

              <Button onClick={addItem} variant="ghost" size="sm" fullWidth>
                + Add Item
              </Button>
            </div>
          </div>

          {/* Summary */}
          {items.length > 0 && (
            <div className="space-y-3">
              {/* Pie Chart */}
              <ExpensePieChart items={items} />

              {/* Summary stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-card-bg rounded-xl p-3 text-center animate-scale-in stagger-1">
                  <p className="text-warning text-lg font-bold">₹{totalSpent.toLocaleString()}</p>
                  <p className="text-muted-text text-[10px]">Total Spent</p>
                </div>
                <div className="bg-card-bg rounded-xl p-3 text-center animate-scale-in stagger-2">
                  <p className={`text-lg font-bold ${remaining >= 0 ? 'text-accent' : 'text-danger'}`}>
                    ₹{Math.abs(remaining).toLocaleString()}
                  </p>
                  <p className="text-muted-text text-[10px]">{remaining >= 0 ? 'Remaining' : 'Over Budget'}</p>
                </div>
                <div className="bg-card-bg rounded-xl p-3 text-center animate-scale-in stagger-3">
                  <p className="text-secondary text-lg font-bold">₹{perPerson.toLocaleString()}</p>
                  <p className="text-muted-text text-[10px]">Per Person</p>
                </div>
              </div>
            </div>
          )}

          <Button
            onClick={handleSaveExpense}
            variant="primary"
            fullWidth
            size="lg"
            disabled={items.length === 0}
          >
            Save Expense
          </Button>
        </div>
      </Modal>

      {/* Expense Detail Modal */}
      <Modal
        isOpen={!!selectedExpense}
        onClose={() => setSelectedExpense(null)}
        title={selectedExpense?.tripName || 'Expense Details'}
      >
        {selectedExpense && (
          <div className="space-y-4">
            <ExpensePieChart items={selectedExpense.items} />

            <div className="grid grid-cols-3 gap-2">
              <div className="bg-card-bg rounded-xl p-3 text-center">
                <p className="text-warning text-base font-bold">₹{selectedExpense.totalSpent.toLocaleString()}</p>
                <p className="text-muted-text text-[10px]">Total</p>
              </div>
              <div className="bg-card-bg rounded-xl p-3 text-center">
                <p className="text-accent text-base font-bold">₹{(selectedExpense.totalBudget - selectedExpense.totalSpent).toLocaleString()}</p>
                <p className="text-muted-text text-[10px]">Remaining</p>
              </div>
              <div className="bg-card-bg rounded-xl p-3 text-center">
                <p className="text-secondary text-base font-bold">₹{selectedExpense.perPerson.toLocaleString()}</p>
                <p className="text-muted-text text-[10px]">Per Person</p>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-poppins font-semibold text-light-text">Items</h3>
              {selectedExpense.items.map(item => {
                const cat = expenseCategories.find(c => c.id === item.category)
                return (
                  <div key={item.id} className="flex items-center gap-2 bg-card-bg rounded-xl px-3 py-2">
                    <span className="text-base">{cat?.icon || '📦'}</span>
                    <span className="text-light-text text-sm flex-1">{item.name}</span>
                    <span className="text-warning text-sm font-medium">₹{item.amount.toLocaleString()}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
